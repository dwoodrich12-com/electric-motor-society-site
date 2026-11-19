/**
 * Local webhook checks. Uses a generated test signing secret, never a live key.
 * Run: pnpm test:webhooks
 */
import express from 'express';
import type { AddressInfo } from 'node:net';
import assert from 'node:assert/strict';
import Stripe from 'stripe';

process.env.STRIPE_EVENT_LOG_PATH = '/tmp/ems-webhook-test-events.json';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_local_only';
delete process.env.STRIPE_SECRET_KEY;
delete process.env.MAILCHIMP_API_KEY;
delete process.env.MAILCHIMP_LIST_ID;
delete process.env.AGENTMAIL_API_KEY;
delete process.env.ADMIN_TOKEN;

const stripeModule = await import('../server/api/stripe.ts');
const formsModule = await import('../server/api/forms.ts');

const {
  default: stripeRouter,
  stripeWebhookHandler,
  setOutboundNoticeForTests,
  setStripeWriterForTests,
  resetStripeEventLogForTests,
} = stripeModule;

type MailArgs = [string, string, string, string[], Record<string, string> | undefined];
type EmailArgs = [string, string];

const calls: {
  mail: MailArgs[];
  email: EmailArgs[];
  subs: { id: string; metadata: Record<string, string> }[];
  customers: { id: string; name?: string; metadata: Record<string, string> }[];
  mailShouldThrow: boolean;
} = { mail: [], email: [], subs: [], customers: [], mailShouldThrow: false };

setOutboundNoticeForTests({
  async subscribeToMailchimp(email, firstName, lastName, tags, mergeFields) {
    if (calls.mailShouldThrow) throw new Error('mailchimp down');
    calls.mail.push([email, firstName, lastName, tags, mergeFields]);
    return { success: true };
  },
  async sendNotificationEmail(subject, body) {
    if (calls.mailShouldThrow) throw new Error('mail down');
    calls.email.push([subject, body]);
    return { success: true };
  },
});

setStripeWriterForTests({
  subscriptions: {
    async update(id, params) {
      calls.subs.push({ id, metadata: (params.metadata || {}) as Record<string, string> });
      return { id };
    },
  },
  customers: {
    async update(id, params) {
      calls.customers.push({
        id,
        name: params.name,
        metadata: (params.metadata || {}) as Record<string, string>,
      });
      return { id };
    },
  },
});

resetStripeEventLogForTests();

const app = express();
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  void stripeWebhookHandler(req, res);
});
app.use(express.json());
app.use('/api/stripe', stripeRouter);
app.use('/api/forms', formsModule.default);

const server = app.listen(0);
const port = (server.address() as AddressInfo).port;
const signer = new Stripe('sk_test_local_signature_only');

function sign(payload: string, secret = process.env.STRIPE_WEBHOOK_SECRET || '') {
  return signer.webhooks.generateTestHeaderString({ payload, secret });
}

async function post(path: string, body: string, headers: Record<string, string>) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method: 'POST',
    headers,
    body,
  });
  const text = await response.text();
  return { status: response.status, json: text ? JSON.parse(text) : {} };
}

async function postEvent(event: Record<string, unknown>, header?: string) {
  const payload = JSON.stringify(event);
  return post('/api/stripe/webhook', payload, {
    'Content-Type': 'application/json',
    'Stripe-Signature': header ?? sign(payload),
  });
}

function checkoutEvent(id: string, metadata: Record<string, string>, extra: Record<string, unknown> = {}) {
  return {
    id,
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: `cs_${id}`,
        object: 'checkout.session',
        mode: 'subscription',
        customer: `cus_${id}`,
        subscription: `sub_${id}`,
        customer_details: { email: 'ada@example.com', name: 'Ada Lovelace' },
        custom_fields: [
          { key: 'contact_name', text: { value: 'Ada Lovelace' } },
          { key: 'company', text: { value: 'Analytical Engines' } },
        ],
        metadata,
        ...extra,
      },
    },
  };
}

const failures: string[] = [];
function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    console.log(`ok  ${name}`);
  } else {
    failures.push(`${name}${detail ? `: ${detail}` : ''}`);
    console.error(`FAIL ${name}${detail ? `: ${detail}` : ''}`);
  }
}

const savedSecret = process.env.STRIPE_WEBHOOK_SECRET;
process.env.STRIPE_WEBHOOK_SECRET = '';
const missingSecret = await postEvent({ id: 'evt_no_secret', object: 'event', type: 'checkout.session.completed', data: { object: {} } });
check('unset webhook secret returns 400', missingSecret.status === 400, JSON.stringify(missingSecret.json));
process.env.STRIPE_WEBHOOK_SECRET = savedSecret;

const bad = await postEvent(checkoutEvent('evt_bad', { type: 'member', tier: 'monthly', amount: '25', interval: 'month' }), 't=1,v1=deadbeef');
check('bad signature returns 400', bad.status === 400, JSON.stringify(bad.json));

const member = await postEvent(checkoutEvent('evt_member', {
  type: 'member',
  tier: 'monthly',
  tierName: 'Monthly Member',
  amount: '25',
  interval: 'month',
}));
check('member checkout returns 200', member.status === 200 && member.json.received === true);
check('member tagged ems-member', calls.mail.some((call) => call[3].includes('ems-member') && !call[3].some((tag) => tag.startsWith('ems-sponsor-'))));
check('member email has name, email, company, tier, amount', calls.email.some(([, body]) =>
  body.includes('Ada Lovelace') && body.includes('ada@example.com') && body.includes('Analytical Engines') && body.includes('Monthly Member') && body.includes('$25') && body.includes('month')
));
check('member metadata written to subscription', calls.subs.some((item) => item.id === 'sub_evt_member' && item.metadata.company === 'Analytical Engines' && item.metadata.type === 'member'));

const mailCount = calls.mail.length;
const replay = await postEvent(checkoutEvent('evt_member', { type: 'member', tier: 'monthly', amount: '25', interval: 'month' }));
check('duplicate event is ignored', replay.status === 200 && replay.json.duplicate === true && calls.mail.length === mailCount);

const sponsor = await postEvent(checkoutEvent('evt_sponsor', {
  type: 'sponsor',
  tier: 'strategic',
  tierName: 'Strategic Sponsor',
  amount: '5000',
  interval: 'month',
  commitment_months: '12',
  commitment_start: '2026-11-19',
  commitment_end: '2027-11-19',
}));
check('sponsor checkout returns 200', sponsor.status === 200);
check('sponsor tags include ems-sponsor-strategic', calls.mail.some((call) => call[3].includes('ems-member') && call[3].includes('ems-sponsor-strategic')));
check('sponsor email records commitment end and monthly amount', calls.email.some(([, body]) =>
  body.includes('2027-11-19') && body.includes('$5,000') && body.includes('month') && body.includes('Strategic Sponsor')
));

const failed = await postEvent({
  id: 'evt_failed',
  object: 'event',
  type: 'invoice.payment_failed',
  data: {
    object: {
      id: 'in_failed',
      object: 'invoice',
      customer_email: 'pay@example.com',
      amount_due: 250000,
      currency: 'usd',
      parent: { subscription_details: { subscription: 'sub_supporting', metadata: { tier: 'supporting' } } },
    },
  },
});
check('payment_failed returns 200', failed.status === 200);
check('payment_failed email names the customer and amount', calls.email.some(([subject, body]) =>
  subject.includes('Payment failed') && body.includes('pay@example.com') && body.includes('2500.00') && body.includes('supporting')
));

const deleted = await postEvent({
  id: 'evt_deleted',
  object: 'event',
  type: 'customer.subscription.deleted',
  data: {
    object: {
      id: 'sub_deleted',
      object: 'subscription',
      status: 'canceled',
      cancel_at_period_end: false,
      customer: 'cus_deleted',
      metadata: {
        tier: 'strategic',
        tierName: 'Strategic Sponsor',
        company: 'Northwind Motors',
        contact_name: 'Jordan Lee',
        commitment_end: '2027-11-19',
      },
    },
  },
});
check('subscription.deleted returns 200', deleted.status === 200);
check('cancellation email includes company and commitment end', calls.email.some(([subject, body]) =>
  subject.includes('canceled') && body.includes('Jordan Lee') && body.includes('Northwind Motors') && body.includes('2027-11-19')
));

const emailsBeforeUpdate = calls.email.length;
const updated = await postEvent({
  id: 'evt_canceling',
  object: 'event',
  type: 'customer.subscription.updated',
  data: {
    object: {
      id: 'sub_canceling',
      object: 'subscription',
      status: 'active',
      cancel_at_period_end: true,
      customer: 'cus_canceling',
      metadata: { tier: 'supporting', tierName: 'Supporting Sponsor', commitment_end: '2027-11-19' },
    },
    previous_attributes: { cancel_at_period_end: false },
  },
});
check('subscription.updated cancellation notice returns 200', updated.status === 200 && calls.email.length === emailsBeforeUpdate + 1);

const quiet = await postEvent({
  id: 'evt_quiet',
  object: 'event',
  type: 'customer.subscription.updated',
  data: {
    object: {
      id: 'sub_quiet',
      object: 'subscription',
      status: 'active',
      cancel_at_period_end: false,
      customer: 'cus_quiet',
      metadata: { tier: 'monthly' },
    },
    previous_attributes: { metadata: { company: 'old' } },
  },
});
check('unrelated subscription.updated does not email', quiet.status === 200 && calls.email.length === emailsBeforeUpdate + 1);

calls.mailShouldThrow = true;
const thrown = await postEvent(checkoutEvent('evt_throw', {
  type: 'member',
  tier: 'yearly',
  tierName: 'Elite Member (Yearly)',
  amount: '500',
  interval: 'year',
}));
calls.mailShouldThrow = false;
check('mail failure still returns 200', thrown.status === 200 && thrown.json.received === true);

process.env.STRIPE_SECRET_KEY = 'sk_test_local_not_used';
const flagship = await post('/api/stripe/create-checkout-session', JSON.stringify({ tier: 'flagship' }), {
  'Content-Type': 'application/json',
});
check('flagship checkout is rejected', flagship.status === 400, JSON.stringify(flagship.json));

delete process.env.STRIPE_SECRET_KEY;
const unavailable = await post('/api/stripe/create-checkout-session', JSON.stringify({ tier: 'supporting' }), {
  'Content-Type': 'application/json',
});
check('missing Stripe key returns 503', unavailable.status === 503, JSON.stringify(unavailable.json));

async function getLogs(headers: Record<string, string> = {}) {
  const response = await fetch(`http://127.0.0.1:${port}/api/forms/logs`, { headers });
  return { status: response.status };
}

delete process.env.ADMIN_TOKEN;
check('logs without ADMIN_TOKEN return 404', (await getLogs()).status === 404);
process.env.ADMIN_TOKEN = 'local-admin-token';
check('logs with the wrong token return 401', (await getLogs({ Authorization: 'Bearer nope' })).status === 401);
check('logs with the bearer token return 200', (await getLogs({ Authorization: 'Bearer local-admin-token' })).status === 200);
check('logs with X-Admin-Token return 200', (await getLogs({ 'X-Admin-Token': 'local-admin-token' })).status === 200);

server.close();
if (failures.length) {
  console.error(`\n${failures.length} failed`);
  process.exit(1);
}
console.log('\nall webhook checks passed');

import fs from 'fs';
import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { sendNotificationEmail, subscribeToMailchimp } from './forms.js';

const router = Router();

// The live site already sends this Stripe-Version. The installed SDK's types
// only describe a newer version, so the config is cast at the constructor.
const STRIPE_API_VERSION = '2024-12-18.acacia';

const SPONSOR_COMMITMENT_MONTHS = 12;
const SPONSOR_COMMITMENT_TEXT =
  '12-month commitment, billed monthly. You are invoiced once each month for 12 months.';

type TierConfig = {
  priceId: string;
  name: string;
  amount: number;
  interval: string;
  kind: 'member' | 'sponsor';
};

const SPONSOR_TIERS: Record<string, TierConfig> = {
  supporting: {
    priceId: process.env.STRIPE_PRICE_SUPPORTING || '',
    name: 'Supporting Sponsor',
    amount: 2500,
    interval: 'month',
    kind: 'sponsor',
  },
  strategic: {
    priceId: process.env.STRIPE_PRICE_STRATEGIC || '',
    name: 'Strategic Sponsor',
    amount: 5000,
    interval: 'month',
    kind: 'sponsor',
  },
  premier: {
    priceId: process.env.STRIPE_PRICE_PREMIER || '',
    name: 'Premier Sponsor',
    amount: 7500,
    interval: 'month',
    kind: 'sponsor',
  },
};

const MEMBER_TIERS: Record<string, TierConfig> = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_MEMBER_MONTHLY || '',
    name: 'Monthly Member',
    amount: 25,
    interval: 'month',
    kind: 'member',
  },
  quarterly: {
    priceId: process.env.STRIPE_PRICE_MEMBER_QUARTERLY || '',
    name: 'Silver Member (Quarterly)',
    amount: 100,
    interval: 'quarter',
    kind: 'member',
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_MEMBER_YEARLY || '',
    name: 'Elite Member (Yearly)',
    amount: 500,
    interval: 'year',
    kind: 'member',
  },
};

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[STRIPE] STRIPE_SECRET_KEY is not set. Checkout endpoints will return 503.');
}

let stripeClient: Stripe | null = null;
let stripeClientKey = '';

type StripeWriter = {
  subscriptions: {
    update: (id: string, params: Stripe.SubscriptionUpdateParams) => Promise<unknown>;
  };
  customers: {
    update: (id: string, params: Stripe.CustomerUpdateParams) => Promise<unknown>;
  };
};

let writerOverride: StripeWriter | null | undefined;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient || stripeClientKey !== key) {
    stripeClient = new Stripe(key, { apiVersion: STRIPE_API_VERSION } as Stripe.StripeConfig);
    stripeClientKey = key;
  }
  return stripeClient;
}

/** Tests inject a writer so subscription updates do not call Stripe. */
export function setStripeWriterForTests(writer: StripeWriter | null | undefined) {
  writerOverride = writer;
}

function writer(): StripeWriter | null {
  if (writerOverride !== undefined) return writerOverride;
  return getStripe();
}

let verifier: Stripe | null = null;
function signatureVerifier(): Stripe {
  if (!verifier) {
    // constructEvent checks the HMAC locally and does not use the API key.
    const key = process.env.STRIPE_SECRET_KEY || 'sk_test_signature_only';
    verifier = new Stripe(key, { apiVersion: STRIPE_API_VERSION } as Stripe.StripeConfig);
  }
  return verifier;
}

export type OutboundNotice = {
  subscribeToMailchimp: (
    email: string,
    firstName: string,
    lastName: string,
    tags: string[],
    mergeFields?: Record<string, string>
  ) => Promise<unknown>;
  sendNotificationEmail: (subject: string, body: string) => Promise<unknown>;
};

const defaultNotice: OutboundNotice = { subscribeToMailchimp, sendNotificationEmail };
let notice: OutboundNotice = defaultNotice;

export function setOutboundNoticeForTests(next: OutboundNotice | null) {
  notice = next ?? defaultNotice;
}

function eventLogPath() {
  return process.env.STRIPE_EVENT_LOG_PATH || '/tmp/ems-stripe-event-ids.json';
}

const seenEventIds = new Set<string>();
let eventLogLoaded = false;

function loadEventLog() {
  if (eventLogLoaded) return;
  eventLogLoaded = true;
  try {
    const parsed = JSON.parse(fs.readFileSync(eventLogPath(), 'utf8'));
    if (Array.isArray(parsed)) {
      for (const id of parsed) seenEventIds.add(String(id));
    }
  } catch {
    // First delivery on this machine.
  }
}

function hasSeenEvent(id: string) {
  loadEventLog();
  return seenEventIds.has(id);
}

function rememberEvent(id: string) {
  loadEventLog();
  seenEventIds.add(id);
  try {
    fs.writeFileSync(eventLogPath(), JSON.stringify([...seenEventIds]));
  } catch (error) {
    console.error('[STRIPE] Failed to persist webhook event id', error);
  }
}

export function resetStripeEventLogForTests() {
  seenEventIds.clear();
  eventLogLoaded = false;
  try {
    fs.unlinkSync(eventLogPath());
  } catch {
    // Already gone.
  }
}

function addYears(date: Date, years: number) {
  const next = new Date(date.getTime());
  next.setUTCFullYear(next.getUTCFullYear() + years);
  return next;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function originUrl(req: Request, path: string) {
  const origin = req.headers.origin;
  if (typeof origin === 'string' && /^https?:\/\//.test(origin)) {
    return `${origin}${path}`;
  }
  return `https://electricmotorsociety.com${path}`;
}

function checkoutFields(): Stripe.Checkout.SessionCreateParams.CustomField[] {
  return [
    {
      key: 'contact_name',
      label: { type: 'custom', custom: 'Contact name' },
      type: 'text',
      optional: false,
    },
    {
      key: 'company',
      label: { type: 'custom', custom: 'Company' },
      type: 'text',
      optional: false,
    },
  ];
}

function commitmentWindow(now = new Date()) {
  return {
    commitment_months: String(SPONSOR_COMMITMENT_MONTHS),
    commitment_start: isoDate(now),
    commitment_end: isoDate(addYears(now, 1)),
  };
}

function paymentsUnavailable(res: Response) {
  console.error('[STRIPE] Checkout requested but STRIPE_SECRET_KEY is not set');
  return res.status(503).json({ error: 'Payments are not configured' });
}

router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const stripe = getStripe();
    if (!stripe) return paymentsUnavailable(res);

    const { tier, successUrl, cancelUrl } = req.body;
    if (!tier || !SPONSOR_TIERS[tier]) {
      return res.status(400).json({
        error: 'Invalid sponsor tier',
        validTiers: Object.keys(SPONSOR_TIERS),
      });
    }

    const tierConfig = SPONSOR_TIERS[tier];
    if (!tierConfig.priceId) {
      console.error(`[STRIPE] Missing price ID for tier: ${tier}`);
      return res.status(500).json({
        error: 'Stripe price not configured for this tier',
        tier,
      });
    }

    const commitment = commitmentWindow();
    const metadata: Record<string, string> = {
      type: 'sponsor',
      tier,
      tierName: tierConfig.name,
      amount: String(tierConfig.amount),
      interval: tierConfig.interval,
      ...commitment,
    };

    // Commitment is recorded in metadata. A Subscription Schedule is not
    // created here: a bad phase or end_behavior can cancel or shorten a live
    // subscription, and this service has no database to undo that. Billing
    // stays the existing monthly price. After 12 months the subscription
    // continues month to month, which is what `end_behavior: release` would
    // have done. Stripe does not block an early cancel; the dates are the record.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: tierConfig.priceId, quantity: 1 }],
      custom_fields: checkoutFields(),
      custom_text: { submit: { message: SPONSOR_COMMITMENT_TEXT } },
      success_url: successUrl || originUrl(req, '/sponsors?success=true'),
      cancel_url: cancelUrl || originUrl(req, '/sponsors?canceled=true'),
      metadata,
      subscription_data: { metadata },
    });

    console.log(`[STRIPE] Checkout session created for ${tierConfig.name}:`, session.id);
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[STRIPE] Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/create-member-checkout', async (req: Request, res: Response) => {
  try {
    const stripe = getStripe();
    if (!stripe) return paymentsUnavailable(res);

    const { tier, successUrl, cancelUrl } = req.body;
    if (!tier || !MEMBER_TIERS[tier]) {
      return res.status(400).json({
        error: 'Invalid member tier',
        validTiers: Object.keys(MEMBER_TIERS),
      });
    }

    const tierConfig = MEMBER_TIERS[tier];
    if (!tierConfig.priceId) {
      console.error(`[STRIPE] Missing price ID for member tier: ${tier}`);
      return res.status(500).json({
        error: 'Stripe price not configured for this member tier',
        tier,
      });
    }

    const metadata: Record<string, string> = {
      type: 'member',
      tier,
      tierName: tierConfig.name,
      amount: String(tierConfig.amount),
      interval: tierConfig.interval,
      memberType: 'member',
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: tierConfig.priceId, quantity: 1 }],
      custom_fields: checkoutFields(),
      success_url: successUrl || originUrl(req, '/members?success=true'),
      cancel_url: cancelUrl || originUrl(req, '/members?canceled=true'),
      metadata,
      subscription_data: { metadata },
    });

    console.log(`[STRIPE] Member checkout session created for ${tierConfig.name}:`, session.id);
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[STRIPE] Error creating member checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

function idOf(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'id' in value && typeof (value as { id: unknown }).id === 'string') {
    return (value as { id: string }).id;
  }
  return '';
}

function customField(session: Stripe.Checkout.Session, key: string) {
  const field = session.custom_fields?.find((item) => item.key === key);
  return field?.text?.value?.trim() || '';
}

function meta(source: Stripe.Metadata | null | undefined, key: string) {
  return source?.[key]?.trim() || '';
}

function intervalLabel(interval: string) {
  if (interval === 'quarter') return 'every 3 months';
  if (interval === 'year') return 'year';
  if (interval === 'month') return 'month';
  return interval || 'not recorded';
}

function money(amount: string) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return amount || 'not recorded';
  return `$${value.toLocaleString('en-US')}`;
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
}

async function safeOutbound(label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (error) {
    console.error(`[STRIPE] ${label} failed`, error);
  }
}

async function writeStripeRecord(ids: { subscriptionId: string; customerId: string }, metadata: Record<string, string>, name: string) {
  const stripe = writer();
  if (!stripe) {
    console.warn('[STRIPE] STRIPE_SECRET_KEY is not set; subscription metadata was not updated');
    return;
  }
  try {
    if (ids.subscriptionId) {
      await stripe.subscriptions.update(ids.subscriptionId, { metadata });
    }
    if (ids.customerId) {
      await stripe.customers.update(ids.customerId, {
        metadata,
        ...(name ? { name } : {}),
      });
    }
  } catch (error) {
    console.error('[STRIPE] Failed to write customer or subscription metadata', error);
  }
}

async function notifyCheckout(session: Stripe.Checkout.Session) {
  if (session.mode && session.mode !== 'subscription') {
    console.log('[STRIPE] Ignoring non-subscription checkout', session.id);
    return;
  }

  const contactName = customField(session, 'contact_name') || session.customer_details?.name || '';
  const company = customField(session, 'company') || meta(session.metadata, 'company');
  const email = session.customer_details?.email || session.customer_email || '';
  const type = meta(session.metadata, 'type') || (meta(session.metadata, 'memberType') === 'member' ? 'member' : 'sponsor');
  const tier = meta(session.metadata, 'tier');
  const tierName = meta(session.metadata, 'tierName') || tier;
  const amount = meta(session.metadata, 'amount');
  const interval = meta(session.metadata, 'interval');
  const commitmentEnd = meta(session.metadata, 'commitment_end');
  const metadata: Record<string, string> = {
    ...(session.metadata || {}),
    type,
    tier,
    company,
    contact_name: contactName,
  };

  const recorded = Object.fromEntries(Object.entries(metadata).filter(([, value]) => value));
  await writeStripeRecord(
    { subscriptionId: idOf(session.subscription), customerId: idOf(session.customer) },
    recorded,
    contactName
  );

  if (!email) {
    console.warn('[STRIPE] Checkout completed without an email', session.id);
  }

  const { firstName, lastName } = splitName(contactName);
  const tags = type === 'sponsor' && tier
    ? ['ems-member', `ems-sponsor-${tier}`]
    : ['ems-member'];

  await safeOutbound('Mailchimp', () =>
    notice.subscribeToMailchimp(email, firstName, lastName, tags, { COMPANY: company })
  );

  const commitmentLine = type === 'sponsor'
    ? `Commitment end: ${commitmentEnd || 'not recorded'}`
    : 'Commitment end: not a 12-month sponsor term';

  await safeOutbound('notification email', () =>
    notice.sendNotificationEmail(
      `[EMS] New ${type}: ${tierName || tier || 'unknown tier'}`,
      `A Stripe checkout completed.

Name: ${contactName || 'Not provided'}
Email: ${email || 'Not provided'}
Company: ${company || 'Not provided'}
Type: ${type}
Tier: ${tierName || tier || 'Not provided'}
Amount: ${money(amount)}
Interval: ${intervalLabel(interval)}
${commitmentLine}
Session: ${session.id}
Subscription: ${idOf(session.subscription) || 'Not provided'}

---
Electric Motor Society
https://electricmotorsociety.com`
    )
  );
}

async function notifyPaymentFailed(invoice: Stripe.Invoice) {
  const email = invoice.customer_email || '';
  const details = invoice.parent?.subscription_details;
  const legacySubscription = (invoice as Stripe.Invoice & { subscription?: unknown }).subscription;
  const subscriptionId = idOf(details?.subscription) || idOf(legacySubscription);
  const tier = details?.metadata?.tier || '';
  const amount = typeof invoice.amount_due === 'number' ? (invoice.amount_due / 100).toFixed(2) : 'unknown';

  await safeOutbound('payment-failed email', () =>
    notice.sendNotificationEmail(
      `[EMS] Payment failed${tier ? `: ${tier}` : ''}`,
      `A subscription invoice failed.

Email: ${email || 'Not provided'}
Tier: ${tier || 'Not on the invoice'}
Amount due: $${amount} ${(invoice.currency || '').toUpperCase()}
Subscription: ${subscriptionId || 'Not provided'}
Invoice: ${invoice.id}

---
Electric Motor Society
https://electricmotorsociety.com`
    )
  );
}

async function notifySubscriptionChange(kind: 'updated' | 'deleted', subscription: Stripe.Subscription, previous?: Partial<Stripe.Subscription>) {
  const becameCanceling = previous != null
    && 'cancel_at_period_end' in previous
    && subscription.cancel_at_period_end === true
    && previous.cancel_at_period_end !== true;
  const statusChanged = previous != null
    && previous.status !== undefined
    && previous.status !== subscription.status
    && ['canceled', 'unpaid', 'past_due'].includes(subscription.status);
  const deleted = kind === 'deleted';

  if (!deleted && !becameCanceling && !statusChanged) {
    console.log('[STRIPE] Subscription updated with no cancellation or failure status', subscription.id);
    return;
  }

  const tier = meta(subscription.metadata, 'tier');
  const tierName = meta(subscription.metadata, 'tierName') || tier;
  const company = meta(subscription.metadata, 'company');
  const name = meta(subscription.metadata, 'contact_name');
  const commitmentEnd = meta(subscription.metadata, 'commitment_end');
  const customerId = idOf(subscription.customer);

  await safeOutbound('subscription notice', () =>
    notice.sendNotificationEmail(
      `[EMS] Subscription ${deleted ? 'canceled' : subscription.status}: ${tierName || subscription.id}`,
      `A subscription changed.

Name: ${name || 'Not on the subscription'}
Company: ${company || 'Not on the subscription'}
Tier: ${tierName || 'Not on the subscription'}
Status: ${subscription.status}
Cancel at period end: ${subscription.cancel_at_period_end ? 'yes' : 'no'}
Commitment end: ${commitmentEnd || 'not recorded'}
Customer: ${customerId || 'Not provided'}
Subscription: ${subscription.id}

---
Electric Motor Society
https://electricmotorsociety.com`
    )
  );
}

async function dispatchEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await notifyCheckout(event.data.object as Stripe.Checkout.Session);
      break;
    case 'invoice.payment_failed':
      await notifyPaymentFailed(event.data.object as Stripe.Invoice);
      break;
    case 'customer.subscription.updated':
      await notifySubscriptionChange(
        'updated',
        event.data.object as Stripe.Subscription,
        event.data.previous_attributes as Partial<Stripe.Subscription> | undefined
      );
      break;
    case 'customer.subscription.deleted':
      await notifySubscriptionChange('deleted', event.data.object as Stripe.Subscription);
      break;
    default:
      console.log(`[STRIPE] Unhandled event type: ${event.type}`);
  }
}

export async function stripeWebhookHandler(req: Request, res: Response) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('[STRIPE] STRIPE_WEBHOOK_SECRET is not set; rejecting webhook');
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  const payload = Buffer.isBuffer(req.body)
    ? req.body
    : typeof req.body === 'string'
      ? req.body
      : null;
  if (payload == null) {
    return res.status(400).json({ error: 'Webhook requires a raw body' });
  }

  let event: Stripe.Event;
  try {
    event = signatureVerifier().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('[STRIPE] Webhook signature verification failed');
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  if (hasSeenEvent(event.id)) {
    return res.json({ received: true, duplicate: true });
  }

  try {
    await dispatchEvent(event);
  } catch (error) {
    console.error('[STRIPE] Webhook handler failed', event.type, error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }

  rememberEvent(event.id);
  return res.json({ received: true });
}

export default router;

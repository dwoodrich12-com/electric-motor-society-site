import { Router, Request, Response } from 'express';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Sponsor tier price mapping
// These price IDs need to be created in Stripe Dashboard and updated here
const SPONSOR_TIERS: Record<string, { priceId: string; name: string; amount: number }> = {
  'supporting': {
    priceId: process.env.STRIPE_PRICE_SUPPORTING || '',
    name: 'Supporting Sponsor',
    amount: 2500
  },
  'strategic': {
    priceId: process.env.STRIPE_PRICE_STRATEGIC || '',
    name: 'Strategic Sponsor',
    amount: 5000
  },
  'flagship': {
    priceId: process.env.STRIPE_PRICE_FLAGSHIP || '',
    name: 'Flagship Sponsor',
    amount: 7500
  }
};

// Create checkout session for sponsor tier
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { tier, successUrl, cancelUrl } = req.body;

    if (!tier || !SPONSOR_TIERS[tier]) {
      return res.status(400).json({ 
        error: 'Invalid sponsor tier',
        validTiers: Object.keys(SPONSOR_TIERS)
      });
    }

    const tierConfig = SPONSOR_TIERS[tier];

    if (!tierConfig.priceId) {
      console.error(`[STRIPE] Missing price ID for tier: ${tier}`);
      return res.status(500).json({ 
        error: 'Stripe price not configured for this tier',
        tier 
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/sponsors?success=true`,
      cancel_url: cancelUrl || `${req.headers.origin}/sponsors?canceled=true`,
      metadata: {
        tier,
        tierName: tierConfig.name,
      },
    });

    console.log(`[STRIPE] Checkout session created for ${tierConfig.name}:`, session.id);

    res.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('[STRIPE] Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook endpoint for Stripe events (optional but recommended)
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log('[STRIPE] Webhook secret not configured, skipping verification');
    return res.status(200).json({ received: true });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      webhookSecret
    );

    console.log(`[STRIPE] Webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('[STRIPE] Checkout completed:', session.id);
        console.log('[STRIPE] Customer:', session.customer);
        console.log('[STRIPE] Tier:', session.metadata?.tier);
        // TODO: Add sponsor to database, send welcome email, etc.
        break;

      case 'customer.subscription.created':
        console.log('[STRIPE] Subscription created');
        break;

      case 'customer.subscription.deleted':
        console.log('[STRIPE] Subscription canceled');
        break;

      default:
        console.log(`[STRIPE] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[STRIPE] Webhook error:', error);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

export default router;

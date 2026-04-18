import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

// Mailchimp API configuration
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || '';

// Extract datacenter from API key (format: key-dc)
const getDatacenter = () => {
  const parts = MAILCHIMP_API_KEY.split('-');
  return parts.length > 1 ? parts[parts.length - 1] : 'us1';
};

// Subscribe email to newsletter
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, tags } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      console.error('[MAILCHIMP] API key or list ID not configured');
      return res.status(500).json({ error: 'Newsletter service not configured' });
    }

    const dc = getDatacenter();
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    // Mailchimp uses MD5 hash of lowercase email as member ID
    const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    const data: Record<string, unknown> = {
      email_address: email,
      status: 'subscribed', // Use 'pending' for double opt-in
      merge_fields: {}
    };

    if (firstName) {
      (data.merge_fields as Record<string, string>).FNAME = firstName;
    }
    if (lastName) {
      (data.merge_fields as Record<string, string>).LNAME = lastName;
    }
    if (tags && Array.isArray(tags)) {
      data.tags = tags;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`[MAILCHIMP] Subscribed: ${email}`);
      return res.json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter' 
      });
    }

    // Handle "already subscribed" case gracefully
    if (result.title === 'Member Exists') {
      console.log(`[MAILCHIMP] Already subscribed: ${email}`);
      return res.json({ 
        success: true, 
        message: 'You are already subscribed to our newsletter' 
      });
    }

    // Handle other errors
    console.error('[MAILCHIMP] Error:', result);
    return res.status(400).json({ 
      error: 'Failed to subscribe',
      details: result.detail || result.title 
    });

  } catch (error) {
    console.error('[MAILCHIMP] Error:', error);
    res.status(500).json({ 
      error: 'Failed to subscribe to newsletter',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Unsubscribe endpoint (optional)
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const dc = getDatacenter();
    const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'unsubscribed' }),
    });

    if (response.ok) {
      console.log(`[MAILCHIMP] Unsubscribed: ${email}`);
      return res.json({ success: true, message: 'Successfully unsubscribed' });
    }

    const result = await response.json();
    console.error('[MAILCHIMP] Unsubscribe error:', result);
    return res.status(400).json({ error: 'Failed to unsubscribe' });

  } catch (error) {
    console.error('[MAILCHIMP] Error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;

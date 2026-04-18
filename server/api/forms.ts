import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const router = Router();

// Mailchimp API configuration
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || '';
const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY || '';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@electricmotorsociety.com';
const AGENTMAIL_FROM = process.env.AGENTMAIL_FROM || 'herman1@agentmail.to';

// Form logs file path
const FORM_LOGS_PATH = process.env.FORM_LOGS_PATH || '/tmp/ems-form-logs.json';

// Extract datacenter from API key
const getDatacenter = () => {
  const parts = MAILCHIMP_API_KEY.split('-');
  return parts.length > 1 ? parts[parts.length - 1] : 'us1';
};

// Helper: Log form submission to JSON file
function logFormSubmission(formType: string, data: Record<string, unknown>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    formType,
    data
  };

  try {
    let logs: unknown[] = [];
    if (fs.existsSync(FORM_LOGS_PATH)) {
      const content = fs.readFileSync(FORM_LOGS_PATH, 'utf-8');
      logs = JSON.parse(content);
    }
    logs.push(logEntry);
    fs.writeFileSync(FORM_LOGS_PATH, JSON.stringify(logs, null, 2));
    console.log(`[FORM LOG] Saved to ${FORM_LOGS_PATH}`);
  } catch (error) {
    console.error('[FORM LOG] Error saving:', error);
  }
}

// Helper: Subscribe email to Mailchimp with tags
async function subscribeToMailchimp(email: string, firstName: string, lastName: string, tags: string[], mergeFields?: Record<string, string>) {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
    console.log('[MAILCHIMP] Not configured, skipping subscription');
    return { success: false, reason: 'not_configured' };
  }

  const dc = getDatacenter();
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

  const data: Record<string, unknown> = {
    email_address: email,
    status: 'subscribed',
    tags: tags,
    merge_fields: {
      FNAME: firstName || '',
      LNAME: lastName || '',
      ...mergeFields
    }
  };

  try {
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
      console.log(`[MAILCHIMP] Subscribed: ${email} with tags: ${tags.join(', ')}`);
      return { success: true };
    }

    if (result.title === 'Member Exists') {
      // Add tags to existing member
      const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
      const tagUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}/tags`;
      
      await fetch(tagUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tags.map(tag => ({ name: tag, status: 'active' }))
        }),
      });
      
      console.log(`[MAILCHIMP] Updated tags for existing member: ${email}`);
      return { success: true, existing: true };
    }

    console.error('[MAILCHIMP] Error:', result);
    return { success: false, error: result };
  } catch (error) {
    console.error('[MAILCHIMP] Exception:', error);
    return { success: false, error };
  }
}

// Helper: Send notification email via AgentMail
async function sendNotificationEmail(subject: string, body: string) {
  if (!AGENTMAIL_API_KEY) {
    console.log('[AGENTMAIL] Not configured, logging only');
    console.log('='.repeat(60));
    console.log(`Subject: ${subject}`);
    console.log(body);
    console.log('='.repeat(60));
    return { success: false, reason: 'not_configured' };
  }

  try {
    // AgentMail API v0 endpoint: POST /v0/inboxes/{inbox_id}/messages/send
    const inboxId = encodeURIComponent(AGENTMAIL_FROM);
    const response = await fetch(`https://api.agentmail.to/v0/inboxes/${inboxId}/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AGENTMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [NOTIFICATION_EMAIL],
        subject: subject,
        text: body
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`[AGENTMAIL] Email sent to ${NOTIFICATION_EMAIL}:`, result.message_id || 'success');
      return { success: true };
    } else {
      const error = await response.text();
      console.error('[AGENTMAIL] Error:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('[AGENTMAIL] Exception:', error);
    return { success: false, error };
  }
}

// Member signup form
router.post('/member-signup', async (req: Request, res: Response) => {
  const { name, email, organization, country, donationType } = req.body;
  
  console.log('[FORM SUBMISSION] Member Signup');
  
  // Log to file
  logFormSubmission('member-signup', { name, email, organization, country, donationType });
  
  // Parse name into first/last
  const nameParts = (name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['member-signup', `donation-${donationType}`], {
    COMPANY: organization || '',
    COUNTRY: country || ''
  });

  // Send notification email via AgentMail
  await sendNotificationEmail(
    `[EMS] New Member Signup: ${name}`,
    `New member signup received:

Name: ${name}
Email: ${email}
Organization: ${organization || 'Not provided'}
Country: ${country || 'Not provided'}
Donation Type: ${donationType}

Submitted: ${new Date().toISOString()}

---
Electric Motor Society
https://electricmotorsociety.com`
  );
  
  res.json({ success: true, message: 'Member signup received' });
});

// Sponsor inquiry form
router.post('/sponsor-inquiry', async (req: Request, res: Response) => {
  const { company, contact, email, phone, region, interestType, message } = req.body;
  
  console.log('[FORM SUBMISSION] Sponsor Inquiry');
  
  // Log to file
  logFormSubmission('sponsor-inquiry', { company, contact, email, phone, region, interestType, message });
  
  // Parse contact name
  const nameParts = (contact || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['sponsor-inquiry', `interest-${interestType}`], {
    COMPANY: company || '',
    PHONE: phone || ''
  });

  // Send notification email via AgentMail
  await sendNotificationEmail(
    `[EMS] Sponsor Inquiry: ${company}`,
    `New sponsor inquiry received:

Company: ${company}
Contact: ${contact}
Email: ${email}
Phone: ${phone || 'Not provided'}
Region: ${region || 'Not provided'}
Interest Type: ${interestType || 'Not specified'}

Message:
${message || 'No message'}

Submitted: ${new Date().toISOString()}

---
Electric Motor Society
https://electricmotorsociety.com`
  );
  
  res.json({ success: true, message: 'Sponsor inquiry received' });
});

// University interest form
router.post('/university-interest', async (req: Request, res: Response) => {
  const { university, department, contact, email, region, collaborationType, message } = req.body;
  
  console.log('[FORM SUBMISSION] University Interest');
  
  // Log to file
  logFormSubmission('university-interest', { university, department, contact, email, region, collaborationType, message });
  
  // Parse contact name
  const nameParts = (contact || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['university-interest', `collab-${collaborationType}`], {
    COMPANY: `${university} - ${department}` || ''
  });

  // Send notification email via AgentMail
  await sendNotificationEmail(
    `[EMS] University Interest: ${university}`,
    `New university interest received:

University: ${university}
Department/Lab: ${department || 'Not provided'}
Contact: ${contact}
Email: ${email}
Region: ${region || 'Not provided'}
Collaboration Type: ${collaborationType || 'Not specified'}

Message:
${message || 'No message'}

Submitted: ${new Date().toISOString()}

---
Electric Motor Society
https://electricmotorsociety.com`
  );
  
  res.json({ success: true, message: 'University interest received' });
});

// Motor quote form
router.post('/motor-quote', async (req: Request, res: Response) => {
  const { name, email, organization, motorType, powerRating, voltage, speed, specifications, message, fileName } = req.body;
  
  console.log('[FORM SUBMISSION] Motor Quote Request');
  
  // Log to file
  logFormSubmission('motor-quote', { name, email, organization, motorType, powerRating, voltage, speed, specifications, message, fileName });
  
  // Parse name
  const nameParts = (name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['motor-quote', `motor-${motorType}`], {
    COMPANY: organization || ''
  });

  // Send notification email via AgentMail
  await sendNotificationEmail(
    `[EMS] Motor Quote Request: ${name}`,
    `New motor quote request received:

Name: ${name}
Email: ${email}
Organization: ${organization || 'Not provided'}

Motor Specifications:
- Type: ${motorType || 'Not specified'}
- Power Rating: ${powerRating || 'Not specified'}
- Voltage: ${voltage || 'Not specified'}
- Speed (RPM): ${speed || 'Not specified'}
- Additional Specs: ${specifications || 'None'}

Message:
${message || 'No message'}

File Attached: ${fileName || 'None'}

Submitted: ${new Date().toISOString()}

---
Electric Motor Society
https://electricmotorsociety.com`
  );
  
  res.json({ success: true, message: 'Motor quote request received' });
});

// API endpoint to get form logs (for spreadsheet sync or review)
router.get('/logs', async (req: Request, res: Response) => {
  try {
    if (fs.existsSync(FORM_LOGS_PATH)) {
      const content = fs.readFileSync(FORM_LOGS_PATH, 'utf-8');
      const logs = JSON.parse(content);
      res.json({ success: true, logs });
    } else {
      res.json({ success: true, logs: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to read logs' });
  }
});

export default router;

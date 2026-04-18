import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

// Mailchimp API configuration
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || '';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@electricmotorsociety.com';

// Extract datacenter from API key
const getDatacenter = () => {
  const parts = MAILCHIMP_API_KEY.split('-');
  return parts.length > 1 ? parts[parts.length - 1] : 'us1';
};

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

// Helper: Send notification email via Mailchimp Transactional or log for now
async function sendNotificationEmail(subject: string, body: string) {
  // For now, log the notification. In production, you could use:
  // - Mailchimp Transactional (Mandrill)
  // - SendGrid
  // - AWS SES
  // - Or forward to a webhook/Zapier
  
  console.log('='.repeat(60));
  console.log('[EMAIL NOTIFICATION]');
  console.log(`To: ${NOTIFICATION_EMAIL}`);
  console.log(`Subject: ${subject}`);
  console.log('Body:');
  console.log(body);
  console.log('='.repeat(60));
  
  // TODO: Implement actual email sending when SMTP/transactional email is configured
  return { success: true, logged: true };
}

// Member signup form
router.post('/member-signup', async (req: Request, res: Response) => {
  const { name, email, organization, country, donationType } = req.body;
  
  console.log('[FORM SUBMISSION] Member Signup');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Organization:', organization);
  console.log('Country:', country);
  console.log('Donation Type:', donationType);
  console.log('Timestamp:', new Date().toISOString());
  
  // Parse name into first/last
  const nameParts = (name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['member-signup', `donation-${donationType}`], {
    COMPANY: organization || '',
    COUNTRY: country || ''
  });

  // Send notification email
  await sendNotificationEmail(
    `[EMS] New Member Signup: ${name}`,
    `New member signup received:

Name: ${name}
Email: ${email}
Organization: ${organization || 'Not provided'}
Country: ${country || 'Not provided'}
Donation Type: ${donationType}

Submitted: ${new Date().toISOString()}`
  );
  
  res.json({ success: true, message: 'Member signup received' });
});

// Sponsor inquiry form
router.post('/sponsor-inquiry', async (req: Request, res: Response) => {
  const { company, contact, email, phone, region, interestType, message } = req.body;
  
  console.log('[FORM SUBMISSION] Sponsor Inquiry');
  console.log('Company:', company);
  console.log('Contact:', contact);
  console.log('Email:', email);
  console.log('Phone:', phone);
  console.log('Region:', region);
  console.log('Interest Type:', interestType);
  console.log('Message:', message);
  console.log('Timestamp:', new Date().toISOString());
  
  // Parse contact name
  const nameParts = (contact || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['sponsor-inquiry', `interest-${interestType}`], {
    COMPANY: company || '',
    PHONE: phone || ''
  });

  // Send notification email
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

Submitted: ${new Date().toISOString()}`
  );
  
  res.json({ success: true, message: 'Sponsor inquiry received' });
});

// University interest form
router.post('/university-interest', async (req: Request, res: Response) => {
  const { university, department, contact, email, region, collaborationType, message } = req.body;
  
  console.log('[FORM SUBMISSION] University Interest');
  console.log('University:', university);
  console.log('Department/Lab:', department);
  console.log('Contact:', contact);
  console.log('Email:', email);
  console.log('Region:', region);
  console.log('Collaboration Type:', collaborationType);
  console.log('Message:', message);
  console.log('Timestamp:', new Date().toISOString());
  
  // Parse contact name
  const nameParts = (contact || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['university-interest', `collab-${collaborationType}`], {
    COMPANY: `${university} - ${department}` || ''
  });

  // Send notification email
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

Submitted: ${new Date().toISOString()}`
  );
  
  res.json({ success: true, message: 'University interest received' });
});

// Motor quote form
router.post('/motor-quote', async (req: Request, res: Response) => {
  const { name, email, organization, motorType, powerRating, voltage, speed, specifications, message, fileName } = req.body;
  
  console.log('[FORM SUBMISSION] Motor Quote Request');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Organization:', organization);
  console.log('Motor Type:', motorType);
  console.log('Power Rating:', powerRating);
  console.log('Voltage:', voltage);
  console.log('Speed (RPM):', speed);
  console.log('Specifications:', specifications);
  console.log('Message:', message);
  console.log('File Attached:', fileName);
  console.log('Timestamp:', new Date().toISOString());
  
  // Parse name
  const nameParts = (name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Subscribe to Mailchimp with tags
  await subscribeToMailchimp(email, firstName, lastName, ['motor-quote', `motor-${motorType}`], {
    COMPANY: organization || ''
  });

  // Send notification email
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

Submitted: ${new Date().toISOString()}`
  );
  
  res.json({ success: true, message: 'Motor quote request received' });
});

export default router;

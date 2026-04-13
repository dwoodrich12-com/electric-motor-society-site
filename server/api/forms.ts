import { Router, Request, Response } from 'express';

const router = Router();

// Member signup form
router.post('/member-signup', (req: Request, res: Response) => {
  const { name, email, organization, country, donationType } = req.body;
  
  console.log('[FORM SUBMISSION] Member Signup');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Organization:', organization);
  console.log('Country:', country);
  console.log('Donation Type:', donationType);
  console.log('Timestamp:', new Date().toISOString());
  console.log('---');
  
  res.json({ success: true, message: 'Member signup received' });
});

// Sponsor inquiry form
router.post('/sponsor-inquiry', (req: Request, res: Response) => {
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
  console.log('---');
  
  res.json({ success: true, message: 'Sponsor inquiry received' });
});

// University interest form
router.post('/university-interest', (req: Request, res: Response) => {
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
  console.log('---');
  
  res.json({ success: true, message: 'University interest received' });
});

// Motor quote form
router.post('/motor-quote', (req: Request, res: Response) => {
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
  console.log('---');
  
  res.json({ success: true, message: 'Motor quote request received' });
});

export default router;

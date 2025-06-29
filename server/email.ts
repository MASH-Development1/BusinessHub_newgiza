import nodemailer from 'nodemailer';

// Keep the transporter configuration for future use if needed
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Placeholder functions - email functionality disabled
export async function sendJobApplication(application: any, jobTitle: string, company: string, cvFile: { filename: string; path: string }) {
  // Email sending disabled - approval through admin portal only
  console.log('Job application received - email notifications disabled');
}

export async function sendInternshipApplication(application: any, internshipTitle: string, company: string, cvFile: { filename: string; path: string }) {
  // Email sending disabled - approval through admin portal only
  console.log('Internship application received - email notifications disabled');
}

export async function sendAccessRequestNotification(requestData: {
  fullName: string;
  email: string;
  unitNumber: string;
  mobile?: string;
  requestedAt: Date;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email credentials not configured - skipping notification');
    return;
  }

  try {
    const mailOptions = {
      from: 'Hub Within <access.newgiza@gmail.com>',
      to: 'access.newgiza@gmail.com',
      subject: 'New Access Request - Hub Within Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">New Access Request</h2>
          <p>A new user has requested access to the Hub Within platform:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${requestData.fullName}</p>
            <p><strong>Email:</strong> ${requestData.email}</p>
            <p><strong>Unit Number:</strong> ${requestData.unitNumber}</p>
            <p><strong>Mobile:</strong> ${requestData.mobile || 'Not provided'}</p>
            <p><strong>Requested At:</strong> ${requestData.requestedAt.toLocaleDateString()}</p>
          </div>
          
          <p>Please review this request in the admin panel and approve or reject accordingly.</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            This is an automated notification from Hub Within Platform.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Access request notification sent successfully');
  } catch (error) {
    console.error('Failed to send access request notification:', error);
  }
}

export async function sendAccessApprovedNotification(email: string, name?: string) {
  // Email sending disabled - approval through admin portal only
  console.log('Access approved - email notifications disabled');
}
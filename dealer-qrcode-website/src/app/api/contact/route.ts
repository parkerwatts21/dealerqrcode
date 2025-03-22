import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, message, dealershipSize } = body;

    // Basic validation
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // SendGrid configuration validation
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const toEmail = process.env.TO_EMAIL;
    
    if (!sendgridApiKey || !fromEmail || !toEmail) {
      console.error('Missing SendGrid configuration. Please set SENDGRID_API_KEY, FROM_EMAIL, and TO_EMAIL environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Set SendGrid API key
    sgMail.setApiKey(sendgridApiKey);

    // Email content
    const emailContent = `
      <h2>New Inquiry from Dealer QRCode Website</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Dealership Size:</strong> ${dealershipSize}</p>
      <p><strong>Message:</strong> ${message || 'No message provided'}</p>
    `;

    // Create email message
    const msg = {
      to: toEmail,
      from: fromEmail,
      replyTo: email,
      subject: 'New Inquiry from Dealer QRCode Website',
      html: emailContent,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 
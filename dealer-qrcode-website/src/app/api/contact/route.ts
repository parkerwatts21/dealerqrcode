import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Configure transporter (for testing, using Ethereal)
    // In production, replace with your actual email service
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // replace with environment variable
        pass: process.env.EMAIL_PASS || 'your-app-specific-password', // replace with environment variable
      },
    });

    // Email content
    const emailContent = `
      <h2>New Inquiry from Dealer QRCode Website</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Dealership Size:</strong> ${dealershipSize}</p>
      <p><strong>Message:</strong> ${message || 'No message provided'}</p>
    `;

    // Send email
    await transporter.sendMail({
      from: '"Dealer QRCode Website" <noreply@dealerqrcode.com>',
      to: 'parkerwatts21@gmail.com',
      subject: 'New Inquiry from Dealer QRCode Website',
      html: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 
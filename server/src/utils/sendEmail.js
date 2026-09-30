import nodemailer from 'nodemailer';

let transporter;

export default async function sendEmail({ to, subject, text, html }) {
  // No SMTP configured: print the email in the terminal (handy in development)
  if (!process.env.SMTP_HOST) {
    console.log(`\n[DEV EMAIL]\nTo: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }

  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, text, html });
}
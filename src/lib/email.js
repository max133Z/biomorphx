import nodemailer from 'nodemailer';

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendOrderEmail({ to, subject, html }) {
  const t = getTransporter();
  const info = await t.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
  return info;
}

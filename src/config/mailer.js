'use strict';

const nodemailer = require('nodemailer');

/**
 * Nodemailer transporter.
 * Configure via environment variables:
 *
 *   MAIL_HOST     — SMTP host        (default: smtp.gmail.com)
 *   MAIL_PORT     — SMTP port        (default: 587)
 *   MAIL_SECURE   — true for port 465/SSL, false for port 587/STARTTLS
 *   MAIL_USER     — Gmail address (e.g. yourname@gmail.com)
 *   MAIL_PASS     — Gmail App Password (16-char, from Google Account → Security → App passwords)
 *   MAIL_FROM     — "From" display name + address
 *
 * NOTE: Port 465 requires MAIL_SECURE=true.
 *       Port 587 requires MAIL_SECURE=false (uses STARTTLS).
 *       Gmail requires a 2FA-enabled account and an App Password — NOT your regular password.
 */
const port   = parseInt(process.env.MAIL_PORT || '587', 10);
// Auto-detect secure: true if port is 465, otherwise respect MAIL_SECURE env var
const secure = port === 465 ? true : process.env.MAIL_SECURE === 'true';

const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST || 'smtp.gmail.com',
  port,
  secure,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    // Allow self-signed certs on custom mail servers (safe for Gmail too)
    rejectUnauthorized: false,
  },
});

const FROM = process.env.MAIL_FROM || `QYT HealthCAREKAWEMPE <${process.env.MAIL_USER}>`;

/**
 * Send a plain-text + HTML email.
 * @param {{ to: string, subject: string, text: string, html: string }} options
 */
async function sendMail({ to, subject, text, html }) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('[mailer] MAIL_USER or MAIL_PASS not set — email not sent.');
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, text, html });
}

module.exports = { sendMail };

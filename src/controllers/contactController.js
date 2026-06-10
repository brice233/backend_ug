'use strict';

const contactModel = require('../models/contactModel');
const { sendMail }  = require('../config/mailer');

/** POST /api/v1/contact — public */
async function submitMessage(req, res, next) {
  try {
    const msg = await contactModel.create(req.body);

    // Notify admin by email (non-blocking)
    sendMail({
      to:      process.env.MAIL_USER,
      subject: `New contact message: ${msg.subject}`,
      text: [
        'New contact message received on QYT HealthCAREKAWEMPE website.',
        '',
        `Name:    ${msg.name}`,
        `Email:   ${msg.email}`,
        `Phone:   ${msg.phone || '—'}`,
        `Subject: ${msg.subject}`,
        '',
        msg.message,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f2937;">
          <div style="background:#166534;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:18px;">New Contact Message</h1>
            <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px;">QYT HealthCAREKAWEMPE website</p>
          </div>
          <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 0;color:#6b7280;width:80px;">Name</td><td style="padding:6px 0;font-weight:600;">${msg.name}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${msg.email}" style="color:#16a34a;">${msg.email}</a></td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;">${msg.phone || '—'}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Subject</td><td style="padding:6px 0;font-weight:600;">${msg.subject}</td></tr>
            </table>
            <div style="margin-top:16px;background:#fff;border-left:4px solid #16a34a;padding:12px 16px;border-radius:0 4px 4px 0;">
              <p style="margin:0 0 6px;font-size:12px;color:#6b7280;">Message:</p>
              <p style="margin:0;line-height:1.6;">${msg.message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top:20px;font-size:13px;color:#6b7280;">
              Log in to the admin panel to reply or delete this message.
            </p>
          </div>
        </div>
      `,
    }).catch((e) => console.error('[contactController] admin notify failed:', e.message));

    return res.status(201).json({ success: true, data: msg });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/v1/contact — admin */
async function listMessages(req, res, next) {
  try {
    const page   = parseInt(req.query.page,  10) || 1;
    const limit  = parseInt(req.query.limit, 10) || 20;
    const status = req.query.status || null;
    const { rows, total } = await contactModel.findAll({ page, limit, status });
    return res.status(200).json({
      success: true,
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/v1/contact/unread-count — admin */
async function unreadCount(req, res, next) {
  try {
    const count = await contactModel.countUnread();
    return res.status(200).json({ success: true, data: { count } });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/v1/contact/:id — admin (also marks as read) */
async function getMessage(req, res, next) {
  try {
    const msg = await contactModel.markRead(req.params.id);
    if (!msg) {
      const err = new Error('Message not found'); err.statusCode = 404; return next(err);
    }
    return res.status(200).json({ success: true, data: msg });
  } catch (err) {
    return next(err);
  }
}

/** POST /api/v1/contact/:id/reply — admin */
async function replyToMessage(req, res, next) {
  try {
    const { reply_text } = req.body;
    if (!reply_text || !reply_text.trim()) {
      const err = new Error('reply_text is required'); err.statusCode = 400; return next(err);
    }

    const msg = await contactModel.findById(req.params.id);
    if (!msg) {
      const err = new Error('Message not found'); err.statusCode = 404; return next(err);
    }

    const updated = await contactModel.saveReply(req.params.id, reply_text.trim());

    // Email the visitor
    sendMail({
      to:      msg.email,
      subject: `Re: ${msg.subject} — QYT HealthCAREKAWEMPE`,
      text: [
        `Hello ${msg.name},`,
        '',
        'Thank you for contacting QYT HealthCAREKAWEMPE.',
        '',
        'Your message:',
        `"${msg.message}"`,
        '',
        'Our reply:',
        reply_text.trim(),
        '',
        'Best regards,',
        'QYT HealthCAREKAWEMPE Team',
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f2937;">
          <div style="background:#166534;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;">QYT HealthCAREKAWEMPE</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 16px;">Hello <strong>${msg.name}</strong>,</p>
            <p style="margin:0 0 16px;">Thank you for reaching out. Here is our reply to your message:</p>
            <div style="background:#fff;border-left:4px solid #9ca3af;padding:12px 16px;margin:0 0 16px;border-radius:0 4px 4px 0;">
              <p style="margin:0 0 6px;font-size:12px;color:#6b7280;font-style:italic;">Your message:</p>
              <p style="margin:0;color:#374151;">${msg.message.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:6px;margin:0 0 20px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#166534;">Our reply:</p>
              <p style="margin:0;color:#1f2937;line-height:1.6;">${reply_text.trim().replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin:24px 0 0;color:#374151;">
              Best regards,<br><strong>QYT HealthCAREKAWEMPE Team</strong>
            </p>
          </div>
        </div>
      `,
    }).catch((e) => console.error('[contactController] reply email failed:', e.message));

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
}

/** DELETE /api/v1/contact/:id — admin */
async function deleteMessage(req, res, next) {
  try {
    const deleted = await contactModel.remove(req.params.id);
    if (!deleted) {
      const err = new Error('Message not found'); err.statusCode = 404; return next(err);
    }
    return res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { submitMessage, listMessages, unreadCount, getMessage, replyToMessage, deleteMessage };

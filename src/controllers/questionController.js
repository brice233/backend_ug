'use strict';

const questionModel = require('../models/questionModel');
const { sendMail }  = require('../config/mailer');

/**
 * POST /api/v1/questions — public
 */
async function submitQuestion(req, res, next) {
  try {
    const question = await questionModel.create(req.body);
    return res.status(201).json({ success: true, data: question });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/v1/questions — admin only
 */
async function listQuestions(req, res, next) {
  try {
    const page   = parseInt(req.query.page,  10) || 1;
    const limit  = parseInt(req.query.limit, 10) || 20;
    const status = req.query.status || null;

    const { rows, total } = await questionModel.findAll({ page, limit, status });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/v1/questions/:id/status — admin only
 */
async function updateStatus(req, res, next) {
  try {
    const question = await questionModel.setStatus(req.params.id, req.body.status);
    if (!question) {
      const err = new Error('Question not found');
      err.statusCode = 404;
      return next(err);
    }
    return res.status(200).json({ success: true, data: question });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/v1/questions/:id/reply — admin only
 * Save a reply, mark as answered, and email the visitor.
 */
async function replyToQuestion(req, res, next) {
  try {
    const { reply_text } = req.body;

    if (!reply_text || !reply_text.trim()) {
      const err = new Error('reply_text is required');
      err.statusCode = 400;
      return next(err);
    }

    const question = await questionModel.findById(req.params.id);
    if (!question) {
      const err = new Error('Question not found');
      err.statusCode = 404;
      return next(err);
    }

    // Save reply to DB
    const updated = await questionModel.saveReply(req.params.id, reply_text.trim());

    // Send email to the visitor (non-blocking — don't fail the request if email fails)
    sendMail({
      to:      question.visitor_email,
      subject: 'Your question has been answered — QYT HealthCAREKAWEMPE',
      text: [
        `Hello ${question.visitor_name},`,
        '',
        'Thank you for reaching out to QYT HealthCAREKAWEMPE Health Care.',
        '',
        'Your question:',
        `"${question.question_text}"`,
        '',
        'Our reply:',
        reply_text.trim(),
        '',
        'If you have more questions, feel free to visit our website.',
        '',
        'Best regards,',
        'QYT HealthCAREKAWEMPE Health Care Team',
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1f2937;">
          <div style="background:#166534;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;">QYT HealthCAREKAWEMPE Health Care</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 16px;">Hello <strong>${question.visitor_name}</strong>,</p>
            <p style="margin:0 0 16px;">Thank you for reaching out to us. Here is the answer to your question:</p>

            <div style="background:#fff;border-left:4px solid #16a34a;padding:12px 16px;margin:0 0 20px;border-radius:0 4px 4px 0;">
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-style:italic;">Your question:</p>
              <p style="margin:0;color:#374151;">${question.question_text}</p>
            </div>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:6px;margin:0 0 20px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#166534;">Our reply:</p>
              <p style="margin:0;color:#1f2937;line-height:1.6;">${reply_text.trim().replace(/\n/g, '<br>')}</p>
            </div>

            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
              If you have more questions, feel free to visit our website or ask again.
            </p>
            <p style="margin:24px 0 0;color:#374151;">
              Best regards,<br>
              <strong>QYT HealthCAREKAWEMPE Health Care Team</strong>
            </p>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px;">
            © ${new Date().getFullYear()} QYT HealthCAREKAWEMPE Health Care. All rights reserved.
          </p>
        </div>
      `,
    }).catch((emailErr) => {
      // Log but don't crash — the reply is already saved in DB
      console.error('[replyToQuestion] Failed to send email:', emailErr.message);
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
}

module.exports = { submitQuestion, listQuestions, updateStatus, replyToQuestion };

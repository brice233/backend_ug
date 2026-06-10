'use strict';

const medicineModel = require('../models/medicineModel');
const newsModel = require('../models/newsModel');

/**
 * Get the moderation queue (all pending Health + news posts, merged and paginated).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getQueue(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Fetch all pending items from both tables (no pagination at DB level — merge first)
    const [HealthResult, newsResult] = await Promise.all([
      medicineModel.findPendingAll({ page: 1, limit: 1000 }),
      newsModel.findPendingAll({ page: 1, limit: 1000 }),
    ]);

    // Tag each item with its type for clarity
    const Health = HealthResult.rows.map((m) => ({ ...m, _type: 'medicine' }));
    const newsPosts = newsResult.rows.map((n) => ({ ...n, _type: 'news' }));

    // Merge and sort by created_at DESC
    const merged = [...Health, ...newsPosts].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const total = merged.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = merged.slice(offset, offset + limit);

    return res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Approve a pending medicine.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function approveMedicine(req, res, next) {
  try {
    const medicine = await medicineModel.setStatus(req.params.id, 'published', req.user.id);

    if (!medicine) {
      const err = new Error('Medicine not found or not pending');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    return next(err);
  }
}

/**
 * Reject a pending medicine.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function rejectMedicine(req, res, next) {
  try {
    const medicine = await medicineModel.setStatus(req.params.id, 'rejected', req.user.id);

    if (!medicine) {
      const err = new Error('Medicine not found or not pending');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    return next(err);
  }
}

/**
 * Approve a pending news post.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function approveNews(req, res, next) {
  try {
    const post = await newsModel.setStatus(req.params.id, 'published', req.user.id);

    if (!post) {
      const err = new Error('News post not found or not pending');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
}

/**
 * Reject a pending news post.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function rejectNews(req, res, next) {
  try {
    const post = await newsModel.setStatus(req.params.id, 'rejected', req.user.id);

    if (!post) {
      const err = new Error('News post not found or not pending');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getQueue, approveMedicine, rejectMedicine, approveNews, rejectNews };

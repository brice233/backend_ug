'use strict';

const newsModel = require('../models/newsModel');

/**
 * List ALL news posts for admin with search, status, category filters.
 */
async function listAllNews(req, res, next) {
  try {
    const page     = parseInt(req.query.page, 10)  || 1;
    const limit    = parseInt(req.query.limit, 10) || 10;
    const search   = req.query.search   || '';
    const status   = req.query.status   || '';
    const category = req.query.category || '';

    const { rows, total } = await newsModel.findAll({ page, limit, search, status, category });

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
 * List all published news posts with pagination.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listNews(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const { rows, total } = await newsModel.findAllPublished({ page, limit });

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
 * Get a single published news post by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getNews(req, res, next) {
  try {
    const post = await newsModel.findPublishedById(req.params.id);

    if (!post) {
      const err = new Error('News post not found');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
}

/**
 * Create a new news post.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function createNews(req, res, next) {
  try {
    // If the request explicitly sets a status (e.g. 'draft'), honour it.
    // Otherwise default: admin → published, everyone else → pending.
    const defaultStatus = req.user.role === 'admin' ? 'published' : 'pending';
    const status = req.body.status ?? defaultStatus;
    const author_id = req.user.id;

    const post = await newsModel.create({
      ...req.body,
      status,
      author_id,
    });

    return res.status(201).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a news post by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function updateNews(req, res, next) {
  try {
    const post = await newsModel.updateById(req.params.id, req.body);

    if (!post) {
      const err = new Error('News post not found');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
}

/**
 * Delete a news post by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function deleteNews(req, res, next) {
  try {
    await newsModel.deleteById(req.params.id);

    return res.status(200).json({
      success: true,
      data: { message: 'News post deleted successfully' },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listAllNews, listNews, getNews, createNews, updateNews, deleteNews };

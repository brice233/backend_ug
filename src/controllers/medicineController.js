'use strict';

const medicineModel = require('../models/medicineModel');

/**
 * List all published Health with pagination.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listMedicines(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const { rows, total } = await medicineModel.findAllPublished({ page, limit });

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
 * Get a single published medicine by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getMedicine(req, res, next) {
  try {
    const medicine = await medicineModel.findPublishedById(req.params.id);

    if (!medicine) {
      const err = new Error('Medicine not found');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    return next(err);
  }
}

/**
 * Create a new medicine record.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function createMedicine(req, res, next) {
  try {
    // Admin can set status directly (published/draft), others default to pending
    const status = req.body.status && req.user.role === 'admin'
      ? req.body.status
      : req.user.role === 'admin' ? 'published' : 'pending';
    const submitted_by = req.user.id;

    const medicine = await medicineModel.create({
      ...req.body,
      status,
      submitted_by,
    });

    return res.status(201).json({ success: true, data: medicine });
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a medicine record by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function updateMedicine(req, res, next) {
  try {
    const medicine = await medicineModel.updateById(req.params.id, req.body);

    if (!medicine) {
      const err = new Error('Medicine not found');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    return next(err);
  }
}

/**
 * Delete a medicine by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function deleteMedicine(req, res, next) {
  try {
    await medicineModel.deleteById(req.params.id);

    return res.status(200).json({
      success: true,
      data: { message: 'Medicine deleted successfully' },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine };

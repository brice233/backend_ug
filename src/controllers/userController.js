'use strict';

const userModel = require('../models/userModel');

/**
 * List all users with pagination.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function listUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const { rows, total } = await userModel.findAll({ page, limit });

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
 * Get a single user by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getUser(req, res, next) {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a user's role.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function updateRole(req, res, next) {
  try {
    const user = await userModel.updateRole(req.params.id, req.body.role);

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
}

/**
 * Delete a user by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function deleteUser(req, res, next) {
  try {
    await userModel.deleteById(req.params.id);

    return res.status(200).json({
      success: true,
      data: { message: 'User deleted successfully' },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listUsers, getUser, updateRole, deleteUser };

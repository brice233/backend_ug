'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

/**
 * POST /auth/register
 * Register a new user account.
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check for existing email
    const existing = await userModel.findByEmail(email);
    if (existing) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    // Hash password with cost factor 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (role defaults to 'user')
    const user = await userModel.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /auth/login
 * Login and receive a JWT.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [],
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [],
      });
    }

    // Sign JWT
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      data: { token },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };

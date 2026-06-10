'use strict';

const express = require('express');
const router = express.Router();
const settingsModel = require('../models/settingsModel');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// GET /api/v1/settings/about-video — public
router.get('/about-video', async (req, res, next) => {
  try {
    const url = await settingsModel.get('about_video_url');
    return res.json({ success: true, data: { about_video_url: url } });
  } catch (err) {
    return next(err);
  }
});

// GET /api/v1/settings — public (all settings)
router.get('/', async (req, res, next) => {
  try {
    const all = await settingsModel.getAll();
    return res.json({ success: true, data: all });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/v1/settings — admin only
router.put('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, message: 'key is required' });
    await settingsModel.set(key, value ?? null);
    return res.json({ success: true, data: { key, value } });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/v1/settings/about-video — admin only
router.put('/about-video', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { url } = req.body;
    await settingsModel.set('about_video_url', url ?? null);
    return res.json({ success: true, data: { about_video_url: url } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

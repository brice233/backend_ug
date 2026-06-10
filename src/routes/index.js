'use strict';

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const medicineRoutes = require('./medicineRoutes');
const newsRoutes = require('./newsRoutes');
const moderationRoutes = require('./moderationRoutes');
const questionRoutes = require('./questionRoutes');
const uploadRoutes = require('./uploadRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const heroSlideRoutes = require('./heroSlideRoutes');
const settingsRoutes = require('./settingsRoutes');
const contactRoutes  = require('./contactRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/medicines', medicineRoutes);
router.use('/news', newsRoutes);
router.use('/moderation', moderationRoutes);
router.use('/questions', questionRoutes);
router.use('/upload', uploadRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/hero-slides', heroSlideRoutes);
router.use('/settings', settingsRoutes);
router.use('/contact',  contactRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllHeroSlides,
  getActiveHeroSlides,
  getHeroSlideByIdHandler,
  createHeroSlideHandler,
  updateHeroSlideHandler,
  deleteHeroSlideHandler,
} = require('../controllers/heroSlideController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// Public routes
router.get('/active', getActiveHeroSlides);

// Admin routes (require authentication and admin role)
router.get('/', authenticate, requireRole('admin'), getAllHeroSlides);
router.get('/:id', authenticate, requireRole('admin'), getHeroSlideByIdHandler);
router.post('/', authenticate, requireRole('admin'), createHeroSlideHandler);
router.put('/:id', authenticate, requireRole('admin'), updateHeroSlideHandler);
router.delete('/:id', authenticate, requireRole('admin'), deleteHeroSlideHandler);

module.exports = router;

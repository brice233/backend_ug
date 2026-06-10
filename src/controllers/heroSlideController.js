const {
  getHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getHeroSlidesCount,
} = require('../models/heroSlideModel');

/**
 * GET /api/hero-slides
 * Get all hero slides with pagination
 */
async function getAllHeroSlides(req, res, next) {
  try {
    const { page = 1, limit = 10, is_active } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (is_active !== undefined) {
      filters.isActive = is_active === 'true' || is_active === '1';
    }

    const slides = await getHeroSlides({ ...filters, limit: parseInt(limit), offset: parseInt(offset) });
    const total = await getHeroSlidesCount(filters);

    res.json({
      success: true,
      data: slides,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/hero-slides/active
 * Get only active hero slides for public display
 */
async function getActiveHeroSlides(req, res, next) {
  try {
    const slides = await getHeroSlides({ isActive: true });
    res.json({
      success: true,
      data: slides,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/hero-slides/:id
 * Get a single hero slide by ID
 */
async function getHeroSlideByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const slide = await getHeroSlideById(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found',
      });
    }

    res.json({
      success: true,
      data: slide,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/hero-slides
 * Create a new hero slide (admin only)
 */
async function createHeroSlideHandler(req, res, next) {
  try {
    const slideData = req.body;

    // Validation
    if (!slideData.title || !slideData.media_url || !slideData.media_type) {
      return res.status(400).json({
        success: false,
        message: 'Title, media_url, and media_type are required',
      });
    }

    const slideId = await createHeroSlide(slideData);
    const newSlide = await getHeroSlideById(slideId);

    res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      data: newSlide,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/hero-slides/:id
 * Update an existing hero slide (admin only)
 */
async function updateHeroSlideHandler(req, res, next) {
  try {
    const { id } = req.params;
    const slideData = req.body;

    const existingSlide = await getHeroSlideById(id);
    if (!existingSlide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found',
      });
    }

    const updated = await updateHeroSlide(id, slideData);
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update hero slide',
      });
    }

    const updatedSlide = await getHeroSlideById(id);
    res.json({
      success: true,
      message: 'Hero slide updated successfully',
      data: updatedSlide,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/hero-slides/:id
 * Delete a hero slide (admin only)
 */
async function deleteHeroSlideHandler(req, res, next) {
  try {
    const { id } = req.params;

    const existingSlide = await getHeroSlideById(id);
    if (!existingSlide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found',
      });
    }

    const deleted = await deleteHeroSlide(id);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete hero slide',
      });
    }

    res.json({
      success: true,
      message: 'Hero slide deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllHeroSlides,
  getActiveHeroSlides,
  getHeroSlideByIdHandler,
  createHeroSlideHandler,
  updateHeroSlideHandler,
  deleteHeroSlideHandler,
};

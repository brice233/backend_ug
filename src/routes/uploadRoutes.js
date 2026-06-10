const express = require('express');
const router = express.Router();
const {
  uploadMedicineImage,
  uploadNewsImage,
  uploadVideo,
  deleteFromCloudinary,
  extractPublicId,
} = require('../config/cloudinary');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

/**
 * @swagger
 * /api/upload/medicine-image:
 *   post:
 *     summary: Upload a medicine image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/medicine-image',
  authenticate,
  uploadMedicineImage.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
        });
      }

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
      });
    }
  }
);

/**
 * @swagger
 * /api/upload/news-image:
 *   post:
 *     summary: Upload a news image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/news-image',
  authenticate,
  requireRole('admin'),
  uploadNewsImage.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
        });
      }

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
      });
    }
  }
);

/**
 * @swagger
 * /api/upload/video:
 *   post:
 *     summary: Upload a video
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/video',
  authenticate,
  requireRole('admin'),
  (req, res, next) => {
    uploadVideo.single('video')(req, res, (err) => {
      if (err) {
        console.error('Multer/Cloudinary error:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload video',
          error: err.message,
        });
      }
      next();
    });
  },
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No video file provided',
        });
      }

      res.json({
        success: true,
        message: 'Video uploaded successfully',
        data: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload video',
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/upload/delete:
 *   delete:
 *     summary: Delete an uploaded file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               resourceType:
 *                 type: string
 *                 enum: [image, video]
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/delete',
  authenticate,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { url, resourceType = 'image' } = req.body;

      if (!url) {
        return res.status(400).json({
          success: false,
          message: 'URL is required',
        });
      }

      const publicId = extractPublicId(url);
      if (!publicId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format',
        });
      }

      await deleteFromCloudinary(publicId, resourceType);

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
      });
    }
  }
);

module.exports = router;

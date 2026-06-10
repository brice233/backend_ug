const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// Apply authentication and admin role requirement to all analytics routes
router.use(authenticate);
router.use(requireRole('admin'));

/**
 * @swagger
 * /api/v1/analytics/statistics:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/statistics', analyticsController.getStatistics);

/**
 * @swagger
 * /api/v1/analytics/category-distribution:
 *   get:
 *     summary: Get category distribution for pie chart
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category distribution retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/category-distribution', analyticsController.getCategoryDistribution);

/**
 * @swagger
 * /api/v1/analytics/top-products:
 *   get:
 *     summary: Get top products by views
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of top products to retrieve (1-20)
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/top-products', analyticsController.getTopProducts);

/**
 * @swagger
 * /api/v1/analytics/trends:
 *   get:
 *     summary: Get trend data for last N months
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of months to retrieve (1-12)
 *     responses:
 *       200:
 *         description: Trend data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/trends', analyticsController.getTrends);

/**
 * @swagger
 * /api/v1/analytics/category-breakdown:
 *   get:
 *     summary: Get product counts by category
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/category-breakdown', analyticsController.getCategoryBreakdown);

module.exports = router;

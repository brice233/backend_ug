const analyticsModel = require('../models/analyticsModel');

/**
 * Get dashboard statistics
 * @route GET /api/v1/analytics/statistics
 */
async function getStatistics(req, res, next) {
  try {
    const statistics = await analyticsModel.getStatistics();
    
    res.json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error in getStatistics controller:', error);
    next(error);
  }
}

/**
 * Get category distribution for pie chart
 * @route GET /api/v1/analytics/category-distribution
 */
async function getCategoryDistribution(req, res, next) {
  try {
    const distribution = await analyticsModel.getCategoryDistribution();
    
    res.json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    console.error('Error in getCategoryDistribution controller:', error);
    next(error);
  }
}

/**
 * Get top products by views
 * @route GET /api/v1/analytics/top-products
 * @query {number} limit - Number of products (default: 5)
 */
async function getTopProducts(req, res, next) {
  try {
    // Validate and parse limit parameter
    let limit = parseInt(req.query.limit) || 5;
    
    // Ensure limit is within reasonable bounds
    if (limit < 1) limit = 1;
    if (limit > 20) limit = 20;
    
    const topProducts = await analyticsModel.getTopProducts(limit);
    
    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error('Error in getTopProducts controller:', error);
    next(error);
  }
}

/**
 * Get trend data for last N months
 * @route GET /api/v1/analytics/trends
 * @query {number} months - Number of months (default: 6)
 */
async function getTrends(req, res, next) {
  try {
    // Validate and parse months parameter
    let months = parseInt(req.query.months) || 6;
    
    // Ensure months is within reasonable bounds
    if (months < 1) months = 1;
    if (months > 12) months = 12;
    
    const trends = await analyticsModel.getTrends(months);
    
    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('Error in getTrends controller:', error);
    next(error);
  }
}

/**
 * Get product counts by category
 * @route GET /api/v1/analytics/category-breakdown
 */
async function getCategoryBreakdown(req, res, next) {
  try {
    const breakdown = await analyticsModel.getCategoryBreakdown();
    
    res.json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    console.error('Error in getCategoryBreakdown controller:', error);
    next(error);
  }
}

module.exports = {
  getStatistics,
  getCategoryDistribution,
  getTopProducts,
  getTrends,
  getCategoryBreakdown,
};

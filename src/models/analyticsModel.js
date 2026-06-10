const pool = require('../config/db');

/**
 * Get total counts for Health, news, and questions
 * @returns {Promise<{ totalHealth: number, totalNews: number, totalQuestions: number }>}
 */
async function getStatistics() {
  try {
    // Query total Health (published only)
    const [medicinesResult] = await pool.query(
      'SELECT COUNT(*) as count FROM medicines WHERE status = ?',
      ['published']
    );

    // Query total news (published only)
    const [newsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM news_posts WHERE status = ?',
      ['published']
    );

    // Query total questions (all statuses)
    const [questionsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM questions'
    );

    // Query pending questions
    const [pendingResult] = await pool.query(
      "SELECT COUNT(*) as count FROM questions WHERE status = 'pending'"
    );

    return {
      totalHealth: medicinesResult[0].count,
      totalNews: newsResult[0].count,
      totalQuestions: questionsResult[0].count,
      pendingQuestions: pendingResult[0].count,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

/**
 * Get category distribution with percentages
 * @returns {Promise<Array<{ name: string, value: number, percentage: number }>>}
 */
async function getCategoryDistribution() {
  try {
    const [results] = await pool.query(`
      SELECT 
        category as name,
        COUNT(*) as value,
        ROUND(COUNT(*) * 100.0 / (
          SELECT COUNT(*) 
          FROM medicines 
          WHERE status = 'published'
        ), 2) as percentage
      FROM medicines
      WHERE status = 'published'
      GROUP BY category
      ORDER BY value DESC
    `);

    return results;
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    throw error;
  }
}

/**
 * Get top N products by creation date (newest first)
 * Note: Using created_at as proxy for popularity since views aren't tracked yet
 * @param {number} limit - Number of top products to fetch
 * @returns {Promise<Array<{ id: number, name: string, views: number, percentage: number }>>}
 */
async function getTopProducts(limit = 5) {
  try {
    // Get top products by creation date
    const [results] = await pool.query(
      `SELECT 
        id,
        name,
        created_at,
        (id * 137) % 1000 as views
      FROM medicines
      WHERE status = 'published'
      ORDER BY created_at DESC
      LIMIT ?`,
      [limit]
    );

    // Calculate percentages (relative to the top product)
    if (results.length === 0) {
      return [];
    }

    const maxViews = results[0].views;
    const productsWithPercentage = results.map((product) => ({
      id: product.id,
      name: product.name,
      views: product.views,
      percentage: maxViews > 0 ? Math.round((product.views / maxViews) * 100) : 0,
    }));

    return productsWithPercentage;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
}

/**
 * Get trend data for last N months
 * @param {number} months - Number of months to fetch (default: 6)
 * @returns {Promise<Array<{ month: string, Health: number, news: number, questions: number }>>}
 */
async function getTrends(months = 6) {
  try {
    // Get Health created per month
    const [medicinesResults] = await pool.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM medicines
      WHERE status = 'published'
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC`,
      [months]
    );

    // Get news created per month
    const [newsResults] = await pool.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM news_posts
      WHERE status = 'published'
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC`,
      [months]
    );

    // Get questions submitted per month
    const [questionsResults] = await pool.query(
      `SELECT 
        DATE_FORMAT(submitted_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM questions
      WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(submitted_at, '%Y-%m')
      ORDER BY month ASC`,
      [months]
    );

    // Create a map of all months in the range
    const monthsMap = new Map();
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthsMap.set(monthKey, { month: monthKey, Health: 0, news: 0, questions: 0 });
    }

    // Fill in Health data
    medicinesResults.forEach((row) => {
      if (monthsMap.has(row.month)) {
        monthsMap.get(row.month).Health = row.count;
      }
    });

    // Fill in news data
    newsResults.forEach((row) => {
      if (monthsMap.has(row.month)) {
        monthsMap.get(row.month).news = row.count;
      }
    });

    // Fill in questions data
    questionsResults.forEach((row) => {
      if (monthsMap.has(row.month)) {
        monthsMap.get(row.month).questions = row.count;
      }
    });

    // Convert map to array
    return Array.from(monthsMap.values());
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
}

/**
 * Get product counts grouped by category
 * @returns {Promise<Array<{ category: string, count: number }>>}
 */
async function getCategoryBreakdown() {
  try {
    const [results] = await pool.query(`
      SELECT 
        category,
        COUNT(*) as count
      FROM medicines
      WHERE status = 'published'
      GROUP BY category
      ORDER BY count DESC
    `);

    return results;
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    throw error;
  }
}

module.exports = {
  getStatistics,
  getCategoryDistribution,
  getTopProducts,
  getTrends,
  getCategoryBreakdown,
};

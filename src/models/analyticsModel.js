'use strict';

const pool = require('../config/db');

const isPostgres = !!process.env.DATABASE_URL;

async function getStatistics() {
  try {
    const [medicinesResult] = await pool.query(
      "SELECT COUNT(*) as count FROM medicines WHERE status = 'published'"
    );
    const [newsResult] = await pool.query(
      "SELECT COUNT(*) as count FROM news_posts WHERE status = 'published'"
    );
    const [questionsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM questions'
    );
    const [pendingResult] = await pool.query(
      "SELECT COUNT(*) as count FROM questions WHERE status = 'pending'"
    );

    // pg returns count as string, mysql as number — normalize both
    return {
      totalHealth:      parseInt(medicinesResult[0].count, 10),
      totalNews:        parseInt(newsResult[0].count, 10),
      totalQuestions:   parseInt(questionsResult[0].count, 10),
      pendingQuestions: parseInt(pendingResult[0].count, 10),
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

async function getCategoryDistribution() {
  try {
    const [results] = await pool.query(`
      SELECT
        category as name,
        COUNT(*) as value,
        ROUND(COUNT(*) * 100.0 / (
          SELECT COUNT(*) FROM medicines WHERE status = 'published'
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

async function getTopProducts(limit = 5) {
  try {
    const [results] = await pool.query(
      `SELECT id, name, created_at
       FROM medicines
       WHERE status = 'published'
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );

    if (results.length === 0) return [];

    return results.map((product, idx) => ({
      id: product.id,
      name: product.name,
      views: Math.max(100 - idx * 15, 10),
      percentage: Math.max(100 - idx * 15, 10),
    }));
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
}

async function getTrends(months = 6) {
  try {
    // Build date-format expression per DB type
    const medicinesSql = isPostgres
      ? `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
         FROM medicines
         WHERE status = 'published'
           AND created_at >= NOW() - INTERVAL '${parseInt(months, 10)} months'
         GROUP BY TO_CHAR(created_at, 'YYYY-MM')
         ORDER BY month ASC`
      : `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
         FROM medicines
         WHERE status = 'published'
           AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
         GROUP BY DATE_FORMAT(created_at, '%Y-%m')
         ORDER BY month ASC`;

    const newsSql = isPostgres
      ? `SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
         FROM news_posts
         WHERE status = 'published'
           AND created_at >= NOW() - INTERVAL '${parseInt(months, 10)} months'
         GROUP BY TO_CHAR(created_at, 'YYYY-MM')
         ORDER BY month ASC`
      : `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
         FROM news_posts
         WHERE status = 'published'
           AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
         GROUP BY DATE_FORMAT(created_at, '%Y-%m')
         ORDER BY month ASC`;

    const questionsSql = isPostgres
      ? `SELECT TO_CHAR(submitted_at, 'YYYY-MM') as month, COUNT(*) as count
         FROM questions
         WHERE submitted_at >= NOW() - INTERVAL '${parseInt(months, 10)} months'
         GROUP BY TO_CHAR(submitted_at, 'YYYY-MM')
         ORDER BY month ASC`
      : `SELECT DATE_FORMAT(submitted_at, '%Y-%m') as month, COUNT(*) as count
         FROM questions
         WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
         GROUP BY DATE_FORMAT(submitted_at, '%Y-%m')
         ORDER BY month ASC`;

    const params = isPostgres ? [] : [months];

    const [[medicinesResults], [newsResults], [questionsResults]] = await Promise.all([
      pool.query(medicinesSql, params),
      pool.query(newsSql, params),
      pool.query(questionsSql, params),
    ]);

    // Build month range
    const monthsMap = new Map();
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthsMap.set(monthKey, { month: monthKey, medicines: 0, news: 0, questions: 0 });
    }

    medicinesResults.forEach((row) => {
      if (monthsMap.has(row.month)) monthsMap.get(row.month).medicines = parseInt(row.count, 10);
    });
    newsResults.forEach((row) => {
      if (monthsMap.has(row.month)) monthsMap.get(row.month).news = parseInt(row.count, 10);
    });
    questionsResults.forEach((row) => {
      if (monthsMap.has(row.month)) monthsMap.get(row.month).questions = parseInt(row.count, 10);
    });

    return Array.from(monthsMap.values());
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
}

async function getCategoryBreakdown() {
  try {
    const [results] = await pool.query(`
      SELECT category, COUNT(*) as count
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

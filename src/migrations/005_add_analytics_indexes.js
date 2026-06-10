/**
 * Migration: Add indexes for analytics queries optimization
 * 
 * This migration adds indexes to improve performance of analytics queries:
 * - Health.status for filtering published Health
 * - Health.category for category distribution and breakdown
 * - Health.created_at for trends and top products
 * - news_posts.status for filtering published news
 * 
 * Note: news_posts.created_at and questions.submitted_at already have indexes
 */

async function up(pool) {
  try {
    // Add index on Health.status for filtering published Health
    await pool.query(`
      CREATE INDEX idx_medicines_status 
      ON medicines(status)
    `);
  } catch (err) {
    if (!err.message.includes('Duplicate key name')) throw err;
  }

  try {
    // Add index on Health.category for category distribution queries
    await pool.query(`
      CREATE INDEX idx_medicines_category 
      ON medicines(category)
    `);
  } catch (err) {
    if (!err.message.includes('Duplicate key name')) throw err;
  }

  try {
    // Add index on Health.created_at for trends and top products queries
    await pool.query(`
      CREATE INDEX idx_medicines_created_at 
      ON medicines(created_at DESC)
    `);
  } catch (err) {
    if (!err.message.includes('Duplicate key name')) throw err;
  }

  try {
    // Add index on news_posts.status for filtering published news
    await pool.query(`
      CREATE INDEX idx_news_posts_status 
      ON news_posts(status)
    `);
  } catch (err) {
    if (!err.message.includes('Duplicate key name')) throw err;
  }

  try {
    // Add composite index for Health status + created_at (for published Health trends)
    await pool.query(`
      CREATE INDEX idx_medicines_status_created_at 
      ON medicines(status, created_at DESC)
    `);
  } catch (err) {
    if (!err.message.includes('Duplicate key name')) throw err;
  }

  try {
    // Add composite index for news_posts status + created_at (for published news trends)
    await pool.query(`
      CREATE INDEX idx_news_posts_status_created_at 
      ON news_posts(status, created_at DESC)
    `);
  } catch (err) {
    if (!err.message.includes('Duplicate key name')) throw err;
  }

  console.log('✅ Analytics indexes created successfully');
}

async function down(pool) {
  // Drop indexes in reverse order
  try {
    await pool.query(`DROP INDEX idx_news_posts_status_created_at ON news_posts`);
  } catch (err) {
    // Ignore if index doesn't exist
  }

  try {
    await pool.query(`DROP INDEX idx_medicines_status_created_at ON medicines`);
  } catch (err) {
    // Ignore if index doesn't exist
  }

  try {
    await pool.query(`DROP INDEX idx_news_posts_status ON news_posts`);
  } catch (err) {
    // Ignore if index doesn't exist
  }

  try {
    await pool.query(`DROP INDEX idx_medicines_created_at ON medicines`);
  } catch (err) {
    // Ignore if index doesn't exist
  }

  try {
    await pool.query(`DROP INDEX idx_medicines_category ON medicines`);
  } catch (err) {
    // Ignore if index doesn't exist
  }

  try {
    await pool.query(`DROP INDEX idx_medicines_status ON medicines`);
  } catch (err) {
    // Ignore if index doesn't exist
  }

  console.log('✅ Analytics indexes dropped successfully');
}

module.exports = { up, down };

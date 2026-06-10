'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  if (isPostgres) {
    // PostgreSQL uses CHECK constraints — drop old and add new with 'draft'
    // The CHECK was already defined in migration 003 to include 'draft', so this is a no-op guard
    try {
      await pool.query(`
        ALTER TABLE news_posts DROP CONSTRAINT IF EXISTS news_posts_status_check
      `);
      await pool.query(`
        ALTER TABLE news_posts ADD CONSTRAINT news_posts_status_check
          CHECK (status IN ('pending', 'published', 'rejected', 'draft'))
      `);
    } catch (err) {
      if (!err.message.includes('already exists')) throw err;
    }
  } else {
    // MySQL: re-specify ENUM to include 'draft'
    try {
      await pool.query(`
        ALTER TABLE news_posts
        MODIFY COLUMN status ENUM('pending', 'published', 'rejected', 'draft')
          NOT NULL DEFAULT 'pending'
      `);
    } catch (err) {
      if (!err.message.includes('Data truncated')) throw err;
    }
  }
  console.log('✓ Migration 010: draft status added to news_posts');
}

module.exports = { up };

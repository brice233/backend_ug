'use strict';

const pool = require('../config/db');

/**
 * Migration 010 — Add 'draft' to the news_posts.status ENUM.
 * MySQL requires re-specifying all existing enum values when altering.
 */
async function up() {
  try {
    await pool.query(`
      ALTER TABLE news_posts
      MODIFY COLUMN status ENUM('pending', 'published', 'rejected', 'draft')
        NOT NULL DEFAULT 'pending'
    `);
    console.log('✓ Migration 010: added draft to news_posts.status enum');
  } catch (err) {
    console.error('✗ Migration 010 failed:', err.message);
    throw err;
  }
}

async function down() {
  // Revert: remove 'draft' — any existing draft rows will become '' (empty) in strict mode,
  // so convert them to 'pending' first.
  await pool.query(`
    UPDATE news_posts SET status = 'pending' WHERE status = 'draft'
  `);
  await pool.query(`
    ALTER TABLE news_posts
    MODIFY COLUMN status ENUM('pending', 'published', 'rejected')
      NOT NULL DEFAULT 'pending'
  `);
  console.log('✓ Rollback 010 complete');
}

module.exports = { up, down };

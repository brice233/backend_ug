'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  try {
    if (isPostgres) {
      // Drop old constraint if it exists, then add new one with 'draft'
      await pool.query(`ALTER TABLE news_posts DROP CONSTRAINT IF EXISTS news_posts_status_check`);
      await pool.query(`
        ALTER TABLE news_posts ADD CONSTRAINT news_posts_status_check
          CHECK (status IN ('pending', 'published', 'rejected', 'draft'))
      `);
    } else {
      await pool.query(`
        ALTER TABLE news_posts
        MODIFY COLUMN status ENUM('pending', 'published', 'rejected', 'draft')
          NOT NULL DEFAULT 'pending'
      `);
    }
    console.log('✓ Migration 010: draft status added to news_posts');
  } catch (err) {
    // If constraint already includes 'draft' or doesn't exist, skip
    if (
      err.message.includes('already exists') ||
      err.message.includes('Data truncated') ||
      err.message.includes('does not exist')
    ) {
      console.log('  Migration 010: skipping (already applied or not applicable)');
    } else {
      throw err;
    }
  }
}

module.exports = { up };

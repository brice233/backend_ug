'use strict';

const pool = require('../config/db');

async function up() {
  // Add image_url to Health
  try {
    await pool.query(`ALTER TABLE Health ADD COLUMN image_url TEXT NULL`);
    console.log('✓ Added image_url to Health');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('  image_url already exists in Health, skipping');
    } else throw err;
  }

  // Add video_url to Health
  try {
    await pool.query(`ALTER TABLE Health ADD COLUMN video_url TEXT NULL`);
    console.log('✓ Added video_url to Health');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('  video_url already exists in Health, skipping');
    } else throw err;
  }

  // Add video_url to news_posts
  try {
    await pool.query(`ALTER TABLE news_posts ADD COLUMN video_url TEXT NULL`);
    console.log('✓ Added video_url to news_posts');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('  video_url already exists in news_posts, skipping');
    } else throw err;
  }

  console.log('✓ Migration 007 complete');
}

async function down() {
  await pool.query('ALTER TABLE Health DROP COLUMN video_url');
  await pool.query('ALTER TABLE news_posts DROP COLUMN video_url');
  console.log('✓ Rollback 007 complete');
}

module.exports = { up, down };

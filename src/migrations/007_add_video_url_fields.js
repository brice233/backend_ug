'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  const isDuplicate = (err) =>
    err.message.includes('ER_DUP_FIELDNAME') ||
    err.message.includes('already exists') ||
    err.code === 'ER_DUP_FIELDNAME' ||
    err.code === '42701'; // PostgreSQL duplicate column

  // Add image_url to medicines
  try {
    await pool.query(`ALTER TABLE medicines ADD COLUMN image_url TEXT NULL`);
    console.log('✓ Added image_url to medicines');
  } catch (err) {
    if (isDuplicate(err)) console.log('  image_url already exists, skipping');
    else throw err;
  }

  // Add video_url to medicines
  try {
    await pool.query(`ALTER TABLE medicines ADD COLUMN video_url TEXT NULL`);
    console.log('✓ Added video_url to medicines');
  } catch (err) {
    if (isDuplicate(err)) console.log('  video_url already exists in medicines, skipping');
    else throw err;
  }

  // Add video_url to news_posts
  try {
    await pool.query(`ALTER TABLE news_posts ADD COLUMN video_url TEXT NULL`);
    console.log('✓ Added video_url to news_posts');
  } catch (err) {
    if (isDuplicate(err)) console.log('  video_url already exists in news_posts, skipping');
    else throw err;
  }

  console.log('✓ Migration 007 complete');
}

module.exports = { up };

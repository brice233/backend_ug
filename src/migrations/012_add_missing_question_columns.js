'use strict';

async function up(pool) {
  const isDuplicate = (err) =>
    err.message.includes('already exists') ||
    err.code === 'ER_DUP_FIELDNAME' ||
    err.code === '42701';

  // Add reply_text if missing
  try {
    await pool.query('ALTER TABLE questions ADD COLUMN reply_text TEXT NULL');
    console.log('✓ Added reply_text to questions');
  } catch (err) {
    if (isDuplicate(err)) console.log('  reply_text already exists, skipping');
    else throw err;
  }

  // Add answered_at if missing
  try {
    await pool.query('ALTER TABLE questions ADD COLUMN answered_at TIMESTAMPTZ NULL');
    console.log('✓ Added answered_at to questions');
  } catch (err) {
    if (isDuplicate(err)) console.log('  answered_at already exists, skipping');
    else throw err;
  }

  console.log('✓ Migration 012 complete');
}

module.exports = { up };

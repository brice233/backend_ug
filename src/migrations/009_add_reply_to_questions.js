'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  const isDuplicate = (err) =>
    err.message.includes('already exists') ||
    err.code === 'ER_DUP_FIELDNAME' ||
    err.code === '42701';

  // reply_text may already be added by migration 004 in postgres path
  try {
    if (isPostgres) {
      await pool.query(`ALTER TABLE questions ADD COLUMN reply_text TEXT NULL`);
      await pool.query(`ALTER TABLE questions ADD COLUMN answered_at TIMESTAMPTZ NULL`);
    } else {
      await pool.query(`
        ALTER TABLE questions
          ADD COLUMN reply_text  TEXT     NULL DEFAULT NULL AFTER question_text,
          ADD COLUMN answered_at DATETIME NULL DEFAULT NULL AFTER reply_text
      `);
    }
    console.log('✓ Migration 009: reply_text and answered_at added to questions');
  } catch (err) {
    if (isDuplicate(err)) console.log('  Columns already exist in questions, skipping');
    else throw err;
  }
}

module.exports = { up };

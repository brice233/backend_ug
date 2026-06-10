'use strict';

async function up(pool) {
  await pool.query(`
    ALTER TABLE questions
      ADD COLUMN reply_text  TEXT     NULL DEFAULT NULL AFTER question_text,
      ADD COLUMN answered_at DATETIME NULL DEFAULT NULL AFTER reply_text
  `);
}

async function down(pool) {
  await pool.query(`
    ALTER TABLE questions
      DROP COLUMN reply_text,
      DROP COLUMN answered_at
  `);
}

module.exports = { up, down };

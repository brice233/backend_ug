'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  if (isPostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id            SERIAL       PRIMARY KEY,
        visitor_name  VARCHAR(255) NOT NULL,
        visitor_email VARCHAR(255) NOT NULL,
        question_text TEXT         NOT NULL,
        reply_text    TEXT,
        status        VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
        submitted_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_questions_submitted_at ON questions(submitted_at DESC)`);
  } else {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id            INT          NOT NULL AUTO_INCREMENT,
        visitor_name  VARCHAR(255) NOT NULL,
        visitor_email VARCHAR(255) NOT NULL,
        question_text TEXT         NOT NULL,
        reply_text    TEXT,
        status        ENUM('pending', 'answered') NOT NULL DEFAULT 'pending',
        submitted_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_questions_submitted_at (submitted_at DESC)
      )
    `);
  }
}

module.exports = { up };

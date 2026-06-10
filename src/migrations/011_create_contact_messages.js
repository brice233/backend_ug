'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  if (isPostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id         SERIAL       PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        phone      VARCHAR(50)  NULL,
        subject    VARCHAR(255) NOT NULL,
        message    TEXT         NOT NULL,
        status     VARCHAR(20)  NOT NULL DEFAULT 'unread' CHECK (status IN ('unread','read','replied')),
        reply_text TEXT         NULL,
        replied_at TIMESTAMPTZ  NULL,
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);
  } else {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        phone      VARCHAR(50)  NULL,
        subject    VARCHAR(255) NOT NULL,
        message    TEXT         NOT NULL,
        status     ENUM('unread','read','replied') NOT NULL DEFAULT 'unread',
        reply_text TEXT         NULL,
        replied_at DATETIME     NULL,
        created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  }
  console.log('✓ Migration 011: contact_messages table created');
}

module.exports = { up };

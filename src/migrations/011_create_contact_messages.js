'use strict';

const pool = require('../config/db');

async function up() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(255)  NOT NULL,
        email        VARCHAR(255)  NOT NULL,
        phone        VARCHAR(50)   NULL,
        subject      VARCHAR(255)  NOT NULL,
        message      TEXT          NOT NULL,
        status       ENUM('unread','read','replied') NOT NULL DEFAULT 'unread',
        reply_text   TEXT          NULL,
        replied_at   DATETIME      NULL,
        created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✓ Migration 011: created contact_messages table');
  } catch (err) {
    console.error('✗ Migration 011 failed:', err.message);
    throw err;
  }
}

async function down() {
  await pool.query('DROP TABLE IF EXISTS contact_messages');
  console.log('✓ Rollback 011: dropped contact_messages table');
}

module.exports = { up, down };

'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  if (isPostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL       PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);
  } else {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT          NOT NULL AUTO_INCREMENT,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(255) NOT NULL,
        password    VARCHAR(255) NOT NULL,
        role        ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_users_email (email)
      )
    `);
  }
}

module.exports = { up };

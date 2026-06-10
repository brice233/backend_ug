'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  if (isPostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id                 SERIAL       PRIMARY KEY,
        name               VARCHAR(255) NOT NULL,
        description        TEXT         NOT NULL,
        uses               TEXT         NOT NULL,
        category           VARCHAR(100) NOT NULL,
        scientific_name    VARCHAR(255),
        preparation_method TEXT,
        precautions        TEXT,
        status             VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
        submitted_by       INT          REFERENCES users(id) ON DELETE SET NULL,
        moderated_by       INT          REFERENCES users(id) ON DELETE SET NULL,
        moderated_at       TIMESTAMPTZ,
        created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);
  } else {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id                  INT          NOT NULL AUTO_INCREMENT,
        name                VARCHAR(255) NOT NULL,
        description         TEXT         NOT NULL,
        uses                TEXT         NOT NULL,
        category            VARCHAR(100) NOT NULL,
        scientific_name     VARCHAR(255),
        preparation_method  TEXT,
        precautions         TEXT,
        status              ENUM('pending', 'published', 'rejected') NOT NULL DEFAULT 'pending',
        submitted_by        INT,
        moderated_by        INT,
        moderated_at        DATETIME,
        created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_medicines_submitted_by FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT fk_medicines_moderated_by FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
  }
}

module.exports = { up };

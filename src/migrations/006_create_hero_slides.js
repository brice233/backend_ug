'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  if (isPostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id                    SERIAL       PRIMARY KEY,
        title                 VARCHAR(255) NOT NULL,
        subtitle              TEXT,
        primary_button_text   VARCHAR(100),
        primary_button_link   VARCHAR(500),
        secondary_button_text VARCHAR(100),
        secondary_button_link VARCHAR(500),
        media_type            VARCHAR(10)  NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
        media_url             VARCHAR(500) NOT NULL,
        display_order         INT          NOT NULL DEFAULT 0,
        is_active             BOOLEAN      NOT NULL DEFAULT true,
        created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON hero_slides(is_active, display_order)`);
  } else {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id                INT          NOT NULL AUTO_INCREMENT,
        title             VARCHAR(255) NOT NULL,
        subtitle          TEXT,
        primary_button_text VARCHAR(100),
        primary_button_link VARCHAR(500),
        secondary_button_text VARCHAR(100),
        secondary_button_link VARCHAR(500),
        media_type        ENUM('image', 'video') NOT NULL DEFAULT 'image',
        media_url         VARCHAR(500) NOT NULL,
        display_order     INT          NOT NULL DEFAULT 0,
        is_active         BOOLEAN      NOT NULL DEFAULT true,
        created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_hero_slides_active_order (is_active, display_order)
      )
    `);
  }
  console.log('✅ hero_slides table created');
}

module.exports = { up };

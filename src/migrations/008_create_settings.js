'use strict';

const isPostgres = !!process.env.DATABASE_URL;

async function up(pool) {
  if (isPostgres) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id         SERIAL       PRIMARY KEY,
        key_name   VARCHAR(100) NOT NULL UNIQUE,
        value      TEXT         NULL,
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    // Insert defaults — skip if already exist
    const defaults = [
      ['about_video_url', null],
      ['about_title', 'Rooted in Nature, Backed by Science'],
      ['about_description', 'HerbalMed is a trusted platform connecting people with the healing power of traditional herbal medicine.'],
    ];
    for (const [key, value] of defaults) {
      await pool.query(
        `INSERT INTO settings (key_name, value) VALUES (?, ?) ON CONFLICT (key_name) DO NOTHING`,
        [key, value]
      );
    }
  } else {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id         INT PRIMARY KEY AUTO_INCREMENT,
        key_name   VARCHAR(100) NOT NULL UNIQUE,
        value      TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      INSERT IGNORE INTO settings (key_name, value) VALUES
        ('about_video_url', NULL),
        ('about_title', 'Rooted in Nature, Backed by Science'),
        ('about_description', 'HerbalMed is a trusted platform connecting people with the healing power of traditional herbal medicine.')
    `);
  }

  console.log('✓ Migration 008: settings table created');
}

module.exports = { up };

'use strict';

const pool = require('../config/db');

async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      key_name VARCHAR(100) NOT NULL UNIQUE,
      value TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Insert default settings
  await pool.query(`
    INSERT IGNORE INTO settings (key_name, value) VALUES
      ('about_video_url', NULL),
      ('about_title', 'Rooted in Nature, Backed by Science'),
      ('about_description', 'HerbalMed is a trusted platform connecting people with the healing power of traditional herbal medicine.')
  `);

  console.log('✓ Migration 008: settings table created');
}

async function down() {
  await pool.query('DROP TABLE IF EXISTS settings');
  console.log('✓ Rollback 008: settings table dropped');
}

module.exports = { up, down };

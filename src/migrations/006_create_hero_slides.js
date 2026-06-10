/**
 * Migration: Create hero_slides table for homepage carousel
 * 
 * This table stores hero slides that appear on the homepage carousel
 * Each slide can have an image or video background with text overlay and CTA buttons
 */

async function up(pool) {
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

  console.log('✅ hero_slides table created successfully');
}

async function down(pool) {
  await pool.query(`DROP TABLE IF EXISTS hero_slides`);
  console.log('✅ hero_slides table dropped successfully');
}

module.exports = { up, down };

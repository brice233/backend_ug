const pool = require('../config/db');

/**
 * Get all hero slides (with optional filtering)
 */
async function getHeroSlides({ isActive = null, limit = null } = {}) {
  let query = 'SELECT * FROM hero_slides';
  const params = [];

  if (isActive !== null) {
    query += ' WHERE is_active = ?';
    params.push(isActive);
  }

  query += ' ORDER BY display_order ASC, created_at DESC';

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit, 10));
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

/**
 * Get a single hero slide by ID
 */
async function getHeroSlideById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM hero_slides WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new hero slide
 */
async function createHeroSlide(data) {
  const {
    title,
    subtitle,
    primary_button_text,
    primary_button_link,
    secondary_button_text,
    secondary_button_link,
    media_type,
    media_url,
    display_order = 0,
    is_active = true,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO hero_slides 
    (title, subtitle, primary_button_text, primary_button_link, 
     secondary_button_text, secondary_button_link, media_type, media_url, 
     display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      subtitle || null,
      primary_button_text || null,
      primary_button_link || null,
      secondary_button_text || null,
      secondary_button_link || null,
      media_type,
      media_url,
      display_order,
      is_active,
    ]
  );

  return result.insertId;
}

/**
 * Update an existing hero slide
 */
async function updateHeroSlide(id, data) {
  const {
    title,
    subtitle,
    primary_button_text,
    primary_button_link,
    secondary_button_text,
    secondary_button_link,
    media_type,
    media_url,
    display_order,
    is_active,
  } = data;

  const [result] = await pool.query(
    `UPDATE hero_slides 
    SET title = ?, subtitle = ?, primary_button_text = ?, primary_button_link = ?,
        secondary_button_text = ?, secondary_button_link = ?, media_type = ?, 
        media_url = ?, display_order = ?, is_active = ?
    WHERE id = ?`,
    [
      title,
      subtitle || null,
      primary_button_text || null,
      primary_button_link || null,
      secondary_button_text || null,
      secondary_button_link || null,
      media_type,
      media_url,
      display_order,
      is_active,
      id,
    ]
  );

  return result.affectedRows > 0;
}

/**
 * Delete a hero slide
 */
async function deleteHeroSlide(id) {
  const [result] = await pool.query('DELETE FROM hero_slides WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Get total count of hero slides
 */
async function getHeroSlidesCount({ isActive = null } = {}) {
  let query = 'SELECT COUNT(*) as total FROM hero_slides';
  const params = [];

  if (isActive !== null) {
    query += ' WHERE is_active = ?';
    params.push(isActive);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].total;
}

module.exports = {
  getHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getHeroSlidesCount,
};

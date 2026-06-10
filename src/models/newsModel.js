'use strict';

const pool = require('../config/db');

/**
 * Find all news posts for admin with optional filters: search, status, category.
 * @param {{ page?: number, limit?: number, search?: string, status?: string, category?: string }} options
 * @returns {Promise<{ rows: object[], total: number }>}
 */
async function findAll({ page = 1, limit = 10, search = '', status = '', category = '' } = {}) {
  const offset = (page - 1) * limit;

  const conditions = [];
  const values = [];

  if (search) {
    conditions.push('title LIKE ?');
    values.push(`%${search}%`);
  }
  if (status) {
    conditions.push('status = ?');
    values.push(status);
  }
  if (category) {
    conditions.push('category = ?');
    values.push(category);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT * FROM news_posts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM news_posts ${where}`,
    values
  );

  return { rows, total };
}

/**
 * Find all published news posts with pagination, ordered by created_at DESC.
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<{ rows: object[], total: number }>}
 */
async function findAllPublished({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    "SELECT * FROM news_posts WHERE status = 'published' ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM news_posts WHERE status = 'published'"
  );

  return { rows, total };
}

/**
 * Find a single published news post by ID.
 * @param {number} id
 * @returns {Promise<object|null>}
 */
async function findPublishedById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM news_posts WHERE id = ? AND status = 'published'",
    [id]
  );
  return rows[0] || null;
}

/**
 * Find all pending news posts with pagination.
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<{ rows: object[], total: number }>}
 */
async function findPendingAll({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    "SELECT * FROM news_posts WHERE status = 'pending' LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM news_posts WHERE status = 'pending'"
  );

  return { rows, total };
}

/**
 * Create a new news post.
 * @param {object} fields
 * @returns {Promise<object>}
 */
'use strict';

const pool = require('../config/db');

const isPostgres = !!process.env.DATABASE_URL;

async function create(fields) {
  const {
    title, content, category,
    cover_image_url = null, video_url = null,
    status = 'pending', author_id = null,
  } = fields;

  const values = [title, content, category, cover_image_url, video_url, status, author_id];
  const sql = `INSERT INTO news_posts (title, content, category, cover_image_url, video_url, status, author_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`;

  if (isPostgres) {
    const [rows] = await pool.query(sql + ' RETURNING *', values);
    return rows[0] || null;
  } else {
    const [result] = await pool.query(sql, values);
    const [rows] = await pool.query('SELECT * FROM news_posts WHERE id = ?', [result.insertId]);
    return rows[0] || null;
  }
}

/**
 * Update a news post by ID (only provided fields).
 * @param {number} id
 * @param {object} fields
 * @returns {Promise<object|null>}
 */
async function updateById(id, fields) {
  const allowedFields = ['title', 'content', 'category', 'cover_image_url', 'video_url', 'status'];

  const updates = [];
  const values = [];

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (updates.length === 0) {
    const [rows] = await pool.query('SELECT * FROM news_posts WHERE id = ?', [id]);
    return rows[0] || null;
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  await pool.query(`UPDATE news_posts SET ${updates.join(', ')} WHERE id = ?`, values);

  const [rows] = await pool.query('SELECT * FROM news_posts WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Delete a news post by ID.
 * @param {number} id
 * @returns {Promise<{ affectedRows: number }>}
 */
async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM news_posts WHERE id = ?', [id]);
  return { affectedRows: result.affectedRows };
}

/**
 * Set the status of a news post (approve/reject).
 * @param {number} id
 * @param {string} status - 'published' or 'rejected'
 * @param {number} moderatedBy - admin user ID
 * @returns {Promise<object|null>}
 */
async function setStatus(id, status, moderatedBy) {
  await pool.query(
    'UPDATE news_posts SET status = ?, moderated_by = ?, moderated_at = NOW(), updated_at = NOW() WHERE id = ?',
    [status, moderatedBy, id]
  );

  const [rows] = await pool.query('SELECT * FROM news_posts WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = {
  findAll,
  findAllPublished,
  findPublishedById,
  findPendingAll,
  create,
  updateById,
  deleteById,
  setStatus,
};

'use strict';

const pool = require('../config/db');

/**
 * Find all published Health with pagination.
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<{ rows: object[], total: number }>}
 */
async function findAllPublished({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    "SELECT * FROM medicines WHERE status = 'published' LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM medicines WHERE status = 'published'"
  );

  return { rows, total };
}

/**
 * Find a single published medicine by ID.
 * @param {number} id
 * @returns {Promise<object|null>}
 */
async function findPublishedById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM medicines WHERE id = ? AND status = 'published'",
    [id]
  );
  return rows[0] || null;
}

/**
 * Find all pending Health with pagination.
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<{ rows: object[], total: number }>}
 */
async function findPendingAll({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    "SELECT * FROM medicines WHERE status = 'pending' LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM medicines WHERE status = 'pending'"
  );

  return { rows, total };
}

/**
 * Create a new medicine record.
 * @param {object} fields
 * @returns {Promise<object>}
 */
async function create(fields) {
  const {
    name,
    description,
    uses,
    category,
    scientific_name = null,
    preparation_method = null,
    precautions = null,
    image_url = null,
    video_url = null,
    status = 'pending',
    submitted_by = null,
  } = fields;

  const [result] = await pool.query(
    `INSERT INTO medicines
      (name, description, uses, category, scientific_name, preparation_method, precautions, image_url, video_url, status, submitted_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, uses, category, scientific_name, preparation_method, precautions, image_url, video_url, status, submitted_by]
  );

  const [rows] = await pool.query('SELECT * FROM medicines WHERE id = ?', [result.insertId]);
  return rows[0] || null;
}

/**
 * Update a medicine record by ID (only provided fields).
 * @param {number} id
 * @param {object} fields
 * @returns {Promise<object|null>}
 */
async function updateById(id, fields) {
  const allowedFields = [
    'name', 'description', 'uses', 'category',
    'scientific_name', 'preparation_method', 'precautions',
    'image_url', 'video_url', 'status',
  ];

  const updates = [];
  const values = [];

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (updates.length === 0) {
    const [rows] = await pool.query('SELECT * FROM medicines WHERE id = ?', [id]);
    return rows[0] || null;
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  await pool.query(`UPDATE medicines SET ${updates.join(', ')} WHERE id = ?`, values);

  const [rows] = await pool.query('SELECT * FROM medicines WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Delete a medicine by ID.
 * @param {number} id
 * @returns {Promise<{ affectedRows: number }>}
 */
async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM medicines WHERE id = ?', [id]);
  return { affectedRows: result.affectedRows };
}

/**
 * Set the status of a medicine (approve/reject).
 * @param {number} id
 * @param {string} status - 'published' or 'rejected'
 * @param {number} moderatedBy - admin user ID
 * @returns {Promise<object|null>}
 */
async function setStatus(id, status, moderatedBy) {
  await pool.query(
    'UPDATE medicines SET status = ?, moderated_by = ?, moderated_at = NOW(), updated_at = NOW() WHERE id = ?',
    [status, moderatedBy, id]
  );

  const [rows] = await pool.query('SELECT * FROM medicines WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = {
  findAllPublished,
  findPublishedById,
  findPendingAll,
  create,
  updateById,
  deleteById,
  setStatus,
};

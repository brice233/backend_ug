'use strict';

const pool = require('../config/db');

const isPostgres = !!process.env.DATABASE_URL;

async function findAllPublished({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    "SELECT * FROM medicines WHERE status = 'published' LIMIT ? OFFSET ?",
    [limit, offset]
  );
  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM medicines WHERE status = 'published'"
  );
  return { rows, total: parseInt(total, 10) };
}

async function findPublishedById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM medicines WHERE id = ? AND status = 'published'",
    [id]
  );
  return rows[0] || null;
}

async function findPendingAll({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    "SELECT * FROM medicines WHERE status = 'pending' LIMIT ? OFFSET ?",
    [limit, offset]
  );
  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM medicines WHERE status = 'pending'"
  );
  return { rows, total: parseInt(total, 10) };
}

async function create(fields) {
  const {
    name, description, uses, category,
    scientific_name = null, preparation_method = null, precautions = null,
    image_url = null, video_url = null, status = 'pending', submitted_by = null,
  } = fields;

  const values = [name, description, uses, category, scientific_name, preparation_method, precautions, image_url, video_url, status, submitted_by];
  const sql = `INSERT INTO medicines
    (name, description, uses, category, scientific_name, preparation_method, precautions, image_url, video_url, status, submitted_by)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  if (isPostgres) {
    const [rows] = await pool.query(sql + ' RETURNING *', values);
    return rows[0] || null;
  } else {
    const [result] = await pool.query(sql, values);
    const [rows] = await pool.query('SELECT * FROM medicines WHERE id = ?', [result.insertId]);
    return rows[0] || null;
  }
}

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

async function deleteById(id) {
  await pool.query('DELETE FROM medicines WHERE id = ?', [id]);
  return { affectedRows: 1 };
}

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

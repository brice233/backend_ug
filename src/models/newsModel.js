'use strict';

const pool = require('../config/db');

const isPostgres = !!process.env.DATABASE_URL;

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

  return { rows, total: parseInt(total, 10) };
}

async function findAllPublished({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    "SELECT * FROM news_posts WHERE status = 'published' ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );
  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM news_posts WHERE status = 'published'"
  );
  return { rows, total: parseInt(total, 10) };
}

async function findPublishedById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM news_posts WHERE id = ? AND status = 'published'",
    [id]
  );
  return rows[0] || null;
}

async function findPendingAll({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    "SELECT * FROM news_posts WHERE status = 'pending' LIMIT ? OFFSET ?",
    [limit, offset]
  );
  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM news_posts WHERE status = 'pending'"
  );
  return { rows, total: parseInt(total, 10) };
}

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

async function deleteById(id) {
  await pool.query('DELETE FROM news_posts WHERE id = ?', [id]);
  return { affectedRows: 1 };
}

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

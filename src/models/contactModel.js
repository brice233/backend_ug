'use strict';

const pool = require('../config/db');

async function create({ name, email, phone, subject, message }) {
  const [result] = await pool.query(
    `INSERT INTO contact_messages (name, email, phone, subject, message)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone || null, subject, message]
  );
  const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [result.insertId]);
  return rows[0] || null;
}

async function findAll({ page = 1, limit = 20, status } = {}) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (status) {
    conditions.push('status = ?');
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM contact_messages ${where}`,
    values
  );

  return { rows, total };
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id]);
  return rows[0] || null;
}

async function markRead(id) {
  await pool.query(
    `UPDATE contact_messages SET status = 'read' WHERE id = ? AND status = 'unread'`,
    [id]
  );
  return findById(id);
}

async function saveReply(id, reply_text) {
  await pool.query(
    `UPDATE contact_messages SET reply_text = ?, status = 'replied', replied_at = ? WHERE id = ?`,
    [reply_text, new Date(), id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function countUnread() {
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'unread'`
  );
  return total;
}

module.exports = { create, findAll, findById, markRead, saveReply, remove, countUnread };

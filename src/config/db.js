require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connectivity on startup
(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`[DB] Connected to MySQL database: ${process.env.DB_NAME}`);
  } catch (err) {
    console.error(`[DB] Connection failed: ${err.message}`);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
})();

// Listen for unexpected runtime disconnects
pool.on('connection', (connection) => {
  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
      console.warn('[DB] Connection lost. Attempting to reconnect...');
    }
  });
});

module.exports = pool;

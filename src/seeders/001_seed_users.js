'use strict';

const bcrypt = require('bcryptjs');

const isPostgres = !!process.env.DATABASE_URL;

async function run(pool) {
  const COST_FACTOR = 10;

  const adminName     = process.env.ADMIN_NAME     || 'Admin';
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@qty.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const adminHash     = await bcrypt.hash(adminPassword, COST_FACTOR);

  const regularUsers = [
    { name: 'Alice Green', email: 'alice@example.com', password: 'Password1!' },
    { name: 'Bob Herbal',  email: 'bob@example.com',   password: 'Password2!' },
    { name: 'Carol Roots', email: 'carol@example.com', password: 'Password3!' },
  ];

  const allUsers = [
    { name: adminName, email: adminEmail, password: adminHash, role: 'admin' },
    ...await Promise.all(
      regularUsers.map(async (u) => ({
        name: u.name,
        email: u.email,
        password: await bcrypt.hash(u.password, COST_FACTOR),
        role: 'user',
      }))
    ),
  ];

  for (const user of allUsers) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)
         ON CONFLICT (email) DO NOTHING`,
        [user.name, user.email, user.password, user.role]
      );
    } else {
      await pool.query(
        `INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [user.name, user.email, user.password, user.role]
      );
    }
  }

  console.log(`✓ Seeded ${allUsers.length} users`);
}

module.exports = { run };

const bcrypt = require('bcryptjs');

async function run(pool) {
  const COST_FACTOR = 10;

  // Admin user from environment variables
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@qty.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const adminHash = await bcrypt.hash(adminPassword, COST_FACTOR);

  await pool.execute(
    `INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')`,
    [adminName, adminEmail, adminHash]
  );

  // Regular users
  const regularUsers = [
    { name: 'Alice Green',  email: 'alice@example.com', password: 'Password1!' },
    { name: 'Bob Herbal',   email: 'bob@example.com',   password: 'Password2!' },
    { name: 'Carol Roots',  email: 'carol@example.com', password: 'Password3!' },
  ];

  for (const user of regularUsers) {
    const hash = await bcrypt.hash(user.password, COST_FACTOR);
    await pool.execute(
      `INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')`,
      [user.name, user.email, hash]
    );
  }
}

module.exports = { run };

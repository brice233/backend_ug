require('dotenv').config();

const pool = require('./src/config/db');
const seeder001 = require('./src/seeders/001_seed_users');
const seeder002 = require('./src/seeders/002_seed_Health');
const seeder003 = require('./src/seeders/003_seed_news_posts');
const seeder004 = require('./src/seeders/004_seed_hero_slides');
const seeder005 = require('./src/seeders/005_seed_sample_data');

const seeders = [
  { name: '001_seed_users',       module: seeder001 },
  { name: '002_seed_Health',   module: seeder002 },
  { name: '003_seed_news_posts',  module: seeder003 },
  { name: '004_seed_hero_slides', module: seeder004 },
  { name: '005_seed_sample_data', module: seeder005 },
];

(async () => {
  for (const seeder of seeders) {
    try {
      await seeder.module.run(pool);
      console.log(`[Seeder] Completed: ${seeder.name}`);
    } catch (err) {
      console.error(`[Seeder] Failed: ${seeder.name} — ${err.message}`);
      await pool.end();
      process.exit(1);
    }
  }

  await pool.end();
})();

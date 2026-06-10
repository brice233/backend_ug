'use strict';

require('dotenv').config();

const pool = require('./src/config/db');

const seeders = [
  { name: '001_seed_users',       module: require('./src/seeders/001_seed_users') },
  { name: '002_seed_medicines',   module: require('./src/seeders/002_seed_medicines') },
  { name: '003_seed_news_posts',  module: require('./src/seeders/003_seed_news_posts') },
  { name: '004_seed_hero_slides', module: require('./src/seeders/004_seed_hero_slides') },
  { name: '005_seed_sample_data', module: require('./src/seeders/005_seed_sample_data') },
];

(async () => {
  const dbType = process.env.DATABASE_URL ? 'PostgreSQL' : 'MySQL';
  console.log(`[Seed] Running seeders on ${dbType}...`);

  for (const seeder of seeders) {
    try {
      await seeder.module.run(pool);
      console.log(`[Seed] ✓ ${seeder.name}`);
    } catch (err) {
      console.error(`[Seed] ✗ ${seeder.name} — ${err.message}`);
      process.exit(1);
    }
  }

  console.log('[Seed] All seeders completed.');
  process.exit(0);
})();

'use strict';

require('dotenv').config();

const pool = require('./src/config/db');

const migrations = [
  { name: '001_create_users',              module: require('./src/migrations/001_create_users') },
  { name: '002_create_medicines',          module: require('./src/migrations/002_create_medicines') },
  { name: '003_create_news_posts',         module: require('./src/migrations/003_create_news_posts') },
  { name: '004_create_questions',          module: require('./src/migrations/004_create_questions') },
  { name: '005_add_analytics_indexes',     module: require('./src/migrations/005_add_analytics_indexes') },
  { name: '006_create_hero_slides',        module: require('./src/migrations/006_create_hero_slides') },
  { name: '007_add_video_url_fields',      module: require('./src/migrations/007_add_video_url_fields') },
  { name: '008_create_settings',           module: require('./src/migrations/008_create_settings') },
  { name: '009_add_reply_to_questions',    module: require('./src/migrations/009_add_reply_to_questions') },
  { name: '010_add_draft_status_to_news',  module: require('./src/migrations/010_add_draft_status_to_news') },
  { name: '011_create_contact_messages',   module: require('./src/migrations/011_create_contact_messages') },
];

(async () => {
  const dbType = process.env.DATABASE_URL ? 'PostgreSQL' : 'MySQL';
  console.log(`[Migrate] Running migrations on ${dbType}...`);

  for (const migration of migrations) {
    try {
      await migration.module.up(pool);
      console.log(`[Migrate] ✓ ${migration.name}`);
    } catch (err) {
      console.error(`[Migrate] ✗ ${migration.name} — ${err.message}`);
      process.exit(1);
    }
  }

  console.log('[Migrate] All migrations completed.');
  process.exit(0);
})();

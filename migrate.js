require('dotenv').config();

const pool = require('./src/config/db');
const migration001 = require('./src/migrations/001_create_users');
const migration002 = require('./src/migrations/002_create_Health');
const migration003 = require('./src/migrations/003_create_news_posts');
const migration004 = require('./src/migrations/004_create_questions');
const migration005 = require('./src/migrations/005_add_analytics_indexes');
const migration006 = require('./src/migrations/006_create_hero_slides');
const migration007 = require('./src/migrations/007_add_video_url_fields');
const migration008 = require('./src/migrations/008_create_settings');

const migrations = [
  { name: '001_create_users',          module: migration001 },
  { name: '002_create_Health',      module: migration002 },
  { name: '003_create_news_posts',     module: migration003 },
  { name: '004_create_questions',      module: migration004 },
  { name: '005_add_analytics_indexes', module: migration005 },
  { name: '006_create_hero_slides',    module: migration006 },
  { name: '007_add_video_url_fields',  module: migration007 },
  { name: '008_create_settings',       module: migration008 },
];

(async () => {
  for (const migration of migrations) {
    try {
      await migration.module.up(pool);
      console.log(`[Migration] Applied: ${migration.name}`);
    } catch (err) {
      console.error(`[Migration] Failed: ${migration.name} — ${err.message}`);
      await pool.end();
      process.exit(1);
    }
  }

  await pool.end();
})();

'use strict';

const isPostgres = !!process.env.DATABASE_URL;

const medicines = [
  { name: 'Moringa', scientific_name: 'Moringa oleifera', category: 'Immune Support', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', description: 'Moringa, the "miracle tree," is packed with vitamins, minerals, and bioactive compounds.', uses: 'Nutritional supplement, blood sugar control, anti-inflammatory, energy boost', preparation_method: 'Add 1-2 tsp powder to smoothies or tea daily. Capsules: 500mg twice daily.', precautions: 'Avoid root during pregnancy. May lower blood pressure. Start with small doses.' },
  { name: 'Neem', scientific_name: 'Azadirachta indica', category: 'Topical', image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', description: 'Neem is known as the "village pharmacy" — virtually every part has medicinal value.', uses: 'Skin conditions, dental health, anti-fungal, anti-bacterial, blood purification', preparation_method: 'Dilute neem oil with carrier oil (1:10) for topical use. Neem powder: 1/4 tsp in water.', precautions: 'Do not ingest neem oil. Toxic to children in large amounts. Avoid during pregnancy.' },
  { name: 'Hibiscus', scientific_name: 'Hibiscus sabdariffa', category: 'Cardiovascular', image_url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=800&q=80', description: 'Hibiscus calyces make a tart tea rich in antioxidants and beneficial for the heart.', uses: 'Blood pressure reduction, cholesterol management, liver health, antioxidant', preparation_method: 'Steep 1-2 tsp dried calyces in hot water for 5-10 minutes. Drink 2-3 cups daily.', precautions: 'May lower blood pressure significantly. Avoid during pregnancy. May affect estrogen.' },
  { name: 'Valerian Root', scientific_name: 'Valeriana officinalis', category: 'Nervine', image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80', description: 'Valerian root has been used since ancient times as a sleep aid and anxiety reliever.', uses: 'Insomnia, anxiety, stress relief, restless leg syndrome', preparation_method: 'Capsules 300-600mg 30 mins before bed. Tea: steep 1 tsp dried root for 15 minutes.', precautions: 'Causes drowsiness. Do not mix with alcohol or sedatives. Avoid during pregnancy.' },
];

const newsPosts = [
  { title: 'The Healing Power of African Herbal Medicine', category: 'Traditional Medicine', cover_image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80', content: 'Africa has one of the richest traditions of herbal medicine. Plants like Moringa, Neem, and Hibiscus are now recognized globally for their therapeutic properties.' },
  { title: 'Moringa: The Miracle Tree That Could Change Your Health', category: 'Herbal Remedies', cover_image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80', content: 'Moringa oleifera is one of the most nutrient-dense plants on Earth. Recent research confirms its role in fighting malnutrition and managing diabetes.' },
  { title: 'How Turmeric and Ginger Work Together for Better Health', category: 'Research', cover_image_url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=1200&q=80', content: 'Turmeric and ginger contain potent anti-inflammatory compounds that work synergistically. This article examines the science behind this powerful herbal duo.' },
];

async function run(pool) {
  console.log('Seeding sample medicines...');
  for (const m of medicines) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO medicines (name, scientific_name, category, image_url, description, uses, preparation_method, precautions, status, submitted_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', NULL)
         ON CONFLICT DO NOTHING`,
        [m.name, m.scientific_name, m.category, m.image_url, m.description, m.uses, m.preparation_method, m.precautions]
      );
    } else {
      await pool.query(
        `INSERT IGNORE INTO medicines (name, scientific_name, category, image_url, description, uses, preparation_method, precautions, status, submitted_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', NULL)`,
        [m.name, m.scientific_name, m.category, m.image_url, m.description, m.uses, m.preparation_method, m.precautions]
      );
    }
  }
  console.log(`✓ Seeded ${medicines.length} sample medicines`);

  console.log('Seeding sample news posts...');
  for (const p of newsPosts) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO news_posts (title, category, cover_image_url, content, status, author_id)
         VALUES (?, ?, ?, ?, 'published', NULL)
         ON CONFLICT DO NOTHING`,
        [p.title, p.category, p.cover_image_url, p.content]
      );
    } else {
      await pool.query(
        `INSERT IGNORE INTO news_posts (title, category, cover_image_url, content, status, author_id)
         VALUES (?, ?, ?, ?, 'published', NULL)`,
        [p.title, p.category, p.cover_image_url, p.content]
      );
    }
  }
  console.log(`✓ Seeded ${newsPosts.length} sample news posts`);
}

module.exports = { run };

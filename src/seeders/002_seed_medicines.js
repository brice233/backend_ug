'use strict';

const isPostgres = !!process.env.DATABASE_URL;

const medicines = [
  {
    name: 'Turmeric',
    description: 'Turmeric is a bright yellow spice derived from the root of Curcuma longa.',
    uses: 'Anti-inflammatory, digestive aid, antioxidant support',
    category: 'Anti-inflammatory',
    scientific_name: 'Curcuma longa',
    preparation_method: 'Consumed as powder in food/drinks, capsules, or topical paste.',
    precautions: 'May interact with blood thinners. Avoid during pregnancy in medicinal amounts.',
  },
  {
    name: 'Ginger',
    description: 'Ginger is a flowering plant whose rhizome is widely used as a spice and folk medicine.',
    uses: 'Nausea relief, anti-inflammatory, digestive support, motion sickness',
    category: 'Digestive',
    scientific_name: 'Zingiber officinale',
    preparation_method: 'Consumed fresh, dried, powdered, as oil or juice, or as tea.',
    precautions: 'May interact with blood thinners. Large amounts may cause heartburn.',
  },
  {
    name: 'Echinacea',
    description: 'Echinacea is a group of flowering plants in the daisy family.',
    uses: 'Immune support, cold prevention, upper respiratory infections',
    category: 'Immune Support',
    scientific_name: 'Echinacea purpurea',
    preparation_method: 'Available as teas, tinctures, tablets, and capsules.',
    precautions: 'Not recommended for autoimmune disorders. May cause allergic reactions.',
  },
  {
    name: 'Lavender',
    description: 'Lavender is an aromatic flowering plant native to the Mediterranean region.',
    uses: 'Anxiety relief, sleep aid, stress reduction, mild pain relief',
    category: 'Nervine',
    scientific_name: 'Lavandula angustifolia',
    preparation_method: 'Used as essential oil in aromatherapy, brewed as tea, or as supplement.',
    precautions: 'Do not ingest large amounts of oil. May cause skin irritation.',
  },
  {
    name: 'Aloe Vera',
    description: 'Aloe vera is a succulent plant used for healing for thousands of years.',
    uses: 'Skin healing, burn relief, digestive health, constipation relief',
    category: 'Topical',
    scientific_name: 'Aloe barbadensis miller',
    preparation_method: 'Apply gel directly to skin or drink 1-2 oz aloe juice daily.',
    precautions: 'Avoid oral aloe latex — can cause kidney problems. Avoid during pregnancy.',
  },
];

async function run(pool) {
  for (const m of medicines) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO medicines (name, description, uses, category, scientific_name, preparation_method, precautions, status, submitted_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'published', NULL)
         ON CONFLICT DO NOTHING`,
        [m.name, m.description, m.uses, m.category, m.scientific_name, m.preparation_method, m.precautions]
      );
    } else {
      await pool.query(
        `INSERT IGNORE INTO medicines (name, description, uses, category, scientific_name, preparation_method, precautions, status, submitted_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'published', NULL)`,
        [m.name, m.description, m.uses, m.category, m.scientific_name, m.preparation_method, m.precautions]
      );
    }
  }
  console.log(`✓ Seeded ${medicines.length} medicines`);
}

module.exports = { run };

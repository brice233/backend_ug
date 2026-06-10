const Health = [
  {
    name: 'Turmeric',
    description: 'Turmeric is a bright yellow spice derived from the root of Curcuma longa. It has been used in Ayurvedic and traditional Chinese medicine for thousands of years.',
    uses: 'Anti-inflammatory, digestive aid, antioxidant support',
    category: 'Anti-inflammatory',
    scientific_name: 'Curcuma longa',
    preparation_method: 'Can be consumed as a powder in food or drinks, taken as capsules, or applied topically as a paste.',
    precautions: 'May interact with blood thinners. High doses may cause gastrointestinal upset. Avoid during pregnancy in medicinal amounts.',
  },
  {
    name: 'Ginger',
    description: 'Ginger is a flowering plant whose rhizome is widely used as a spice and folk medicine. It has a long history of use in various forms of traditional and alternative medicine.',
    uses: 'Nausea relief, anti-inflammatory, digestive support, motion sickness',
    category: 'Digestive',
    scientific_name: 'Zingiber officinale',
    preparation_method: 'Consumed fresh, dried, powdered, as an oil or juice, or as a tea.',
    precautions: 'May interact with blood thinners and diabetes medications. Large amounts may cause heartburn.',
  },
  {
    name: 'Echinacea',
    description: 'Echinacea is a group of flowering plants in the daisy family. It is one of the most popular herbal supplements in the United States and Europe.',
    uses: 'Immune support, cold prevention, upper respiratory infections',
    category: 'Immune Support',
    scientific_name: 'Echinacea purpurea',
    preparation_method: 'Available as teas, tinctures, tablets, and capsules. Best taken at the onset of cold symptoms.',
    precautions: 'Not recommended for people with autoimmune disorders. May cause allergic reactions in those sensitive to plants in the daisy family.',
  },
  {
    name: 'Lavender',
    description: 'Lavender is an aromatic flowering plant native to the Mediterranean region. Its essential oil is one of the most widely used in aromatherapy.',
    uses: 'Anxiety relief, sleep aid, stress reduction, mild pain relief',
    category: 'Nervine',
    scientific_name: 'Lavandula angustifolia',
    preparation_method: 'Used as essential oil in aromatherapy, brewed as a tea, or taken as an oral supplement.',
    precautions: 'Lavender oil should not be ingested in large amounts. May cause skin irritation in some individuals.',
  },
  {
    name: 'Peppermint',
    description: 'Peppermint is a hybrid mint plant that is a cross between watermint and spearmint. It is widely used in both culinary and medicinal applications.',
    uses: 'Digestive relief, headache relief, irritable bowel syndrome, nausea',
    category: 'Digestive',
    scientific_name: 'Mentha × piperita',
    preparation_method: 'Consumed as a tea, applied topically as an oil, or taken as enteric-coated capsules for IBS.',
    precautions: 'Peppermint oil should not be applied near the face of infants or young children. May worsen acid reflux in some people.',
  },
  {
    name: 'Chamomile',
    description: 'Chamomile is one of the most ancient medicinal herbs known to mankind. It is a member of the Asteraceae family and has been used for centuries as an anti-inflammatory, antioxidant, and mild astringent.',
    uses: 'Sleep aid, anti-anxiety, digestive relief, anti-inflammatory',
    category: 'Nervine',
    scientific_name: 'Matricaria chamomilla',
    preparation_method: 'Most commonly consumed as a tea. Also available as tinctures, capsules, and topical creams.',
    precautions: 'May cause allergic reactions in people sensitive to ragweed or other plants in the Asteraceae family. May interact with blood thinners.',
  },
  {
    name: 'Valerian Root',
    description: 'Valerian is a perennial flowering plant native to Europe and Asia. Its root has been used as a medicinal herb since ancient Greek and Roman times.',
    uses: 'Insomnia, anxiety, stress relief, menopausal symptoms',
    category: 'Nervine',
    scientific_name: 'Valeriana officinalis',
    preparation_method: 'Taken as a capsule, tablet, liquid extract, or tea. Best taken 30 minutes to 2 hours before bedtime.',
    precautions: 'May cause drowsiness. Should not be combined with alcohol or sedative medications. Not recommended during pregnancy.',
  },
  {
    name: "St. John's Wort",
    description: "St. John's Wort is a plant with yellow, star-shaped flowers that grows in Europe, North and South America, Australia, New Zealand, and Eastern Asia. It has been used in traditional European medicine for centuries.",
    uses: 'Mild to moderate depression, nerve pain, wound healing',
    category: 'Nervine',
    scientific_name: 'Hypericum perforatum',
    preparation_method: 'Available as capsules, tablets, liquid extracts, and teas. Standardized extracts are most commonly used.',
    precautions: 'Has significant interactions with many medications including antidepressants, birth control pills, and blood thinners. Can cause photosensitivity.',
  },
  {
    name: 'Garlic',
    description: 'Garlic is a species in the onion genus Allium. It has been used as both food and medicine throughout recorded history, with evidence of use dating back over 5,000 years.',
    uses: 'Cardiovascular Health, antimicrobial, immune support, blood pressure regulation',
    category: 'Cardiovascular',
    scientific_name: 'Allium sativum',
    preparation_method: 'Consumed raw, cooked, or as a supplement in capsule or tablet form. Aged garlic extract is also widely available.',
    precautions: 'May interact with blood thinners and some HIV medications. Can cause bad breath and body odor. May cause digestive upset in some people.',
  },
  {
    name: 'Aloe Vera',
    description: 'Aloe vera is a succulent plant species of the genus Aloe. It has been used for thousands of years for its healing and medicinal properties, particularly for skin conditions.',
    uses: 'Skin healing, burn relief, digestive Health, constipation relief',
    category: 'Topical',
    scientific_name: 'Aloe barbadensis miller',
    preparation_method: 'Applied topically as a gel directly from the leaf or from commercial preparations. Aloe juice can be consumed for digestive benefits.',
    precautions: 'Oral use of aloe latex can cause serious side effects including kidney problems. Topical use is generally safe. Avoid during pregnancy.',
  },
];

async function run(pool) {
  for (const medicine of Health) {
    await pool.execute(
      `INSERT IGNORE INTO Health
        (name, description, uses, category, scientific_name, preparation_method, precautions, status, submitted_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'published', NULL)`,
      [
        medicine.name,
        medicine.description,
        medicine.uses,
        medicine.category,
        medicine.scientific_name,
        medicine.preparation_method,
        medicine.precautions,
      ]
    );
  }
}

module.exports = { run };

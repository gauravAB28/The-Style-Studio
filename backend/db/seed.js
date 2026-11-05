const { pool } = require('./index');

const SEED_SERVICES = [
  // Hair
  {
    name: "Architectural Cut & Blowout",
    category: "Hair",
    duration_min: 45,
    price_inr: 499,
    original_price_inr: 799,
  },
  {
    name: "Royal Keratin Smoothening Therapy",
    category: "Hair",
    duration_min: 120,
    price_inr: 2999,
    original_price_inr: 4999,
  },
  {
    name: "Dimensional Balayage & Olaplex",
    category: "Hair",
    duration_min: 150,
    price_inr: 3699,
    original_price_inr: 5500,
  },
  {
    name: "Italian Ammonia-Free Global Color",
    category: "Hair",
    duration_min: 90,
    price_inr: 2499,
    original_price_inr: 3800,
  },

  // Bridal
  {
    name: "Signature HD Bridal Makeover",
    category: "Bridal",
    duration_min: 180,
    price_inr: 10399,
    original_price_inr: 15999,
  },
  {
    name: "Ultra-Airbrush HD Bridal Glamour",
    category: "Bridal",
    duration_min: 210,
    price_inr: 13999,
    original_price_inr: 19999,
  },
  {
    name: "Engagement & Sagan Celebration Makeup",
    category: "Bridal",
    duration_min: 120,
    price_inr: 4499,
    original_price_inr: 6500,
  },

  // Skin
  {
    name: "7-Step Clinical Hydra Facial",
    category: "Skin",
    duration_min: 60,
    price_inr: 2624,
    original_price_inr: 3499,
  },
  {
    name: "24K Gold Illuminating Facial",
    category: "Skin",
    duration_min: 60,
    price_inr: 1899,
    original_price_inr: 2800,
  },

  // Nails
  {
    name: "Sculpted Gel / Acrylic Extensions",
    category: "Nails",
    duration_min: 90,
    price_inr: 1749,
    original_price_inr: 2499,
  },
  {
    name: "Ice Cream Bubble Spa Pedicure",
    category: "Nails",
    duration_min: 50,
    price_inr: 999,
    original_price_inr: 1499,
  },

  // Spa (Null prices, duration_min set to the longer value so bookings never overrun)
  {
    name: "Turkish Hammam",
    category: "Spa",
    duration_min: 90, // longer of 75 / 90 min
    price_inr: null,
    original_price_inr: null,
  },
  {
    name: "Balinese Massage",
    category: "Spa",
    duration_min: 90, // longer of 60 / 90 min
    price_inr: null,
    original_price_inr: null,
  },
  {
    name: "Swedish Restorative Massage",
    category: "Spa",
    duration_min: 90, // longer of 60 / 90 min
    price_inr: null,
    original_price_inr: null,
  },
  {
    name: "Deep Tissue Recovery",
    category: "Spa",
    duration_min: 90, // longer of 60 / 90 min
    price_inr: null,
    original_price_inr: null,
  },
  {
    name: "Aromatherapy Massage",
    category: "Spa",
    duration_min: 90, // longer of 60 / 90 min
    price_inr: null,
    original_price_inr: null,
  },
];

async function seed() {
  const client = await pool.connect();
  let inserted = 0;
  let updated = 0;

  try {
    console.log('[SEED] Starting services seed in a single transaction...');
    await client.query('BEGIN');

    for (const service of SEED_SERVICES) {
      // Look up by exact name
      const existing = await client.query(
        'SELECT id FROM services WHERE name = $1 LIMIT 1',
        [service.name]
      );

      if (existing.rows.length > 0) {
        // UPDATE existing record
        await client.query(
          `UPDATE services 
           SET category = $1, 
               duration_min = $2, 
               price_inr = $3, 
               original_price_inr = $4, 
               active = true
           WHERE id = $5`,
          [
            service.category,
            service.duration_min,
            service.price_inr,
            service.original_price_inr,
            existing.rows[0].id,
          ]
        );
        updated++;
      } else {
        // INSERT new record
        await client.query(
          `INSERT INTO services (name, category, duration_min, price_inr, original_price_inr, active)
           VALUES ($1, $2, $3, $4, $5, true)`,
          [
            service.name,
            service.category,
            service.duration_min,
            service.price_inr,
            service.original_price_inr,
          ]
        );
        inserted++;
      }
    }

    await client.query('COMMIT');

    const totalProcessed = inserted + updated;
    console.log(`[SEED] Success!`);
    console.log(`[SEED] Inserted: ${inserted}`);
    console.log(`[SEED] Updated:  ${updated}`);
    console.log(`[SEED] Total:    ${totalProcessed} (Services list length: ${SEED_SERVICES.length})`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[SEED] Failed, transaction rolled back:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();


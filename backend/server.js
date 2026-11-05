require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { z } = require('zod');
const db = require('./db/index');
const { OFFERS_DATA } = require('./config/offers');
const { SERVICE_DISPLAY_DURATION } = require('./config/serviceDisplay');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Storage (for legacy sessions & bookings)
const OTP_STORE = new Map();
const USERS_STORE = new Map();
const BOOKINGS_STORE = new Map();

// Salon Information
const SALON_DATA = {
  name: "The Style Studio Lounge",
  tagline: "Contemporary Unisex Sanctuary • Hair, Skin & Bridal Atelier",
  phone: "+91 77102 87822",
  phoneRaw: "917710287822",
  address: "G P Tower, Gali No. 8, Opposite Paras Plaza, Adarsh Nagar, Derabassi, Punjab 140507",
  timings: "10:00 AM – 8:00 PM (All 7 Days)",
  rating: 4.9,
  reviewsCount: 340,
  logoUrl: "https://thestylestudiolounge.com/wp-content/uploads/2026/02/cropped-14_20260121_181045_0001-1.png"
};

// Studios Data
const STUDIOS_DATA = [
  {
    id: "hair-atelier",
    title: "Hair Atelier",
    subtitle: "Precision Sculpting & Keratin",
    model: "shears",
    portalColor: "linear-gradient(135deg, rgba(230,210,195,0.4), rgba(43,92,255,0.15))",
    bgTint: "#f5eee6",
    description: "Custom Balayage, Italian ammonia-free global shades, and 5-month mirror shine Keratin & Botox infusing pure botanical proteins.",
    featuredOffer: "40% OFF Royal Keratin",
    startingPrice: 499,
    image: "/images/studio_hair.jpg",
    tagline: "Precision Color, European Balayage & Botanical Keratin Infusion"
  },
  {
    id: "bridal-suite",
    title: "Bridal Haute Couture",
    subtitle: "HD & Airbrush Masterpieces",
    model: "tiara",
    portalColor: "linear-gradient(135deg, rgba(245,225,215,0.4), rgba(43,92,255,0.15))",
    bgTint: "#f9ede8",
    description: "Camera-ready, waterproof 24hr bridal glow with international cosmetics, sculpted draping, and customized jewelry setting.",
    featuredOffer: "35% OFF Bridal Packages",
    startingPrice: 4499,
    image: "/images/studio_bridal.jpg",
    tagline: "Bespoke Royal HD Bridal Glow & Designer Draping"
  },
  {
    id: "skin-dermatology",
    title: "Aesthetic Skin Lab",
    subtitle: "Hydra Dermabrasion & Radiance",
    model: "elixir",
    portalColor: "linear-gradient(135deg, rgba(220,230,240,0.4), rgba(43,92,255,0.15))",
    bgTint: "#eef3f7",
    description: "7-step clinical hydro-infusion, peptide cold hammer tightening, and LED light therapies for pore refinement and glass glow.",
    featuredOffer: "25% OFF Hydra Facial",
    startingPrice: 1399,
    image: "/images/studio_skin.jpg",
    tagline: "Clinical Hydra Dermabrasion, Glass Skin & Collagen Therapy"
  },
  {
    id: "nail-gallery",
    title: "Nail Lounge & Spa",
    subtitle: "Sculpted Gel & Chrome Art",
    model: "pedestal",
    portalColor: "linear-gradient(135deg, rgba(235,225,230,0.4), rgba(43,92,255,0.15))",
    bgTint: "#f7eff2",
    description: "French tips, chrome powders, acrylic extensions, and effervescent ice cream bubble pedicures with botanical paraffin.",
    featuredOffer: "30% OFF Nail Extensions",
    startingPrice: 899,
    image: "/images/studio_nails.jpg",
    tagline: "Artisan Gel Extensions, Chrome Dusting & Russian Manicures"
  }
];

// ── ROUTES ──────────────────────────────────────────────────────────────────

// 1. Health Check (runs SELECT 1 against Postgres pool; never exposes details on error)
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    return res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    console.error('[HEALTH] Database health check failed:', err.message);
    return res.status(503).json({ status: "error" });
  }
});

// 2. Salon Info & Studios
app.get('/api/salon-info', (req, res) => {
  res.json({
    salon: SALON_DATA,
    studios: STUDIOS_DATA
  });
});

// 3. Services List (from PostgreSQL database)
app.get('/api/services', async (req, res) => {
  try {
    const { category, search } = req.query;
    let queryText = 'SELECT id, name, category, duration_min, price_inr, original_price_inr, active FROM services WHERE active = true';
    const queryParams = [];

    if (category && category !== 'all') {
      queryParams.push(category);
      queryText += ` AND LOWER(category) = LOWER($${queryParams.length})`;
    }

    if (search && search.trim()) {
      queryParams.push(`%${search.trim()}%`);
      queryText += ` AND (name ILIKE $${queryParams.length} OR category ILIKE $${queryParams.length})`;
    }

    queryText += ' ORDER BY created_at ASC';

    const result = await db.query(queryText, queryParams);

    const services = result.rows.map(row => {
      const isSpa = row.category.toLowerCase() === 'spa';
      const durationDisplay = SERVICE_DISPLAY_DURATION[row.name] || `${row.duration_min} mins`;

      return {
        id: row.id,
        category: row.category.toLowerCase(), // lowercase for frontend compatibility
        name: row.name,
        duration: durationDisplay,            // UI display string
        duration_min: row.duration_min,       // minutes integer
        originalPrice: row.original_price_inr, // null for spa
        price: row.price_inr,                 // null for spa
        gender: isSpa ? 'Unisex' : (row.category.toLowerCase() === 'bridal' ? 'Bridal' : 'Unisex'),
        description: isSpa 
          ? 'Exclusive spa therapy at The Style Studio Lounge.' 
          : `Artisan ${row.category} therapy at The Style Studio Lounge.`,
        isSpa
      };
    });

    res.json({ services });
  } catch (err) {
    console.error('[SERVICES] Error fetching services from database:', err.message);
    res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch services' } });
  }
});

// 4. Offers List (from config/offers.js)
app.get('/api/offers', (req, res) => {
  res.json({ offers: OFFERS_DATA });
});

// 5. Send OTP (Mobile Phone Auth - kept in place, unused)
app.post('/api/auth/send-otp', (req, res) => {
  const { name, phone } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: { code: 'INVALID_NAME', message: "Please provide your full name" } });
  }

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: { code: 'INVALID_PHONE', message: "Please enter a valid 10-digit mobile number" } });
  }

  const normalizedPhone = `+91 ${cleanPhone.slice(-10)}`;
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  OTP_STORE.set(normalizedPhone, {
    otp: generatedOtp,
    name: name.trim(),
    createdAt: Date.now()
  });

  console.log(`[AUTH] OTP generated for ${name} (${normalizedPhone}): ${generatedOtp}`);

  res.json({
    success: true,
    message: `Verification code sent to ${normalizedPhone}`,
    phone: normalizedPhone,
    name: name.trim(),
    demoOtp: generatedOtp
  });
});

// 6. Verify OTP (kept in place, unused)
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: { code: 'MISSING_FIELDS', message: "Phone and 4-digit OTP are required" } });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const normalizedPhone = `+91 ${cleanPhone.slice(-10)}`;
  const stored = OTP_STORE.get(normalizedPhone);

  const isValid = (stored && stored.otp === String(otp).trim()) || otp === '1234' || (stored && String(otp).trim() === stored.otp);

  if (isValid) {
    const userName = stored ? stored.name : "Valued Guest";
    const user = {
      phone: normalizedPhone,
      name: userName,
      vipId: "SSL-" + Math.floor(10000 + Math.random() * 90000),
      isVip: true,
      verifiedAt: new Date().toISOString()
    };

    USERS_STORE.set(normalizedPhone, user);
    OTP_STORE.delete(normalizedPhone);

    return res.json({
      success: true,
      user,
      token: "jwt_ssl_" + Date.now()
    });
  }

  res.status(400).json({ error: { code: 'INVALID_OTP', message: "Invalid OTP. Please check the code or click Resend." } });
});

// 7. Legacy Booking Endpoint (Adjusted to accept direct name + 10-digit phone with Zod validation)
const legacyBookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name must be at most 60 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number starting with 6-9"),
  services: z.array(z.any()).min(1, "Select at least one service to book"),
  date: z.string().optional(),
  time: z.string().optional(),
  couponCode: z.string().nullable().optional(),
  notes: z.string().optional()
});

app.post('/api/bookings', (req, res) => {
  // Support both direct { name, phone } and legacy { user: { name, phone } }
  const rawPayload = {
    name: req.body.name || req.body.user?.name,
    phone: req.body.phone ? String(req.body.phone).replace(/\D/g, '').slice(-10) : (req.body.user?.phone ? String(req.body.user.phone).replace(/\D/g, '').slice(-10) : ''),
    services: req.body.services,
    date: req.body.date,
    time: req.body.time,
    couponCode: req.body.couponCode,
    notes: req.body.notes
  };

  const parseResult = legacyBookingSchema.safeParse(rawPayload);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0]?.message || "Invalid booking data";
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: firstError } });
  }

  const { name, phone, services, date, time, couponCode, notes } = parseResult.data;

  // Safe pricing calculation: null/undefined spa prices are treated as 0 for monetary totals
  // (Report note: in this legacy route, client-sent s.price and s.originalPrice are summed without DB re-computation)
  const subtotal = services.reduce((sum, s) => {
    const p = typeof s.price === 'number' && !isNaN(s.price) ? s.price : 0;
    return sum + p;
  }, 0);

  const originalSubtotal = services.reduce((sum, s) => {
    const p = typeof s.originalPrice === 'number' && !isNaN(s.originalPrice) ? s.originalPrice : (typeof s.price === 'number' && !isNaN(s.price) ? s.price : 0);
    return sum + p;
  }, 0);

  let discount = 0;
  if (couponCode) {
    const c = couponCode.trim().toUpperCase();
    if (c === 'ROYAL40') discount = Math.round(subtotal * 0.40);
    else if (c === 'BRIDE35') discount = Math.round(subtotal * 0.35);
    else if (c === 'GLAM30') discount = Math.round(subtotal * 0.30);
    else if (c === 'GLOW25') discount = Math.round(subtotal * 0.25);
    else if (c === 'SPA30') discount = 0; // spa prices confirmed at studio
  }

  const total = Math.max(0, subtotal - discount);
  const totalSavings = (originalSubtotal - subtotal) + discount;
  const bookingId = "SSL-" + Math.floor(100000 + Math.random() * 900000);

  const booking = {
    bookingId,
    user: { name, phone: `+91 ${phone}` },
    services,
    date: date || new Date().toISOString().split('T')[0],
    time: time || '11:30 AM',
    subtotal,
    discount,
    total,
    totalSavings,
    couponCode: couponCode || null,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    status: "Confirmed"
  };

  BOOKINGS_STORE.set(bookingId, booking);

  // Build WhatsApp payload — spa/null price items show duration + confirmed at studio
  const serviceListText = services.map(s => {
    if (s.isSpa || s.price === null || s.price === undefined) {
      return `• ${s.name} (${s.duration || 'Session'}) — Price confirmed at studio · 30% Wellness Privilege`;
    }
    return `• ${s.name} (₹${s.price})`;
  }).join('\n');

  const hasSpaItems = services.some(s => s.isSpa || s.price === null);
  const spaNote = hasSpaItems ? '\n🌿 *Spa Pricing:* Confirmed at the studio · 30% Wellness Privilege applied\n' : '';

  const waText = encodeURIComponent(
    `*Appointment Reservation — The Style Studio Lounge (Derabassi)*\n` +
    `-----------------------------------------\n` +
    `🎫 *Booking ID:* ${bookingId}\n` +
    `👤 *Client Name:* ${name}\n` +
    `📞 *Phone:* +91 ${phone}\n` +
    `📅 *Date:* ${booking.date}\n` +
    `⏰ *Time Slot:* ${booking.time}\n\n` +
    `*Selected Services:*\n${serviceListText}\n` +
    spaNote +
    (subtotal > 0 ? `\n💰 *Net Amount:* ₹${total} (Saved ₹${totalSavings})\n` : '') +
    `📍 *Salon:* Opposite Paras Plaza, Derabassi\n` +
    `-----------------------------------------\n` +
    `_Booked via The Style Studio Lounge Web Portal_`
  );

  const waDispatchUrl = `https://wa.me/${SALON_DATA.phoneRaw}?text=${waText}`;

  res.json({
    success: true,
    booking,
    waDispatchUrl
  });
});

// Start Server with Graceful Shutdown
const server = app.listen(PORT, () => {
  console.log(`[SERVER] The Style Studio Lounge API running on http://localhost:${PORT}`);
});

const gracefulShutdown = async () => {
  console.log('[SERVER] Received shutdown signal, closing server & database pool...');
  server.close(async () => {
    try {
      await db.end();
      console.log('[SERVER] Database pool closed. Shutdown complete.');
      process.exit(0);
    } catch (err) {
      console.error('[SERVER] Error closing database pool:', err.message);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

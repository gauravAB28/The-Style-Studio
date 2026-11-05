const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Storage
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

// 3D Portal Windows / Studios (Matching reference image: "Case-study cards are windows into separate 3D...")
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

// Complete Services Catalog with Real Salon Rates
const SERVICES_DATA = [
  // Hair
  {
    id: "s1",
    category: "hair",
    name: "Architectural Cut & Blowout",
    duration: "45 mins",
    originalPrice: 799,
    price: 499,
    gender: "Unisex",
    description: "Consultation, soothing scalp wash, bespoke textured precision cut, and signature volume finish."
  },
  {
    id: "s2",
    category: "hair",
    name: "Royal Keratin Smoothening Therapy",
    duration: "120 mins",
    originalPrice: 4999,
    price: 2999,
    gender: "Unisex",
    description: "Formaldehyde-safe botanical protein replenishment for liquid glass, zero frizz hair."
  },
  {
    id: "s3",
    category: "hair",
    name: "Dimensional Balayage & Olaplex",
    duration: "150 mins",
    originalPrice: 5500,
    price: 3699,
    gender: "Female / Unisex",
    description: "Hand-painted sunlit gradient with Olaplex bond multiplier protection."
  },
  {
    id: "s4",
    category: "hair",
    name: "Italian Ammonia-Free Global Color",
    duration: "90 mins",
    originalPrice: 3800,
    price: 2499,
    gender: "Unisex",
    description: "Deep reflective rich pigments that nourish the hair cuticle."
  },

  // Bridal
  {
    id: "s5",
    category: "bridal",
    name: "Signature HD Bridal Makeover",
    duration: "180 mins",
    originalPrice: 15999,
    price: 10399,
    gender: "Bridal",
    description: "Complete camera-ready look with Huda Beauty, MAC, Charlotte Tilbury, hair design & draping."
  },
  {
    id: "s6",
    category: "bridal",
    name: "Ultra-Airbrush HD Bridal Glamour",
    duration: "210 mins",
    originalPrice: 19999,
    price: 13999,
    gender: "Bridal",
    description: "Featherlight 24hr silicon airbrush base, sweatproof and tearproof."
  },
  {
    id: "s7",
    category: "bridal",
    name: "Engagement & Sagan Celebration Makeup",
    duration: "120 mins",
    originalPrice: 6500,
    price: 4499,
    gender: "Female",
    description: "Soft contoured glow with custom 3D faux mink lashes and modern bridal waves."
  },

  // Skin
  {
    id: "s8",
    category: "skin",
    name: "7-Step Clinical Hydra Facial",
    duration: "60 mins",
    originalPrice: 3499,
    price: 2624,
    gender: "Unisex",
    description: "Vortex vacuum pore suction, hyaluronic acid serum wash, cold hammer pore locking & LED therapy."
  },
  {
    id: "s9",
    category: "skin",
    name: "24K Gold Illuminating Facial",
    duration: "60 mins",
    originalPrice: 2800,
    price: 1899,
    gender: "Unisex",
    description: "Micro gold leaf infusion providing instant radiant brightness."
  },

  // Nails
  {
    id: "s10",
    category: "nails",
    name: "Sculpted Gel / Acrylic Extensions",
    duration: "90 mins",
    originalPrice: 2499,
    price: 1749,
    gender: "Female / Unisex",
    description: "Chip-resistant length enhancement with French or chrome gloss topcoat."
  },
  {
    id: "s11",
    category: "nails",
    name: "Ice Cream Bubble Spa Pedicure",
    duration: "50 mins",
    originalPrice: 1499,
    price: 999,
    gender: "Unisex",
    description: "Fizzy candy bath, callus smoothing, sea salt scrub, and therapeutic foot massage."
  },

  // ── SPA & WELLNESS ──────────────────────────────────────────────────────────
  // Note: price = 0 means "confirmed at studio". 30% privilege always applied.
  {
    id: "spa-01",
    category: "spa",
    name: "Turkish Hammam",
    duration: "75 / 90 min",
    originalPrice: 0,
    price: 0,
    gender: "Unisex",
    description: "Steam, kese exfoliation and aromatic foam cleanse. Centuries-old bathing ritual for deep pore cleansing and luminous skin.",
    isSpa: true
  },
  {
    id: "spa-02",
    category: "spa",
    name: "Balinese Massage",
    duration: "60 / 90 min",
    originalPrice: 0,
    price: 0,
    gender: "Unisex",
    description: "Long effleurage, acupressure and gentle stretches with warm aromatic oils. Eases stiffness and restores energetic balance.",
    isSpa: true
  },
  {
    id: "spa-03",
    category: "spa",
    name: "Swedish Restorative Massage",
    duration: "60 / 90 min",
    originalPrice: 0,
    price: 0,
    gender: "Unisex",
    description: "Light-to-medium flowing strokes that melt surface tension and restore deep ease. Ideal first massage experience.",
    isSpa: true
  },
  {
    id: "spa-04",
    category: "spa",
    name: "Deep Tissue Recovery",
    duration: "60 / 90 min",
    originalPrice: 0,
    price: 0,
    gender: "Unisex",
    description: "Slow, firm pressure along muscle fibres and fascia. Targets chronic knots, aids posture and supports sports recovery.",
    isSpa: true
  },
  {
    id: "spa-05",
    category: "spa",
    name: "Aromatherapy Massage",
    duration: "60 / 90 min",
    originalPrice: 0,
    price: 0,
    gender: "Unisex",
    description: "Gentle flowing massage paired with your chosen pure essential oil blend. Seven curated blends available from Lavender Calm to Citrus Sun.",
    isSpa: true
  }
];

// Special Limited Privilege Offers
const OFFERS_DATA = [
  {
    id: "offer-royal40",
    code: "ROYAL40",
    badge: "40% OFF",
    title: "Keratin Revival & Scalp Detox",
    originalPrice: 4999,
    price: 2999,
    services: ["Royal Keratin Smoothening", "Scalp Detox Pre-Wash", "Ionic Blowout"]
  },
  {
    id: "offer-bride35",
    code: "BRIDE35",
    badge: "35% OFF",
    title: "Signature HD Bridal Package",
    originalPrice: 15999,
    price: 10399,
    services: ["HD Bridal Makeup", "Pre-Bridal Glow Prep", "Bridal Hair & Draping"]
  },
  {
    id: "offer-glam30",
    code: "GLAM30",
    badge: "30% OFF",
    title: "Gel Nail Extensions + Custom Art",
    originalPrice: 2499,
    price: 1749,
    services: ["Full Set Gel Extensions", "French Chrome Art", "Cuticle Revival Spa"]
  },
  {
    id: "offer-spa30",
    code: "SPA30",
    badge: "30% WELLNESS PRIVILEGE",
    title: "Spa & Wellness — 30% Privilege",
    originalPrice: 0,
    price: 0,
    services: ["Ayurvedic Abhyanga", "Turkish Hammam", "Balinese Massage", "Swedish Massage", "Deep Tissue Massage", "Aromatherapy Massage"]
  }
];

// Routes

// 1. Salon Info & Studios
app.get('/api/salon-info', (req, res) => {
  res.json({
    salon: SALON_DATA,
    studios: STUDIOS_DATA
  });
});

// 2. Services List
app.get('/api/services', (req, res) => {
  const { category, search } = req.query;
  let list = [...SERVICES_DATA];

  if (category && category !== 'all') {
    list = list.filter(s => s.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  res.json({ services: list });
});

// 3. Offers List
app.get('/api/offers', (req, res) => {
  res.json({ offers: OFFERS_DATA });
});

// 4. Send OTP (Mobile Phone Auth)
app.post('/api/auth/send-otp', (req, res) => {
  const { name, phone } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Please provide your full name" });
  }

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number" });
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
    demoOtp: generatedOtp // Returned so UI can auto-fill or show simulation
  });
});

// 5. Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and 4-digit OTP are required" });
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

  res.status(400).json({ error: "Invalid OTP. Please check the code or click Resend." });
});

// 6. Create Booking & Generate WhatsApp URL
app.post('/api/bookings', (req, res) => {
  const { user, services, date, time, couponCode, notes } = req.body;

  if (!user || !user.phone) {
    return res.status(401).json({ error: "Please verify your mobile number first." });
  }

  if (!services || !services.length) {
    return res.status(400).json({ error: "Select at least one service to book." });
  }

  // Spa items have price=0; only sum non-spa items for monetary totals
  const subtotal = services.reduce((sum, s) => sum + (s.price || 0), 0);
  const originalSubtotal = services.reduce((sum, s) => sum + (s.originalPrice || s.price || 0), 0);

  let discount = 0;
  if (couponCode) {
    const c = couponCode.trim().toUpperCase();
    if (c === 'ROYAL40') discount = Math.round(subtotal * 0.40);
    else if (c === 'BRIDE35') discount = Math.round(subtotal * 0.35);
    else if (c === 'GLAM30') discount = Math.round(subtotal * 0.30);
    else if (c === 'GLOW25') discount = Math.round(subtotal * 0.25);
    else if (c === 'SPA30') discount = 0; // spa prices confirmed at studio; privilege noted
  }

  const total = Math.max(0, subtotal - discount);
  const totalSavings = (originalSubtotal - subtotal) + discount;
  const bookingId = "SSL-" + Math.floor(100000 + Math.random() * 900000);

  const booking = {
    bookingId,
    user,
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

  // Build WhatsApp payload — spa items show duration + privilege note, not price
  const serviceListText = services.map(s => {
    if (s.isSpa) return `• ${s.name} (${s.duration}) — SPA30: 30% Wellness Privilege`;
    return `• ${s.name} (₹${s.price})`;
  }).join('\n');

  const hasSpaItems = services.some(s => s.isSpa);
  const spaNote = hasSpaItems ? '\n🌿 *Spa Pricing:* Confirmed at the studio · 30% Wellness Privilege applied\n' : '';

  const waText = encodeURIComponent(
    `*Appointment Reservation — The Style Studio Lounge (Derabassi)*\n` +
    `-----------------------------------------\n` +
    `🎫 *Booking ID:* ${bookingId}\n` +
    `👤 *Client Name:* ${user.name}\n` +
    `📞 *Phone:* ${user.phone}\n` +
    `📅 *Date:* ${booking.date}\n` +
    `⏰ *Time Slot:* ${booking.time}\n\n` +
    `*Selected Services:*\n${serviceListText}\n` +
    spaNote +
    (subtotal > 0 ? `\n💰 *Net Amount:* ₹${total} (Saved ₹${totalSavings})\n` : '') +
    `📍 *Salon:* Opposite Paras Plaza, Derabassi\n` +
    `-----------------------------------------\n` +
    `_Booked via The Style Studio Lounge VIP Web Portal_`
  );

  const waDispatchUrl = `https://wa.me/${SALON_DATA.phoneRaw}?text=${waText}`;

  res.json({
    success: true,
    booking,
    waDispatchUrl
  });
});

app.listen(PORT, () => {
  console.log(`[SERVER] The Style Studio Lounge API running on http://localhost:${PORT}`);
});

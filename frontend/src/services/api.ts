import type { SalonInfo, Studio, Service, Offer, User, Booking } from '../types';

const API_BASE = '/api';

const FALLBACK_SALON: SalonInfo = {
  name: 'The Style Studio Lounge',
  tagline: 'Contemporary Unisex Sanctuary • Hair, Skin & Bridal Atelier',
  phone: '+91 77102 87822',
  phoneRaw: '917710287822',
  address: 'G P Tower, Gali No. 8, Opposite Paras Plaza, Adarsh Nagar, Derabassi, Punjab 140507',
  timings: '10:00 AM – 8:00 PM (All 7 Days)',
  rating: 4.9,
  reviewsCount: 340,
  logoUrl: 'https://thestylestudiolounge.com/wp-content/uploads/2026/02/cropped-14_20260121_181045_0001-1.png'
};

const FALLBACK_STUDIOS: Studio[] = [
  {
    id: 'hair-atelier',
    title: 'Hair Atelier',
    subtitle: 'Precision Sculpting & Keratin',
    model: 'shears',
    portalColor: 'linear-gradient(135deg, rgba(230,210,195,0.4), rgba(43,92,255,0.15))',
    bgTint: '#f5eee6',
    description: 'Custom Balayage, Italian ammonia-free global shades, and 5-month mirror shine Keratin & Botox infusing pure botanical proteins.',
    featuredOffer: '40% OFF Royal Keratin',
    startingPrice: 499,
    image: '/images/studio_hair.jpg',
    tagline: 'Precision Color, European Balayage & Botanical Keratin Infusion'
  },
  {
    id: 'bridal-suite',
    title: 'Bridal Haute Couture',
    subtitle: 'HD & Airbrush Masterpieces',
    model: 'tiara',
    portalColor: 'linear-gradient(135deg, rgba(245,225,215,0.4), rgba(43,92,255,0.15))',
    bgTint: '#f9ede8',
    description: 'Camera-ready, waterproof 24hr bridal glow with international cosmetics, sculpted draping, and customized jewelry setting.',
    featuredOffer: '35% OFF Bridal Packages',
    startingPrice: 4499,
    image: '/images/studio_bridal.jpg',
    tagline: 'Bespoke Royal HD Bridal Glow & Designer Draping'
  },
  {
    id: 'skin-dermatology',
    title: 'Aesthetic Skin Lab',
    subtitle: 'Hydra Dermabrasion & Radiance',
    model: 'elixir',
    portalColor: 'linear-gradient(135deg, rgba(220,230,240,0.4), rgba(43,92,255,0.15))',
    bgTint: '#eef3f7',
    description: '7-step clinical hydro-infusion, peptide cold hammer tightening, and LED light therapies for pore refinement and glass glow.',
    featuredOffer: '25% OFF Hydra Facial',
    startingPrice: 1399,
    image: '/images/studio_skin.jpg',
    tagline: 'Clinical Hydra Dermabrasion, Glass Skin & Collagen Therapy'
  },
  {
    id: 'nail-gallery',
    title: 'Nail Lounge & Spa',
    subtitle: 'Sculpted Gel & Chrome Art',
    model: 'pedestal',
    portalColor: 'linear-gradient(135deg, rgba(235,225,230,0.4), rgba(43,92,255,0.15))',
    bgTint: '#f7eff2',
    description: 'French tips, chrome powders, acrylic extensions, and effervescent ice cream bubble pedicures with botanical paraffin.',
    featuredOffer: '30% OFF Nail Extensions',
    startingPrice: 899,
    image: '/images/studio_nails.jpg',
    tagline: 'Artisan Gel Extensions, Chrome Dusting & Russian Manicures'
  }
];

const FALLBACK_SERVICES: Service[] = [
  { id: 'hair-cut', category: 'hair', name: 'Architectural Cut & Blowout', duration: '45 mins', duration_min: 45, originalPrice: 799, price: 499, gender: 'Unisex' },
  { id: 'hair-keratin', category: 'hair', name: 'Royal Keratin Smoothening Therapy', duration: '120 mins', duration_min: 120, originalPrice: 4999, price: 2999, gender: 'Unisex' },
  { id: 'hair-balayage', category: 'hair', name: 'Dimensional Balayage & Olaplex', duration: '150 mins', duration_min: 150, originalPrice: 5500, price: 3699, gender: 'Unisex' },
  { id: 'hair-global', category: 'hair', name: 'Italian Ammonia-Free Global Color', duration: '90 mins', duration_min: 90, originalPrice: 3800, price: 2499, gender: 'Unisex' },
  { id: 'bridal-signature', category: 'bridal', name: 'Signature HD Bridal Makeover', duration: '180 mins', duration_min: 180, originalPrice: 15999, price: 10399, gender: 'Bridal' },
  { id: 'bridal-airbrush', category: 'bridal', name: 'Ultra-Airbrush HD Bridal Glamour', duration: '210 mins', duration_min: 210, originalPrice: 19999, price: 13999, gender: 'Bridal' },
  { id: 'bridal-sagan', category: 'bridal', name: 'Engagement & Sagan Celebration Makeup', duration: '120 mins', duration_min: 120, originalPrice: 6500, price: 4499, gender: 'Bridal' },
  { id: 'skin-hydra', category: 'skin', name: '7-Step Clinical Hydra Facial', duration: '60 mins', duration_min: 60, originalPrice: 3499, price: 2624, gender: 'Unisex' },
  { id: 'skin-gold', category: 'skin', name: '24K Gold Illuminating Facial', duration: '60 mins', duration_min: 60, originalPrice: 2800, price: 1899, gender: 'Unisex' },
  { id: 'nails-extensions', category: 'nails', name: 'Sculpted Gel / Acrylic Extensions', duration: '90 mins', duration_min: 90, originalPrice: 2499, price: 1749, gender: 'Unisex' },
  { id: 'nails-pedicure', category: 'nails', name: 'Ice Cream Bubble Spa Pedicure', duration: '50 mins', duration_min: 50, originalPrice: 1499, price: 999, gender: 'Unisex' }
];

const FALLBACK_OFFERS: Offer[] = [
  { id: 'offer-royal40', code: 'ROYAL40', badge: '40% OFF', title: 'Keratin Revival & Scalp Detox', originalPrice: 4999, price: 2999, services: ['Royal Keratin Smoothening', 'Scalp Detox Pre-Wash', 'Ionic Blowout'] },
  { id: 'offer-bride35', code: 'BRIDE35', badge: '35% OFF', title: 'Signature HD Bridal Package', originalPrice: 15999, price: 10399, services: ['HD Bridal Makeup', 'Pre-Bridal Glow Prep', 'Bridal Hair & Draping'] },
  { id: 'offer-glam30', code: 'GLAM30', badge: '30% OFF', title: 'Gel Nail Extensions + Custom Art', originalPrice: 2499, price: 1749, services: ['Full Set Gel Extensions', 'French Chrome Art', 'Cuticle Revival Spa'] },
  { id: 'offer-glow25', code: 'GLOW25', badge: '25% OFF', title: 'Clinical Hydra Facial Glow', originalPrice: 3499, price: 2624, services: ['7-Step Clinical Hydra Facial', 'Hyaluronic Acid Serum Wash', 'LED Phototherapy'] }
];

export const api = {
  async getSalonInfo(): Promise<{ salon: SalonInfo; studios: Studio[] }> {
    try {
      const res = await fetch(`${API_BASE}/salon-info`);
      if (!res.ok) throw new Error('Failed to load salon info');
      return res.json();
    } catch {
      return { salon: FALLBACK_SALON, studios: FALLBACK_STUDIOS };
    }
  },

  async getServices(category?: string, search?: string): Promise<{ services: Service[] }> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      const res = await fetch(`${API_BASE}/services?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch services');
      return res.json();
    } catch {
      return { services: FALLBACK_SERVICES };
    }
  },

  async getOffers(): Promise<{ offers: Offer[] }> {
    try {
      const res = await fetch(`${API_BASE}/offers`);
      if (!res.ok) throw new Error('Failed to fetch offers');
      return res.json();
    } catch {
      return { offers: FALLBACK_OFFERS };
    }
  },

  async sendOtp(name: string, phone: string): Promise<{ success: boolean; message: string; phone: string; name: string; demoOtp: string }> {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to verify OTP');
    return data;
  },

  async createBooking(payload: {
    name?: string;
    phone?: string;
    user?: User;
    services: Service[];
    date: string;
    time: string;
    couponCode?: string;
  }): Promise<{ success: boolean; booking: Booking; waDispatchUrl: string }> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = typeof data.error === 'object' && data.error?.message ? data.error.message : (data.error || 'Failed to complete booking');
      throw new Error(msg);
    }
    return data;
  }
};

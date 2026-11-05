export interface Studio {
  id: string;
  title: string;
  subtitle: string;
  model: 'shears' | 'tiara' | 'elixir' | 'pedestal';
  portalColor: string;
  bgTint: string;
  description: string;
  featuredOffer: string;
  startingPrice: number;
  image?: string;
  tagline?: string;
}

export interface Service {
  id: string;
  category: string; // 'hair' | 'bridal' | 'skin' | 'nails' | 'spa'
  name: string;
  duration: string;
  duration_min?: number;
  originalPrice: number | null; // null for spa items (price confirmed at studio)
  price: number | null;         // null for spa items
  gender?: string;
  description?: string;
  isSpa?: boolean;              // flag to identify spa services
}

export interface Offer {
  id: string;
  code: string;
  badge: string;
  title: string;
  originalPrice: number;
  price: number;
  services: string[];
}

export interface User {
  name: string;
  phone: string;
  vipId?: string;
  isVip?: boolean;
}

export interface Booking {
  bookingId: string;
  user: User;
  services: Service[];
  date: string;
  time: string;
  subtotal: number;
  discount: number;
  total: number;
  totalSavings: number;
  status: string;
}

export interface SalonInfo {
  name: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  address: string;
  timings: string;
  rating: number;
  reviewsCount: number;
  logoUrl: string;
}

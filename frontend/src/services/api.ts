import type { SalonInfo, Studio, Service, Offer, User, Booking } from '../types';

const API_BASE = '/api';

export const api = {
  async getSalonInfo(): Promise<{ salon: SalonInfo; studios: Studio[] }> {
    const res = await fetch(`${API_BASE}/salon-info`);
    if (!res.ok) throw new Error('Failed to load salon info');
    return res.json();
  },

  async getServices(category?: string, search?: string): Promise<{ services: Service[] }> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/services?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async getOffers(): Promise<{ offers: Offer[] }> {
    const res = await fetch(`${API_BASE}/offers`);
    if (!res.ok) throw new Error('Failed to fetch offers');
    return res.json();
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

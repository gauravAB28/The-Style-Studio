import React, { useState, useEffect } from 'react';
import type { Service, Booking } from '../types';
import { api } from '../services/api';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Service[];
  onRemoveService: (id: string) => void;
  onBookingSuccess: (booking: Booking, waUrl: string) => void;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveService,
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);

  // Detect if cart has any spa items
  const hasSpaItems = cart.some((item) => item.isSpa || item.category === 'spa');

  // Auto-apply SPA30 when spa items are in cart
  useEffect(() => {
    if (hasSpaItems && !appliedCoupon) {
      setAppliedCoupon({ code: 'SPA30', pct: 0 });
    }
    // If spa items removed and SPA30 was auto-applied, clear it
    if (!hasSpaItems && appliedCoupon?.code === 'SPA30') {
      setAppliedCoupon(null);
    }
  }, [hasSpaItems]);

  if (!isOpen) return null;

  // Next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayStr = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { iso: d.toISOString().split('T')[0], day: dayStr, dateNum };
  });

  const timeSlots = ['10:30 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'];

  // Only sum non-spa items for monetary totals (spa prices confirmed at studio)
  const nonSpaItems = cart.filter((item) => !item.isSpa && item.category !== 'spa' && item.price !== null);
  const subtotal = nonSpaItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const originalSubtotal = nonSpaItems.reduce((acc, item) => acc + (item.originalPrice || 0), 0);

  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.code !== 'SPA30') {
    discountAmount = Math.round((subtotal * appliedCoupon.pct) / 100);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalSavings = (originalSubtotal - subtotal) + discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const c = coupon.trim().toUpperCase();

    if (c === 'ROYAL40') {
      setAppliedCoupon({ code: 'ROYAL40', pct: 40 });
    } else if (c === 'BRIDE35') {
      setAppliedCoupon({ code: 'BRIDE35', pct: 35 });
    } else if (c === 'GLAM30') {
      setAppliedCoupon({ code: 'GLAM30', pct: 30 });
    } else if (c === 'GLOW25') {
      setAppliedCoupon({ code: 'GLOW25', pct: 25 });
    } else if (c === 'SPA30') {
      setAppliedCoupon({ code: 'SPA30', pct: 0 });
    } else {
      setCouponError('Invalid code. Try ROYAL40, BRIDE35, GLAM30, or GLOW25');
    }
  };

  const validate = () => {
    let valid = true;
    const trimmed = customerName.trim();
    if (trimmed.length < 2 || trimmed.length > 60) {
      setNameError('Name must be between 2 and 60 characters');
      valid = false;
    } else {
      setNameError('');
    }

    if (!/^[6-9]\d{9}$/.test(customerPhone.trim())) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (starts with 6-9)');
      valid = false;
    } else {
      setPhoneError('');
    }

    return valid;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.createBooking({
        name: customerName.trim(),
        phone: customerPhone.trim(),
        services: cart,
        date: selectedDate,
        time: selectedTime,
        couponCode: appliedCoupon?.code,
      });
      onBookingSuccess(res.booking, res.waDispatchUrl);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#b89a73]/30 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#b89a73]/20 flex justify-between items-center bg-[#faf6f0]">
            <div>
              <h3 className="font-serif-luxury text-2xl font-semibold text-[#1a1614]">Your Sanctuary Visit</h3>
              <p className="text-xs text-[#5e5650] mt-0.5">The Style Studio Lounge • Derabassi</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f4efe6] hover:bg-[#eadecc] text-[#5e5650] hover:text-[#1a1614] flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3 opacity-60">🛍️</div>
                <h4 className="text-[#1a1614] font-medium text-base">Your booking list is empty</h4>
                <p className="text-xs text-[#5e5650] mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Select your hair, skin, bridal, nail, or spa therapies from our signature studios or pricing catalog.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#5e5650]">
                  Selected Treatments ({cart.length})
                </div>

                {/* Spa Notice Banner */}
                {hasSpaItems && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#f5e9d4] to-[#faf0e0] border border-[#c59b4b]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#8a651f]">✦ 30% Spa Wellness Privilege Included</span>
                    </div>
                    <p className="text-[10px] text-[#5e5650] leading-relaxed">
                      A 30% privilege is automatically applied to all signature spa therapies. Final rate is confirmed with your therapist upon arrival.
                    </p>
                  </div>
                )}

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#faf6f0] border border-[#b89a73]/25 rounded-2xl flex justify-between items-center hover:border-[#b89a73]/50 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#1a1614] flex items-center gap-1.5">
                        {item.name}
                        {(item.isSpa || item.category === 'spa') && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#c59b4b]/20 text-[#8a651f] font-bold">SPA</span>
                        )}
                      </div>
                      <div className="text-xs text-[#5e5650] mt-0.5">⏱️ {item.duration}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Spa / null price: show "Price confirmed at the studio" */}
                      {item.isSpa || item.category === 'spa' || item.price === null ? (
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#c59b4b]">Price confirmed at the studio</div>
                          <div className="text-[10px] text-[#8c827a]">30% Privilege</div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#2f54eb]">₹{item.price}</div>
                          {item.originalPrice && (
                            <div className="text-xs text-[#8c827a] line-through">₹{item.originalPrice}</div>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveService(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                {/* Date Selector */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5e5650] mb-2.5">
                    1. Select Date
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dateOptions.map((opt) => (
                      <button
                        key={opt.iso}
                        type="button"
                        onClick={() => setSelectedDate(opt.iso)}
                        className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-center transition-all ${
                          selectedDate === opt.iso
                            ? 'bg-[#2f54eb] border-[#2f54eb] text-white shadow-md'
                            : 'bg-[#faf6f0] border-[#b89a73]/25 text-[#5e5650] hover:border-[#b89a73]/50'
                        }`}
                      >
                        <div className="text-[11px] font-medium opacity-85">{opt.day}</div>
                        <div className="text-xs font-bold mt-0.5">{opt.dateNum}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5e5650] mb-2.5">
                    2. Select Time (10:30 AM – 7:00 PM)
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-1 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedTime === slot
                            ? 'bg-[#c59b4b]/20 border-[#c59b4b] text-[#855e16] font-bold shadow-sm'
                            : 'bg-[#faf6f0] border-[#b89a73]/25 text-[#5e5650] hover:border-[#b89a73]/50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Details (No customer login/OTP required) */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5e5650] mb-2.5">
                    3. Guest Details
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5e5650] uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (nameError) setNameError('');
                        }}
                        maxLength={60}
                        placeholder="Your full name (e.g. Ananya Sharma)"
                        className={`w-full px-3.5 py-2.5 bg-[#faf6f0] border rounded-xl text-xs text-[#1a1614] placeholder:text-slate-400 focus:outline-none transition-colors ${
                          nameError ? 'border-red-500 focus:border-red-500' : 'border-[#b89a73]/30 focus:border-[#2f54eb]'
                        }`}
                      />
                      {nameError && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{nameError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5e5650] uppercase tracking-wider mb-1">
                        Phone Number (10 Digits)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#786e64]">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={customerPhone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setCustomerPhone(digits);
                            if (phoneError) setPhoneError('');
                          }}
                          placeholder="9876543210"
                          className={`w-full pl-12 pr-3.5 py-2.5 bg-[#faf6f0] border rounded-xl text-xs font-medium text-[#1a1614] placeholder:text-slate-400 focus:outline-none transition-colors tracking-wide ${
                            phoneError ? 'border-red-500 focus:border-red-500' : 'border-[#b89a73]/30 focus:border-[#2f54eb]'
                          }`}
                        />
                      </div>
                      {phoneError ? (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{phoneError}</p>
                      ) : (
                        <p className="text-[10px] text-[#786e64] mt-1">Instant confirmation · No customer login or OTP required</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5e5650] mb-2">
                    4. Privilege Promo Code
                  </div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. ROYAL40, BRIDE35, GLAM30"
                      className="flex-1 px-3 py-2 bg-[#faf6f0] border border-[#b89a73]/30 rounded-xl text-[#1a1614] placeholder:text-slate-400 text-xs uppercase focus:outline-none focus:border-[#2f54eb]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1a1614] hover:bg-[#2f54eb] text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {appliedCoupon && appliedCoupon.code !== 'SPA30' && (
                    <div className="text-xs mt-1.5 font-medium text-emerald-600">
                      ✓ Promo Code {appliedCoupon.code} applied ({appliedCoupon.pct}% OFF)!
                    </div>
                  )}
                  {couponError && (
                    <div className="text-xs text-red-500 mt-1.5 font-medium">{couponError}</div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Totals */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#b89a73]/20 bg-[#faf6f0] space-y-3">
              {/* Spa notice when only spa items */}
              {hasSpaItems && nonSpaItems.length === 0 ? (
                <div className="text-center py-2">
                  <div className="font-serif-luxury italic text-lg text-[#8a651f] mb-1">Spa Rituals Selected</div>
                  <p className="text-xs text-[#5e5650] leading-relaxed">
                    Price confirmed at the studio. 30% Wellness Privilege is included for all spa services.
                  </p>
                </div>
              ) : (
                <>
                  {nonSpaItems.length > 0 && (
                    <>
                      <div className="flex justify-between text-xs text-[#5e5650]">
                        <span>Services Total:</span>
                        <span className="font-medium text-[#1a1614]">₹{subtotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                          <span>Privilege Discount:</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-[#5e5650]">
                        <span>Total Savings:</span>
                        <span className="text-emerald-600 font-semibold">₹{totalSavings}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[#1a1614] pt-2 border-t border-[#b89a73]/20">
                        <span>Net Amount:</span>
                        <span className="text-[#2f54eb]">₹{finalTotal}</span>
                      </div>
                    </>
                  )}
                  {hasSpaItems && nonSpaItems.length > 0 && (
                    <div className="text-[10px] text-[#8a651f] bg-[#c59b4b]/10 rounded-xl p-2.5 border border-[#c59b4b]/20">
                      ✦ 30% Wellness Privilege included on spa sessions · Price confirmed at the studio
                    </div>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-royal-blue py-3.5 mt-2 font-bold shadow-lg"
              >
                {loading ? 'Confirming...' : 'Reserve Appointment ➔'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

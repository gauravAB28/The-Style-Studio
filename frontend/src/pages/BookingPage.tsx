import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../components/Layout';
import { api } from '../services/api';

export const BookingPage: React.FC = () => {
  const { cart, handleRemoveFromCart, setConfirmedBooking, clearCart, appliedCoupon, setAppliedCoupon } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected date and time slots (Phase 3 placeholder structure)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('11:30 AM');

  // Customer guest details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detect spa items in cart
  const hasSpaItems = cart.some((item) => item.isSpa || item.category === 'spa' || item.price === null);

  // Auto-apply SPA30 when spa items are in cart and no other coupon applied
  useEffect(() => {
    if (hasSpaItems && !appliedCoupon) {
      setAppliedCoupon({ code: 'SPA30', pct: 0 });
    } else if (!hasSpaItems && appliedCoupon?.code === 'SPA30') {
      setAppliedCoupon(null);
    }
  }, [hasSpaItems, appliedCoupon, setAppliedCoupon]);

  // Pre-fill coupon from query param or navigation state (e.g. from Offers "Claim Offer")
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeParam = params.get('coupon');
    if (codeParam) {
      applyCouponCode(codeParam);
    }
  }, [location.search]);

  // Date options (next 7 days)
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayStr = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { iso: d.toISOString().split('T')[0], day: dayStr, dateNum };
  });

  const timeSlots = [
    '10:30 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'
  ];

  // Pricing computations (null-safe for spa services)
  const nonSpaItems = cart.filter((item) => !item.isSpa && item.category !== 'spa' && item.price !== null);
  const subtotal = nonSpaItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const originalSubtotal = nonSpaItems.reduce((acc, item) => acc + (item.originalPrice || item.price || 0), 0);

  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.code !== 'SPA30' && appliedCoupon.pct > 0) {
    discountAmount = Math.round((subtotal * appliedCoupon.pct) / 100);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalSavings = (originalSubtotal - subtotal) + discountAmount;

  const applyCouponCode = (code: string) => {
    setCouponError('');
    setCouponSuccess('');
    const c = code.trim().toUpperCase();

    if (!c) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (c === 'ROYAL40') {
      setAppliedCoupon({ code: 'ROYAL40', pct: 40 });
      setCouponSuccess('ROYAL40 applied! 40% discount deducted from eligible treatments.');
      setCouponInput('');
    } else if (c === 'BRIDE35') {
      setAppliedCoupon({ code: 'BRIDE35', pct: 35 });
      setCouponSuccess('BRIDE35 applied! 35% discount deducted from eligible treatments.');
      setCouponInput('');
    } else if (c === 'GLAM30') {
      setAppliedCoupon({ code: 'GLAM30', pct: 30 });
      setCouponSuccess('GLAM30 applied! 30% discount deducted from eligible treatments.');
      setCouponInput('');
    } else if (c === 'SPA30') {
      setAppliedCoupon({ code: 'SPA30', pct: 0 });
      setCouponSuccess('SPA30 applied! 30% Wellness Privilege included at consultation.');
      setCouponInput('');
    } else {
      setCouponError(`Invalid promo code "${c}". Valid codes: ROYAL40, BRIDE35, GLAM30, SPA30.`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(raw);
    if (phoneError) setPhoneError('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
    if (nameError) setNameError('');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/#treatments');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErr = false;

    const trimmedName = customerName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 60) {
      setNameError('Please enter your full name (2 to 60 characters).');
      hasErr = true;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      hasErr = true;
    }

    if (cart.length === 0) {
      alert('Your booking list is empty. Please select at least one treatment.');
      return;
    }

    if (hasErr) return;

    try {
      setIsSubmitting(true);
      const res = await api.createBooking({
        name: trimmedName,
        phone: cleanPhone,
        services: cart,
        date: selectedDate,
        time: selectedTime,
        couponCode: appliedCoupon?.code,
      });

      // Show confirmation pass modal
      setConfirmedBooking({ booking: res.booking, waUrl: res.waDispatchUrl });
      clearCart();
    } catch (err: any) {
      alert(err.message || 'Unable to complete reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] pt-20 sm:pt-28 pb-28 sm:pb-24 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Back Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-4 py-2 rounded-full bg-white border border-[#b89a73]/30 text-xs font-semibold text-[#1a1614] hover:border-[#2f54eb] hover:text-[#2f54eb] transition-all shadow-sm group"
          >
            <span className="text-base transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Treatments</span>
          </button>
          <span className="text-xs font-mono text-[#8c827a] uppercase tracking-wider hidden sm:inline-block">
            Instant Studio Reservation
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8 sm:mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#b89a73]/30 text-xs text-[#5e5650] shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c59b4b] animate-pulse"></span>
            <span className="text-[11px] sm:text-xs">Instant Confirmation • No Login Required</span>
          </div>
          <h1 className="font-serif-luxury italic text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1a1614] leading-tight">
            Your Bespoke Sanctuary Pass
          </h1>
          <p className="text-xs sm:text-sm text-[#5e5650] mt-1.5 font-light max-w-2xl">
            Review your selected treatments, choose your preferred appointment time, and secure instant confirmation without any passwords or OTP delays.
          </p>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="cream-card rounded-3xl p-8 sm:p-14 text-center border border-[#b89a73]/30 shadow-lg bg-white max-w-2xl mx-auto my-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#faf4ec] border border-[#b89a73]/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🛍️
            </div>
            <div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#1a1614]">
                Your Reservation List is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#5e5650] mt-2 font-light max-w-md mx-auto">
                Explore our signature hair sculpting, bridal couture, clinical skincare, and spa rituals to begin crafting your session.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/#treatments"
                className="btn-royal-blue text-xs sm:text-sm py-3 px-6 shadow-md min-h-[44px]"
              >
                Browse Treatments Menu ➔
              </Link>
              <Link
                to="/spa"
                className="btn-outline-cream text-xs sm:text-sm py-3 px-6 shadow-sm min-h-[44px]"
              >
                Explore Spa &amp; Wellness ✦
              </Link>
            </div>
          </div>
        ) : (
          /* Main Two-Column Booking Layout */
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Treatments & Schedule (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Selected Treatments Section */}
              <div className="cream-card rounded-3xl p-5 sm:p-7 border border-[#b89a73]/30 shadow-md bg-white">
                <div className="flex items-center justify-between pb-4 border-b border-[#b89a73]/20 mb-4">
                  <div>
                    <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#1a1614]">
                      Selected Treatments ({cart.length})
                    </h2>
                    <span className="text-[11px] font-mono text-[#8c827a]">
                      All appointments include consultation &amp; Italian formulations
                    </span>
                  </div>
                  <Link
                    to="/#treatments"
                    className="text-xs font-semibold text-[#2f54eb] hover:underline min-h-[44px] flex items-center"
                  >
                    + Add More
                  </Link>
                </div>

                <div className="divide-y divide-[#b89a73]/15">
                  {cart.map((item) => {
                    const isItemSpa = item.isSpa || item.category === 'spa' || item.price === null;
                    return (
                      <div key={item.id} className="py-4 flex items-center justify-between gap-3 group">
                        <div className="space-y-1 pr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif-luxury text-lg sm:text-xl font-medium text-[#1a1614]">
                              {item.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#faf4ec] text-[#5e5650] font-mono border border-[#b89a73]/20">
                              ⏱️ {item.duration}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-[#5e5650] font-light line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                          <div className="text-right">
                            {isItemSpa ? (
                              <div className="text-xs sm:text-sm font-semibold text-[#8a651f] bg-[#c59b4b]/10 px-2.5 py-1 rounded-full border border-[#c59b4b]/20 whitespace-nowrap">
                                Confirmed at studio
                              </div>
                            ) : (
                              <>
                                <div className="text-lg sm:text-xl font-bold text-[#8a651f] font-serif-luxury">
                                  ₹{item.price}
                                </div>
                                {item.originalPrice && (
                                  <div className="text-[11px] text-slate-400 line-through">
                                    ₹{item.originalPrice}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="w-11 h-11 rounded-full bg-[#faf4ec] hover:bg-rose-50 text-[#8c827a] hover:text-rose-600 border border-[#b89a73]/20 hover:border-rose-300 flex items-center justify-center text-sm font-bold transition-all shadow-sm flex-shrink-0"
                            title={`Remove ${item.name}`}
                            aria-label={`Remove ${item.name}`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Slot Picker (Phase 3 placeholder structure) */}
              <div className="cream-card rounded-3xl p-5 sm:p-7 border border-[#b89a73]/30 shadow-md bg-white space-y-5">
                <div className="border-b border-[#b89a73]/20 pb-3">
                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#1a1614]">
                    Preferred Appointment Schedule
                  </h2>
                  <p className="text-xs text-[#5e5650] mt-0.5">
                    Select your preferred date &amp; start slot. Instant slot locking in Derabassi salon.
                  </p>
                </div>

                {/* Day selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1614] mb-2.5">
                    1. Select Date
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {dateOptions.map((opt) => {
                      const isSelected = selectedDate === opt.iso;
                      return (
                        <button
                          key={opt.iso}
                          type="button"
                          onClick={() => setSelectedDate(opt.iso)}
                          className={`p-2.5 rounded-2xl text-center border transition-all min-h-[44px] ${
                            isSelected
                              ? 'bg-[#2f54eb] text-white border-[#2f54eb] shadow-md scale-102'
                              : 'bg-white text-[#5e5650] border-[#b89a73]/30 hover:border-[#2f54eb]'
                          }`}
                        >
                          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                            {opt.day}
                          </span>
                          <span className="block text-xs font-semibold mt-0.5">
                            {opt.dateNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slot selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1614] mb-2.5">
                    2. Select Start Time
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all text-center min-h-[44px] ${
                            isSelected
                              ? 'bg-[#1a1614] text-white border-[#1a1614] shadow-md'
                              : 'bg-white text-[#5e5650] border-[#b89a73]/30 hover:border-[#1a1614]'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Guest Details & Pricing Breakdown (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Guest Details Card */}
              <div className="cream-card rounded-3xl p-5 sm:p-7 border border-[#b89a73]/30 shadow-md bg-white space-y-4">
                <div className="border-b border-[#b89a73]/20 pb-3">
                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#1a1614]">
                    Client Information
                  </h2>
                  <p className="text-xs text-[#5e5650] mt-0.5">
                    Instant confirmation dispatched to this phone. No password or OTP required.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-xs font-semibold uppercase tracking-wider text-[#1a1614] mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={handleNameChange}
                      placeholder="e.g. Jaspreet Kaur"
                      required
                      className={`w-full px-4 py-3 bg-[#faf7f2] border rounded-2xl text-base text-[#1a1614] focus:outline-none focus:bg-white transition-colors min-h-[44px] ${
                        nameError ? 'border-rose-400 bg-rose-50/30' : 'border-[#b89a73]/30 focus:border-[#2f54eb]'
                      }`}
                    />
                    {nameError && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{nameError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className="block text-xs font-semibold uppercase tracking-wider text-[#1a1614] mb-1.5">
                      10-Digit Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8c827a]">
                        +91
                      </span>
                      <input
                        id="customerPhone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        value={customerPhone}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        required
                        className={`w-full pl-14 pr-4 py-3 bg-[#faf7f2] border rounded-2xl text-base text-[#1a1614] focus:outline-none focus:bg-white transition-colors min-h-[44px] font-mono ${
                          phoneError ? 'border-rose-400 bg-rose-50/30' : 'border-[#b89a73]/30 focus:border-[#2f54eb]'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{phoneError}</p>
                    )}
                    <p className="text-[11px] text-[#8c827a] mt-1">
                      We will dispatch your booking confirmation pass to this number.
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon Code Card */}
              <div className="cream-card rounded-3xl p-5 sm:p-7 border border-[#b89a73]/30 shadow-md bg-white space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a1614]">
                  Privilege Promo Code
                </label>
                
                {appliedCoupon ? (
                  <div className="p-3.5 rounded-2xl bg-[#faf4ec] border border-[#c59b4b]/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#8a651f] bg-[#c59b4b]/20 px-2 py-0.5 rounded">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-xs font-semibold text-[#1a1614]">
                          {appliedCoupon.code === 'SPA30' ? '30% Wellness Privilege' : `${appliedCoupon.pct}% OFF Applied`}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5e5650] mt-0.5">
                        {appliedCoupon.code === 'SPA30'
                          ? 'Included automatically for Spa & Wellness therapies'
                          : `Saved ₹${discountAmount} on non-spa treatments`}
                      </p>
                    </div>
                    {appliedCoupon.code !== 'SPA30' && (
                      <button
                        type="button"
                        onClick={() => setAppliedCoupon(null)}
                        className="text-xs text-rose-600 hover:underline font-semibold min-h-[44px] px-2 flex items-center"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. ROYAL40, GLAM30"
                      className="flex-1 px-4 py-2.5 bg-[#faf7f2] border border-[#b89a73]/30 rounded-2xl text-base uppercase text-[#1a1614] focus:outline-none focus:border-[#2f54eb] min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => applyCouponCode(couponInput)}
                      className="btn-royal-blue text-xs px-5 py-2.5 font-semibold min-h-[44px]"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-xs text-rose-500 font-medium">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-emerald-600 font-medium">{couponSuccess}</p>
                )}

                <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-[#8c827a]">
                  <span>Available:</span>
                  <button type="button" onClick={() => applyCouponCode('ROYAL40')} className="hover:underline font-mono text-[#2f54eb]">ROYAL40</button>
                  <span>•</span>
                  <button type="button" onClick={() => applyCouponCode('BRIDE35')} className="hover:underline font-mono text-[#2f54eb]">BRIDE35</button>
                  <span>•</span>
                  <button type="button" onClick={() => applyCouponCode('GLAM30')} className="hover:underline font-mono text-[#2f54eb]">GLAM30</button>
                </div>
              </div>

              {/* Price Breakdown & Confirmation Card */}
              <div className="cream-card rounded-3xl p-5 sm:p-7 border border-[#b89a73]/30 shadow-md bg-white space-y-4">
                <h3 className="font-serif-luxury text-xl font-semibold text-[#1a1614] border-b border-[#b89a73]/20 pb-2">
                  Sanctuary Rate Summary
                </h3>

                <div className="space-y-2 text-xs text-[#5e5650]">
                  <div className="flex justify-between items-center">
                    <span>Treatments Subtotal ({nonSpaItems.length} items):</span>
                    <span className="font-semibold text-[#1a1614] font-serif-luxury text-base">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-semibold">
                      <span>Privilege Savings ({appliedCoupon?.code}):</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  {hasSpaItems && (
                    <div className="p-2.5 rounded-xl bg-[#faf4ec] border border-[#c59b4b]/20 text-[11px] text-[#8a651f] space-y-0.5">
                      <div className="font-semibold">✦ Spa &amp; Wellness Privilege:</div>
                      <div>
                        Spa rates are confirmed privately at the studio during your personal consultation. 30% Wellness Privilege is reserved under your name.
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#b89a73]/20 flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[#1a1614]">Net Estimated Total:</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#8a651f]">
                        ₹{finalTotal}
                      </span>
                      {hasSpaItems && (
                        <span className="block text-[10px] text-[#8a651f] font-mono">
                          + Studio Spa Balance
                        </span>
                      )}
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="text-right text-[11px] text-emerald-600 font-bold">
                      You are saving ₹{totalSavings} today
                    </div>
                  )}
                </div>

                {/* Desktop Primary Submit Button */}
                <div className="pt-4 hidden sm:block">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-royal-blue py-3.5 text-sm font-semibold shadow-xl shadow-[#2f54eb]/25 flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>{isSubmitting ? 'Confirming Reservation…' : 'Confirm Instant Reservation'}</span>
                    <span>➔</span>
                  </button>
                  <p className="text-[11px] text-center text-[#8c827a] mt-2">
                    Instant lock in Derabassi salon. No payment needed now.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Bottom Bar (Phones only, respecting safe area) */}
            <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#b89a73]/30 p-3 shadow-2xl safe-area-bottom">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-[#8c827a] uppercase tracking-wider block">
                    Estimated Total
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-serif-luxury font-bold text-[#8a651f]">
                      ₹{finalTotal}
                    </span>
                    {hasSpaItems && (
                      <span className="text-[10px] text-[#8a651f] font-mono">+ Spa</span>
                    )}
                  </div>
                  {totalSavings > 0 && (
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Save ₹{totalSavings}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-royal-blue py-3 px-5 text-xs font-semibold shadow-lg flex-1 min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <span>{isSubmitting ? 'Confirming…' : 'Confirm Reservation'}</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage;

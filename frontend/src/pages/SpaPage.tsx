import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SPA_TREATMENTS } from '../data/spaTreatments';
import { Spa3DAtmosphere } from '../components/Spa3DAtmosphere';
import { Spa3DTiltCard } from '../components/Spa3DTiltCard';
import { useLayout } from '../components/Layout';
import type { Service } from '../types';
import { assetPath } from '../utils/assetPath';

export const SpaPage: React.FC = () => {
  const { handleAddToCart } = useLayout();
  const navigate = useNavigate();
  
  // Rituals Auto-Slider State
  const [selectedRitualIndex, setSelectedRitualIndex] = useState<number>(0);
  const [isRitualPaused, setIsRitualPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Aromatherapy Atelier State
  const aromaTreatment = SPA_TREATMENTS.find((t) => t.category === 'aromatherapy');
  const blends = aromaTreatment?.aromatherapyBlends || [];
  const [selectedBlendId, setSelectedBlendId] = useState<string>(blends[0]?.id || 'blend-lavender');
  const [isBlendPaused, setIsBlendPaused] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Spa & Wellness Sanctuary | The Style Studio Lounge';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // 1. Auto-Advance Ritual Slides Every 4.8s (Pauses on Hover / Touch)
  useEffect(() => {
    if (isRitualPaused) return;
    const interval = setInterval(() => {
      setSelectedRitualIndex((prev) => (prev + 1) % SPA_TREATMENTS.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isRitualPaused]);

  // 2. Auto-Advance Aromatherapy Essences Every 4.5s
  useEffect(() => {
    if (isBlendPaused || blends.length === 0) return;
    const interval = setInterval(() => {
      setSelectedBlendId((prevId) => {
        const currentIndex = blends.findIndex((b) => b.id === prevId);
        const nextIndex = (currentIndex + 1) % blends.length;
        return blends[nextIndex].id;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isBlendPaused, blends]);

  const handlePrevRitual = () => {
    setSelectedRitualIndex((prev) => (prev - 1 + SPA_TREATMENTS.length) % SPA_TREATMENTS.length);
  };

  const handleNextRitual = () => {
    setSelectedRitualIndex((prev) => (prev + 1) % SPA_TREATMENTS.length);
  };

  // Mobile Touch Swipe Handlers for Rituals
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsRitualPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNextRitual(); // Swiped left -> next
      } else {
        handlePrevRitual(); // Swiped right -> prev
      }
    }
    // Resume auto-slide after brief pause
    setTimeout(() => setIsRitualPaused(false), 2000);
  };

  const addSpaService = (treatmentName: string, duration: string, serviceId: string) => {
    const spaService: Service = {
      id: serviceId,
      category: 'spa',
      name: treatmentName,
      duration,
      originalPrice: null,
      price: null,
      gender: 'Unisex',
      description: 'Exclusive spa session at The Style Studio Lounge. 30% Wellness Privilege included.',
      isSpa: true,
    };
    handleAddToCart(spaService);
  };

  const activeTreatment = SPA_TREATMENTS[selectedRitualIndex] || SPA_TREATMENTS[0];
  const activeBlend = blends.find((b) => b.id === selectedBlendId) || blends[0];

  return (
    <>
      <div className="min-h-screen bg-[#faf7f2] text-[#1a1614] overflow-x-hidden selection:bg-[#2f54eb] selection:text-white">
        
        {/* ── 1. CINEMATIC 3D SANCTUARY HERO ─────────────────────────────────── */}
        <section className="relative min-h-[72dvh] sm:min-h-[85dvh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-24 pb-10 sm:pb-16 px-3 sm:px-4">
          {/* Full-Screen Photography */}
          <div className="absolute inset-0 z-0">
            <img
              src={assetPath('/images/spa/spa-hero.jpg')}
              alt="Spa Sanctuary Atmosphere"
              className="w-full h-full object-cover object-center select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-[#1a1614]/65 to-[#1a1614]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1614]/50 via-transparent to-[#1a1614]/50" />
          </div>

          {/* Three.js 3D Light Cloud */}
          <Spa3DAtmosphere variant="hero" className="z-10" />

          {/* Hero Content */}
          <div className="relative z-20 text-center max-w-4xl mx-auto px-1 sm:px-4 py-4 sm:py-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-[#c59b4b]/40 text-[#f5ecd8] text-xs font-mono uppercase tracking-[0.18em] shadow-lg mb-6">
              <span className="w-2 h-2 rounded-full bg-[#c59b4b] animate-pulse" />
              <span>Studio 05 · 30% Privilege Included</span>
            </div>

            <h1 className="font-serif-luxury italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-[1.08] drop-shadow-md mb-5">
              Spa &amp; Wellness
            </h1>

            <p className="font-serif-luxury italic text-lg sm:text-2xl text-[#f3e6cf] font-light max-w-2xl mx-auto leading-relaxed mb-8">
              An unhurried sanctuary of Turkish Hammam steam, Balinese rhythm, Swedish ease, and custom botanical essences.
            </p>

            {/* Quick Ritual Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-xl mx-auto">
              {['Turkish Hammam', 'Balinese Massage', 'Swedish Restorative', 'Deep Tissue', 'Artisan Aromatherapy'].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-[#f7efe3] text-xs font-light tracking-wide shadow-sm"
                >
                  ✦ {pill}
                </span>
              ))}
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate('/booking')}
                className="w-full sm:w-auto btn-royal-blue text-xs sm:text-sm py-3.5 px-8 font-semibold shadow-xl shadow-[#2f54eb]/30 hover:scale-[1.02] transition-all"
              >
                Reserve Your Ritual ➔
              </button>
              <a
                href="#spa-rituals"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold transition-all"
              >
                Explore Rituals ↓
              </a>
            </div>

            <div className="mt-8 text-white/70 text-[11px] font-mono tracking-wider">
              <span>✦ Complimentary 30% privilege applied on all spa therapies · Derabassi</span>
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#faf7f2] to-transparent pointer-events-none z-10" />
        </section>

        {/* ── 2. MINIMALIST EDITORIAL INTRO ──────────────────────────────────── */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8a651f] font-semibold">
            Pure Sanctuary
          </span>
          <h2 className="font-serif-luxury italic text-3xl sm:text-5xl font-medium text-[#1a1614] leading-tight">
            The Art of Unhurried Ease
          </h2>
          <p className="font-serif-luxury italic text-base sm:text-xl text-[#5e5650] font-light max-w-xl mx-auto">
            Heated private treatment suites, thermal steam, and cold-pressed botanical infusions designed to quiet the mind.
          </p>
        </section>

        {/* ── 3. SIGNATURE RITUALS: AUTO-SLIDING 3D SHOWCASE ─────────────────── */}
        <section id="spa-rituals" className="py-12 sm:py-20 px-3 sm:px-6 border-t border-[#b89a73]/20 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Header & Auto-Slide Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8a651f] font-semibold">
                  Curated Spa Therapies
                </span>
                <h3 className="font-serif-luxury italic text-2xl sm:text-4xl font-medium text-[#1a1614]">
                  Five Signature Rituals
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8c827a] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-gliding · Tap to select</span>
              </div>
            </div>

            {/* MOBILE-PERFECT SINGLE-ROW SCROLLABLE TABS (No Awkward Wrapping!) */}
            <div className="w-full overflow-x-auto no-scrollbar py-1">
              <div className="flex items-center gap-2 min-w-max px-1 sm:justify-center">
                {SPA_TREATMENTS.map((treatment, idx) => {
                  const isActive = selectedRitualIndex === idx;
                  return (
                    <button
                      key={treatment.id}
                      type="button"
                      onClick={() => {
                        setSelectedRitualIndex(idx);
                        setIsRitualPaused(true);
                        setTimeout(() => setIsRitualPaused(false), 3000);
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                        isActive
                          ? 'bg-[#1a1614] text-white border-[#1a1614] shadow-md scale-[1.02]'
                          : 'bg-white/80 text-[#5e5650] border-[#b89a73]/25 hover:text-[#1a1614] hover:bg-white'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[#c59b4b] mr-1.5">{treatment.number}</span>
                      <span>{treatment.name.replace(' Massage', '').replace(' Recovery', '')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GRAND AUTO-SLIDING 3D DISPLAY CARD */}
            <div
              onMouseEnter={() => setIsRitualPaused(true)}
              onMouseLeave={() => setIsRitualPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative"
            >
              <Spa3DTiltCard className="w-full">
                <div className="cream-card bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-[36px] p-4 sm:p-7 md:p-9 border border-[#b89a73]/35 shadow-[0_25px_60px_-15px_rgba(100,80,60,0.16)] relative overflow-hidden">
                  
                  {/* Subtle Top Gold Progress Bar for Auto-Slide */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-[#b89a73]/20">
                    <div
                      key={selectedRitualIndex}
                      className={`h-full bg-gradient-to-r from-[#c59b4b] to-[#2f54eb] ${
                        !isRitualPaused ? 'spa-progress-bar' : 'w-full'
                      }`}
                    />
                  </div>

                  <div className="grid lg:grid-cols-12 gap-5 sm:gap-8 items-center">
                    
                    {/* Left: Cinematic Photography Canvas with Slide Animation */}
                    <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/10] rounded-2xl sm:rounded-[26px] overflow-hidden shadow-xl bg-[#f5ecde] group">
                      <img
                        key={activeTreatment.id}
                        src={assetPath(activeTreatment.image)}
                        alt={activeTreatment.name}
                        className="w-full h-full object-cover transition-all duration-700 luxury-slide-in select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1a1614] font-mono text-[10px] sm:text-[11px] font-bold shadow-md">
                          {activeTreatment.number} / 05
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#c59b4b]/95 text-white font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase shadow-md">
                          30% Privilege
                        </span>
                      </div>

                      {/* Bottom Caption on Image */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white pointer-events-none">
                        <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#e8d5b0] block">
                          Duration: {activeTreatment.durationRange}
                        </span>
                        <h4 className="font-serif-luxury italic text-xl sm:text-3xl font-medium tracking-tight mt-0.5">
                          {activeTreatment.name}
                        </h4>
                      </div>

                      {/* Floating Desktop Next/Prev Arrow Controls Over Image */}
                      <div className="hidden sm:flex absolute inset-y-0 inset-x-2 items-center justify-between pointer-events-none">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handlePrevRitual(); }}
                          className="pointer-events-auto w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#1a1614] flex items-center justify-center text-lg shadow-md hover:scale-110 transition-all"
                          aria-label="Previous ritual"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleNextRitual(); }}
                          className="pointer-events-auto w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#1a1614] flex items-center justify-center text-lg shadow-md hover:scale-110 transition-all"
                          aria-label="Next ritual"
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* Right: Concise, Ultra-Luxury Essence Panel */}
                    <div className="lg:col-span-5 space-y-4 sm:space-y-5">
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a651f] font-semibold">
                          Signature Ritual
                        </div>
                        <blockquote className="font-serif-luxury italic text-lg sm:text-2xl text-[#1a1614] leading-snug">
                          "{activeTreatment.tagline}"
                        </blockquote>
                        <p className="text-xs sm:text-sm text-[#5e5650] font-light leading-relaxed pt-0.5">
                          {activeTreatment.description.split('.')[0]}.
                        </p>
                      </div>

                      {/* 3 Crisp Highlight Chips */}
                      <div className="space-y-1.5 pt-1 border-t border-[#b89a73]/20">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a651f] block">
                          Ritual Highlights
                        </span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {activeTreatment.benefits.slice(0, 3).map((b, i) => (
                            <span
                              key={i}
                              className="px-2.5 sm:px-3 py-1 rounded-xl bg-[#faf6f0] border border-[#b89a73]/25 text-[#1a1614] text-[11px] sm:text-xs font-medium shadow-sm inline-flex items-center gap-1.5"
                            >
                              <span className="text-[#c59b4b]">✦</span>
                              <span>{b.split(' and ')[0]}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Clean Action Bar & Arrow Controls on Mobile */}
                      <div className="pt-3 border-t border-[#b89a73]/20 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8c827a] font-mono text-[11px]">Rates confirmed at studio</span>
                          <span className="text-[#8a651f] font-bold text-xs">30% Privilege</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Mobile Arrow Buttons */}
                          <div className="flex sm:hidden items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handlePrevRitual}
                              className="w-10 h-10 rounded-full bg-[#faf6f0] border border-[#b89a73]/30 text-[#1a1614] flex items-center justify-center text-lg active:bg-black active:text-white"
                              aria-label="Previous ritual"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              onClick={handleNextRitual}
                              className="w-10 h-10 rounded-full bg-[#faf6f0] border border-[#b89a73]/30 text-[#1a1614] flex items-center justify-center text-lg active:bg-black active:text-white"
                              aria-label="Next ritual"
                            >
                              ›
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => addSpaService(activeTreatment.name, activeTreatment.durationRange, activeTreatment.id)}
                            className="flex-1 btn-royal-blue text-xs sm:text-sm py-3 sm:py-3.5 px-5 font-semibold shadow-md active:scale-95 transition-all text-center"
                          >
                            Reserve This Ritual ➔
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </Spa3DTiltCard>

              {/* Minimal Dot Indicators with Active Pill */}
              <div className="flex justify-center items-center gap-2 pt-3">
                {SPA_TREATMENTS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedRitualIndex(idx);
                      setIsRitualPaused(true);
                      setTimeout(() => setIsRitualPaused(false), 3000);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      selectedRitualIndex === idx
                        ? 'w-7 sm:w-8 h-2 bg-[#1a1614]'
                        : 'w-2 h-2 bg-[#b89a73]/40 hover:bg-[#b89a73]'
                    }`}
                    aria-label={`Go to ritual ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── 4. AROMATHERAPY: AUTO-SLIDING OLFACTORY ATELIER (Image 3 Fix) ───── */}
        {blends.length > 0 && (
          <section className="py-12 sm:py-20 px-3 sm:px-6 border-t border-[#b89a73]/20 bg-[#fbf8f3]">
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="text-center space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8a651f] font-semibold">
                  Aromatherapy Atelier
                </span>
                <h3 className="font-serif-luxury italic text-2xl sm:text-4xl font-medium text-[#1a1614]">
                  Seven Botanical Essences
                </h3>
                <p className="text-xs text-[#5e5650] font-light">
                  Auto-gliding sensory palette · Sample upon arrival in Derabassi.
                </p>
              </div>

              {/* MOBILE-PERFECT HORIZONTAL SCROLL STRIP (No Cluttered Wrapping!) */}
              <div
                className="w-full overflow-x-auto no-scrollbar py-1"
                onMouseEnter={() => setIsBlendPaused(true)}
                onMouseLeave={() => setIsBlendPaused(false)}
              >
                <div className="flex items-center gap-2 min-w-max px-2 sm:justify-center">
                  {blends.map((blend) => {
                    const isSelected = blend.id === selectedBlendId;
                    return (
                      <button
                        key={blend.id}
                        type="button"
                        onClick={() => {
                          setSelectedBlendId(blend.id);
                          setIsBlendPaused(true);
                          setTimeout(() => setIsBlendPaused(false), 3500);
                        }}
                        className={`flex-shrink-0 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-200 border flex items-center gap-2 ${
                          isSelected
                            ? 'bg-white border-[#1a1614] shadow-md scale-105'
                            : 'bg-white/60 border-[#b89a73]/25 text-[#5e5650] hover:border-[#b89a73]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: blend.colorAccent }}
                        />
                        <span>{blend.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CHROMATIC AURA CARD WITH SMOOTH TRANSITION */}
              {activeBlend && (
                <div
                  onMouseEnter={() => setIsBlendPaused(true)}
                  onMouseLeave={() => setIsBlendPaused(false)}
                  className="cream-card bg-white/95 rounded-3xl p-5 sm:p-7 border border-[#b89a73]/30 shadow-lg transition-all duration-500 max-w-xl mx-auto text-center space-y-4 relative overflow-hidden"
                  style={{ borderTop: `4px solid ${activeBlend.colorAccent}` }}
                >
                  <div
                    className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-sm font-bold shadow-inner transition-colors duration-500"
                    style={{ backgroundColor: `${activeBlend.colorAccent}25`, color: activeBlend.colorAccent }}
                  >
                    ✦
                  </div>

                  <div>
                    <h4 className="font-serif-luxury italic text-2xl sm:text-3xl font-medium text-[#1a1614]">
                      {activeBlend.name}
                    </h4>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#8a651f] mt-1 font-semibold">
                      {activeBlend.tagline}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-[#5e5650] pt-2 border-t border-[#b89a73]/15">
                    <div><strong className="text-[#1a1614]">Scent:</strong> {activeBlend.scentNotes}</div>
                    <span className="hidden sm:inline text-[#b89a73]">·</span>
                    <div><strong className="text-[#1a1614]">Mood:</strong> {activeBlend.mood}</div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => addSpaService(`Aromatherapy (${activeBlend.name})`, '60 / 90 min', `spa-${activeBlend.id}`)}
                      className="btn-royal-blue text-xs sm:text-sm py-2.5 px-6 font-semibold shadow-md active:scale-95 transition-all"
                    >
                      Select {activeBlend.name} ➔
                    </button>
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ── 5. THE 4 STEPS (Compact & Proportional on Mobile) ───────────────── */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-[#b89a73]/20 bg-[#faf7f2]">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8a651f] font-semibold">
                Your Sanctuary Visit
              </span>
              <h3 className="font-serif-luxury italic text-2xl sm:text-4xl font-medium text-[#1a1614] mt-1">
                The 4 Steps
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {[
                { step: '01', title: 'Arrive', note: 'Robes & chilled herbal water' },
                { step: '02', title: 'Consult', note: 'Oil & pressure selection' },
                { step: '03', title: 'Immerse', note: 'Heated suite & continuous therapy' },
                { step: '04', title: 'Restore', note: 'Calm lounge & lotus tea' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#b89a73]/25 shadow-sm text-center space-y-1.5 hover:border-[#c59b4b]/50 transition-all"
                >
                  <span className="font-mono text-xs font-bold text-[#c59b4b] block">
                    {item.step}
                  </span>
                  <h4 className="font-serif-luxury italic text-lg sm:text-xl font-medium text-[#1a1614]">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#5e5650] font-light">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. VISUAL SANCTUARY GALLERY ────────────────────────────────────── */}
        <section className="py-12 sm:py-16 px-3 sm:px-6 border-t border-[#b89a73]/20 bg-[#fbf8f3]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {[
                { img: assetPath('/images/spa/gallery-1.jpg'), title: 'Thermal Steam Suite' },
                { img: assetPath('/images/spa/gallery-2.jpg'), title: 'Deep Tissue Recovery' },
                { img: assetPath('/images/spa/gallery-3.jpg'), title: 'Aromatherapy Apothecary' },
                { img: assetPath('/images/spa/gallery-4.jpg'), title: 'Warm Stone Therapy' },
                { img: assetPath('/images/spa/gallery-5.jpg'), title: 'Balinese Petal Bath' },
                { img: assetPath('/images/spa/gallery-6.jpg'), title: 'Restoration Lounge' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                >
                  <img
                    src={assetPath(item.img)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                    <span className="text-white text-xs font-serif-luxury italic">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. RESERVATION SANCTUARY CTA ───────────────────────────────────── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 border-t border-[#b89a73]/20 bg-gradient-to-b from-[#faf6f0] to-[#f4ede0]">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#c59b4b]/30 text-xs text-[#8a651f] font-semibold shadow-sm">
              <span>✦</span>
              <span>30% Privilege Automatically Applied</span>
            </div>

            <h3 className="font-serif-luxury italic text-3xl sm:text-5xl font-medium text-[#1a1614] leading-tight">
              Begin Your Sanctuary Ritual
            </h3>

            <p className="text-xs sm:text-sm text-[#5e5650] font-light max-w-md mx-auto leading-relaxed">
              Heated treatment suites prepared prior to your arrival in Derabassi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/booking')}
                className="w-full sm:w-auto btn-royal-blue text-xs sm:text-sm py-3.5 px-8 font-semibold shadow-xl shadow-[#2f54eb]/25"
              >
                Book Appointment ➔
              </button>
              <a
                href="https://wa.me/917710287822?text=Hello%20The%20Style%20Studio%20Lounge,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20Spa%20ritual"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+917710287822"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white border border-[#b89a73]/30 text-[#1a1614] text-xs sm:text-sm font-semibold hover:border-[#2f54eb] transition-colors"
              >
                <span>📞</span>
                <span>+91 77102 87822</span>
              </a>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="text-xs text-[#8a651f] hover:text-[#2f54eb] transition-colors font-mono uppercase tracking-widest inline-flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Return to The Style Studio Lounge Main Floor</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 8. FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="py-8 px-6 border-t border-[#b89a73]/20 bg-[#faf6f0] text-xs text-[#5e5650]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="font-serif-luxury italic text-xl text-[#1a1614]">
              The Style Studio Lounge · Spa &amp; Wellness
            </div>
            <div>
              Opposite Paras Plaza, Adarsh Nagar, Derabassi, Punjab 140507 • Open 7 Days (10AM–8PM)
            </div>
            <Link to="/" className="text-[#2f54eb] font-semibold hover:underline">
              Main Floor ➔
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SpaPage;

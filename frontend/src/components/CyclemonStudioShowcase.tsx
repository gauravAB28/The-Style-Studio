import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Studio } from '../types';

interface CyclemonStudioShowcaseProps {
  studios: Studio[];
  onBookStudio?: (studioTitle: string) => void;
}

export const CyclemonStudioShowcase: React.FC<CyclemonStudioShowcaseProps> = ({
  studios,
  onBookStudio
}) => {
  const [activeSection, setActiveSection] = useState(0);

  const studioData = [
    {
      id: 'hair-atelier',
      number: '01',
      persona: 'THE BALAYAGE CONNOISSEUR',
      title: 'Hair Atelier',
      subtitle: 'Precision Sculpting & Botanical Keratin',
      tagline: 'For those who treat their hair as living couture.',
      description: 'Hand-blended caramel Balayage, ammonia-free Italian organic glosses, and 5-month mirror shine Keratin & Botox infusing pure botanical proteins.',
      offerBadge: '40% OFF Royal Keratin',
      startingPrice: 499,
      image: '/images/studio_hair.jpg',
      tags: ['Custom Balayage', 'Italian Gloss', 'Botox Infusion', 'Precision Cut'],
      align: 'left' as const,
      gradientLg: 'from-[#faf6f0]/95 via-[#faf6f0]/75 to-[#faf6f0]/30',
      isSpa: false,
    },
    {
      id: 'bridal-suite',
      number: '02',
      persona: 'THE ROYAL BRIDE',
      title: 'Bridal Haute Couture',
      subtitle: '24hr Waterproof HD & Airbrush Artistry',
      tagline: 'Where timeless tradition meets modern royal grace.',
      description: 'Camera-ready, sweatproof 24-hour HD airbrush glow crafted with imported cosmetics, bespoke jewelry setting, and precision bridal dupatta draping in private luxury suites.',
      offerBadge: '35% OFF Bridal Packages',
      startingPrice: 4499,
      image: '/images/studio_bridal.jpg',
      tags: ['HD Airbrush', 'Kundan Setting', 'Sculpted Draping', 'Private Suite'],
      align: 'right' as const,
      gradientLg: 'from-[#faf6f0]/30 via-[#faf6f0]/75 to-[#faf6f0]/95',
      isSpa: false,
    },
    {
      id: 'skin-dermatology',
      number: '03',
      persona: 'THE RADIANCE ALCHEMIST',
      title: 'Aesthetic Skin Lab',
      subtitle: 'Hydra Dermabrasion & Glass Glow Therapy',
      tagline: 'Clinical precision for poreless, luminous skin.',
      description: '7-step European hydro-infusion, peptide cold hammer contouring, and medical-grade LED phototherapy for deep pore refinement, hydration, and glass-like dewiness.',
      offerBadge: '25% OFF Hydra Facial',
      startingPrice: 1399,
      image: '/images/studio_skin.jpg',
      tags: ['Hydro-Infusion', 'Cold Hammer', 'LED Phototherapy', 'Collagen Lift'],
      align: 'left' as const,
      gradientLg: 'from-[#faf6f0]/95 via-[#faf6f0]/75 to-[#faf6f0]/30',
      isSpa: false,
    },
    {
      id: 'nail-gallery',
      number: '04',
      persona: 'THE ARTISAN SCULPTOR',
      title: 'Nail Lounge & Spa',
      subtitle: 'Hand-Painted Gel & Chrome Extensions',
      tagline: 'Miniature masterpieces on every single fingertip.',
      description: 'Artisan French chrome tips, bespoke hand-painted nail art, sculpted gel extensions, and effervescent ice cream bubble pedicures with botanical paraffin.',
      offerBadge: '30% OFF Nail Extensions',
      startingPrice: 899,
      image: '/images/studio_nails.jpg',
      tags: ['Chrome Dusting', 'Gel Sculpting', 'Russian Manicure', 'Paraffin Spa'],
      align: 'right' as const,
      gradientLg: 'from-[#faf6f0]/30 via-[#faf6f0]/75 to-[#faf6f0]/95',
      isSpa: false,
    },
    {
      id: 'spa-wellness',
      number: '05',
      persona: 'THE STILLNESS SEEKER',
      title: 'Spa & Wellness',
      subtitle: 'Ancient Rituals · Modern Sanctuary',
      tagline: 'Where the body finally learns to let go.',
      description: 'An unhurried sanctuary of Turkish Hammam steam, Balinese acupressure, Swedish restorative flow, and bespoke Aromatherapy. Each ritual is performed with care, and felt long after you leave.',
      offerBadge: '30% Wellness Privilege',
      startingPrice: 0,
      image: '/images/spa/spa-hero.jpg',
      tags: ['Turkish Hammam', 'Balinese Massage', 'Swedish Ritual', 'Aromatherapy'],
      align: 'left' as const,
      gradientLg: 'from-[#faf6f0]/95 via-[#faf6f0]/75 to-[#faf6f0]/30',
      isSpa: true,
    }
  ];

  // Merge backend data if available
  const list = studioData.map((item, idx) => {
    const backend = studios?.[idx];
    if (!backend) return item;
    return {
      ...item,
      title: backend.title || item.title,
      subtitle: backend.subtitle || item.subtitle,
      description: backend.description || item.description,
      offerBadge: backend.featuredOffer || item.offerBadge,
      startingPrice: backend.startingPrice || item.startingPrice,
      image: item.image
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      list.forEach((item, idx) => {
        const el = document.getElementById(`cyclemon-studio-${item.id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [list]);

  const scrollToStudio = (id: string) => {
    const el = document.getElementById(`cyclemon-studio-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* ─── DESKTOP CYCLEMON FIXED SIDE NAVIGATION ─── */}
      <nav 
        aria-label="Studios Navigator"
        className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 p-2 rounded-full bg-white/80 backdrop-blur-md border border-[#b89a73]/30 shadow-xl transition-all"
      >
        {list.map((item, idx) => {
          const isActive = activeSection === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToStudio(item.id)}
              className="group relative flex items-center justify-end p-2"
              title={`Jump to ${item.title}`}
            >
              <span className="absolute right-9 px-3 py-1 rounded-full bg-[#1a1614] text-white text-[11px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                {item.number} {item.title}
              </span>
              <span 
                className={`block rounded-full transition-all duration-300 ${
                  isActive 
                    ? item.isSpa
                      ? 'w-3 h-3 bg-[#c59b4b] ring-4 ring-[#c59b4b]/20 scale-125'
                      : 'w-3 h-3 bg-[#2f54eb] ring-4 ring-[#2f54eb]/20 scale-125' 
                    : 'w-2 h-2 bg-[#b89a73]/50 group-hover:bg-[#1a1614] group-hover:scale-110'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* ─── 5 CONSECUTIVE CYCLEMON CURTAIN PARALLAX SECTIONS ─── */}
      {list.map((item, idx) => {
        const isLeft = item.align === 'left';
        const isLast = idx === list.length - 1;

        return (
          <section
            key={item.id}
            id={`cyclemon-studio-${item.id}`}
            className="cyclemon-curtain border-t border-[#b89a73]/20 min-h-[100dvh]"
          >
            {/* ── FIXED UNDERLAY BACKGROUND ── */}
            <div className="cyclemon-fixed-underlay">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover select-none"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.img-fallback')) {
                    const fb = document.createElement('div');
                    fb.className = 'img-fallback';
                    fb.style.cssText = 'position:absolute;inset:0;background:linear-gradient(135deg,#f5e9d4 0%,#e8d5b0 50%,#d4b896 100%);display:flex;align-items:center;justify-content:center;';
                    fb.innerHTML = `<span style="font-family:serif;font-size:3rem;color:#8a651f;opacity:0.3;font-style:italic;">${item.title}</span>`;
                    parent.appendChild(fb);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#faf6f0] via-[#faf6f0]/85 to-[#faf6f0]/40 lg:hidden pointer-events-none" />
              <div className={`hidden lg:block absolute inset-0 bg-gradient-to-r ${item.gradientLg} pointer-events-none`} />
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-b from-[#faf6f0]/60 via-transparent to-[#faf6f0]/60 pointer-events-none" />
            </div>

            {/* ── FOREGROUND CONTENT ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 flex items-center min-h-[100dvh]">
              <div className={`w-full grid lg:grid-cols-12 gap-8 items-center ${isLeft ? '' : 'justify-items-center lg:justify-items-end'}`}>
                
                <div 
                  className={`w-full max-w-xl mx-auto ${
                    isLeft ? 'lg:col-span-7 lg:col-start-1 lg:mx-0' : 'lg:col-span-7 lg:col-start-6 lg:mx-0'
                  }`}
                >
                  <div className="cream-card bg-white/94 backdrop-blur-2xl border border-[#b89a73]/35 rounded-3xl sm:rounded-[32px] p-6 sm:p-9 md:p-10 shadow-[0_20px_50px_-15px_rgba(100,80,60,0.15)] space-y-4 sm:space-y-5 transition-all duration-300 hover:shadow-[0_25px_60px_-10px_rgba(47,84,235,0.18)] hover:border-[#2f54eb]/40">
                    
                    {/* Header Tag & Studio Number */}
                    <div className="flex items-center justify-between border-b border-[#b89a73]/20 pb-3 sm:pb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf6f0] border border-[#b89a73]/30">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${item.isSpa ? 'bg-[#c59b4b]' : 'bg-[#2f54eb]'}`} />
                        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-[#8a651f] font-bold">
                          {item.persona}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-[#8c827a]">
                        {item.number} / {String(list.length).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Studio Title */}
                    <div>
                      <h2 className="font-serif-luxury italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#1a1614] leading-[1.08]">
                        {item.title}
                      </h2>
                      <p className={`text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold mt-1 ${item.isSpa ? 'text-[#c59b4b]' : 'text-[#2f54eb]'}`}>
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Tagline */}
                    <blockquote className="font-serif-luxury text-lg sm:text-xl md:text-2xl text-[#3d3632] italic font-light border-l-2 border-[#c59b4b] pl-3.5 sm:pl-4">
                      "{item.tagline}"
                    </blockquote>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#5e5650] leading-relaxed font-light">
                      {item.description}
                    </p>

                    {/* Feature Chips */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-[#faf6f0] border border-[#b89a73]/25 rounded-full text-[11px] sm:text-xs font-medium text-[#1a1614] shadow-sm"
                        >
                          ✦ {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Footer — Spa vs Standard */}
                    {item.isSpa ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-[#b89a73]/20">
                        <div>
                          <span className="text-[10px] font-mono text-[#8c827a] uppercase tracking-wider block mb-1">
                            Signature Studio 05
                          </span>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c59b4b]/15 text-[#855e16] text-xs font-semibold border border-[#c59b4b]/30">
                            <span>✦</span>
                            <span>30% Privilege Included</span>
                          </div>
                        </div>
                        <Link
                          to="/spa"
                          className="btn-royal-blue text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 font-semibold shadow-lg"
                        >
                          Explore the Spa →
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-[#b89a73]/20">
                        <div>
                          <span className="text-[10px] font-mono text-[#8c827a] uppercase tracking-wider block">
                            Curated Treatment Rates
                          </span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xl sm:text-2xl md:text-3xl font-serif-luxury font-bold text-[#1a1614]">
                              From ₹{item.startingPrice}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#c59b4b]/20 text-[#855e16] text-[10px] sm:text-[11px] font-bold">
                              {item.offerBadge}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onBookStudio?.(item.title)}
                          className="btn-royal-blue text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 font-semibold shadow-lg"
                        >
                          Reserve {item.title.split(' ')[0]} ➔
                        </button>
                      </div>
                    )}

                    {/* Mobile Quick Jump Dots */}
                    <div className="lg:hidden pt-2 flex items-center justify-between text-[11px] font-mono text-[#8c827a] border-t border-[#b89a73]/15">
                      <span>Jump to studio:</span>
                      <div className="flex gap-2">
                        {list.map((st, i) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => scrollToStudio(st.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              idx === i 
                                ? st.isSpa ? 'bg-[#c59b4b] text-white' : 'bg-[#2f54eb] text-white'
                                : 'bg-[#faf6f0] text-[#5e5650] hover:text-black'
                            }`}
                          >
                            {st.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Scroll Down Cue */}
                  {!isLast && (
                    <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[11px] font-mono text-[#5e5650] px-3 sm:px-4 opacity-80">
                      <span className="animate-bounce">↓</span>
                      <span>Scroll down for Studio {list[idx + 1].number} ({list[idx + 1].title})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

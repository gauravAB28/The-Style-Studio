import React, { useState } from 'react';
import type { Studio, Service } from '../types';

interface StudiosUnderlayShowcaseProps {
  studios: Studio[];
  activeStudioIndex?: number;
  onSelectStudio: (index: number) => void;
  onBookService?: (service: Service) => void;
}

export const StudiosUnderlayShowcase: React.FC<StudiosUnderlayShowcaseProps> = ({
  studios,
  activeStudioIndex = 0,
  onSelectStudio
}) => {
  const [internalIndex, setInternalIndex] = useState(activeStudioIndex);
  const activeIndex = internalIndex;

  const handleSelect = (idx: number) => {
    setInternalIndex(idx);
    onSelectStudio(idx);
  };

  const fallbackStudios = [
    {
      id: 'hair-atelier',
      title: 'Hair Atelier',
      subtitle: 'Precision Sculpting & Keratin',
      description: 'Custom Balayage, Italian ammonia-free global shades, and 5-month mirror shine Keratin & Botox infusing pure botanical proteins.',
      featuredOffer: '40% OFF Royal Keratin',
      startingPrice: 499,
      image: '/images/studio_hair.jpg',
      tagline: 'Precision Color, European Balayage & Botanical Keratin Infusion',
      portalColor: 'linear-gradient(135deg, rgba(230,210,195,0.4), rgba(43,92,255,0.15))',
      bgTint: '#f5eee6',
      model: 'shears' as const
    },
    {
      id: 'bridal-suite',
      title: 'Bridal Haute Couture',
      subtitle: 'HD & Airbrush Masterpieces',
      description: 'Camera-ready, waterproof 24hr bridal glow with international cosmetics, sculpted draping, and customized jewelry setting.',
      featuredOffer: '35% OFF Bridal Packages',
      startingPrice: 4499,
      image: '/images/studio_bridal.jpg',
      tagline: 'Bespoke Royal HD Bridal Glow & Designer Draping',
      portalColor: 'linear-gradient(135deg, rgba(245,225,215,0.4), rgba(43,92,255,0.15))',
      bgTint: '#f9ede8',
      model: 'tiara' as const
    },
    {
      id: 'skin-dermatology',
      title: 'Aesthetic Skin Lab',
      subtitle: 'Hydra Dermabrasion & Radiance',
      description: '7-step clinical hydro-infusion, peptide cold hammer tightening, and LED light therapies for pore refinement and glass glow.',
      featuredOffer: '25% OFF Hydra Facial',
      startingPrice: 1399,
      image: '/images/studio_skin.jpg',
      tagline: 'Clinical Hydra Dermabrasion, Glass Skin & Collagen Therapy',
      portalColor: 'linear-gradient(135deg, rgba(220,230,240,0.4), rgba(43,92,255,0.15))',
      bgTint: '#eef3f7',
      model: 'elixir' as const
    },
    {
      id: 'nail-gallery',
      title: 'Nail Lounge & Spa',
      subtitle: 'Sculpted Gel & Chrome Art',
      description: 'French tips, chrome powders, acrylic extensions, and effervescent ice cream bubble pedicures with botanical paraffin.',
      featuredOffer: '30% OFF Nail Extensions',
      startingPrice: 899,
      image: 'https://thestylestudiolounge.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-10-at-16.25.44-2.jpeg',
      tagline: 'Artisan Gel Extensions, Chrome Dusting & Russian Manicures',
      portalColor: 'linear-gradient(135deg, rgba(235,225,230,0.4), rgba(43,92,255,0.15))',
      bgTint: '#f7eff2',
      model: 'pedestal' as const
    }
  ];

  const displayStudios = (studios && studios.length > 0) ? studios.map((s, idx) => ({
    ...fallbackStudios[idx],
    ...s,
    image: s.image || fallbackStudios[idx]?.image,
    tagline: s.tagline || fallbackStudios[idx]?.tagline
  })) : fallbackStudios;

  const activeStudio = displayStudios[activeIndex] || displayStudios[0];

  return (
    <section id="studios" className="relative py-28 px-6 overflow-hidden border-t border-[#b89a73]/20 bg-[#faf6f0] transition-colors duration-700">
      {/* ─── LAYERED BACKGROUND UNDERLAY (Orpheus Studio Inspired) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {displayStudios.map((s, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Cinematic Underlay Image */}
              <img
                src={s.image}
                alt={s.title}
                className={`w-full h-full object-cover filter blur-[2px] transition-transform duration-1000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Luxury Cream Soft Tint & Vignette Overlays for High Contrast Readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0]/92 via-[#faf6f0]/88 to-[#faf6f0]/95" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f0]/95 via-transparent to-[#faf6f0]/90" />

              {/* Watermark Monogram Typography in Underlay (Orpheus Studio aesthetic) */}
              <div className="absolute -bottom-10 right-4 lg:right-16 text-[14vw] font-serif-luxury italic font-bold text-[#b89a73]/10 leading-none select-none tracking-tight">
                {s.title.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#b89a73]/30 text-xs text-[#5e5650] shadow-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-[#2f54eb] animate-pulse"></span>
              <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-[#2f54eb]">
                The 4 Architectural Havens
              </span>
            </div>
            <h2 className="font-serif-luxury italic text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1a1614] tracking-tight leading-[1.1]">
              Our Signature Studios
            </h2>
            <p className="text-sm sm:text-base text-[#5e5650] mt-3 font-light leading-relaxed">
              Step into curated private chambers designed for precision artistry, certified European formulations, and personalized consultations.
            </p>
          </div>

          {/* Quick Studio Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-[#b89a73]/25 shadow-sm">
            {displayStudios.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  activeIndex === idx
                    ? 'bg-[#2f54eb] text-white shadow-md'
                    : 'text-[#5e5650] hover:text-[#1a1614] hover:bg-black/5'
                }`}
              >
                0{idx + 1} {s.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* ─── ANIMATED STUDIO CARDS WITH TRANSLATIONS & TRANSITIONS ─── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStudios.map((studio, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <div
                key={studio.id}
                onMouseEnter={() => handleSelect(idx)}
                onClick={() => handleSelect(idx)}
                className={`group relative rounded-3xl p-5 cursor-pointer transition-all duration-500 transform ${
                  isSelected
                    ? 'bg-white border-2 border-[#2f54eb] shadow-2xl -translate-y-3 scale-[1.02]'
                    : 'bg-white/85 backdrop-blur-sm border border-[#b89a73]/25 hover:border-[#b89a73]/50 hover:bg-white hover:-translate-y-2 hover:shadow-xl'
                }`}
              >
                {/* Active Indicator Top Light Bar */}
                <div
                  className={`absolute top-0 inset-x-8 h-1 rounded-b-full transition-all duration-500 ${
                    isSelected ? 'bg-[#2f54eb]' : 'bg-transparent'
                  }`}
                />

                {/* Architectural Arched Image Window with Zoom Parallax */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 border border-[#b89a73]/25 shadow-inner bg-[#f5eee6]">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Number Badge Top Left */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#b89a73]/30 text-[10px] font-mono font-bold text-[#1a1614] shadow-sm">
                    0{idx + 1}
                  </div>

                  {/* Privilege Offer Tag Bottom Right */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#2f54eb] text-white text-[10px] font-bold shadow-md">
                    {studio.featuredOffer}
                  </div>
                </div>

                {/* Studio Meta & Information */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#8a651f] font-semibold">
                    {studio.subtitle}
                  </div>

                  <h3 className="font-serif-luxury text-2xl font-semibold text-[#1a1614] group-hover:text-[#2f54eb] transition-colors leading-snug">
                    {studio.title}
                  </h3>

                  <p className="text-xs text-[#5e5650] leading-relaxed line-clamp-3 font-light">
                    {studio.description}
                  </p>

                  {/* Starting Price & Action */}
                  <div className="pt-4 flex items-center justify-between border-t border-[#b89a73]/15 text-xs">
                    <div>
                      <span className="text-[11px] text-[#8c827a] block">Starting from</span>
                      <span className="text-base font-bold text-[#1a1614] font-serif-luxury">
                        ₹{studio.startingPrice}
                      </span>
                    </div>

                    <a
                      href="#treatments"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2f54eb] group-hover:text-[#1d39c4] transition-colors"
                    >
                      <span>Explore</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">➔</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Studio Feature Banner below cards syncing with active studio */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#b89a73]/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2f54eb] font-semibold">
              Currently Selected • {activeStudio.title}
            </span>
            <h4 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#1a1614]">
              {activeStudio.tagline}
            </h4>
            <p className="text-xs text-[#5e5650] font-light">
              All appointments include single-use sanitized equipment, consultation, and authentic Italian salon formulations.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="#treatments"
              className="btn-royal-blue text-xs py-3 px-6 shadow-md"
            >
              View Studio Pricing ➔
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

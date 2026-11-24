import React, { useState } from 'react';
import type { Service } from '../types';

interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  ingredients: string[];
  price: number;
  originalPrice: number;
  badge: string;
  description: string;
  icon: string;
}

const LUXURY_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-keratin-elixir',
    name: 'Royal Keratin Liquid Glass Elixir',
    tagline: 'Formaldehyde-Safe Protein Fiber Replenishment',
    category: 'Hair Studio',
    ingredients: ['Italian Hydrolyzed Keratin', 'Moroccan Argan Liquid Gold', 'Collagen Matrix'],
    price: 2999,
    originalPrice: 4999,
    badge: '40% OFF Signature Treatment',
    description: 'Our proprietary salon formulation that penetrates deep into cortex fibers to eliminate 100% of frizz, leaving liquid mirror shine for up to 5 months.',
    icon: '🧪'
  },
  {
    id: 'prod-hydra-serum',
    name: 'Hydra-Derm Radiance Peptides',
    tagline: '7-Step Clinical Micro-Infusion Concentrate',
    category: 'Skin Lab',
    ingredients: ['Multi-Molecular Hyaluronic Acid', 'Niacinamide 10%', 'Cold Marine Algae'],
    price: 2624,
    originalPrice: 3499,
    badge: '25% OFF Clinical Special',
    description: 'Applied via vortex suction and cold hammer cryo-locking to restore dewy, plump skin elasticity and cellular hydration.',
    icon: '💎'
  },
  {
    id: 'prod-bond-shield',
    name: 'Botanical Bond Multiplier Shield',
    tagline: 'Olaplex Molecular Color Protection',
    category: 'Bridal & Color',
    ingredients: ['Bis-Aminopropyl Diglycol', 'Organic Jojoba Lipids', 'Vitamin E Shield'],
    price: 1999,
    originalPrice: 3200,
    badge: 'Guest Favorite',
    description: 'Rebuilds broken disulfide bonds during lightening, balayage, and heat styling, preventing hair breakage and maintaining tensile strength.',
    icon: '✨'
  }
];

interface ProductShowcaseProps {
  onAddProduct: (service: Service) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onAddProduct }) => {
  const [activeTab, setActiveTab] = useState(0);
  const activeProduct = LUXURY_PRODUCTS[activeTab];

  return (
    <section id="products" className="py-16 sm:py-24 px-4 sm:px-6 border-t border-[#b89a73]/20 bg-[#faf6f0] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2f54eb] font-semibold">
            Signature Salon Formulations
          </span>
          <h2 className="font-serif-luxury italic text-[clamp(2rem,5vw,3rem)] font-medium text-[#1a1614] mt-2 leading-tight">
            The Apothecary Treatments
          </h2>
          <p className="text-xs sm:text-sm text-[#5e5650] mt-3 font-light leading-relaxed">
            Inspired by European salon laboratories. Every session incorporates medical-grade, cruelty-free active formulations tailored to your hair density and skin tone.
          </p>
        </div>

        {/* Product Selector Tabs with native scroll & no horizontal overflow */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar touch-pan-x max-w-full">
          {LUXURY_PRODUCTS.map((prod, idx) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 min-h-[44px] flex-shrink-0 ${
                activeTab === idx
                  ? 'bg-[#2f54eb] text-white shadow-lg'
                  : 'bg-white text-[#5e5650] hover:text-[#1a1614] border border-[#b89a73]/25 shadow-sm'
              }`}
            >
              <span>{prod.icon}</span>
              <span>{prod.name}</span>
            </button>
          ))}
        </div>

        {/* Clean Luxury Product Stage */}
        <div className="cream-card rounded-3xl p-5 sm:p-8 md:p-12 border border-[#b89a73]/30 shadow-xl bg-white grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#c59b4b]/15 text-[#855e16] text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                {activeProduct.badge}
              </span>
              <span className="text-xs text-[#8c827a] font-mono">
                {activeProduct.category}
              </span>
            </div>

            <h3 className="font-serif-luxury text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1a1614] leading-tight">
              {activeProduct.name}
            </h3>

            <p className="font-serif-luxury text-lg sm:text-xl text-[#8a651f] italic">
              "{activeProduct.tagline}"
            </p>

            <p className="text-xs sm:text-sm text-[#5e5650] leading-relaxed max-w-xl font-light">
              {activeProduct.description}
            </p>

            {/* Active Ingredients */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8c827a] font-semibold block mb-2">
                Active Botanical Infusion:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {activeProduct.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 sm:px-3 py-1 rounded-xl bg-[#faf4ec] text-[#3d3632] text-xs border border-[#b89a73]/20"
                  >
                    ✓ {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5 sm:pt-6 border-t border-[#b89a73]/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#8a651f] font-serif-luxury">
                  ₹{activeProduct.price}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 line-through ml-2">
                  ₹{activeProduct.originalPrice}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const s: Service = {
                    id: activeProduct.id,
                    category: activeProduct.category.toLowerCase().includes('hair') ? 'hair' : 'skin',
                    name: activeProduct.name,
                    duration: '60 mins',
                    originalPrice: activeProduct.originalPrice,
                    price: activeProduct.price,
                    gender: 'Unisex',
                    description: activeProduct.description
                  };
                  onAddProduct(s);
                }}
                className="btn-royal-blue text-xs sm:text-sm py-3 px-6 sm:px-7 font-semibold min-h-[44px] w-full sm:w-auto"
              >
                + Book Treatment Session
              </button>
            </div>
          </div>

          {/* Right: Elegant Editorial Product Showcase Photo */}
          <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-[#b89a73]/30 shadow-md">
            <img
              src="https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.31-1.jpeg"
              alt="Salon Treatment Formulations"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5 sm:p-6 text-white">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#2f54eb] text-white text-[10px] font-bold uppercase tracking-wider">
                  Authentic Formulations
                </span>
                <h4 className="font-serif-luxury text-lg sm:text-xl font-medium mt-1">Italian &amp; European Blends</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

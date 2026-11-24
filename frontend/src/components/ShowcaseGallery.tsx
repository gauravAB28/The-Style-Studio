import React, { useState } from 'react';
import { assetPath } from '../utils/assetPath';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'interior' | 'hair' | 'bridal' | 'nails' | 'skin';
  tag: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.33.jpeg',
    title: 'Main Styling Floor & European Stations',
    category: 'interior',
    tag: 'Derabassi Salon Lounge',
    description: 'Imported ergonomic hydraulic styling chairs with shadowless ambient makeup lighting.'
  },
  {
    id: 'g2',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.31-2.jpeg',
    title: 'Private Bridal Suite & Consultation Zone',
    category: 'interior',
    tag: 'VIP Sanctuary',
    description: 'Exclusive private suites for brides, families, and long-session spa therapies.'
  },
  {
    id: 'g3',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.31-1.jpeg',
    title: 'Sanitized Spa & Pedicure Pedestals',
    category: 'interior',
    tag: '100% Hygiene',
    description: 'Hospital-grade autoclaved tools and Jacuzzi bubble foot spa chairs.'
  },
  {
    id: 'g4',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-10-at-16.25.44-1.jpeg',
    title: 'Global Chocolate Balayage & Gloss Finish',
    category: 'hair',
    tag: 'Hair Transformation',
    description: 'Italian ammonia-free shades blended seamlessly with Olaplex bond repair.'
  },
  {
    id: 'g5',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-10-at-16.25.44-2.jpeg',
    title: 'Signature HD Bridal Masterpiece',
    category: 'bridal',
    tag: 'Wedding Atelier',
    description: '14-hour longwear waterproof base with curated jewelry placement and bridal waves.'
  },
  {
    id: 'g6',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-10-at-16.25.44.jpeg',
    title: 'Liquid Glass Royal Keratin Therapy',
    category: 'hair',
    tag: 'Keratin Smoothening',
    description: 'Eliminates 100% frizz, infusing pure collagen & keratin proteins for mirror shine.'
  },
  {
    id: 'g7',
    url: assetPath('/images/studio_nails.jpg'),
    title: 'French Ombre & Champagne Chrome Nail Art',
    category: 'nails',
    tag: 'Couture Nail Art',
    description: 'Custom almond extensions with high-shine chip-resistant French ombre and champagne chrome gold shimmer.'
  },
  {
    id: 'g8',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-10-at-16.25.43.jpeg',
    title: 'Celebrity Party Makeover & Eye Art',
    category: 'bridal',
    tag: 'Evening Glamour',
    description: 'Soft sculpted bronze glam with hand-crafted 3D lashes and blowout.'
  },
  {
    id: 'g9',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-10-at-16.25.45.jpeg',
    title: 'Clinical Hydra Facial & Cold Hammer Glow',
    category: 'skin',
    tag: 'Dermatological Care',
    description: 'Deep vortex extraction followed by hyaluronic infusion and LED light rejuvenation.'
  },
  {
    id: 'g10',
    url: 'https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.31.jpeg',
    title: 'Unisex Hair Cutting & Color Bar',
    category: 'interior',
    tag: 'Styling Lounge',
    description: 'Clean modern aesthetic with certified stylists and Italian product displays.'
  }
];

interface ShowcaseGalleryProps {
  onBookItem: (title: string) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({ onBookItem }) => {
  const [filter, setFilter] = useState<'all' | 'interior' | 'hair' | 'bridal' | 'nails' | 'skin'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered = filter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === filter);

  return (
    <section id="gallery" className="py-24 px-6 border-t border-[#b89a73]/20 bg-[#f7f2ea]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2f54eb] font-semibold">
              Real Salon Showcase & Transformations
            </span>
            <h2 className="font-serif-luxury italic text-4xl sm:text-5xl font-medium text-[#1a1614] mt-2">
              Visual Gallery of The Lounge
            </h2>
            <p className="text-sm text-[#5e5650] mt-2 max-w-xl font-light">
              Explore authentic photography from our Derabassi salon, bridal suites, and guest transformations. Click any image for full-screen inspection.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'interior', label: 'Salon Interior' },
              { id: 'hair', label: 'Hair & Keratin' },
              { id: 'bridal', label: 'Bridal Makeovers' },
              { id: 'nails', label: 'Nail Art' },
              { id: 'skin', label: 'Skin Care' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-[#2f54eb] text-white shadow-md'
                    : 'bg-white/80 text-[#5e5650] hover:bg-white hover:text-[#1a1614] border border-[#b89a73]/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid with Cream Editorial Frames */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-[#b89a73]/25 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e0d5]">
                <img
                  src={assetPath(item.url)}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to interior photo if individual file fails
                    (e.target as HTMLImageElement).src = 'https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.33.jpeg';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#1a1614] rounded-full text-[10px] font-bold tracking-wider uppercase border border-[#b89a73]/20 shadow-sm">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl font-semibold text-[#1a1614] group-hover:text-[#2f54eb] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5e5650] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#b89a73]/15 flex justify-between items-center text-xs">
                  <span className="text-[#2f54eb] font-semibold group-hover:underline">
                    Inspect Photo ➔
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">The Style Studio Lounge</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#faf6f0] border border-[#b89a73]/40 rounded-3xl overflow-hidden shadow-2xl animate-pop-in">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-black flex items-center justify-center transition-colors shadow-md text-base"
            >
              ✕
            </button>

            <div className="relative aspect-video bg-[#000]">
              <img
                src={assetPath(selectedItem.url)}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="px-2.5 py-0.5 bg-[#2f54eb]/10 text-[#2f54eb] rounded-full text-[11px] font-bold uppercase tracking-wider">
                  {selectedItem.tag}
                </span>
                <h3 className="font-serif-luxury text-2xl font-semibold text-[#1a1614] mt-1">
                  {selectedItem.title}
                </h3>
                <p className="text-xs text-[#5e5650] mt-1 max-w-lg">
                  {selectedItem.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onBookItem(selectedItem.title);
                  setSelectedItem(null);
                }}
                className="btn-royal-blue text-xs py-2.5 px-6 whitespace-nowrap shadow-md"
              >
                Book This Style ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

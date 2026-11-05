import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Service, Offer } from '../types';
import { ProductShowcase } from '../components/Product3DShowcase';
import { ShowcaseGallery } from '../components/ShowcaseGallery';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { CyclemonStudioShowcase } from '../components/CyclemonStudioShowcase';
import { PitchModal } from '../components/PitchModal';
import { useLayout } from '../components/Layout';

export const HomePage: React.FC = () => {
  const { salon, handleAddToCart, setIsBookingOpen } = useLayout();
  const navigate = useNavigate();

  const [studios, setStudios] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  useEffect(() => {
    api.getSalonInfo()
      .then((data) => setStudios(data.studios))
      .catch((err) => console.error('Failed to load studios:', err));

    api.getServices()
      .then((data) => setServices(data.services))
      .catch((err) => console.error('Failed to load services:', err));

    api.getOffers()
      .then((data) => setOffers(data.offers))
      .catch((err) => console.error('Failed to load offers:', err));
  }, []);

  // Filter out spa services from the main treatments grid (spa has its own page)
  const filteredServices = services.filter((s) => {
    if (s.category === 'spa') return false;
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCat && matchesSearch;
  });

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-10 left-1/4 w-[600px] h-[400px] bg-gradient-to-b from-[#f2e2cf]/50 via-[#f9efe2]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto w-full relative grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Header */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#b89a73]/30 text-xs text-[#5e5650] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#c59b4b]"></span>
              <span className="text-[11px] sm:text-xs">Opposite Paras Plaza, Adarsh Nagar, Derabassi • Open 7 Days</span>
            </div>

            <h1 className="font-serif-luxury italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#1a1614] leading-[1.08]">
              The Style Studio Lounge
            </h1>

            <p className="font-serif-luxury text-lg sm:text-xl md:text-2xl text-[#3d3632] italic font-light max-w-xl">
              An architectural sanctuary of contemporary hair artistry, bespoke bridal couture &amp; clinical aesthetics.
            </p>

            <p className="text-xs sm:text-sm text-[#5e5650] leading-relaxed max-w-xl font-light">
              Step into Derabassi's premier unisex salon. Explore our transparent pricing catalog, discover verified client transformations, and book your appointment with instant online reservation.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="btn-royal-blue text-xs sm:text-sm py-2.5 sm:py-3 px-6 sm:px-8 shadow-lg"
              >
                Reserve Your Visit
              </button>
              <a
                href="#treatments"
                className="btn-outline-cream text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 shadow-sm"
              >
                Explore Pricing Menu ➔
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-2 text-center sm:text-left sm:flex sm:items-center sm:gap-8 pt-6 border-t border-[#b89a73]/20 text-xs text-[#5e5650]">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-[#1a1614] font-serif-luxury">4.9★</span>
                <span className="text-[11px] sm:text-xs">340+ Reviews</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#b89a73]/20" />
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-[#8a651f] font-serif-luxury">Upto 40%</span>
                <span className="text-[11px] sm:text-xs">Privileges</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#b89a73]/20" />
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-[#1a1614] font-serif-luxury">100%</span>
                <span className="text-[11px] sm:text-xs">Hygiene Certified</span>
              </div>
            </div>
          </div>

          {/* Right: Hero Display Frame */}
          <div className="lg:col-span-5 relative">
            <div className="cream-card rounded-[32px] p-4 sm:p-5 border border-[#b89a73]/30 shadow-2xl bg-white">
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden relative shadow-inner bg-[#f5ecde]">
                <img
                  src="https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.33.jpeg"
                  alt="The Style Studio Lounge Styling Interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6 text-white">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2f54eb] text-white text-[10px] font-bold uppercase tracking-wider">
                      Main Styling Floor
                    </span>
                    <h4 className="font-serif-luxury text-2xl font-medium mt-1">European Ergonomic Stations</h4>
                    <p className="text-xs text-slate-200 font-light mt-0.5">
                      Shadowless LED vanity mirrors, private bridal suites, and imported hydraulic chairs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#b89a73]/15 flex justify-between items-center text-xs text-[#5e5650]">
                <span>The Style Studio Lounge • Derabassi</span>
                <span className="text-[#2f54eb] font-semibold">Opposite Paras Plaza 📍</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Studios Showcase */}
      <CyclemonStudioShowcase
        studios={studios}
        onBookStudio={(title) => {
          const sample: Service = {
            id: 'studio-book-' + Date.now(),
            category: 'studio',
            name: `${title} VIP Session`,
            duration: '90 mins',
            originalPrice: 2499,
            price: 1499,
            gender: 'Unisex',
            description: `Exclusive reservation for ${title} at The Style Studio Lounge Derabassi.`
          };
          handleAddToCart(sample);
        }}
      />

      {/* Real Showcase Visual Gallery */}
      <ShowcaseGallery
        onBookItem={(title) => {
          const sample: Service = {
            id: 'showcase-' + Date.now(),
            category: 'gallery',
            name: title,
            duration: 'Custom Session',
            originalPrice: 2499,
            price: 1749,
            gender: 'Unisex',
            description: 'Custom luxury session selected from our visual showcase gallery.'
          };
          handleAddToCart(sample);
        }}
      />

      {/* Before & After Slider */}
      <div className="px-6 bg-[#faf6f0] py-6">
        <BeforeAfterSlider
          beforeImage="/images/before_nails.jpg"
          afterImage="https://thestylestudiolounge.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-10-at-16.25.44-2.jpeg"
          title="Artisan Nail Sculpting & Couture Finish"
          subtitle="Drag the interactive slider to compare natural unpolished nails with our hand-painted artisan extension and mirror shine finish."
          beforeLabel="Natural Bare Nails"
          afterLabel="Artisan Salon Finish"
        />
      </div>

      {/* Products & Formulations */}
      <ProductShowcase onAddProduct={handleAddToCart} />

      {/* Treatments & Pricing Catalog */}
      <section id="treatments" className="py-24 px-6 border-t border-[#b89a73]/20 bg-[#fbf8f3]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#2f54eb] font-semibold">
                Transparent Pricing Menu
              </span>
              <h2 className="font-serif-luxury italic text-4xl sm:text-5xl font-medium text-[#1a1614] mt-2">
                Curated Treatments Catalog
              </h2>
              <p className="text-sm text-[#5e5650] mt-2 font-light">
                No guessing games. All prices inclusive of private consultation and imported Italian formulations.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search haircuts, facials, bridal..."
                className="w-full px-4 py-2.5 bg-white border border-[#b89a73]/30 rounded-full text-xs text-[#1a1614] focus:outline-none focus:border-[#2f54eb] transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {[
              { id: 'all', name: 'All Treatments' },
              { id: 'hair', name: 'Hair Studio' },
              { id: 'bridal', name: 'Bridal Suite' },
              { id: 'skin', name: 'Skin Lab' },
              { id: 'nails', name: 'Nail Lounge' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#2f54eb] text-white shadow-md'
                    : 'bg-white text-[#5e5650] hover:text-[#1a1614] border border-[#b89a73]/25'
                }`}
              >
                {cat.name}
              </button>
            ))}
            {/* Spa & Wellness pill — links to /spa page */}
            <button
              type="button"
              onClick={() => navigate('/spa')}
              className="px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all bg-[#c59b4b]/15 text-[#8a651f] border border-[#c59b4b]/30 hover:bg-[#c59b4b]/25"
            >
              ✦ Spa &amp; Wellness
            </button>
          </div>

          {/* Services List */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="p-5 rounded-2xl bg-white border border-[#b89a73]/25 hover:border-[#b89a73]/50 hover:shadow-md transition-all flex justify-between items-center group"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury text-xl font-medium text-[#1a1614] group-hover:text-[#2f54eb] transition-colors">
                      {service.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#faf4ec] text-[#5e5650] font-mono border border-[#b89a73]/20">
                      ⏱️ {service.duration}
                    </span>
                  </div>
                  <p className="text-xs text-[#5e5650] font-light line-clamp-1">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    {service.price !== null && service.price !== undefined ? (
                      <>
                        <div className="text-xl font-bold text-[#8a651f] font-serif-luxury">
                          ₹{service.price}
                        </div>
                        {service.originalPrice && (
                          <div className="text-xs text-slate-400 line-through">
                            ₹{service.originalPrice}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs font-semibold text-[#8a651f]">
                        Price at studio
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(service)}
                    className="w-9 h-9 rounded-full bg-[#2f54eb]/10 hover:bg-[#2f54eb] text-[#2f54eb] hover:text-white border border-[#2f54eb]/30 flex items-center justify-center text-sm font-bold transition-all shadow-sm"
                    title="Add to booking"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Spa teaser card in treatments section */}
          <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-[#f5e9d4] to-[#faf0e0] border border-[#c59b4b]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#8a651f] mb-1">05 Spa &amp; Wellness Studio</div>
              <div className="font-serif-luxury italic text-2xl text-[#1a1614]">Discover Our Spa Rituals</div>
              <div className="text-xs text-[#5e5650] mt-1">Turkish Hammam · Balinese · Swedish · Aromatherapy — 30% Wellness Privilege included</div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/spa')}
              className="btn-royal-blue text-sm py-3 px-7 font-semibold shadow-lg flex-shrink-0"
            >
              Explore Spa &amp; Wellness →
            </button>
          </div>
        </div>
      </section>

      {/* Privilege Offers Section */}
      <section id="offers" className="py-24 px-6 border-t border-[#b89a73]/20 bg-[#faf6f0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8a651f] font-semibold">
              Privilege Codes
            </span>
            <h2 className="font-serif-luxury italic text-4xl sm:text-5xl font-medium text-[#1a1614] mt-2">
              Limited Edition Offers
            </h2>
            <p className="text-sm text-[#5e5650] mt-2 font-light">
              Apply code at checkout or click to book the package directly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {offers
              .filter((o) => o.code !== 'SPA30') // SPA30 is featured on /spa page
              .map((offer) => (
              <div
                key={offer.id}
                className="relative p-6 rounded-3xl bg-white border border-[#b89a73]/30 hover:border-[#8a651f] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-[#c59b4b]/15 text-[#855e16] rounded-full text-xs font-bold tracking-wider">
                      {offer.badge}
                    </span>
                    <span className="font-mono text-xs text-[#5e5650] bg-[#faf4ec] px-2 py-1 rounded border border-[#b89a73]/20">
                      CODE: <strong>{offer.code}</strong>
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-2xl font-semibold text-[#1a1614] mb-2">
                    {offer.title}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#5e5650] mb-6">
                    {offer.services.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-[#b89a73]/15 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-[#8a651f] font-serif-luxury">
                      ₹{offer.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-2">
                      ₹{offer.originalPrice}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleService: Service = {
                        id: offer.id,
                        category: 'offers',
                        name: offer.title,
                        duration: 'Special Session',
                        originalPrice: offer.originalPrice,
                        price: offer.price,
                        gender: 'Unisex',
                        description: offer.services.join(', ')
                      };
                      handleAddToCart(sampleService);
                    }}
                    className="btn-royal-blue text-xs py-2 px-5 font-semibold"
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salon Location & Contact */}
      <section id="location" className="py-24 px-6 border-t border-[#b89a73]/20 bg-[#f7f2ea]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2f54eb] font-semibold">
              Visit The Lounge
            </span>
            <h2 className="font-serif-luxury italic text-4xl sm:text-5xl font-medium text-[#1a1614]">
              Derabassi Sanctuary
            </h2>
            <p className="text-sm text-[#5e5650] font-light leading-relaxed">
              Conveniently situated right opposite Paras Plaza on Adarsh Nagar Street. Designed with private bridal suites, imported styling stations, and strict sterilization protocols.
            </p>
            <div className="space-y-3 text-sm text-[#3d3632]">
              <div className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <strong className="text-[#1a1614] block font-medium">Physical Address:</strong>
                  G P Tower, Gali No. 8, Opposite Paras Plaza, Adarsh Nagar, Derabassi, Punjab 140507
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <strong className="text-[#1a1614]">Direct Helpline:</strong>{' '}
                  <a href="tel:+917710287822" className="text-[#2f54eb] font-semibold hover:underline">
                    +91 77102 87822
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">⏰</span>
                <div>
                  <strong className="text-[#1a1614]">Operating Hours:</strong> 10:00 AM – 8:00 PM (All 7 Days)
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <a
                href="https://wa.me/917710287822?text=Hello%20The%20Style%20Studio%20Lounge%2C%20I%20want%20to%20inquire%20about%20booking%20an%20appointment."
                target="_blank"
                rel="noreferrer"
                className="btn-royal-blue text-sm py-2.5 px-6"
              >
                💬 WhatsApp Concierge
              </a>
              <a
                href="https://maps.google.com/?q=The+Style+Studio+Lounge+Derabassi"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-cream text-sm"
              >
                Open Google Maps ➔
              </a>
            </div>
          </div>
          <div className="lg:col-span-6 relative aspect-video rounded-3xl overflow-hidden border border-[#b89a73]/30 shadow-xl bg-white p-2">
            <img
              src="https://thestylestudiolounge.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-28-at-10.29.31-2.jpeg"
              alt="The Style Studio Lounge Interior"
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#b89a73]/20 bg-[#faf6f0] text-xs text-[#5e5650]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-serif-luxury italic text-xl text-[#1a1614]">
            {salon?.name || 'The Style Studio Lounge'}
          </div>
          <div>© 2026 {salon?.name || 'The Style Studio Lounge'}. {salon?.address || 'Opposite Paras Plaza, Derabassi'}.</div>
          <button
            type="button"
            onClick={() => setIsPitchOpen(true)}
            className="text-[#2f54eb] font-semibold hover:underline"
          >
            Open Client Pitch Deck ➔
          </button>
        </div>
      </footer>

      <PitchModal isOpen={isPitchOpen} onClose={() => setIsPitchOpen(false)} />
    </>
  );
};

export default HomePage;

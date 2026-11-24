import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { api } from '../services/api';
import type { Service, Booking, SalonInfo } from '../types';
import { BookingDrawer } from './BookingDrawer';
import { ConfirmationModal } from './ConfirmationModal';

export interface LayoutContextValue {
  cart: Service[];
  salon: SalonInfo | null;
  handleAddToCart: (service: Service) => void;
  handleRemoveFromCart: (id: string) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; pct: number } | null;
  setAppliedCoupon: (coupon: { code: string; pct: number } | null) => void;
  setIsBookingOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  setConfirmedBooking: (b: { booking: Booking; waUrl: string } | null) => void;
}

export const LayoutContext = React.createContext<LayoutContextValue>({
  cart: [],
  salon: null,
  handleAddToCart: () => {},
  handleRemoveFromCart: () => {},
  clearCart: () => {},
  appliedCoupon: null,
  setAppliedCoupon: () => {},
  setIsBookingOpen: () => {},
  showToast: () => {},
  setConfirmedBooking: () => {},
});

export const useLayout = () => React.useContext(LayoutContext);

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINK_CLASS =
  "text-xs uppercase tracking-[0.14em] font-semibold text-[#5e5650] hover:text-[#1a1614] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#2f54eb] hover:after:w-full after:transition-all after:duration-300";

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isSpa = location.pathname === '/spa';
  const isBooking = location.pathname === '/booking';

  const [salon, setSalon] = useState<SalonInfo | null>(null);
  
  // Persistent Cart in localStorage
  const [cart, setCart] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_cart_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.services)) return parsed.services;
      }
    } catch {}
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct: number } | null>(() => {
    try {
      const saved = localStorage.getItem('ssl_cart_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.coupon) return parsed.coupon;
      }
    } catch {}
    return null;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ booking: Booking; waUrl: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ssl_cart_v2', JSON.stringify({
        services: cart,
        coupon: appliedCoupon
      }));
    } catch {}
  }, [cart, appliedCoupon]);

  // Load salon info once
  useEffect(() => {
    api.getSalonInfo()
      .then((data) => setSalon(data.salon))
      .catch(() => {});
  }, []);

  // Re-validate loaded cart against services from backend
  useEffect(() => {
    api.getServices()
      .then((data) => {
        const validIds = new Set(data.services.map((s) => s.id));
        setCart((prev) => {
          // Keep services that exist in backend catalog, or custom spa / showcase services
          return prev.filter((s) => validIds.has(s.id) || s.isSpa || s.category === 'spa' || s.category === 'offers');
        });
      })
      .catch(() => {});
  }, []);

  // Lenis Smooth Scroll — shared across desktop, non-intrusive on mobile touch
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && window.innerWidth < 1024) {
      // Let mobile devices use native inertial browser scrolling
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Android hardware back / browser back closes open modal or mobile menu first (Part B.4)
  useEffect(() => {
    if (isMobileMenuOpen || confirmedBooking) {
      window.history.pushState({ modalOpen: true }, '');
      const handlePopState = () => {
        if (confirmedBooking) {
          setConfirmedBooking(null);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      };
      window.addEventListener('popstate', handlePopState, { once: true });
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isMobileMenuOpen, confirmedBooking]);

  const handleAddToCart = (service: Service) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === service.id)) return prev;
      return [...prev, service];
    });
    // Non-blocking toast with "View booking" link, no page jump (Part A.3)
    showToast(`Added "${service.name}" to booking.`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('ssl_cart_v2');
    } catch {}
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isBooking ? '/#treatments' : '/');
    }
  };

  const ctxValue: LayoutContextValue = {
    cart,
    salon,
    handleAddToCart,
    handleRemoveFromCart,
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    setIsBookingOpen,
    showToast,
    setConfirmedBooking,
  };

  return (
    <LayoutContext.Provider value={ctxValue}>
      <div className="min-h-[100dvh] bg-[#faf7f2] text-[#1a1614] selection:bg-[#2f54eb] selection:text-white relative font-sans">
        
        {/* Toast Notification with "View booking" link (Part A.3) */}
        {toastMessage && (
          <div className="fixed bottom-6 right-4 sm:right-6 z-[60] px-4 sm:px-5 py-3 bg-white border border-[#2f54eb]/30 rounded-2xl shadow-2xl text-xs font-semibold text-[#1a1614] animate-pop-in flex items-center gap-3 max-w-[92vw]">
            <span className="truncate">{toastMessage}</span>
            <Link
              to="/booking"
              className="text-[#2f54eb] hover:text-[#1d39c4] font-bold whitespace-nowrap underline underline-offset-2 flex-shrink-0"
            >
              View booking ➔
            </Link>
          </div>
        )}

        {/* ── UNIFIED LUXURY HEADER ── */}
        <header className="fixed top-0 inset-x-0 z-40 glass-nav-cream transition-all">
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-3">
            
            {/* Left: Back button (on non-home pages) + Brand Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              {!isHome && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 min-h-[44px] min-w-[44px] px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/90 border border-[#b89a73]/35 text-xs font-semibold text-[#1a1614] hover:bg-white hover:text-[#2f54eb] hover:border-[#2f54eb]/50 transition-all shadow-sm flex-shrink-0 group"
                  aria-label="Go back to previous page"
                >
                  <span className="text-sm transition-transform group-hover:-translate-x-0.5">←</span>
                  <span className="hidden sm:inline text-[11px] sm:text-xs">Back</span>
                </button>
              )}

              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-2 group min-w-0 max-w-[11rem] sm:max-w-none">
                <span className="font-serif-luxury italic text-[13px] sm:text-2xl lg:text-[23px] font-semibold tracking-tight text-[#1a1614] group-hover:text-[#2f54eb] transition-colors truncate">
                  The Style Studio Lounge
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0">
              {isHome ? (
                <>
                  <a href="#home" className={NAV_LINK_CLASS}>Home</a>
                  <a href="#studios" className={NAV_LINK_CLASS}>Studios</a>
                  <a href="#treatments" className={NAV_LINK_CLASS}>Treatments</a>
                  <a href="#location" className={NAV_LINK_CLASS}>Location</a>
                </>
              ) : (
                <>
                  <Link to="/" className={NAV_LINK_CLASS}>Home</Link>
                  <Link to="/#studios" className={NAV_LINK_CLASS}>Studios</Link>
                  <Link to="/#treatments" className={NAV_LINK_CLASS}>Treatments</Link>
                  <Link to="/#location" className={NAV_LINK_CLASS}>Location</Link>
                </>
              )}

              {/* ✦ Spa Link */}
              <Link
                to="/spa"
                className={`text-xs uppercase tracking-[0.14em] font-semibold transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:transition-all after:duration-300 ${
                  isSpa
                    ? 'text-[#c59b4b] after:w-full after:bg-[#c59b4b]'
                    : 'text-[#5e5650] hover:text-[#1a1614] after:w-0 after:bg-[#2f54eb] hover:after:w-full'
                }`}
              >
                ✦ Spa
              </Link>
            </nav>

            {/* Desktop Right Actions (Navigates to /booking) */}
            <div className="hidden lg:flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <Link
                to="/booking"
                className="relative w-11 h-11 rounded-full bg-white hover:bg-[#faf6f0] border border-[#b89a73]/30 flex items-center justify-center transition-all hover:scale-105 shadow-sm flex-shrink-0"
                title="View Booking Cart"
                aria-label="View Booking Cart"
              >
                <span className="text-base">🛍️</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2f54eb] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {cart.length}
                  </span>
                )}
              </Link>
              <Link
                to="/booking"
                className="btn-royal-blue text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 font-semibold flex-shrink-0 shadow-md shadow-[#2f54eb]/25 min-h-[44px]"
              >
                Book Appointment
              </Link>
            </div>

            {/* Mobile Right Controls */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Link
                to="/booking"
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-[#faf6f0] border border-[#b89a73]/30 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                aria-label="View Booking Cart"
              >
                <span className="text-base">🛍️</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2f54eb] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {cart.length}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-full border transition-all text-[11px] sm:text-xs font-semibold shadow-sm flex-shrink-0 min-h-[44px] ${
                  isMobileMenuOpen
                    ? 'bg-[#1a1614] text-white border-[#1a1614]'
                    : 'bg-white text-[#1a1614] border-[#b89a73]/35 hover:border-[#2f54eb]'
                }`}
                aria-label="Toggle Navigation Menu"
              >
                <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
                <span className="text-[10px]">{isMobileMenuOpen ? '✕' : '▼'}</span>
              </button>
            </div>
          </div>

          {/* Unified Mobile Dropdown Sheet */}
          {isMobileMenuOpen && (
            <div className="lg:hidden px-3.5 pb-5 pt-1 animate-slide-down-fade">
              <div className="bg-[#faf7f2]/98 backdrop-blur-2xl rounded-3xl border border-[#b89a73]/30 shadow-2xl p-4 sm:p-5 space-y-4 max-h-[calc(100dvh-5rem)] overflow-y-auto">
                <nav className="divide-y divide-[#b89a73]/15">
                  {isHome ? (
                    <>
                      <MobileNavAnchor href="#home" label="01 Home" sub="Main Salon Entrance" onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavAnchor href="#studios" label="02 Studios" sub="Hair, Bridal, Skin, Nails & Spa" onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavAnchor href="#treatments" label="03 Treatments" sub="Transparent Pricing Catalog" onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavAnchor href="#location" label="04 Location" sub="Derabassi • Open 7 Days (10AM–8PM)" onClick={() => setIsMobileMenuOpen(false)} />
                    </>
                  ) : (
                    <>
                      <MobileNavLink to="/" label="01 Home" sub="Return to Main Salon" onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/#studios" label="02 Studios" sub="Hair, Bridal, Skin & Nails" onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/#treatments" label="03 Treatments" sub="Transparent Pricing Menu" onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/#location" label="04 Location" sub="Derabassi • Open 7 Days" onClick={() => setIsMobileMenuOpen(false)} />
                    </>
                  )}
                  <MobileNavLink to="/spa" label="✦ Spa & Wellness" sub="Turkish Hammam, Balinese, Swedish & Aromatherapy" onClick={() => setIsMobileMenuOpen(false)} gold />
                  <MobileNavLink to="/booking" label="🛍️ Booking Pass" sub="Review Your Cart & Reserve Slot" onClick={() => setIsMobileMenuOpen(false)} />
                </nav>

                <div className="pt-2 space-y-2">
                  <Link
                    to="/booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full btn-royal-blue py-3.5 text-sm font-semibold shadow-md shadow-[#2f54eb]/30 flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>Book Appointment Online</span>
                    <span>➔</span>
                  </Link>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href="tel:+917710287822"
                      className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-white border border-[#b89a73]/25 font-semibold text-[#1a1614] hover:border-[#2f54eb] transition-colors min-h-[44px]"
                    >
                      <span>📞</span><span>Call Studio</span>
                    </a>
                    <a
                      href="https://wa.me/917710287822?text=Hello%20The%20Style%20Studio%20Lounge,%20I%20would%20like%20to%20inquire%20about%20a%20service"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors min-h-[44px]"
                    >
                      <span>💬</span><span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        {children}

        {/* Retain BookingDrawer in DOM only if isBookingOpen is explicitly triggered, keeping component intact */}
        {isBookingOpen && (
          <BookingDrawer
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            cart={cart}
            onRemoveService={handleRemoveFromCart}
            onBookingSuccess={(booking, waUrl) => {
              setConfirmedBooking({ booking, waUrl });
              clearCart();
            }}
          />
        )}

        {/* Shared Confirmation Modal */}
        <ConfirmationModal
          booking={confirmedBooking?.booking || null}
          waUrl={confirmedBooking?.waUrl || '#'}
          onClose={() => setConfirmedBooking(null)}
        />
      </div>
    </LayoutContext.Provider>
  );
};

function MobileNavAnchor({
  href, label, sub, onClick, gold
}: {
  href: string; label: string; sub: string; onClick: () => void; gold?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="py-3 flex items-center justify-between text-[#1a1614] hover:text-[#2f54eb] transition-colors group min-h-[44px]"
    >
      <div>
        <div className={`text-[10px] font-bold tracking-wider uppercase group-hover:text-[#2f54eb] ${gold ? 'text-[#c59b4b]' : 'text-[#8a7a6c]'}`}>{label}</div>
        <div className="text-sm font-medium">{sub}</div>
      </div>
      <span className="text-xs font-serif text-[#b89a73] group-hover:translate-x-1 transition-transform">➔</span>
    </a>
  );
}

function MobileNavLink({
  to, label, sub, onClick, gold
}: {
  to: string; label: string; sub: string; onClick: () => void; gold?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="py-3 flex items-center justify-between text-[#1a1614] hover:text-[#2f54eb] transition-colors group min-h-[44px]"
    >
      <div>
        <div className={`text-[10px] font-bold tracking-wider uppercase group-hover:text-[#2f54eb] ${gold ? 'text-[#c59b4b]' : 'text-[#8a7a6c]'}`}>{label}</div>
        <div className="text-sm font-medium">{sub}</div>
      </div>
      <span className="text-xs font-serif text-[#b89a73] group-hover:translate-x-1 transition-transform">➔</span>
    </Link>
  );
}

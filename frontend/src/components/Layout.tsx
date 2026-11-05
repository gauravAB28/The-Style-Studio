import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { api } from '../services/api';
import type { User, Service, Booking, SalonInfo } from '../types';
import { AuthModal } from './AuthModal';
import { BookingDrawer } from './BookingDrawer';
import { ConfirmationModal } from './ConfirmationModal';

interface LayoutContextValue {
  user: User | null;
  cart: Service[];
  salon: SalonInfo | null;
  handleAddToCart: (service: Service) => void;
  handleRemoveFromCart: (id: string) => void;
  setIsBookingOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
}

export const LayoutContext = React.createContext<LayoutContextValue>({
  user: null,
  cart: [],
  salon: null,
  handleAddToCart: () => {},
  handleRemoveFromCart: () => {},
  setIsBookingOpen: () => {},
  setIsAuthOpen: () => {},
  showToast: () => {},
});

export const useLayout = () => React.useContext(LayoutContext);

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINK_CLASS =
  "text-xs uppercase tracking-[0.14em] font-semibold text-[#5e5650] hover:text-[#1a1614] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#2f54eb] hover:after:w-full after:transition-all after:duration-300";

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isSpa = location.pathname === '/spa';

  const [salon, setSalon] = useState<SalonInfo | null>(null);
  const [cart, setCart] = useState<Service[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ssl_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ booking: Booking; waUrl: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lenis Smooth Scroll — shared across pages
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
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

  // Load salon info once
  useEffect(() => {
    api.getSalonInfo()
      .then((data) => setSalon(data.salon))
      .catch(() => {});
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleUserLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('ssl_user', JSON.stringify(loggedUser));
    showToast(`Welcome, ${loggedUser.name}! VIP Pass active.`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ssl_user');
    showToast('Logged out successfully.');
  };

  const handleAddToCart = (service: Service) => {
    setCart(prev => {
      if (prev.some(item => item.id === service.id)) return prev;
      return [...prev, service];
    });
    showToast(`Added "${service.name}" to booking.`);
    setIsBookingOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const ctxValue: LayoutContextValue = {
    user,
    cart,
    salon,
    handleAddToCart,
    handleRemoveFromCart,
    setIsBookingOpen,
    setIsAuthOpen,
    showToast,
  };

  return (
    <LayoutContext.Provider value={ctxValue}>
      <div className="min-h-screen bg-[#faf7f2] text-[#1a1614] selection:bg-[#2f54eb] selection:text-white relative font-sans">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[60] px-5 py-3 bg-white border border-[#2f54eb]/30 rounded-2xl shadow-xl text-xs font-semibold text-[#1a1614] animate-pop-in">
            {toastMessage}
          </div>
        )}

        {/* ── UNIFIED LUXURY HEADER (Identical clean layout across both Home and Spa) ── */}
        <header className="fixed top-0 inset-x-0 z-40 glass-nav-cream transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="font-serif-luxury italic text-lg sm:text-2xl lg:text-[23px] font-semibold tracking-tight text-[#1a1614] group-hover:text-[#2f54eb] transition-colors whitespace-nowrap">
                The Style Studio Lounge
              </span>
            </Link>

            {/* Common Navigation Links (Clean 5-item menu preferred by user) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white border border-[#b89a73]/30 text-xs shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[#1a1614] max-w-[70px] sm:max-w-none truncate">{user.name}</span>
                  <span className="text-[10px] bg-[#c59b4b]/20 text-[#855e16] px-1.5 py-0.5 rounded font-bold">VIP</span>
                  <button type="button" onClick={handleLogout} className="text-slate-400 hover:text-black ml-1 text-xs" title="Log out">✕</button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="inline-flex btn-animated-login py-1.5 px-3.5 sm:px-4 text-xs font-semibold shadow-sm flex-shrink-0"
                >
                  <span className="btn-login-sparkle text-xs" aria-hidden="true">✦</span>
                  <span>Login</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#faf6f0] border border-[#b89a73]/30 flex items-center justify-center transition-all hover:scale-105 shadow-sm flex-shrink-0"
                title="View Booking Cart"
              >
                <span className="text-sm sm:text-base">🛍️</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#2f54eb] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="btn-royal-blue text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 font-semibold flex-shrink-0 shadow-md shadow-[#2f54eb]/25"
              >
                Book Appointment
              </button>
            </div>

            {/* Mobile Right Controls */}
            <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="relative w-9 h-9 rounded-full bg-white hover:bg-[#faf6f0] border border-[#b89a73]/30 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                aria-label="Cart"
              >
                <span className="text-sm">🛍️</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2f54eb] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold shadow-sm flex-shrink-0 ${
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
              <div className="bg-[#faf7f2]/98 backdrop-blur-2xl rounded-3xl border border-[#b89a73]/30 shadow-2xl p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
                {/* VIP Auth Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#b89a73]/25 shadow-sm">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <div className="text-xs font-bold text-[#1a1614] flex items-center gap-1.5">
                            {user.name}
                            <span className="text-[9px] bg-[#c59b4b]/20 text-[#855e16] px-1.5 py-0.5 rounded font-bold">VIP PASS</span>
                          </div>
                          <div className="text-[10px] text-[#786e64]">{user.phone}</div>
                        </div>
                      </div>
                      <button type="button" onClick={handleLogout} className="text-xs text-rose-500 hover:underline font-medium px-2 py-1">Logout</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#1a1614]">VIP Guest Lounge</div>
                        <div className="text-[10px] text-[#786e64]">Log in for bespoke privileges</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }}
                        className="btn-animated-login py-1.5 px-3 text-xs font-semibold shadow-sm"
                      >
                        <span className="btn-login-sparkle text-xs">✦</span>
                        <span>Login</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Common Mobile Navigation Links */}
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
                </nav>

                {/* Mobile Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }}
                    className="w-full btn-royal-blue py-3 text-sm font-semibold shadow-md shadow-[#2f54eb]/30 flex items-center justify-center gap-2"
                  >
                    <span>Book Appointment Online</span>
                    <span>➔</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a href="tel:+917710287822" className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-[#b89a73]/25 font-semibold text-[#1a1614] hover:border-[#2f54eb] transition-colors">
                      <span>📞</span><span>Call Studio</span>
                    </a>
                    <a
                      href="https://wa.me/917710287822?text=Hello%20The%20Style%20Studio%20Lounge,%20I%20would%20like%20to%20inquire%20about%20a%20service"
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors"
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

        {/* Shared Modals */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleUserLogin} />
        <BookingDrawer
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          cart={cart}
          onRemoveService={handleRemoveFromCart}
          user={user}
          onRequireAuth={() => { setIsBookingOpen(false); setIsAuthOpen(true); }}
          onBookingSuccess={(booking, waUrl) => {
            setConfirmedBooking({ booking, waUrl });
            setCart([]);
          }}
        />
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
      className="py-2.5 flex items-center justify-between text-[#1a1614] hover:text-[#2f54eb] transition-colors group"
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
      className="py-2.5 flex items-center justify-between text-[#1a1614] hover:text-[#2f54eb] transition-colors group"
    >
      <div>
        <div className={`text-[10px] font-bold tracking-wider uppercase group-hover:text-[#2f54eb] ${gold ? 'text-[#c59b4b]' : 'text-[#8a7a6c]'}`}>{label}</div>
        <div className="text-sm font-medium">{sub}</div>
      </div>
      <span className="text-xs font-serif text-[#b89a73] group-hover:translate-x-1 transition-transform">➔</span>
    </Link>
  );
}

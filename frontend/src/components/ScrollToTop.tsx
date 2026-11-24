import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_POSITIONS_KEY = 'ssl_scroll_positions';

function getSavedPositions(): Record<string, number> {
  try {
    const raw = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePosition(pathname: string, y: number) {
  try {
    const positions = getSavedPositions();
    positions[pathname] = y;
    sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
  } catch {}
}

export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Save scroll position of previous route before changing
    const handleScroll = () => {
      savePosition(pathname, window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      savePosition(pathname, window.scrollY);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (navType === 'POP') {
      // Browser back/forward navigation — restore previous position
      const saved = getSavedPositions()[pathname];
      if (typeof saved === 'number') {
        window.scrollTo({ top: saved, behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      // New navigation
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    prevPathRef.current = pathname;
  }, [pathname, hash, navType]);

  return null;
};

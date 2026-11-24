import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';

const SpaPage = React.lazy(() => import('./pages/SpaPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));

export const App: React.FC = () => (
  <Layout>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/booking"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center pt-20">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#2f54eb] border-t-transparent animate-spin mx-auto" />
                  <p className="font-serif-luxury italic text-xl text-[#1a1614]">
                    Loading your Sanctuary Pass…
                  </p>
                </div>
              </div>
            }
          >
            <BookingPage />
          </Suspense>
        }
      />
      <Route
        path="/spa"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center pt-20">
                <div className="text-center space-y-4">
                  <div className="spa-seal-spin inline-block">
                    <svg viewBox="0 0 80 80" className="w-16 h-16" aria-hidden="true">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#c59b4b" strokeWidth="1.5" />
                      <text x="40" y="45" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#8a651f" fontFamily="serif" fontStyle="italic">✦</text>
                    </svg>
                  </div>
                  <p className="font-serif-luxury italic text-2xl text-[#c59b4b]">
                    Preparing your Sanctuary…
                  </p>
                </div>
              </div>
            }
          >
            <SpaPage />
          </Suspense>
        }
      />
    </Routes>
  </Layout>
);

export default App;

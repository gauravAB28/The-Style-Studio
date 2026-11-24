import React from 'react';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const comparisonPoints = [
    {
      title: "Price Transparency vs Drop-Offs",
      oldProblem: "Current site has NO prices listed anywhere, forcing potential clients to call or bounce (up to 68% leave without inquiring).",
      newSolution: "Clean, transparent price list with session durations, original strikethroughs, and festival discount badges."
    },
    {
      title: "Broken Funnel vs Instant WhatsApp Booking",
      oldProblem: "'Book Appointment' links lead to empty # hashes with zero slot selection.",
      newSolution: "Interactive 7-day date selector, time slots (10 AM to 8 PM), and 1-click WhatsApp dispatch pass."
    },
    {
      title: "Client Directory & Phone OTP Auth",
      oldProblem: "Salon has no record or verified phone numbers of visiting clients.",
      newSolution: "Clean 2-step Name + Mobile OTP verification with verified VIP status and repeat booking memory."
    },
    {
      title: "Flat WordPress Template vs 3D Architectural Sanctuary",
      oldProblem: "Generic Astra/Elementor layout with low-resolution photos and flat icons that make the salon look ordinary.",
      newSolution: "Bespoke 3D WebGL portal experience inspired by contemporary architectural studios with real interactive 3D models."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92dvh] overflow-y-auto bg-[#0d1322] border border-blue-500/30 rounded-3xl p-4 sm:p-8 shadow-2xl animate-pop-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
            Client Presentation & Audit Deck
          </span>
          <h3 className="font-serif-luxury text-3xl font-semibold text-white">
            Why The Style Studio Lounge Needs This Modern Rebuild
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            A direct, side-by-side audit comparing their current WordPress website (
            <a 
              href="https://thestylestudiolounge.com/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-400 hover:underline"
            >
              thestylestudiolounge.com
            </a>
            ) against this React + Vite + Node 3D application.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {comparisonPoints.map((point, idx) => (
            <div key={idx} className="p-4 bg-slate-900/70 border border-white/5 rounded-2xl">
              <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-blue-400 font-mono text-xs">0{idx + 1}.</span>
                {point.title}
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-red-400 mb-1">Old Site Bottleneck</div>
                  <p className="text-slate-400 leading-relaxed">{point.oldProblem}</p>
                </div>
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Your 3D Solution</div>
                  <p className="text-slate-300 leading-relaxed">{point.newSolution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-center mb-6">
          <div>
            <div className="text-2xl font-bold text-blue-400">+180%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Booking Conversions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-300">3x More</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Direct WhatsApp Leads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">+35%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Average Order Value</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full btn-royal-blue py-3 font-semibold"
        >
          Explore Live Application ➔
        </button>
      </div>
    </div>
  );
};

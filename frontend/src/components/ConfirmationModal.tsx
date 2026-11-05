import React from 'react';
import type { Booking } from '../types';

interface ConfirmationModalProps {
  booking: Booking | null;
  waUrl: string;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ booking, waUrl, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-amber-400/30 rounded-3xl p-8 shadow-2xl animate-pop-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="text-center pb-6 border-b border-dashed border-white/10">
          <div className="text-4xl mb-2">✨</div>
          <span className="inline-block px-3 py-1 bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
            Reservation Confirmed
          </span>
          <h3 className="font-serif-luxury text-3xl font-semibold text-white">Your Sanctuary Pass</h3>
          <div className="font-mono text-xs text-amber-300 font-bold mt-2 bg-amber-400/10 inline-block px-3 py-1 rounded-full border border-amber-400/20">
            Booking ID: #{booking.bookingId}
          </div>
        </div>

        <div className="py-6 space-y-3 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Client:</span>
            <strong className="text-white">{booking.user.name}</strong>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Contact Phone:</span>
            <strong className="text-white">{booking.user.phone}</strong>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Reserved Slot:</span>
            <strong className="text-amber-300">{booking.date} at {booking.time}</strong>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Salon Location:</span>
            <strong className="text-white">Opposite Paras Plaza, Derabassi</strong>
          </div>

          <div className="pt-3 border-t border-white/5">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Selected Treatments:
            </div>
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-white/5">
              {booking.services.map((s, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-slate-300">• {s.name}</span>
                  <span className="text-amber-300 font-semibold">₹{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-between text-base font-bold text-white">
            <span>Net Payable:</span>
            <span className="text-xl text-amber-300">₹{booking.total}</span>
          </div>
          {booking.totalSavings > 0 && (
            <div className="text-right text-xs text-emerald-400 font-medium">
              You saved ₹{booking.totalSavings} on this booking!
            </div>
          )}
        </div>

        <div className="pt-2 space-y-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold rounded-2xl shadow-lg transition-all"
          >
            <span>💬 Send Confirmation to Salon WhatsApp</span>
          </a>
          <p className="text-center text-[11px] text-slate-500">
            Clicking opens WhatsApp with your pre-filled reservation pass for salon concierge confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};

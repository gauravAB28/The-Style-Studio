import React, { useState } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [demoOtp, setDemoOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [smsToast, setSmsToast] = useState<{ name: string; phone: string; otp: string } | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await api.sendOtp(name.trim(), cleanPhone);
      setDemoOtp(res.demoOtp);
      setSmsToast({ name: res.name, phone: res.phone, otp: res.demoOtp });
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    if (clean && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = otp.join('');
    if (fullCode.length !== 4) {
      setError('Please enter the full 4-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const res = await api.verifyOtp(phone, fullCode);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCode = () => {
    if (demoOtp) {
      const digits = demoOtp.split('');
      setOtp(digits);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      {/* Simulated SMS Toast notification at top */}
      {smsToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] bg-white border border-[#2f54eb]/30 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-bounce">
          <div className="text-2xl">💬</div>
          <div className="flex-1 text-sm">
            <div className="flex justify-between items-center text-xs text-[#8c827a] mb-1">
              <span className="font-semibold text-[#2f54eb]">The Style Studio Lounge SMS</span>
              <span>Just now</span>
            </div>
            <p className="text-[#1a1614]">
              Hello <strong className="text-black">{smsToast.name}</strong>, your verification code is{' '}
              <span className="font-mono font-bold text-[#855e16] bg-[#c59b4b]/20 px-1.5 py-0.5 rounded">
                {smsToast.otp}
              </span>.
            </p>
            <button
              type="button"
              onClick={fillDemoCode}
              className="mt-2 text-xs font-semibold text-[#2f54eb] hover:text-[#1d39c4] underline"
            >
              ⚡ Auto-fill code into boxes
            </button>
          </div>
          <button 
            type="button" 
            onClick={() => setSmsToast(null)} 
            className="text-slate-400 hover:text-black text-sm"
          >
            ✕
          </button>
        </div>
      )}

      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto bg-white border border-[#b89a73]/30 rounded-3xl p-4 sm:p-8 shadow-2xl animate-pop-in my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 sm:top-6 right-3 sm:right-6 w-11 h-11 rounded-full bg-[#faf6f0] hover:bg-slate-200 text-slate-500 hover:text-black flex items-center justify-center transition-colors z-10"
        >
          ✕
        </button>

        {step === 'phone' ? (
          <div>
            <div className="text-center mb-6">
              <span className="inline-block px-3.5 py-1 bg-[#2f54eb]/10 border border-[#2f54eb]/20 text-[#2f54eb] rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
                VIP Lounge Login
              </span>
              <h3 className="font-serif-luxury text-3xl font-semibold text-[#1a1614]">Welcome Guest</h3>
              <p className="text-sm text-[#5e5650] mt-2">
                Enter your name and mobile number to unlock transparent pricing and appointment booking.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5e5650] mb-1.5 font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jaspreet Kaur"
                  className="w-full px-4 py-3 bg-[#faf6f0] border border-[#b89a73]/30 rounded-xl text-[#1a1614] text-sm focus:outline-none focus:border-[#2f54eb] transition-colors placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5e5650] mb-1.5 font-medium">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="px-3 py-3 bg-[#faf6f0] border border-[#b89a73]/30 rounded-xl text-[#1a1614] text-sm font-medium">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="flex-1 px-4 py-3 bg-[#faf6f0] border border-[#b89a73]/30 rounded-xl text-[#1a1614] text-sm focus:outline-none focus:border-[#2f54eb] transition-colors placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-royal-blue mt-4 py-3.5"
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP ➔'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <span className="inline-block px-3.5 py-1 bg-[#c59b4b]/15 border border-[#c59b4b]/30 text-[#855e16] rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
                Security Verification
              </span>
              <h3 className="font-serif-luxury text-3xl font-semibold text-[#1a1614]">Enter 4-Digit Code</h3>
              <p className="text-sm text-[#5e5650] mt-2">
                We sent a 4-digit code to <strong className="text-[#1a1614]">+91 {phone}</strong>
              </p>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs text-[#2f54eb] hover:underline mt-1 font-medium"
              >
                Edit phone number
              </button>
            </div>

            {demoOtp && (
              <div className="mb-4 text-center">
                <button
                  type="button"
                  onClick={fillDemoCode}
                  className="px-3.5 py-1.5 bg-[#c59b4b]/15 border border-[#c59b4b]/35 text-[#855e16] rounded-full text-xs font-semibold hover:bg-[#c59b4b]/25 transition-colors"
                >
                  ⚡ Tap to auto-fill ({demoOtp})
                </button>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-16 text-center text-2xl font-bold bg-[#faf6f0] border border-[#b89a73]/40 rounded-2xl text-[#1a1614] focus:outline-none focus:border-[#2f54eb] transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-royal-blue py-3.5"
              >
                {loading ? 'Verifying...' : 'Verify & Unlock VIP Pass ✨'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

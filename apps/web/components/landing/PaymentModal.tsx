"use client";

import { useState } from "react";
import { X, Lock, Loader2 } from "lucide-react";

interface PaymentModalProps {
  onClose: () => void;
}

export const PaymentModal = ({ onClose }: PaymentModalProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 3) return `${digits.substring(0, 2)} / ${digits.substring(2)}`;
    return digits;
  };

  const handlePay = () => {
    if (loading || success) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-[#0e0e0e] border border-zinc-800 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#121212] border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">Secure Checkout</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-white font-semibold text-base">Parcha95 Pro</span>
              <span className="text-zinc-500 text-xs font-mono">Monthly subscription · Billed every 30 days</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-xl font-mono">₹1,249</div>
              <div className="text-zinc-500 text-xs">/mo</div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        {!success ? (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Rachit Taneja"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#080808] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/60 transition-colors font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Card Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="w-full bg-[#080808] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono tracking-widest"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  Expiry Date
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={7}
                  className="w-full bg-[#080808] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono tracking-widest"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  CVC
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="•••"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                  maxLength={3}
                  className="w-full bg-[#080808] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono tracking-widest"
                />
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full mt-2 bg-emerald-500 text-black font-semibold text-sm rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ₹1,249 securely
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-zinc-600 font-mono">
              256-bit SSL encrypted · Cancel anytime
            </p>
          </div>
        ) : (
          <div className="px-6 py-12 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Payment Successful!</p>
              <p className="text-zinc-400 text-sm mt-1">Welcome to Parcha95 Pro. Your plan is now active.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

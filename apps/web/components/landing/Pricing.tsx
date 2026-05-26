"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-zinc-900 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 border border-emerald-900/50 bg-emerald-950/20 px-3 py-1 rounded-full w-fit mb-4 mx-auto">
            Scalability Plan
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-zinc-400 text-lg">
            Start gathering responses for free. Elevate production bounds when ready.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Tier 1: Free */}
          <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-2xl p-8 flex flex-col hover:border-zinc-700 transition-all">
            <h3 className="text-lg font-medium text-white mb-1 font-mono">Free</h3>
            <p className="text-zinc-500 text-xs mb-4">Basic CLI prototyping</p>
            <div className="text-4xl font-bold text-white mb-6 font-mono">
              $0<span className="text-sm text-zinc-500 font-normal">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Unlimited mock forms", 
                "100 records per month", 
                "Standard terminal themes", 
                "Community Discord support"
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-zinc-300 text-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth/register" className="w-full mt-auto">
              <button className="w-full border border-zinc-800 text-white hover:bg-zinc-900 hover:border-zinc-700 rounded-lg py-2.5 text-sm font-semibold transition-all">
                Get Started
              </button>
            </Link>
          </div>

          {/* Tier 2: Pro (Highlighted) */}
          <div className="bg-[#0A0A0A] border border-emerald-500/50 rounded-2xl p-8 flex flex-col relative shadow-[0_0_50px_rgba(16,185,129,0.05)] transform md:-translate-y-2 hover:border-emerald-400 transition-all">
            {/* Recommended Tag */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-black text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              Recommended
            </div>
            
            <h3 className="text-lg font-medium text-emerald-400 mb-1 font-mono">Pro</h3>
            <p className="text-zinc-500 text-xs mb-4">Full production scale</p>
            <div className="text-4xl font-bold text-white mb-6 font-mono">
              $15<span className="text-sm text-zinc-500 font-normal">/mo</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Everything in Free", 
                "Unlimited records", 
                "Custom variables & metadata", 
                "Zod schema customization", 
                "Advanced response analytics"
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-zinc-300 text-sm">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth/register" className="w-full mt-auto">
              <button className="w-full bg-emerald-500 text-black hover:bg-emerald-400 rounded-lg py-2.5 text-sm font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
                Get Started
              </button>
            </Link>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-2xl p-8 flex flex-col hover:border-zinc-700 transition-all">
            <h3 className="text-lg font-medium text-white mb-1 font-mono">Enterprise</h3>
            <p className="text-zinc-500 text-xs mb-4">Custom setups & SLA</p>
            <div className="text-4xl font-bold text-white mb-6 font-mono">
              Custom
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Everything in Pro", 
                "Custom reverse domains", 
                "SSO & SAML authentication", 
                "Dedicated success handlers", 
                "99.9% uptime guarantees"
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-zinc-300 text-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth/register" className="w-full mt-auto">
              <button className="w-full border border-zinc-800 text-white hover:bg-zinc-900 hover:border-zinc-700 rounded-lg py-2.5 text-sm font-semibold transition-all">
                Contact Sales
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { trpc } from "~/trpc/client";
import { Navbar } from "~/components/landing/Navbar";
import { Hero } from "~/components/landing/Hero";
import { Features } from "~/components/landing/Features";
import { Pricing } from "~/components/landing/Pricing";
import { Footer } from "~/components/landing/Footer";

const KernelPanicEasterEgg = () => {
  const [isPanicking, setIsPanicking] = useState(false);

  useEffect(() => {
    let sequence: string[] = [];
    const targetSequence = ["r", "m", "-", "r", "f"];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      sequence.push(e.key.toLowerCase());
      if (sequence.length > targetSequence.length) {
        sequence.shift();
      }

      if (sequence.join("") === targetSequence.join("")) {
        setIsPanicking(true);
        sequence = [];
        
        setTimeout(() => {
          setIsPanicking(false);
        }, 3500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isPanicking) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-red-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="animate-pulse flex flex-col items-center">
        <h1 className="text-white text-5xl md:text-7xl font-mono font-black tracking-tighter mb-4 text-center mix-blend-difference">
          [FATAL] ROOT DIRECTORY WIPED.
        </h1>
        <h2 className="text-red-200 text-3xl md:text-5xl font-mono font-bold tracking-widest text-center animate-bounce">
          KERNEL PANIC.
        </h2>
        <div className="mt-8 font-mono text-red-300 text-sm opacity-70">
          <p>Initiating memory dump...</p>
          <p>0x0000000000000000</p>
          <p>0xffffffffffffffff</p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: sessionData, isLoading: sessionLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 0,
  });

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-emerald-500/30 antialiased overflow-hidden font-sans">
      <KernelPanicEasterEgg />
      <Navbar
        sessionData={sessionData}
        sessionLoading={sessionLoading}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <Hero sessionData={sessionData} />

      <Features />

      <Pricing />

      <Footer />
    </main>
  );
}

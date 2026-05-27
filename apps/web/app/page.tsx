"use client";

import { useState } from "react";
import { trpc } from "~/trpc/client";
import { Navbar } from "~/components/landing/Navbar";
import { Hero } from "~/components/landing/Hero";
import { Features } from "~/components/landing/Features";
import { AdminGlimpseSection } from "~/components/landing/AdminGlimpseSection";
import { AnalyticsGlimpseSection } from "~/components/landing/AnalyticsGlimpseSection";
import { Pricing } from "~/components/landing/Pricing";
import { FAQSection } from "~/components/landing/FAQSection";
import { Footer } from "~/components/landing/Footer";
import { KernelPanicEasterEgg } from "~/components/landing/KernelPanicEasterEgg";

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
      <AdminGlimpseSection />
      <AnalyticsGlimpseSection />

      <Pricing />

      <FAQSection />
      <Footer />
    </main>
  );
}

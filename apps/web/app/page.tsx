import { Navbar } from "~/components/landing/Navbar";
import { Hero } from "~/components/landing/Hero";
import { LivePreviewSection } from "~/components/landing/LivePreviewSection";
import { Pricing } from "~/components/landing/Pricing";
import { Footer } from "~/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-zinc-800 selection:text-white font-sans antialiased">
      <Navbar />
      <div className="flex flex-col gap-8 md:gap-16 pb-16">
        <Hero />
        <LivePreviewSection />
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
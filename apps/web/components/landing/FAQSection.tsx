"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "What UI paradigms are supported?",
      answer: "Parcha95 supports fully modular theme morphing out of the box. You can seamlessly configure and switch your forms between Terminal/CLI, VS Code Editor, Windows 95, and standard high-converting SaaS form themes with a single mouse click.",
    },
    {
      question: "Are unlisted forms indexed?",
      answer: "Absolutely not. Unlisted forms are completely isolated from search engine crawlers with custom robots headers and security parameters, guaranteeing absolute privacy and secure data gathering for sensitive applications.",
    },
    {
      question: "Is there an API?",
      answer: "Yes! Parcha95 provides a comprehensive, developer-first REST API and type-safe tRPC queries and mutations. All endpoints are fully documented via a beautiful interactive Scalar interface for seamless and instantaneous backend integration.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#050505]">
      {/* Glow highlight */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[250px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Header Title */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 mt-3 text-base md:text-lg max-w-xl mx-auto">
            Everything you need to know about the developer-centric form paradigms.
          </p>
        </div>

        {/* Accordion Layout */}
        <div className="flex flex-col gap-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-[#0A0A0A] border rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen ? "border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.03)]" : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left text-white font-semibold text-base md:text-lg font-sans transition-colors cursor-pointer group"
                >
                  <span className={`group-hover:text-emerald-400 transition-colors ${isOpen ? "text-emerald-400" : ""}`}>
                    {item.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-zinc-500 transition-transform duration-300 flex-shrink-0 ml-4 group-hover:text-zinc-300 ${
                      isOpen ? "rotate-180 text-emerald-400!" : "rotate-0"
                    }`}
                  />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[200px] opacity-100 border-t border-zinc-800/40" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <p className="p-5 md:p-6 text-zinc-400 text-sm md:text-base leading-relaxed font-sans bg-[#0c0c0c]/40 select-text">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

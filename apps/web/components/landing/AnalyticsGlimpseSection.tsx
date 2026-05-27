"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";

interface Submission {
  id: string;
  email: string;
  rating: string;
  theme: string;
  time: string;
}

export const AnalyticsGlimpseSection = () => {
  const [totalResponses, setTotalResponses] = useState(12482);
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: "1", email: "john@developer.io", rating: "★★★★★", theme: "Terminal", time: "2s ago" },
    { id: "2", email: "sarah.c@cyberdyne.net", rating: "★★★★★", theme: "Windows 95", time: "1m ago" },
    { id: "3", email: "linus@linux.org", rating: "★★★★☆", theme: "Code Editor", time: "3m ago" },
    { id: "4", email: "ada.lovelace@charles.gb", rating: "★★★★★", theme: "Standard", time: "5m ago" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment total submissions
      setTotalResponses(prev => prev + 1);

      // Create a new mock submission
      const emails = [
        "woz@apple.co",
        "gates@microsoft.com",
        "guido@python.org",
        "dahl@deno.land",
        "eich@brendan.ie",
        "berners-lee@w3c.org",
        "torvalds@transmeta.com"
      ];
      
      const themes = ["Terminal", "Windows 95", "Code Editor", "Standard"];
      const ratings = ["★★★★★", "★★★★☆", "★★★★★", "★★★★★"];

      const randomEmail = emails[Math.floor(Math.random() * emails.length)] || "user@parcha95.co";
      const randomTheme = themes[Math.floor(Math.random() * themes.length)] || "Standard";
      const randomRating = ratings[Math.floor(Math.random() * ratings.length)] || "★★★★★";

      const newSubmission: Submission = {
        id: Date.now().toString(),
        email: randomEmail,
        theme: randomTheme,
        rating: randomRating,
        time: "Just now",
      };

      // Add to list and keep only the top 4
      setSubmissions(prev => [
        newSubmission,
        ...prev.map(sub => {
          if (sub.time === "Just now") return { ...sub, time: "2s ago" };
          if (sub.time === "2s ago") return { ...sub, time: "1m ago" };
          if (sub.time === "1m ago") return { ...sub, time: "3m ago" };
          return { ...sub, time: "5m ago" };
        }).slice(0, 3)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#050505]">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center md:text-left flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 w-fit mx-auto md:mx-0">
            <BarChart3 className="w-3.5 h-3.5" /> Response Analytics Hub
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white">
            Analytics Glimpse.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg">
            Track user behavior, review layout performance, and watch incoming submissions populate in a highly responsive layout.
          </p>
        </div>

        {/* Dashboard Frame Container */}
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* Browser Tab Header style */}
          <div className="bg-[#121212] border-b border-zinc-800 px-4 py-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-zinc-800" />
              <span className="w-3 h-3 rounded-full bg-zinc-800" />
              <span className="w-3 h-3 rounded-full bg-zinc-800" />
            </div>
            <span className="text-xs font-mono text-zinc-500 tracking-wider">
              parcha95.co/forms/live-responses/analytics
            </span>
            <div className="w-16" /> {/* Spacer */}
          </div>

          {/* Dashboard Inner Dashboard Content */}
          <div className="p-6 md:p-8 flex flex-col gap-6 select-text">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-[#0e0e0e] border border-zinc-800/80 p-5 rounded-lg flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Total Responses</span>
                  <span className="text-2xl font-bold text-white tracking-tight">{totalResponses.toLocaleString()}</span>
                </div>
                <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400 border border-blue-500/15">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0e0e0e] border border-zinc-800/80 p-5 rounded-lg flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Submission Rate</span>
                  <span className="text-2xl font-bold text-white tracking-tight">94.2%</span>
                </div>
                <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400 border border-emerald-500/15">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0e0e0e] border border-zinc-800/80 p-5 rounded-lg flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Avg. Fill Time</span>
                  <span className="text-2xl font-bold text-white tracking-tight">42s</span>
                </div>
                <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-400 border border-amber-500/15">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Neon Area Chart Mock */}
            <div className="bg-[#0e0e0e] border border-zinc-800/80 p-5 rounded-lg flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-mono">Submission Flow Volume</span>
                <span className="text-xs text-zinc-500 font-mono">Filter: Last 30 Days</span>
              </div>
              
              <div className="w-full h-32 md:h-40 relative mt-2">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="5" x2="100" y2="5" stroke="#1f1f2e" strokeWidth="0.1" />
                  <line x1="0" y1="15" x2="100" y2="15" stroke="#1f1f2e" strokeWidth="0.1" />
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#1f1f2e" strokeWidth="0.1" />

                  {/* Filled Area */}
                  <path 
                    d="M 0 30 Q 15 12 30 20 T 60 8 T 90 14 T 100 5 L 100 30 Z" 
                    fill="url(#chartGlow)" 
                  />

                  {/* Glowing Stroke Line */}
                  <path 
                    d="M 0 30 Q 15 12 30 20 T 60 8 T 90 14 T 100 5" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="0.45"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  />
                </svg>
              </div>
            </div>

            {/* Table: Recent Submissions */}
            <div className="bg-[#0e0e0e] border border-zinc-800/80 p-5 rounded-lg flex flex-col gap-4">
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-mono">
                Recent Submissions Feed
              </div>
              
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs md:text-sm font-sans">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider pb-2 select-none">
                      <th className="py-2.5 font-medium">Respondent Email</th>
                      <th className="py-2.5 font-medium hidden sm:table-cell">Aesthetic Rating</th>
                      <th className="py-2.5 font-medium">Theme Selected</th>
                      <th className="py-2.5 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-zinc-900/30 transition-colors animate-fade-in">
                        <td className="py-3 font-medium text-white font-mono">{sub.email}</td>
                        <td className="py-3 text-amber-400 tracking-wider hidden sm:table-cell">{sub.rating}</td>
                        <td className="py-3 text-zinc-400 font-mono">{sub.theme}</td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/20 select-none">
                            <CheckCircle className="w-3 h-3" />
                            Success
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

"use client";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

export const AdminGlimpseSection = () => {
  const [cpu, setCpu] = useState(12.4);
  const [reqs, setReqs] = useState(142);
  const [users, setUsers] = useState(1024);
  const [logs, setLogs] = useState([
    "User signup: ankit@parcha95.co ... SUCCESS",
    "Form response submitted (slug: survey-95) ... SUCCESS",
    "Webhook triggered to Zapier ... SUCCESS",
    "Redis cache synced segment 0xF2A ... SUCCESS",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuations
      setCpu(parseFloat((8 + Math.random() * 12).toFixed(1)));
      setReqs(Math.floor(120 + Math.random() * 45));
      
      // Randomly increment users occasionally
      if (Math.random() > 0.8) {
        setUsers(prev => prev + 1);
      }

      // Add a random log
      const logOptions = [
        "Form response submitted (slug: feedback-survey) ... SUCCESS",
        "API call: GET /api/v1/forms ... SUCCESS (200 OK)",
        "Drizzle transaction completed ... SUCCESS",
        "TRPC query auth.me ... SUCCESS",
        "Webhook triggered to Discord ... SUCCESS",
        "Redis rate limiter cleared IP segment ... SUCCESS",
        "Honeypot protection caught mock bot entry ... TRAPPED",
      ];

      const newLog = logOptions[Math.floor(Math.random() * logOptions.length)] || "";
      setLogs(prev => [...prev.slice(1), newLog]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // CPU and memory bar visual representation
  const cpuPercent = Math.min(Math.floor((cpu / 30) * 100), 100);
  const cpuBlocks = Math.floor(cpuPercent / 10);
  const cpuBar = "█".repeat(cpuBlocks) + "░".repeat(10 - cpuBlocks);

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#020202]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center md:text-left flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 w-fit mx-auto md:mx-0">
            <Terminal className="w-3.5 h-3.5" /> Admin Telemetry Control
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white">
            Command Center.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg">
            Monitor submission pipelines, webhook delivery statuses, and Redis caching rates in real-time with zero overhead.
          </p>
        </div>

        {/* Console Box container */}
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* Header OS style dots */}
          <div className="bg-[#121212] border-b border-zinc-800 px-4 py-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-zinc-500 tracking-wider">
              parcha95_telemetry_hub.sh
            </span>
            <span className="text-xs font-mono text-emerald-500/70 animate-pulse">
              ● LIVE
            </span>
          </div>

          {/* Console inner details */}
          <div className="p-6 md:p-8 font-mono text-emerald-500 text-xs md:text-sm leading-relaxed overflow-x-auto select-text selection:bg-emerald-500/20">
            <pre className="text-emerald-400">
{`┌──────────────────────────────────────────────────────────────────────────────┐
│  PARCHA CORE SYSTEM LIVE TELEMETRY v9.52                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│  [SYS.STATUS]: NOMINAL                        [SYS.TIME]: 2026-05-27T12:22:00 │
│  [ACTIVE_WS]: 256                             [SYS.UPTIME]: 14d 6h 12m        │
└──────────────────────────────────────────────────────────────────────────────┘`}
            </pre>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-b border-emerald-950 pb-4 text-emerald-500/90">
              <div className="flex flex-col gap-1.5">
                <div>[SYS.LOAD]:    [{cpuBar}] {cpu}%</div>
                <div>[REDIS_MEM]:   [███████░░░] 24.5 MB / 64 MB</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div>[SYS.USERS]:   {users.toLocaleString()} registered</div>
                <div>[API.SPEED]:   {reqs} req/sec (ERR RATE: 0.02%)</div>
              </div>
            </div>

            {/* Live Logs Feed */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider select-none">
                [LIVE SYSTEM AUDIT LOGGER]:
              </div>
              <div className="flex flex-col gap-1 text-emerald-500/85">
                {logs.map((log, index) => (
                  <div key={index} className="truncate">
                    <span className="text-emerald-600 select-none">&gt; </span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};

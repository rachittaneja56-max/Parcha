"use client";

import { motion } from "framer-motion";
import { Zap, Lock, BarChart3 } from "lucide-react";

export function BuilderGlimpse() {
  return (
    <div className="w-full bg-[#050505] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* Header */}
      <div className="bg-[#0A0A0A] border-b border-zinc-800/80 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
        </div>
        <div className="text-xs font-mono text-zinc-500">Form Builder</div>
        <div className="w-12"></div>
      </div>
      
      <div className="flex h-[450px]">
        {/* Left Sidebar: BLOCKS */}
        <div className="w-56 border-r border-zinc-800/80 bg-[#0A0A0A] p-5 flex flex-col gap-4 hidden md:flex">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Blocks</div>
          
          <div className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-400 flex items-center gap-3 shadow-sm hover:border-zinc-700 transition-colors cursor-pointer">
            <span className="w-6 h-6 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded text-xs">T</span> 
            <span>Short Text</span>
          </div>
          <div className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-400 flex items-center gap-3 shadow-sm hover:border-zinc-700 transition-colors cursor-pointer">
            <span className="w-6 h-6 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded text-xs">=</span> 
            <span>Long Text</span>
          </div>
          <div className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-400 flex items-center gap-3 shadow-sm hover:border-zinc-700 transition-colors cursor-pointer">
            <span className="w-6 h-6 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded text-xs">@</span> 
            <span>Email</span>
          </div>
          <div className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-400 flex items-center gap-3 shadow-sm hover:border-zinc-700 transition-colors cursor-pointer">
            <span className="w-6 h-6 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded text-xs">✓</span> 
            <span>Multiple Choice</span>
          </div>
        </div>
        
        {/* Center Canvas */}
        <div className="flex-1 bg-[#050505] p-10 relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-lg mx-auto bg-[#0a0a0a] border border-emerald-900/50 rounded-xl p-8 relative z-10">
            <div className="absolute -left-[1px] -top-3 bg-emerald-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-sm">Active Field</div>
            <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">Developer Handle</h3>
            <p className="text-zinc-500 text-sm mb-5">Please input your handle</p>
            <div className="w-full h-11 bg-[#050505] border border-zinc-800 rounded-lg"></div>
          </div>
          
          <div className="max-w-lg mx-auto bg-[#0a0a0a] border border-zinc-800/60 rounded-xl p-8 mt-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Choose Environment</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="w-full h-11 bg-[#050505] border border-zinc-800/80 rounded-lg"></div>
              <div className="w-full h-11 bg-[#050505] border border-zinc-800/80 rounded-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar: FIELD PROPERTIES */}
        <div className="w-72 border-l border-zinc-800/80 bg-[#0A0A0A] p-6 hidden lg:flex flex-col gap-6">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Field Properties</div>
          
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-medium">Label</label>
            <div className="w-full bg-[#050505] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 flex items-center">Developer Handle</div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-medium">Required</label>
            <div className="flex items-center gap-3">
              <div className="w-9 h-5 bg-emerald-500 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <div className="w-3.5 h-3.5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
              </div>
              <span className="text-sm text-zinc-300">Yes</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-medium">Validation (Zod)</label>
            <div className="w-full bg-[#050505] border border-zinc-800 rounded-lg p-2.5 text-sm text-emerald-400 font-mono">z.string().min(3)</div>
          </div>
        </div>
      </div>
    </div>
  );
}



export function Features() {
  return (
    <section id="features" className="py-16 px-6 bg-[#050505] border-t border-zinc-900 relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 md:text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
            Engineered for speed.<br className="hidden md:block" /> Crafted for growth.
          </h2>
          <p className="text-zinc-400 text-lg">
            High performance capabilities wrapped in a strictly optimized theme ecosystem. Build fast, analyze deep.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <BuilderGlimpse />
          </motion.div>



          {/* Mini Features Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
            <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-2xl p-8 hover:border-zinc-700 transition-colors flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute top-8 right-8 text-emerald-500 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div className="z-10">
                <h3 className="text-lg font-bold text-white mb-2">Lightning Fast Performance</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Forms load instantly globally via edge networks, ensuring minimal drop-offs.
                </p>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-2xl p-8 hover:border-zinc-700 transition-colors flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute top-8 right-8 text-emerald-500 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <div className="z-10">
                <h3 className="text-lg font-bold text-white mb-2">Zero-Trust Privacy</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Advanced encryption hashes and secure payload transmissions protect your data.
                </p>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-zinc-800/50 rounded-2xl p-8 hover:border-zinc-700 transition-colors flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute top-8 right-8 text-emerald-500 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="z-10">
                <h3 className="text-lg font-bold text-white mb-2">Seamless Integrations</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Export to CSV instantly or pipe data to external webhooks in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

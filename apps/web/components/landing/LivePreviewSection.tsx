import { TerminalFormPreview } from "~/components/landing/TerminalFormPreview";

export function LivePreviewSection() {
  return (
    <section className="py-6 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-start text-left">
            <div className="inline-block border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-500 mb-6 backdrop-blur-sm rounded-sm font-mono tracking-wider">
              [ Theme: Terminal_Classic ]
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 font-sans">
              Forms in live preview.
            </h2>
            
            <p className="text-lg text-zinc-400 leading-relaxed font-sans max-w-lg">
              Deploy forms that developers love to fill. Our CLI theme maps native terminal inputs directly to your type-safe database.
            </p>
          </div>

          <div className="relative w-full max-w-lg mx-auto lg:mx-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-lg blur opacity-50"></div>
            
            <div className="relative rounded-sm border border-zinc-800/50 bg-zinc-900/20 p-2 sm:p-4 backdrop-blur-sm">
              <TerminalFormPreview />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

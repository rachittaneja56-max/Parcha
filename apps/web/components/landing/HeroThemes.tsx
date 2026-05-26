"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface HeroThemeProps {
  handle: string;
  setHandle: (val: string) => void;
  env: "prod" | "stage";
  setEnv: (val: "prod" | "stage") => void;
  submitting: boolean;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  resetMockForm: () => void;
}

export function HeroTerminalTheme({ handle, setHandle, env, setEnv, submitting, submitted, handleSubmit, resetMockForm }: HeroThemeProps) {
  return (
    <>
      <div className="bg-[#111] px-4 py-3 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>
        <div className="text-xs font-mono text-zinc-500 tracking-wider">~/parcha95/demo.sh</div>
        <div className="w-14" />
      </div>

      <form onSubmit={handleSubmit} className="font-mono p-8 space-y-6 text-left">
        {submitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-6">
            <div className="text-emerald-400 font-bold text-sm">{`[SUCCESS] 201 CREATED`}</div>
            <div className="text-zinc-400 text-xs leading-relaxed space-y-1">
              <p className="text-emerald-300/80">{`+ synced handle: "${handle}"`}</p>
              <p className="text-emerald-300/80">{`+ environment: "${env.toUpperCase()}"`}</p>
              <p className="text-emerald-300/80">{`+ ping time: 14ms`}</p>
            </div>
            <div className="pt-4 border-t border-emerald-950/40">
              <p className="text-zinc-500 text-xs">{`Press button below to simulate again:`}</p>
              <button 
                type="button"
                onClick={resetMockForm}
                className="bg-emerald-950/20 border border-emerald-900/50 hover:bg-emerald-950/40 text-emerald-400 px-3 py-1.5 rounded mt-3 text-xs transition-colors"
              >
                {`$ re-run demo`}
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <div>
              <label className="block text-emerald-500 text-sm font-semibold tracking-wide">
                {`> ENTER DEVELOPER HANDLE *`}
              </label>
              <div className="relative mt-2 border-b border-emerald-900/50 focus-within:border-emerald-500 transition-colors pb-2">
                <div className="flex items-center text-emerald-200 text-sm">
                  <span className="text-emerald-500/50 mr-2 select-none">{`$`}</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="bg-transparent border-none outline-none font-mono text-emerald-200 w-full placeholder-emerald-900/40"
                    placeholder="rachit"
                    required
                    autoComplete="off"
                  />
                  {handle.length === 0 && (
                    <span className="w-1.5 h-4 bg-emerald-500 animate-pulse ml-0.5" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="block text-emerald-500 text-sm font-semibold tracking-wide">
                {`> CHOOSE ENVIRONMENT`}
              </span>
              <div className="flex items-center gap-6 mt-2 text-sm">
                <button
                  type="button"
                  onClick={() => setEnv("prod")}
                  className={`flex items-center gap-2 font-mono transition-colors focus:outline-none ${
                    env === "prod" ? "text-emerald-400 font-bold" : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  <span>{env === "prod" ? "[x]" : "[ ]"}</span> Production
                </button>
                <button
                  type="button"
                  onClick={() => setEnv("stage")}
                  className={`flex items-center gap-2 font-mono transition-colors focus:outline-none ${
                    env === "stage" ? "text-emerald-400 font-bold" : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  <span>{env === "stage" ? "[x]" : "[ ]"}</span> Staging
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-950/30 border border-emerald-900 text-emerald-400 px-6 py-2.5 rounded font-mono text-xs tracking-wider font-bold transition-all hover:bg-emerald-900/20 hover:text-emerald-300 disabled:opacity-50 cursor-pointer w-full text-center flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    {`SYNCING_RECORDS...`}
                  </>
                ) : (
                  <>
                    {`[SUBMIT_REQUEST]`} <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}

export function HeroCodeEditorTheme({ handle, setHandle, env, setEnv, submitting, submitted, handleSubmit, resetMockForm }: HeroThemeProps) {
  return (
    <>
      <div className="bg-[#2d2d2d] h-[35px] border-b border-[#1e1e1e] flex items-center justify-between px-3 text-xs text-[#a3a3a3] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#007acc] text-sm">⎋</span>
          <span className="truncate text-[11px] text-zinc-300">survey.ts - Visual Studio Code</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] text-zinc-500">v1.95</span>
        </div>
      </div>

      <div className="flex flex-1 min-h-[300px]">
        <div className="w-[45px] bg-[#333333] border-r border-[#191919] flex flex-col items-center py-4 gap-4 text-sm text-[#858585] select-none">
          <div className="text-white hover:text-white cursor-pointer">📂</div>
          <div className="hover:text-white cursor-pointer">🔍</div>
          <div className="hover:text-white cursor-pointer">🌿</div>
          <div className="hover:text-white cursor-pointer">🐞</div>
          <div className="hover:text-white cursor-pointer">🧩</div>
        </div>

        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="h-[30px] bg-[#2d2d2d] border-b border-[#191919] flex items-center select-none">
            <div className="bg-[#1e1e1e] px-4 py-1.5 text-[11px] text-white border-t-2 border-t-[#007acc] border-r border-[#252526] flex items-center gap-2 font-mono shrink-0">
              <span className="text-[#519aba]">ts</span>
              <span>survey.ts</span>
              <span className="text-[9px] text-[#858585]">●</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 font-mono text-[12px] leading-relaxed text-[#dcdcdc] space-y-4 text-left flex-1 flex flex-col justify-between">
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 py-4">
                <div className="text-[#6a9955]">{`/**`}</div>
                <div className="text-[#6a9955]">{` * STATUS: SUCCESS`}</div>
                <div className="text-[#6a9955]">{` * Response compiled and synced.`}</div>
                <div className="text-[#6a9955]">{` */`}</div>
                <div className="text-[#c586c0]">export const <span className="text-[#4fc1ff]">result</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#569cd6]">true</span>;</div>
                
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={resetMockForm}
                    className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-3 py-1.5 text-[11px] rounded transition-colors"
                  >
                    Restart Debugging (⇧⌘F5)
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center group">
                    <span className="w-8 text-[#858585] text-right pr-4 select-none shrink-0">1</span>
                    <span className="text-[#c586c0]">const</span>
                    <span className="text-[#4fc1ff] ml-2">developerHandle</span>
                    <span className="text-[#d4d4d4] ml-2">:</span>
                    <span className="text-[#4ec9b0] ml-2">string</span>
                    <span className="text-[#d4d4d4] ml-2">=</span>
                    <span className="text-[#ce9178] ml-2">"</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#98c379] caret-white p-0 m-0 w-32 focus:ring-0 text-[12px] font-mono h-auto"
                      placeholder="rachit"
                      required
                      autoComplete="off"
                    />
                    <span className="text-[#ce9178]">&quot;</span>
                    <span className="text-[#d4d4d4]">;</span>
                  </div>

                  <div className="flex items-center group">
                    <span className="w-8 text-[#858585] text-right pr-4 select-none shrink-0">2</span>
                  </div>

                  <div className="flex items-center group">
                    <span className="w-8 text-[#858585] text-right pr-4 select-none shrink-0">3</span>
                    <span className="text-[#c586c0]">const</span>
                    <span className="text-[#4fc1ff] ml-2">targetEnv</span>
                    <span className="text-[#d4d4d4] ml-2">=</span>
                    <div className="ml-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEnv("prod")}
                        className={`hover:bg-[#2a2d2e] px-1.5 py-0.5 rounded focus:outline-none transition-colors ${
                          env === "prod" ? "bg-[#2a2d2e]" : ""
                        }`}
                      >
                        <span className="text-[#ce9178]">&quot;prod&quot;</span>
                      </button>
                      <span className="text-[#d4d4d4]">|</span>
                      <button
                        type="button"
                        onClick={() => setEnv("stage")}
                        className={`hover:bg-[#2a2d2e] px-1.5 py-0.5 rounded focus:outline-none transition-colors ${
                          env === "stage" ? "bg-[#2a2d2e]" : ""
                        }`}
                      >
                        <span className="text-[#ce9178]">&quot;stage&quot;</span>
                      </button>
                      <span className="text-[#d4d4d4]">;</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex items-center group">
                    <span className="w-8 text-[#858585] text-right pr-4 select-none shrink-0">4</span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-3 py-1.5 text-[11px] rounded transition-colors disabled:opacity-50 flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-[#007fd4]"
                    >
                      {submitting ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Compiling...
                        </>
                      ) : (
                        "▶ Run Build (⌘B)"
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export function HeroStandardTheme({ handle, setHandle, env, setEnv, submitting, submitted, handleSubmit, resetMockForm }: HeroThemeProps) {
  return (
    <>
      <div className="bg-[#0D1321] px-4 py-3 flex items-center border-b border-zinc-800/80">
        <div className="flex gap-1.5 mr-4 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <div className="bg-[#1A2333] rounded-md px-3 py-1 flex items-center justify-between text-[10px] text-zinc-500 font-sans w-full select-none">
          <span className="truncate">localhost:3000/survey/dev-feedback</span>
          <span className="text-zinc-600">🔒</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="font-sans p-8 space-y-6 text-left">
        {submitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">Response Submitted</h4>
            <p className="text-zinc-400 text-xs max-w-xs mx-auto leading-relaxed">
              Your developer handle and environment choice have been saved to Parcha95.
            </p>
            <button
              type="button"
              onClick={resetMockForm}
              className="bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-200 text-xs px-4 py-2 rounded-lg mt-2 font-medium transition-colors cursor-pointer"
            >
              Submit another response
            </button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-white tracking-tight">Developer Onboarding</h3>
              <p className="text-zinc-500 text-xs leading-normal">Please input your handle and stage config.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Developer Handle <span className="text-emerald-500">*</span>
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-[#0D1321] border border-zinc-800 focus:border-emerald-500 rounded-lg p-3 text-sm text-white transition-all outline-none"
                placeholder="rachit"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Choose Environment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEnv("prod")}
                  className={`py-2.5 rounded-lg border text-xs font-semibold font-mono tracking-wider transition-all focus:outline-none ${
                    env === "prod"
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                      : "bg-[#0D1321] border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  PRODUCTION
                </button>
                <button
                  type="button"
                  onClick={() => setEnv("stage")}
                  className={`py-2.5 rounded-lg border text-xs font-semibold font-mono tracking-wider transition-all focus:outline-none ${
                    env === "stage"
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                      : "bg-[#0D1321] border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  STAGING
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-semibold rounded-lg py-3 text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saving response...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Survey</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}

export function HeroWindows95Theme({ handle, setHandle, env, setEnv, submitting, submitted, handleSubmit, resetMockForm }: HeroThemeProps) {
  return (
    <>
      <div className="bg-[#000080] p-1 flex justify-between items-center select-none font-sans border border-t-white border-l-white border-r-[#808080] border-b-[#808080]">
        <div className="flex items-center gap-1.5 pl-1">
          <span className="text-[11px] text-white font-bold tracking-wide">Parcha95 Wizard</span>
        </div>
        <button 
          type="button"
          onClick={resetMockForm}
          className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-black font-bold text-[9px] flex items-center justify-center focus:outline-none font-sans"
        >
          X
        </button>
      </div>

      <form onSubmit={handleSubmit} className="font-mono p-6 space-y-5 text-left bg-[#c0c0c0] border-2 border-white select-none text-black">
        {submitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-2">
            <div className="bg-[#808080]/10 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-4 font-mono text-xs leading-relaxed space-y-2">
              <p className="font-bold text-black">{`[ SUCCESS: RESPONSE_SYNCED ]`}</p>
              <p className="text-zinc-700">{`* Handle: ${handle}`}</p>
              <p className="text-zinc-700">{`* Config: ${env.toUpperCase()}`}</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={resetMockForm}
                className="bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white px-5 py-1 text-xs font-bold focus:outline-none"
              >
                OK
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="border border-t-black border-l-black border-r-white border-b-white p-3 space-y-1 bg-[#dcdcdc]/40">
              <p className="text-[11px] font-bold text-black">{`Wizard Session: Setup Survey`}</p>
              <p className="text-[10px] text-zinc-600 font-sans">{`Please enter required developer fields.`}</p>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-black">
                {`Enter Developer Handle (*):`}
              </label>
              <div className="bg-white border-2 border-t-zinc-800 border-l-zinc-800 border-r-white border-b-white p-1">
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="bg-transparent border-none outline-none font-mono text-xs text-black w-full"
                  placeholder="rachit"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-black">
                {`Choose Target Environment:`}
              </label>
              <div className="flex gap-6 pl-1">
                <button
                  type="button"
                  onClick={() => setEnv("prod")}
                  className="flex items-center gap-2 focus:outline-none text-[11px] font-bold text-black"
                >
                  <span className="w-4 h-4 bg-white border-2 border-t-zinc-800 border-l-zinc-800 border-r-white border-b-white flex items-center justify-center font-bold text-[9px] text-black select-none">
                    {env === "prod" && "■"}
                  </span>
                  Production
                </button>
                <button
                  type="button"
                  onClick={() => setEnv("stage")}
                  className="flex items-center gap-2 focus:outline-none text-[11px] font-bold text-black"
                >
                  <span className="w-4 h-4 bg-white border-2 border-t-zinc-800 border-l-zinc-800 border-r-white border-b-white flex items-center justify-center font-bold text-[9px] text-black select-none">
                    {env === "stage" && "■"}
                  </span>
                  Staging
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-500 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setHandle("")}
                className="bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white px-4 py-1 text-xs font-bold focus:outline-none"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white px-5 py-1 text-xs font-bold focus:outline-none disabled:opacity-50"
              >
                {submitting ? "Wait..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}

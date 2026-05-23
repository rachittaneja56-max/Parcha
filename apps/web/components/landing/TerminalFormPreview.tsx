"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

export function TerminalFormPreview() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 0) {
      emailInputRef.current?.focus();
    } else if (step === 1) {
      roleInputRef.current?.focus();
    }
  }, [step]);

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && email.trim() !== "") {
      setStep(1);
    }
  };

  const handleRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && role.trim() !== "") {
      setStep(2);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0a0a0a] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden font-mono text-[13px] leading-relaxed relative">
      <div className="flex items-center px-4 h-10 border-b border-zinc-800/50 bg-zinc-900/30 select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <div className="flex-1 text-center text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
          Terminal_Classic
        </div>
        <div className="w-10"></div> 
      </div>

      <div 
        className="p-6 h-[280px] overflow-y-auto text-zinc-300"
        onClick={() => {
          if (step === 0) emailInputRef.current?.focus();
          else if (step === 1) roleInputRef.current?.focus();
        }}
      >
        <AnimatePresence>
          {(step >= 0) && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex flex-wrap"
            >
              <span className="text-green-500 mr-2 whitespace-pre">&gt;</span>
              <span className="text-zinc-400 mr-2">Enter your email:</span>
              {step === 0 ? (
                <div className="relative flex-1 min-w-[150px]">
                  <input
                    ref={emailInputRef}
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleEmailKeyDown}
                    className="bg-transparent border-none outline-none text-zinc-100 w-full"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {!email && (
                    <span className="absolute left-0 top-0 bottom-0 w-2 h-4 bg-zinc-400 animate-pulse my-auto ml-[1px]"></span>
                  )}
                </div>
              ) : (
                <span className="text-zinc-100">{email}</span>
              )}
            </motion.div>
          )}

          {(step >= 1) && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex flex-wrap"
            >
              <span className="text-green-500 mr-2 whitespace-pre">&gt;</span>
              <span className="text-zinc-400 mr-2">What is your role?</span>
              {step === 1 ? (
                <div className="relative flex-1 min-w-[150px]">
                  <input
                    ref={roleInputRef}
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onKeyDown={handleRoleKeyDown}
                    className="bg-transparent border-none outline-none text-zinc-100 w-full"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {!role && (
                    <span className="absolute left-0 top-0 bottom-0 w-2 h-4 bg-zinc-400 animate-pulse my-auto ml-[1px]"></span>
                  )}
                </div>
              ) : (
                <span className="text-zinc-100">{role}</span>
              )}
            </motion.div>
          )}

          {(step >= 2) && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-green-400 font-semibold"
            >
              [SUCCESS] Form submitted. Data mapped to fld_8a92.
              <div 
                className="mt-4 text-zinc-600 font-normal cursor-pointer hover:text-zinc-400 inline-block transition-colors" 
                onClick={(e) => {
                  e.stopPropagation();
                  setStep(0);
                  setEmail("");
                  setRole("");
                }}
              >
                &gt; Restart sequence
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

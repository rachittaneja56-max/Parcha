"use client";

import { useState, useEffect, useRef } from "react";
import { TerminalSquare } from "lucide-react";
import type { SchemaField } from "./constants";

type AnswerState = Record<string, string>;

function TerminalContent({
  schema,
  formName,
}: {
  schema: SchemaField[];
  formName: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [currentInput, setCurrentInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnswers((prev) => {
      const next = { ...prev };
      for (const key in next) {
        if (!schema.find((f) => f.id === key)) {
          delete next[key];
        }
      }
      return next;
    });
  }, [schema]);

  useEffect(() => {
    if (schema.length === 0) {
      setCurrentIndex(0);
      setAnswers({});
      setCurrentInput("");
      setErrorMsg("");
    } else if (currentIndex > schema.length) {
      setCurrentIndex(schema.length);
    }
  }, [schema, currentIndex]);

  // Scroll to bottom whenever new lines are added or input changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [schema, answers, currentInput, currentIndex, errorMsg]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, active: SchemaField | null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      if (!active) {
        // If finished, pressing enter resets the simulator
        setCurrentIndex(0);
        setAnswers({});
        setCurrentInput("");
        setErrorMsg("");
        return;
      }

      const val = currentInput.trim();
      if (!val && active.required) {
        setErrorMsg("This field is required.");
        return;
      }
      
      if (val) {
        if (active.type === "email") {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            setErrorMsg("Invalid email format.");
            return;
          }
        }
        
        if (active.type === "date") {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            setErrorMsg("Use YYYY-MM-DD format.");
            return;
          }
        }

        if (active.type === "single_select") {
          const num = parseInt(val, 10);
          if (isNaN(num) || num < 1 || num > (active.options?.length || 0)) {
            setErrorMsg(`Enter a valid option number (1-${active.options?.length || 0}).`);
            return;
          }
        }

        if (active.type === "multiple_choice") {
          const parts = val.split(",").map(s => s.trim());
          const max = active.options?.length || 0;
          const isValid = parts.every(p => {
            const num = parseInt(p, 10);
            return !isNaN(num) && num >= 1 && num <= max;
          });
          if (!isValid) {
            setErrorMsg(`Enter comma-separated valid numbers (e.g. 1,3).`);
            return;
          }
        }
      }

      setErrorMsg("");
      setAnswers((prev) => ({ ...prev, [active.id]: val }));
      setCurrentInput("");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (schema.length === 0) {
    return (
      <div 
        className="flex flex-col gap-0.5 p-4 font-mono text-xs leading-relaxed select-none bg-[#050B14] h-full"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="mb-4 text-slate-500/60 border-b border-[#0f1b2d] pb-2">
          <p className="text-emerald-400 font-mono font-bold tracking-wide">PARCHA TERMINAL SIMULATOR v1.0.0</p>
          <p className="text-slate-500 text-[10px] font-mono">Simulate and test your form interaction in real-time.</p>
        </div>
        <p className="text-slate-400">
          <span className="text-emerald-400 font-bold">parcha</span>
          <span className="text-slate-500">@simulator</span>
          <span className="text-slate-600"> ~ $ </span>
          <span className="text-slate-200">parcha preview &quot;{formName || "Untitled Form"}&quot;</span>
        </p>
        <p className="text-slate-500/70 mt-2">  Waiting for fields to be added in the builder...</p>
      </div>
    );
  }

  const lines: React.ReactNode[] = [];
  
  lines.push(
    <div key="system-intro" className="mb-4 text-slate-500/60 border-b border-[#0f1b2d] pb-2 select-none">
      <p className="text-emerald-400 font-mono font-bold tracking-wide">PARCHA TERMINAL SIMULATOR v1.0.0</p>
      <p className="text-slate-500 text-[10px] font-mono">Simulate and test your form interaction in real-time.</p>
    </div>
  );

  lines.push(
    <p key="cmd" className="text-slate-400 font-mono text-xs select-none">
      <span className="text-emerald-400 font-bold">parcha</span>
      <span className="text-slate-500">@simulator</span>
      <span className="text-slate-600"> ~ $ </span>
      <span className="text-slate-200">parcha preview &quot;{formName || "Untitled Form"}&quot;</span>
    </p>
  );
  
  lines.push(
    <p key="success" className="text-emerald-400/80 mb-3 font-mono text-xs select-none">
      {`  ✓ Loaded ${schema.length} interactive field${schema.length !== 1 ? "s" : ""}`}
    </p>
  );

  schema.forEach((field, index) => {
    const isPast = index < currentIndex;
    const isActive = index === currentIndex;
    const isFuture = index > currentIndex;

    if (isPast) {
      lines.push(
        <div key={`past-${field.id}`} className="text-slate-400 mt-1 pl-2 border-l border-slate-800/40 font-mono text-xs select-none">
          <p>{`> ${field.prompt} [ ${answers[field.id] !== undefined ? answers[field.id] : ""} ]`}</p>
        </div>
      );
    } else if (isActive) {
      lines.push(
        <div key={`active-${field.id}`} className="text-slate-200 mt-2 font-bold pl-2 border-l-2 border-emerald-500 font-mono text-xs select-none">
          <p className="text-slate-100">{`> ${field.prompt}${field.required ? " *" : ""}`}</p>
          {(field.type === "single_select" || field.type === "multiple_choice") && field.options && (
            <div className="my-1.5 pl-4 flex flex-col gap-0.5 text-slate-400 font-medium font-mono text-xs">
              {field.options.map((opt, optIdx) => (
                <p key={`opt-${field.id}-${optIdx}`}>
                  {`  [${optIdx + 1}] ${opt}`}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    } else if (isFuture) {
      lines.push(
        <div key={`future-${field.id}`} className="text-slate-700/40 mt-1 pl-2 border-l border-transparent font-mono text-xs select-none">
          <p>{`> ${field.prompt}`}</p>
        </div>
      );
    }
  });

  const activeField = currentIndex < schema.length ? (schema[currentIndex] ?? null) : null;

  const getActiveInputLabel = (field: SchemaField) => {
    if (field.type === "single_select") {
      return "Select an option";
    }
    if (field.type === "multiple_choice") {
      return "Select option(s)";
    }
    if (field.type === "date") {
      return "Enter date (YYYY-MM-DD)";
    }
    if (field.type === "email") {
      return "Enter email address";
    }
    return "Enter response";
  };

  if (activeField) {
    const label = getActiveInputLabel(activeField);
    lines.push(
      <div key="active-input-line" className="mt-2 pl-2 flex items-center text-emerald-400 font-bold font-mono text-xs">
        <span>{`> ${label}: [ `}</span>
        <span className="text-slate-100 font-mono font-normal tracking-wide whitespace-pre-wrap">
          {currentInput}
        </span>
        <span className="text-emerald-400 animate-pulse font-bold">█</span>
        <span className="text-emerald-400">{" ]"}</span>
      </div>
    );
  }

  if (errorMsg) {
    lines.push(
      <p key="error-message" className="text-rose-500 text-xs font-mono font-bold pl-2 mt-1 select-none">
        {`[!] ${errorMsg}`}
      </p>
    );
  }

  const isFinished = currentIndex >= schema.length && schema.length > 0;
  if (isFinished) {
    lines.push(
      <div key="finished-block" className="mt-4 p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-lg text-emerald-400 pl-4 font-bold font-mono text-xs flex flex-col gap-1 select-none">
        <p>✓ Form completed successfully!</p>
        <p className="text-slate-500 text-[10px] font-normal font-mono">Press Enter to restart the simulator session.</p>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex flex-col gap-0.5 p-4 font-mono text-xs leading-relaxed h-full overflow-y-auto bg-[#050B14]"
      onClick={() => inputRef.current?.focus()}
    >
      {lines}
      
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute w-0 h-0 pointer-events-none"
        value={currentInput}
        onChange={(e) => {
          setCurrentInput(e.target.value);
          if (errorMsg) setErrorMsg("");
        }}
        onKeyDown={(e) => handleKeyDown(e, activeField)}
        autoFocus
      />
    </div>
  );
}

export function ResizableTerminal({
  schema,
  formName,
}: {
  schema: SchemaField[];
  formName: string;
}) {
  return (
    <div className="h-full flex flex-col bg-[#050B14] overflow-hidden w-full">
      <div className="flex items-center justify-between border-b border-[#0f1b2d] px-4 py-2 shrink-0 bg-[#050B14] select-none">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400/80 font-bold">
            Interactive Simulator
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-wider font-semibold">simulating</span>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-[#050B14]">
        <TerminalContent schema={schema} formName={formName} />
      </div>
    </div>
  );
}

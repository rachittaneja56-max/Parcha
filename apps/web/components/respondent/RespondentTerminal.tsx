"use client";

import { useState, useEffect, useRef } from "react";
import { trpc } from "~/trpc/client";
import { useRouter } from "next/navigation";
import type { SchemaField } from "../builder/constants";
import fpPromise from "@fingerprintjs/fingerprintjs";

type AnswerState = Record<string, string>;

export function RespondentTerminal({ formId }: { formId: string }) {
  const router = useRouter();
  
  const [bootPhase, setBootPhase] = useState<
    "fetching" | "security_checks" | "password_prompt" | "booting" | "live" | "submitting" | "done"
  >("fetching");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [currentInput, setCurrentInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [visitorId, setVisitorId] = useState<string>("");
  const [honeypot, setHoneypot] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [lines, setLines] = useState<React.ReactNode[]>([]);
  
  const { data: formConfig, error: formError, isLoading } = trpc.form.getPublicForm.useQuery(
    { formIdOrSlug: formId },
    { retry: false }
  );

  const { data: sessionData, isLoading: sessionLoading } = trpc.auth.me.useQuery(undefined, { retry: false });
  
  const submitMutation = trpc.response.submit.useMutation();
  const trackViewMutation = trpc.response.trackView.useMutation();

  const addLine = (content: React.ReactNode) => {
    setLines((prev) => [...prev, content]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, currentInput, errorMsg, bootPhase, currentIndex, answers]);

  useEffect(() => {
    const initFingerprint = async () => {
      const fp = await fpPromise.load();
      const result = await fp.get();
      setVisitorId(result.visitorId);
    };
    initFingerprint().catch(console.error);
  }, []);

  useEffect(() => {
    if (isLoading || sessionLoading) return;
    setLines([]); 

    if (formError || !formConfig) {
      addLine(
        <div key={Date.now()} className="text-rose-500 font-bold">
          <p>{`> ERROR 404: Form is currently offline or does not exist.`}</p>
          {formError && <p className="text-rose-400 mt-2">{`> Details: ${formError.message}`}</p>}
        </div>
      );
      setBootPhase("done");
      return;
    }

    if (formConfig.status === "draft") {
      addLine(
        <p key={Date.now()} className="text-rose-500 font-bold">
          {`> ERROR 404: Form is currently offline.`}
        </p>
      );
      setBootPhase("done");
      return;
    }

    if (formConfig.requireAuth && !sessionData?.user) {
      addLine(
        <div key={Date.now()} className="text-rose-400 font-bold">
          <p>{`> SECURITY OVERRIDE: Authentication required.`}</p>
          <p>{`> Redirecting to secure login portal...`}</p>
        </div>
      );
      setBootPhase("done");
      setTimeout(() => {
        router.push(`/auth/login?callbackUrl=/f/${formId}`);
      }, 1500);
      return;
    }

    if (formConfig.password) {
      addLine(<p key={Date.now()}>{`> ACCESS RESTRICTED. Enter form password:`}</p>);
      setBootPhase("password_prompt");
      return;
    }

    startBootSequence();
  }, [isLoading, sessionLoading, formConfig, formError]);

  const startBootSequence = () => {
    if (!formConfig) return;
    setBootPhase("booting");
    
    if (visitorId) {
      trackViewMutation.mutate({ slug: formConfig.slug, fingerprint: visitorId });
    } else {
      trackViewMutation.mutate({ slug: formConfig.slug });
    }

    setTimeout(() => {
      addLine(<p key={`boot-1`}>{`> parcha connect origin fld_${formConfig.id}`}</p>);
      setTimeout(() => {
        addLine(<p key={`boot-2`}>{`> Connection established.`}</p>);
        setTimeout(() => {
          addLine(<p key={`boot-3`}>{`> Form: "${formConfig.title}"`}</p>);
          setTimeout(() => {
            addLine(
              <div key="instructions" className="text-zinc-500 mt-2 mb-2">
                <p>{`> INSTRUCTIONS:`}</p>
                <p>{`> - Fields marked with [*] are mandatory.`}</p>
                <p>{`> - For multiple choice, enter comma-separated numbers.`}</p>
                <p>{`> - Type ':back' at any time to go to the previous question.`}</p>
                <p className="mt-2 text-zinc-300 animate-pulse">{`> Press [ENTER] to start...`}</p>
              </div>
            );
          }, 400);
        }, 400);
      }, 600);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const val = currentInput.trim();

      if (bootPhase === "password_prompt") {
        if (val === formConfig?.password) {
          addLine(<p key={Date.now()} className="text-emerald-400">{`> ACCESS GRANTED.`}</p>);
          setCurrentInput("");
          startBootSequence();
        } else {
          addLine(<p key={Date.now()} className="text-rose-500 font-bold">{`> ACCESS DENIED.`}</p>);
          setCurrentInput("");
        }
        return;
      }

      if (bootPhase === "booting") {
        setBootPhase("live");
        setCurrentInput("");
        return;
      }

      if (bootPhase === "live" && formConfig) {
        const schema = formConfig.schema as SchemaField[];
        const active = schema[currentIndex];

        if (val.toLowerCase() === ":back") {
          if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setCurrentInput("");
            setErrorMsg("");
          }
          return;
        }

        if (!active) return; 
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
            const parts = val.split(",").map((s) => s.trim());
            const max = active.options?.length || 0;
            const isValid = parts.every((p) => {
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
        
        if (currentIndex + 1 >= schema.length) {
          setBootPhase("submitting");
          addLine(<p key="uploading" className="mt-4 text-emerald-400">{`> Uploading payload to server...`}</p>);
          
          submitMutation.mutate({
            slug: formConfig.slug,
            payload: { ...answers, [active.id]: val },
            fingerprint: visitorId || undefined,
            honeypotField: honeypot || undefined,
          }, {
            onSuccess: () => {
              addLine(
                <div key="success" className="mt-4 p-4 border border-emerald-500/30 bg-emerald-950/20 rounded-md">
                  <p className="text-emerald-400 font-bold mb-2">✓ TRANSMISSION SUCCESSFUL</p>
                  <p className="text-emerald-300 font-normal">{formConfig.successMessage}</p>
                </div>
              );
              setBootPhase("done");
            },
            onError: (err) => {
              addLine(<p key="error" className="text-rose-500 font-bold mt-4">{`> ERROR: ${err.message}`}</p>);
              setBootPhase("done");
            }
          });
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    }
  };

  const liveLines: React.ReactNode[] = [];
  let activeFieldLabel = "Enter response";

  if (bootPhase === "live" && formConfig) {
    const schema = formConfig.schema as SchemaField[];
    schema.forEach((field, index) => {
      const isPast = index < currentIndex;
      const isActive = index === currentIndex;

      if (isPast) {
        liveLines.push(
          <div key={`past-${field.id}`} className="text-zinc-400 mt-2 pl-2 border-l border-zinc-800/40">
            <p>{`> ${field.prompt} [ ${answers[field.id] || ""} ]`}</p>
          </div>
        );
      } else if (isActive) {
        liveLines.push(
          <div key={`active-${field.id}`} className="text-zinc-200 mt-4 font-bold pl-2 border-l-2 border-emerald-500">
            <p className="text-zinc-100">{`> ${field.prompt}${field.required ? " *" : ""}`}</p>
            {(field.type === "single_select" || field.type === "multiple_choice") && field.options && (
              <div className="my-2 pl-4 flex flex-col gap-1 text-zinc-400 font-medium text-sm">
                {field.options.map((opt, optIdx) => (
                  <p key={`opt-${field.id}-${optIdx}`}>
                    {`  [${optIdx + 1}] ${opt}`}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

        if (field.type === "single_select") activeFieldLabel = "Select an option";
        else if (field.type === "multiple_choice") activeFieldLabel = "Select option(s)";
        else if (field.type === "date") activeFieldLabel = "Enter date (YYYY-MM-DD)";
        else if (field.type === "email") activeFieldLabel = "Enter email address";
      }
    });
  }

  return (
    <div 
      className="flex flex-col gap-1 p-6 sm:p-12 font-mono text-sm leading-relaxed h-screen w-screen overflow-hidden bg-[#050B14] text-slate-200 selection:bg-emerald-900 selection:text-emerald-100"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24 pr-4 custom-scrollbar">
        {lines}
        {liveLines}

        {bootPhase === "password_prompt" && (
          <div className="mt-2 pl-2 flex items-center text-emerald-400 font-bold">
            <span>{`> Password: [ `}</span>
            <span className="text-zinc-100 tracking-widest">
              {"*".repeat(currentInput.length)}
            </span>
            <span className="text-emerald-400 animate-pulse font-bold ml-1">█</span>
            <span className="text-emerald-400">{" ]"}</span>
          </div>
        )}

        {bootPhase === "live" && (
          <div className="mt-4 pl-2 flex flex-col gap-1">
            {errorMsg && (
              <p className="text-rose-500 text-sm font-bold">{`[!] ${errorMsg}`}</p>
            )}
            <div className="flex items-center text-emerald-400 font-bold">
              <span>{`> ${activeFieldLabel}: [ `}</span>
              <span className="text-zinc-100 font-normal tracking-wide whitespace-pre-wrap">
                {currentInput}
              </span>
              <span className="text-emerald-400 animate-pulse font-bold">█</span>
              <span className="text-emerald-400">{" ]"}</span>
            </div>
          </div>
        )}
      </div>

      {(bootPhase === "password_prompt" || bootPhase === "booting" || bootPhase === "live") && (
        <>
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute w-0 h-0 pointer-events-none"
            value={currentInput}
            onChange={(e) => {
              setCurrentInput(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {/* Honeypot field for bot trapping */}
          <input
            type="text"
            name="email_address_verify"
            className="opacity-0 absolute w-0 h-0 pointer-events-none"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050B14;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
      `}} />
    </div>
  );
}

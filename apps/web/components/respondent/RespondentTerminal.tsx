"use client";

import { useEffect, useState, useCallback } from "react";
import { trpc } from "~/trpc/client";
import { useRouter } from "next/navigation";
import type { SchemaField } from "../builder/constants";
import fpPromise from "@fingerprintjs/fingerprintjs";
import { ThemeEngine } from "../themes/ThemeEngine";
import { Spinner } from "~/components/ui/spinner";

export function RespondentTerminal({ formId }: { formId: string }) {
  const router = useRouter();
  
  const [bootPhase, setBootPhase] = useState<"fetching" | "error" | "ready" | "password_prompt">("fetching");
  const [visitorId, setVisitorId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [activePassword, setActivePassword] = useState<string | undefined>(undefined);
  
  const { data: formConfig, error: formError, isLoading } = trpc.form.getPublicForm.useQuery(
    { formIdOrSlug: formId, password: activePassword },
    { retry: false }
  );

  const { data: sessionData, isLoading: sessionLoading } = trpc.auth.me.useQuery(undefined, { retry: false, staleTime: 0 });
  
  const { mutate: submitResponse, mutateAsync: submitResponseAsync } = trpc.response.submit.useMutation();
  const { mutate: trackView } = trpc.response.trackView.useMutation();

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

    if (formError || !formConfig) {
      setErrorMsg(`> ERROR 404: Form is currently offline or does not exist.\n> Details: ${formError?.message || "Unknown error"}`);
      setBootPhase("error");
      return;
    }

    if (formConfig.status === "draft") {
      setErrorMsg(`> ERROR 404: Form is currently offline.`);
      setBootPhase("error");
      return;
    }

    if (formConfig.requireAuth && !sessionData?.user) {
      setErrorMsg(`> SECURITY OVERRIDE: Authentication required.\n> Redirecting to secure login portal...`);
      setBootPhase("error");
      setTimeout(() => {
        router.push(`/auth/login?callbackUrl=/f/${formId}`);
      }, 1500);
      return;
    }

    if (formConfig.isPasswordProtected && !formConfig.isAuthorized) {
      setBootPhase("password_prompt");
      if (activePassword) {
        setErrorMsg("Incorrect password. Please try again.");
      }
      return;
    }

    setBootPhase("ready");
  }, [isLoading, sessionLoading, formConfig, formError, router, formId, sessionData?.user, activePassword]);

  const handleTrackView = useCallback(() => {
    if (!formConfig) return;
    if (visitorId) {
      trackView({ slug: formConfig.slug, fingerprint: visitorId });
    } else {
      trackView({ slug: formConfig.slug });
    }
  }, [visitorId, formConfig?.slug, trackView]);

  const handleSubmit = useCallback(async (answers: Record<string, string>, honeypot?: string) => {
    if (!formConfig) return;
    await submitResponseAsync({
      slug: formConfig.slug,
      payload: answers,
      fingerprint: visitorId || undefined,
      honeypotField: honeypot || undefined,
    });
  }, [visitorId, formConfig?.slug, submitResponseAsync]);

  if (bootPhase === "fetching") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Spinner className="text-emerald-500" />
      </div>
    );
  }

  if (bootPhase === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen overflow-hidden p-4 sm:p-8 bg-black font-mono text-slate-200">
        <div className="flex flex-col w-full max-w-4xl h-full max-h-[85vh] bg-[#050B14] border border-[#0f1b2d] shadow-2xl rounded-md overflow-hidden">
          <div className="p-6 sm:p-12 h-full overflow-y-auto">
            <div className="text-rose-500 font-bold whitespace-pre-wrap mt-4">
              {errorMsg}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bootPhase === "password_prompt") {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-black font-mono text-slate-200">
        <div className="flex flex-col max-w-md w-full bg-[#050B14] border border-[#0f1b2d] shadow-2xl rounded-md p-8">
          <h2 className="text-emerald-400 font-bold mb-4">{`> SECURITY PORTAL`}</h2>
          <p className="text-zinc-400 text-sm mb-6">This form requires a password to access.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            setActivePassword(passwordInput);
          }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-black border border-[#0f1b2d] focus:border-emerald-500 text-emerald-400 outline-none px-4 py-2 mb-4"
              autoFocus
            />
            {errorMsg && <p className="text-rose-500 text-xs mb-4">{errorMsg}</p>}
            <button type="submit" className="w-full bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/50 py-2 transition-colors">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!formConfig) return null;

  return (
    <ThemeEngine
      theme={(formConfig.theme as any) || "terminal"}
      schema={formConfig.schema as SchemaField[]}
      formName={formConfig.title || "Parcha95 Form"}
      successMessage={formConfig.successMessage || undefined}
      isPreview={false}
      onTrackView={handleTrackView}
      onSubmit={handleSubmit}
    />
  );
}

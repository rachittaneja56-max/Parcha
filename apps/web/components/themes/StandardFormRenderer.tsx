"use client";

import React, { useState, useEffect } from "react";
import type { ThemeRendererProps } from "./TerminalRenderer";

export function StandardFormRenderer({
  schema,
  formName,
  form,
  successMessage = "Response recorded successfully.",
  isPreview = false,
  onTrackView,
  onSubmit,
  appState = "live",
  errorMsg: globalErrorMsg,
  onLoginClick,
  onPasswordSubmit,
}: ThemeRendererProps & { form?: any }) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isPreview && onTrackView) {
      onTrackView();
    }
  }, [isPreview, onTrackView]);

  const handleAnswer = (fieldId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: val }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[fieldId];
        return newErrs;
      });
    }
  };

  const validateAndSubmit = async () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    schema.forEach((field) => {
      const val = answers[field.id];
      if (field.required && (!val || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0))) {
        newErrors[field.id] = "This is a required question";
        hasError = true;
      } else if (val) {
        if (field.type === "email" && typeof val === "string") {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            newErrors[field.id] = "Invalid email format";
            hasError = true;
          }
        }
        if (field.type === "date" && typeof val === "string") {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            newErrors[field.id] = "Use YYYY-MM-DD format";
            hasError = true;
          }
        }
        if (field.type === "single_select" && typeof val === "string") {
          if (!field.options?.includes(val)) {
            newErrors[field.id] = "Please select a valid option";
            hasError = true;
          }
        }
        if (field.type === "multiple_choice" && Array.isArray(val)) {
          const isValid = val.every(v => field.options?.includes(v));
          if (!isValid) {
            newErrors[field.id] = "Please select valid options";
            hasError = true;
          }
        }
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (isPreview) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setAnswers({});
      }, 3000);
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit(answers);
        setIsSubmitted(true);
      } catch (e: any) {
        alert(e.message || "An error occurred");
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] text-slate-900 font-sans p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-slate-200 border-t-8 border-t-purple-600 p-8">
          <h2 className="text-3xl font-medium mb-4">Response recorded</h2>
          <p className="text-slate-600">{successMessage}</p>
        </div>
      </div>
    );
  }

  if (appState === "error") {
    return (
      <div className="min-h-screen bg-[#F0EBF8] text-slate-900 font-sans p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-slate-200 border-t-8 border-t-red-500 p-8">
          <h2 className="text-3xl font-medium mb-4 text-red-600">Error</h2>
          <p className="text-slate-600 whitespace-pre-wrap">{globalErrorMsg || "An error occurred."}</p>
        </div>
      </div>
    );
  }

  if (appState === "auth_prompt") {
    return (
      <div className="min-h-screen bg-[#F0EBF8] text-slate-900 font-sans p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 border-t-8 border-t-purple-600 p-8">
          <h2 className="text-2xl font-medium mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-6">You need to log in to access this form.</p>
          <div className="flex flex-col gap-3">
            <button onClick={onLoginClick} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded shadow transition-colors">
              Log In to Continue
            </button>
            <button onClick={() => window.location.href = '/'} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-2 rounded transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === "password_prompt") {
    return (
      <div className="min-h-screen bg-[#F0EBF8] text-slate-900 font-sans p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 border-t-8 border-t-purple-600 p-8">
          <h2 className="text-2xl font-medium mb-4">Password Required</h2>
          <p className="text-slate-600 mb-6">This form requires a password to access.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const input = new FormData(e.currentTarget).get("pwd") as string;
            if (onPasswordSubmit) onPasswordSubmit(input);
          }}>
            <input
              type="password"
              name="pwd"
              placeholder="Enter password"
              className="w-full bg-white border border-slate-300 rounded px-4 py-2 mb-4 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              autoFocus
            />
            {globalErrorMsg && <p className="text-red-500 text-sm mb-4">{globalErrorMsg}</p>}
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded shadow transition-colors">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  const title = form?.title || formName || "Untitled Form";
  const description = form?.description || "";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans py-12 px-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full">
        
        <div className="bg-white border-t-8 border-t-purple-600 rounded-lg p-8 shadow-sm border border-slate-200 mb-4">
          <h1 className="text-3xl font-normal text-slate-800">{title}</h1>
          {description && <p className="text-sm text-slate-500 mt-2">{description}</p>}
          <div className="text-xs text-red-600 mt-6">* Indicates required question</div>
        </div>

        {schema.map((field) => {
          const isError = !!errors[field.id];

          return (
            <div
              key={field.id}
              className={`bg-white rounded-lg p-6 mb-4 shadow-sm border transition-all ${
                isError ? 'border-red-500' : 'border-slate-200'
              }`}
            >
              <h3 className="text-base font-medium text-slate-700 mb-2">
                {field.prompt}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </h3>
              {field.description && (
                <p className="text-xs text-slate-500 mb-4">{field.description}</p>
              )}

              <div className="w-full">
                {(field.type === "short_text" || field.type === "email" || field.type === "number" || field.type === "date") && (
                  <input
                    type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
                    value={answers[field.id] || ""}
                    onChange={(e) => handleAnswer(field.id, e.target.value)}
                    placeholder="Your answer"
                    className="w-full md:w-1/2 bg-transparent border-b border-slate-300 py-2 focus:border-b-2 focus:border-purple-600 focus:outline-none transition-all text-sm [color-scheme:light] min-h-[40px]"
                  />
                )}

                {field.type === "long_text" && (
                  <textarea
                    value={answers[field.id] || ""}
                    onChange={(e) => handleAnswer(field.id, e.target.value)}
                    placeholder="Your answer"
                    rows={3}
                    className="w-full bg-transparent border-b border-slate-300 py-2 focus:border-b-2 focus:border-purple-600 focus:outline-none transition-all text-sm resize-y"
                  />
                )}

                {/* Single Select (Standard Radio Inputs) */}
                {field.type === "single_select" && field.options && (
                  <div className="space-y-1">
                    {field.options.map((opt: string, index: number) => {
                      const isSelected = answers[field.id] === opt;
                      return (
                        <label key={index} className="flex items-center space-x-3 p-2 hover:bg-slate-50 cursor-pointer rounded transition-colors group">
                          <input 
                            type="radio" 
                            name={field.id}
                            checked={isSelected}
                            onChange={() => handleAnswer(field.id, opt)}
                            className="w-5 h-5 accent-purple-600 cursor-pointer"
                          />
                          <span className="text-slate-700 text-sm">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Multiple Choice (Standard Checkbox Inputs) */}
                {field.type === "multiple_choice" && field.options && (
                  <div className="space-y-1">
                    {field.options.map((opt: string, index: number) => {
                      const currentSelections = (answers[field.id] as string[]) || [];
                      const isSelected = currentSelections.includes(opt);
                      
                      return (
                        <label key={index} className="flex items-center space-x-3 p-2 hover:bg-slate-50 cursor-pointer rounded transition-colors group">
                          <input 
                            type="checkbox" 
                            name={`${field.id}-${index}`}
                            checked={isSelected}
                            onChange={() => {
                              const newSelections = isSelected 
                                ? currentSelections.filter((s: string) => s !== opt)
                                : [...currentSelections, opt];
                              handleAnswer(field.id, newSelections);
                            }}
                            className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
                          />
                          <span className="text-slate-700 text-sm">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Error State */}
                {isError && (
                  <div className="flex items-center gap-2 mt-3 text-red-600">
                    <svg focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                    </svg>
                    <span className="text-xs font-medium">{errors[field.id]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Submit Section */}
        {schema.length > 0 && (
          <div className="flex justify-end mt-8 pb-12">
            <button
              onClick={validateAndSubmit}
              className="bg-purple-600 text-white font-medium px-6 py-2 rounded shadow hover:bg-purple-700 transition-colors"
            >
              Submit
            </button>
          </div>
        )}

        {schema.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center text-slate-500">
            This form currently has no questions.
          </div>
        )}
      </div>
    </div>
  );
}

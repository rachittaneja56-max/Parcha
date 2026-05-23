"use client";

import { useState, useEffect, useMemo } from "react";
import { TerminalSquare } from "lucide-react";
import type { SchemaField } from "./constants";

function useTerminalLines(schema: SchemaField[], formName: string) {
  return useMemo(() => {
    if (schema.length === 0) {
      return [
        { text: `parcha init "${formName}"`, type: "cmd" as const },
        { text: "  Waiting for fields...", type: "muted" as const },
      ];
    }

    const lines: { text: string; type: "cmd" | "success" | "prompt" | "muted" }[] = [
      { text: `parcha build "${formName}" --interactive`, type: "cmd" },
      {
        text: `  \u2713 Loaded ${schema.length} field${schema.length !== 1 ? "s" : ""}`,
        type: "success",
      },
    ];

    schema.forEach((field) => {
      const prompt = field.prompt || field.label || "Enter a value";
      const req = field.required ? " *" : "";
      lines.push({ text: `> ${prompt}${req}: `, type: "prompt" });
    });

    return lines;
  }, [schema, formName]);
}

function TerminalContent({
  schema,
  formName,
}: {
  schema: SchemaField[];
  formName: string;
}) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const lines = useTerminalLines(schema, formName);

  useEffect(() => {
    const t = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-0.5 p-4 font-mono text-xs leading-relaxed select-none">
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;

        if (line.type === "cmd") {
          return (
            <p key={i} className="text-zinc-500">
              <span className="text-emerald-400/70">parcha</span>
              <span className="text-zinc-600">@cli</span>
              <span className="text-zinc-600"> ~ $ </span>
              <span className="text-zinc-400">{line.text}</span>
            </p>
          );
        }
        if (line.type === "success") {
          return (
            <p key={i} className="text-emerald-500/80">
              {line.text}
            </p>
          );
        }
        if (line.type === "muted") {
          return (
            <p key={i} className="text-zinc-600">
              {line.text}
              {isLast && (
                <span
                  className={`inline-block w-[7px] h-[13px] align-text-bottom bg-zinc-500 transition-opacity duration-75 ml-1 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </p>
          );
        }
        return (
          <p key={i} className="text-cyan-400/90 mt-0.5">
            {line.text}
            {isLast && (
              <span
                className={`inline-block w-[7px] h-[13px] align-text-bottom bg-cyan-400 transition-opacity duration-75 ${
                  cursorVisible ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </p>
        );
      })}
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
    <div className="h-full flex flex-col bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#1c1c1c] px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-3.5 w-3.5 text-emerald-400/70" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            Terminal Preview
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-600">live</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <TerminalContent schema={schema} formName={formName} />
      </div>
    </div>
  );
}

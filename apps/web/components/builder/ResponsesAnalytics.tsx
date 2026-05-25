import React from "react";
import { BarChart, Activity, Users, MousePointer2 } from "lucide-react";

export function ResponsesAnalytics({ formId }: { formId: string }) {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto p-8 gap-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Analytics</h2>
        <p className="text-sm text-zinc-400 mt-1 font-mono">Form ID: {formId}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Users className="h-4 w-4" />
            <h3 className="text-sm font-medium">Total Views</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-100">0</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Activity className="h-4 w-4" />
            <h3 className="text-sm font-medium">Responses</h3>
          </div>
          <p className="text-3xl font-bold text-zinc-100">0</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <MousePointer2 className="h-4 w-4" />
            <h3 className="text-sm font-medium">Conversion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400">0%</p>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center text-zinc-500 gap-3">
          <BarChart className="h-8 w-8 opacity-50" />
          <p className="text-sm font-mono">Not enough data to generate charts</p>
        </div>
      </div>
    </div>
  );
}

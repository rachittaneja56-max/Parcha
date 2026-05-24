"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { ACTIVITY_ITEMS } from "./constants";

export function ActivityBar({
  activeItem,
  onItemClick,
}: {
  activeItem: string;
  onItemClick: (id: string) => void;
}) {
  return (
    <aside className="w-14 shrink-0 flex flex-col items-center justify-between py-4 border-r border-zinc-800 bg-zinc-900">
      <div className="flex flex-col items-center gap-4">
        {ACTIVITY_ITEMS.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onItemClick(item.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-sm transition-colors ${
                  activeItem === item.id
                    ? "bg-zinc-100 text-zinc-900 animate-pulse"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs font-mono border-zinc-800 bg-zinc-950 text-zinc-300">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-100 font-bold text-sm select-none">
        P
      </div>
    </aside>
  );
}

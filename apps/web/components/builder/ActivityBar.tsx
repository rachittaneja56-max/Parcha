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
    <aside className="w-14 shrink-0 flex flex-col items-center justify-between py-4 border-r border-[#1c1c1c] bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        {ACTIVITY_ITEMS.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onItemClick(item.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-sm transition-colors ${
                  activeItem === item.id
                    ? "bg-[#1c1c1c] text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-[#111]"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs font-mono border-[#1c1c1c] bg-[#111] text-zinc-300">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-[#222] text-white font-bold text-sm select-none">
        N
      </div>
    </aside>
  );
}

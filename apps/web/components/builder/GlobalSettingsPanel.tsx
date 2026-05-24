"use client";

import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Settings } from "lucide-react";

export type FormSettings = {
  title: string;
  status: "draft" | "published";
  visibility: "public" | "unlisted" | "unpublished";
  requireAuth: boolean;
  password?: string | null;
  successMessage: string;
};

export function GlobalSettingsPanel({
  settings,
  onChange,
}: {
  settings: FormSettings;
  onChange: (updates: Partial<FormSettings>) => void;
}) {
  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-zinc-400" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 select-none">
            GLOBAL SETTINGS
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Form Title
            </label>
            <Input
              value={settings.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="h-8 text-sm font-mono bg-slate-950 border-slate-800 focus-visible:ring-indigo-500 text-slate-100"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">Published</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Make form accessible
              </p>
            </div>
            <Switch
              checked={settings.status === "published"}
              onCheckedChange={(checked) =>
                onChange({ status: checked ? "published" : "draft" })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">Public Visibility</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Show in public directories
              </p>
            </div>
            <Switch
              checked={settings.visibility === "public"}
              onCheckedChange={(checked) =>
                onChange({ visibility: checked ? "public" : "unlisted" })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">Require Login</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Restrict to logged-in users
              </p>
            </div>
            <Switch
              checked={settings.requireAuth}
              onCheckedChange={(checked) => onChange({ requireAuth: checked })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Password Protection
            </label>
            <Input
              type="password"
              placeholder="Leave blank for none"
              value={settings.password || ""}
              onChange={(e) => onChange({ password: e.target.value || null })}
              className="h-8 text-sm font-mono bg-slate-950 border-slate-800 focus-visible:ring-indigo-500 text-slate-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Success Message
            </label>
            <Textarea
              value={settings.successMessage}
              onChange={(e) => onChange({ successMessage: e.target.value })}
              className="text-sm font-mono bg-slate-950 border-slate-800 resize-none focus-visible:ring-indigo-500 text-slate-100"
              rows={3}
            />
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}

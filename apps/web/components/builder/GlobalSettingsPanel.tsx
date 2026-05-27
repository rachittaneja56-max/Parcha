"use client";

import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";


export type FormSettings = {
  title: string;
  status: "draft" | "published";
  visibility: "public" | "unlisted" | "unpublished";
  requireAuth: boolean;
  password?: string | null;
  successMessage: string;
  theme: "terminal" | "windowsxp" | "standard" | "code_editor";
  webhookUrl?: string | null;
  expiresAt?: string | null;
  maxResponses?: number | null;
};

export function GlobalSettingsPanel({
  settings,
  onChange,
  onDeleteForm,
}: {
  settings: FormSettings;
  onChange: (updates: Partial<FormSettings>) => void;
  onDeleteForm?: () => void;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-zinc-400" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 select-none">
            GLOBAL SETTINGS
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Form Title
            </label>
            <Input
              value={settings.title}
              onChange={(e) => onChange({ title: e.target.value })}
              onPointerDown={(e) => e.stopPropagation()}
              className="h-8 text-sm font-mono bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-500 text-zinc-100"
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
              onPointerDown={(e) => e.stopPropagation()}
              className="h-8 text-sm font-mono bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-500 text-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
            <label className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-semibold">
              Response Limits & Expiry
            </label>
            
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">Max Responses</label>
              <Input
                type="number"
                placeholder="Unlimited"
                value={settings.maxResponses || ""}
                onChange={(e) => onChange({ maxResponses: e.target.value ? parseInt(e.target.value) : null })}
                onPointerDown={(e) => e.stopPropagation()}
                className="h-8 text-sm font-mono bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-500 text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">Expiry Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-mono h-8 bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-500 hover:bg-zinc-900 hover:text-zinc-100 ${
                      !settings.expiresAt ? "text-muted-foreground" : "text-zinc-100"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settings.expiresAt ? format(new Date(settings.expiresAt), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800" align="start">
                  <Calendar
                    mode="single"
                    selected={settings.expiresAt ? new Date(settings.expiresAt) : undefined}
                    onSelect={(date) => onChange({ expiresAt: date ? date.toISOString() : null })}
                    initialFocus
                    className="text-zinc-100"
                  />
                  {settings.expiresAt && (
                    <div className="p-3 border-t border-zinc-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        onClick={() => onChange({ expiresAt: null })}
                      >
                        Clear Date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Success Message
            </label>
            <Textarea
              value={settings.successMessage}
              onChange={(e) => onChange({ successMessage: e.target.value })}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-sm font-mono bg-zinc-950 border-zinc-800 resize-none focus-visible:ring-zinc-500 text-zinc-100"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Form Theme
            </label>
            <Select
              value={settings.theme}
              onValueChange={(val) => onChange({ theme: val as any })}
            >
              <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 focus:ring-zinc-500 text-zinc-100 h-9 font-mono text-sm">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100 font-mono">
                <SelectItem value="terminal">Terminal (Dark)</SelectItem>
                <SelectItem value="windowsxp">Windows 95</SelectItem>
                <SelectItem value="standard">Standard Form</SelectItem>
                <SelectItem value="code_editor">Code Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
            <label className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 font-semibold">
              Webhook URL (Integrations)
            </label>
            <p className="text-xs text-zinc-500 mb-1">
              Parcha95 will instantly send a JSON payload to this URL when a submission is received.
            </p>
            <Input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={settings.webhookUrl || ""}
              onChange={(e) => onChange({ webhookUrl: e.target.value || null })}
              onPointerDown={(e) => e.stopPropagation()}
              className="h-8 text-sm font-mono bg-zinc-950 border-emerald-900/30 focus-visible:ring-emerald-500 text-zinc-100"
            />
          </div>

          <div className="pt-6 mt-2 border-t border-red-900/30">
            <h4 className="text-xs font-mono font-semibold text-red-500 uppercase tracking-widest mb-4">
              Danger Zone
            </h4>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full font-mono text-sm gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Form
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-950 border-red-900/30 text-zinc-100">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    This action cannot be undone. This will permanently delete your form, all its fields, and any collected responses and analytics data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white border-zinc-800 font-mono">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={onDeleteForm} className="bg-red-600 text-white hover:bg-red-700 font-mono">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

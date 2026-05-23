"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  BarChart3,
  FileText,
  Link as LinkIcon,
  Pencil,
  Layers,
  TrendingUp,
  X,
  Globe,
  Lock,
  ChevronRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { trpc } from "~/trpc/client";

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function themeLabel(theme: string) {
  const map: Record<string, string> = {
    standard_dark: "Standard Dark",
    git_commit: "Git Commit",
    mongo_shell: "Mongo Shell",
  };
  return map[theme] ?? theme;
}


function StatsOverlay({
  open,
  onClose,
  forms,
}: {
  open: boolean;
  onClose: () => void;
  forms: any[];
}) {
  const totalForms = forms.length;
  const totalFields = forms.reduce(
    (acc, f) => acc + (Array.isArray(f.schema) ? f.schema.length : 0),
    0
  );
  const published = forms.filter((f) => f.visibility === "public").length;

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end p-6"
      onClick={onClose}
    >
      <div
        className="w-80 rounded-xl border border-border bg-card shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Global Stats</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: Layers, label: "Total Forms", value: totalForms },
            { icon: FileText, label: "Total Fields", value: totalFields },
            { icon: Globe, label: "Published", value: published },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="text-xl font-semibold tabular-nums">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateFormDialog({
  open,
  onOpenChange,
  onCreate,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (title: string) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");

  function handleCreate() {
    if (!title.trim()) return;
    onCreate(title.trim());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
          <DialogDescription>
            Give your form a name to get started. You can always rename it later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input
            id="form-name-input"
            placeholder="e.g. Waitlist Sign-up"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            autoFocus
            className="font-mono text-sm"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || isPending}
          >
            {isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Create Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function DashboardPage() {
  const router = useRouter();
  const [showStats, setShowStats] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const me = trpc.auth.me.useQuery(undefined, { retry: false });
  const myForms = trpc.form.getMyForms.useQuery(undefined, {
    enabled: !!me.data?.user,
  });

  const createForm = trpc.form.create.useMutation({
    onSuccess: (data) => {
      setCreateOpen(false);
      if (data?.id) {
        router.push(`/dashboard/builder/${data.id}`);
      }
    },
  });

  useEffect(() => {
    if (me.isError) router.replace("/auth/login");
  }, [me.isError, router]);

  if (me.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }
  if (!me.data?.user) return null;

  const forms: any[] = myForms.data ?? [];
  const user = me.data.user;

  function handleShare(form: any) {
    const url = `${window.location.origin}/f/${form.slug}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <nav className="flex items-center gap-1.5 text-sm">
            <div className="flex items-center justify-center w-6 h-6 bg-foreground text-background rounded-[4px] font-bold text-[11px] tracking-tighter shrink-0">
              P
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span className="text-muted-foreground">Parcha</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span className="font-medium text-foreground">Forms</span>
          </nav>

          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => setShowStats((v) => !v)}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Global Stats
            </Button>
            <Button
              size="sm"
              className="gap-2 text-xs"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Form
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border ml-1 shrink-0">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {forms.length === 0
              ? "You have no forms yet."
              : `${forms.length} form${forms.length !== 1 ? "s" : ""} in your workspace`}
          </p>
        </div>

        {myForms.isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner />
          </div>
        ) : forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 py-28 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 border border-border/60 mb-5">
              <FileText className="h-7 w-7 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold mb-1.5">No forms yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Create your first form to start collecting responses from your users.
            </p>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first form
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => {
              const fieldCount = Array.isArray(form.schema) ? form.schema.length : 0;
              const isPublic = form.visibility === "public";

              return (
                <div
                  key={form.id}
                  className="group relative flex flex-col rounded-xl border border-border bg-card transition-all hover:border-border/80 hover:shadow-md overflow-hidden"
                >
                  <div
                    className={`h-[3px] w-full shrink-0 ${
                      isPublic
                        ? "bg-emerald-500/70"
                        : "bg-muted-foreground/20"
                    }`}
                  />

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-sm font-semibold leading-tight line-clamp-2 text-card-foreground">
                        {form.title}
                      </h2>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          isPublic
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                            : "border-muted-foreground/20 bg-muted text-muted-foreground"
                        }`}
                      >
                        {isPublic ? (
                          <Globe className="h-2.5 w-2.5" />
                        ) : (
                          <Lock className="h-2.5 w-2.5" />
                        )}
                        {isPublic ? "Live" : "Draft"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(form.createdAt)}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">{themeLabel(form.theme)}</span>
                        <span>·</span>
                        <span>{fieldCount} field{fieldCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border/40 px-3 py-2.5 mb-5">
                      <BarChart3 className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 leading-none">
                          Responses
                        </p>
                        <p className="text-base font-semibold tabular-nums leading-tight mt-0.5">
                          0
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 text-xs h-8"
                        onClick={() => router.push(`/dashboard/builder/${form.id}`)}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs h-8 px-3"
                        onClick={() => handleShare(form)}
                        title="Copy share link"
                      >
                        <LinkIcon className="h-3 w-3" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs h-8 px-3"
                        onClick={() =>
                          router.push(`/dashboard/analytics/${form.id}`)
                        }
                        title="View analytics"
                      >
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <StatsOverlay
        open={showStats}
        onClose={() => setShowStats(false)}
        forms={forms}
      />

      <CreateFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(title) =>
          createForm.mutate({ title, theme: "standard_dark" })
        }
        isPending={createForm.isPending}
      />
    </div>
  );
}

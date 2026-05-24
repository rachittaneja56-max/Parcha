"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { Save, Check, Loader2, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { trpc } from "~/trpc/client";

import {
  FIELD_PALETTE,
  generateFieldId,
  type SchemaField,
  type PaletteItem,
  type SaveStatus,
} from "./constants";
import { ActivityBar } from "./ActivityBar";
import { PaletteSidebar } from "./PaletteSidebar";
import { CanvasDropZone } from "./CanvasDropZone";
import { PropertiesPanel } from "./PropertiesPanel";
import { ResizableTerminal } from "./ResizableTerminal";
import { CommandPalette } from "./CommandPalette";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { GlobalSettingsPanel, type FormSettings } from "./GlobalSettingsPanel";

export default function BuilderLayout({ formId }: { formId: string }) {
  const router = useRouter();

  const [activeActivity, setActiveActivity] = useState("components");
  const [viewMode, setViewMode] = useState<"visual" | "developer">("visual");
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<PaletteItem | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [globalSettings, setGlobalSettings] = useState<FormSettings>({
    title: "",
    status: "draft",
    visibility: "unlisted",
    requireAuth: false,
    password: null,
    successMessage: "Response recorded successfully.",
  });

  const initialLoadDone = useRef(false);

  const me = trpc.auth.me.useQuery(undefined, { retry: false });
  const formQuery = trpc.form.getFormById.useQuery(
    { formId },
    { enabled: !!me.data?.user }
  );
  const updateSchema = trpc.form.updateSchema.useMutation();
  const updateSettings = trpc.form.updateSettings.useMutation();

  useEffect(() => {
    if (formQuery.data && !initialLoadDone.current) {
      if (Array.isArray(formQuery.data.schema)) {
        const loaded = formQuery.data.schema as any[];
        const mapped = loaded.map((f) => {
          const name = f.name || f.label || "untitled";
          let options = f.options;
          if ((f.type === "multiple_choice" || f.type === "single_select") && (!options || options.length < 2)) {
            options = ["Option 1", "Option 2"];
          }
          return { ...f, name, options };
        }) as SchemaField[];
        setSchema(mapped);
      }
      setGlobalSettings({
        title: formQuery.data.title ?? "",
        status: (formQuery.data.status as "draft" | "published") ?? "draft",
        visibility: (formQuery.data.visibility as "public" | "unlisted" | "unpublished") ?? "unlisted",
        requireAuth: formQuery.data.requireAuth ?? false,
        password: formQuery.data.password ?? null,
        successMessage: formQuery.data.successMessage ?? "Response recorded successfully.",
      });
      initialLoadDone.current = true;
    }
  }, [formQuery.data]);

  useEffect(() => {
    if (me.isError) router.replace("/auth/login");
  }, [me.isError, router]);

  const debouncedSave = useDebouncedCallback((currentSchema: SchemaField[]) => {
    setSaveStatus("saving");
    updateSchema.mutate(
      { formId, schema: currentSchema },
      {
        onSuccess: () => {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        },
        onError: (err) => {
          console.error("[Auto-save Error]:", err);
          setSaveStatus("error");
          toast.error("Auto-save failed due to an unexpected error.");
        },
      }
    );
  }, 2000);

  const debouncedSaveSettings = useDebouncedCallback((settings: FormSettings) => {
    setSaveStatus("saving");
    updateSettings.mutate(
      { formId, updates: settings },
      {
        onSuccess: () => {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        },
        onError: (err) => {
          console.error("[Settings Auto-save Error]:", err);
          setSaveStatus("error");
          toast.error("Settings auto-save failed.");
        },
      }
    );
  }, 2000);

  useEffect(() => {
    if (initialLoadDone.current && schema.length > 0 && autoSaveEnabled) {
      debouncedSave(schema);
    }
  }, [schema, debouncedSave, autoSaveEnabled]);

  useEffect(() => {
    if (initialLoadDone.current && autoSaveEnabled) {
      debouncedSaveSettings(globalSettings);
    }
  }, [globalSettings, debouncedSaveSettings, autoSaveEnabled]);

  const handleManualSave = useCallback(() => {
    debouncedSave.cancel();
    debouncedSaveSettings.cancel();
    setSaveStatus("saving");
    updateSchema.mutate(
      { formId, schema },
      {
        onSuccess: () => {
          updateSettings.mutate(
            { formId, updates: globalSettings },
            {
              onSuccess: () => {
                setSaveStatus("saved");
                toast.success("Form synced to database.");
                setTimeout(() => setSaveStatus("idle"), 2000);
              },
              onError: (err) => {
                console.error("[Manual Save Settings Error]:", err);
                setSaveStatus("error");
                toast.error("Settings save failed.");
              }
            }
          );
        },
        onError: (err) => {
          console.error("[Manual Save Error]:", err);
          setSaveStatus("error");
          toast.error("Save failed due to an unexpected error.");
        },
      }
    );
  }, [formId, schema, globalSettings, updateSchema, updateSettings, debouncedSave, debouncedSaveSettings]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleManualSave();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleManualSave]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const paletteItem = FIELD_PALETTE.find((f) => f.type === event.active.id);
    if (paletteItem) setActiveDragItem(paletteItem);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragItem(null);

    const palette = FIELD_PALETTE.find((f) => f.type === active.id);

    if (palette) {
      if (over) {
        addField(palette.type, over.id === "canvas-drop" ? null : String(over.id));
      }
      return;
    }

    if (over && active.id !== over.id) {
      setSchema((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function addField(type: string, insertAfterId: string | null = null) {
    const palette = FIELD_PALETTE.find((f) => f.type === type);
    if (!palette) return;
    const newField: SchemaField = {
      id: generateFieldId(),
      type: palette.type,
      name: palette.label,
      prompt: palette.defaultPrompt,
      required: false,
      ...(palette.type === "multiple_choice" || palette.type === "single_select" ? { options: ["Option 1", "Option 2"] } : {}),
    };
    setSchema((prev) => {
      if (insertAfterId) {
        const index = prev.findIndex((f) => f.id === insertAfterId);
        if (index !== -1) {
          const next = [...prev];
          next.splice(index + 1, 0, newField);
          return next;
        }
      }
      return [...prev, newField];
    });
    setSelectedId(newField.id);
  }

  function removeField(id: string) {
    setSchema((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function updateField(id: string, updates: Partial<SchemaField>) {
    setSchema((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }

  const selectedField = schema.find((f) => f.id === selectedId) ?? null;
  const formName = globalSettings.title || "Untitled Form";

  if (me.isLoading || formQuery.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }
  if (!me.data?.user) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-zinc-300">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
            <nav className="flex items-center gap-1.5 text-[12px] font-mono select-none">
              <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Parcha
              </Link>
              <span className="text-slate-650">/</span>
              <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Forms
              </Link>
              <span className="text-slate-650">/</span>
              <span className="text-slate-200 font-semibold truncate max-w-[200px]" title={formName}>
                {formName}
              </span>
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">Saved</span>
                  </>
                )}
              </div>

              <div className="flex items-center rounded-sm border border-slate-800 bg-slate-950 p-0.5">
                {(["visual", "developer"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors ${viewMode === mode
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                      }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 border-l border-slate-800 pl-3 ml-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Auto-Save</span>
                <button
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${autoSaveEnabled ? "bg-emerald-500" : "bg-zinc-650"
                    }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoSaveEnabled ? "translate-x-3.5" : "translate-x-0.5"
                      }`}
                  />
                </button>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="gap-2 text-xs font-mono rounded-sm border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 hover:text-slate-100 h-7 px-3"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/f/' + formId);
                  toast.success("Link copied to clipboard");
                }}
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>

              <Button
                size="sm"
                className="gap-2 text-xs font-mono rounded-sm bg-indigo-600 text-white hover:bg-indigo-500 h-7 px-3"
                onClick={handleManualSave}
                disabled={updateSchema.isPending}
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </Button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <ActivityBar
              activeItem={activeActivity}
              onItemClick={setActiveActivity}
            />
            {activeActivity === "components" && <PaletteSidebar />}
            {activeActivity === "settings" && (
              <GlobalSettingsPanel
                settings={globalSettings}
                onChange={(updates) => setGlobalSettings(prev => ({ ...prev, ...updates }))}
              />
            )}

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 border-b border-slate-800 bg-slate-950">
                {[
                  { id: "builder", label: "builder.tsx", active: true },
                  { id: "responses", label: "responses.csv", active: false },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 border-r border-slate-800 px-4 py-2.5 text-[11px] font-mono transition-colors ${
                      tab.active
                        ? "border-b border-b-indigo-500 bg-slate-900 text-slate-200"
                        : "text-slate-500 hover:bg-slate-900/50 hover:text-slate-350"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel defaultSize={70} minSize={30}>
                    <div className="flex h-full overflow-hidden">
                      <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
                        <CanvasDropZone
                          schema={schema}
                          selectedId={selectedId}
                          onSelect={setSelectedId}
                          onRemove={removeField}
                        />
                      </div>

                      {selectedField && (
                        <aside className="h-full w-72 shrink-0 overflow-y-auto border-l border-slate-800 bg-slate-900">
                          <PropertiesPanel
                             field={selectedField}
                             onChange={(updates) => updateField(selectedField.id, updates)}
                           />
                        </aside>
                      )}
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle className="bg-slate-800 h-3 cursor-row-resize hover:bg-slate-700 transition-colors" />

                  <ResizablePanel defaultSize={30} minSize={15} className="bg-[#050B14] overflow-hidden">
                    <ResizableTerminal schema={schema} formName={formName} />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </main>
          </div>
        </div>

        <DragOverlay>
          {activeDragItem ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-sm border border-primary/40 bg-card shadow-lg opacity-90">
              <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary shrink-0">
                <activeDragItem.icon className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs text-foreground">
                {activeDragItem.label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CommandPalette
        onAddField={addField}
        onSave={handleManualSave}
        onGoToDashboard={() => router.push("/dashboard")}
        onSwitchMode={setViewMode}
      />
    </TooltipProvider>
  );
}

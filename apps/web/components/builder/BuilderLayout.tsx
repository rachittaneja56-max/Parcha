"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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

import { Save, Check, Loader2 } from "lucide-react";
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

export default function BuilderLayout({ formId }: { formId: string }) {
  const router = useRouter();

  const [activeActivity, setActiveActivity] = useState("components");
  const [viewMode, setViewMode] = useState<"visual" | "developer">("visual");
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<PaletteItem | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const initialLoadDone = useRef(false);

  const me = trpc.auth.me.useQuery(undefined, { retry: false });
  const formQuery = trpc.form.getFormById.useQuery(
    { formId },
    { enabled: !!me.data?.user }
  );
  const updateSchema = trpc.form.updateSchema.useMutation();

  useEffect(() => {
    if (formQuery.data?.schema && Array.isArray(formQuery.data.schema)) {
      setSchema(formQuery.data.schema as SchemaField[]);
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
          setSaveStatus("error");
          toast.error(`Auto-save failed: ${err.message}`);
        },
      }
    );
  }, 2000);

  useEffect(() => {
    if (initialLoadDone.current && schema.length > 0) {
      debouncedSave(schema);
    }
  }, [schema, debouncedSave]);

  const handleManualSave = useCallback(() => {
    debouncedSave.cancel();
    setSaveStatus("saving");
    updateSchema.mutate(
      { formId, schema },
      {
        onSuccess: () => {
          setSaveStatus("saved");
          toast.success("Schema synced to database.");
          setTimeout(() => setSaveStatus("idle"), 2000);
        },
        onError: (err) => {
          setSaveStatus("error");
          toast.error(`Save failed: ${err.message}`);
        },
      }
    );
  }, [formId, schema, updateSchema, debouncedSave]);

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

    if (over?.id === "canvas-drop") {
      const palette = FIELD_PALETTE.find((f) => f.type === active.id);
      if (palette) {
        addField(palette.type);
        return;
      }
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

  function addField(type: string) {
    const palette = FIELD_PALETTE.find((f) => f.type === type);
    if (!palette) return;
    const newField: SchemaField = {
      id: generateFieldId(),
      type: palette.type,
      label: palette.label,
      prompt: palette.defaultPrompt,
      required: false,
    };
    setSchema((prev) => [...prev, newField]);
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
  const formName = formQuery.data?.title ?? "Untitled Form";

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
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0a] text-zinc-300">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#1c1c1c] bg-[#0a0a0a] px-4">
              <nav className="flex items-center gap-2 text-[13px] font-mono">
                <span className="text-zinc-500">~/forms/</span>
                <span className="text-white font-bold">{formName}</span>
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

                <div className="flex items-center rounded-sm border border-[#1c1c1c] bg-[#111] p-0.5">
                  {(["visual", "developer"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors ${
                        viewMode === mode
                          ? "bg-[#222] text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>

                <Button
                  size="sm"
                  className="gap-2 text-xs font-mono rounded-sm bg-white text-black hover:bg-zinc-200 h-7 px-3"
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
            <PaletteSidebar />

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex shrink-0 border-b border-[#1c1c1c] bg-[#0a0a0a]">
                  {[
                    { id: "builder", label: "builder.tsx", active: false },
                    { id: "responses", label: "responses.csv *", active: true },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center gap-2 border-r border-[#1c1c1c] px-4 py-2.5 text-[11px] font-mono transition-colors ${
                        tab.active
                          ? "border-b border-b-white bg-[#0a0a0a] text-zinc-300"
                          : "text-zinc-500 hover:bg-[#111] hover:text-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <div className="flex min-h-0 flex-1 overflow-hidden">
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <CanvasDropZone
                        schema={schema}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onRemove={removeField}
                      />
                    </div>

                    {selectedField && (
                      <aside className="h-full w-80 shrink-0 overflow-y-auto border-l border-[#1c1c1c]">
                        <PropertiesPanel
                          field={selectedField}
                          onChange={(updates) => updateField(selectedField.id, updates)}
                        />
                      </aside>
                    )}
                  </div>

                  <div className="h-56 shrink-0 overflow-hidden border-t border-[#1c1c1c] bg-[#0a0a0a]">
                    <ResizableTerminal schema={schema} formName={formName} />
                  </div>
                </div>
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Files,
  Blocks,
  Settings,
  Type,
  AtSign,
  CheckSquare,
  Hash,
  AlignLeft,
  ChevronDown,
  Save,
  TerminalSquare,
  X,
  GripVertical,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { ScrollArea } from "~/components/ui/scroll-area";
import { trpc } from "~/trpc/client";
import { useTerminalPreview, type SchemaField } from "~/hooks/useTerminalPreview";


const ACTIVITY_ITEMS = [
  { icon: Files, label: "Explorer", id: "explorer" },
  { icon: Blocks, label: "Components", id: "components" },
  { icon: Settings, label: "Settings", id: "settings" },
] as const;

const FIELD_PALETTE = [
  { icon: Type, label: "Short Text", type: "short_text" },
  { icon: AtSign, label: "Email Address", type: "email" },
  { icon: CheckSquare, label: "Multiple Choice", type: "multiple_choice" },
  { icon: Hash, label: "Number", type: "number" },
  { icon: AlignLeft, label: "Long Text", type: "long_text" },
] as const;

type PaletteItem = typeof FIELD_PALETTE[number];

function generateId() {
  return `fld_${Math.random().toString(36).slice(2, 9)}`;
}

function iconForType(type: string) {
  return FIELD_PALETTE.find((f) => f.type === type)?.icon ?? Type;
}



function PaletteItemButton({ item }: { item: PaletteItem }) {
  const Icon = item.icon;
  return (
    <button
      id={`palette-${item.type}`}
      draggable={false}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm hover:bg-muted transition-colors cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-muted/60 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="font-mono text-xs text-foreground/80 group-hover:text-foreground">
        {item.label}
      </span>
    </button>
  );
}



function CanvasDropZone({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop" });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-y-auto transition-colors ${
        isOver ? "bg-primary/5" : "bg-muted/10"
      }`}
    >
      {isEmpty && (
        <div className="flex flex-col items-center justify-center h-full py-24 text-center pointer-events-none select-none">
          <div
            className={`w-16 h-16 rounded-sm flex items-center justify-center mb-5 border-2 border-dashed transition-colors ${
              isOver
                ? "border-primary/50 bg-primary/10"
                : "border-border/50 bg-muted/30"
            }`}
          >
            <Blocks className={`w-7 h-7 transition-colors ${isOver ? "text-primary/70" : "text-muted-foreground/40"}`} />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {isOver ? "Release to add field" : "Drag components here to build your form"}
          </p>
          <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
            Drop fields from the sidebar to get started
          </p>
        </div>
      )}
      {!isEmpty && (
        <div className="mx-auto max-w-2xl py-8 px-6">
          {children}
        </div>
      )}
    </div>
  );
}



function SortableFieldCard({
  field,
  isSelected,
  onSelect,
  onRemove,
}: {
  field: SchemaField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const Icon = iconForType(field.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-sm border transition-all group cursor-pointer ${
        isSelected
          ? "border-primary/60 bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing shrink-0"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-muted text-muted-foreground shrink-0">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground truncate">{field.label}</p>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          field.{field.type}
          {field.required && <span className="ml-2 text-primary/70">required</span>}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}



function PropertiesPanel({
  field,
  onChange,
}: {
  field: SchemaField;
  onChange: (updates: Partial<SchemaField>) => void;
}) {
  const Icon = iconForType(field.type);

  return (
    <aside className="w-64 shrink-0 flex flex-col border-l border-border bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground select-none">
            Properties
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-5">
          <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-muted/30 px-3 py-2">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs text-muted-foreground capitalize">
              {field.type.replace("_", " ")}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Label
            </label>
            <Input
              value={field.label}
              onChange={(e) => onChange({ label: e.target.value })}
              className="h-8 text-sm font-mono"
              placeholder="Enter field label…"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Required</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Marks this field as mandatory
              </p>
            </div>
            <button
              onClick={() => onChange({ required: !field.required })}
              className={`transition-colors ${
                field.required ? "text-primary" : "text-muted-foreground/50"
              }`}
            >
              {field.required ? (
                <ToggleRight className="h-6 w-6" />
              ) : (
                <ToggleLeft className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              Field ID
            </label>
            <p className="text-xs font-mono text-muted-foreground/70 bg-muted/30 rounded-sm px-2 py-1.5 border border-border/40 break-all">
              {field.id}
            </p>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}


function LiveTerminal({ schema }: { schema: SchemaField[] }) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const { lines } = useTerminalPreview(schema);

  useEffect(() => {
    const t = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  const lastLine = lines[lines.length - 1];

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
              <span className="text-zinc-400">{line.text.replace("parcha@cli ~ $ ", "")}</span>
            </p>
          );
        }
        if (line.type === "success") {
          return <p key={i} className="text-emerald-500/80">{line.text}</p>;
        }
        if (line.type === "muted") {
          return <p key={i} className="text-zinc-600">{line.text}</p>;
        }
        return (
          <p key={i} className="text-cyan-400/90 mt-1">
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



export default function BuilderPage() {
  const router = useRouter();
  const params = useParams<{ formId: string }>();
  const formId = params.formId;

  const [activeActivity, setActiveActivity] = useState("components");
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<PaletteItem | null>(null);

  const me = trpc.auth.me.useQuery(undefined, { retry: false });
  const formQuery = trpc.form.getFormById.useQuery(
    { formId },
    { enabled: !!me.data?.user }
  );
  const updateSchema = trpc.form.updateSchema.useMutation({
    onSuccess: () => toast.success("Schema synced to database."),
    onError: (err) => toast.error(`Save failed: ${err.message}`),
  });

  useEffect(() => {
    if (formQuery.data?.schema && Array.isArray(formQuery.data.schema)) {
      setSchema(formQuery.data.schema as SchemaField[]);
    }
  }, [formQuery.data]);

  useEffect(() => {
    if (me.isError) router.replace("/auth/login");
  }, [me.isError, router]);

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
        const newField: SchemaField = {
          id: generateId(),
          type: palette.type,
          label: palette.label,
          required: false,
        };
        setSchema((prev) => [...prev, newField]);
        setSelectedId(newField.id);
        return;
      }
    }

    // Reorder within canvas
    if (over && active.id !== over.id) {
      setSchema((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function removeField(id: string) {
    setSchema((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function updateField(id: string, updates: Partial<SchemaField>) {
    setSchema((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }

  function handleSave() {
    updateSchema.mutate({ formId, schema });
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
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">

          {/* ── Header ── */}
          <header className="flex items-center justify-between px-4 border-b border-border bg-background shrink-0 h-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm">
              <div className="flex items-center justify-center w-6 h-6 bg-foreground text-background rounded-[4px] font-bold text-[11px] shrink-0">
                P
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Forms
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {formName}
              </span>
            </nav>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center rounded-sm border border-border bg-muted/40 p-0.5">
                {(["visual", "developer"] as const).map((mode) => (
                  <button key={mode} className="px-3 py-1 text-xs font-mono rounded-sm text-muted-foreground hover:text-foreground transition-colors">
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                className="gap-2 text-xs font-mono rounded-sm"
                onClick={handleSave}
                disabled={updateSchema.isPending}
              >
                {updateSchema.isPending ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save Changes
              </Button>
            </div>
          </header>

          {/* ── 4-Pane Workspace ── */}
          <div className="flex-1 flex overflow-hidden">

            {/* Pane A: Activity Bar */}
            <aside className="w-14 shrink-0 flex flex-col items-center py-4 gap-2 border-r border-border bg-muted/30">
              {ACTIVITY_ITEMS.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveActivity(item.id)}
                      className={`flex items-center justify-center w-10 h-10 rounded-sm transition-colors ${
                        activeActivity === item.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs font-mono">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </aside>

            {/* Pane B: Components Sidebar (draggable palette) */}
            <aside className="w-60 shrink-0 flex flex-col border-r border-border bg-background">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground select-none">
                  Components
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                  {FIELD_PALETTE.map((item) => (
                    <SortableContext
                      key={item.type}
                      items={[item.type]}
                      strategy={verticalListSortingStrategy}
                    >
                      {/* We use dnd-kit draggable via useSortable with id=type from palette */}
                      <PaletteDraggable item={item} />
                    </SortableContext>
                  ))}
                </div>
              </ScrollArea>
            </aside>

            {/* Pane C: Editor Canvas + Terminal */}
            <main className="flex-1 relative flex flex-col min-w-0">
              {/* Editor Tabs */}
              <div className="flex border-b border-border bg-muted/20 shrink-0">
                {[
                  { id: "builder", label: "builder.tsx" },
                  { id: "schema", label: "schema.json" },
                ].map((tab, i) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-r border-border transition-colors ${
                      i === 0
                        ? "bg-background text-foreground border-b-2 border-b-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    {tab.label}
                    {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />}
                  </button>
                ))}
              </div>

              {/* Drop Canvas */}
              <CanvasDropZone isEmpty={schema.length === 0}>
                <SortableContext items={schema.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-3">
                    {schema.map((field) => (
                      <SortableFieldCard
                        key={field.id}
                        field={field}
                        isSelected={selectedId === field.id}
                        onSelect={() => setSelectedId(selectedId === field.id ? null : field.id)}
                        onRemove={() => removeField(field.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </CanvasDropZone>

              {/* Pane D: Terminal (bottom, always dark) */}
              <div className="h-44 shrink-0 border-t border-border bg-[#0a0a0a] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <TerminalSquare className="h-3.5 w-3.5 text-emerald-400/70" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                      Terminal Preview
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                    <span className="text-[10px] font-mono text-zinc-600">live</span>
                  </div>
                </div>
                <LiveTerminal schema={schema} />
              </div>
            </main>

            {/* Pane E: Properties Panel (conditionally shown) */}
            {selectedField && (
              <PropertiesPanel
                field={selectedField}
                onChange={(updates) => updateField(selectedField.id, updates)}
              />
            )}
          </div>
        </div>

        {/* DragOverlay — ghost while dragging from palette */}
        <DragOverlay>
          {activeDragItem ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-sm border border-primary/40 bg-card shadow-lg opacity-90">
              <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary shrink-0">
                <activeDragItem.icon className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs text-foreground">{activeDragItem.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </TooltipProvider>
  );
}

/* ────────────────────────────────────────────────────────────
   PALETTE DRAGGABLE (wrapper using useSortable with canvas droppable)
──────────────────────────────────────────────────────────── */

function PaletteDraggable({ item }: { item: PaletteItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: item.type,
  });

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm hover:bg-muted transition-colors cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-sm bg-muted/60 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="font-mono text-xs text-foreground/80 group-hover:text-foreground">
        {item.label}
      </span>
    </div>
  );
}

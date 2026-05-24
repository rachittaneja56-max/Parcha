"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Blocks } from "lucide-react";
import { SortableFieldCard } from "./SortableFieldCard";
import type { SchemaField } from "./constants";

export function CanvasDropZone({
  schema,
  selectedId,
  onSelect,
  onRemove,
}: {
  schema: SchemaField[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop" });
  const isEmpty = schema.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`h-full overflow-y-auto transition-colors ${
        isOver ? "bg-slate-900/50" : "bg-slate-950"
      }`}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full py-24 text-center pointer-events-none select-none bg-slate-950">
          <div
            className={`w-16 h-16 rounded-md flex items-center justify-center mb-5 border-2 border-dashed transition-all ${
              isOver
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                : "border-slate-800 bg-slate-900/50 text-slate-600"
            }`}
          >
            <Blocks
              className={`w-7 h-7 transition-colors ${
                isOver ? "text-indigo-400 animate-pulse" : "text-slate-600"
              }`}
            />
          </div>
          <p className="text-sm font-medium text-slate-400 font-mono">
            {isOver ? "Release to add field" : "Drag components here to build your form"}
          </p>
          <p className="text-xs text-slate-600 mt-2 font-mono">
            Drop fields from the sidebar or press Ctrl+K
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl py-8 px-6">
          <SortableContext
            items={schema.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {schema.map((field) => (
                <SortableFieldCard
                  key={field.id}
                  field={field}
                  isSelected={selectedId === field.id}
                  onSelect={() =>
                    onSelect(selectedId === field.id ? null : field.id)
                  }
                  onRemove={() => onRemove(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
}

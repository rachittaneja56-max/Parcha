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
        isOver ? "bg-[#111]" : "bg-[#0a0a0a]"
      }`}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full py-24 text-center pointer-events-none select-none">
          <div
            className={`w-16 h-16 rounded-sm flex items-center justify-center mb-5 border-2 border-dashed transition-colors ${
              isOver
                ? "border-primary/50 bg-primary/10"
                : "border-border/50 bg-muted/30"
            }`}
          >
            <Blocks
              className={`w-7 h-7 transition-colors ${
                isOver ? "text-primary/70" : "text-muted-foreground/40"
              }`}
            />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {isOver ? "Release to add field" : "Drag components here to build your form"}
          </p>
          <p className="text-xs text-muted-foreground/50 mt-2 font-mono">
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

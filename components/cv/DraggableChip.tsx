"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface DraggableChipProps {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
  className?: string;
}

export const DraggableChip: React.FC<DraggableChipProps> = ({
  id,
  children,
  onRemove,
  className = "bg-gray-100",
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 ${className} px-3 py-1 rounded-full text-sm ${
        isDragging ? "ring-2 ring-blue-500 shadow-lg z-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
        title="Glisser pour réorganiser"
      >
        <GripVertical className="w-3 h-3" />
      </div>
      <span className="text-gray-700">{children}</span>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-red-600 font-bold ml-1"
      >
        ×
      </button>
    </div>
  );
};


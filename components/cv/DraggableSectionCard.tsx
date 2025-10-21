"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, ChevronDown, RotateCw } from "lucide-react";

interface DraggableSectionCardProps {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  expandedSection: string;
  setExpandedSection: (id: string) => void;
  onReset?: () => void;
}

export const DraggableSectionCard: React.FC<DraggableSectionCardProps> = ({
  id,
  title,
  icon: Icon,
  children,
  expandedSection,
  setExpandedSection,
  onReset,
}) => {
  const isExpanded = expandedSection === id;

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
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300 ${
        isDragging ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
    >
      <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing flex items-center gap-2 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Glisser pour réorganiser"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        <button
          onClick={() => setExpandedSection(isExpanded ? "" : id)}
          className="flex-1 flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </button>

        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Réinitialiser cette section"
            >
              <RotateCw className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          )}
          <button onClick={() => setExpandedSection(isExpanded ? "" : id)}>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


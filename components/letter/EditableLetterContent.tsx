"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCw, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface EditableLetterContentProps {
  content: string;
  onContentChange: (content: string);
  onRegenerateParagraph?: (paragraphIndex: number) => Promise<void>;
}

export function EditableLetterContent({
  content,
  onContentChange,
  onRegenerateParagraph,
}: EditableLetterContentProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "");

  const handleStartEdit = (index: number, text: string) => {
    setEditingIndex(index);
    setEditedText(text);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const newParagraphs = [...paragraphs];
    newParagraphs[editingIndex] = editedText;
    const newContent = newParagraphs.join("\n\n");

    onContentChange(newContent);
    setEditingIndex(null);
    toast.success("Paragraphe modifié");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedText("");
  };

  const handleRegenerate = async (index: number) => {
    if (!onRegenerateParagraph) return;

    setRegeneratingIndex(index);
    try {
      await onRegenerateParagraph(index);
    } catch (error) {
      // L'erreur est déjà gérée dans le parent
    } finally {
      setRegeneratingIndex(null);
    }
  };

  // Gestion des raccourcis clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {editingIndex === index ? (
            // Mode édition
            <div className="relative">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[150px] p-4 border-2 border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-800 leading-relaxed"
                autoFocus
              />
              <div className="flex gap-2 mt-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="gap-1"
                >
                  Annuler (Esc)
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="gap-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Check className="w-4 h-4" />
                  Sauvegarder (Ctrl+Enter)
                </Button>
              </div>
            </div>
          ) : (
            // Mode visualisation avec édition au clic
            <div
              className={`relative p-4 rounded-lg cursor-text transition-all duration-200 ${
                hoveredIndex === index
                  ? "bg-purple-50 border-2 border-purple-200"
                  : "border-2 border-transparent"
              }`}
              onClick={() => handleStartEdit(index, paragraph)}
            >
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {paragraph}
              </p>

              {/* Boutons qui apparaissent au survol */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-2 right-2 flex gap-2"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(index, paragraph);
                      }}
                      className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 shadow-sm bg-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                      <span className="text-xs">Modifier</span>
                    </Button>

                    {onRegenerateParagraph && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerate(index);
                        }}
                        disabled={regeneratingIndex === index}
                        className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-100 shadow-sm bg-white"
                      >
                        {regeneratingIndex === index ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Génération...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span className="text-xs">Régénérer</span>
                          </>
                        )}
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicateur de clic */}
              {hoveredIndex === index && (
                <div className="absolute bottom-2 left-2 text-xs text-purple-600 opacity-70">
                  💡 Cliquez pour modifier
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}


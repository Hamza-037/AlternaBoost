"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCw, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface EditableLetterContentProps {
  content: string;
  onContentChange: (content: string) => void;
  onRegenerateParagraph?: (paragraphIndex: number) => Promise<void>;
  primaryColor?: string;
  template?: string;
}

export function EditableLetterContent({
  content,
  onContentChange,
  onRegenerateParagraph,
  primaryColor = "#7C3AED",
  template = "modern",
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

  // Calculer la longueur totale
  const totalLength = content.length;
  const optimalMin = 1500;
  const optimalMax = 2500;
  const progress = Math.min((totalLength / optimalMax) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Indicateur de longueur optimale */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Longueur de la lettre</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full ${totalLength >= optimalMin * 0.3 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${totalLength >= optimalMin * 0.6 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${totalLength >= optimalMin ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${totalLength >= optimalMax ? 'bg-orange-500' : 'bg-gray-300'}`} />
            </div>
            <span className="text-xs text-gray-600">{totalLength} / {optimalMax} caractères</span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full ${
              totalLength < optimalMin ? 'bg-orange-500' :
              totalLength > optimalMax ? 'bg-red-500' :
              'bg-green-500'
            }`}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {totalLength < optimalMin ? `Encore ${optimalMin - totalLength} caractères pour atteindre la longueur minimale` :
           totalLength > optimalMax ? `${totalLength - optimalMax} caractères au-dessus du maximum recommandé` :
           'Longueur optimale ✓'}
        </p>
      </motion.div>

      {paragraphs.map((paragraph, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.08,
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0] // Custom ease
          }}
          whileHover={{ scale: 1.01 }}
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
                className="w-full min-h-[150px] p-4 border-2 rounded-lg focus:outline-none focus:ring-2 resize-none text-gray-800 leading-relaxed"
                style={{
                  borderColor: primaryColor,
                  '--tw-ring-color': primaryColor,
                } as React.CSSProperties}
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="gap-1"
                    style={{
                      backgroundColor: primaryColor,
                    }}
                  >
                    <Check className="w-4 h-4" />
                    Sauvegarder (Ctrl+Enter)
                  </Button>
                </motion.div>
              </div>
            </div>
          ) : (
            // Mode visualisation avec édition au clic
            <div
              className={`relative p-4 rounded-lg cursor-text transition-all duration-200 border-2 ${
                hoveredIndex === index
                  ? "bg-opacity-10"
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: hoveredIndex === index ? `${primaryColor}15` : "transparent",
                borderColor: hoveredIndex === index ? `${primaryColor}40` : "transparent",
              }}
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
                      className="gap-1 shadow-sm bg-white"
                      style={{
                        color: primaryColor,
                      }}
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
                        className="gap-1 shadow-sm bg-white"
                        style={{
                          color: primaryColor,
                        }}
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
                <div 
                  className="absolute bottom-2 left-2 text-xs opacity-70"
                  style={{ color: primaryColor }}
                >
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


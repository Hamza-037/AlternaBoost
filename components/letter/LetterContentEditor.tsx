"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, RotateCw, Check, X } from "lucide-react";
import { toast } from "sonner";

interface LetterContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onRegenerateParagraph?: (paragraphIndex: number) => Promise<void>;
}

export function LetterContentEditor({
  content,
  onContentChange,
  onRegenerateParagraph,
}: LetterContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isRegenerating, setIsRegenerating] = useState<number | null>(null);

  // Découper le contenu en paragraphes
  const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "");

  // Compteur de caractères
  const charCount = editedContent.length;
  const recommendedMin = 1500;
  const recommendedMax = 2500;

  const getCharCountColor = () => {
    if (charCount < recommendedMin) return "text-orange-600";
    if (charCount > recommendedMax) return "text-red-600";
    return "text-green-600";
  };

  const getCharCountMessage = () => {
    if (charCount < recommendedMin) return "Un peu court pour une lettre";
    if (charCount > recommendedMax) return "Peut-être un peu long";
    return "Longueur idéale";
  };

  const handleSave = () => {
    onContentChange(editedContent);
    setIsEditing(false);
    toast.success("Contenu sauvegardé avec succès");
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleRegenerateParagraph = async (index: number) => {
    if (!onRegenerateParagraph) return;
    
    setIsRegenerating(index);
    try {
      await onRegenerateParagraph(index);
      toast.success("Paragraphe régénéré avec succès");
    } catch (error) {
      toast.error("Erreur lors de la régénération");
    } finally {
      setIsRegenerating(null);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Contenu de la lettre</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            Modifier le contenu
          </Button>
        </div>

        {/* Affichage par paragraphes avec option de régénération */}
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {paragraph}
              </p>
              
              {onRegenerateParagraph && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={() => handleRegenerateParagraph(index)}
                  disabled={isRegenerating === index}
                >
                  {isRegenerating === index ? (
                    <>
                      <svg
                        className="animate-spin h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-xs">Régénération...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs">Régénérer ce §</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-600 flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {charCount} caractères • {getCharCountMessage()}
          </span>
        </div>
      </div>
    );
  }

  // Mode édition
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="letter-content" className="text-base font-semibold">
          Modifier le contenu
        </Label>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1">
            <X className="w-4 h-4" />
            Annuler
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1 bg-purple-600 hover:bg-purple-700">
            <Check className="w-4 h-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          id="letter-content"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
          placeholder="Contenu de votre lettre de motivation..."
        />

        {/* Compteur de caractères */}
        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center gap-2 ${getCharCountColor()} font-medium`}>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>
              {charCount} / {recommendedMax} caractères
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {getCharCountMessage()}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              charCount < recommendedMin
                ? "bg-orange-500"
                : charCount > recommendedMax
                ? "bg-red-500"
                : "bg-green-500"
            }`}
            style={{
              width: `${Math.min((charCount / recommendedMax) * 100, 100)}%`,
            }}
          />
        </div>

        {/* Conseils */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Astuce :</strong> Une bonne lettre de motivation fait entre 1500 et 2500 caractères (environ 250-400 mots). Soyez concis et percutant !
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}


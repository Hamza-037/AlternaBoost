"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Download,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CVEditorLayoutProps {
  formContent: ReactNode;
  previewContent: ReactNode;
  onSave?: () => void;
  onDownloadPDF?: () => void;
  isSaving?: boolean;
  saveStatus?: "saved" | "saving" | "error" | null;
}

export function CVEditorLayout({
  formContent,
  previewContent,
  onSave,
  onDownloadPDF,
  isSaving = false,
  saveStatus = null,
}: CVEditorLayoutProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const zoomLevels = [50, 75, 100, 125, 150];

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex < zoomLevels.length - 1) {
      setZoom(zoomLevels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex > 0) {
      setZoom(zoomLevels[currentIndex - 1]);
    }
  };

  const saveStatusConfig = {
    saved: {
      text: "Sauvegardé",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    saving: {
      text: "Sauvegarde...",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    error: {
      text: "Erreur",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Toolbar fixe en haut */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Gauche : Status et actions */}
            <div className="flex items-center gap-4">
              {saveStatus && (
                <Badge
                  variant="outline"
                  className={saveStatusConfig[saveStatus].color}
                >
                  {saveStatusConfig[saveStatus].text}
                </Badge>
              )}
              {onSave && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Sauvegarder</span>
                </Button>
              )}
            </div>

            {/* Centre : Contrôles de preview (desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Masquer l'aperçu
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Afficher l'aperçu
                  </>
                )}
              </Button>

              {showPreview && (
                <>
                  <div className="h-6 w-px bg-gray-300" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom === zoomLevels[0]}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-gray-700 min-w-[4rem] text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom === zoomLevels[zoomLevels.length - 1]}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Droite : Télécharger PDF */}
            {onDownloadPDF && (
              <Button
                onClick={onDownloadPDF}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                size="sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Télécharger PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 relative">
          {/* Colonne gauche : Formulaire */}
          <motion.div
            className={`flex-shrink-0 transition-all duration-300 ${
              isSidebarCollapsed ? "w-12" : "w-full lg:w-[45%]"
            }`}
            animate={{
              width: isSidebarCollapsed
                ? "3rem"
                : window.innerWidth >= 1024
                ? "45%"
                : "100%",
            }}
          >
            {/* Bouton de collapse (desktop uniquement) */}
            <div className="hidden lg:block mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="gap-2"
              >
                {isSidebarCollapsed ? (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    Afficher le formulaire
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    Réduire
                  </>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {formContent}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Colonne droite : Preview (desktop) ou bouton (mobile) */}
          <div className="hidden lg:block flex-1 min-w-0">
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-24"
                >
                  <Card className="p-6 bg-white shadow-lg border-2 border-gray-200">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Aperçu en temps réel
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Mise à jour automatique
                      </Badge>
                    </div>

                    {/* Container de la preview avec zoom */}
                    <div className="overflow-auto max-h-[calc(100vh-12rem)] bg-gray-50 rounded-lg p-4">
                      <div
                        style={{
                          transform: `scale(${zoom / 100})`,
                          transformOrigin: "top center",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        className="w-full"
                      >
                        {previewContent}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton flottant pour preview mobile */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-full shadow-2xl w-14 h-14 p-0"
              size="lg"
            >
              {showPreview ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Modal preview mobile */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowPreview(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Aperçu du CV
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(false)}
                    >
                      Fermer
                    </Button>
                  </div>
                  {previewContent}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


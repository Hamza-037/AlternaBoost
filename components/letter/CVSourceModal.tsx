"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  Edit,
  FileCheck,
  Loader2,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CVSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportFromCreatedCV: () => void;
  onImportFromPDF: (data: any) => void;
  onFillManually: () => void;
}

export function CVSourceModal({
  isOpen,
  onClose,
  onImportFromCreatedCV,
  onImportFromPDF,
  onFillManually,
}: CVSourceModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est un PDF
    if (file.type !== "application/pdf") {
      toast.error("Format non supporté", {
        description: "Veuillez uploader un fichier PDF",
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fichier trop volumineux", {
        description: "La taille maximale est de 5MB",
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'extraction");
      }

      const result = await response.json();

      console.log("Réponse API extract-cv:", result);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Échec de l'extraction");
      }

      const extractedData = result.data;

      toast.success("CV importé avec succès !", {
        description: "Vos informations ont été extraites",
      });

      // Transmettre les données extraites
      onImportFromPDF({
        prenom: extractedData.prenom || "",
        nom: extractedData.nom || "",
        email: extractedData.email || "",
        telephone: extractedData.telephone || "",
        adresse: extractedData.adresse || "",
      });

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'extraction du CV:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      toast.error("Erreur lors de l'extraction", {
        description: errorMessage || "Impossible d'extraire les données de votre CV. Veuillez réessayer.",
      });
    } finally {
      setIsUploading(false);
      setUploadedFile(null);
    }
  };

  const options = [
    {
      id: "created-cv",
      title: "Importer depuis mon CV",
      description: "Utilisez un CV que vous avez créé sur la plateforme",
      icon: FileCheck,
      color: "from-blue-500 to-cyan-500",
      action: () => {
        onImportFromCreatedCV();
        onClose();
      },
    },
    {
      id: "upload-pdf",
      title: "Uploader un CV PDF",
      description: "Importez un CV existant (extraction automatique)",
      icon: Upload,
      color: "from-purple-500 to-pink-500",
      action: () => {
        // Déclencher le sélecteur de fichier
        document.getElementById("cv-pdf-upload")?.click();
      },
    },
    {
      id: "manual",
      title: "Remplir manuellement",
      description: "Créez votre lettre sans importer de CV",
      icon: Edit,
      color: "from-orange-500 to-red-500",
      action: () => {
        onFillManually();
        onClose();
      },
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Comment souhaitez-vous créer votre lettre ?
            </DialogTitle>
            <DialogDescription>
              Choisissez la méthode qui vous convient le mieux
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-6">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-400 hover:bg-purple-50/50"
                    onClick={option.action}
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Gradient Background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      />

                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base mb-1 group-hover:text-purple-600 transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>

                      {/* Hover Arrow */}
                      <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Info supplémentaire */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">💡 Astuce</p>
              <p>
                En important un CV, vos informations personnelles seront automatiquement
                pré-remplies pour gagner du temps !
              </p>
            </div>
          </div>

          {/* Upload en cours */}
          {isUploading && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <div className="flex-1">
                  <p className="font-semibold text-purple-900">
                    Extraction en cours...
                  </p>
                  <p className="text-sm text-purple-700">
                    Analyse de votre CV : {uploadedFile?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Input caché pour l'upload de PDF */}
      <input
        id="cv-pdf-upload"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </>
  );
}


"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { ExtractedCVData } from "@/types/cv-extraction";

interface CVUploaderProps {
  onExtractSuccess: (data: ExtractedCVData) => void;
  onSkip: () => void;
}

export function CVUploader({ onExtractSuccess, onSkip }: CVUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionStatus, setExtractionStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    setExtractionStatus("uploading");

    try {
      // Créer le FormData
      const formData = new FormData();
      formData.append("file", file);

      // Appeler l'API d'extraction
      const response = await fetch("/api/extract-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'extraction");
      }

      const result = await response.json();

      if (result.success && result.data) {
        setExtractionStatus("success");
        toast.success("CV extrait avec succès !");
        
        // Attendre un peu pour montrer le succès
        setTimeout(() => {
          onExtractSuccess(result.data);
        }, 1000);
      } else {
        throw new Error("Données extraites invalides");
      }
    } catch (error) {
      console.error("Erreur extraction:", error);
      setExtractionStatus("error");
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible d'extraire les données du CV"
      );
    } finally {
      setIsUploading(false);
    }
  }, [onExtractSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setExtractionStatus("idle");
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* En-tête */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Importez votre CV existant
            </h3>
            <p className="text-sm text-gray-600">
              Gagnez du temps ! Nous extrayons automatiquement vos informations
            </p>
          </div>

          {/* Zone de drop */}
          {!uploadedFile && (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-all duration-200
                ${isDragActive 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }
                ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    ${isDragActive ? "bg-blue-100" : "bg-gray-100"}
                  `}>
                    <FileText className={`w-8 h-8 ${isDragActive ? "text-blue-600" : "text-gray-400"}`} />
                  </div>
                </div>

                {isDragActive ? (
                  <p className="text-blue-600 font-medium">
                    Déposez votre CV ici...
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">
                      Glissez-déposez votre CV ici
                    </p>
                    <p className="text-sm text-gray-500">
                      ou cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, DOCX ou TXT (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fichier uploadé */}
          {uploadedFile && (
            <div className="space-y-4">
              <div className={`
                flex items-center justify-between p-4 rounded-lg border-2
                ${extractionStatus === "success" ? "border-green-200 bg-green-50" : ""}
                ${extractionStatus === "error" ? "border-red-200 bg-red-50" : ""}
                ${extractionStatus === "uploading" ? "border-blue-200 bg-blue-50" : ""}
                ${extractionStatus === "idle" ? "border-gray-200 bg-gray-50" : ""}
              `}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${extractionStatus === "success" ? "bg-green-100" : ""}
                    ${extractionStatus === "error" ? "bg-red-100" : ""}
                    ${extractionStatus === "uploading" ? "bg-blue-100" : ""}
                    ${extractionStatus === "idle" ? "bg-gray-100" : ""}
                  `}>
                    {extractionStatus === "uploading" && (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    )}
                    {extractionStatus === "success" && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {extractionStatus === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    {extractionStatus === "idle" && (
                      <FileText className="w-5 h-5 text-gray-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                      {extractionStatus === "uploading" && " • Extraction en cours..."}
                      {extractionStatus === "success" && " • ✓ Extraction réussie"}
                      {extractionStatus === "error" && " • ✗ Erreur d'extraction"}
                    </p>
                  </div>
                </div>

                {!isUploading && extractionStatus !== "success" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {extractionStatus === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Impossible d'extraire les données. Veuillez vérifier que le fichier est bien un CV ou remplissez le formulaire manuellement.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onSkip}
              disabled={isUploading}
              className="flex-1"
            >
              Remplir manuellement
            </Button>
            
            {extractionStatus === "error" && (
              <Button
                onClick={() => {
                  removeFile();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Réessayer
              </Button>
            )}
          </div>

          {/* Avantages */}
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-gray-700 mb-3">
              Pourquoi importer votre CV ?
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Gain de temps : toutes vos infos sont pré-remplies automatiquement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>IA intelligente : extraction précise de vos expériences et compétences</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>100% sécurisé : vos données restent privées et ne sont pas stockées</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

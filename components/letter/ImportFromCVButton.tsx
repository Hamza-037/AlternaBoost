"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImportFromCVButtonProps {
  onImport: (data: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
  }) => void;
}

export function ImportFromCVButton({ onImport }: ImportFromCVButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = () => {
    setIsLoading(true);

    try {
      // Récupérer les données du dernier CV depuis sessionStorage
      const lastCVData = sessionStorage.getItem("generated_cv");
      
      if (!lastCVData) {
        toast.error("Aucun CV trouvé", {
          description: "Créez d'abord un CV pour importer vos informations",
        });
        setIsLoading(false);
        return;
      }

      const cvData = JSON.parse(lastCVData);

      // Extraire les informations personnelles
      const importedData = {
        prenom: cvData.prenom || "",
        nom: cvData.nom || "",
        email: cvData.email || "",
        telephone: cvData.telephone || "",
        adresse: cvData.adresse || "",
      };

      // Vérifier qu'il y a au moins quelques données
      const hasData = Object.values(importedData).some((val) => val.trim() !== "");

      if (!hasData) {
        toast.error("Données incomplètes", {
          description: "Le CV trouvé ne contient pas assez d'informations",
        });
        setIsLoading(false);
        return;
      }

      // Appeler le callback avec les données
      onImport(importedData);

      // Notification de succès
      toast.success("Informations importées avec succès", {
        description: `${importedData.prenom} ${importedData.nom}`,
      });
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      toast.error("Erreur lors de l'importation", {
        description: "Impossible de récupérer les données du CV",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleImport}
      disabled={isLoading}
      className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Import en cours...</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>Importer depuis mon CV</span>
        </>
      )}
    </Button>
  );
}


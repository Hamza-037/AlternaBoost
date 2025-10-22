"use client";

import { useState, useEffect } from "react";
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
  Calendar,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CreatedCV {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  titre?: string;
  template: string;
  createdAt: string;
}

interface SelectCreatedCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (data: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
  }) => void;
}

export function SelectCreatedCVModal({
  isOpen,
  onClose,
  onSelect,
}: SelectCreatedCVModalProps) {
  const [cvs, setCvs] = useState<CreatedCV[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCreatedCVs();
    }
  }, [isOpen]);

  const loadCreatedCVs = () => {
    setIsLoading(true);
    
    // Charger les CVs depuis localStorage
    try {
      const savedCVs: CreatedCV[] = [];
      
      // Récupérer tous les CVs sauvegardés
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("cv_")) {
          const cvData = localStorage.getItem(key);
          if (cvData) {
            try {
              const cv = JSON.parse(cvData);
              savedCVs.push({
                id: key,
                prenom: cv.prenom || "",
                nom: cv.nom || "",
                email: cv.email || "",
                telephone: cv.telephone || "",
                adresse: cv.adresse || "",
                titre: cv.titre || cv.objectif?.substring(0, 50) || "CV sans titre",
                template: cv.template || "modern",
                createdAt: cv.createdAt || new Date().toISOString(),
              });
            } catch (e) {
              console.error("Erreur parsing CV:", e);
            }
          }
        }
      }

      // Trier par date (plus récent en premier)
      savedCVs.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setCvs(savedCVs);
    } catch (error) {
      console.error("Erreur lors du chargement des CVs:", error);
      toast.error("Erreur lors du chargement de vos CVs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCV = (cv: CreatedCV) => {
    setSelectedCV(cv.id);
    
    // Transmettre les données
    onSelect({
      prenom: cv.prenom,
      nom: cv.nom,
      email: cv.email,
      telephone: cv.telephone,
      adresse: cv.adresse,
    });

    toast.success("CV importé !", {
      description: `Les informations de "${cv.prenom} ${cv.nom}" ont été importées`,
    });

    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTemplateColor = (template: string) => {
    const colors: Record<string, string> = {
      modern: "from-blue-500 to-cyan-500",
      premium: "from-purple-500 to-pink-500",
      creative: "from-orange-500 to-red-500",
      minimal: "from-gray-600 to-gray-800",
    };
    return colors[template] || "from-blue-500 to-cyan-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sélectionnez un CV
          </DialogTitle>
          <DialogDescription>
            Choisissez le CV dont vous souhaitez importer les informations
          </DialogDescription>
        </DialogHeader>

        {/* Chargement */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">Chargement de vos CVs...</p>
          </div>
        )}

        {/* Aucun CV */}
        {!isLoading && cvs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun CV trouvé</h3>
            <p className="text-gray-600 text-center mb-6">
              Vous n&apos;avez pas encore créé de CV sur la plateforme.
            </p>
            <Button
              onClick={() => {
                onClose();
                window.location.href = "/create-cv";
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Créer mon premier CV
            </Button>
          </div>
        )}

        {/* Liste des CVs */}
        {!isLoading && cvs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {cvs.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 ${
                    selectedCV === cv.id
                      ? "border-2 border-purple-500 ring-2 ring-purple-200"
                      : "border-2 hover:border-purple-300"
                  }`}
                  onClick={() => handleSelectCV(cv)}
                >
                  <div className="p-5">
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getTemplateColor(
                        cv.template
                      )} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />

                    {/* Header avec icône */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTemplateColor(
                          cv.template
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate group-hover:text-purple-600 transition-colors">
                          {cv.prenom} {cv.nom}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {cv.titre}
                        </p>
                      </div>
                      {selectedCV === cv.id && (
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      )}
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">{cv.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{cv.telephone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>Créé le {formatDate(cv.createdAt)}</span>
                      </div>
                    </div>

                    {/* Badge template */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {cv.template}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


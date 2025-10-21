"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";

interface CVExample {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  formation: string;
  ecole: string;
  anneeDiplome: number;
  anneeFormation: string;
  experiences: any[];
  competences: string;
  objectif: string;
  entrepriseCiblee: string;
  experiencesOriginales: string[];
  experiencesAmeliorees: { poste: string; entreprise: string; periode: string; description: string }[];
  competencesOriginales: string[];
  competencesAmeliorees: string[];
  objectifAmeliore: string;
  category: string;
  template: string;
  popularity?: number;
  isNew?: boolean;
  previewImage?: string;
}

interface CVExampleModalProps {
  cv: CVExample | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function CVExampleModal({
  cv,
  isOpen,
  onClose,
  onDownload,
  isDownloading,
}: CVExampleModalProps) {
  if (!cv) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {cv.prenom} {cv.nom}
              </DialogTitle>
              <p className="text-gray-600 mt-1">{cv.formation}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {cv.category}
              </Badge>
              {cv.isNew && (
                <Badge className="bg-green-600">
                  Nouveau
                </Badge>
              )}
              {cv.popularity && cv.popularity > 100 && (
                <Badge className="bg-orange-600">
                  Populaire
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Aperçu visuel du CV */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
            style={{ aspectRatio: "210/297" }} // Format A4
          >
            {cv.previewImage ? (
              <Image
                src={cv.previewImage}
                alt={`CV de ${cv.prenom} ${cv.nom}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center p-8">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-blue-400"
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
                  <p className="text-gray-600 font-medium">
                    Aperçu du CV - Template {cv.template}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Téléchargez pour voir le résultat complet
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Expériences professionnelles
                </h3>
                <div className="space-y-3">
                  {cv.experiencesAmeliorees.slice(0, 2).map((exp, i) => (
                    <div
                      key={i}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <p className="font-medium text-gray-900">{exp.poste}</p>
                      <p className="text-sm text-blue-700">{exp.entreprise}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                  {cv.experiencesAmeliorees.length > 2 && (
                    <p className="text-sm text-gray-500 italic">
                      +{cv.experiencesAmeliorees.length - 2} autres expériences
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Formation
                </h3>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="font-medium text-gray-900">{cv.formation}</p>
                  <p className="text-sm text-purple-700">{cv.ecole}</p>
                  <p className="text-sm text-gray-600">Diplôme : {cv.anneeDiplome}</p>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Compétences clés
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.competencesAmeliorees.map((comp, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-white border-blue-200 text-blue-700"
                    >
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  Template utilisé
                </h3>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <p className="font-medium text-gray-900">{cv.template}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Design professionnel optimisé pour l&apos;ATS
                  </p>
                </div>
              </div>

              {cv.popularity && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    Statistiques
                  </h3>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-orange-700">
                        {cv.popularity}+
                      </span>{" "}
                      téléchargements
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bouton de téléchargement */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onDownload}
              disabled={isDownloading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Téléchargement en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Télécharger ce CV (PDF)
                </span>
              )}
            </Button>
            <Button onClick={onClose} variant="outline" size="lg">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

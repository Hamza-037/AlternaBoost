"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CVPreviewHTML } from "@/components/preview/CVPreviewHTML";
import { CVAnalysis } from "@/components/preview/CVAnalysis";
import { CVCustomizer } from "@/components/cv/CVCustomizer";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import type { GeneratedCV, CVStyle, CVSection } from "@/types/cv";

export default function PreviewCVPage() {
  const router = useRouter();
  const [cvData, setCvData] = useState<GeneratedCV | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"premium" | "modern">("modern");
  const [profileImage, setProfileImage] = useState<string>("");
  
  // Style et sections personnalisées
  const [cvStyle, setCvStyle] = useState<CVStyle>({
    template: "modern",
    colorScheme: {
      primary: "#2563EB",
      secondary: "#3B82F6",
      accent: "#60A5FA",
      text: "#111827",
      background: "#FFFFFF",
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
    },
    layout: {
      spacing: "normal",
      sectionIcons: true,
    },
  });
  const [customSections, setCustomSections] = useState<CVSection[]>([]);

  useEffect(() => {
    // Récupérer les données du CV depuis sessionStorage
    const storedData = sessionStorage.getItem("generated_cv");
    if (storedData) {
      const data = JSON.parse(storedData);
      setCvData(data);
      // Charger les préférences de template et photo si elles existent
      setSelectedTemplate(data.template || "modern");
      setProfileImage(data.profileImageUrl || "");
      
      // Charger le style personnalisé
      if (data.style) {
        setCvStyle(data.style);
      }
      
      // Charger les sections personnalisées
      if (data.sectionsPersonnalisees) {
        setCustomSections(data.sectionsPersonnalisees);
      }
    } else {
      // Si pas de données, rediriger vers le formulaire
      router.push("/create-cv");
    }
  }, [router]);

  const handleUpdate = (field: string, value: unknown) => {
    if (!cvData) return;

    // Fonction spéciale pour les tableaux d'expériences
    if (field === "experiencesAmeliorees" && Array.isArray(value)) {
      setCvData({ ...cvData, experiencesAmeliorees: value });
      return;
    }

    // Fonction spéciale pour les compétences
    if (field === "competencesAmeliorees" && Array.isArray(value)) {
      setCvData({ ...cvData, competencesAmeliorees: value });
      return;
    }

    // Mise à jour simple pour les autres champs
    setCvData({ ...cvData, [field]: value });
  };

  const handleDownloadPDF = async () => {
    if (!cvData) return;

    setIsDownloading(true);
    try {
      // Inclure toutes les options de personnalisation dans les données envoyées
      const dataToSend = {
        ...cvData,
        template: cvStyle.template,
        profileImageUrl: profileImage || undefined,
        style: cvStyle,
        sectionsPersonnalisees: customSections,
      };

      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la génération du PDF");
      }

      // Télécharger le PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_${cvData.prenom}_${cvData.nom}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors du téléchargement"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!cvData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href="/create-cv">
                <Button variant="ghost" className="mb-4">
                  ← Retour au formulaire
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900">
                Aperçu de votre CV
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Modifiez directement les champs ou téléchargez votre CV
              </p>
            </div>
            <Badge
              variant={isEditing ? "default" : "secondary"}
              className="h-8 px-4"
            >
              {isEditing ? "Mode Édition" : "Mode Aperçu"}
            </Badge>
          </div>

          {/* Actions */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-3">
                <Button
                  variant={isEditing ? "secondary" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
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
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Aperçu
                    </>
                  ) : (
                    <>
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
                      Modifier
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const storedData = sessionStorage.getItem("generated_cv");
                    if (storedData) {
                      setCvData(JSON.parse(storedData));
                      setIsEditing(false);
                    }
                  }}
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
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 16v5h5" />
                  </svg>
                  Réinitialiser
                </Button>
              </div>

              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
              >
                {isDownloading ? (
                  <>
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
                    Téléchargement...
                  </>
                ) : (
                  <>
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
                    Télécharger en PDF
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Grille 3 colonnes : Personnalisation + Aperçu + Analyse */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Colonne gauche : Personnalisation (1/4) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <CVCustomizer
              style={cvStyle}
              sections={customSections}
              onStyleChange={setCvStyle}
              onSectionsChange={setCustomSections}
            />
          </motion.div>

          {/* Colonne centrale : Aperçu du CV (2/4) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            {isEditing && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Mode édition activé</strong> : Cliquez sur les
                  champs pour les modifier directement.
                </p>
              </div>
            )}

            <CVPreviewHTML
              data={cvData}
              isEditing={isEditing}
              onUpdate={handleUpdate}
              style={cvStyle}
              customSections={customSections}
            />
          </motion.div>

          {/* Colonne droite : Photo + Analyse IA (1/4) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Upload de photo (si template moderne) */}
            {cvStyle.template === "modern" && (
              <Card className="p-6 shadow-lg border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                    className="text-blue-600"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  Photo de profil
                </h3>
                <div className="space-y-3">
                  <input
                    type="url"
                    placeholder="https://exemple.com/photo.jpg"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Collez l&apos;URL d&apos;une image (JPG, PNG)
                  </p>
                  {profileImage && (
                    <div className="flex justify-center mt-2">
                      <img
                        src={profileImage}
                        alt="Aperçu"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                        onError={() => {
                          setProfileImage("");
                          alert("URL d'image invalide");
                        }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Analyse IA */}
            <CVAnalysis cvData={cvData} />

            {/* Info supplémentaire */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ✨ Prochaines étapes
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Analysez votre CV avec l&apos;IA</li>
                <li>• Modifiez les champs si nécessaire</li>
                <li>• Téléchargez votre CV en PDF</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}


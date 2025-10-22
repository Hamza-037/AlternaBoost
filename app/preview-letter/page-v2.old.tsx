"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { LetterCustomizer } from "@/components/letter/LetterCustomizer";
import { LetterContentEditor } from "@/components/letter/LetterContentEditor";
import { ClassicLetterTemplate } from "@/components/letter/templates/ClassicLetterTemplate";
import { ModernLetterTemplate } from "@/components/letter/templates/ModernLetterTemplate";
import { CreativeLetterTemplate } from "@/components/letter/templates/CreativeLetterTemplate";
import type { GeneratedLetter, LetterStyle, LetterSection } from "@/types/letter";
import { toast } from "sonner";
import { Download, ArrowLeft, Sparkles, Eye } from "lucide-react";

export default function PreviewLetterPageEnhanced() {
  const router = useRouter();
  const [letterData, setLetterData] = useState<GeneratedLetter | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Style et sections personnalisées pour les lettres
  const [letterStyle, setLetterStyle] = useState<LetterStyle>({
    template: "classic",
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
      showIcons: false,
      showBorders: false,
    },
  });
  const [customSections, setCustomSections] = useState<LetterSection[]>([]);

  useEffect(() => {
    // Récupérer les données de la lettre depuis sessionStorage
    const storedData = sessionStorage.getItem("generated_letter");
    if (storedData) {
      const data = JSON.parse(storedData);
      setLetterData(data);
      
      // Charger le style personnalisé s'il existe
      if (data.style) {
        setLetterStyle(data.style);
      }
      
      // Charger les sections personnalisées s'il y en a
      if (data.sectionsPersonnalisees) {
        setCustomSections(data.sectionsPersonnalisees);
      }
    } else {
      // Si pas de données, rediriger vers le formulaire
      router.push("/create-letter");
    }
  }, [router]);

  const handleContentChange = (newContent: string) => {
    if (!letterData) return;
    const updated = { ...letterData, contenuGenere: newContent };
    setLetterData(updated);
    try {
      sessionStorage.setItem("generated_letter", JSON.stringify(updated));
      toast.success("Contenu sauvegardé");
    } catch {
      // Ignorer les erreurs de stockage
    }
  };

  const handleRegenerateParagraph = async (paragraphIndex: number) => {
    if (!letterData) return;

    try {
      const response = await fetch("/api/regenerate-letter-paragraph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          letterData,
          paragraphIndex,
          context: {
            posteVise: letterData.posteVise,
            entreprise: letterData.entreprise,
            motivations: letterData.motivations,
            atouts: letterData.atouts,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la régénération");
      }

      const { newParagraph } = await response.json();
      
      // Remplacer le paragraphe dans le contenu
      const paragraphs = letterData.contenuGenere.split("\n\n");
      paragraphs[paragraphIndex] = newParagraph;
      const newContent = paragraphs.join("\n\n");
      
      handleContentChange(newContent);
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  };

  const handleDownloadPDF = async () => {
    if (!letterData) return;

    setIsDownloading(true);
    try {
      const dataToSend = {
        ...letterData,
        style: letterStyle,
        sectionsPersonnalisees: customSections,
      };

      const response = await fetch("/api/generate-letter", {
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Lettre_Motivation_${letterData.prenom}_${letterData.nom}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Lettre de motivation téléchargée avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors du téléchargement"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Rendu du template approprié
  const renderTemplate = () => {
    if (!letterData) return null;

    const templateProps = {
      prenom: letterData.prenom,
      nom: letterData.nom,
      email: letterData.email,
      telephone: letterData.telephone,
      adresse: letterData.adresse,
      entreprise: letterData.entreprise,
      destinataire: letterData.destinataire,
      posteVise: letterData.posteVise,
      generatedContent: letterData.contenuGenere,
      primaryColor: letterStyle.colorScheme.primary,
    };

    switch (letterStyle.template) {
      case "modern":
        return <ModernLetterTemplate {...templateProps} />;
      case "creative":
        return (
          <CreativeLetterTemplate
            {...templateProps}
            accentColor={letterStyle.colorScheme.secondary}
          />
        );
      case "classic":
      default:
        return <ClassicLetterTemplate {...templateProps} />;
    }
  };

  if (!letterData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20">
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
                <Link href="/create-letter">
                  <Button variant="ghost" className="mb-4 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Retour au formulaire
                  </Button>
                </Link>
                <h1 className="text-4xl font-bold text-gray-900">
                  Aperçu de votre lettre de motivation
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Personnalisez le style et le contenu de votre lettre
                </p>
              </div>
              <Badge className="h-8 px-4 bg-purple-600 hover:bg-purple-700 text-white">
                <Eye className="w-4 h-4 mr-1" />
                Mode Aperçu
              </Badge>
            </div>

            {/* Actions */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const storedData = sessionStorage.getItem("generated_letter");
                      if (storedData) {
                        setLetterData(JSON.parse(storedData));
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
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
                      <Download className="w-5 h-5" />
                      Télécharger en PDF
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Grille 3 colonnes : Personnalisation + Aperçu + Contenu */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Colonne gauche : Personnalisation (1/4) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <LetterCustomizer
                style={letterStyle}
                sections={customSections}
                onStyleChange={(newStyle) => {
                  setLetterStyle(newStyle);
                  // Sauvegarder dans sessionStorage
                  const updated = { ...letterData, style: newStyle };
                  sessionStorage.setItem("generated_letter", JSON.stringify(updated));
                }}
                onSectionsChange={setCustomSections}
              />

              {/* Informations */}
              <Card className="p-6 shadow-lg border-2 border-purple-100 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Informations
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Poste visé :</span>
                    <p className="text-gray-600">{letterData.posteVise}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Entreprise :</span>
                    <p className="text-gray-600">{letterData.entreprise}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Template :</span>
                    <p className="text-gray-600 capitalize">{letterStyle.template}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Colonne centrale : Aperçu de la lettre (2/4) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-200 overflow-hidden">
                {/* Toolbar de zoom */}
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Aperçu de la lettre</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {letterStyle.template === "classic" ? "📋 Classique" : 
                       letterStyle.template === "modern" ? "✨ Moderne" : 
                       "🎨 Créatif"}
                    </Badge>
                  </div>
                </div>

                {/* Rendu du template */}
                <div className="overflow-auto max-h-[800px] bg-gray-50 p-8">
                  {renderTemplate()}
                </div>
              </div>
            </motion.div>

            {/* Colonne droite : Éditeur de contenu (1/4) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <Card className="p-6 border-purple-100 shadow-lg">
                <LetterContentEditor
                  content={letterData.contenuGenere}
                  onContentChange={handleContentChange}
                  onRegenerateParagraph={handleRegenerateParagraph}
                />
              </Card>

              {/* Conseils */}
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ✨ Conseils d'écriture
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Personnalisez pour chaque entreprise</li>
                  <li>• Mentionnez des éléments concrets</li>
                  <li>• Restez professionnel mais authentique</li>
                  <li>• Relisez avant envoi</li>
                </ul>
              </Card>

              {/* Prochaines étapes */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🚀 Prochaines étapes
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Personnalisez le style</li>
                  <li>• Modifiez le contenu si nécessaire</li>
                  <li>• Téléchargez votre lettre en PDF</li>
                  <li>• Envoyez avec votre CV</li>
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


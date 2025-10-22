"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { LetterCustomizer } from "@/components/letter/LetterCustomizer";
import { EditableLetterContent } from "@/components/letter/EditableLetterContent";
import { ClassicLetterTemplate } from "@/components/letter/templates/ClassicLetterTemplate";
import { ModernLetterTemplate } from "@/components/letter/templates/ModernLetterTemplate";
import { CreativeLetterTemplate } from "@/components/letter/templates/CreativeLetterTemplate";
import type { GeneratedLetter, LetterStyle, LetterSection } from "@/types/letter";
import { toast } from "sonner";
import {
  Download,
  ArrowLeft,
  Eye,
  SidebarClose,
  SidebarOpen,
  Save,
  Info,
  Sparkles,
} from "lucide-react";

export default function PreviewLetterPageV3() {
  const router = useRouter();
  const [letterData, setLetterData] = useState<GeneratedLetter | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Style et sections personnalisées
  const [letterStyle, setLetterStyle] = useState<LetterStyle>({
    template: "modern",
    colorScheme: {
      primary: "#7C3AED",
      secondary: "#8B5CF6",
      accent: "#A78BFA",
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
    const storedData = sessionStorage.getItem("generated_letter");
    if (storedData) {
      const data = JSON.parse(storedData);
      setLetterData(data);

      if (data.style) {
        setLetterStyle(data.style);
      }

      if (data.sectionsPersonnalisees) {
        setCustomSections(data.sectionsPersonnalisees);
      }
    } else {
      router.push("/create-letter");
    }
  }, [router]);

  const handleContentChange = (newContent: string) => {
    if (!letterData) return;
    const updated = { ...letterData, contenuGenere: newContent };
    setLetterData(updated);
    try {
      sessionStorage.setItem("generated_letter", JSON.stringify(updated));
      setLastSaved(new Date());
      toast.success("Modifications sauvegardées");
    } catch {
      toast.error("Erreur de sauvegarde");
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

      const paragraphs = letterData.contenuGenere.split("\n\n");
      paragraphs[paragraphIndex] = newParagraph;
      const newContent = paragraphs.join("\n\n");

      handleContentChange(newContent);
      toast.success("Paragraphe régénéré avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de régénérer le paragraphe");
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

      toast.success("Lettre téléchargée avec succès !");
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

  const renderLetterPreview = () => {
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
        <div className="container mx-auto px-4 py-6">
          {/* Header avec actions */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link href="/create-letter">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Lettre de motivation
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {letterData.posteVise} • {letterData.entreprise}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {lastSaved && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Save className="w-3 h-3" />
                    Sauvegardé à {lastSaved.toLocaleTimeString("fr-FR")}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="gap-2"
                >
                  {isSidebarOpen ? (
                    <>
                      <SidebarClose className="w-4 h-4" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <SidebarOpen className="w-4 h-4" />
                      Options
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
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
                      <Download className="w-4 h-4" />
                      Télécharger PDF
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Badges informatifs */}
            <div className="flex gap-2">
              <Badge className="bg-purple-600 hover:bg-purple-700">
                <Eye className="w-3 h-3 mr-1" />
                Mode Aperçu
              </Badge>
              <Badge variant="outline" className="text-xs">
                {letterStyle.template === "classic"
                  ? "📋 Classique"
                  : letterStyle.template === "modern"
                  ? "✨ Moderne"
                  : "🎨 Créatif"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {letterData.contenuGenere.length} caractères
              </Badge>
            </div>
          </motion.div>

          {/* Layout principal : 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar gauche - Personnalisation */}
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3"
              >
                <div className="sticky top-24 space-y-4">
                  <LetterCustomizer
                    style={letterStyle}
                    sections={customSections}
                    onStyleChange={(newStyle) => {
                      setLetterStyle(newStyle);
                      const updated = { ...letterData, style: newStyle };
                      sessionStorage.setItem("generated_letter", JSON.stringify(updated));
                      setLastSaved(new Date());
                    }}
                    onSectionsChange={setCustomSections}
                  />

                  {/* Conseils */}
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-purple-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-purple-600" />
                      💡 Astuces
                    </h3>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li>• Cliquez sur un paragraphe pour le modifier</li>
                      <li>• Survolez pour voir les boutons d'action</li>
                      <li>• Ctrl+Enter pour sauvegarder rapidement</li>
                      <li>• Les modifications sont auto-sauvegardées</li>
                    </ul>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Zone centrale - Aperçu de la lettre ÉLARGI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${isSidebarOpen ? "lg:col-span-9" : "lg:col-span-12"}`}
            >
              <Card className="overflow-hidden shadow-2xl">
                {/* Toolbar */}
                <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 font-medium">
                      ✏️ Cliquez sur un paragraphe pour modifier
                    </span>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      Régénération IA disponible
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Format A4
                  </Badge>
                </div>

                {/* Contenu de la lettre avec styling selon template */}
                <div className="relative">
                  {/* Contenu éditable avec style du template */}
                  <div 
                    className="bg-white p-12 min-h-[1000px]"
                    style={{
                      fontFamily: letterStyle.typography.bodyFont,
                    }}
                  >
                    {/* Header de la lettre avec couleur du template */}
                    <div 
                      className="mb-8 pb-6 border-b-2"
                      style={{ 
                        borderColor: letterStyle.colorScheme.primary,
                      }}
                    >
                      <h2 
                        className="text-2xl font-bold"
                        style={{ 
                          color: letterStyle.template === "classic" ? "#111827" : letterStyle.colorScheme.primary,
                          fontFamily: letterStyle.typography.headingFont,
                        }}
                      >
                        {letterData.prenom} {letterData.nom}
                      </h2>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>📧 {letterData.email}</p>
                        <p>📱 {letterData.telephone}</p>
                        <p>📍 {letterData.adresse}</p>
                      </div>
                    </div>

                    {/* Infos destinataire */}
                    <div className="mb-8 text-sm">
                      <p className="font-semibold text-gray-900">{letterData.entreprise}</p>
                      {letterData.destinataire && (
                        <p className="text-gray-600">À l'attention de {letterData.destinataire}</p>
                      )}
                      <p className="mt-4 text-gray-600">
                        Le {new Date().toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Objet avec couleur selon template */}
                    <div className="mb-8">
                      <p className="text-sm">
                        <span 
                          className="font-semibold"
                          style={{ color: letterStyle.template === "creative" ? letterStyle.colorScheme.primary : "#111827" }}
                        >
                          Objet :
                        </span>{" "}
                        Candidature au poste de {letterData.posteVise}
                      </p>
                    </div>

                    {/* Formule d'appel */}
                    <p className="mb-6 text-gray-800">
                      {letterData.destinataire ? `${letterData.destinataire},` : "Madame, Monsieur,"}
                    </p>

                    {/* Contenu éditable */}
                    <EditableLetterContent
                      content={letterData.contenuGenere}
                      onContentChange={handleContentChange}
                      onRegenerateParagraph={handleRegenerateParagraph}
                      primaryColor={letterStyle.colorScheme.primary}
                      template={letterStyle.template}
                    />

                    {/* Formule de politesse */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-gray-800 mb-8">
                        Je vous prie d'agréer, {letterData.destinataire || "Madame, Monsieur"}, l'expression de mes salutations distinguées.
                      </p>
                      <p 
                        className="font-semibold"
                        style={{ 
                          color: letterStyle.template === "classic" ? "#111827" : letterStyle.colorScheme.primary 
                        }}
                      >
                        {letterData.prenom} {letterData.nom}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


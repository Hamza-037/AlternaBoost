"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { ModernCVTemplate } from "@/components/preview/templates/ModernCVTemplate";
import { PremiumCVTemplate } from "@/components/preview/templates/PremiumCVTemplate";
import { CreativeCVTemplate } from "@/components/preview/templates/CreativeCVTemplate";
import { MinimalCVTemplate } from "@/components/preview/templates/MinimalCVTemplate";
import { useUser } from "@clerk/nextjs";
import { 
  Download, 
  Palette, 
  Type, 
  Layout,
  Sparkles,
  Eye,
  Edit3,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  X
} from "lucide-react";
import { toast } from "sonner";
import type { GeneratedCV } from "@/types/cv";

type TemplateName = "modern" | "premium" | "creative" | "minimal";

const COLOR_PRESETS = [
  { name: "Bleu Professionnel", primary: "#2563EB", secondary: "#3B82F6" },
  { name: "Vert Moderne", primary: "#059669", secondary: "#10B981" },
  { name: "Violet Créatif", primary: "#7C3AED", secondary: "#8B5CF6" },
  { name: "Orange Dynamique", primary: "#EA580C", secondary: "#F97316" },
  { name: "Rose Élégant", primary: "#DB2777", secondary: "#EC4899" },
  { name: "Gris Minimaliste", primary: "#475569", secondary: "#64748B" },
];

export default function PreviewCVPage() {
  const router = useRouter();
  const { user } = useUser();
  const [cvData, setCvData] = useState<GeneratedCV | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("modern");
  const [profileImage, setProfileImage] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  
  // Récupérer le plan de l'utilisateur
  const userPlan = (user?.publicMetadata?.plan as string) || "FREE";

  // Style personnalisé
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [secondaryColor, setSecondaryColor] = useState("#3B82F6");

  useEffect(() => {
    const storedData = sessionStorage.getItem("generated_cv");
    if (storedData) {
      const data = JSON.parse(storedData);
      setCvData(data);
      setSelectedTemplate(data.template || "modern");
      setProfileImage(data.profileImageUrl || "");
    } else {
      router.push("/create-cv");
    }
  }, [router]);

  const handleUpdate = (field: string, value: unknown) => {
    if (!cvData) return;
    setCvData({ ...cvData, [field]: value });
  };

  const handleUpdateExperience = (index: number, field: string, value: string) => {
    if (!cvData?.experiencesAmeliorees) return;
    const updated = [...cvData.experiencesAmeliorees];
    updated[index] = { ...updated[index], [field]: value };
    setCvData({ ...cvData, experiencesAmeliorees: updated });
  };

  const handleDeleteExperience = (index: number) => {
    if (!cvData?.experiencesAmeliorees) return;
    const updated = cvData.experiencesAmeliorees.filter((_, i) => i !== index);
    setCvData({ ...cvData, experiencesAmeliorees: updated });
    toast.success("Expérience supprimée");
  };

  const handleAddExperience = () => {
    if (!cvData) return;
    const newExp = {
      poste: "Nouveau poste",
      entreprise: "Entreprise",
      periode: "Date - Date",
      description: "Description de votre expérience...",
    };
    setCvData({
      ...cvData,
      experiencesAmeliorees: [...(cvData.experiencesAmeliorees || []), newExp],
    });
    toast.success("Expérience ajoutée");
  };

  const handleDownloadPDF = async () => {
    if (!cvData) return;

    setIsDownloading(true);
    try {
      const dataToSend = {
        ...cvData,
        template: selectedTemplate,
        profileImageUrl: profileImage || undefined,
        customColors: {
          primary: primaryColor,
          secondary: secondaryColor,
        },
      };

      const response = await fetch("/api/generate-cv-puppeteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la génération du PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_${cvData.prenom}_${cvData.nom}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("CV téléchargé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Erreur lors du téléchargement"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTemplate = () => {
    if (!cvData) return null;

    const commonProps = {
      cvData,
      profileImage,
      customColors: { primary: primaryColor, secondary: secondaryColor },
    };

    switch (selectedTemplate) {
      case "premium":
        return <PremiumCVTemplate {...commonProps} />;
      case "creative":
        return <CreativeCVTemplate {...commonProps} />;
      case "minimal":
        return <MinimalCVTemplate {...commonProps} />;
      default:
        return <ModernCVTemplate {...commonProps} />;
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
      <HeaderV2 />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        {/* Header fixe */}
        <div className="fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/create-cv")}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Retour
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {cvData.prenom} {cvData.nom}
              </h1>
                  <p className="text-sm text-gray-500">{cvData.formation}</p>
            </div>
          </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="gap-2"
                >
                  {sidebarOpen ? (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="w-4 h-4" />
                      Personnaliser
                    </>
                  )}
                </Button>
                
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isDownloading ? (
                  <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Génération...
                  </>
                ) : (
                  <>
                      <Download className="w-4 h-4" />
                    Télécharger en PDF
                  </>
                )}
              </Button>
            </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 pt-32 pb-12">
          <div className="flex gap-6 relative">
            {/* Sidebar d'édition */}
            <AnimatePresence>
              {sidebarOpen && (
          <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="w-96 flex-shrink-0"
                >
                  <Card className="sticky top-36 p-6 shadow-xl border-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="content" className="gap-2">
                          <Edit3 className="w-4 h-4" />
                          Contenu
                        </TabsTrigger>
                        <TabsTrigger value="style" className="gap-2">
                          <Palette className="w-4 h-4" />
                          Style
                        </TabsTrigger>
                        <TabsTrigger value="template" className="gap-2">
                          <Layout className="w-4 h-4" />
                          Template
                        </TabsTrigger>
                      </TabsList>

                      {/* TAB CONTENU */}
                      <TabsContent value="content" className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                        {/* Informations personnelles */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            Informations personnelles
                          </h3>
                          
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs">Prénom</Label>
                              <Input
                                value={cvData.prenom}
                                onChange={(e) => handleUpdate("prenom", e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Nom</Label>
                              <Input
                                value={cvData.nom}
                                onChange={(e) => handleUpdate("nom", e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Email</Label>
                              <Input
                                value={cvData.email}
                                onChange={(e) => handleUpdate("email", e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Téléphone</Label>
                              <Input
                                value={cvData.telephone}
                                onChange={(e) => handleUpdate("telephone", e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Objectif */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            Objectif professionnel
                          </h3>
                          <Textarea
                            value={cvData.pitchPersonnalise || cvData.objectifAmeliore || cvData.objectif}
                            onChange={(e) => handleUpdate("pitchPersonnalise", e.target.value)}
                            rows={4}
                            className="text-sm"
                          />
                        </div>

                        <Separator />

                        {/* Expériences */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Expériences</h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleAddExperience}
                              className="gap-1 h-7 text-xs"
                            >
                              <Plus className="w-3 h-3" />
                              Ajouter
                            </Button>
                          </div>

                          {cvData.experiencesAmeliorees?.map((exp, index) => (
                            <Card key={index} className="p-4 bg-gray-50 space-y-3 relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteExperience(index)}
                                className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>

                              <div>
                                <Label className="text-xs">Poste</Label>
                                <Input
                                  value={exp.poste}
                                  onChange={(e) => handleUpdateExperience(index, "poste", e.target.value)}
                                  className="mt-1 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Entreprise</Label>
                                <Input
                                  value={exp.entreprise}
                                  onChange={(e) => handleUpdateExperience(index, "entreprise", e.target.value)}
                                  className="mt-1 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Période</Label>
                                <Input
                                  value={exp.periode}
                                  onChange={(e) => handleUpdateExperience(index, "periode", e.target.value)}
                                  className="mt-1 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Description</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                                  rows={3}
                                  className="mt-1 text-sm"
                                />
                              </div>
                            </Card>
                          ))}
                        </div>

                        <Separator />

                        {/* Compétences */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Compétences</h3>
                          <Textarea
                            value={Array.isArray(cvData.competencesAmeliorees) 
                              ? cvData.competencesAmeliorees.join(", ")
                              : cvData.competencesAmeliorees || cvData.competences}
                            onChange={(e) => handleUpdate("competencesAmeliorees", e.target.value)}
                            rows={3}
                            placeholder="Ex: JavaScript, React, Node.js..."
                            className="text-sm"
                          />
                        </div>
                      </TabsContent>

                      {/* TAB STYLE */}
                      <TabsContent value="style" className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-blue-600" />
                            Couleurs
                          </h3>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {COLOR_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => {
                                  setPrimaryColor(preset.primary);
                                  setSecondaryColor(preset.secondary);
                                  toast.success(`Thème "${preset.name}" appliqué !`);
                                }}
                                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all hover:scale-105"
                                title={preset.name}
                              >
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                                  }}
                                />
                                {primaryColor === preset.primary && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                      <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
              </div>
            )}
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Label className="text-xs">Couleur principale</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  type="color"
                                  value={primaryColor}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                  className="w-12 h-10 p-1 cursor-pointer"
                                />
                                <Input
                                  type="text"
                                  value={primaryColor}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                  className="flex-1 font-mono text-xs"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">Couleur secondaire</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  type="color"
                                  value={secondaryColor}
                                  onChange={(e) => setSecondaryColor(e.target.value)}
                                  className="w-12 h-10 p-1 cursor-pointer"
                                />
                                <Input
                                  type="text"
                                  value={secondaryColor}
                                  onChange={(e) => setSecondaryColor(e.target.value)}
                                  className="flex-1 font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-purple-600" />
                  Photo de profil
                </h3>
                          
                          {profileImage ? (
                <div className="space-y-3">
                              <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={profileImage}
                                  alt="Photo de profil"
                                  className="w-full h-full object-cover rounded-full border-4 border-gray-200"
                                />
                                <button
                                  onClick={() => {
                          setProfileImage("");
                                    toast.success("Photo supprimée");
                                  }}
                                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-center text-gray-500">
                                La photo apparaîtra sur votre CV
                              </p>
                            </div>
                          ) : (
                            <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                Aucune photo uploadée
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Retournez au formulaire pour ajouter une photo
                              </p>
                    </div>
                  )}
                </div>
                      </TabsContent>

                      {/* TAB TEMPLATE */}
                      <TabsContent value="template" className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Choisissez votre template</h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { name: "modern", label: "Moderne", free: true },
                              { name: "premium", label: "Premium", free: false },
                              { name: "creative", label: "Créatif", free: false },
                              { name: "minimal", label: "Minimal", free: false },
                            ].map((template) => (
                              <button
                                key={template.name}
                                onClick={() => {
                                  if (!template.free && userPlan === "FREE") {
                                    toast.error("Template premium - Passez à un plan payant");
                                    return;
                                  }
                                  setSelectedTemplate(template.name as TemplateName);
                                  toast.success(`Template "${template.label}" sélectionné !`);
                                }}
                                className={`
                                  relative p-4 rounded-lg border-2 transition-all text-left
                                  ${selectedTemplate === template.name 
                                    ? "border-blue-600 bg-blue-50" 
                                    : "border-gray-200 hover:border-gray-400"}
                                  ${!template.free && userPlan === "FREE" ? "opacity-50" : ""}
                                `}
                              >
                                <div className="font-semibold text-sm">{template.label}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {template.free ? "Gratuit" : "Premium"}
                                </div>
                                {!template.free && userPlan === "FREE" && (
                                  <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="text-xs">🔒</Badge>
                                  </div>
                                )}
                                {selectedTemplate === template.name && (
                                  <div className="absolute top-2 right-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
            </Card>
          </motion.div>
              )}
            </AnimatePresence>

            {/* Zone de preview du CV */}
            <div className="flex-1 flex justify-center">
              <motion.div
                layout
                className="w-full max-w-3xl"
              >
                <Card className="shadow-2xl overflow-hidden bg-white">
                  <div className="aspect-[1/1.414] overflow-auto">
                    {renderTemplate()}
                  </div>
                </Card>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    ✨ Modifiez le contenu dans la sidebar et voyez les changements en temps réel
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

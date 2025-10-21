"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  RotateCw, 
  Save, 
  Sparkles, 
  Plus,
  Trash2,
  Upload as UploadIcon,
  Zap,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Heart,
  ChevronDown,
  Download,
  Palette,
  FileText,
  Folder,
  BookOpen,
  Users,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { PhotoUpload } from "@/components/cv/PhotoUpload";
import { DateRangeInput } from "@/components/ui/date-range-input";
import { ExperienceTimeline } from "@/components/cv/ExperienceTimeline";
import { LanguageStars } from "@/components/cv/LanguageStars";
import { SkillBadges } from "@/components/cv/SkillBadges";
import { CVCustomizationPanel } from "@/components/cv/CVCustomizationPanel";
import { AddSectionModal } from "@/components/cv/AddSectionModal";
import { DynamicSectionForm } from "@/components/cv/DynamicSectionForm";
import { DraggableSectionCard } from "@/components/cv/DraggableSectionCard";
import { DraggableChip } from "@/components/cv/DraggableChip";
import { SectionType, SECTION_CONFIG } from "@/types/custom-sections";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { EnhancvModernTemplate } from "@/components/preview/templates/EnhancvModernTemplate";
import { EnhancvPremiumTemplate } from "@/components/preview/templates/EnhancvPremiumTemplate";
import { EnhancvCreativeTemplate } from "@/components/preview/templates/EnhancvCreativeTemplate";
import { EnhancvMinimalTemplate } from "@/components/preview/templates/EnhancvMinimalTemplate";
import { CVBuilderTemplate } from "@/components/preview/templates/CVBuilderTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import type { GeneratedCV } from "@/types/cv";
import { 
  personalDetailsPreset, 
  experiencesPreset, 
  formationPreset, 
  competencesPreset, 
  languagesPreset, 
  hobbiesPreset 
} from "@/lib/cv-presets";

type Experience = {
  poste: string;
  entreprise: string;
  periode: string;
  description: string;
};

type Language = {
  language: string;
  proficiency: "Débutant" | "Intermédiaire" | "Avancé";
};

const THEMES = [
  { name: "cupcake", label: "Clair", color: "#65c3c8" },
  { name: "dark", label: "Sombre", color: "#1f2937" },
  { name: "synthwave", label: "Synthwave", color: "#e779c1" },
  { name: "dracula", label: "Dracula", color: "#ff79c6" },
  { name: "cyberpunk", label: "Cyberpunk", color: "#ffff00" },
  { name: "forest", label: "Forêt", color: "#1eb854" },
  { name: "luxury", label: "Luxe", color: "#ffffff" },
  { name: "business", label: "Business", color: "#1e40af" },
];

export default function CreateCVFusionPage() {
  const router = useRouter();
  const { user } = useUser();
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  
  // États
  const [theme, setTheme] = useState("dark");
  const [zoom, setZoom] = useState(163);
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "premium" | "creative" | "minimal" | "cvbuilder">("cvbuilder");
  const [profileImage, setProfileImage] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>("personal");
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(true);
  
  // Données du CV
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [formation, setFormation] = useState("");
  const [ecole, setEcole] = useState("");
  const [anneeFormation, setAnneeFormation] = useState("");
  const [descriptionFormation, setDescriptionFormation] = useState("");
  const [posteRecherche, setPosteRecherche] = useState("");
  const [objectif, setObjectif] = useState("");
  const [objectifOptimise, setObjectifOptimise] = useState("");
  const [competences, setCompetences] = useState<string[]>([]);
  const [newCompetence, setNewCompetence] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState("");
  
  // Personnalisation du CV
  const [customization, setCustomization] = useState({
    primaryColor: "#06B6D4",
    fontFamily: "Inter, sans-serif",
    fontSize: 100,
    photoSize: 100,
    spacing: 100,
  });
  
  // Sections personnalisées
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  
  // Formulaire nouvelle expérience
  const [newExp, setNewExp] = useState<Experience>({
    poste: "",
    entreprise: "",
    periode: "",
    description: "",
  });

  // Formulaire nouvelle langue
  const [newLang, setNewLang] = useState<Language>({
    language: "",
    proficiency: "Intermédiaire",
  });

  const userPlan = (user?.publicMetadata?.plan as string) || "FREE";

  // ✅ DRAG & DROP: Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ✅ DRAG & DROP: Section IDs Order
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "personal",
    "experiences",
    "formation",
    "competences",
    "langues",
    "loisirs",
  ]);

  // ✅ DRAG & DROP: Handle section reorder
  const handleDragEndSections = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ✅ DRAG & DROP: Handle competences reorder
  const handleDragEndCompetences = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCompetences((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ✅ DRAG & DROP: Handle languages reorder
  const handleDragEndLanguages = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLanguages((items) => {
        const oldIndex = items.findIndex(lang => lang.language === active.id);
        const newIndex = items.findIndex(lang => lang.language === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ✅ DRAG & DROP: Handle hobbies reorder
  const handleDragEndHobbies = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setHobbies((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Optimiser avec l'IA
  const optimizeWithAI = async (field: string, value: string) => {
    if (!value.trim()) return value;
    
    setIsOptimizing(true);
    try {
      const response = await fetch("/api/optimize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, field }),
      });
      
      if (response.ok) {
        const { optimized } = await response.json();
        toast.success("✨ Texte optimisé par l'IA !");
        return optimized;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
    return value;
  };

  // Ajouter une expérience
  const handleAddExperience = async () => {
    if (!newExp.poste || !newExp.entreprise) {
      toast.error("Veuillez remplir au moins le poste et l'entreprise");
      return;
    }
    
    // Optimiser la description avec l'IA
    const optimizedDesc = await optimizeWithAI("experience_description", newExp.description);
    
    setExperiences([...experiences, { ...newExp, description: optimizedDesc }]);
    setNewExp({ poste: "", entreprise: "", periode: "", description: "" });
    toast.success("✨ Expérience ajoutée et optimisée !");
  };

  // Ajouter une compétence
  const handleAddCompetence = () => {
    if (newCompetence.trim() && !competences.includes(newCompetence.trim())) {
      setCompetences([...competences, newCompetence.trim()]);
      setNewCompetence("");
    }
  };

  // Ajouter une langue
  const handleAddLanguage = () => {
    if (newLang.language.trim()) {
      setLanguages([...languages, newLang]);
      setNewLang({ language: "", proficiency: "Intermédiaire" });
    }
  };

  // Ajouter un loisir
  const handleAddHobby = () => {
    if (newHobby.trim()) {
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby("");
    }
  };

  // Gestion des sections personnalisées
  const handleAddCustomSection = (type: SectionType) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      enabled: true,
      order: customSections.length,
      data: []
    };
    setCustomSections([...customSections, newSection]);
  };

  const handleUpdateSectionData = (sectionId: string, data: any[]) => {
    setCustomSections(customSections.map(section => 
      section.id === sectionId ? { ...section, data } : section
    ));
  };

  const handleRemoveSection = (sectionId: string) => {
    setCustomSections(customSections.filter(section => section.id !== sectionId));
  };

  // Boutons Reset par section
  const handleResetPersonalInfo = () => {
    setPrenom("");
    setNom("");
    setEmail("");
    setTelephone("");
    setAdresse("");
    setPosteRecherche("");
    setObjectif("");
    setObjectifOptimise("");
    setProfileImage(undefined);
  };

  const handleResetExperiences = () => {
    setExperiences([]);
  };

  const handleResetFormation = () => {
    setFormation("");
    setEcole("");
    setAnneeFormation("");
    setDescriptionFormation("");
  };

  const handleResetCompetences = () => {
    setCompetences([]);
  };

  const handleResetLanguages = () => {
    setLanguages([]);
  };

  const handleResetHobbies = () => {
    setHobbies([]);
  };

  // Charger les données d'exemple
  const handleLoadPresets = () => {
    setPrenom(personalDetailsPreset.prenom);
    setNom(personalDetailsPreset.nom);
    setEmail(personalDetailsPreset.email);
    setTelephone(personalDetailsPreset.telephone);
    setAdresse(personalDetailsPreset.adresse);
    setPosteRecherche(personalDetailsPreset.posteRecherche);
    setObjectif(personalDetailsPreset.objectif);
    setExperiences(experiencesPreset);
    setFormation(formationPreset.formation);
    setEcole(formationPreset.ecole);
    setAnneeFormation(formationPreset.anneeFormation);
    setCompetences(competencesPreset);
    setLanguages(languagesPreset);
    setHobbies(hobbiesPreset);
    toast.success("📝 Données d'exemple chargées ! Personnalisez-les maintenant.");
  };

  // Optimiser l'objectif
  const handleOptimizeObjectif = async () => {
    const optimized = await optimizeWithAI("objectif", objectif);
    setObjectifOptimise(optimized);
  };

  // Générer le PDF
  const handleDownloadPDF = async () => {
    const element = cvPreviewRef.current;
    if (!element) return;

    try {
      toast.info("📄 Génération du PDF en cours...");
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV_${prenom}_${nom}.pdf`);
      
      setShowPreviewModal(false);
      
      // Confetti 🎉
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
      
      toast.success("🎉 CV téléchargé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  // Préparer les données pour le template
  const cvData: GeneratedCV = {
    prenom,
    nom,
    email,
    telephone,
    formation,
    ecole,
    anneeFormation,
    objectif: objectifOptimise || objectif,
    objectifAmeliore: objectifOptimise,
    pitchPersonnalise: objectifOptimise,
    competences: competences.join(", "),
    competencesAmeliorees: competences,
    experiencesAmeliorees: experiences,
    experiences: [],
    template: selectedTemplate,
  };

  const renderTemplate = () => {
    // Props communs pour tous les templates
    const commonProps = {
      prenom,
      nom,
      email,
      telephone,
      adresse,
      posteRecherche,
      objectif: objectifOptimise || objectif,
      profileImage,
      experiences,
      formation,
      ecole,
      anneeFormation,
      descriptionFormation,
      competences,
      languages,
      hobbies,
      customization, // ✅ AJOUT: Passer la customisation à tous les templates
    };

    // CVBuilderTemplate a des props supplémentaires
    if (selectedTemplate === "cvbuilder") {
      return (
        <CVBuilderTemplate
          {...commonProps}
          customSections={customSections}
        />
      );
    }
    
    // Nouveaux templates Enhancv
    switch (selectedTemplate) {
      case "modern": 
        return <EnhancvModernTemplate {...commonProps} />;
      case "premium": 
        return <EnhancvPremiumTemplate {...commonProps} />;
      case "creative": 
        return <EnhancvCreativeTemplate {...commonProps} />;
      case "minimal": 
        return <EnhancvMinimalTemplate {...commonProps} />;
      default: 
        return <EnhancvModernTemplate {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50" data-theme={theme}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push(user ? '/dashboard' : '/')}
              className="text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              <span className="text-gray-800">Alterna</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Boost</span>
            </button>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Sparkles className="w-3 h-3 mr-1" />
              IA Intégrée
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleLoadPresets}
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 gap-2"
            >
              <Zap className="w-4 h-4" />
              Charger exemple
            </Button>
            <Button 
              onClick={() => router.push(user ? '/dashboard' : '/')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 gap-2"
            >
              ← {user ? 'Dashboard' : 'Accueil'}
            </Button>
            <Button 
              onClick={() => setShowPreviewModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2"
            >
              <Eye className="w-4 h-4" />
              Prévisualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex pt-20">
        {/* SIDEBAR - Formulaires */}
        <div className="w-[420px] h-[calc(100vh-80px)] border-r border-gray-200 overflow-y-auto bg-white/60 backdrop-blur-sm scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSections}>
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              <div className="p-6 space-y-4">
                {/* Map des sections pour permettre la réorganisation */}
                {sectionOrder.map((sectionId) => {
                  // Section: Qui êtes-vous ?
                  if (sectionId === "personal") return (
                    <DraggableSectionCard key="personal" id="personal" title="Qui êtes-vous ?" icon={User} expandedSection={expandedSection} setExpandedSection={setExpandedSection} onReset={handleResetPersonalInfo}>
              <div className="space-y-4">
                <Input 
                  placeholder="Prénom" 
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input 
                  placeholder="Nom" 
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input 
                  type="email"
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input 
                  placeholder="Téléphone" 
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input 
                  placeholder="Adresse" 
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                
                <div className="pt-2">
                  <Label className="text-sm text-gray-600 mb-3 block">Photo de profil</Label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <PhotoUpload
                      onUpload={(url) => setProfileImage(url)}
                      currentPhoto={profileImage}
                      onRemove={() => setProfileImage("")}
                    />
                  </div>
                </div>
                
                <Input 
                  placeholder="Poste recherché (ex: Développeur Web)" 
                  value={posteRecherche}
                  onChange={(e) => setPosteRecherche(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                
                <Textarea 
                  placeholder="Description courte de vous-même..." 
                  value={objectif}
                  onChange={(e) => setObjectif(e.target.value)}
                  rows={4}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                
                <Button 
                  onClick={handleOptimizeObjectif}
                  disabled={!objectif || isOptimizing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isOptimizing ? "Optimisation..." : "Optimiser avec l'IA"}
                </Button>
              </div>
            </DraggableSectionCard>
                  );

                  // Section: Expériences
                  if (sectionId === "experiences") return (
                    <DraggableSectionCard key="experiences" id="experiences" title="Expériences" icon={Briefcase} expandedSection={expandedSection} setExpandedSection={setExpandedSection} onReset={handleResetExperiences}>
              <div className="space-y-4">
                <Input 
                  placeholder="Poste" 
                  value={newExp.poste}
                  onChange={(e) => setNewExp({...newExp, poste: e.target.value})}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input 
                  placeholder="Entreprise" 
                  value={newExp.entreprise}
                  onChange={(e) => setNewExp({...newExp, entreprise: e.target.value})}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <DateRangeInput
                  value={newExp.periode}
                  onChange={(value) => setNewExp({...newExp, periode: value})}
                />
                <Textarea 
                  placeholder="Décrivez vos missions..." 
                  value={newExp.description}
                  onChange={(e) => setNewExp({...newExp, description: e.target.value})}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                  onClick={handleAddExperience}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isOptimizing}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isOptimizing ? "IA optimise..." : "Ajouter (IA optimisera)"}
                </Button>
                
                {experiences.length > 0 && (
                  <div className="pt-4">
                    <Separator className="mb-4" />
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Aperçu Timeline
                    </h3>
                    <ExperienceTimeline experiences={experiences} />
                    
                    <div className="mt-4 space-y-2">
                      {experiences.map((exp, index) => (
                        <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-200">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-xs truncate">{exp.poste}</p>
                            <p className="text-xs text-blue-600 truncate">{exp.entreprise}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DraggableSectionCard>
                    );

                  // Section: Formation
                  if (sectionId === "formation") return (
                    <DraggableSectionCard key="formation" id="formation" title="Formation" icon={GraduationCap} expandedSection={expandedSection} setExpandedSection={setExpandedSection} onReset={handleResetFormation}>
              <div className="space-y-4">
                <Input 
                  placeholder="Diplôme (ex: Master Informatique)" 
                  value={formation}
                  onChange={(e) => setFormation(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input 
                  placeholder="École/Université" 
                  value={ecole}
                  onChange={(e) => setEcole(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input 
                  placeholder="Année (ex: 2024-2025)" 
                  value={anneeFormation}
                  onChange={(e) => setAnneeFormation(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Textarea 
                  placeholder="Description (optionnelle) - Une ligne = un point&#10;Ex:&#10;Mention Très Bien&#10;Spécialisation Data Science&#10;Major de promotion" 
                  value={descriptionFormation}
                  onChange={(e) => setDescriptionFormation(e.target.value)}
                  rows={4}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </DraggableSectionCard>
                    );

                  // Section: Compétences
                  if (sectionId === "competences") return (
                    <DraggableSectionCard key="competences" id="competences" title="Compétences" icon={Award} expandedSection={expandedSection} setExpandedSection={setExpandedSection} onReset={handleResetCompetences}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: React, Node.js..." 
                    value={newCompetence}
                    onChange={(e) => setNewCompetence(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCompetence()}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button onClick={handleAddCompetence} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {competences.length > 0 && (
                  <div>
                    <Separator className="mb-4" />
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Vos Compétences
                    </h3>
                    <SkillBadges competences={competences} />
                    
                    <div className="mt-4">
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndCompetences}>
                        <SortableContext items={competences} strategy={horizontalListSortingStrategy}>
                          <div className="flex flex-wrap gap-2">
                            {competences.map((comp) => (
                              <DraggableChip
                                key={comp}
                                id={comp}
                                onRemove={() => setCompetences(competences.filter((c) => c !== comp))}
                                className="bg-gray-100"
                              >
                                {comp}
                              </DraggableChip>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                )}
              </div>
            </DraggableSectionCard>
                    );

                  // Section: Langues
                  if (sectionId === "langues") return (
                    <DraggableSectionCard key="langues" id="langues" title="Langues" icon={Globe} expandedSection={expandedSection} setExpandedSection={setExpandedSection} onReset={handleResetLanguages}>
              <div className="space-y-4">
                <Input 
                  placeholder="Ex: Anglais" 
                  value={newLang.language}
                  onChange={(e) => setNewLang({...newLang, language: e.target.value})}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <select 
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={newLang.proficiency}
                  onChange={(e) => setNewLang({...newLang, proficiency: e.target.value as any})}
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
                <Button onClick={handleAddLanguage} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
                
                {languages.length > 0 && (
                  <div>
                    <Separator className="mb-4" />
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-600" />
                      Vos Langues
                    </h3>
                    <LanguageStars languages={languages} />
                    
                    <div className="mt-4 space-y-2">
                      {languages.map((lang, i) => (
                        <div key={i} className="flex items-center justify-between bg-purple-50 p-2 rounded-lg border border-purple-200">
                          <span className="text-gray-900 text-sm">{lang.language}</span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-700 text-xs">{lang.proficiency}</Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DraggableSectionCard>
                    );

                  // Section: Loisirs
                  if (sectionId === "loisirs") return (
                    <DraggableSectionCard key="loisirs" id="loisirs" title="Loisirs" icon={Heart} expandedSection={expandedSection} setExpandedSection={setExpandedSection} onReset={handleResetHobbies}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: Voyager, Lire..." 
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button onClick={handleAddHobby} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndHobbies}>
                  <SortableContext items={hobbies} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-wrap gap-2">
                      {hobbies.map((hobby) => (
                        <DraggableChip
                          key={hobby}
                          id={hobby}
                          onRemove={() => setHobbies(hobbies.filter((h) => h !== hobby))}
                          className="bg-pink-100 text-pink-700 border-pink-200"
                        >
                          {hobby}
                        </DraggableChip>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </DraggableSectionCard>
                    );

                  // Retourner null pour éviter les erreurs
                  return null;
                })}

                {/* SECTIONS DYNAMIQUES */}
                {customSections.map((section) => {
                  const config = SECTION_CONFIG[section.type];
                  const IconComponent = {
                    Folder, Award, BookOpen, Users, Trophy, Heart
                  }[config.icon as keyof typeof config];
                  
                  return (
                    <DraggableSectionCard 
                      key={section.id}
                      id={section.id} 
                      title={config.label} 
                      icon={IconComponent || Award} 
                      expandedSection={expandedSection} 
                      setExpandedSection={setExpandedSection}
                    >
                      <DynamicSectionForm
                        type={section.type}
                        data={section.data}
                        onUpdate={(data) => handleUpdateSectionData(section.id, data)}
                      />
                    </DraggableSectionCard>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* PREVIEW DROITE */}
        <div className="flex-1 h-[calc(100vh-80px)] overflow-y-auto bg-gradient-to-br from-blue-50/50 to-purple-50/50 relative">
          {/* Bouton Toggle Personnalisation */}
          {!showCustomizationPanel && (
            <button
              onClick={() => setShowCustomizationPanel(true)}
              className="fixed top-24 left-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              title="Afficher la personnalisation"
            >
              <Palette className="w-5 h-5" />
            </button>
          )}

          {/* Panneau de Personnalisation - GAUCHE */}
          {showCustomizationPanel && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute top-6 left-6 z-40 w-80"
            >
              <Card className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      <h3 className="font-bold text-lg">Personnalisation</h3>
                    </div>
                    <button
                      onClick={() => setShowCustomizationPanel(false)}
                      className="hover:bg-white/20 rounded-full p-1 transition-colors"
                      title="Masquer"
                    >
                      <ChevronDown className="w-5 h-5 rotate-90" />
                    </button>
                  </div>
                  <p className="text-xs text-blue-100 mt-1">Créez un CV 100% unique ✨</p>
                </div>
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <CVCustomizationPanel
                  customization={customization}
                  onUpdate={setCustomization}
                />
                
                <Separator className="my-6" />
                
                {/* Bouton Ajouter Section */}
                <Button
                  onClick={() => setShowAddSectionModal(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une section
                </Button>
                
                {customSections.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Sections ajoutées</p>
                    {customSections.map((section) => (
                      <div key={section.id} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                        <span className="text-sm font-medium" style={{ color: SECTION_CONFIG[section.type].color }}>
                          {SECTION_CONFIG[section.type].label}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSection(section.id)}
                          className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
          )}

          {/* Contrôles Zoom/Modèle - DROITE */}
          <div className="absolute top-6 right-6 z-40 space-y-3 w-72">
            {/* Zoom */}
            <Card className="bg-white/95 backdrop-blur-md border-gray-200 shadow-lg p-4">
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-blue-600" />
                <input 
                  type="range" 
                  min="50" 
                  max="200" 
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-bold text-blue-600 w-12">{zoom}%</span>
              </div>
            </Card>

            {/* Sélecteur de Modèle */}
            <Card className="bg-white/95 backdrop-blur-md border-gray-200 shadow-lg p-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                MODÈLE DE CV
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "cvbuilder", label: "CVBuilder", icon: "🎨", color: "from-cyan-500 to-blue-500" },
                  { value: "modern", label: "Modern", icon: "💼", color: "from-blue-500 to-indigo-500" },
                  { value: "premium", label: "Premium", icon: "👑", color: "from-amber-500 to-orange-500" },
                  { value: "creative", label: "Creative", icon: "✨", color: "from-purple-500 to-pink-500" },
                  { value: "minimal", label: "Minimal", icon: "⚡", color: "from-gray-600 to-gray-800" },
                ].map((template) => (
                  <button
                    key={template.value}
                    onClick={() => setSelectedTemplate(template.value as any)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all text-left overflow-hidden group
                      ${selectedTemplate === template.value 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                      }
                    `}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className="relative z-10">
                      <div className="text-2xl mb-1">{template.icon}</div>
                      <div className="text-xs font-semibold text-gray-900">{template.label}</div>
                      {selectedTemplate === template.value && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div 
            className="flex justify-center items-start py-12 px-6"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="shadow-2xl rounded-lg overflow-hidden">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-8 pt-24">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Désolé 😢</h2>
          <p className="text-gray-600 mb-6">
            Le créateur de CV est optimisé pour ordinateur afin de vous offrir la meilleure expérience possible.
          </p>
          <Button 
            onClick={() => router.push(user ? '/dashboard' : '/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            ← Retour à {user ? 'dashboard' : 'l\'accueil'}
          </Button>
        </div>
      </div>

      {/* MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-bold text-gray-900">Aperçu final</h3>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleDownloadPDF} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
              <div className="flex justify-center">
                <div ref={cvPreviewRef} data-theme={theme}>
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL AJOUTER SECTION */}
      <AddSectionModal
        open={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAddSection={handleAddCustomSection}
        existingSections={customSections.map(s => s.type)}
      />
    </div>
  );
}

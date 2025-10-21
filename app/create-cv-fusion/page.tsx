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
  FileText
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
import { ModernCVTemplate } from "@/components/preview/templates/ModernCVTemplate";
import { PremiumCVTemplate } from "@/components/preview/templates/PremiumCVTemplate";
import { CreativeCVTemplate } from "@/components/preview/templates/CreativeCVTemplate";
import { MinimalCVTemplate } from "@/components/preview/templates/MinimalCVTemplate";
import { CVBuilderTemplate } from "@/components/preview/templates/CVBuilderTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import type { GeneratedCV } from "@/types/cv";

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

// Composant SectionCard extrait pour éviter les re-renders
const SectionCard = ({ id, title, icon: Icon, children, expandedSection, setExpandedSection }: any) => {
  const isExpanded = expandedSection === id;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300">
      <button
        onClick={() => setExpandedSection(isExpanded ? "" : id)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  
  // Données du CV
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [formation, setFormation] = useState("");
  const [ecole, setEcole] = useState("");
  const [anneeFormation, setAnneeFormation] = useState("");
  const [posteRecherche, setPosteRecherche] = useState("");
  const [objectif, setObjectif] = useState("");
  const [objectifOptimise, setObjectifOptimise] = useState("");
  const [competences, setCompetences] = useState<string[]>([]);
  const [newCompetence, setNewCompetence] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState("");
  
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
    // Props pour CVBuilderTemplate
    if (selectedTemplate === "cvbuilder") {
      return (
        <CVBuilderTemplate
          prenom={prenom}
          nom={nom}
          email={email}
          telephone={telephone}
          adresse={adresse}
          posteRecherche={posteRecherche}
          objectif={objectifOptimise || objectif}
          profileImage={profileImage}
          experiences={experiences}
          competences={competences}
          languages={languages}
          hobbies={hobbies}
          formation={formation}
          ecole={ecole}
          anneeFormation={anneeFormation}
        />
      );
    }
    
    // Props pour les autres templates
    const props = { cvData, profileImage, customColors: { primary: "#2563EB", secondary: "#3B82F6" } };
    
    switch (selectedTemplate) {
      case "premium": return <PremiumCVTemplate {...props} />;
      case "creative": return <CreativeCVTemplate {...props} />;
      case "minimal": return <MinimalCVTemplate {...props} />;
      default: return <ModernCVTemplate {...props} />;
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
          <div className="p-6 space-y-4">
            {/* Section: Qui êtes-vous ? */}
            <SectionCard id="personal" title="Qui êtes-vous ?" icon={User} expandedSection={expandedSection} setExpandedSection={setExpandedSection}>
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
            </SectionCard>

            {/* Section: Expériences */}
            <SectionCard id="experiences" title="Expériences" icon={Briefcase} expandedSection={expandedSection} setExpandedSection={setExpandedSection}>
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
            </SectionCard>

            {/* Section: Formation */}
            <SectionCard id="formation" title="Formation" icon={GraduationCap} expandedSection={expandedSection} setExpandedSection={setExpandedSection}>
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
              </div>
            </SectionCard>

            {/* Section: Compétences */}
            <SectionCard id="competences" title="Compétences" icon={Award} expandedSection={expandedSection} setExpandedSection={setExpandedSection}>
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
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {competences.map((comp, i) => (
                        <div key={i} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <span className="text-gray-700">{comp}</span>
                          <button 
                            onClick={() => setCompetences(competences.filter((_, idx) => idx !== i))}
                            className="text-gray-500 hover:text-red-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Section: Langues */}
            <SectionCard id="langues" title="Langues" icon={Globe} expandedSection={expandedSection} setExpandedSection={setExpandedSection}>
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
            </SectionCard>

            {/* Section: Loisirs */}
            <SectionCard id="loisirs" title="Loisirs" icon={Heart} expandedSection={expandedSection} setExpandedSection={setExpandedSection}>
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
                
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby, i) => (
                    <Badge key={i} className="bg-pink-100 text-pink-700 border-pink-200 gap-2">
                      {hobby}
                      <button onClick={() => setHobbies(hobbies.filter((_, idx) => idx !== i))}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* PREVIEW DROITE */}
        <div className="flex-1 h-[calc(100vh-80px)] overflow-y-auto bg-gradient-to-br from-blue-50/50 to-purple-50/50 relative">
          {/* Contrôles */}
          <div className="absolute top-6 right-6 z-40 space-y-3">
            <Card className="bg-white/95 backdrop-blur-md border-gray-200 shadow-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-blue-600" />
                <input 
                  type="range" 
                  min="50" 
                  max="200" 
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-bold text-blue-600 w-12">{zoom}%</span>
              </div>
              
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {THEMES.map((t) => (
                  <option key={t.name} value={t.name}>{t.label}</option>
                ))}
              </select>
              
              <select 
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="cvbuilder">CVBuilder (Recommandé)</option>
                <option value="modern">Modern</option>
                <option value="premium">Premium</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
              </select>
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
    </div>
  );
}

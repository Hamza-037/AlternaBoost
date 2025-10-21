"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
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
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { PhotoUpload } from "@/components/cv/PhotoUpload";
import { DateRangeInput } from "@/components/ui/date-range-input";
import { ModernCVTemplate } from "@/components/preview/templates/ModernCVTemplate";
import { PremiumCVTemplate } from "@/components/preview/templates/PremiumCVTemplate";
import { CreativeCVTemplate } from "@/components/preview/templates/CreativeCVTemplate";
import { MinimalCVTemplate } from "@/components/preview/templates/MinimalCVTemplate";
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
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset",
];

export default function CreateCVFusionPage() {
  const router = useRouter();
  const { user } = useUser();
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  
  // États
  const [theme, setTheme] = useState("cupcake");
  const [zoom, setZoom] = useState(100);
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "premium" | "creative" | "minimal">("modern");
  const [profileImage, setProfileImage] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Données du CV
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [formation, setFormation] = useState("");
  const [ecole, setEcole] = useState("");
  const [anneeFormation, setAnneeFormation] = useState("");
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
    toast.success("Expérience ajoutée et optimisée ! 🎉");
  };

  // Ajouter une compétence
  const handleAddCompetence = () => {
    if (newCompetence.trim()) {
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
      toast.info("Génération du PDF en cours...");
      
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
      
      toast.success("CV téléchargé avec succès ! 🎉");
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
    const props = { cvData, profileImage, customColors: { primary: "#2563EB", secondary: "#3B82F6" } };
    
    switch (selectedTemplate) {
      case "premium": return <PremiumCVTemplate {...props} />;
      case "creative": return <CreativeCVTemplate {...props} />;
      case "minimal": return <MinimalCVTemplate {...props} />;
      default: return <ModernCVTemplate {...props} />;
    }
  };

  return (
    <>
      <HeaderV2 />
      
      {/* Desktop uniquement */}
      <div className="hidden lg:block min-h-screen pt-20" data-theme={theme}>
        <section className="flex h-screen">
          {/* SIDEBAR GAUCHE - Formulaires (1/3) */}
          <div className="w-1/3 h-full p-8 bg-base-200 overflow-y-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                CV<span className="text-primary">Builder</span>
                <Badge className="ml-2 bg-purple-600">✨ IA</Badge>
              </h1>
              
              <Button 
                onClick={() => setShowPreviewModal(true)}
                className="btn btn-primary gap-2"
              >
                <Eye className="w-4 h-4" />
                Prévisualiser
              </Button>
            </div>

            <div className="space-y-8">
              {/* SECTION: Informations personnelles */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-primary">
                      <User className="w-5 h-5" />
                      Qui êtes-vous ?
                    </h2>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setPrenom(""); setNom(""); setEmail(""); setTelephone("");
                      }}
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>

                  <PhotoUpload
                    onUpload={(url) => setProfileImage(url)}
                    currentPhoto={profileImage}
                    onRemove={() => setProfileImage("")}
                  />

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Input 
                      placeholder="Prénom" 
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="input input-bordered"
                    />
                    <Input 
                      placeholder="Nom" 
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="input input-bordered"
                    />
                  </div>

                  <Input 
                    type="email"
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered"
                  />

                  <Input 
                    placeholder="Téléphone" 
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="input input-bordered"
                  />
                </div>
              </div>

              {/* SECTION: Formation */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-primary">
                      <GraduationCap className="w-5 h-5" />
                      Formation
                    </h2>
                  </div>

                  <Input 
                    placeholder="Diplôme (ex: Master Informatique)" 
                    value={formation}
                    onChange={(e) => setFormation(e.target.value)}
                    className="input input-bordered"
                  />

                  <Input 
                    placeholder="École/Université" 
                    value={ecole}
                    onChange={(e) => setEcole(e.target.value)}
                    className="input input-bordered"
                  />

                  <Input 
                    placeholder="Année (ex: 2024-2025)" 
                    value={anneeFormation}
                    onChange={(e) => setAnneeFormation(e.target.value)}
                    className="input input-bordered"
                  />
                </div>
              </div>

              {/* SECTION: Objectif */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-primary">
                    <Sparkles className="w-5 h-5" />
                    Objectif professionnel
                  </h2>

                  <Textarea 
                    placeholder="Décrivez votre objectif professionnel..." 
                    value={objectif}
                    onChange={(e) => setObjectif(e.target.value)}
                    rows={4}
                    className="textarea textarea-bordered"
                  />

                  <Button 
                    onClick={handleOptimizeObjectif}
                    disabled={!objectif || isOptimizing}
                    className="btn btn-primary gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {isOptimizing ? "Optimisation..." : "Optimiser avec l'IA"}
                  </Button>

                  {objectifOptimise && (
                    <div className="alert alert-success">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm">{objectifOptimise}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: Expériences */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-primary">
                      <Briefcase className="w-5 h-5" />
                      Expériences ({experiences.length})
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <Input 
                      placeholder="Poste" 
                      value={newExp.poste}
                      onChange={(e) => setNewExp({...newExp, poste: e.target.value})}
                      className="input input-bordered"
                    />

                    <Input 
                      placeholder="Entreprise" 
                      value={newExp.entreprise}
                      onChange={(e) => setNewExp({...newExp, entreprise: e.target.value})}
                      className="input input-bordered"
                    />

                    <DateRangeInput
                      value={newExp.periode}
                      onChange={(value) => setNewExp({...newExp, periode: value})}
                    />

                    <Textarea 
                      placeholder="Description de vos missions..." 
                      value={newExp.description}
                      onChange={(e) => setNewExp({...newExp, description: e.target.value})}
                      rows={3}
                      className="textarea textarea-bordered"
                    />

                    <Button 
                      onClick={handleAddExperience}
                      className="btn btn-primary btn-block gap-2"
                      disabled={isOptimizing}
                    >
                      <Plus className="w-4 h-4" />
                      {isOptimizing ? "Optimisation IA..." : "Ajouter (IA optimisera)"}
                    </Button>
                  </div>

                  {experiences.map((exp, index) => (
                    <div key={index} className="alert alert-info mt-2">
                      <div className="flex-1">
                        <p className="font-bold text-sm">{exp.poste} - {exp.entreprise}</p>
                        <p className="text-xs opacity-70">{exp.periode}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: Compétences & Langues */}
              <div className="grid grid-cols-2 gap-4">
                {/* Compétences */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-4">
                    <h2 className="card-title text-sm text-primary">
                      <Award className="w-4 h-4" />
                      Compétences
                    </h2>

                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ex: React" 
                        value={newCompetence}
                        onChange={(e) => setNewCompetence(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCompetence()}
                        className="input input-bordered input-sm"
                      />
                      <Button size="sm" onClick={handleAddCompetence}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {competences.map((comp, i) => (
                        <Badge key={i} className="badge badge-primary badge-sm gap-1">
                          {comp}
                          <button onClick={() => setCompetences(competences.filter((_, idx) => idx !== i))}>
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Langues */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-4">
                    <h2 className="card-title text-sm text-primary">
                      <Globe className="w-4 h-4" />
                      Langues
                    </h2>

                    <Input 
                      placeholder="Ex: Anglais" 
                      value={newLang.language}
                      onChange={(e) => setNewLang({...newLang, language: e.target.value})}
                      className="input input-bordered input-sm"
                    />

                    <select 
                      className="select select-bordered select-sm"
                      value={newLang.proficiency}
                      onChange={(e) => setNewLang({...newLang, proficiency: e.target.value as any})}
                    >
                      <option>Débutant</option>
                      <option>Intermédiaire</option>
                      <option>Avancé</option>
                    </select>

                    <Button size="sm" onClick={handleAddLanguage}>
                      <Plus className="w-3 h-3" />
                    </Button>

                    {languages.map((lang, i) => (
                      <div key={i} className="text-xs flex justify-between">
                        <span>{lang.language}</span>
                        <span className="badge badge-xs">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: Loisirs */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-primary">
                    <Heart className="w-5 h-5" />
                    Loisirs
                  </h2>

                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ex: Voyager" 
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
                      className="input input-bordered"
                    />
                    <Button onClick={handleAddHobby}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((hobby, i) => (
                      <Badge key={i} className="badge badge-outline gap-1">
                        {hobby}
                        <button onClick={() => setHobbies(hobbies.filter((_, idx) => idx !== i))}>×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW DROITE (2/3) */}
          <div className="w-2/3 h-full bg-base-100 overflow-y-auto relative" style={{ backgroundImage: 'url(/file.svg)' }}>
            {/* Contrôles Zoom + Thème */}
            <div className="fixed top-24 right-8 z-50 space-y-3">
              <div className="flex items-center gap-3 bg-base-200 p-3 rounded-lg shadow-xl">
                <input 
                  type="range" 
                  min="50" 
                  max="200" 
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="range range-primary range-xs w-32"
                />
                <span className="text-sm font-bold text-primary">{zoom}%</span>
              </div>

              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="select select-bordered select-sm w-40"
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select 
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="select select-bordered select-sm w-40"
              >
                <option value="modern">Modern</option>
                <option value="premium">Premium</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div 
              className="flex justify-center items-center py-12"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              <div className="shadow-2xl">
                {renderTemplate()}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile - Message d'erreur */}
      <div className="lg:hidden min-h-screen flex items-center justify-center bg-base-200 p-8">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Désolé 😢</h1>
          <p className="text-lg">Le CV Builder est uniquement accessible sur ordinateur pour une meilleure expérience.</p>
        </div>
      </div>

      {/* MODAL DE PREVIEW */}
      {showPreviewModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-7xl">
            <form method="dialog">
              <button 
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowPreviewModal(false)}
              >
                ✕
              </button>
            </form>

            <h3 className="font-bold text-lg mb-4">Aperçu final de votre CV</h3>

            <div className="flex justify-end mb-4">
              <Button onClick={handleDownloadPDF} className="btn btn-primary gap-2">
                <Save className="w-4 h-4" />
                Télécharger PDF
              </Button>
            </div>

            <div className="w-full overflow-auto flex justify-center">
              <div ref={cvPreviewRef} data-theme={theme}>
                {renderTemplate()}
              </div>
            </div>
          </div>
        </dialog>
      )}

      <Footer />
    </>
  );
}


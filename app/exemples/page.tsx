"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Download, 
  Eye, 
  Heart, 
  Star, 
  TrendingUp, 
  Filter,
  X,
  ChevronDown,
  Sparkles,
  Award,
  Users,
  Clock
} from "lucide-react";
import CVImagePreview from "@/components/preview/CVImagePreview";
import CVExampleModalEnhanced from "@/components/preview/CVExampleModalEnhanced";
import type { Experience } from "@/types/cv";

// Interface étendue pour les exemples de CV
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
  experiences: Experience[];
  competences: string;
  objectif: string;
  entrepriseCiblee: string;
  experiencesOriginales: string[];
  experiencesAmeliorees: Experience[];
  competencesOriginales: string[];
  competencesAmeliorees: string[];
  objectifAmeliore: string;
  category: string;
  template: string;
  popularity: number;
  isNew: boolean;
  rating: number;
  views: number;
  downloads: number;
  experienceLevel: "junior" | "senior" | "manager";
  testimonial?: {
    author: string;
    role: string;
    company: string;
    text: string;
  };
}

// Données d'exemples enrichies
const cvExemples: CVExample[] = [
  {
    nom: "Martin", 
    prenom: "Sophie",
    email: "sophie.martin@email.com", 
    telephone: "+33 6 12 34 56 78", 
    adresse: "Paris, France",
    formation: "Master en Informatique", 
    ecole: "École Polytechnique", 
    anneeDiplome: 2022,
    anneeFormation: "2022",
    experiences: [
      { poste: "Développeuse Frontend Senior", entreprise: "StartupXYZ", periode: "2022-2024", description: "Développement d'applications web modernes" },
    ],
    competences: "React, TypeScript, TailwindCSS",
    objectif: "Développeuse frontend passionnée",
    entrepriseCiblee: "Startups tech",
    experiencesOriginales: ["Dev web chez StartupXYZ"],
    experiencesAmeliorees: [
      { poste: "Développeuse Frontend Senior", entreprise: "StartupXYZ", periode: "2022-2024", description: "Développement d'applications web modernes avec React et TypeScript. Mise en place d'une architecture scalable ayant réduit les temps de chargement de 40%." },
    ],
    competencesOriginales: ["React", "JS", "CSS"],
    competencesAmeliorees: ["React.js & Next.js", "TypeScript", "TailwindCSS", "Node.js", "API REST", "Git & CI/CD"],
    objectifAmeliore: "Développeuse frontend passionnée par la création d'expériences web modernes et performantes",
    category: "Tech", 
    template: "Modern", 
    popularity: 2456,
    isNew: false,
    rating: 4.9,
    views: 12453,
    downloads: 3241,
    experienceLevel: "senior",
    testimonial: {
      author: "Marie Dupont",
      role: "Développeuse Web",
      company: "Google",
      text: "Grâce à ce template, j'ai décroché 5 entretiens en 2 semaines. Le format est moderne et met vraiment en valeur les compétences techniques."
    }
  },
  {
    nom: "Dubois", 
    prenom: "Alexandre",
    email: "a.dubois@email.com", 
    telephone: "+33 6 23 45 67 89", 
    adresse: "Lyon, France",
    formation: "Master Marketing Digital", 
    ecole: "ESSEC Business School", 
    anneeDiplome: 2021,
    anneeFormation: "2021",
    experiences: [
      { poste: "Chef de Projet Marketing Digital", entreprise: "AgenceMarketing360", periode: "2021-2024", description: "Pilotage de campagnes multicanales" },
    ],
    competences: "Marketing Digital, SEO/SEM",
    objectif: "Chef de projet marketing digital",
    entrepriseCiblee: "Agences marketing",
    experiencesOriginales: ["Chef de projet marketing"],
    experiencesAmeliorees: [
      { poste: "Chef de Projet Marketing Digital", entreprise: "AgenceMarketing360", periode: "2021-2024", description: "Pilotage de campagnes multicanales pour des clients grands comptes. Augmentation du ROI moyen de 65% grâce à l'optimisation des stratégies SEO et SEM." },
    ],
    competencesOriginales: ["Marketing", "Réseaux sociaux"],
    competencesAmeliorees: ["Marketing Digital", "SEO/SEM", "Google Analytics", "Content Marketing", "Social Media", "Email Marketing", "A/B Testing"],
    objectifAmeliore: "Chef de projet marketing digital spécialisé en stratégies multicanales et growth hacking",
    category: "Marketing", 
    template: "Creative", 
    popularity: 1892,
    isNew: false,
    rating: 4.7,
    views: 8934,
    downloads: 2156,
    experienceLevel: "senior",
  },
  {
    nom: "Leclerc", 
    prenom: "Camille",
    email: "camille.leclerc@email.com", 
    telephone: "+33 6 34 56 78 90", 
    adresse: "Bordeaux, France",
    formation: "Master Design d'Interaction", 
    ecole: "Gobelins", 
    anneeDiplome: 2023,
    anneeFormation: "2023",
    experiences: [
      { poste: "UX/UI Designer", entreprise: "DesignStudio", periode: "2023-2024", description: "Conception d'interfaces utilisateur" }
    ],
    competences: "UI/UX Design, Figma",
    objectif: "UX/UI Designer",
    entrepriseCiblee: "Startups et agences de design",
    experiencesOriginales: ["Designer UX/UI"],
    experiencesAmeliorees: [
      { poste: "UX/UI Designer", entreprise: "DesignStudio", periode: "2023-2024", description: "Conception d'interfaces utilisateur centrées sur l'expérience pour des applications SaaS. Réduction du taux de rebond de 35%." },
    ],
    competencesOriginales: ["Figma", "Design"],
    competencesAmeliorees: ["UI/UX Design", "Figma & Adobe XD", "Design Thinking", "Wireframing", "Prototypage", "User Research", "Design System"],
    objectifAmeliore: "UX/UI Designer passionné par la création d'expériences utilisateur optimales et centrées sur l'humain",
    category: "Design", 
    template: "Premium", 
    popularity: 2103,
    isNew: true,
    rating: 4.8,
    views: 9876,
    downloads: 2876,
    experienceLevel: "junior",
    testimonial: {
      author: "Thomas Bernard",
      role: "UI Designer",
      company: "Airbnb",
      text: "Le template Premium est magnifique ! J'ai reçu des compliments sur le design de mon CV lors de mes entretiens."
    }
  },
  {
    nom: "Rousseau", 
    prenom: "Thomas",
    email: "thomas.rousseau@email.com", 
    telephone: "+33 6 45 67 89 01", 
    adresse: "Paris, France",
    formation: "Master Finance d'Entreprise", 
    ecole: "HEC Paris", 
    anneeDiplome: 2020,
    anneeFormation: "2020",
    experiences: [
      { poste: "Analyste Financier Senior", entreprise: "BNP Paribas", periode: "2020-2024", description: "Analyse financière approfondie" }
    ],
    competences: "Analyse Financière, Excel",
    objectif: "Analyste financier senior",
    entrepriseCiblee: "Banques d'investissement",
    experiencesOriginales: ["Analyste financier"],
    experiencesAmeliorees: [
      { poste: "Analyste Financier Senior", entreprise: "BNP Paribas", periode: "2020-2024", description: "Analyse financière approfondie de sociétés cotées et production de recommandations d'investissement. Gestion d'un portefeuille de 50M€ avec un rendement annuel de +12%." },
    ],
    competencesOriginales: ["Excel", "Finance"],
    competencesAmeliorees: ["Analyse Financière", "Modélisation Excel", "Bloomberg Terminal", "Valorisation d'Entreprise", "M&A", "Risk Management", "Python"],
    objectifAmeliore: "Analyste financier senior spécialisé en M&A et valorisation d'entreprise",
    category: "Finance", 
    template: "Classic", 
    popularity: 1567,
    isNew: true,
    rating: 4.6,
    views: 7234,
    downloads: 1923,
    experienceLevel: "senior",
  },
  {
    nom: "Bernard", 
    prenom: "Julie",
    email: "julie.bernard@email.com", 
    telephone: "+33 6 56 78 90 12", 
    adresse: "Lille, France",
    formation: "Master Commerce International", 
    ecole: "EDHEC Business School", 
    anneeDiplome: 2021,
    anneeFormation: "2021",
    experiences: [
      { poste: "Responsable Développement Commercial", entreprise: "SalesForce EMEA", periode: "2021-2024", description: "Pilotage d'une équipe commerciale" }
    ],
    competences: "Business Development, CRM",
    objectif: "Responsable développement commercial",
    entrepriseCiblee: "Entreprises BtoB",
    experiencesOriginales: ["Responsable commercial"],
    experiencesAmeliorees: [
      { poste: "Responsable Développement Commercial", entreprise: "SalesForce EMEA", periode: "2021-2024", description: "Pilotage d'une équipe de 8 commerciaux et développement du portefeuille clients BtoB. Dépassement des objectifs de CA de +35% sur 2 années consécutives." },
    ],
    competencesOriginales: ["Vente", "Négociation"],
    competencesAmeliorees: ["Business Development", "Négociation Commerciale", "CRM (Salesforce)", "Account Management", "Prospection BtoB", "KPI & Reporting", "English (Fluent)"],
    objectifAmeliore: "Responsable développement commercial spécialisé en BtoB et gestion d'équipes performantes",
    category: "Commerce", 
    template: "Modern", 
    popularity: 1789,
    isNew: true,
    rating: 4.7,
    views: 8123,
    downloads: 2234,
    experienceLevel: "manager",
  },
  {
    nom: "Petit", 
    prenom: "Marie",
    email: "marie.petit@email.com", 
    telephone: "+33 6 67 89 01 23", 
    adresse: "Nantes, France",
    formation: "Master Gestion RH", 
    ecole: "IAE Paris-Sorbonne", 
    anneeDiplome: 2022,
    anneeFormation: "2022",
    experiences: [
      { poste: "Responsable RH", entreprise: "L'Oréal", periode: "2022-2024", description: "Management d'une équipe RH" }
    ],
    competences: "Recrutement, SIRH",
    objectif: "Responsable RH",
    entrepriseCiblee: "Grandes entreprises",
    experiencesOriginales: ["RRH"],
    experiencesAmeliorees: [
      { poste: "Responsable Ressources Humaines", entreprise: "L'Oréal", periode: "2022-2024", description: "Management d'une équipe RH de 5 personnes et pilotage de la stratégie RH pour 300 collaborateurs. Réduction du turnover de 25%." },
    ],
    competencesOriginales: ["Recrutement", "Gestion"],
    competencesAmeliorees: ["Recrutement & Talent Acquisition", "SIRH (Workday)", "Gestion de la Paie", "Droit du Travail", "Management", "Formation", "Relations Sociales"],
    objectifAmeliore: "Responsable RH spécialisé en talent acquisition et développement RH",
    category: "RH", 
    template: "Minimal", 
    popularity: 1456,
    isNew: true,
    rating: 4.5,
    views: 6789,
    downloads: 1876,
    experienceLevel: "senior",
  },
];

const categories = ["Tous", "Tech", "Marketing", "Design", "Finance", "Commerce", "RH"];
const experienceLevels = ["Tous niveaux", "Junior", "Senior", "Manager"];
const templates = ["Tous", "Modern", "Creative", "Premium", "Classic", "Minimal"];
const sortOptions = [
  { value: "popularity", label: "Plus populaires" },
  { value: "rating", label: "Mieux notés" },
  { value: "views", label: "Plus vus" },
  { value: "downloads", label: "Plus téléchargés" },
  { value: "recent", label: "Plus récents" },
];

export default function ExemplesPageEnhanced() {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>("Tous niveaux");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCV, setSelectedCV] = useState<CVExample | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("cv-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (cvId: string) => {
    const newFavorites = favorites.includes(cvId)
      ? favorites.filter(id => id !== cvId)
      : [...favorites, cvId];
    setFavorites(newFavorites);
    localStorage.setItem("cv-favorites", JSON.stringify(newFavorites));
    toast.success(
      favorites.includes(cvId) ? "Retiré des favoris" : "Ajouté aux favoris"
    );
  };

  const handleDownload = async (cv: CVExample, index: number) => {
    setDownloadingIndex(index);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Logique de téléchargement
      toast.success("CV téléchargé avec succès !");
    } catch (error) {
      console.error("Erreur téléchargement:", error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleOpenModal = (cv: CVExample) => {
    setSelectedCV(cv);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCV(null);
  };

  const handleDownloadFromModal = () => {
    if (selectedCV) {
      const index = cvExemples.findIndex(cv => cv === selectedCV);
      handleDownload(selectedCV, index !== -1 ? index : 0);
    }
  };

  const filteredAndSortedCVs = useMemo(() => {
    let filtered = cvExemples.filter((cv) => {
      const matchesCategory = selectedCategory === "Tous" || cv.category === selectedCategory;
      const matchesLevel = selectedExperienceLevel === "Tous niveaux" || 
        cv.experienceLevel === selectedExperienceLevel.toLowerCase();
      const matchesTemplate = selectedTemplate === "Tous" || cv.template === selectedTemplate;
      const matchesSearch = searchQuery === "" ||
        cv.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.formation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.competencesAmeliorees.some((comp) => comp.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesLevel && matchesTemplate && matchesSearch;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "rating":
          return b.rating - a.rating;
        case "views":
          return b.views - a.views;
        case "downloads":
          return b.downloads - a.downloads;
        case "recent":
          return b.isNew ? 1 : -1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, selectedExperienceLevel, selectedTemplate, searchQuery, sortBy]);

  const cvId = (cv: CVExample) => `${cv.prenom}-${cv.nom}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <HeaderV2 />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{cvExemples.length} CV professionnels disponibles</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Exemples de CV{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              qui décrochent des jobs
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez des CVs optimisés par l'IA qui ont aidé des milliers de candidats à obtenir des entretiens. 
            Inspirez-vous et créez le vôtre en quelques minutes.
          </p>

          {/* Statistiques */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">15,000+</p>
                <p className="text-sm text-gray-600">Téléchargements</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">4.7/5</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">&lt;5 min</p>
                <p className="text-sm text-gray-600">Pour créer le vôtre</p>
              </div>
            </div>
          </div>

          <Link href="/create-cv">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Créer mon CV maintenant
            </Button>
          </Link>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              type="text"
              placeholder="Rechercher par métier, compétence, secteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filtres et tri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          {/* Toggle filtres mobiles */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            
            {/* Tri */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtres */}
          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Catégories */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Secteur</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className={`transition-all ${selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : "hover:border-blue-300"}`}
                  >
                    {category}
                    {category !== "Tous" && (
                      <Badge variant="secondary" className="ml-2 bg-white/20 text-current border-0">
                        {cvExemples.filter((cv) => cv.category === category).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Niveau d'expérience */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Niveau d'expérience</p>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((level) => (
                  <Button
                    key={level}
                    onClick={() => setSelectedExperienceLevel(level)}
                    variant={selectedExperienceLevel === level ? "default" : "outline"}
                    size="sm"
                    className={`transition-all ${selectedExperienceLevel === level ? "bg-green-600 hover:bg-green-700" : "hover:border-green-300"}`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Style de CV</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <Button
                    key={template}
                    onClick={() => setSelectedTemplate(template)}
                    variant={selectedTemplate === template ? "default" : "outline"}
                    size="sm"
                    className={`transition-all ${selectedTemplate === template ? "bg-purple-600 hover:bg-purple-700" : "hover:border-purple-300"}`}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">{filteredAndSortedCVs.length}</span> CV{filteredAndSortedCVs.length > 1 ? "s" : ""} {searchQuery || selectedCategory !== "Tous" || selectedExperienceLevel !== "Tous niveaux" || selectedTemplate !== "Tous" ? "trouvé(s)" : "disponible(s)"}
          </p>
          
          {favorites.length > 0 && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              {favorites.length} favori{favorites.length > 1 ? "s" : ""}
            </p>
          )}
        </motion.div>

        {/* Grille de CVs */}
        <AnimatePresence mode="wait">
          {filteredAndSortedCVs.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
            >
              {filteredAndSortedCVs.map((cv, index) => {
                const id = cvId(cv);
                const isFav = favorites.includes(id);

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className="h-full border-2 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                      <div className="relative">
                        {/* Image preview */}
                        <CVImagePreview
                          cvName={`${cv.prenom} ${cv.nom}`}
                          template={cv.template}
                          onClick={() => handleOpenModal(cv)}
                        />

                        {/* Badges overlay */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <Badge className="bg-blue-600 text-white">
                            {cv.category}
                          </Badge>
                          {cv.isNew && (
                            <Badge className="bg-green-600 text-white">
                              Nouveau
                            </Badge>
                          )}
                        </div>

                        {/* Bouton favori */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(id);
                          }}
                          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        >
                          <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>
                      </div>

                      <CardContent className="p-4">
                        {/* Infos */}
                        <div className="mb-3">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {cv.prenom} {cv.nom}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{cv.formation}</p>
                          <p className="text-xs text-gray-500 mt-1">{cv.ecole}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{cv.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{(cv.views / 1000).toFixed(1)}k</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{(cv.downloads / 1000).toFixed(1)}k</span>
                          </div>
                        </div>

                        {/* Compétences */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {cv.competencesAmeliorees.slice(0, 3).map((comp, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                          {cv.competencesAmeliorees.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{cv.competencesAmeliorees.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleOpenModal(cv)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button
                            onClick={() => handleDownload(cv, index)}
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={downloadingIndex === index}
                          >
                            {downloadingIndex === index ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                ...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Aucun CV trouvé</p>
              <p className="text-gray-500 mb-6">Essayez d'ajuster vos filtres ou votre recherche</p>
              <Button
                onClick={() => {
                  setSelectedCategory("Tous");
                  setSelectedExperienceLevel("Tous niveaux");
                  setSelectedTemplate("Tous");
                  setSearchQuery("");
                }}
                variant="outline"
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à créer un CV qui fait la différence ?
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
                Utilisez notre IA pour générer un CV professionnel optimisé en quelques minutes. 
                Gratuit, sans inscription requise.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/create-cv">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Créer mon CV gratuitement
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                  >
                    Voir les formules Premium
                    <TrendingUp className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal */}
        <CVExampleModalEnhanced
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          cv={selectedCV}
          onDownload={handleDownloadFromModal}
          isDownloading={downloadingIndex !== null}
        />
      </main>

      <Footer />
    </div>
  );
}


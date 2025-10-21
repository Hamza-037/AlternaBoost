"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Eye, Download } from "lucide-react"; // Import d'icônes
import CVExampleModal from "@/components/preview/CVExampleModal";
import type { GeneratedCV, Experience } from "@/types/cv";

// La structure de données CVExample est réutilisée telle quelle pour la clarté.
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
  popularity?: number;
  isNew?: boolean;
  previewImage?: string; // Supposons l'existence d'une image pour la prévisualisation
}

// Les données d'exemple sont réutilisées telles quelles.
const cvExemples: CVExample[] = [
  {
    nom: "Martin", prenom: "Sophie",
    email: "sophie.martin@email.com", telephone: "+33 6 12 34 56 78", adresse: "Paris, France",
    formation: "Master en Informatique", ecole: "École Polytechnique", anneeDiplome: 2022,
    anneeFormation: "2022",
    experiences: [
      { poste: "Développeuse Frontend Senior", entreprise: "StartupXYZ", periode: "2022-2024", description: "Développement d'applications web modernes" },
      { poste: "Stagiaire Ingénieur Logiciel", entreprise: "BigTechCorp", periode: "2021-2022", description: "Contribution au développement backend" }
    ],
    competences: "React, TypeScript, TailwindCSS",
    objectif: "Développeuse frontend passionnée",
    entrepriseCiblee: "Startups tech",
    experiencesOriginales: ["Dev web chez StartupXYZ", "Stage chez BigTechCorp"],
    experiencesAmeliorees: [
      { poste: "Développeuse Frontend Senior", entreprise: "StartupXYZ", periode: "2022-2024", description: "Développement d'applications web modernes avec React et TypeScript. Mise en place d'une architecture scalable ayant réduit les temps de chargement de 40%." },
      { poste: "Stagiaire Ingénieur Logiciel", entreprise: "BigTechCorp", periode: "2021-2022", description: "Contribution au développement de fonctionnalités backend en Node.js. Participation à l'amélioration des performances du système de cache." }
    ],
    competencesOriginales: ["React", "JS", "CSS"],
    competencesAmeliorees: ["React.js & Next.js", "TypeScript", "TailwindCSS", "Node.js", "API REST", "Git & CI/CD"],
    objectifAmeliore: "Développeuse frontend passionnée par la création d'expériences web modernes",
    category: "Tech", template: "Modern", popularity: 245, isNew: false
  },
  {
    nom: "Dubois", prenom: "Alexandre",
    email: "a.dubois@email.com", telephone: "+33 6 23 45 67 89", adresse: "Lyon, France",
    formation: "Master Marketing Digital", ecole: "ESSEC Business School", anneeDiplome: 2021,
    anneeFormation: "2021",
    experiences: [
      { poste: "Chef de Projet Marketing Digital", entreprise: "AgenceMarketing360", periode: "2021-2024", description: "Pilotage de campagnes multicanales" },
      { poste: "Assistant Marketing", entreprise: "RetailCorp", periode: "2019-2021", description: "Création de contenus marketing" }
    ],
    competences: "Marketing Digital, SEO/SEM",
    objectif: "Chef de projet marketing digital",
    entrepriseCiblee: "Agences marketing",
    experiencesOriginales: ["Chef de projet marketing", "Assistant marketing"],
    experiencesAmeliorees: [
      { poste: "Chef de Projet Marketing Digital", entreprise: "AgenceMarketing360", periode: "2021-2024", description: "Pilotage de campagnes multicanales pour des clients grands comptes. Augmentation du ROI moyen de 65% grâce à l'optimisation des stratégies SEO et SEM." },
      { poste: "Assistant Marketing", entreprise: "RetailCorp", periode: "2019-2021", description: "Support à la création de contenus marketing et gestion des réseaux sociaux. Croissance de l'engagement de +120% en 6 mois." }
    ],
    competencesOriginales: ["Marketing", "Réseaux sociaux"],
    competencesAmeliorees: ["Marketing Digital", "SEO/SEM", "Google Analytics", "Content Marketing", "Social Media Management", "Email Marketing", "A/B Testing"],
    objectifAmeliore: "Chef de projet marketing digital spécialisé en stratégies multicanales",
    category: "Marketing", template: "Creative", popularity: 189, isNew: false
  },
  {
    nom: "Leclerc", prenom: "Camille",
    email: "camille.leclerc@email.com", telephone: "+33 6 34 56 78 90", adresse: "Bordeaux, France",
    formation: "Master Design d'Interaction", ecole: "Gobelins - École de l'Image", anneeDiplome: 2023,
    anneeFormation: "2023",
    experiences: [{ poste: "Poste", entreprise: "Entreprise", periode: "2020-2024", description: "Description" }],
    competences: "UI/UX Design, Figma",
    objectif: "UX/UI Designer",
    entrepriseCiblee: "Startups et agences de design",
    experiencesOriginales: ["Designer UX/UI", "Freelance design"],
    experiencesAmeliorees: [
      { poste: "UX/UI Designer", entreprise: "DesignStudio", periode: "2023-2024", description: "Conception d'interfaces utilisateur centrées sur l'expérience pour des applications SaaS. Réduction du taux de rebond de 35% grâce à des parcours utilisateurs optimisés." },
      { poste: "Designer Freelance", entreprise: "Indépendant", periode: "2021-2023", description: "Création d'identités visuelles et de sites web pour PME. Portfolio de 15+ clients satisfaits avec un taux de recommandation de 95%." }
    ],
    competencesOriginales: ["Figma", "Design"],
    competencesAmeliorees: ["UI/UX Design", "Figma & Adobe XD", "Design Thinking", "Wireframing", "Prototypage", "User Research", "Design System"],
    objectifAmeliore: "UX/UI Designer passionné par la création d'expériences utilisateur optimales",
    category: "Design", template: "Premium", popularity: 167, isNew: false
  },
  {
    nom: "Rousseau", prenom: "Thomas",
    email: "thomas.rousseau@email.com", telephone: "+33 6 45 67 89 01", adresse: "Paris, France",
    formation: "Master Finance d'Entreprise", ecole: "HEC Paris", anneeDiplome: 2020,
    anneeFormation: "2020",
    experiences: [{ poste: "Poste", entreprise: "Entreprise", periode: "2020-2024", description: "Description" }],
    competences: "Analyse Financière, Excel",
    objectif: "Analyste financier senior",
    entrepriseCiblee: "Banques d'investissement",
    experiencesOriginales: ["Analyste financier", "Stage banque"],
    experiencesAmeliorees: [
      { poste: "Analyste Financier Senior", entreprise: "BNP Paribas", periode: "2020-2024", description: "Analyse financière approfondie de sociétés cotées et production de recommandations d'investissement. Gestion d'un portefeuille de 50M€ avec un rendement annuel de +12%." },
      { poste: "Stagiaire Analyste M&A", entreprise: "Rothschild & Co", periode: "2019-2020", description: "Participation à 5 opérations de fusion-acquisition dans le secteur technologique. Modélisation financière et due diligence pour des transactions de 100M€+." }
    ],
    competencesOriginales: ["Excel", "Finance"],
    competencesAmeliorees: ["Analyse Financière", "Modélisation Excel", "Bloomberg Terminal", "Valorisation d'Entreprise", "M&A", "Risk Management", "Python (Finance)"],
    objectifAmeliore: "Analyste financier senior spécialisé en M&A et valorisation d'entreprise",
    category: "Finance", template: "Classic", popularity: 134, isNew: true
  },
  {
    nom: "Bernard", prenom: "Julie",
    email: "julie.bernard@email.com", telephone: "+33 6 56 78 90 12", adresse: "Lille, France",
    formation: "Master Commerce International", ecole: "EDHEC Business School", anneeDiplome: 2021,
    anneeFormation: "2021",
    experiences: [{ poste: "Poste", entreprise: "Entreprise", periode: "2020-2024", description: "Description" }],
    competences: "Business Development, CRM",
    objectif: "Responsable développement commercial",
    entrepriseCiblee: "Entreprises BtoB",
    experiencesOriginales: ["Responsable commercial", "Commerciale terrain"],
    experiencesAmeliorees: [
      { poste: "Responsable Développement Commercial", entreprise: "SalesForce EMEA", periode: "2021-2024", description: "Pilotage d'une équipe de 8 commerciaux et développement du portefeuille clients BtoB. Dépassement des objectifs de CA de +35% sur 2 années consécutives." },
      { poste: "Ingénieure Commerciale", entreprise: "TechSolutions", periode: "2019-2021", description: "Prospection et fidélisation de clients grands comptes dans le secteur IT. Signature de 12 contrats majeurs représentant 2M€ de CA annuel." }
    ],
    competencesOriginales: ["Vente", "Négociation"],
    competencesAmeliorees: ["Business Development", "Négociation Commerciale", "CRM (Salesforce)", "Account Management", "Prospection BtoB", "KPI & Reporting", "English (Fluent)"],
    objectifAmeliore: "Responsable développement commercial spécialisé en BtoB",
    category: "Commerce", template: "Modern", popularity: 156, isNew: true
  },
  {
    nom: "Petit", prenom: "Marie",
    email: "marie.petit@email.com", telephone: "+33 6 67 89 01 23", adresse: "Nantes, France",
    formation: "Master Gestion des Ressources Humaines", ecole: "IAE Paris-Sorbonne", anneeDiplome: 2022,
    anneeFormation: "2022",
    experiences: [{ poste: "Poste", entreprise: "Entreprise", periode: "2020-2024", description: "Description" }],
    competences: "Recrutement, SIRH",
    objectif: "Responsable RH",
    entrepriseCiblee: "Grandes entreprises",
    experiencesOriginales: ["RRH", "Chargée RH"],
    experiencesAmeliorees: [
      { poste: "Responsable Ressources Humaines", entreprise: "L'Oréal", periode: "2022-2024", description: "Management d'une équipe RH de 5 personnes et pilotage de la stratégie RH pour 300 collaborateurs. Réduction du turnover de 25% grâce à des programmes d'engagement innovants." },
      { poste: "Chargée de Recrutement", entreprise: "Randstad", periode: "2020-2022", description: "Gestion de bout en bout du processus de recrutement pour des profils cadres et techniciens. 80+ recrutements réussis avec un délai moyen de 45 jours." }
    ],
    competencesOriginales: ["Recrutement", "Gestion"],
    competencesAmeliorees: ["Recrutement & Talent Acquisition", "SIRH (Workday)", "Gestion de la Paie", "Droit du Travail", "Management d'Équipe", "Formation & Développement", "Relations Sociales"],
    objectifAmeliore: "Responsable RH spécialisé en talent acquisition et développement RH",
    category: "RH", template: "Minimal", popularity: 98, isNew: true
  },
  {
    nom: "Moreau", prenom: "Lucas",
    email: "lucas.moreau@email.com", telephone: "+33 6 78 90 12 34", adresse: "Toulouse, France",
    formation: "Diplôme d'Infirmier", ecole: "IFSI Toulouse", anneeDiplome: 2019,
    anneeFormation: "2019",
    experiences: [{ poste: "Poste", entreprise: "Entreprise", periode: "2020-2024", description: "Description" }],
    competences: "Soins infirmiers, Urgences",
    objectif: "Infirmier diplômé d'état",
    entrepriseCiblee: "Hôpitaux et cliniques",
    experiencesOriginales: ["Infirmier urgences", "Infirmier service médecine"],
    experiencesAmeliorees: [
      { poste: "Infirmier Diplômé d'État - Service des Urgences", entreprise: "CHU de Toulouse", periode: "2019-2024", description: "Prise en charge globale des patients en situation d'urgence vitale. Coordination avec les équipes médicales pour assurer des soins optimaux dans un environnement à haute pression." },
      { poste: "Infirmier - Service de Médecine Générale", entreprise: "Clinique Saint-Jean", periode: "2017-2019", description: "Administration de soins quotidiens à 20+ patients. Formation de 5 étudiants infirmiers et participation à l'amélioration des protocoles de soins." }
    ],
    competencesOriginales: ["Soins", "Urgences"],
    competencesAmeliorees: ["Soins Infirmiers", "Gestion des Urgences", "Évaluation Clinique", "Protocoles de Soins", "Relation Patient", "Travail en Équipe", "Gestion du Stress"],
    objectifAmeliore: "Infirmier diplômé d'état spécialisé en service d'urgences",
    category: "Santé", template: "Classic", popularity: 112, isNew: true
  },
  {
    nom: "Girard", prenom: "Paul",
    email: "paul.girard@email.com", telephone: "+33 6 89 01 23 45", adresse: "Grenoble, France",
    formation: "Diplôme d'Ingénieur Mécanique", ecole: "INSA Lyon", anneeDiplome: 2020,
    anneeFormation: "2020",
    experiences: [{ poste: "Poste", entreprise: "Entreprise", periode: "2020-2024", description: "Description" }],
    competences: "Conception Mécanique, CAO",
    objectif: "Ingénieur R&D mécanique",
    entrepriseCiblee: "Industrie aéronautique",
    experiencesOriginales: ["Ingénieur R&D", "Stage ingénieur"],
    experiencesAmeliorees: [
      { poste: "Ingénieur R&D Mécanique", entreprise: "Airbus", periode: "2020-2024", description: "Conception et optimisation de systèmes mécaniques pour l'aéronautique. Développement d'une innovation brevetée réduisant la masse des composants de 15%." },
      { poste: "Ingénieur Stagiaire - Bureau d'Études", entreprise: "Safran", periode: "2019-2020", description: "Modélisation CAO 3D et simulations numériques pour l'optimisation de pièces moteur. Contribution à un projet ayant amélioré l'efficacité énergétique de 8%." }
    ],
    competencesOriginales: ["CAO", "Mécanique"],
    competencesAmeliorees: ["Conception Mécanique", "CAO 3D (SolidWorks, CATIA)", "Simulation Numérique", "Analyse par Éléments Finis", "Gestion de Projet", "Lean Manufacturing", "Anglais Technique"],
    objectifAmeliore: "Ingénieur R&D mécanique spécialisé en aéronautique",
    category: "Ingénierie", template: "Modern", popularity: 143, isNew: true
  },
  {
    nom: "Laurent", prenom: "Emma",
    email: "emma.laurent@email.com", telephone: "+33 6 90 12 34 56", adresse: "Paris, France",
    formation: "Master Data Science", ecole: "Télécom Paris", anneeDiplome: 2023,
    anneeFormation: "2023",
    experiences: [{ poste: "Poste", entreprise: "Entreprise", periode: "2020-2024", description: "Description" }],
    competences: "Python, Machine Learning",
    objectif: "Data Analyst / Data Scientist",
    entrepriseCiblee: "Startups tech et scale-ups",
    experiencesOriginales: ["Data Analyst", "Stage data"],
    experiencesAmeliorees: [
      { poste: "Data Analyst", entreprise: "BlaBlaCar", periode: "2023-2024", description: "Analyse de données comportementales de 5M+ utilisateurs pour optimiser les parcours. Développement de dashboards interactifs ayant permis d'augmenter la conversion de 22%." },
      { poste: "Stagiaire Data Scientist", entreprise: "Criteo", periode: "2022-2023", description: "Création de modèles de machine learning pour la prédiction du churn client. Modèle atteignant une précision de 87% déployé en production." }
    ],
    competencesOriginales: ["Python", "SQL"],
    competencesAmeliorees: ["Python (Pandas, NumPy)", "SQL & NoSQL", "Machine Learning", "Data Visualization (Tableau)", "Statistical Analysis", "Apache Spark", "Git & Docker"],
    objectifAmeliore: "Data Analyst / Data Scientist passionnée par l'analyse prédictive",
    category: "Data", template: "Premium", popularity: 201, isNew: true
  }
];

const categories = ["Tous", "Tech", "Marketing", "Design", "Finance", "Commerce", "RH", "Santé", "Ingénierie", "Data"];

export default function ExemplesPage() {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCV, setSelectedCV] = useState<CVExample | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async (cv: CVExample, index: number) => {
    setDownloadingIndex(index);
    try {
      // Simulation d'une attente pour montrer l'état de chargement
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Logique de téléchargement du CV (assumant que /api/generate-cv existe)
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
      });

      if (!response.ok) throw new Error("Erreur lors de la génération du PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_${cv.prenom}_${cv.nom}_exemple.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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
      // Utiliser l'index ou une clé unique si l'index n'est pas fiable pour le downloadingIndex
      handleDownload(selectedCV, index !== -1 ? index : 0); 
    }
  };

  const filteredCVs = useMemo(() => {
    return cvExemples.filter((cv) => {
      const matchesCategory = selectedCategory === "Tous" || cv.category === selectedCategory;
      const matchesSearch = searchQuery === "" ||
        cv.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.formation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Recherche dans les postes d'expériences améliorées
        cv.experiencesAmeliorees.some((exp) => exp.poste.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Recherche dans les compétences améliorées
        cv.competencesAmeliorees.some((comp) => comp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Recherche dans l'objectif amélioré
        cv.objectifAmeliore.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <HeaderV2 />
      <main className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Exemples de CV générés</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez {cvExemples.length} exemples de CV professionnels générés par notre IA. Inspirez-vous et créez le vôtre en quelques minutes.
          </p>
          <Link href="/create-cv">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Créer mon CV maintenant</Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input type="text" placeholder="Rechercher par nom, poste, compétence..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 text-base" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button key={category} onClick={() => setSelectedCategory(category)} variant={selectedCategory === category ? "default" : "outline"}
              className={`transition-all ${selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : "hover:border-blue-300"}`}>
              {category}
              {category !== "Tous" && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
                  {cvExemples.filter((cv) => cv.category === category).length}
                </Badge>
              )}
            </Button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <p className="text-gray-600">{filteredCVs.length} CV{filteredCVs.length > 1 ? "s" : ""} {searchQuery || selectedCategory !== "Tous" ? "trouvé(s)" : "disponible(s)"}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredCVs.length > 0 ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredCVs.map((cv, index) => (
                <motion.div key={`${cv.prenom}-${cv.nom}-${index}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ y: -5 }}>
                  <Card className="h-full border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                    <div onClick={() => handleOpenModal(cv)} className="cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{cv.prenom} {cv.nom}</CardTitle>
                            <CardDescription className="mt-1">{cv.formation}</CardDescription>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 whitespace-nowrap">{cv.category}</Badge>
                            {cv.isNew && <Badge className="bg-green-600 whitespace-nowrap">Nouveau</Badge>}
                            {cv.popularity && cv.popularity > 150 && <Badge className="bg-orange-600 whitespace-nowrap">Populaire</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span><span className="font-semibold text-gray-900">École :</span> {cv.ecole}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span><span className="font-semibold text-gray-900">Expériences :</span> {cv.experiencesAmeliorees.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                              </svg>
                              <span><span className="font-semibold text-gray-900">Template :</span> {cv.template}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900 mb-2">Compétences principales :</p>
                            <div className="flex flex-wrap gap-1">
                              {cv.competencesAmeliorees.slice(0, 4).map((comp, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{comp}</Badge>
                              ))}
                              {cv.competencesAmeliorees.length > 4 && (
                                <Badge variant="outline" className="text-xs">+{cv.competencesAmeliorees.length - 4}</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 italic mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                            <span className="font-semibold text-gray-900">Objectif :</span> {cv.objectifAmeliore}
                          </p>
                        </div>
                      </CardContent>
                    </div>

                    {/* Zone d'action au bas de la carte */}
                    <div className="p-4 border-t bg-gray-50/50 rounded-b-xl flex gap-3">
                      <Button onClick={() => handleOpenModal(cv)} variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" /> Prévisualiser
                      </Button>
                      <Button onClick={() => handleDownload(cv, index)} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={downloadingIndex === index}>
                        {downloadingIndex === index ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <p className="text-xl text-gray-700">😢 Aucun CV ne correspond à vos critères de recherche ou de catégorie.</p>
              <p className="text-md text-gray-500 mt-2">Veuillez ajuster votre recherche ou sélectionner "Tous".</p>
              <Button onClick={() => { setSelectedCategory("Tous"); setSearchQuery(""); }} variant="link" className="mt-4 text-blue-600">
                Afficher tous les exemples
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Composant de Modale de Prévisualisation */}
        <CVExampleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          cv={selectedCV}
          onDownload={handleDownloadFromModal}
          isDownloading={downloadingIndex !== null}
        />

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 mb-12"
        >
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
            {/* Effets de fond */}
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-white mb-2">1200+</div>
                  <div className="text-blue-100">CV générés ce mois</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-white mb-2">95%</div>
                  <div className="text-blue-100">Taux de satisfaction</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-white mb-2">&lt;5 min</div>
                  <div className="text-blue-100">Pour créer votre CV</div>
                </motion.div>
              </div>

              {/* Titre et description */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Prêt à créer un CV qui fait la différence ?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                  Rejoignez les milliers de professionnels qui ont boosté leur carrière avec AlternaBoost.
                  Notre IA optimise chaque section pour maximiser vos chances de décrocher un entretien.
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/create-cv">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
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
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Gratuit pour commencer
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Vos données sécurisées
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  +5000 utilisateurs satisfaits
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}


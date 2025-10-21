"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { GeneratedCV } from "@/types/cv";

// ========================================
// EXEMPLES DE CV (données anonymisées)
// ========================================

const cvExemples: GeneratedCV[] = [
  {
    // Informations personnelles (anonymisées)
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@exemple.fr",
    telephone: "06 12 34 56 78",
    
    // Formation
    formation: "Master Informatique - Spécialité Développement Web",
    ecole: "Université de Paris",
    anneeFormation: "2024-2025",
    
    // Expériences originales
    experiences: [
      {
        poste: "Développeur Frontend",
        entreprise: "TechStart SAS",
        periode: "Sept 2023 - Juin 2024",
        description: "Développement d'interfaces utilisateur avec React et TypeScript",
      },
      {
        poste: "Stagiaire Développement Web",
        entreprise: "Digital Agency",
        periode: "Janv 2023 - Juin 2023",
        description: "Création de sites web responsive avec HTML, CSS et JavaScript",
      },
    ],
    
    // Expériences améliorées par l'IA
    experiencesAmeliorees: [
      {
        poste: "Développeur Frontend",
        entreprise: "TechStart SAS",
        periode: "Sept 2023 - Juin 2024",
        description: "Conception et développement d'interfaces utilisateur modernes avec React et TypeScript. Mise en place de composants réutilisables et optimisation des performances. Collaboration étroite avec l'équipe backend pour l'intégration d'APIs REST.",
      },
      {
        poste: "Stagiaire Développement Web",
        entreprise: "Digital Agency",
        periode: "Janv 2023 - Juin 2023",
        description: "Développement de sites web responsive conformes aux standards W3C. Utilisation de HTML5, CSS3 et JavaScript pour créer des expériences utilisateur engageantes. Intégration de frameworks CSS (Bootstrap, TailwindCSS) pour accélérer le développement.",
      },
    ],
    
    // Compétences
    competences: "React, TypeScript, JavaScript, HTML/CSS, TailwindCSS, Git, API REST",
    competencesAmeliorees: ["React", "TypeScript", "JavaScript", "HTML/CSS", "TailwindCSS", "Git", "API REST"],
    
    // Objectif
    objectif: "Recherche une alternance en développement web pour mettre en pratique mes compétences",
    objectifAmeliore: "Passionnée par le développement web moderne, je recherche une alternance pour approfondir mes compétences techniques et contribuer à des projets innovants au sein d'une équipe dynamique.",
    
    // Entreprise ciblée
    entrepriseCiblee: "Entreprises tech innovantes",
  },
  
  {
    // Profil 2 : Marketing Digital
    nom: "Dubois",
    prenom: "Alexandre",
    email: "alex.dubois@exemple.fr",
    telephone: "07 98 76 54 32",
    
    formation: "Master Marketing Digital et E-commerce",
    ecole: "École Supérieure de Commerce",
    anneeFormation: "2024-2025",
    
    experiences: [
      {
        poste: "Chargé de Communication Digitale",
        entreprise: "Startup Innovante",
        periode: "Sept 2023 - Juin 2024",
        description: "Gestion des réseaux sociaux et création de contenu",
      },
    ],
    
    experiencesAmeliorees: [
      {
        poste: "Chargé de Communication Digitale",
        entreprise: "Startup Innovante",
        periode: "Sept 2023 - Juin 2024",
        description: "Élaboration et mise en œuvre de stratégies de communication digitale sur les réseaux sociaux (LinkedIn, Instagram, Twitter). Création de contenu engageant (visuels, vidéos, articles) ayant généré une augmentation de 40% de l'engagement. Analyse des métriques et optimisation des campagnes pour maximiser le ROI.",
      },
    ],
    
    competences: "Marketing Digital, SEO, Google Analytics, Réseaux Sociaux, Canva, Création de contenu",
    competencesAmeliorees: ["Marketing Digital", "SEO", "Google Analytics", "Réseaux Sociaux", "Canva", "Création de contenu"],
    
    objectif: "Recherche une alternance en marketing digital",
    objectifAmeliore: "Fort d'une expérience réussie en communication digitale, je souhaite rejoindre une entreprise ambitieuse pour développer des stratégies marketing innovantes et contribuer à la croissance de la marque.",
    
    entrepriseCiblee: "Agences de communication",
  },
  
  {
    // Profil 3 : Design UX/UI
    nom: "Leclerc",
    prenom: "Camille",
    email: "camille.leclerc@exemple.fr",
    telephone: "06 45 67 89 12",
    
    formation: "Master Design d'Interface et UX",
    ecole: "École des Gobelins",
    anneeFormation: "2024-2025",
    
    experiences: [
      {
        poste: "Designer UI/UX Junior",
        entreprise: "Studio Créatif",
        periode: "Janv 2023 - Août 2024",
        description: "Design d'interfaces mobiles et web",
      },
    ],
    
    experiencesAmeliorees: [
      {
        poste: "Designer UI/UX Junior",
        entreprise: "Studio Créatif",
        periode: "Janv 2023 - Août 2024",
        description: "Conception d'interfaces utilisateur intuitives pour applications mobiles et web. Réalisation de wireframes, prototypes interactifs et tests utilisateurs. Maîtrise de Figma, Adobe XD et du design system. Collaboration étroite avec les développeurs pour garantir une implémentation fidèle aux maquettes.",
      },
    ],
    
    competences: "Figma, Adobe XD, UI Design, UX Research, Prototypage, Design System",
    competencesAmeliorees: ["Figma", "Adobe XD", "UI Design", "UX Research", "Prototypage", "Design System"],
    
    objectif: "Recherche une alternance en design UX/UI",
    objectifAmeliore: "Passionnée par l'expérience utilisateur et le design d'interface, je recherche une alternance pour créer des produits digitaux innovants et centrés sur les besoins des utilisateurs.",
    
    entrepriseCiblee: "Startups et agences digitales",
  },
];

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function ExemplesPage() {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const handleDownload = async (cv: GeneratedCV, index: number) => {
    setDownloadingIndex(index);
    
    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cv),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du CV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_Exemple_${cv.prenom}_${cv.nom}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("CV téléchargé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* En-tête de la page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Exemples de CV générés
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez la qualité de nos CV générés par l&apos;IA. Ces exemples sont
            basés sur de vraies données (anonymisées) et montrent le rendu professionnel
            que vous obtiendrez.
          </p>
          
          <Link href="/create-cv">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Créer mon CV maintenant
            </Button>
          </Link>
        </motion.div>

        {/* Grille des exemples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cvExemples.map((cv, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl">
                        {cv.prenom} {cv.nom}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {cv.formation}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {index === 0 ? "Tech" : index === 1 ? "Marketing" : "Design"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Informations clés */}
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>
                        <span className="font-semibold text-gray-900">École :</span>{" "}
                        {cv.ecole}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Expériences :</span>{" "}
                        {cv.experiencesAmeliorees.length}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Compétences :</span>{" "}
                        {cv.competencesAmeliorees.length}
                      </div>
                    </div>

                    {/* Compétences principales */}
                    <div>
                      <p className="text-xs font-semibold text-gray-900 mb-2">
                        Compétences principales :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cv.competencesAmeliorees.slice(0, 4).map((comp, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                        {cv.competencesAmeliorees.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{cv.competencesAmeliorees.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Bouton de téléchargement */}
                    <Button
                      onClick={() => handleDownload(cv, index)}
                      disabled={downloadingIndex === index}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      {downloadingIndex === index ? (
                        <span className="flex items-center gap-2">
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
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
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
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                          Télécharger l&apos;exemple (PDF)
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 p-8 bg-blue-50 rounded-2xl border border-blue-100"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Prêt à créer votre propre CV ?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Utilisez AlternaBoost pour générer un CV professionnel optimisé par l&apos;IA
            en quelques minutes. Gratuit, sans inscription.
          </p>
          <Link href="/create-cv">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Créer mon CV gratuitement
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
                className="ml-2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}


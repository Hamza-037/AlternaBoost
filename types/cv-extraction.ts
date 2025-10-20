// Types pour l'extraction et l'analyse de CV existants

export interface ExtractedCVData {
  // Informations personnelles
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  
  // Formation
  formation?: string;
  ecole?: string;
  anneeFormation?: string;
  
  // Expériences professionnelles
  experiences?: Array<{
    poste: string;
    entreprise: string;
    periode: string;
    description: string;
  }>;
  
  // Compétences et objectif
  competences?: string;
  objectif?: string;
  
  // Métadonnées
  langueDetectee?: string;
  formatOriginal?: string;
}

export interface CVAnalysisResult {
  // Score global
  scoreGlobal: number; // 0-100
  
  // Scores détaillés
  scores: {
    contenu: number; // Qualité du contenu (expériences, réalisations)
    structure: number; // Organisation et clarté
    competences: number; // Pertinence et diversité des compétences
    ats: number; // Compatibilité avec les systèmes ATS
    impact: number; // Utilisation de verbes d'action, quantification
  };
  
  // Points forts
  pointsForts: string[];
  
  // Points faibles
  pointsFaibles: string[];
  
  // Recommandations concrètes
  recommandations: Array<{
    priorite: "haute" | "moyenne" | "basse";
    categorie: "contenu" | "structure" | "competences" | "ats" | "impact";
    titre: string;
    description: string;
    exemple?: string;
  }>;
  
  // Mots-clés manquants (pour optimisation ATS)
  motsClésManquants?: string[];
  
  // Estimation du taux de réussite
  tauxReussite: {
    junior: number; // % chances pour postes junior
    confirme: number; // % chances pour postes confirmés
  };
}

export interface CVExtractionResponse {
  success: boolean;
  data?: ExtractedCVData;
  error?: string;
  message?: string;
}

export interface CVAnalysisResponse {
  success: boolean;
  analysis?: CVAnalysisResult;
  error?: string;
  message?: string;
}

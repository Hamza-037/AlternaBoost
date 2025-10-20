export interface Experience {
  poste: string;
  entreprise: string;
  periode: string;
  description: string;
}

export interface CVFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  formation: string;
  ecole: string;
  anneeFormation: string;
  experiences: Experience[];
  competences: string;
  objectif: string;
  entrepriseCiblee: string;
  posteCible?: string;
  descriptionPoste?: string;
  missionsPrioritaires?: string;
  motsClesCibles?: string;
  tonSouhaite?: "professionnel" | "enthousiaste" | "percutant" | "sobre";
}

// Sections optionnelles personnalisables
export interface CVSection {
  id: string;
  type: "langues" | "certifications" | "projets" | "interets" | "custom";
  titre: string;
  contenu: string | string[]; // String pour texte libre, array pour listes
  icon?: string; // Nom de l'icône Lucide
  visible: boolean;
}

// Configuration de style du CV
export interface CVStyle {
  template: "modern" | "premium" | "creative" | "minimal";
  colorScheme: {
    primary: string; // Couleur principale
    secondary: string; // Couleur secondaire
    accent: string; // Couleur d'accent
    text: string; // Couleur du texte
    background: string; // Couleur de fond
  };
  typography: {
    headingFont: "Inter" | "Poppins" | "Roboto" | "Montserrat";
    bodyFont: "Inter" | "Poppins" | "Roboto" | "Montserrat";
  };
  layout: {
    spacing: "compact" | "normal" | "spacious";
    sectionIcons: boolean; // Afficher les icônes de section
  };
}

export interface GeneratedCV extends CVFormData {
  objectifAmeliore: string;
  experiencesAmeliorees: Experience[];
  competencesAmeliorees: string[];
  pitchPersonnalise?: string;
  recommandationsIA?: string[];
  
  // Options de personnalisation PDF
  template?: "premium" | "modern" | "creative" | "minimal";
  profileImageUrl?: string;
  
  // Personnalisation avancée
  style?: CVStyle;
  sectionsPersonnalisees?: CVSection[];
}

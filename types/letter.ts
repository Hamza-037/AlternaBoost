export interface LetterFormData {
  // Informations du candidat
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;

  // Informations de l'entreprise
  entreprise: string;
  destinataire: string; // Nom du recruteur
  posteVise: string;

  // Contenu
  motivations: string; // 3-4 motivations principales
  atouts: string; // Pourquoi vous êtes le bon candidat
  disponibilite: string; // Ex: "Dès que possible", "Septembre 2025"
}

export interface GeneratedLetter extends LetterFormData {
  contenuGenere: string; // Lettre complète générée par l'IA
  dateGeneration: string;
}

// Nouveau : Configuration de style pour les lettres
export interface LetterStyle {
  template: "classic" | "modern" | "creative" | "minimal";
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
    showIcons: boolean; // Afficher les icônes de section
    showBorders: boolean; // Afficher les bordures
  };
}

// Nouveau : Sections personnalisées pour les lettres
export interface LetterSection {
  id: string;
  type: "signature" | "postscript" | "attachment" | "custom";
  titre: string;
  contenu: string;
  visible: boolean;
}
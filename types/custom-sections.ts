// Types pour les sections personnalisables du CV

export type SectionType = 
  | "projects" 
  | "certifications" 
  | "publications" 
  | "references" 
  | "achievements"
  | "volunteering";

export interface Project {
  title: string;
  technologies: string[];
  description: string;
  link?: string;
  date?: string;
}

export interface Certification {
  name: string;
  organization: string;
  date: string;
  credentialId?: string;
}

export interface Publication {
  title: string;
  publisher: string;
  date: string;
  link?: string;
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
}

export interface Achievement {
  title: string;
  description: string;
  date?: string;
}

export interface Volunteering {
  organization: string;
  role: string;
  period: string;
  description: string;
}

export interface CustomSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  data: Project[] | Certification[] | Publication[] | Reference[] | Achievement[] | Volunteering[];
}

export const SECTION_CONFIG = {
  projects: {
    label: "Projets",
    icon: "Folder",
    description: "Projets personnels ou professionnels",
    color: "#3B82F6"
  },
  certifications: {
    label: "Certifications",
    icon: "Award",
    description: "Certifications et formations certifiantes",
    color: "#10B981"
  },
  publications: {
    label: "Publications",
    icon: "BookOpen",
    description: "Articles, livres, recherches publiés",
    color: "#8B5CF6"
  },
  references: {
    label: "Références",
    icon: "Users",
    description: "Contacts professionnels de référence",
    color: "#F59E0B"
  },
  achievements: {
    label: "Réalisations",
    icon: "Trophy",
    description: "Accomplissements et distinctions",
    color: "#EF4444"
  },
  volunteering: {
    label: "Bénévolat",
    icon: "Heart",
    description: "Expériences de volontariat",
    color: "#EC4899"
  }
} as const;


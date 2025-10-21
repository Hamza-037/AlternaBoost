export type ApplicationStatus = 
  | "en_attente" 
  | "entretien" 
  | "offre" 
  | "refus" 
  | "sans_reponse";

export interface StatusHistory {
  status: ApplicationStatus;
  date: Date | string;
  note?: string;
}

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: Date | string;
  lastContactDate?: Date | string | null;
  contactPerson?: string | null;
  notes?: string | null;
  jobUrl?: string | null; // URL de l'offre
  nextFollowUp?: Date | string | null; // Date de relance
  statusHistory?: StatusHistory[]; // Historique des changements
  salary?: string | null; // Salaire proposé
  location?: string | null; // Lieu
  contractType?: string | null; // Type de contrat (CDI, CDD, Stage...)
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateApplicationInput {
  companyName: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastContactDate?: string;
  contactPerson?: string;
  notes?: string;
  jobUrl?: string;
  nextFollowUp?: string;
  salary?: string;
  location?: string;
  contractType?: string;
}

export interface UpdateApplicationInput extends Partial<CreateApplicationInput> {}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  en_attente: "En attente",
  entretien: "Entretien",
  offre: "Offre reçue",
  refus: "Refusé",
  sans_reponse: "Sans réponse",
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, {
  badge: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = {
  en_attente: {
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-300",
    icon: "⏳",
  },
  entretien: {
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-300",
    icon: "💼",
  },
  offre: {
    badge: "bg-green-100 text-green-800 border-green-300",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-300",
    icon: "✅",
  },
  refus: {
    badge: "bg-red-100 text-red-800 border-red-300",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-300",
    icon: "❌",
  },
  sans_reponse: {
    badge: "bg-gray-100 text-gray-800 border-gray-300",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-300",
    icon: "📭",
  },
};

export const CONTRACT_TYPES = [
  "CDI",
  "CDD",
  "Stage",
  "Alternance",
  "Freelance",
  "Intérim",
];

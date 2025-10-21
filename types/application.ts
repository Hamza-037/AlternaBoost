export type ApplicationStatus = 
  | "en_attente" 
  | "entretien" 
  | "offre" 
  | "refus" 
  | "sans_reponse";

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
  icon: string;
}> = {
  en_attente: {
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "🟡",
  },
  entretien: {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "🔵",
  },
  offre: {
    badge: "bg-green-100 text-green-800 border-green-200",
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "🟢",
  },
  refus: {
    badge: "bg-red-100 text-red-800 border-red-200",
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "🔴",
  },
  sans_reponse: {
    badge: "bg-gray-100 text-gray-800 border-gray-200",
    bg: "bg-gray-50",
    text: "text-gray-600",
    icon: "⚪",
  },
};


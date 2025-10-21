import { z } from "zod";

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis").max(100),
  position: z.string().min(1, "Le poste est requis").max(100),
  status: z.enum(["en_attente", "entretien", "offre", "refus", "sans_reponse"], {
    required_error: "Le statut est requis",
  }),
  appliedDate: z.string().min(1, "La date de candidature est requise"),
  lastContactDate: z.string().optional().nullable(),
  contactPerson: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;


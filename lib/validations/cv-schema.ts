import { z } from "zod";

export const experienceSchema = z.object({
  poste: z.string().min(2, "Le poste doit contenir au moins 2 caractères"),
  entreprise: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  periode: z.string().min(2, "La période est requise (ex: Sept 2023 - Juin 2024)"),
  description: z.string().min(10, "Décrivez vos missions et réalisations (min 10 caractères)"),
});

export const cvFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  formation: z.string().min(2, "La formation est requise"),
  ecole: z.string().min(2, "Le nom de l'école est requis"),
  anneeFormation: z.string().min(4, "L'année de formation est requise"),
  experiences: z.array(experienceSchema).min(1, "Au moins une expérience est requise"),
  competences: z.string().min(10, "Listez vos compétences (min 10 caractères)"),
  objectif: z.string().min(20, "L'objectif professionnel doit être plus détaillé (min 20 caractères)"),
  entrepriseCiblee: z.string().min(2, "Le nom de l'entreprise ciblée est requis"),
});

export type CVFormValues = z.infer<typeof cvFormSchema>;


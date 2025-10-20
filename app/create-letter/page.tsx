"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/landing/Header";
import { toast } from "sonner";
import type { LetterFormData } from "@/types/letter";

export default function CreateLetterPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LetterFormData>();

  const onSubmit = async (data: LetterFormData) => {
    setIsGenerating(true);
    try {
      // Appeler l'API pour générer les données (sans PDF)
      const response = await fetch("/api/generate-letter-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la génération");
      }

      // Récupérer les données générées
      const generatedData = await response.json();

      // Stocker dans sessionStorage pour la page de prévisualisation
      sessionStorage.setItem("generated_letter", JSON.stringify(generatedData));

      toast.success("Lettre de motivation générée avec succès !");

      // Rediriger vers la page de prévisualisation
      window.location.href = "/preview-letter";
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-5xl">
        {/* En-tête amélioré */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link href="/">
            <Button variant="ghost" className="mb-6 group">
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
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Retour à l&apos;accueil
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Créez votre lettre de motivation
              </h1>
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl">
            Remplissez le formulaire ci-dessous et laissez l&apos;IA rédiger une lettre
            personnalisée et percutante. Vous pourrez la modifier avant téléchargement !
          </p>
        </motion.div>

        {/* Étapes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="text-gray-700 font-medium">Remplir le formulaire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="text-gray-700 font-medium">L&apos;IA rédige</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="text-gray-700 font-medium">Modifier si besoin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <span className="text-gray-700 font-medium">Télécharger en PDF</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Informations personnelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">
                      Prénom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="prenom"
                      {...register("prenom", { required: "Le prénom est requis" })}
                      placeholder="Votre prénom"
                    />
                    {errors.prenom && (
                      <p className="text-sm text-red-500">{errors.prenom.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nom">
                      Nom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom"
                      {...register("nom", { required: "Le nom est requis" })}
                      placeholder="Votre nom"
                    />
                    {errors.nom && (
                      <p className="text-sm text-red-500">{errors.nom.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { required: "L'email est requis" })}
                      placeholder="votre.email@exemple.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone">
                      Téléphone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telephone"
                      {...register("telephone", { required: "Le téléphone est requis" })}
                      placeholder="06 12 34 56 78"
                    />
                    {errors.telephone && (
                      <p className="text-sm text-red-500">{errors.telephone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">
                    Adresse complète <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="adresse"
                    {...register("adresse", { required: "L'adresse est requise" })}
                    placeholder="123 Rue Example, 75001 Paris"
                  />
                  {errors.adresse && (
                    <p className="text-sm text-red-500">{errors.adresse.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informations sur l'entreprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>L&apos;entreprise et le poste</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entreprise">
                    Nom de l&apos;entreprise <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="entreprise"
                    {...register("entreprise", { required: "L'entreprise est requise" })}
                    placeholder="Ex: TechCorp SAS"
                  />
                  {errors.entreprise && (
                    <p className="text-sm text-red-500">{errors.entreprise.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinataire">
                    Nom du recruteur (optionnel)
                  </Label>
                  <Input
                    id="destinataire"
                    {...register("destinataire")}
                    placeholder="Ex: M. Dupont"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="posteVise">
                    Poste visé <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="posteVise"
                    {...register("posteVise", { required: "Le poste est requis" })}
                    placeholder="Ex: Développeur Full-Stack en alternance"
                  />
                  {errors.posteVise && (
                    <p className="text-sm text-red-500">{errors.posteVise.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contenu de la lettre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Contenu de votre lettre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="motivations">
                    Vos motivations <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="motivations"
                    {...register("motivations", { required: "Les motivations sont requises" })}
                    placeholder="Ex: Passionné par le développement web, je suis attiré par votre entreprise pour son innovation et sa culture d'équipe..."
                    rows={4}
                  />
                  {errors.motivations && (
                    <p className="text-sm text-red-500">{errors.motivations.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="atouts">
                    Vos atouts et compétences <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="atouts"
                    {...register("atouts", { required: "Les atouts sont requis" })}
                    placeholder="Ex: Maîtrise de React et Node.js, expérience en gestion de projet Agile, excellent esprit d'équipe..."
                    rows={4}
                  />
                  {errors.atouts && (
                    <p className="text-sm text-red-500">{errors.atouts.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disponibilite">
                    Disponibilité <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="disponibilite"
                    {...register("disponibilite", { required: "La disponibilité est requise" })}
                    placeholder="Ex: Dès que possible, Septembre 2025, Immédiatement"
                  />
                  {errors.disponibilite && (
                    <p className="text-sm text-red-500">{errors.disponibilite.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bouton de soumission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center"
          >
              <Button
                type="submit"
                size="lg"
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full md:w-auto px-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Génération en cours...
                  </span>
                ) : (
                  "Générer ma lettre de motivation"
                )}
              </Button>
          </motion.div>
        </motion.form>

        {/* Informations complémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
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
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Conseils pour une lettre réussie
            </h3>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Soyez précis et authentique dans vos motivations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Mentionnez des éléments concrets sur l&apos;entreprise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Mettez en avant vos atouts en lien avec le poste</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center gap-2">
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
              >
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h-6.27A2 2 0 0 0 13 15.73V17h5a2 2 0 0 1 0 4H6a2 2 0 0 1 0-4h5v-1.27a2 2 0 0 0-1.73-1.98H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4c0-1.1.9-2 2-2Z" />
              </svg>
              L&apos;IA rédige automatiquement
            </h3>
            <ul className="space-y-2 text-pink-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">✓</span>
                <span>Structure professionnelle en 3 paragraphes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">✓</span>
                <span>Ton adapté et personnalisé</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">✓</span>
                <span>Formules de politesse automatiques</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}


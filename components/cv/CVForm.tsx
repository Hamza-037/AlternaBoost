"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperienceFields } from "./ExperienceFields";
import { cvFormSchema, type CVFormValues } from "@/lib/validations/cv-schema";
import { useAutoSave } from "@/lib/hooks/useAutoSave";
import { toast } from "sonner";

const AUTOSAVE_KEY = "cv_draft";

export function CVForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  const defaultValues: CVFormValues = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    formation: "",
    ecole: "",
    anneeFormation: "",
    experiences: [
      {
        poste: "",
        entreprise: "",
        periode: "",
        description: "",
      },
    ],
    competences: "",
    objectif: "",
    entrepriseCiblee: "",
  };

  const methods = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "experiences",
  });

  // Surveiller toutes les valeurs du formulaire pour l'auto-save
  const formValues = useWatch({ control });

  // Hook d'auto-save
  const { loadSaved, clearSaved } = useAutoSave({
    data: formValues,
    key: AUTOSAVE_KEY,
    delay: 2000, // Sauvegarde 2 secondes après la dernière modification
    enabled: !isGenerating && hasLoadedDraft, // Ne pas sauvegarder pendant la génération
  });

  // Charger le brouillon sauvegardé au montage du composant
  useEffect(() => {
    const savedData = loadSaved();
    if (savedData) {
      // Demander à l'utilisateur s'il veut restaurer le brouillon
      toast.info("Un brouillon de CV a été trouvé", {
        duration: 10000,
        action: {
          label: "Restaurer",
          onClick: () => {
            reset(savedData);
            toast.success("Brouillon restauré");
          },
        },
        cancel: {
          label: "Ignorer",
          onClick: () => {
            clearSaved();
          },
        },
      });
    }
    setHasLoadedDraft(true);
  }, [loadSaved, reset, clearSaved]);

  const onSubmit = async (data: CVFormValues) => {
    setIsGenerating(true);
    try {
      // Appel à l'API pour améliorer le contenu avec l'IA
      const response = await fetch("/api/generate-cv-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la génération du CV");
      }

      const generatedData = await response.json();

      // Stocker les données dans sessionStorage pour la page de prévisualisation
      sessionStorage.setItem("generated_cv", JSON.stringify(generatedData));

      // Supprimer le brouillon après génération réussie
      clearSaved();

      // Rediriger vers la page de prévisualisation
      window.location.href = "/preview-cv";
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la génération du CV"
      );
      setIsGenerating(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prenom"
                  placeholder="Votre prénom"
                  {...register("prenom")}
                />
                {errors.prenom && (
                  <p className="text-sm text-red-500">{errors.prenom.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input id="nom" placeholder="Votre nom" {...register("nom")} />
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
                  placeholder="votre.email@exemple.com"
                  {...register("email")}
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
                  placeholder="06 12 34 56 78"
                  {...register("telephone")}
                />
                {errors.telephone && (
                  <p className="text-sm text-red-500">
                    {errors.telephone.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formation */}
        <Card>
          <CardHeader>
            <CardTitle>Formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formation">
                Diplôme / Formation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="formation"
                placeholder="Ex: Master Informatique"
                {...register("formation")}
              />
              {errors.formation && (
                <p className="text-sm text-red-500">{errors.formation.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ecole">
                  École / Université <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ecole"
                  placeholder="Ex: Université Paris-Saclay"
                  {...register("ecole")}
                />
                {errors.ecole && (
                  <p className="text-sm text-red-500">{errors.ecole.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="anneeFormation">
                  Année <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="anneeFormation"
                  placeholder="Ex: 2024-2025"
                  {...register("anneeFormation")}
                />
                {errors.anneeFormation && (
                  <p className="text-sm text-red-500">
                    {errors.anneeFormation.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expériences professionnelles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Expériences professionnelles</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  poste: "",
                  entreprise: "",
                  periode: "",
                  description: "",
                })
              }
            >
              + Ajouter une expérience
            </Button>
          </div>

          {errors.experiences && !Array.isArray(errors.experiences) && (
            <p className="text-sm text-red-500">{errors.experiences.message}</p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <ExperienceFields
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </div>
        </div>

        {/* Compétences */}
        <Card>
          <CardHeader>
            <CardTitle>Compétences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="competences">
              Listez vos compétences <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="competences"
              placeholder="Ex: JavaScript, React, Node.js, Git, Communication, Travail d'équipe..."
              rows={4}
              {...register("competences")}
            />
            {errors.competences && (
              <p className="text-sm text-red-500">{errors.competences.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Objectif professionnel */}
        <Card>
          <CardHeader>
            <CardTitle>Objectif professionnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="objectif">
                Décrivez votre objectif professionnel{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="objectif"
                placeholder="Ex: Recherche une alternance en développement web pour mettre en pratique mes compétences..."
                rows={4}
                {...register("objectif")}
              />
              {errors.objectif && (
                <p className="text-sm text-red-500">{errors.objectif.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="entrepriseCiblee">
                Entreprise ciblée <span className="text-red-500">*</span>
              </Label>
              <Input
                id="entrepriseCiblee"
                placeholder="Nom de l'entreprise pour laquelle vous postulez"
                {...register("entrepriseCiblee")}
              />
              {errors.entrepriseCiblee && (
                <p className="text-sm text-red-500">
                  {errors.entrepriseCiblee.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bouton de soumission */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={isGenerating}
            className="w-full md:w-auto px-12"
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
              "Générer mon CV professionnel"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}


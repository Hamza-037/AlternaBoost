"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cvFormSchema, type CVFormValues } from "@/lib/validations/cv-schema";
import { CVEditorLayout } from "@/components/cv/CVEditorLayout";
import { CVPreviewLive } from "@/components/cv/CVPreviewLive";
import { TemplateSelector } from "@/components/cv/TemplateSelector";
import { ExperienceFields } from "@/components/cv/ExperienceFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function CreateCVPageV2() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<"template" | "edit">("template");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);

  const methods = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
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
    },
  });

  const { register, handleSubmit, formState: { errors }, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "experiences",
  });

  const formData = useWatch({ control });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentPhase("edit");
  };

  const onSave = async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-cv-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          template: selectedTemplate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la génération");
      }

      const generatedData = await response.json();
      sessionStorage.setItem("generated_cv", JSON.stringify(generatedData));

      toast.success("CV généré avec succès !");
      router.push("/preview-cv");
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

  const onDownloadPDF = () => {
    toast.info("Génération et téléchargement du PDF (à implémenter)");
  };

  // Phase 1 : Sélection du template
  if (currentPhase === "template") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Créez votre CV professionnel
            </h1>
            <p className="text-gray-600">
              Commencez par choisir le template qui vous convient
            </p>
          </motion.div>

          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              Annuler
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Phase 2 : Édition avec split-screen
  const formContent = (
    <FormProvider {...methods}>
      <form className="space-y-6">
        {/* Bouton retour au choix template */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCurrentPhase("template")}
          className="mb-4"
        >
          ← Changer de template
        </Button>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom <span className="text-red-500">*</span></Label>
                <Input id="prenom" placeholder="Votre prénom" {...register("prenom")} />
                {errors.prenom && (
                  <p className="text-sm text-red-500">{errors.prenom.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom <span className="text-red-500">*</span></Label>
                <Input id="nom" placeholder="Votre nom" {...register("nom")} />
                {errors.nom && (
                  <p className="text-sm text-red-500">{errors.nom.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="votre.email@exemple.com" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone <span className="text-red-500">*</span></Label>
                <Input id="telephone" placeholder="06 12 34 56 78" {...register("telephone")} />
                {errors.telephone && (
                  <p className="text-sm text-red-500">{errors.telephone.message}</p>
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
              <Label htmlFor="formation">Diplôme / Formation <span className="text-red-500">*</span></Label>
              <Input id="formation" placeholder="Ex: Master Informatique" {...register("formation")} />
              {errors.formation && (
                <p className="text-sm text-red-500">{errors.formation.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ecole">École / Université <span className="text-red-500">*</span></Label>
                <Input id="ecole" placeholder="Ex: Université Paris-Saclay" {...register("ecole")} />
                {errors.ecole && (
                  <p className="text-sm text-red-500">{errors.ecole.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="anneeFormation">Année <span className="text-red-500">*</span></Label>
                <Input id="anneeFormation" placeholder="Ex: 2024-2025" {...register("anneeFormation")} />
                {errors.anneeFormation && (
                  <p className="text-sm text-red-500">{errors.anneeFormation.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expériences */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Expériences professionnelles</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    poste: "",
                    entreprise: "",
                    periode: "",
                    description: "",
                  })
                }
              >
                + Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <ExperienceFields
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </CardContent>
        </Card>

        {/* Compétences */}
        <Card>
          <CardHeader>
            <CardTitle>Compétences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="competences">Listez vos compétences <span className="text-red-500">*</span></Label>
            <Textarea
              id="competences"
              placeholder="Ex: JavaScript, React, Node.js, Git, Communication..."
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
              <Label htmlFor="objectif">Décrivez votre objectif professionnel <span className="text-red-500">*</span></Label>
              <Textarea
                id="objectif"
                placeholder="Ex: Recherche une alternance en développement web..."
                rows={4}
                {...register("objectif")}
              />
              {errors.objectif && (
                <p className="text-sm text-red-500">{errors.objectif.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="entrepriseCiblee">Entreprise ciblée <span className="text-red-500">*</span></Label>
              <Input
                id="entrepriseCiblee"
                placeholder="Nom de l'entreprise"
                {...register("entrepriseCiblee")}
              />
              {errors.entrepriseCiblee && (
                <p className="text-sm text-red-500">{errors.entrepriseCiblee.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );

  const previewContent = (
    <CVPreviewLive data={formData} template={selectedTemplate} />
  );

  return (
    <CVEditorLayout
      formContent={formContent}
      previewContent={previewContent}
      onSave={onSave}
      onDownloadPDF={onDownloadPDF}
      isSaving={isGenerating}
      saveStatus={null}
    />
  );
}


"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cvFormSchema, type CVFormValues } from "@/lib/validations/cv-schema";
import { CVEditorLayout } from "@/components/cv/CVEditorLayout";
import { CVPreviewLive } from "@/components/cv/CVPreviewLive";
import { ExperienceFields } from "@/components/cv/ExperienceFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function EditCVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  const methods = useForm<CVFormValues>({
    resolver: zodResolver(cvFormSchema),
  });

  const { register, handleSubmit, formState: { errors }, reset, control } = methods;

  // Observer les changements du formulaire
  const formData = useWatch({ control });
  const debouncedFormData = useDebounce(formData, 2000);

  // Charger le CV
  useEffect(() => {
    loadCV();
  }, [id]);

  // Auto-save
  useEffect(() => {
    if (!isLoading && debouncedFormData) {
      autoSave();
    }
  }, [debouncedFormData]);

  const loadCV = async () => {
    try {
      const response = await fetch(`/api/cv/${id}`);
      
      if (!response.ok) {
        throw new Error("CV non trouvé");
      }

      const cv = await response.json();
      
      // Pré-remplir le formulaire avec les données du CV
      if (cv.data) {
        reset(cv.data);
      }
      
      setSelectedTemplate(cv.template || "modern");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement du CV");
      router.push("/my-cvs");
    } finally {
      setIsLoading(false);
    }
  };

  const autoSave = async () => {
    if (isSaving) return;

    try {
      setSaveStatus("saving");
      const response = await fetch(`/api/cv/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
          template: selectedTemplate,
        }),
      });

      if (response.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    }
  };

  const onSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
          template: selectedTemplate,
          status: "completed",
        }),
      });

      if (response.ok) {
        toast.success("CV sauvegardé avec succès");
        router.push("/my-cvs");
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de connexion");
    } finally {
      setIsSaving(false);
    }
  };

  const onDownloadPDF = async () => {
    toast.info("Téléchargement du PDF (à implémenter)");
    // TODO: Implémenter la génération et téléchargement du PDF
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const formContent = (
    <FormProvider {...methods}>
      <form className="space-y-6">
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

        {/* Compétences */}
        <Card>
          <CardHeader>
            <CardTitle>Compétences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="competences">Listez vos compétences <span className="text-red-500">*</span></Label>
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
      isSaving={isSaving}
      saveStatus={saveStatus}
    />
  );
}


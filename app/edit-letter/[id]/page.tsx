"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { CVEditorLayout } from "@/components/cv/CVEditorLayout";
import { LetterPreviewLive } from "@/components/letter/LetterPreviewLive";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { LetterFormData } from "@/types/letter";

export default function EditLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");

  const methods = useForm<LetterFormData>();
  const { register, formState: { errors }, reset, control } = methods;

  const formData = useWatch({ control });
  const debouncedFormData = useDebounce(formData, 2000);

  useEffect(() => {
    loadLetter();
  }, [id]);

  useEffect(() => {
    if (!isLoading && debouncedFormData) {
      autoSave();
    }
  }, [debouncedFormData]);

  const loadLetter = async () => {
    try {
      const response = await fetch(`/api/letter/${id}`);
      
      if (!response.ok) {
        throw new Error("Lettre non trouvée");
      }

      const letter = await response.json();
      
      if (letter.data) {
        reset(letter.data);
      }
      
      if (letter.generatedContent) {
        setGeneratedContent(letter.generatedContent);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement de la lettre");
      router.push("/my-letters");
    } finally {
      setIsLoading(false);
    }
  };

  const autoSave = async () => {
    if (isSaving) return;

    try {
      setSaveStatus("saving");
      const response = await fetch(`/api/letter/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
          generatedContent,
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
      const response = await fetch(`/api/letter/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
          generatedContent,
          status: "completed",
        }),
      });

      if (response.ok) {
        toast.success("Lettre sauvegardée avec succès");
        router.push("/my-letters");
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  const formContent = (
    <FormProvider {...methods}>
      <form className="space-y-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Vos informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom <span className="text-red-500">*</span></Label>
                <Input id="prenom" {...register("prenom")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom <span className="text-red-500">*</span></Label>
                <Input id="nom" {...register("nom")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" {...register("email")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone <span className="text-red-500">*</span></Label>
                <Input id="telephone" {...register("telephone")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse complète <span className="text-red-500">*</span></Label>
              <Input id="adresse" {...register("adresse")} />
            </div>
          </CardContent>
        </Card>

        {/* L'entreprise et le poste */}
        <Card>
          <CardHeader>
            <CardTitle>L'entreprise et le poste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entreprise">Nom de l'entreprise <span className="text-red-500">*</span></Label>
              <Input id="entreprise" {...register("entreprise")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinataire">Nom du recruteur (optionnel)</Label>
              <Input id="destinataire" {...register("destinataire")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posteVise">Poste visé <span className="text-red-500">*</span></Label>
              <Input id="posteVise" {...register("posteVise")} />
            </div>
          </CardContent>
        </Card>

        {/* Contenu de la lettre */}
        <Card>
          <CardHeader>
            <CardTitle>Contenu de votre lettre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivations">Vos motivations <span className="text-red-500">*</span></Label>
              <Textarea id="motivations" rows={5} {...register("motivations")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atouts">Vos atouts et compétences <span className="text-red-500">*</span></Label>
              <Textarea id="atouts" rows={5} {...register("atouts")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disponibilite">Disponibilité <span className="text-red-500">*</span></Label>
              <Input id="disponibilite" {...register("disponibilite")} />
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );

  const previewContent = (
    <LetterPreviewLive
      data={formData}
      generatedContent={generatedContent}
      template="standard"
    />
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


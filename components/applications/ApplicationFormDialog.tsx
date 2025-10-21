"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { applicationSchema, type ApplicationFormValues } from "@/lib/validations/application-schema";
import type { Application } from "@/types/application";
import { APPLICATION_STATUS_LABELS, CONTRACT_TYPES } from "@/types/application";
import { 
  Loader2, 
  Building2, 
  Briefcase, 
  Calendar, 
  FileText, 
  Link as LinkIcon,
  MapPin,
  DollarSign,
  Bell
} from "lucide-react";

interface ApplicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application | null;
  onSuccess: () => void;
}

export function ApplicationFormDialog({
  open,
  onOpenChange,
  application,
  onSuccess,
}: ApplicationFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      companyName: "",
      position: "",
      status: "en_attente",
      appliedDate: new Date().toISOString().split("T")[0],
      lastContactDate: "",
      contactPerson: "",
      notes: "",
      jobUrl: "",
      nextFollowUp: "",
      salary: "",
      location: "",
      contractType: "",
    },
  });

  const selectedStatus = watch("status");

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (application) {
      reset({
        companyName: application.companyName,
        position: application.position,
        status: application.status as any,
        appliedDate: new Date(application.appliedDate).toISOString().split("T")[0],
        lastContactDate: application.lastContactDate
          ? new Date(application.lastContactDate).toISOString().split("T")[0]
          : "",
        contactPerson: application.contactPerson || "",
        notes: application.notes || "",
        jobUrl: application.jobUrl || "",
        nextFollowUp: application.nextFollowUp
          ? new Date(application.nextFollowUp).toISOString().split("T")[0]
          : "",
        salary: application.salary || "",
        location: application.location || "",
        contractType: application.contractType || "",
      });
    } else {
      reset({
        companyName: "",
        position: "",
        status: "en_attente",
        appliedDate: new Date().toISOString().split("T")[0],
        lastContactDate: "",
        contactPerson: "",
        notes: "",
        jobUrl: "",
        nextFollowUp: "",
        salary: "",
        location: "",
        contractType: "",
      });
    }
  }, [application, reset]);

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);

    try {
      const url = application
        ? `/api/applications/${application.id}`
        : "/api/applications";

      const method = application ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement");
      }

      toast.success(
        application
          ? "Candidature mise à jour avec succès"
          : "Candidature ajoutée avec succès"
      );

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {application ? "Modifier la candidature" : "Nouvelle candidature"}
          </DialogTitle>
          <DialogDescription>
            {application
              ? "Mettez à jour les informations de votre candidature"
              : "Ajoutez une nouvelle candidature à votre suivi"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* SECTION 1: Informations principales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Building2 className="w-4 h-4 text-blue-600" />
              Informations principales
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Entreprise <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="Ex: Google France"
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Poste <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  {...register("position")}
                  placeholder="Ex: Développeur Full Stack"
                  className={errors.position ? "border-red-500" : ""}
                />
                {errors.position && (
                  <p className="text-sm text-red-500">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl" className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                Lien vers l'annonce
              </Label>
              <Input
                id="jobUrl"
                type="url"
                {...register("jobUrl")}
                placeholder="https://www.welcometothejungle.com/..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Collez l'URL de l'offre (Indeed, WelcomeToTheJungle, LinkedIn, etc.)
              </p>
            </div>
          </div>

          <Separator />

          {/* SECTION 2: Détails du poste */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Détails du poste
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractType">Type de contrat</Label>
                <Select
                  value={watch("contractType")}
                  onValueChange={(value) => setValue("contractType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Localisation
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Ex: Paris, France"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  Salaire
                </Label>
                <Input
                  id="salary"
                  {...register("salary")}
                  placeholder="Ex: 35-40K €"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* SECTION 3: Suivi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-blue-600" />
              Suivi de candidature
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">
                  Statut <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setValue("status", value as any)}
                >
                  <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appliedDate">
                  Date de candidature <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appliedDate"
                  type="date"
                  {...register("appliedDate")}
                  className={errors.appliedDate ? "border-red-500" : ""}
                />
                {errors.appliedDate && (
                  <p className="text-sm text-red-500">{errors.appliedDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastContactDate">Dernier contact</Label>
                <Input
                  id="lastContactDate"
                  type="date"
                  {...register("lastContactDate")}
                />
                <p className="text-xs text-gray-500">
                  Date du dernier échange (email, appel, entretien)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextFollowUp" className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-orange-600" />
                  Prochaine relance
                </Label>
                <Input
                  id="nextFollowUp"
                  type="date"
                  {...register("nextFollowUp")}
                  className="border-orange-200 focus:border-orange-500"
                />
                <p className="text-xs text-orange-600 font-medium">
                  Vous recevrez une alerte pour relancer
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Personne de contact</Label>
              <Input
                id="contactPerson"
                {...register("contactPerson")}
                placeholder="Ex: Marie Dupont - Responsable RH"
              />
            </div>
          </div>

          <Separator />

          {/* SECTION 4: Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Notes personnelles
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Ajoutez vos remarques, impressions, détails de l'entretien, etc.
              
Exemples:
- Premier contact avec Marie, RH très sympathique
- Entretien technique prévu le 15/03
- Salaire négociable selon expérience
- Ambiance startup, équipe jeune"
              rows={6}
              className="resize-none"
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Ces notes sont privées et ne seront vues que par vous
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {application ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

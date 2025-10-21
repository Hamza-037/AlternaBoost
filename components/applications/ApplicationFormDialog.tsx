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
import { toast } from "sonner";
import { applicationSchema, type ApplicationFormValues } from "@/lib/validations/application-schema";
import type { Application } from "@/types/application";
import { APPLICATION_STATUS_LABELS } from "@/types/application";
import { Loader2 } from "lucide-react";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {application ? "Modifier la candidature" : "Nouvelle candidature"}
          </DialogTitle>
          <DialogDescription>
            {application
              ? "Mettez à jour les informations de votre candidature"
              : "Ajoutez une nouvelle candidature à votre suivi"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Entreprise et Poste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Entreprise <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                {...register("companyName")}
                placeholder="Ex: Google"
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

          {/* Statut et Date */}
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

          {/* Dernier contact et Personne de contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastContactDate">Dernier contact</Label>
              <Input
                id="lastContactDate"
                type="date"
                {...register("lastContactDate")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Personne de contact</Label>
              <Input
                id="contactPerson"
                {...register("contactPerson")}
                placeholder="Ex: Marie Dupont (RH)"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Ajoutez des notes sur cette candidature..."
              rows={4}
              className="resize-none"
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
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


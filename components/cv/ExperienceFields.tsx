"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { CVFormValues } from "@/lib/validations/cv-schema";

interface ExperienceFieldsProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export function ExperienceFields({
  index,
  onRemove,
  canRemove,
}: ExperienceFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CVFormValues>();

  const experienceErrors = errors.experiences?.[index];

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Expérience {index + 1}</h3>
            {canRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemove}
              >
                Supprimer
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`experiences.${index}.poste`}>
                Poste <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`experiences.${index}.poste`}
                placeholder="Ex: Développeur Web"
                {...register(`experiences.${index}.poste`)}
              />
              {experienceErrors?.poste && (
                <p className="text-sm text-red-500">
                  {experienceErrors.poste.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`experiences.${index}.entreprise`}>
                Entreprise <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`experiences.${index}.entreprise`}
                placeholder="Ex: TechCorp"
                {...register(`experiences.${index}.entreprise`)}
              />
              {experienceErrors?.entreprise && (
                <p className="text-sm text-red-500">
                  {experienceErrors.entreprise.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`experiences.${index}.periode`}>
              Période <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`experiences.${index}.periode`}
              placeholder="Ex: Sept 2023 - Juin 2024"
              {...register(`experiences.${index}.periode`)}
            />
            {experienceErrors?.periode && (
              <p className="text-sm text-red-500">
                {experienceErrors.periode.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`experiences.${index}.description`} className="flex items-center gap-2">
              Description <span className="text-red-500">*</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                <Sparkles className="w-3 h-3" />
                IA optimisée
              </span>
            </Label>
            <Textarea
              id={`experiences.${index}.description`}
              placeholder="Ex: Développement de features, collaboration équipe... (l'IA va reformuler professionnellement)"
              rows={4}
              {...register(`experiences.${index}.description`)}
            />
            {experienceErrors?.description && (
              <p className="text-sm text-red-500">
                {experienceErrors.description.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


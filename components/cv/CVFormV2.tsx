"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ExperienceFields } from "./ExperienceFields";
import { cvFormSchema } from "@/lib/validations/cv-schema";
import { useAutoSave } from "@/hooks/useAutoSave";
import { toast } from "sonner";
import type { CVFormData } from "@/types/cv";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Target, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileText,
  Brain,
  Download
} from "lucide-react";

export function CVFormV2() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
  });

  // Auto-save avec le hook personnalisé
  useAutoSave(watch, "cv_form_data");

  const onSubmit = async (data: CVFormData) => {
    setIsGenerating(true);
    try {
      // Appeler l'API pour générer les données (sans PDF)
      const response = await fetch("/api/generate-cv-data", {
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
      sessionStorage.setItem("generated_cv", JSON.stringify(generatedData));

      toast.success("CV généré avec succès !");

      // Rediriger vers la page de prévisualisation
      window.location.href = "/preview-cv";
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Informations personnelles",
      icon: User,
      description: "Vos coordonnées de base"
    },
    {
      id: 2,
      title: "Formation",
      icon: GraduationCap,
      description: "Votre parcours académique"
    },
    {
      id: 3,
      title: "Expériences",
      icon: Briefcase,
      description: "Vos expériences professionnelles"
    },
    {
      id: 4,
      title: "Objectif & Compétences",
      icon: Target,
      description: "Vos objectifs et compétences"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête avec progression */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créez votre CV professionnel
          </h1>
          <p className="text-gray-600">
            Remplissez le formulaire étape par étape pour générer votre CV
          </p>
        </div>

        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% complété
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Étapes */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center text-center ${
                step.id <= currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step.id <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-gray-500 max-w-24">{step.description}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Étape 1: Informations personnelles */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">
                      Prénom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="prenom"
                      {...register("prenom", { required: "Le prénom est requis" })}
                      placeholder="Votre prénom"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.telephone && (
                      <p className="text-sm text-red-500">{errors.telephone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Étape 2: Formation */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="formation">
                    Diplôme/Formation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="formation"
                    {...register("formation", { required: "La formation est requise" })}
                    placeholder="Ex: Master en Informatique"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.formation && (
                    <p className="text-sm text-red-500">{errors.formation.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ecole">
                      École/Université <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ecole"
                      {...register("ecole", { required: "L'école est requise" })}
                      placeholder="Ex: Université de Paris"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
                      {...register("anneeFormation", { required: "L'année est requise" })}
                      placeholder="Ex: 2022-2025"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.anneeFormation && (
                      <p className="text-sm text-red-500">{errors.anneeFormation.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Étape 3: Expériences */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Expériences professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceFields register={register} setValue={setValue} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Étape 4: Objectif & Compétences */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Objectif professionnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="objectif">
                    Votre objectif <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="objectif"
                    {...register("objectif", { required: "L'objectif est requis" })}
                    placeholder="Décrivez votre objectif professionnel en quelques lignes..."
                    rows={4}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.objectif && (
                    <p className="text-sm text-red-500">{errors.objectif.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competences">
                    Compétences <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="competences"
                    {...register("competences", { required: "Les compétences sont requises" })}
                    placeholder="Listez vos compétences principales (séparées par des virgules)"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.competences && (
                    <p className="text-sm text-red-500">{errors.competences.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entrepriseCiblee">
                      Entreprise ciblée (optionnel)
                    </Label>
                    <Input
                      id="entrepriseCiblee"
                      {...register("entrepriseCiblee")}
                      placeholder="Ex: Google, Microsoft..."
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation entre étapes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            ← Précédent
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 px-8"
            >
              {isGenerating ? (
                <>
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
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Générer mon CV
                </>
              )}
            </Button>
          )}
        </motion.div>
      </form>

      {/* Informations complémentaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">IA Avancée</h3>
          </div>
          <p className="text-blue-800 text-sm">
            Notre IA optimise automatiquement votre contenu pour chaque poste visé.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Templates Pro</h3>
          </div>
          <p className="text-purple-800 text-sm">
            4 templates professionnels avec personnalisation avancée.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <Download className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">PDF Instantané</h3>
          </div>
          <p className="text-green-800 text-sm">
            Téléchargez votre CV en PDF haute qualité en quelques secondes.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

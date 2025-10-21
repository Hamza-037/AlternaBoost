"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cvFormSchema, type CVFormValues } from "@/lib/validations/cv-schema";
import { CVUploader } from "@/components/cv/CVUploader";
import { toast } from "sonner";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Target, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Upload
} from "lucide-react";
import type { ExtractedCVData } from "@/types/cv-extraction";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";

const AUTOSAVE_KEY = "cv_draft";

export function CVFormSteps() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Commencer à 0 pour l'import
  const [showImportStep, setShowImportStep] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState<{ current?: number; limit?: number }>({});
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<CVFormValues>({
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

  // Gérer l'extraction réussie du CV
  const handleExtractedCV = (data: ExtractedCVData) => {
    // Pré-remplir le formulaire avec les données extraites
    if (data.prenom) setValue("prenom", data.prenom);
    if (data.nom) setValue("nom", data.nom);
    if (data.email) setValue("email", data.email);
    if (data.telephone) setValue("telephone", data.telephone);
    if (data.formation) setValue("formation", data.formation);
    if (data.ecole) setValue("ecole", data.ecole);
    if (data.anneeFormation) setValue("anneeFormation", data.anneeFormation);
    if (data.competences) setValue("competences", data.competences);
    if (data.objectif) setValue("objectif", data.objectif);
    
    // Gérer les expériences
    if (data.experiences && data.experiences.length > 0) {
      // Réinitialiser le tableau d'expériences
      reset({
        ...watch(),
        experiences: data.experiences,
      });
    }
    
    // Passer directement à l'étape 1
    setShowImportStep(false);
    setCurrentStep(1);
    
    toast.success("Formulaire pré-rempli ! Vérifiez et complétez les informations.");
  };

  // Passer l'étape d'import
  const handleSkipImport = () => {
    setShowImportStep(false);
    setCurrentStep(1);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  // Auto-sauvegarde dans localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      if (!isGenerating) {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isGenerating]);

  // Charger le brouillon au montage
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      toast.info("Brouillon trouvé", {
        duration: 5000,
        action: {
          label: "Restaurer",
          onClick: () => {
            const data = JSON.parse(saved);
            Object.keys(data).forEach((key) => {
              // Logique de restauration si nécessaire
            });
            toast.success("Brouillon restauré");
          },
        },
      });
    }
  }, []);

  const onSubmit = async (data: CVFormValues) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-cv-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Vérifier si c'est une erreur de limite atteinte
        if (response.status === 403 && error.error === 'Limite atteinte') {
          setUpgradeData({ current: error.current, limit: error.limit });
          setShowUpgradeModal(true);
          setIsGenerating(false);
          return;
        }
        
        // Vérifier si c'est une erreur d'authentification
        if (response.status === 401) {
          toast.error("Veuillez vous connecter pour créer un CV");
          setTimeout(() => {
            window.location.href = "/sign-in?redirect_url=/create-cv";
          }, 1500);
          setIsGenerating(false);
          return;
        }
        
        throw new Error(error.error || "Erreur lors de la génération");
      }

      const generatedData = await response.json();
      sessionStorage.setItem("generated_cv", JSON.stringify(generatedData));
      localStorage.removeItem(AUTOSAVE_KEY);
      
      toast.success("CV généré avec succès !");
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

  // Observer les valeurs du formulaire pour la validation
  const formValues = watch();

  // Fonction de validation pour chaque étape
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        // Étape 1: Informations personnelles
        return !!(
          formValues.prenom &&
          formValues.nom &&
          formValues.email &&
          formValues.telephone &&
          formValues.prenom.trim() !== "" &&
          formValues.nom.trim() !== "" &&
          formValues.email.trim() !== "" &&
          formValues.telephone.trim() !== ""
        );
      case 2:
        // Étape 2: Formation
        return !!(
          formValues.formation &&
          formValues.ecole &&
          formValues.anneeFormation &&
          formValues.formation.trim() !== "" &&
          formValues.ecole.trim() !== "" &&
          formValues.anneeFormation.trim() !== ""
        );
      case 3:
        // Étape 3: Expériences (au moins une expérience complète)
        return formValues.experiences?.every(
          (exp) =>
            exp.poste &&
            exp.entreprise &&
            exp.periode &&
            exp.description &&
            exp.poste.trim() !== "" &&
            exp.entreprise.trim() !== "" &&
            exp.periode.trim() !== "" &&
            exp.description.trim() !== ""
        ) ?? false;
      case 4:
        // Étape 4: Objectif & Compétences
        return !!(
          formValues.objectif &&
          formValues.competences &&
          formValues.entrepriseCiblee &&
          formValues.objectif.trim() !== "" &&
          formValues.competences.trim() !== "" &&
          formValues.entrepriseCiblee.trim() !== ""
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (!isStepValid(currentStep)) {
      toast.error("Veuillez remplir tous les champs obligatoires avant de continuer");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    {
      id: 1,
      title: "Informations personnelles",
      icon: User,
    },
    {
      id: 2,
      title: "Formation",
      icon: GraduationCap,
    },
    {
      id: 3,
      title: "Expériences",
      icon: Briefcase,
    },
    {
      id: 4,
      title: "Objectif & Compétences",
      icon: Target,
    }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      {/* Étape 0 : Import de CV (optionnelle) */}
      {showImportStep && currentStep === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CVUploader 
            onExtractSuccess={handleExtractedCV}
            onSkip={handleSkipImport}
          />
        </motion.div>
      )}

      {/* Formulaire normal (étapes 1-4) */}
      {(!showImportStep || currentStep > 0) && (
        <>
          {/* En-tête avec progression */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Étape {currentStep} sur {totalSteps}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep - 1].title}
              </p>
            </div>

            {/* Barre de progression */}
            <div className="mb-8">
              <Progress value={(currentStep / totalSteps) * 100} className="h-2 mb-4" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{Math.round((currentStep / totalSteps) * 100)}% complété</span>
              </div>
            </div>

        {/* Étapes visuelles */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center text-center p-3 rounded-lg transition-all ${
                  step.id === currentStep
                    ? "bg-blue-50 border-2 border-blue-600"
                    : step.id < currentStep
                    ? "bg-green-50 border-2 border-green-600"
                    : "bg-gray-50 border-2 border-gray-200"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.id === currentStep
                      ? "bg-blue-600 text-white"
                      : step.id < currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-xs font-medium hidden sm:block">{step.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenu des étapes avec animation */}
      <AnimatePresence mode="wait">
        {/* Étape 1: Informations personnelles */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Informations personnelles
                </CardTitle>
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
                    <Input
                      id="nom"
                      placeholder="Votre nom"
                      {...register("nom")}
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
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Formation
                </CardTitle>
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
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Expériences professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-gray-50">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Expérience {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Poste <span className="text-red-500">*</span></Label>
                          <Input
                            placeholder="Ex: Développeur Web"
                            {...register(`experiences.${index}.poste` as const)}
                          />
                          {errors.experiences?.[index]?.poste && (
                            <p className="text-sm text-red-500">
                              {errors.experiences[index]?.poste?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Entreprise <span className="text-red-500">*</span></Label>
                          <Input
                            placeholder="Ex: Google"
                            {...register(`experiences.${index}.entreprise` as const)}
                          />
                          {errors.experiences?.[index]?.entreprise && (
                            <p className="text-sm text-red-500">
                              {errors.experiences[index]?.entreprise?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Période <span className="text-red-500">*</span></Label>
                        <Input
                          placeholder="Ex: Jan 2023 - Déc 2023"
                          {...register(`experiences.${index}.periode` as const)}
                        />
                        {errors.experiences?.[index]?.periode && (
                          <p className="text-sm text-red-500">
                            {errors.experiences[index]?.periode?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Description <span className="text-red-500">*</span></Label>
                        <Textarea
                          placeholder="Décrivez vos missions et réalisations..."
                          rows={3}
                          {...register(`experiences.${index}.description` as const)}
                        />
                        {errors.experiences?.[index]?.description && (
                          <p className="text-sm text-red-500">
                            {errors.experiences[index]?.description?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({
                    poste: "",
                    entreprise: "",
                    periode: "",
                    description: "",
                  })}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une expérience
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Étape 4: Objectif & Compétences */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Objectif professionnel & Compétences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objectif" className="flex items-center gap-2">
                    Votre objectif <span className="text-red-500">*</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      IA
                    </span>
                  </Label>
                  <Textarea
                    id="objectif"
                    placeholder="Ex: Recherche une alternance en développement web... (l'IA va reformuler professionnellement)"
                    rows={4}
                    {...register("objectif")}
                  />
                  {errors.objectif && (
                    <p className="text-sm text-red-500">{errors.objectif.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competences" className="flex items-center gap-2">
                    Compétences <span className="text-red-500">*</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      IA
                    </span>
                  </Label>
                  <Textarea
                    id="competences"
                    placeholder="Ex: JavaScript, React, Communication... (l'IA va les organiser par catégorie)"
                    rows={3}
                    {...register("competences")}
                  />
                  {errors.competences && (
                    <p className="text-sm text-red-500">{errors.competences.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entrepriseCiblee">
                    Entreprise ciblée <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="entrepriseCiblee"
                    placeholder="Ex: Google, Microsoft..."
                    {...register("entrepriseCiblee")}
                  />
                  {errors.entrepriseCiblee && (
                    <p className="text-sm text-red-500">{errors.entrepriseCiblee.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="pt-6">
        {/* Message d'aide si l'étape n'est pas complète */}
        {!isStepValid(currentStep) && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Veuillez remplir tous les champs obligatoires pour continuer
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </Button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isGenerating || !isStepValid(currentStep)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Générer mon CV avec l'IA
              </>
            )}
          </Button>
        )}
        </div>
      </div>
      </>
      )}
      
      {/* Modal d'upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type="cv"
        current={upgradeData.current}
        limit={upgradeData.limit}
      />
    </form>
  );
}

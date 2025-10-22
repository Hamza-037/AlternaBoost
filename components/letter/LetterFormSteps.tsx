"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  User, 
  Building2, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import type { LetterFormData } from "@/types/letter";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";
import { ImportFromCVButton } from "./ImportFromCVButton";

const AUTOSAVE_KEY = "letter_draft";

export function LetterFormSteps() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState<{ current?: number; limit?: number }>({});
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LetterFormData>({
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      adresse: "",
      entreprise: "",
      destinataire: "",
      posteVise: "",
      motivations: "",
      atouts: "",
      disponibilite: "",
    },
  });

  // Fonction pour importer les données depuis un CV
  const handleImportFromCV = (data: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
  }) => {
    setValue("prenom", data.prenom);
    setValue("nom", data.nom);
    setValue("email", data.email);
    setValue("telephone", data.telephone);
    setValue("adresse", data.adresse);
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
          formValues.adresse &&
          formValues.prenom.trim() !== "" &&
          formValues.nom.trim() !== "" &&
          formValues.email.trim() !== "" &&
          formValues.telephone.trim() !== "" &&
          formValues.adresse.trim() !== ""
        );
      case 2:
        // Étape 2: L'entreprise et le poste
        return !!(
          formValues.entreprise &&
          formValues.posteVise &&
          formValues.entreprise.trim() !== "" &&
          formValues.posteVise.trim() !== ""
        );
      case 3:
        // Étape 3: Contenu de la lettre
        return !!(
          formValues.motivations &&
          formValues.atouts &&
          formValues.disponibilite &&
          formValues.motivations.trim() !== "" &&
          formValues.atouts.trim() !== "" &&
          formValues.disponibilite.trim() !== ""
        );
      default:
        return false;
    }
  };

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
            toast.success("Brouillon restauré");
          },
        },
      });
    }
  }, []);

  const onSubmit = async (data: LetterFormData) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-letter-data", {
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
          toast.error("Veuillez vous connecter pour créer une lettre");
          setTimeout(() => {
            window.location.href = "/sign-in?redirect_url=/create-letter";
          }, 1500);
          setIsGenerating(false);
          return;
        }
        
        throw new Error(error.error || "Erreur lors de la génération");
      }

      const generatedData = await response.json();
      sessionStorage.setItem("generated_letter", JSON.stringify(generatedData));
      localStorage.removeItem(AUTOSAVE_KEY);
      
      toast.success("Lettre de motivation générée avec succès !");
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
      title: "Vos informations",
      icon: User,
    },
    {
      id: 2,
      title: "L'entreprise et le poste",
      icon: Building2,
    },
    {
      id: 3,
      title: "Contenu de la lettre",
      icon: FileText,
    }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
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
        <div className="grid grid-cols-3 gap-2">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center text-center p-3 rounded-lg transition-all ${
                  step.id === currentStep
                    ? "bg-purple-50 border-2 border-purple-600"
                    : step.id < currentStep
                    ? "bg-green-50 border-2 border-green-600"
                    : "bg-gray-50 border-2 border-gray-200"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.id === currentStep
                      ? "bg-purple-600 text-white"
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
                  <User className="w-5 h-5 text-purple-600" />
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bouton Import depuis CV */}
                <div className="flex justify-end mb-4">
                  <ImportFromCVButton onImport={handleImportFromCV} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">
                      Prénom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="prenom"
                      placeholder="Votre prénom"
                      {...register("prenom", { required: "Le prénom est requis" })}
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
                      {...register("nom", { required: "Le nom est requis" })}
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
                      {...register("email", { required: "L'email est requis" })}
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
                      {...register("telephone", { required: "Le téléphone est requis" })}
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
                    placeholder="123 Rue Example, 75001 Paris"
                    {...register("adresse", { required: "L'adresse est requise" })}
                  />
                  {errors.adresse && (
                    <p className="text-sm text-red-500">{errors.adresse.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Étape 2: L'entreprise et le poste */}
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
                  <Building2 className="w-5 h-5 text-purple-600" />
                  L&apos;entreprise et le poste
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entreprise">
                    Nom de l&apos;entreprise <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="entreprise"
                    placeholder="Ex: TechCorp SAS"
                    {...register("entreprise", { required: "L'entreprise est requise" })}
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
                    placeholder="Ex: M. Dupont"
                    {...register("destinataire")}
                  />
                  <p className="text-xs text-gray-500">
                    Si vous connaissez le nom du recruteur, mentionnez-le ici
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="posteVise">
                    Poste visé <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="posteVise"
                    placeholder="Ex: Développeur Full-Stack en alternance"
                    {...register("posteVise", { required: "Le poste est requis" })}
                  />
                  {errors.posteVise && (
                    <p className="text-sm text-red-500">{errors.posteVise.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Étape 3: Contenu de la lettre */}
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
                  <FileText className="w-5 h-5 text-purple-600" />
                  Contenu de votre lettre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="motivations">
                    Vos motivations <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="motivations"
                    placeholder="Ex: Passionné par le développement web, je suis attiré par votre entreprise pour son innovation et sa culture d'équipe..."
                    rows={5}
                    {...register("motivations", { required: "Les motivations sont requises" })}
                  />
                  {errors.motivations && (
                    <p className="text-sm text-red-500">{errors.motivations.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Expliquez pourquoi vous souhaitez travailler dans cette entreprise
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="atouts">
                    Vos atouts et compétences <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="atouts"
                    placeholder="Ex: Maîtrise de React et Node.js, expérience en gestion de projet Agile, excellent esprit d'équipe..."
                    rows={5}
                    {...register("atouts", { required: "Les atouts sont requis" })}
                  />
                  {errors.atouts && (
                    <p className="text-sm text-red-500">{errors.atouts.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Mettez en avant vos compétences en lien avec le poste
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disponibilite">
                    Disponibilité <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="disponibilite"
                    placeholder="Ex: Dès que possible, Septembre 2025, Immédiatement"
                    {...register("disponibilite", { required: "La disponibilité est requise" })}
                  />
                  {errors.disponibilite && (
                    <p className="text-sm text-red-500">{errors.disponibilite.message}</p>
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
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isGenerating || !isStepValid(currentStep)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Générer ma lettre avec l'IA
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Modal d'upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type="letter"
        current={upgradeData.current}
        limit={upgradeData.limit}
      />
    </form>
  );
}

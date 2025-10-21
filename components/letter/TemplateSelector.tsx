"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, FileText } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  requiredPlan: "FREE" | "STARTER" | "PRO";
  isPopular?: boolean;
  color: string;
}

const letterTemplates: LetterTemplate[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Format classique et professionnel pour toutes les candidatures",
    isPremium: false,
    requiredPlan: "FREE",
    isPopular: true,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "professional",
    name: "Professionnel",
    description: "Mise en page élégante pour les postes de direction",
    isPremium: true,
    requiredPlan: "STARTER",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Design moderne pour les secteurs créatifs et startups",
    isPremium: true,
    requiredPlan: "PRO",
    color: "from-pink-500 to-rose-600",
  },
];

interface LetterTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function LetterTemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: LetterTemplateSelectorProps) {
  const { user } = useUser();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const userPlan = (user?.publicMetadata?.plan as string) || "FREE";

  const planHierarchy: Record<string, number> = {
    FREE: 0,
    STARTER: 1,
    PRO: 2,
    PREMIUM: 3,
  };

  const canUseTemplate = (template: LetterTemplate): boolean => {
    return planHierarchy[userPlan] >= planHierarchy[template.requiredPlan];
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez le style de votre lettre
        </h2>
        <p className="text-gray-600">
          Sélectionnez le format qui correspond à votre candidature
        </p>
      </div>

      {/* Grille de templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {letterTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isLocked = !canUseTemplate(template);
          const isHovered = hoveredTemplate === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "ring-4 ring-purple-500 shadow-2xl"
                    : "hover:shadow-xl hover:scale-105"
                } ${isLocked ? "opacity-75" : ""}`}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => !isLocked && onSelectTemplate(template.id)}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {template.isPopular && (
                    <Badge className="bg-amber-500 text-white border-0">
                      Populaire
                    </Badge>
                  )}
                  {template.isPremium && (
                    <Badge
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm"
                    >
                      {template.requiredPlan}
                    </Badge>
                  )}
                </div>

                {/* Icône de sélection */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 z-10"
                  >
                    <div className="bg-purple-500 text-white rounded-full p-2 shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  </motion.div>
                )}

                {/* Aperçu du template */}
                <div
                  className={`h-48 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Pattern de lignes (lettre) */}
                  <div className="absolute inset-0 opacity-20 p-6">
                    <div className="space-y-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 bg-white rounded"
                          style={{ width: `${90 - i * 5}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Icône centrale */}
                  <FileText className="w-20 h-20 text-white opacity-30" />

                  {/* Overlay si verrouillé */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                      <Lock className="w-10 h-10 text-white mb-2" />
                      <p className="text-white text-sm font-medium">
                        Plan {template.requiredPlan} requis
                      </p>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>

                  <Button
                    className="w-full"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={isLocked}
                    onClick={(e) => {
                      e.stopPropagation();
                      !isLocked && onSelectTemplate(template.id);
                    }}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Passer au plan {template.requiredPlan}
                      </>
                    ) : isSelected ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Sélectionné
                      </>
                    ) : (
                      "Utiliser ce modèle"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info plan */}
      {userPlan === "FREE" && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm text-purple-900 text-center">
            💡 <strong>Passez au plan Starter</strong> pour accéder à des styles
            de lettres plus sophistiqués
          </p>
        </div>
      )}
    </div>
  );
}


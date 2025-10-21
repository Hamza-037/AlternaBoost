"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Eye, FileText } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Template {
  id: string;
  name: string;
  description: string;
  category: "Moderne" | "Élégant" | "Créatif" | "Minimaliste";
  isPremium: boolean;
  requiredPlan: "FREE" | "STARTER" | "PRO" | "PREMIUM";
  isPopular?: boolean;
  isNew?: boolean;
  previewImage?: string;
  color: string;
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Moderne",
    description: "Design épuré et professionnel, parfait pour tous les secteurs",
    category: "Moderne",
    isPremium: false,
    requiredPlan: "FREE",
    isPopular: true,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Template élégant avec mise en page sophistiquée",
    category: "Élégant",
    isPremium: true,
    requiredPlan: "STARTER",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Design audacieux pour les métiers créatifs",
    category: "Créatif",
    isPremium: true,
    requiredPlan: "PRO",
    isNew: true,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "minimal",
    name: "Minimaliste",
    description: "Simplicité et clarté pour un impact maximum",
    category: "Minimaliste",
    isPremium: true,
    requiredPlan: "PRO",
    color: "from-gray-600 to-gray-800",
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const { user } = useUser();
  const [filter, setFilter] = useState<string>("Tous");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const userPlan = (user?.publicMetadata?.plan as string) || "FREE";

  const planHierarchy: Record<string, number> = {
    FREE: 0,
    STARTER: 1,
    PRO: 2,
    PREMIUM: 3,
  };

  const canUseTemplate = (template: Template): boolean => {
    return planHierarchy[userPlan] >= planHierarchy[template.requiredPlan];
  };

  const categories = ["Tous", "Moderne", "Élégant", "Créatif", "Minimaliste"];

  const filteredTemplates = templates.filter(
    (t) => filter === "Tous" || t.category === filter
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez votre template
        </h2>
        <p className="text-gray-600">
          Sélectionnez le design qui correspond le mieux à votre profil
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className="transition-all"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Grille de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const isLocked = !canUseTemplate(template);
            const isHovered = hoveredTemplate === template.id;

            return (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "ring-4 ring-blue-500 shadow-2xl"
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
                    {template.isNew && (
                      <Badge className="bg-green-500 text-white border-0">
                        Nouveau
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
                      <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    </motion.div>
                  )}

                  {/* Aperçu du template */}
                  <div
                    className={`h-64 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}
                  >
                    {/* Pattern de fond */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="grid grid-cols-12 gap-2 p-4 h-full">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div key={i} className="bg-white rounded"></div>
                        ))}
                      </div>
                    </div>

                    {/* Icône centrale */}
                    <FileText className="w-24 h-24 text-white opacity-30" />

                    {/* Overlay au hover */}
                    <AnimatePresence>
                      {isHovered && !isLocked && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Ouvrir modal de preview
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            Aperçu
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Overlay si verrouillé */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                        <Lock className="w-12 h-12 text-white mb-2" />
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
        </AnimatePresence>
      </div>

      {/* Message si aucun template disponible */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Aucun template trouvé dans cette catégorie
          </p>
        </div>
      )}

      {/* Info plan */}
      {userPlan === "FREE" && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-900 text-center">
            💡 <strong>Passez au plan Starter</strong> pour débloquer plus de
            templates professionnels
          </p>
        </div>
      )}
    </div>
  );
}


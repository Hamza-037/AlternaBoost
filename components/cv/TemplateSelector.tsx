"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Check, Crown, Sparkles, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Template {
  id: "modern" | "premium" | "creative" | "minimal";
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isPremium: boolean;
  requiredPlan: string;
  preview: string;
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Moderne",
    description: "Design épuré et professionnel, parfait pour tous les secteurs",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    isPremium: false,
    requiredPlan: "GRATUIT",
    preview: "bg-gradient-to-br from-blue-100 to-cyan-100",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Template élégant avec mise en page sophistiquée",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    isPremium: true,
    requiredPlan: "STARTER",
    preview: "bg-gradient-to-br from-purple-100 to-pink-100",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Design audacieux pour les métiers créatifs",
    icon: Sparkles,
    color: "from-pink-500 to-orange-500",
    isPremium: true,
    requiredPlan: "PRO",
    preview: "bg-gradient-to-br from-pink-100 to-orange-100",
  },
  {
    id: "minimal",
    name: "Minimaliste",
    description: "Simplicité et clarté pour un impact maximum (ATS-friendly)",
    icon: Zap,
    color: "from-gray-600 to-gray-800",
    isPremium: true,
    requiredPlan: "PRO",
    preview: "bg-gradient-to-br from-gray-100 to-gray-200",
  },
];

interface TemplateSelectorProps {
  selected: string;
  onSelect: (template: "modern" | "premium" | "creative" | "minimal") => void;
  userPlan?: string;
}

export function TemplateSelector({ selected, onSelect, userPlan = "FREE" }: TemplateSelectorProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPremiumTemplate, setSelectedPremiumTemplate] = useState<Template | null>(null);

  const handleTemplateClick = (template: Template) => {
    if (template.isPremium && userPlan === "FREE") {
      setSelectedPremiumTemplate(template);
      setShowUpgradeModal(true);
    } else {
      onSelect(template.id);
    }
  };

  const canUseTemplate = (template: Template) => {
    if (!template.isPremium) return true;
    if (userPlan === "PRO" || userPlan === "PREMIUM") return true;
    if (userPlan === "STARTER" && template.id === "premium") return true;
    return false;
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selected === template.id;
          const canUse = canUseTemplate(template);
          const isLocked = template.isPremium && !canUse;

          return (
            <motion.div
              key={template.id}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
            >
              <Card
                className={`relative p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-offset-2 shadow-xl"
                    : "hover:shadow-lg"
                } ${isLocked ? "opacity-75" : ""}`}
                style={{
                  ringColor: isSelected ? template.color : undefined,
                }}
                onClick={() => handleTemplateClick(template)}
              >
                {/* Badge Selected */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${template.color} shadow-lg`}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Lock overlay pour les templates premium */}
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <Badge variant="secondary" className="text-xs">
                        {template.requiredPlan} requis
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Preview couleur */}
                <div
                  className={`w-full h-20 rounded-lg mb-3 ${template.preview} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Motif décoratif */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-2 w-16 h-16 border-2 border-white rounded-lg" />
                    <div className="absolute bottom-2 right-2 w-12 h-12 border-2 border-white rounded-lg" />
                  </div>
                  <Icon className="w-10 h-10 text-gray-700 relative z-10" />
                </div>

                {/* Infos template */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{template.name}</h3>
                    {template.isPremium && (
                      <Badge
                        className={`text-xs bg-gradient-to-r ${template.color} text-white border-0`}
                      >
                        {template.id === "premium" ? "STARTER" : "PRO"}
                      </Badge>
                    )}
                    {!template.isPremium && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        GRATUIT
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-tight">
                    {template.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Modal d'upgrade */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-yellow-500" />
              Template Premium
            </DialogTitle>
            <DialogDescription>
              Ce template nécessite un abonnement{" "}
              <span className="font-semibold">{selectedPremiumTemplate?.requiredPlan}</span> ou supérieur.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedPremiumTemplate && (
              <Card className={`p-4 bg-gradient-to-br ${selectedPremiumTemplate.preview}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedPremiumTemplate.color} flex items-center justify-center`}>
                    {selectedPremiumTemplate.icon && <selectedPremiumTemplate.icon className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedPremiumTemplate.name}</h4>
                    <p className="text-sm text-gray-600">{selectedPremiumTemplate.description}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Débloquez ce template et bien plus :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✨ Tous les templates premium</li>
                <li>✨ CVs et lettres illimités</li>
                <li>✨ Analyse IA avancée</li>
                <li>✨ Export PDF + DOCX</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Link href="/pricing" className="flex-1">
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Voir les offres
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

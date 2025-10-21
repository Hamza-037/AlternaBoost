"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SectionType, SECTION_CONFIG } from "@/types/custom-sections";
import { 
  Folder, 
  Award, 
  BookOpen, 
  Users, 
  Trophy, 
  Heart,
  Plus,
  Check
} from "lucide-react";

interface AddSectionModalProps {
  open: boolean;
  onClose: () => void;
  onAddSection: (type: SectionType) => void;
  existingSections: SectionType[];
}

const ICONS = {
  Folder,
  Award,
  BookOpen,
  Users,
  Trophy,
  Heart
};

export function AddSectionModal({ open, onClose, onAddSection, existingSections }: AddSectionModalProps) {
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);

  const handleAdd = () => {
    if (selectedType) {
      onAddSection(selectedType);
      setSelectedType(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ajouter une section au CV
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Choisissez une section pour enrichir votre CV et vous démarquer !
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(SECTION_CONFIG).map(([type, config]) => {
            const Icon = ICONS[config.icon as keyof typeof ICONS];
            const isAdded = existingSections.includes(type as SectionType);
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => !isAdded && setSelectedType(type as SectionType)}
                disabled={isAdded}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-left
                  ${isAdded 
                    ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' 
                    : isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                {isAdded && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: config.color }} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{config.label}</h3>
                    <p className="text-xs text-gray-600">{config.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={!selectedType}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


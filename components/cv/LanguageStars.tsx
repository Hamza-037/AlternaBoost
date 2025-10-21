"use client";

import React from "react";
import { Star, Globe } from "lucide-react";

type Language = {
  language: string;
  proficiency: "Débutant" | "Intermédiaire" | "Avancé";
};

interface LanguageStarsProps {
  languages: Language[];
}

const getStarCount = (proficiency: string): number => {
  switch (proficiency) {
    case "Débutant":
      return 1;
    case "Intermédiaire":
      return 2;
    case "Avancé":
      return 3;
    default:
      return 1;
  }
};

export function LanguageStars({ languages }: LanguageStarsProps) {
  if (!languages || languages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune langue ajoutée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {languages.map((lang, index) => {
        const starCount = getStarCount(lang.proficiency);
        
        return (
          <div
            key={index}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 text-sm">{lang.language}</span>
              <Globe className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= starCount
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{lang.proficiency}</p>
          </div>
        );
      })}
    </div>
  );
}


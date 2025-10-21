"use client";

import React from "react";
import { Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SkillBadgesProps {
  competences: string[];
}

const BADGE_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-300",
  "bg-purple-100 text-purple-700 border-purple-300",
  "bg-pink-100 text-pink-700 border-pink-300",
  "bg-indigo-100 text-indigo-700 border-indigo-300",
  "bg-cyan-100 text-cyan-700 border-cyan-300",
  "bg-violet-100 text-violet-700 border-violet-300",
];

export function SkillBadges({ competences }: SkillBadgesProps) {
  if (!competences || competences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune compétence ajoutée</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {competences.map((skill, index) => {
        const colorClass = BADGE_COLORS[index % BADGE_COLORS.length];
        
        return (
          <div
            key={index}
            className={`px-4 py-2 rounded-full font-medium text-sm border ${colorClass} hover:scale-105 transition-transform cursor-default shadow-sm`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              {skill}
            </div>
          </div>
        );
      })}
    </div>
  );
}


"use client";

import React from "react";
import { CheckCircle, TrendingUp, Award, Target } from "lucide-react";

interface OptionalSectionsProps {
  primaryColor: string;
  secondaryColor?: string;
  skills?: string[];
  achievements?: { label: string; value: string; }[];
  whyCompany?: string[];
}

export function KeySkillsSection({ skills, primaryColor }: { skills: string[]; primaryColor: string }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="my-8 p-6 rounded-xl" style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}20` }}>
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5" style={{ color: primaryColor }} />
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
          Compétences Clés
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div 
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-sm font-medium text-gray-900">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AchievementsSection({ achievements, primaryColor, secondaryColor }: { achievements: { label: string; value: string; }[]; primaryColor: string; secondaryColor?: string }) {
  if (!achievements || achievements.length === 0) return null;

  const colors = [primaryColor, secondaryColor || primaryColor];

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5" style={{ color: primaryColor }} />
        <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
          Réalisations Clés
        </h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className="px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${colors[index % colors.length]}15, ${colors[index % colors.length]}25)`,
              border: `2px solid ${colors[index % colors.length]}40`,
            }}
          >
            <div className="flex items-baseline gap-2">
              <span 
                className="text-xl font-black"
                style={{ color: colors[index % colors.length] }}
              >
                {achievement.value}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {achievement.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhyCompanySection({ whyCompany, primaryColor }: { whyCompany: string[]; primaryColor: string }) {
  if (!whyCompany || whyCompany.length === 0) return null;

  return (
    <div 
      className="my-8 p-6 rounded-xl border-l-4"
      style={{ 
        backgroundColor: `${primaryColor}05`,
        borderColor: primaryColor,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5" style={{ color: primaryColor }} />
        <h3 className="text-base font-bold" style={{ color: primaryColor }}>
          Pourquoi cette entreprise ?
        </h3>
      </div>
      <ul className="space-y-3">
        {whyCompany.map((reason, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{ color: primaryColor }} 
            />
            <span className="text-sm text-gray-800 leading-relaxed">{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Composant wrapper pour toutes les sections optionnelles
export function OptionalSections({ 
  skills, 
  achievements, 
  whyCompany, 
  primaryColor, 
  secondaryColor 
}: OptionalSectionsProps) {
  const hasAnySections = (skills && skills.length > 0) || 
                         (achievements && achievements.length > 0) || 
                         (whyCompany && whyCompany.length > 0);

  if (!hasAnySections) return null;

  return (
    <div className="space-y-6 my-10">
      <KeySkillsSection skills={skills || []} primaryColor={primaryColor} />
      <AchievementsSection 
        achievements={achievements || []} 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor}
      />
      <WhyCompanySection whyCompany={whyCompany || []} primaryColor={primaryColor} />
    </div>
  );
}


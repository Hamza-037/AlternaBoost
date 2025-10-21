"use client";

import { Card } from "@/components/ui/card";
import type { GeneratedCV } from "@/types/cv";
import { Mail, Phone, Briefcase, GraduationCap, Award, Target } from "lucide-react";

interface ModernCVTemplateProps {
  cvData: GeneratedCV;
  profileImage?: string;
  customColors?: {
    primary?: string;
    secondary?: string;
  };
}

export function ModernCVTemplate({
  cvData,
  profileImage,
  customColors,
}: ModernCVTemplateProps) {
  const data = cvData;
  const primaryColor = customColors?.primary || "#2563EB";
  const accentColor = customColors?.secondary || "#3B82F6";

  return (
    <div className="w-full bg-white">
      {/* Header avec gradient */}
      <div 
        className="relative p-8 pb-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 50%, ${accentColor}dd 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              {`${data.prenom} ${data.nom}`.toUpperCase()}
            </h1>
            
            <div className="text-lg font-medium text-blue-100 mb-4">
              {data.formation || ""}
            </div>
            
            {/* Coordonnées */}
            <div className="flex flex-wrap gap-4 text-sm text-blue-50">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{data.telephone}</span>
              </div>
            </div>
          </div>

          {/* Photo de profil */}
          {profileImage && (
            <div className="flex-shrink-0">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl"
              >
                <img 
                  src={profileImage} 
                  alt="Photo de profil" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Corps du CV */}
      <div className="p-8 space-y-6">
        {/* Objectif */}
        {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                OBJECTIF PROFESSIONNEL
              </h2>
            </div>
            <div className="pl-13">
              <p className="text-gray-700 leading-relaxed">
                {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
              </p>
            </div>
          </section>
        )}

        {/* Formation */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              FORMATION
            </h2>
          </div>
          <div className="pl-13">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{data.formation}</h3>
                <p className="text-sm font-medium" style={{ color: accentColor }}>
                  {data.ecole}
                </p>
              </div>
              <div 
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor 
                }}
              >
                {data.anneeFormation}
              </div>
            </div>
          </div>
        </section>

        {/* Expériences */}
        {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                EXPÉRIENCES PROFESSIONNELLES
              </h2>
            </div>
            <div className="pl-13 space-y-4">
              {data.experiencesAmeliorees.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div 
                    className="absolute -left-[52px] top-2 w-3 h-3 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {exp.poste}
                      </h3>
                      <div 
                        className="text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                        style={{ 
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor 
                        }}
                      >
                        {exp.periode}
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium" style={{ color: accentColor }}>
                      {exp.entreprise}
                    </p>
                    
                    <div className="text-gray-700 leading-relaxed">
                      <p>{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compétences */}
        {(data.competencesAmeliorees || data.competences) && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                COMPÉTENCES
              </h2>
            </div>
            <div className="pl-13">
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(data.competencesAmeliorees) 
                  ? data.competencesAmeliorees 
                  : (data.competencesAmeliorees || data.competences || "").split(/[,;]/))
                  .map((comp: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: `${primaryColor}10`,
                        color: primaryColor,
                        border: `1px solid ${primaryColor}30`,
                      }}
                    >
                      {typeof comp === 'string' ? comp.trim() : comp}
                    </span>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

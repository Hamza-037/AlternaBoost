"use client";

import type { GeneratedCV } from "@/types/cv";
import { Mail, Phone, Briefcase, GraduationCap, Award, Target } from "lucide-react";

interface PremiumCVTemplateProps {
  cvData: GeneratedCV;
  profileImage?: string;
  customColors?: {
    primary?: string;
    secondary?: string;
  };
}

export function PremiumCVTemplate({
  cvData,
  profileImage,
  customColors,
}: PremiumCVTemplateProps) {
  const data = cvData;
  const primaryColor = customColors?.primary || "#7C3AED";
  const accentColor = customColors?.secondary || "#8B5CF6";

  return (
    <div className="w-full bg-white flex">
      {/* Sidebar gauche */}
      <div 
        className="w-[35%] p-8 text-white"
        style={{
          background: `linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%)`,
        }}
      >
        {/* Photo */}
        {profileImage && (
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl mb-6">
            <img src={profileImage} alt="Photo" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Nom */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {data.prenom} {data.nom}
          </h1>
          <p className="text-sm opacity-90">{data.formation}</p>
        </div>

        {/* Contact */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-white/30 pb-2">
            Contact
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="break-all">{data.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{data.telephone}</span>
            </div>
          </div>
        </div>

        {/* Compétences */}
        {(data.competencesAmeliorees || data.competences) && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-wide border-b-2 border-white/30 pb-2">
              Compétences
            </h2>
            <div className="space-y-2 text-sm">
              {(Array.isArray(data.competencesAmeliorees) 
                ? data.competencesAmeliorees 
                : (data.competencesAmeliorees || data.competences || "").split(/[,;]/))
                .map((comp: string, index: number) => (
                  <div 
                    key={index}
                    className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm"
                  >
                    {typeof comp === 'string' ? comp.trim() : comp}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-8 space-y-6">
        {/* Objectif */}
        {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                PROFIL
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
            </p>
          </section>
        )}

        {/* Formation */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
              FORMATION
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{data.formation}</h3>
                <p className="text-sm text-gray-600">{data.ecole}</p>
              </div>
              <span 
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor 
                }}
              >
                {data.anneeFormation}
              </span>
            </div>
          </div>
        </section>

        {/* Expériences */}
        {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                EXPÉRIENCES
              </h2>
            </div>
            <div className="space-y-6">
              {data.experiencesAmeliorees.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div 
                    className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{exp.poste}</h3>
                    <span 
                      className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                      style={{ 
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor 
                      }}
                    >
                      {exp.periode}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
                    {exp.entreprise}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

"use client";

import type { GeneratedCV } from "@/types/cv";
import { Mail, Phone, Briefcase, GraduationCap, Award, Target } from "lucide-react";

interface CreativeCVTemplateProps {
  cvData: GeneratedCV;
  profileImage?: string;
  customColors?: {
    primary?: string;
    secondary?: string;
  };
}

export function CreativeCVTemplate({
  cvData,
  profileImage,
  customColors,
}: CreativeCVTemplateProps) {
  const data = cvData;
  const primaryColor = customColors?.primary || "#F97316";
  const accentColor = customColors?.secondary || "#FB923C";

  return (
    <div className="w-full bg-white">
      {/* Header créatif avec formes */}
      <div className="relative overflow-hidden">
        <div 
          className="h-48 relative"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          }}
        >
          {/* Formes décoratives */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: "white", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10" style={{ background: "white", transform: "translate(-20%, 20%)" }} />
          
          <div className="relative z-10 p-8 flex items-end justify-between h-full">
            <div className="text-white">
              <h1 className="text-5xl font-black mb-2 tracking-tight">
                {data.prenom} {data.nom}
              </h1>
              <p className="text-xl opacity-90">{data.formation}</p>
            </div>
            
            {profileImage && (
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                <img src={profileImage} alt="Photo" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Barre de contact */}
        <div className="flex flex-wrap gap-6 px-8 py-4 bg-gray-50 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" style={{ color: primaryColor }} />
            <span className="text-gray-700">{data.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{ color: primaryColor }} />
            <span className="text-gray-700">{data.telephone}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-8 space-y-8">
        {/* Objectif */}
        {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transform -rotate-6"
                style={{ backgroundColor: primaryColor }}
              >
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black" style={{ color: primaryColor }}>
                À PROPOS
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg pl-15">
              {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
            </p>
          </section>
        )}

        {/* Formation et Expériences en 2 colonnes */}
        <div className="grid grid-cols-2 gap-8">
          {/* Formation */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transform rotate-6"
                style={{ backgroundColor: accentColor }}
              >
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black" style={{ color: primaryColor }}>
                FORMATION
              </h2>
            </div>
            <div className="space-y-3 pl-15">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{data.formation}</h3>
                <p className="text-sm text-gray-600">{data.ecole}</p>
                <span 
                  className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor 
                  }}
                >
                  {data.anneeFormation}
                </span>
              </div>
            </div>
          </section>

          {/* Compétences */}
          {(data.competencesAmeliorees || data.competences) && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transform -rotate-6"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Award className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black" style={{ color: primaryColor }}>
                  SKILLS
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 pl-15">
                {(Array.isArray(data.competencesAmeliorees) 
                  ? data.competencesAmeliorees 
                  : (data.competencesAmeliorees || data.competences || "").split(/[,;]/))
                  .map((comp: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-xl text-sm font-bold"
                      style={{
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor,
                        border: `2px solid ${primaryColor}40`,
                      }}
                    >
                      {typeof comp === 'string' ? comp.trim() : comp}
                    </span>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Expériences */}
        {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transform rotate-6"
                style={{ backgroundColor: accentColor }}
              >
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black" style={{ color: primaryColor }}>
                EXPÉRIENCES
              </h2>
            </div>
            <div className="space-y-6 pl-15">
              {data.experiencesAmeliorees.map((exp, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl border-l-4"
                  style={{ 
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}05`
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-black text-gray-900">{exp.poste}</h3>
                    <span 
                      className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                      style={{ 
                        backgroundColor: primaryColor,
                        color: "white"
                      }}
                    >
                      {exp.periode}
                    </span>
                  </div>
                  <p className="text-base font-bold mb-3" style={{ color: accentColor }}>
                    {exp.entreprise}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
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

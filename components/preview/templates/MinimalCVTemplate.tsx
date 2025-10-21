"use client";

import type { GeneratedCV } from "@/types/cv";
import { Mail, Phone, MapPin } from "lucide-react";

interface MinimalCVTemplateProps {
  cvData: GeneratedCV;
  customColors?: {
    primary?: string;
    secondary?: string;
  };
}

export function MinimalCVTemplate({
  cvData,
  customColors,
}: MinimalCVTemplateProps) {
  const data = cvData;
  const primaryColor = customColors?.primary || "#475569";
  const accentColor = customColors?.secondary || "#64748B";

  return (
    <div className="w-full bg-white p-12 space-y-8">
      {/* Header minimaliste */}
      <header className="border-b-2 pb-6" style={{ borderColor: primaryColor }}>
        <h1 
          className="text-5xl font-light mb-3 tracking-tight"
          style={{ color: primaryColor }}
        >
          {data.prenom} <span className="font-bold">{data.nom.toUpperCase()}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-4">{data.formation}</p>
        
        {/* Contact en ligne */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{data.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{data.telephone}</span>
          </div>
        </div>
      </header>

      {/* Objectif */}
      {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
        <section>
          <h2 
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: primaryColor }}
          >
            Profil professionnel
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
          </p>
        </section>
      )}

      {/* Formation */}
      <section>
        <h2 
          className="text-sm font-bold uppercase tracking-wider mb-4"
          style={{ color: primaryColor }}
        >
          Formation
        </h2>
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{data.formation}</h3>
              <p className="text-sm text-gray-600">{data.ecole}</p>
            </div>
            <span className="text-sm text-gray-500">{data.anneeFormation}</span>
          </div>
        </div>
      </section>

      {/* Expériences */}
      {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
        <section>
          <h2 
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: primaryColor }}
          >
            Expérience professionnelle
          </h2>
          <div className="space-y-6">
            {data.experiencesAmeliorees.map((exp, index) => (
              <div key={index}>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.poste}</h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {exp.periode}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: accentColor }}>
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

      {/* Compétences */}
      {(data.competencesAmeliorees || data.competences) && (
        <section>
          <h2 
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: primaryColor }}
          >
            Compétences
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
            {(Array.isArray(data.competencesAmeliorees) 
              ? data.competencesAmeliorees 
              : (data.competencesAmeliorees || data.competences || "").split(/[,;]/))
              .map((comp: string, index: number) => (
                <span key={index} className="flex items-center gap-2">
                  <span 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  {typeof comp === 'string' ? comp.trim() : comp}
                </span>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

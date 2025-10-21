"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface EnhancvMinimalTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  posteRecherche: string;
  objectif: string;
  profileImage?: string;
  experiences: { 
    poste: string; 
    entreprise: string; 
    periode: string; 
    description: string;
  }[];
  formation: string;
  ecole: string;
  anneeFormation: string;
  descriptionFormation?: string;
  competences: string[];
  certifications?: { 
    nom: string; 
    organisme: string; 
    annee?: string;
  }[];
  languages: { 
    language: string; 
    proficiency: string;
  }[];
  hobbies?: string[];
  liens?: { 
    linkedin?: string;
    portfolio?: string;
  };
  customization?: {
    primaryColor?: string;
    fontFamily?: string;
    fontSize?: number;
    photoSize?: number;
    spacing?: number;
  };
}

export const EnhancvMinimalTemplate: React.FC<EnhancvMinimalTemplateProps> = ({
  prenom,
  nom,
  email,
  telephone,
  adresse,
  posteRecherche,
  objectif,
  profileImage,
  experiences,
  formation,
  ecole,
  anneeFormation,
  descriptionFormation,
  competences,
  certifications = [],
  languages,
  hobbies = [],
  liens = {},
  customization = {},
}) => {
  const fullName = `${prenom} ${nom}`.trim().toUpperCase();
  
  // Apply customization with defaults
  const fontFamily = customization.fontFamily || "'Calibri', 'Arial', sans-serif";
  const fontSize = (customization.fontSize || 100) / 100;
  const spacing = (customization.spacing || 100) / 100;

  return (
    <div 
      className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto print:shadow-none" 
      style={{ 
        fontFamily,
        fontSize: `${fontSize}rem`
      }}
    >
      {/* HEADER - Style Finance Sobre */}
      <div 
        className="px-16 border-b-2 border-gray-800"
        style={{ 
          paddingTop: `${1.5 * spacing}rem`,
          paddingBottom: `${1.5 * spacing}rem`
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide mb-2 text-gray-900">
            {fullName}
          </h1>
          <p className="text-base text-gray-700 mb-4">
            {posteRecherche || "Candidat en Finance"}
          </p>
          
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-xs text-gray-700">
            {email && (
              <span>{email}</span>
            )}
            {telephone && (
              <span>• {telephone}</span>
            )}
            {adresse && (
              <span>• {adresse}</span>
            )}
            {liens.linkedin && (
              <span>• linkedin.com</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-16 py-8">
        {/* RÉSUMÉ */}
        {objectif && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
              Résumé
            </h2>
            <p className="text-xs text-gray-800 leading-relaxed text-justify">
              {objectif}
            </p>
          </div>
        )}

        {/* EXPÉRIENCE PROFESSIONNELLE */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
              Expérience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-gray-900">
                      {exp.poste}
                    </h3>
                    <span className="text-xs text-gray-600 whitespace-nowrap ml-4">
                      {exp.periode}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 italic mb-2">
                    {exp.entreprise}
                  </p>
                  <ul className="space-y-1">
                    {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} className="text-xs text-gray-800 leading-relaxed flex items-start gap-2">
                        <span className="text-gray-900 mt-0.5">•</span>
                        <span className="flex-1">{line.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BÉNÉVOLAT (si présent dans hobbies ou comme section séparée) */}
        {hobbies.some(h => h.toLowerCase().includes('bénévol') || h.toLowerCase().includes('gestion')) && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
              Bénévolat
            </h2>
            <div className="space-y-5">
              {hobbies.filter(h => h.toLowerCase().includes('bénévol') || h.toLowerCase().includes('gestion')).map((hobby, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-800 leading-relaxed">
                    {hobby}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ÉDUCATION */}
        {formation && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-400 pb-1">
              Éducation
            </h2>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-bold text-gray-900">
                  {ecole}
                </h3>
                <span className="text-xs text-gray-600 whitespace-nowrap ml-4">
                  {anneeFormation}
                </span>
              </div>
              <p className="text-xs text-gray-700 italic mb-2">
                {formation}
              </p>
              {descriptionFormation && (
                <ul className="space-y-1 mt-2">
                  {descriptionFormation.split('\n').filter(line => line.trim()).map((line, idx) => (
                    <li key={idx} className="text-xs text-gray-800 leading-relaxed flex items-start gap-2">
                      <span className="text-gray-900 mt-0.5">•</span>
                      <span className="flex-1">{line.trim()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* COMPÉTENCES */}
        {competences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
              Compétences
            </h2>
            <p className="text-xs text-gray-800 leading-relaxed">
              {competences.join(' • ')}
            </p>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
              Certification
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-800">
                    <span className="font-semibold">{cert.nom}</span>
                    {" — "}
                    {cert.organisme}
                    {cert.annee && ` • ${cert.annee}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LANGUES */}
        {languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
              Langues
            </h2>
            <div className="space-y-2">
              {languages.map((lang, i) => {
                // Convertir en points (5 max)
                const levelMap: { [key: string]: number } = {
                  "Natif": 5, "Langue maternelle": 5, "Courant": 4, "Avancé": 3, "Intermédiaire": 2, "Débutant": 1
                };
                const level = levelMap[lang.proficiency] || 3;
                
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-800 font-semibold">
                      {lang.language}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <div 
                          key={idx}
                          className={`w-3 h-3 rounded-full border ${
                            idx < level 
                              ? "bg-gray-900 border-gray-900" 
                              : "bg-white border-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div 
        className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500 border-t border-gray-300"
        style={{ 
          paddingTop: `${0.5 * spacing}rem`,
          paddingBottom: `${0.5 * spacing}rem`
        }}
      >
      </div>
    </div>
  );
};

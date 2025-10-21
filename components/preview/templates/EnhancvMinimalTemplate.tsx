"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

interface EnhancvMinimalTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  posteRecherche: string;
  objectif: string;
  profileImage?: string;
  experiences: { poste: string; entreprise: string; periode: string; description: string }[];
  formation: string;
  ecole: string;
  anneeFormation: string;
  competences: string[];
  languages: { language: string; proficiency: string }[];
  hobbies: string[];
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
  competences,
  languages,
  hobbies,
}) => {
  const fullName = `${prenom} ${nom}`.trim();

  return (
    <div className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto p-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER - Ultra minimaliste */}
      <div className="mb-12 pb-8 border-b border-gray-900">
        <h1 className="text-6xl font-light text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
          {fullName}
        </h1>
        <p className="text-xl text-gray-600 font-light mb-6">{posteRecherche || "Professionnel"}</p>
        
        <div className="flex gap-8 text-sm text-gray-600">
          {email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
          )}
          {telephone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{telephone}</span>
            </div>
          )}
          {adresse && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{adresse}</span>
            </div>
          )}
        </div>
      </div>

      {/* À PROPOS */}
      {objectif && (
        <div className="mb-10">
          <p className="text-sm text-gray-700 leading-relaxed font-light">
            {objectif}
          </p>
        </div>
      )}

      {/* LAYOUT 2 COLONNES */}
      <div className="grid grid-cols-3 gap-12">
        {/* COLONNE GAUCHE - 1/3 */}
        <div className="col-span-1 space-y-10">
          {/* Compétences */}
          {competences.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-semibold mb-4 pb-2 border-b border-gray-300">
                Compétences
              </h2>
              <div className="space-y-2">
                {competences.map((skill, i) => (
                  <div key={i} className="text-sm text-gray-700 font-light">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-semibold mb-4 pb-2 border-b border-gray-300">
                Langues
              </h2>
              <div className="space-y-3">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-900 font-medium">{lang.language}</span>
                      <span className="text-gray-500 text-xs">{lang.proficiency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loisirs */}
          {hobbies.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-semibold mb-4 pb-2 border-b border-gray-300">
                Centres d'intérêt
              </h2>
              <div className="space-y-2">
                {hobbies.map((hobby, i) => (
                  <div key={i} className="text-sm text-gray-700 font-light">
                    {hobby}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE - 2/3 */}
        <div className="col-span-2 space-y-10">
          {/* Expériences */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-semibold mb-6 pb-2 border-b border-gray-300">
                Expérience Professionnelle
              </h2>
              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{exp.poste}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{exp.periode}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{exp.entreprise}</p>
                    <p className="text-sm text-gray-700 leading-relaxed font-light">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {formation && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-900 font-semibold mb-6 pb-2 border-b border-gray-300">
                Formation
              </h2>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{formation}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{anneeFormation}</span>
                </div>
                <p className="text-sm text-gray-600">{ecole}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


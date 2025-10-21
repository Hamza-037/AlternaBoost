"use client";

import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Heart } from "lucide-react";

interface EnhancvModernTemplateProps {
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

export const EnhancvModernTemplate: React.FC<EnhancvModernTemplateProps> = ({
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
    <div className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto p-0 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER - Bande colorée avec nom */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-12 py-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-2 tracking-tight">{fullName}</h1>
          <p className="text-2xl text-blue-100 font-light mb-6">{posteRecherche || "Professionnel"}</p>
          
          <div className="flex gap-6 text-sm text-blue-50">
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
      </div>

      {/* CONTENT - 2 colonnes */}
      <div className="flex">
        {/* COLONNE GAUCHE - 40% */}
        <div className="w-[40%] bg-gray-50 px-8 py-10 space-y-8">
          {/* Photo */}
          {profileImage && (
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Compétences */}
          {competences.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                COMPÉTENCES
              </h2>
              <div className="space-y-2">
                {competences.map((skill, i) => (
                  <div key={i} className="bg-white px-4 py-2 rounded-lg shadow-sm border-l-4 border-blue-600">
                    <span className="text-sm font-medium text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                LANGUES
              </h2>
              <div className="space-y-3">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{lang.language}</span>
                      <span className="text-xs text-gray-500">{lang.proficiency}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ 
                          width: lang.proficiency === "Avancé" ? "100%" : 
                                 lang.proficiency === "Intermédiaire" ? "66%" : "33%" 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loisirs */}
          {hobbies.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                LOISIRS
              </h2>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE - 60% */}
        <div className="w-[60%] px-10 py-10 space-y-8">
          {/* À propos */}
          {objectif && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
                À PROPOS
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{objectif}</p>
            </div>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                EXPÉRIENCES PROFESSIONNELLES
              </h2>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                    <h3 className="text-base font-bold text-gray-800">{exp.poste}</h3>
                    <p className="text-sm font-medium text-blue-600 mb-1">{exp.entreprise}</p>
                    <p className="text-xs text-gray-500 mb-2">{exp.periode}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {formation && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                FORMATION
              </h2>
              <div className="relative pl-6 border-l-2 border-gray-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                <h3 className="text-base font-bold text-gray-800">{formation}</h3>
                <p className="text-sm font-medium text-blue-600 mb-1">{ecole}</p>
                <p className="text-xs text-gray-500">{anneeFormation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


"use client";

import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Heart, Star } from "lucide-react";

interface EnhancvPremiumTemplateProps {
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

export const EnhancvPremiumTemplate: React.FC<EnhancvPremiumTemplateProps> = ({
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
    <div className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto relative overflow-hidden" style={{ fontFamily: "'Playfair Display', serif" }}>
      {/* Fond décoratif */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-30 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 -ml-40 -mb-40"></div>

      <div className="relative z-10 p-12">
        {/* HEADER */}
        <div className="flex items-start gap-8 mb-10 pb-8 border-b-2 border-gray-200">
          {/* Photo */}
          {profileImage && (
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl flex-shrink-0">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          
          {/* Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {fullName}
            </h1>
            <p className="text-xl text-amber-600 font-light mb-4">{posteRecherche || "Professionnel"}</p>
            
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              {email && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>{email}</span>
                </div>
              )}
              {telephone && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>{telephone}</span>
                </div>
              )}
              {adresse && (
                <div className="flex items-center gap-2 col-span-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>{adresse}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* À PROPOS */}
        {objectif && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Profil Professionnel
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed italic bg-amber-50 p-6 rounded-xl border-l-4 border-amber-400">
              "{objectif}"
            </p>
          </div>
        )}

        {/* LAYOUT 2 COLONNES */}
        <div className="grid grid-cols-3 gap-8">
          {/* COLONNE GAUCHE - 1/3 */}
          <div className="col-span-1 space-y-8">
            {/* Compétences */}
            {competences.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Award className="w-5 h-5 text-amber-600" />
                  Expertises
                </h2>
                <div className="space-y-2">
                  {competences.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Globe className="w-5 h-5 text-amber-600" />
                  Langues
                </h2>
                <div className="space-y-3">
                  {languages.map((lang, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-800">{lang.language}</span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, idx) => (
                          <div 
                            key={idx}
                            className={`h-1.5 flex-1 rounded-full ${
                              idx < (lang.proficiency === "Avancé" ? 3 : lang.proficiency === "Intermédiaire" ? 2 : 1)
                                ? "bg-amber-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loisirs */}
            {hobbies.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Heart className="w-5 h-5 text-amber-600" />
                  Passions
                </h2>
                <div className="space-y-2">
                  {hobbies.map((hobby, i) => (
                    <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      {hobby}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLONNE DROITE - 2/3 */}
          <div className="col-span-2 space-y-8">
            {/* Expériences */}
            {experiences.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Briefcase className="w-6 h-6 text-amber-600" />
                  Parcours Professionnel
                </h2>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <div key={i} className="bg-gradient-to-r from-amber-50 to-transparent p-6 rounded-xl border-l-4 border-amber-500">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{exp.poste}</h3>
                        <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">{exp.periode}</span>
                      </div>
                      <p className="text-sm font-semibold text-amber-700 mb-3">{exp.entreprise}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formation */}
            {formation && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <GraduationCap className="w-6 h-6 text-amber-600" />
                  Formation Académique
                </h2>
                <div className="bg-gradient-to-r from-purple-50 to-transparent p-6 rounded-xl border-l-4 border-purple-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{formation}</h3>
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">{anneeFormation}</span>
                  </div>
                  <p className="text-sm font-semibold text-purple-700">{ecole}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


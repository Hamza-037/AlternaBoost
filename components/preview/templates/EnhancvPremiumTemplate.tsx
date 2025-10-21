"use client";

import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Heart, CheckCircle2, TrendingUp } from "lucide-react";

interface EnhancvPremiumTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  posteRecherche: string;
  objectif: string;
  profileImage?: string;
  experiences: { poste: string; entreprise: string; periode: string; description: string; achievements?: string[] }[];
  formation: string;
  ecole?: string;
  anneeFormation?: string;
  competences: ({ nom: string; niveau?: number } | string)[];
  certifications?: { nom: string; organisme: string; annee: string }[];
  languages: { language: string; proficiency: string }[];
  hobbies?: string[];
  liens?: { linkedin?: string; portfolio?: string; github?: string };
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
  ecole = '',
  anneeFormation = '',
  competences,
  certifications = [],
  languages,
  hobbies = [],
  liens = {},
}) => {
  const fullName = `${prenom} ${nom}`.trim();

  return (
    <div className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto relative overflow-hidden print:shadow-none" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Fond décoratif élégant et subtil */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full blur-3xl opacity-40 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-50 via-orange-50 to-rose-50 rounded-full blur-3xl opacity-30 -ml-40 -mb-40"></div>

      <div className="relative z-10 p-10">
        {/* HEADER MODERNE ET ÉPURÉ */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            {/* Photo professionnelle avec indicateur en ligne */}
            {profileImage && (
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-indigo-100">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
            )}
            
            {/* Informations principales */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                {fullName}
              </h1>
              <p className="text-lg text-indigo-600 font-medium mb-4">{posteRecherche || "Professionnel"}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {email && (
                  <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </div>
                )}
                {telephone && (
                  <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{telephone}</span>
                  </div>
                )}
                {adresse && (
                  <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                    <MapPin className="w-4 h-4" />
                    <span>{adresse}</span>
                  </div>
                )}
              </div>
              
              {/* Liens professionnels avec badges modernes */}
              {(liens.linkedin || liens.portfolio || liens.github) && (
                <div className="flex gap-3 mt-3">
                  {liens.linkedin && (
                    <a href={liens.linkedin} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium">
                      LinkedIn
                    </a>
                  )}
                  {liens.portfolio && (
                    <a href={liens.portfolio} className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors font-medium">
                      Portfolio
                    </a>
                  )}
                  {liens.github && (
                    <a href={liens.github} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium">
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Barre de séparation dégradée */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* PROFIL PROFESSIONNEL */}
        {objectif && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              À Propos
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-gray-200">
              {objectif}
            </p>
          </div>
        )}

        {/* LAYOUT 2 COLONNES OPTIMISÉ */}
        <div className="grid grid-cols-3 gap-6">
          {/* COLONNE GAUCHE - Compétences & Informations complémentaires */}
          <div className="col-span-1 space-y-6">
            {/* Compétences avec barres de progression */}
            {competences.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Compétences
                </h2>
                <div className="space-y-3">
                  {competences.map((skill, i) => {
                    const skillName = typeof skill === 'string' ? skill : skill.nom;
                    const skillLevel = typeof skill === 'object' && skill.niveau ? skill.niveau : 85;
                    
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-700">{skillName}</span>
                          <span className="text-xs text-gray-500">{skillLevel}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${skillLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Certifications
                </h2>
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <div key={i} className="bg-gradient-to-r from-indigo-50 to-transparent p-3 rounded-lg border-l-2 border-indigo-400">
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{cert.nom}</p>
                      <p className="text-xs text-gray-600 mt-1">{cert.organisme}</p>
                      <p className="text-xs text-indigo-600 mt-1 font-medium">{cert.annee}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues avec indicateurs visuels */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  Langues
                </h2>
                <div className="space-y-3">
                  {languages.map((lang, i) => {
                    const levelMap: { [key: string]: number } = {
                      "Natif": 5,
                      "Courant": 4,
                      "Avancé": 3,
                      "Intermédiaire": 2,
                      "Débutant": 1
                    };
                    const level = levelMap[lang.proficiency] || 3;
                    
                    return (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-800">{lang.language}</span>
                          <span className="text-xs text-gray-500">{lang.proficiency}</span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <div 
                              key={idx}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                idx < level ? "bg-indigo-500" : "bg-gray-200"
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

            {/* Centres d'intérêt */}
            {hobbies.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-indigo-600" />
                  Centres d'Intérêt
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full border border-gray-200">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLONNE DROITE - Expérience & Formation */}
          <div className="col-span-2 space-y-7">
            {/* Expériences professionnelles */}
            {experiences.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  Expérience Professionnelle
                </h2>
                <div className="space-y-5 relative">
                  {/* Timeline verticale */}
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200"></div>
                  
                  {experiences.map((exp, i) => (
                    <div key={i} className="relative pl-6">
                      {/* Point sur la timeline */}
                      <div className="absolute left-0 top-2 w-2 h-2 bg-indigo-600 rounded-full -translate-x-[3px] ring-4 ring-white"></div>
                      
                      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <h3 className="text-base font-bold text-gray-900">{exp.poste}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                            {exp.periode}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-indigo-600 mb-3">{exp.entreprise}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{exp.description}</p>
                        
                        {/* Réalisations clés */}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="space-y-1.5 mt-3 pt-3 border-t border-gray-100">
                            {exp.achievements.map((achievement, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-gray-700 leading-relaxed">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formation académique */}
            {formation && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  Formation
                </h2>
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-transparent p-5 rounded-xl border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <h3 className="text-base font-bold text-gray-900">{formation}</h3>
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full whitespace-nowrap">
                      {anneeFormation}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-indigo-700">{ecole}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
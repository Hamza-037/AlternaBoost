"use client";

import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, CheckCircle2, TrendingUp, Linkedin, Github, ExternalLink } from "lucide-react";

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
  ecole: string;
  anneeFormation: string;
  descriptionFormation?: string;
  competences: ({ nom: string; niveau?: number } | string)[];
  certifications?: { nom: string; organisme: string; annee: string }[];
  languages: { language: string; proficiency: string }[];
  hobbies: string[];
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
  ecole,
  anneeFormation,
  descriptionFormation,
  competences,
  certifications = [],
  languages,
  hobbies,
  liens = {},
}) => {
  const fullName = `${prenom} ${nom}`.trim();

  return (
    <div className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto relative overflow-hidden print:shadow-none" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Fond décoratif subtil */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>

      <div className="relative z-10 p-8">
        {/* HEADER COMPACT */}
        <div className="mb-6">
          <div className="flex items-start gap-5 mb-4">
            {profileImage && (
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg ring-2 ring-indigo-100">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-0.5 tracking-tight leading-tight">{fullName}</h1>
              <p className="text-base text-indigo-600 font-medium mb-3">{posteRecherche || "Professionnel"}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                {email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    <span>{email}</span>
                  </div>
                )}
                {telephone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    <span>{telephone}</span>
                  </div>
                )}
                {adresse && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    <span>{adresse}</span>
                  </div>
                )}
              </div>
              
              {(liens.linkedin || liens.portfolio || liens.github) && (
                <div className="flex gap-2 mt-2">
                  {liens.linkedin && (
                    <a href={liens.linkedin} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium">
                      LinkedIn
                    </a>
                  )}
                  {liens.portfolio && (
                    <a href={liens.portfolio} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors font-medium">
                      Portfolio
                    </a>
                  )}
                  {liens.github && (
                    <a href={liens.github} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium">
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* PROFIL - Version ultra compacte */}
        {objectif && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-indigo-600 rounded-full"></div>
              À Propos
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed pl-2">
              {objectif}
            </p>
          </div>
        )}

        {/* LAYOUT 2 COLONNES OPTIMISÉ */}
        <div className="grid grid-cols-10 gap-5">
          {/* COLONNE GAUCHE - 3/10 */}
          <div className="col-span-3 space-y-4">
            {/* Compétences compactes */}
            {competences.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  Compétences
                </h2>
                <div className="space-y-1.5">
                  {competences.slice(0, 10).map((skill, i) => {
                    const skillName = typeof skill === 'string' ? skill : skill.nom;
                    const skillLevel = typeof skill === 'object' && skill.niveau ? skill.niveau : 85;
                    
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-medium text-gray-700">{skillName}</span>
                          <span className="text-xs text-gray-500">{skillLevel}%</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${skillLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Certifications compactes */}
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  Certifications
                </h2>
                <div className="space-y-1.5">
                  {certifications.slice(0, 3).map((cert, i) => (
                    <div key={i} className="bg-gradient-to-r from-indigo-50 to-transparent p-2 rounded border-l-2 border-indigo-400">
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{cert.nom}</p>
                      <p className="text-xs text-gray-600 leading-tight">{cert.organisme} • {cert.annee}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues compactes */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  Langues
                </h2>
                <div className="space-y-2">
                  {languages.map((lang, i) => {
                    const levelMap: { [key: string]: number } = {
                      "Natif": 5, "Courant": 4, "Avancé": 3, "Intermédiaire": 2, "Débutant": 1
                    };
                    const level = levelMap[lang.proficiency] || 3;
                    
                    return (
                      <div key={i} className="bg-gray-50 p-1.5 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-800">{lang.language}</span>
                          <span className="text-xs text-gray-500">{lang.proficiency}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <div 
                              key={idx}
                              className={`h-1 flex-1 rounded-full ${idx < level ? "bg-indigo-500" : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hobbies ultra compacts */}
            {hobbies.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  Intérêts
                </h2>
                <div className="flex flex-wrap gap-1">
                  {hobbies.slice(0, 6).map((hobby, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLONNE DROITE - 7/10 */}
          <div className="col-span-7 space-y-5">
            {/* Expériences compactes */}
            {experiences.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Expérience Professionnelle
                </h2>
                <div className="space-y-3 relative">
                  <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200"></div>
                  
                  {experiences.map((exp, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute left-0 top-1 w-1.5 h-1.5 bg-indigo-600 rounded-full -translate-x-[2px] ring-2 ring-white"></div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1 flex-wrap gap-1">
                          <h3 className="text-sm font-bold text-gray-900">{exp.poste}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {exp.periode}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-indigo-600 mb-1.5">{exp.entreprise}</p>
                        <p className="text-xs text-gray-600 leading-relaxed mb-1.5">{exp.description}</p>
                        
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="space-y-0.5 mt-2 pt-2 border-t border-gray-100">
                            {exp.achievements.slice(0, 4).map((achievement, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-2.5 h-2.5 text-green-500 flex-shrink-0 mt-0.5" />
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

            {/* Formation compacte */}
            {formation && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Formation
                </h2>
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-transparent p-3 rounded-lg border-l-3 border-indigo-500">
                  <div className="flex justify-between items-start mb-1 flex-wrap gap-1">
                    <h3 className="text-sm font-bold text-gray-900">{formation}</h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full whitespace-nowrap">
                      {anneeFormation}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-700 mb-2">{ecole}</p>
                  {descriptionFormation && (
                    <ul className="space-y-1 mt-2 pt-2 border-t border-indigo-200">
                      {descriptionFormation.split('\n').filter(line => line.trim()).map((line, idx) => (
                        <li key={idx} className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5">•</span>
                          <span className="flex-1">{line.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
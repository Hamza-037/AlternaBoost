"use client";

import React, { useMemo } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Heart,
  CheckCircle2 
} from "lucide-react";

interface EnhancvPremiumTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  posteRecherche: string;
  objectif: string;
  profileImage?: string;
  experiences: { poste: string; entreprise: string; periode: string; description: string; realisations?: string[] }[];
  formation: string | Array<{ diplome: string; ecole: string; annee: string; mention?: string; details?: string }>;
  ecole?: string;
  anneeFormation?: string;
  competences: string[];
  languages: { language: string; proficiency: string }[];
  hobbies?: string[];
  liens?: { linkedin?: string; github?: string; portfolio?: string };
  customization?: {
    primaryColor?: string;
    fontFamily?: string;
    fontSize?: number;
    photoSize?: number;
    spacing?: number;
  };
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
  hobbies = [],
  liens = {},
  customization = {},
}) => {
  const fullName = `${prenom} ${nom}`.trim();
  
  // Apply customization with defaults
  const primaryColor = customization.primaryColor || "#6366F1";
  const fontFamily = customization.fontFamily || "'Inter', sans-serif";
  const fontSize = (customization.fontSize || 100) / 100;
  const photoSize = (customization.photoSize || 100) / 100;
  const spacing = (customization.spacing || 100) / 100;

  // Convert formation to array if needed
  const formationArray = useMemo(() => {
    if (!formation) return [];
    if (Array.isArray(formation)) return formation;
    
    // Legacy format: single string
    return [{
      diplome: formation,
      ecole: ecole || '',
      annee: anneeFormation || '',
    }];
  }, [formation, ecole, anneeFormation]);

  const getProficiencyPercentage = (proficiency: string) => {
    const levels: Record<string, number> = {
      "Débutant": 25,
      "Intermédiaire": 50,
      "Avancé": 75,
      "Courant": 90,
      "Natif": 100,
      "Bilingue": 100,
    };
    return levels[proficiency] || 50;
  };

  return (
    <div 
      className="w-[21cm] min-h-[29.7cm] bg-white shadow-2xl mx-auto relative overflow-hidden"
      style={{ 
        fontFamily,
        fontSize: `${fontSize}rem`
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }}></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-5" style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }}></div>

      {/* HEADER */}
      <div className="relative" style={{ paddingTop: `${3 * spacing}rem`, paddingBottom: `${2 * spacing}rem`, paddingLeft: '3rem', paddingRight: '3rem' }}>
        <div className="flex items-start justify-between gap-8">
          {/* Photo + Status */}
          <div className="relative flex-shrink-0">
            {profileImage && (
              <div className="relative">
                <div 
                  className="rounded-full overflow-hidden shadow-lg ring-4 ring-white"
                  style={{ 
                    width: `${8.75 * photoSize}rem`,
                    height: `${8.75 * photoSize}rem`,
                    border: `4px solid ${primaryColor}`
                  }}
                >
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                {/* Online Indicator */}
                <div 
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: '#10B981' }}
                ></div>
              </div>
            )}
          </div>

          {/* Name + Contact */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-2 tracking-tight" style={{ color: primaryColor }}>{fullName}</h1>
            <p className="text-2xl text-gray-600 font-light mb-6">{posteRecherche || "Professionnel"}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{email}</span>
                </div>
              )}
              {telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{telephone}</span>
                </div>
              )}
              {adresse && (
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{adresse}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(liens.linkedin || liens.github || liens.portfolio) && (
              <div className="flex flex-wrap gap-3 mt-4">
                {liens.linkedin && (
                  <a 
                    href={liens.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md"
                    style={{ 
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor
                    }}
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {liens.github && (
                  <a 
                    href={liens.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {liens.portfolio && (
                  <a 
                    href={liens.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md"
                    style={{ 
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}33, transparent)` }}></div>

      {/* MAIN CONTENT */}
      <div className="px-12" style={{ paddingTop: `${2.5 * spacing}rem`, paddingBottom: `${2.5 * spacing}rem` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${2 * spacing}rem` }}>
        {/* À propos */}
        {objectif && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                <Award className="w-5 h-5" />
              </div>
              PROFIL PROFESSIONNEL
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed pl-10">{objectif}</p>
          </div>
        )}

        {/* Expériences */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                <Briefcase className="w-5 h-5" />
              </div>
              EXPÉRIENCES PROFESSIONNELLES
            </h2>
            
            <div className="relative pl-10">
              {/* Timeline Line */}
              <div 
                className="absolute left-4 top-0 bottom-0 w-0.5"
                style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${primaryColor}33)` }}
              ></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: `${1.75 * spacing}rem` }}>
                {experiences.map((exp, i) => (
                  <div key={i} className="relative">
                    {/* Timeline Dot */}
                    <div 
                      className="absolute -left-[1.7rem] top-1 w-4 h-4 rounded-full border-4 border-white shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    ></div>

                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{exp.poste}</h3>
                          <p className="text-sm font-medium mt-1" style={{ color: primaryColor }}>{exp.entreprise}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                          {exp.periode}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">{exp.description}</p>
                      
                      {exp.realisations && exp.realisations.length > 0 && (
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" style={{ color: primaryColor }} />
                            Réalisations clés
                          </p>
                          <ul className="space-y-1">
                            {exp.realisations.map((real, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                <span className="inline-block w-1 h-1 rounded-full mt-1.5" style={{ backgroundColor: primaryColor }}></span>
                                <span>{real}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Formation */}
        {formationArray.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                <GraduationCap className="w-5 h-5" />
              </div>
              FORMATION
            </h2>

            <div className="pl-10">
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${1.25 * spacing}rem` }}>
                {formationArray.map((form, index) => (
                  <div key={index} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-gray-900">{form.diplome}</h3>
                      <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                        {form.annee}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: primaryColor }}>{form.ecole}</p>
                    {form.mention && (
                      <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                        <Award className="w-3 h-3" style={{ color: primaryColor }} />
                        {form.mention}
                      </p>
                    )}
                    {form.details && (
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{form.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compétences & Langues - 2 columns */}
        <div className="grid grid-cols-2 gap-8">
          {/* Compétences */}
          {competences.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Award className="w-5 h-5" />
                </div>
                COMPÉTENCES
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.75 * spacing}rem` }} className="pl-10">
                {competences.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill}</span>
                        <span className="text-xs text-gray-500">Expert</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}99)`,
                            width: "85%"
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Languages className="w-5 h-5" />
                </div>
                LANGUES
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.75 * spacing}rem` }} className="pl-10">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{lang.language}</span>
                      <span className="text-xs text-gray-500">{lang.proficiency}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <div 
                          key={idx}
                          className="h-1.5 flex-1 rounded-full"
                          style={{ 
                            backgroundColor: idx < getProficiencyPercentage(lang.proficiency) / 20 ? primaryColor : '#E5E7EB'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loisirs */}
        {hobbies.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                <Heart className="w-5 h-5" />
              </div>
              CENTRES D'INTÉRÊT
            </h2>
            <div className="flex flex-wrap gap-2 pl-10">
              {hobbies.map((hobby, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 text-sm font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor
                  }}
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

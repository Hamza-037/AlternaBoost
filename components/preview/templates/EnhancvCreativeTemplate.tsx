"use client";

import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Heart, Target } from "lucide-react";

interface EnhancvCreativeTemplateProps {
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
  descriptionFormation?: string;
  competences: string[];
  languages: { language: string; proficiency: string }[];
  hobbies: string[];
  customization?: {
    primaryColor?: string;
    fontFamily?: string;
    fontSize?: number;
    photoSize?: number;
    spacing?: number;
  };
}

export const EnhancvCreativeTemplate: React.FC<EnhancvCreativeTemplateProps> = ({
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
  languages,
  hobbies,
  customization = {},
}) => {
  const fullName = `${prenom} ${nom}`.trim();
  
  // Apply customization with defaults
  const primaryColor = customization.primaryColor || "#3B82F6";
  const fontFamily = customization.fontFamily || "'Inter', sans-serif";
  const fontSize = (customization.fontSize || 100) / 100;
  const photoSize = (customization.photoSize || 100) / 100;
  const spacing = (customization.spacing || 100) / 100;

  return (
    <div 
      className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto relative overflow-hidden" 
      style={{ 
        fontFamily,
        fontSize: `${fontSize}rem`
      }}
    >
      {/* Decorative background elements */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }}
      ></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* HEADER - Compact */}
        <div 
          className="px-10 text-white relative"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}ee, ${primaryColor}bb)`,
            paddingTop: `${1.25 * spacing}rem`,
            paddingBottom: `${1.25 * spacing}rem`
          }}
        >
          <div className="flex items-center gap-6">
            {/* Photo - Réduite */}
            {profileImage && (
              <div 
                className="relative flex-shrink-0"
                style={{ 
                  width: `${5.5 * photoSize}rem`,
                  height: `${5.5 * photoSize}rem`
                }}
              >
                <div 
                  className="absolute inset-0 rounded-xl rotate-3"
                  style={{ background: `linear-gradient(to bottom right, ${primaryColor}44, transparent)` }}
                ></div>
                <div className="absolute inset-1.5 rounded-xl overflow-hidden border-3 border-white/30 shadow-lg">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Info - Compacte */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1 tracking-tight">{fullName}</h1>
              <p className="text-base text-white/90 font-medium mb-3">{posteRecherche || "Professionnel"}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80">
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
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - 2 colonnes */}
        <div className="flex-1 flex overflow-hidden">
          {/* COLONNE GAUCHE - Sidebar */}
          <div 
            className="w-[35%] px-8 bg-gray-50"
            style={{ 
              paddingTop: `${2 * spacing}rem`,
              paddingBottom: `${2 * spacing}rem`
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${1.5 * spacing}rem` }}>
              {/* À propos */}
              {objectif && (
                <div>
                  <h2 
                    className="text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
                    style={{ color: primaryColor }}
                  >
                    <Target className="w-4 h-4" />
                    À Propos
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{objectif}</p>
                </div>
              )}

              {/* Compétences */}
              {competences.length > 0 && (
                <div>
                  <h2 
                    className="text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
                    style={{ color: primaryColor }}
                  >
                    <Award className="w-4 h-4" />
                    Compétences
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {competences.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full border"
                        style={{ 
                          backgroundColor: `${primaryColor}15`,
                          borderColor: `${primaryColor}40`,
                          color: primaryColor
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Langues */}
              {languages.length > 0 && (
                <div>
                  <h2 
                    className="text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
                    style={{ color: primaryColor }}
                  >
                    <Globe className="w-4 h-4" />
                    Langues
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.75 * spacing}rem` }}>
                    {languages.map((lang, i) => {
                      const levelMap: { [key: string]: number } = {
                        "Natif": 100, "Courant": 90, "Avancé": 75, "Intermédiaire": 50, "Débutant": 25
                      };
                      const level = levelMap[lang.proficiency] || 50;
                      
                      return (
                        <div key={i}>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-gray-800">{lang.language}</span>
                            <span className="text-xs text-gray-500">{lang.proficiency}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}aa)`,
                                width: `${level}%` 
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Loisirs */}
              {hobbies.length > 0 && (
                <div>
                  <h2 
                    className="text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
                    style={{ color: primaryColor }}
                  >
                    <Heart className="w-4 h-4" />
                    Loisirs
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((hobby, i) => (
                      <span 
                        key={i}
                        className="text-xs text-gray-700 flex items-center gap-1"
                      >
                        <span style={{ color: primaryColor }}>•</span>
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLONNE DROITE - Contenu principal */}
          <div 
            className="flex-1 px-10 overflow-y-auto"
            style={{ 
              paddingTop: `${2 * spacing}rem`,
              paddingBottom: `${2 * spacing}rem`
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${2 * spacing}rem` }}>
              {/* Expériences */}
              {experiences.length > 0 && (
                <div>
                  <h2 
                    className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2 pb-2"
                    style={{ 
                      color: primaryColor,
                      borderBottom: `2px solid ${primaryColor}33`
                    }}
                  >
                    <Briefcase className="w-5 h-5" />
                    Expériences Professionnelles
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${1.5 * spacing}rem` }}>
                    {experiences.map((exp, i) => (
                      <div key={i} className="relative pl-6">
                        <div 
                          className="absolute left-0 top-2 w-3 h-3 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        <div 
                          className="absolute left-1.5 top-5 bottom-0 w-0.5"
                          style={{ backgroundColor: i === experiences.length - 1 ? 'transparent' : `${primaryColor}22` }}
                        ></div>

                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{exp.poste}</h3>
                          <p className="text-sm font-medium mt-1" style={{ color: primaryColor }}>
                            {exp.entreprise}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 mb-2">{exp.periode}</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formation */}
              {formation && (
                <div>
                  <h2 
                    className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2 pb-2"
                    style={{ 
                      color: primaryColor,
                      borderBottom: `2px solid ${primaryColor}33`
                    }}
                  >
                    <GraduationCap className="w-5 h-5" />
                    Formation
                  </h2>
                  <div className="pl-6 relative">
                    <div 
                      className="absolute left-0 top-2 w-3 h-3 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    ></div>

                    <h3 className="font-bold text-gray-900 text-base">{formation}</h3>
                    <p className="text-sm font-medium mt-1" style={{ color: primaryColor }}>
                      {ecole}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-2">{anneeFormation}</p>
                    {descriptionFormation && (
                      <p className="text-sm text-gray-700 leading-relaxed mt-2">
                        {descriptionFormation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

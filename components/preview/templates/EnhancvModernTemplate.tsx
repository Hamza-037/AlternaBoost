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
  customization?: {
    primaryColor?: string;
    fontFamily?: string;
    fontSize?: number;
    photoSize?: number;
    spacing?: number;
  };
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
      className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto p-0 overflow-hidden" 
      style={{ 
        fontFamily,
        fontSize: `${fontSize}rem`
      }}
    >
      {/* HEADER - Bande colorée avec nom */}
      <div 
        className="bg-gradient-to-r px-12 text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd, ${primaryColor}bb)`,
          paddingTop: `${2.5 * spacing}rem`,
          paddingBottom: `${2.5 * spacing}rem`
        }}
      >
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
        <div 
          className="w-[40%] bg-gray-50 px-8"
          style={{ 
            paddingTop: `${2.5 * spacing}rem`,
            paddingBottom: `${2.5 * spacing}rem`
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${2 * spacing}rem` }}>
          {/* Photo */}
          {profileImage && (
            <div 
              className="mx-auto rounded-full overflow-hidden shadow-lg"
              style={{ 
                width: `${10 * photoSize}rem`,
                height: `${10 * photoSize}rem`,
                borderWidth: '4px',
                borderColor: primaryColor,
                borderStyle: 'solid'
              }}
            >
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Compétences */}
          {competences.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: primaryColor }} />
                COMPÉTENCES
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.5 * spacing}rem` }}>
                {competences.map((skill, i) => (
                  <div 
                    key={i} 
                    className="bg-white px-4 py-2 rounded-lg shadow-sm"
                    style={{ borderLeft: `4px solid ${primaryColor}` }}
                  >
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
                <Globe className="w-5 h-5" style={{ color: primaryColor }} />
                LANGUES
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${0.75 * spacing}rem` }}>
                {languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{lang.language}</span>
                      <span className="text-xs text-gray-500">{lang.proficiency}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}aa)`,
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
                <Heart className="w-5 h-5" style={{ color: primaryColor }} />
                LOISIRS
              </h2>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{ 
                      backgroundColor: `${primaryColor}22`,
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

        {/* COLONNE DROITE - 60% */}
        <div 
          className="w-[60%] px-10"
          style={{ 
            paddingTop: `${2.5 * spacing}rem`,
            paddingBottom: `${2.5 * spacing}rem`
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${2 * spacing}rem` }}>
          {/* À propos */}
          {objectif && (
            <div>
              <h2 
                className="text-xl font-bold text-gray-800 mb-4 pb-2"
                style={{ borderBottom: `2px solid ${primaryColor}` }}
              >
                À PROPOS
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{objectif}</p>
            </div>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <div>
              <h2 
                className="text-xl font-bold text-gray-800 mb-6 pb-2 flex items-center gap-2"
                style={{ borderBottom: `2px solid ${primaryColor}` }}
              >
                <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
                EXPÉRIENCES PROFESSIONNELLES
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${1.5 * spacing}rem` }}>
                {experiences.map((exp, i) => (
                  <div 
                    key={i} 
                    className="relative pl-6"
                    style={{ borderLeft: `2px solid ${primaryColor}33` }}
                  >
                    <div 
                      className="absolute top-0 w-4 h-4 rounded-full border-4 border-white"
                      style={{ 
                        left: '-9px',
                        backgroundColor: primaryColor
                      }}
                    ></div>
                    <h3 className="text-base font-bold text-gray-800">{exp.poste}</h3>
                    <p className="text-sm font-medium mb-1" style={{ color: primaryColor }}>{exp.entreprise}</p>
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
              <h2 
                className="text-xl font-bold text-gray-800 mb-6 pb-2 flex items-center gap-2"
                style={{ borderBottom: `2px solid ${primaryColor}` }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
                FORMATION
              </h2>
              <div 
                className="relative pl-6"
                style={{ borderLeft: `2px solid ${primaryColor}33` }}
              >
                <div 
                  className="absolute top-0 w-4 h-4 rounded-full border-4 border-white"
                  style={{ 
                    left: '-9px',
                    backgroundColor: primaryColor
                  }}
                ></div>
                <h3 className="text-base font-bold text-gray-800">{formation}</h3>
                <p className="text-sm font-medium mb-1" style={{ color: primaryColor }}>{ecole}</p>
                <p className="text-xs text-gray-500">{anneeFormation}</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};


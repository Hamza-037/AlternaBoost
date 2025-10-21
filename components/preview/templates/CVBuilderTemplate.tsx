"use client";

import React from "react";
import Image from "next/image";
import { 
  BriefcaseBusiness, 
  GraduationCap, 
  Mail, 
  MapPinCheckInside, 
  Phone, 
  Star,
  User
} from "lucide-react";
import { DynamicSectionRenderer } from "@/components/cv/DynamicSectionRenderer";
import type { CustomSection } from "@/types/custom-sections";

type Experience = {
  poste: string;
  entreprise: string;
  periode: string;
  description: string;
};

type Language = {
  language: string;
  proficiency: "Débutant" | "Intermédiaire" | "Avancé";
};

interface CVBuilderTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  posteRecherche: string;
  objectif: string;
  profileImage?: string;
  experiences: Experience[];
  competences: string[];
  languages: Language[];
  hobbies: string[];
  formation: string;
  ecole: string;
  anneeFormation: string;
  customSections?: CustomSection[];
  customization?: {
    primaryColor: string;
    fontFamily: string;
    fontSize: number;
    photoSize: number;
    spacing: number;
  };
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
};

const getStarRating = (proficiency: string) => {
  const maxStars = 5;
  let filledStars = 0;

  switch (proficiency) {
    case 'Débutant':
      filledStars = 1;
      break;
    case 'Intermédiaire':
      filledStars = 3;
      break;
    case 'Avancé':
      filledStars = 5;
      break;
    default:
      filledStars = 0;
  }

  return { filledStars, maxStars };
};

export const CVBuilderTemplate: React.FC<CVBuilderTemplateProps> = ({
  prenom,
  nom,
  email,
  telephone,
  adresse,
  posteRecherche,
  objectif,
  profileImage,
  experiences,
  competences,
  languages,
  hobbies,
  formation,
  ecole,
  anneeFormation,
  customSections = [],
  customization = {
    primaryColor: "#06B6D4",
    fontFamily: "Inter, sans-serif",
    fontSize: 100,
    photoSize: 100,
    spacing: 100,
  },
}) => {
  const fullName = `${prenom} ${nom}`.trim().toUpperCase();
  
  // Calculer les tailles basées sur la customization
  const photoSizePx = (256 * customization.photoSize) / 100;
  const borderWidth = (8 * customization.photoSize) / 100;
  const fontScale = customization.fontSize / 100;
  const spacingScale = customization.spacing / 100;

  return (
    <div 
      className="flex w-[950px] h-[1200px] bg-white shadow-2xl"
      style={{ 
        fontFamily: customization.fontFamily,
        fontSize: `${fontScale}rem`,
      }}
    >
      {/* SIDEBAR GAUCHE - 1/3 */}
      <div className="flex flex-col w-1/3 p-8 bg-gray-50" style={{ padding: `${spacingScale * 2}rem` }}>
        {/* PHOTO RONDE AVEC BORDURE PERSONNALISÉE */}
        <div 
          className="mx-auto rounded-full overflow-hidden bg-gray-200"
          style={{ 
            width: `${photoSizePx}px`, 
            height: `${photoSizePx}px`,
            borderWidth: `${borderWidth}px`,
            borderStyle: 'solid',
            borderColor: customization.primaryColor
          }}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User className="w-32 h-32" />
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div style={{ marginTop: `${spacingScale * 2}rem` }}>
          <h2 className="uppercase font-bold text-sm mb-3 text-gray-800">Contact</h2>
          <ul className="space-y-3">
            {telephone && (
              <li className="flex items-start text-sm">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" style={{ color: customization.primaryColor }} />
                <span className="break-all text-gray-700">{telephone}</span>
              </li>
            )}
            {email && (
              <li className="flex items-start text-sm">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" style={{ color: customization.primaryColor }} />
                <span className="break-all text-gray-700">{email}</span>
              </li>
            )}
            {adresse && (
              <li className="flex items-start text-sm">
                <MapPinCheckInside className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" style={{ color: customization.primaryColor }} />
                <span className="break-all text-gray-700">{adresse}</span>
              </li>
            )}
          </ul>
        </div>

        {/* COMPÉTENCES */}
        {competences.length > 0 && (
          <div style={{ marginTop: `${spacingScale * 2}rem` }}>
            <h2 className="uppercase font-bold text-sm mb-3 text-gray-800">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {competences.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-white text-xs uppercase rounded-full font-medium"
                  style={{ backgroundColor: customization.primaryColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* LANGUES */}
        {languages.length > 0 && (
          <div style={{ marginTop: `${spacingScale * 2}rem` }}>
            <h2 className="uppercase font-bold text-sm mb-3 text-gray-800">Langues</h2>
            <div className="space-y-3">
              {languages.map((lang, index) => {
                const { filledStars, maxStars } = getStarRating(lang.proficiency);
                return (
                  <div key={index}>
                    <span className="capitalize font-semibold text-sm text-gray-800">
                      {lang.language}
                    </span>
                    <div className="flex mt-1 gap-0.5">
                      {Array.from({ length: filledStars }, (_, i) => (
                        <Star key={i} className="w-4 h-4" style={{ fill: customization.primaryColor, color: customization.primaryColor }} />
                      ))}
                      {Array.from({ length: maxStars - filledStars }, (_, i) => (
                        <Star key={i + filledStars} className="w-4 h-4 text-gray-300" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOISIRS */}
        {hobbies.length > 0 && (
          <div className="mt-8">
            <h2 className="uppercase font-bold text-sm mb-3 text-gray-800">Loisirs</h2>
            <div className="space-y-2">
              {hobbies.map((hobby, index) => (
                <div key={index} className="text-sm text-gray-700 capitalize">
                  {hobby}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONTENU PRINCIPAL DROITE - 2/3 */}
      <div className="w-2/3 p-12 bg-white">
        {/* EN-TÊTE */}
        <div className="mb-8" style={{ marginBottom: `${spacingScale * 2}rem` }}>
          <h1 className="uppercase text-xl text-gray-800 mb-2">{fullName}</h1>
          <h2 
            className="uppercase text-5xl font-bold mb-4"
            style={{ color: customization.primaryColor }}
          >
            {posteRecherche || "POSTE RECHERCHÉ"}
          </h2>
          {objectif && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {objectif}
            </p>
          )}
        </div>

        {/* EXPÉRIENCES */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-sm mb-4 text-gray-800">Expériences</h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-8" style={{ borderLeft: `2px solid ${customization.primaryColor}` }}>
                  {/* Numéro dans cercle */}
                  <div 
                    className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: customization.primaryColor }}
                  >
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BriefcaseBusiness className="w-4 h-4 text-gray-600" />
                      <h3 className="uppercase font-bold text-sm text-gray-800">
                        {exp.poste}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="px-3 py-1 text-white text-xs rounded-full"
                        style={{ backgroundColor: customization.primaryColor }}
                      >
                        {exp.entreprise}
                      </span>
                      <span className="text-xs italic text-gray-500">
                        {exp.periode}
                      </span>
                    </div>
                    
                    {exp.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORMATIONS */}
        {formation && (
          <div className="mb-8">
            <h2 className="uppercase font-bold text-sm mb-4 text-gray-800">Formations</h2>
            <div className="relative pl-8" style={{ borderLeft: `2px solid ${customization.primaryColor}` }}>
              {/* Numéro dans cercle */}
              <div 
                className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: customization.primaryColor }}
              >
                1
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-gray-600" />
                  <h3 className="uppercase font-bold text-sm text-gray-800">
                    {formation}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="px-3 py-1 text-white text-xs rounded-full"
                    style={{ backgroundColor: customization.primaryColor }}
                  >
                    {ecole}
                  </span>
                  {anneeFormation && (
                    <span className="text-xs italic text-gray-500">
                      {anneeFormation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTIONS PERSONNALISÉES */}
        {customSections && customSections.length > 0 && (
          <DynamicSectionRenderer 
            sections={customSections} 
            primaryColor={customization.primaryColor}
          />
        )}
      </div>
    </div>
  );
};


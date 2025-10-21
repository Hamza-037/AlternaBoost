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

  return (
    <>
      {Array.from({ length: filledStars }, (_, index) => (
        <Star key={index} className="w-4 h-4 fill-cyan-500 text-cyan-500" />
      ))}
      {Array.from({ length: maxStars - filledStars }, (_, index) => (
        <Star key={index + filledStars} className="w-4 h-4 text-gray-300" />
      ))}
    </>
  );
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
}) => {
  const fullName = `${prenom} ${nom}`.trim().toUpperCase();

  return (
    <div className="flex w-[950px] h-[1200px] bg-white shadow-2xl">
      {/* SIDEBAR GAUCHE - 1/3 */}
      <div className="flex flex-col w-1/3 p-8 bg-gray-50">
        {/* PHOTO RONDE AVEC BORDURE CYAN */}
        <div className="w-64 h-64 mx-auto rounded-full border-8 border-cyan-500 overflow-hidden bg-gray-200">
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
        <div className="mt-8">
          <h2 className="uppercase font-bold text-sm mb-3 text-gray-800">Contact</h2>
          <ul className="space-y-3">
            {telephone && (
              <li className="flex items-start text-sm">
                <Phone className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="break-all text-gray-700">{telephone}</span>
              </li>
            )}
            {email && (
              <li className="flex items-start text-sm">
                <Mail className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="break-all text-gray-700">{email}</span>
              </li>
            )}
            {adresse && (
              <li className="flex items-start text-sm">
                <MapPinCheckInside className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="break-all text-gray-700">{adresse}</span>
              </li>
            )}
          </ul>
        </div>

        {/* COMPÉTENCES */}
        {competences.length > 0 && (
          <div className="mt-8">
            <h2 className="uppercase font-bold text-sm mb-3 text-gray-800">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {competences.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-cyan-500 text-white text-xs uppercase rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* LANGUES */}
        {languages.length > 0 && (
          <div className="mt-8">
            <h2 className="uppercase font-bold text-sm mb-3 text-gray-800">Langues</h2>
            <div className="space-y-3">
              {languages.map((lang, index) => (
                <div key={index}>
                  <span className="capitalize font-semibold text-sm text-gray-800">
                    {lang.language}
                  </span>
                  <div className="flex mt-1 gap-0.5">
                    {getStarRating(lang.proficiency)}
                  </div>
                </div>
              ))}
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
        <div className="mb-8">
          <h1 className="uppercase text-xl text-gray-800 mb-2">{fullName}</h1>
          <h2 className="uppercase text-5xl font-bold text-cyan-500 mb-4">
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
                <div key={index} className="relative pl-8 border-l-2 border-cyan-500">
                  {/* Numéro dans cercle */}
                  <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm">
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
                      <span className="px-3 py-1 bg-cyan-500 text-white text-xs rounded-full">
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
            <div className="relative pl-8 border-l-2 border-cyan-500">
              {/* Numéro dans cercle */}
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm">
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
                  <span className="px-3 py-1 bg-cyan-500 text-white text-xs rounded-full">
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
      </div>
    </div>
  );
};


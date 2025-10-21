"use client";

import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Heart, Zap } from "lucide-react";

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
  competences: string[];
  languages: { language: string; proficiency: string }[];
  hobbies: string[];
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
  competences,
  languages,
  hobbies,
}) => {
  const fullName = `${prenom} ${nom}`.trim();

  return (
    <div className="w-[21cm] h-[29.7cm] bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 shadow-2xl mx-auto relative overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Formes géométriques décoratives */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-32 h-32 border-4 border-yellow-400/30 rotate-45"></div>

      <div className="relative z-10 flex h-full">
        {/* SIDEBAR GAUCHE - Violet foncé */}
        <div className="w-[35%] bg-gradient-to-b from-purple-950 to-indigo-950 p-10 text-white relative">
          {/* Photo héxagonale */}
          {profileImage && (
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-3xl rotate-6"></div>
              <div className="absolute inset-2 rounded-3xl overflow-hidden border-4 border-white/20">
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {fullName}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-cyan-500 mb-4"></div>
            <p className="text-cyan-300 font-medium text-lg">{posteRecherche || "Professionnel"}</p>
          </div>

          {/* Contact */}
          <div className="mb-8 space-y-3">
            <h2 className="text-sm uppercase tracking-wider text-pink-400 font-bold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Contact
            </h2>
            {email && (
              <div className="flex items-start gap-3 text-sm">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{email}</span>
              </div>
            )}
            {telephone && (
              <div className="flex items-start gap-3 text-sm">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{telephone}</span>
              </div>
            )}
            {adresse && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{adresse}</span>
              </div>
            )}
          </div>

          {/* Compétences */}
          {competences.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm uppercase tracking-wider text-pink-400 font-bold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Compétences
              </h2>
              <div className="flex flex-wrap gap-2">
                {competences.map((skill, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-gradient-to-r from-pink-500/30 to-cyan-500/30 border border-cyan-400/50 text-cyan-100 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm uppercase tracking-wider text-pink-400 font-bold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Langues
              </h2>
              <div className="space-y-3">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{lang.language}</span>
                      <span className="text-cyan-300 text-xs">{lang.proficiency}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"
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
              <h2 className="text-sm uppercase tracking-wider text-pink-400 font-bold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Passions
              </h2>
              <div className="space-y-2">
                {hobbies.map((hobby, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"></div>
                    {hobby}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CONTENU PRINCIPAL DROITE - Blanc */}
        <div className="w-[65%] bg-white p-12 overflow-y-auto">
          {/* À propos */}
          {objectif && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-cyan-500 rounded-full"></div>
                Profil
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">
                {objectif}
              </p>
            </div>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-pink-500" />
                Expériences
              </h2>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative pl-8 pb-6 border-l-2 border-gray-200">
                    <div className="absolute -left-[5px] top-0 w-3 h-3 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full"></div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{exp.poste}</h3>
                      <span className="text-xs bg-gradient-to-r from-pink-100 to-cyan-100 text-pink-700 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                        {exp.periode}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-cyan-600 mb-2">
                      {exp.entreprise}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {formation && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-cyan-500" />
                Formation
              </h2>
              <div className="bg-gradient-to-r from-pink-50 to-cyan-50 p-6 rounded-2xl border-l-4 border-gradient-to-b from-pink-500 to-cyan-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{formation}</h3>
                  <span className="text-xs bg-white text-pink-700 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                    {anneeFormation}
                  </span>
                </div>
                <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-cyan-600">
                  {ecole}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


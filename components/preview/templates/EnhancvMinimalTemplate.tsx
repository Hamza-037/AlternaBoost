"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Award, TrendingUp, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";

interface EnhancvMinimalTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  posteRecherche: string;
  objectif: string;
  profileImage?: string;
  experiences: { 
    poste: string; 
    entreprise: string; 
    periode: string; 
    description: string;
    achievements?: string[];
    metrics?: string[];
  }[];
  // Formation peut être soit un string (format actuel) soit un tableau (format étendu)
  formation: string | { 
    diplome: string; 
    ecole: string; 
    annee: string;
    mention?: string;
    details?: string;
  }[];
  ecole?: string; // Pour compatibilité avec le format actuel
  anneeFormation?: string; // Pour compatibilité avec le format actuel
  competences: ({ 
    nom: string; 
    categorie?: string;
  } | string)[];
  certifications?: { 
    nom: string; 
    organisme: string; 
    annee: string;
    numero?: string;
  }[];
  languages: { 
    language: string; 
    proficiency: string;
  }[];
  hobbies?: string[];
  liens?: { 
    linkedin?: string; 
    portfolio?: string;
  };
  publications?: {
    titre: string;
    source: string;
    annee: string;
  }[];
}

export const EnhancvMinimalTemplate: React.FC<EnhancvMinimalTemplateProps> = ({
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
  certifications = [],
  languages,
  hobbies = [],
  liens = {},
  publications = [],
}) => {
  const fullName = `${prenom} ${nom}`.trim();

  // Grouper les compétences par catégorie
  const groupedSkills = React.useMemo(() => {
    const groups: { [key: string]: string[] } = {};
    competences.forEach(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.nom;
      const category = typeof skill === 'object' && skill.categorie ? skill.categorie : 'Compétences Techniques';
      if (!groups[category]) groups[category] = [];
      groups[category].push(skillName);
    });
    return groups;
  }, [competences]);

  // Convertir formation en tableau si c'est un string
  const formationArray = React.useMemo(() => {
    if (Array.isArray(formation)) {
      return formation;
    }
    // Si c'est un string, créer un objet formation basique
    return [{
      diplome: formation || '',
      ecole: ecole || '',
      annee: anneeFormation || ''
    }];
  }, [formation, ecole, anneeFormation]);

  return (
    <div className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto print:shadow-none" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* HEADER - Style Finance Classique */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-16 py-10">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-5xl font-light tracking-wide mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              {fullName.toUpperCase()}
            </h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-blue-400 to-transparent mb-4"></div>
            <p className="text-lg text-blue-200 font-light tracking-wide mb-6">
              {posteRecherche || "Financial Professional"}
            </p>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-300" />
                  <span className="font-light">{email}</span>
                </div>
              )}
              {telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-300" />
                  <span className="font-light">{telephone}</span>
                </div>
              )}
              {adresse && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-300" />
                  <span className="font-light">{adresse}</span>
                </div>
              )}
              {liens.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-blue-300" />
                  <a href={liens.linkedin} className="font-light hover:text-blue-200 transition-colors">
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {liens.portfolio && (
                <div className="flex items-center gap-2 col-span-2">
                  <Globe className="w-3.5 h-3.5 text-blue-300" />
                  <a href={liens.portfolio} className="font-light hover:text-blue-200 transition-colors">
                    {liens.portfolio}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {profileImage && (
            <div className="w-32 h-32 rounded-sm overflow-hidden border-2 border-blue-300/30 shadow-xl flex-shrink-0">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover grayscale" />
            </div>
          )}
        </div>
      </div>

      <div className="px-16 py-10">
        {/* PROFIL PROFESSIONNEL */}
        {objectif && (
          <div className="mb-8 pb-8 border-b border-gray-300">
            <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-4 flex items-center gap-2">
              EXECUTIVE SUMMARY
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-justify" style={{ fontFamily: "'Georgia', serif" }}>
              {objectif}
            </p>
          </div>
        )}

        {/* LAYOUT 2 COLONNES */}
        <div className="grid grid-cols-3 gap-10">
          {/* COLONNE DROITE - 2/3 (Inversée pour mettre l'expérience en premier) */}
          <div className="col-span-2 space-y-8">
            {/* EXPÉRIENCE PROFESSIONNELLE */}
            {experiences.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-5 pb-2 border-b-2 border-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  PROFESSIONAL EXPERIENCE
                </h2>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <div key={i} className="relative">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                          {exp.poste}
                        </h3>
                        <span className="text-xs text-gray-500 font-light whitespace-nowrap ml-4 tracking-wide">
                          {exp.periode}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mb-3 italic font-light">
                        {exp.entreprise}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3 text-justify" style={{ fontFamily: "'Georgia', serif" }}>
                        {exp.description}
                      </p>
                      
                      {/* Réalisations quantifiables - crucial en finance */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                          <p className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-2">Réalisations clés</p>
                          {exp.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed text-justify" style={{ fontFamily: "'Georgia', serif" }}>
                                {achievement}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Métriques clés */}
                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-2">Résultats mesurables</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.metrics.map((metric, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 px-3 py-1.5 rounded-md border border-blue-200/50 font-semibold">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                                <span>{metric}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FORMATION */}
            {formationArray.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-5 pb-2 border-b-2 border-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  EDUCATION
                </h2>
                <div className="space-y-5">
                  {formationArray.map((form, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                          {form.diplome}
                        </h3>
                        <span className="text-xs text-gray-500 font-light whitespace-nowrap ml-4 tracking-wide">
                          {form.annee}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 italic font-light mb-2">
                        {form.ecole}
                      </p>
                      {'mention' in form && form.mention && (
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-3.5 h-3.5 text-blue-600" />
                          <p className="text-xs text-blue-700 font-semibold">
                            {form.mention}
                          </p>
                        </div>
                      )}
                      {'details' in form && form.details && (
                        <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200 leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
                          {form.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PUBLICATIONS (Important en finance) */}
            {publications.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-5 pb-2 border-b-2 border-slate-900">
                  PUBLICATIONS & RESEARCH
                </h2>
                <div className="space-y-3">
                  {publications.map((pub, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-gray-700" style={{ fontFamily: "'Georgia', serif" }}>
                        <span className="font-semibold text-slate-900">"{pub.titre}"</span>
                        {" • "}
                        <span className="italic">{pub.source}</span>
                        {" • "}
                        <span className="text-gray-500">{pub.annee}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLONNE GAUCHE - 1/3 */}
          <div className="col-span-1 space-y-8">
            {/* COMPÉTENCES GROUPÉES */}
            {Object.keys(groupedSkills).length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-4 pb-2 border-b-2 border-slate-900">
                  SKILLS
                </h2>
                <div className="space-y-5">
                  {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                        {category}
                      </h3>
                      <div className="space-y-1.5">
                        {skills.map((skill, i) => (
                          <div key={i} className="text-sm text-gray-700 font-light flex items-start gap-2">
                            <span className="text-slate-900 mt-1">•</span>
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-4 pb-2 border-b-2 border-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  CERTIFICATIONS
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert, i) => (
                    <div key={i} className="border-l-2 border-blue-600 pl-3">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {cert.nom}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 font-light">
                        {cert.organisme}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-700 font-medium">{cert.annee}</span>
                        {cert.numero && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-500 font-mono">{cert.numero}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUES */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-4 pb-2 border-b-2 border-slate-900">
                  LANGUAGES
                </h2>
                <div className="space-y-3">
                  {languages.map((lang, i) => (
                    <div key={i} className="flex justify-between items-baseline">
                      <span className="text-sm text-slate-900 font-medium">
                        {lang.language}
                      </span>
                      <span className="text-xs text-gray-600 font-light italic">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CENTRES D'INTÉRÊT (Optionnel - moins important en finance) */}
            {hobbies.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-900 font-semibold mb-4 pb-2 border-b-2 border-slate-900">
                  INTERESTS
                </h2>
                <div className="space-y-1.5">
                  {hobbies.map((hobby, i) => (
                    <div key={i} className="text-sm text-gray-700 font-light">
                      {hobby}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER PROFESSIONNEL */}
      <div className="absolute bottom-6 left-16 right-16">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-3"></div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span style={{ fontFamily: "'Georgia', serif" }}>{fullName} • CV Professionnel</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Disponible
          </span>
        </div>
      </div>
    </div>
  );
};
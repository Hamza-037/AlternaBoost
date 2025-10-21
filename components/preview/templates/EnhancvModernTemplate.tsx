"use client";

import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Heart, CheckCircle2, Linkedin, Github, ExternalLink } from "lucide-react";

interface EnhancvModernTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  posteRecherche: string;
  objectif: string;
  profileImage?: string;
  experiences: { poste: string; entreprise: string; periode: string; description: string; achievements?: string[] }[];
  formation: string | Array<{ diplome: string; ecole: string; annee: string; mention?: string }>;
  ecole?: string;
  anneeFormation?: string;
  descriptionFormation?: string;
  competences: ({ nom: string; niveau?: number; categorie?: string } | string)[];
  certifications?: { nom: string; organisme: string; annee: string }[];
  languages: { language: string; proficiency: string }[];
  hobbies: string[];
  liens?: { linkedin?: string; github?: string; portfolio?: string };
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
  descriptionFormation,
  competences,
  certifications = [],
  languages,
  hobbies,
  liens = {},
  customization = {},
}) => {
  const fullName = `${prenom} ${nom}`.trim();
  
  // Apply customization with defaults
  const primaryColor = customization.primaryColor || "#06B6D4";
  const fontFamily = customization.fontFamily || "'Inter', sans-serif";
  const fontSize = (customization.fontSize || 100) / 100;
  const photoSize = (customization.photoSize || 100) / 100;
  const spacing = (customization.spacing || 100) / 100;

  // Convert formation to array if needed
  const formationArray = React.useMemo(() => {
    if (!formation) return [];
    if (Array.isArray(formation)) return formation;
    return [{
      diplome: formation,
      ecole: ecole || '',
      annee: anneeFormation || '',
      mention: descriptionFormation || undefined,
    }];
  }, [formation, ecole, anneeFormation, descriptionFormation]);

  // Group skills by category
  const groupedSkills = React.useMemo(() => {
    const groups: { [key: string]: string[] } = {};
    competences.forEach(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.nom;
      const category = typeof skill === 'object' && skill.categorie ? skill.categorie : 'Techniques';
      if (!groups[category]) groups[category] = [];
      groups[category].push(skillName);
    });
    return groups;
  }, [competences]);

  return (
    <div 
      className="w-[21cm] h-[29.7cm] bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none" 
      style={{ 
        fontFamily,
        fontSize: `${0.9 * fontSize}rem`
      }}
    >
      {/* HEADER - Bande colorée optimisée */}
      <div 
        className="px-10 text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}bb 100%)`,
          paddingTop: `${2 * spacing}rem`,
          paddingBottom: `${2 * spacing}rem`
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full -mb-24"></div>
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-1 tracking-tight">{fullName}</h1>
          <p className="text-lg text-white/90 font-medium mb-4">{posteRecherche || "Professionnel"}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-white/80">
            {email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
              </div>
            )}
            {telephone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{telephone}</span>
              </div>
            )}
            {adresse && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{adresse}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {(liens.linkedin || liens.github || liens.portfolio) && (
            <div className="flex gap-2 mt-3">
              {liens.linkedin && (
                <a href={liens.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium hover:bg-white/30 transition-colors">
                  <Linkedin className="w-3 h-3" />
                  LinkedIn
                </a>
              )}
              {liens.github && (
                <a href={liens.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium hover:bg-white/30 transition-colors">
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
              )}
              {liens.portfolio && (
                <a href={liens.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium hover:bg-white/30 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Portfolio
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT - 2 colonnes */}
      <div className="flex">
        {/* COLONNE GAUCHE - 35% */}
        <div 
          className="w-[35%] bg-gray-50 px-6"
          style={{ 
            paddingTop: `${1.75 * spacing}rem`,
            paddingBottom: `${1.75 * spacing}rem`
          }}
        >
          <div className="space-y-5">
            {/* Photo */}
            {profileImage && (
              <div 
                className="mx-auto rounded-2xl overflow-hidden shadow-xl"
                style={{ 
                  width: `${8 * photoSize}rem`,
                  height: `${8 * photoSize}rem`,
                  borderWidth: '3px',
                  borderColor: primaryColor,
                  borderStyle: 'solid'
                }}
              >
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Compétences - En badges/blocs */}
            {Object.keys(groupedSkills).length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Award className="w-4 h-4" style={{ color: primaryColor }} />
                  Compétences
                </h2>
                <div className="space-y-4">
                  {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category}>
                      {Object.keys(groupedSkills).length > 1 && (
                        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">{category}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className="px-2.5 py-1 text-xs font-medium rounded-md shadow-sm hover:shadow transition-shadow"
                            style={{ 
                              backgroundColor: `${primaryColor}15`,
                              color: primaryColor,
                              border: `1px solid ${primaryColor}30`
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Award className="w-4 h-4" style={{ color: primaryColor }} />
                  Certifications
                </h2>
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-lg shadow-sm border-l-3" style={{ borderLeftColor: primaryColor }}>
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{cert.nom}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{cert.organisme}</p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: primaryColor }}>{cert.annee}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                  Langues
                </h2>
                <div className="space-y-2.5">
                  {languages.map((lang, i) => {
                    const levelMap: { [key: string]: number } = {
                      "Natif": 100, "Courant": 85, "Avancé": 70, "Intermédiaire": 50, "Débutant": 30
                    };
                    const width = levelMap[lang.proficiency] || 50;
                    
                    return (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">{lang.language}</span>
                          <span className="text-xs text-gray-500">{lang.proficiency}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}cc)`,
                              width: `${width}%`
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
                <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Heart className="w-4 h-4" style={{ color: primaryColor }} />
                  Centres d'Intérêt
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {hobbies.map((hobby, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 text-xs font-medium rounded-full"
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

        {/* COLONNE DROITE - 65% */}
        <div 
          className="w-[65%] px-8"
          style={{ 
            paddingTop: `${1.75 * spacing}rem`,
            paddingBottom: `${1.75 * spacing}rem`
          }}
        >
          <div className="space-y-6">
            {/* À propos */}
            {objectif && (
              <div>
                <h2 
                  className="text-base font-bold text-gray-800 mb-3 pb-2 uppercase tracking-wide"
                  style={{ borderBottom: `2px solid ${primaryColor}` }}
                >
                  À Propos
                </h2>
                <p className="text-xs text-gray-700 leading-relaxed text-justify">{objectif}</p>
              </div>
            )}

            {/* Expériences */}
            {experiences.length > 0 && (
              <div>
                <h2 
                  className="text-base font-bold text-gray-800 mb-4 pb-2 flex items-center gap-2 uppercase tracking-wide"
                  style={{ borderBottom: `2px solid ${primaryColor}` }}
                >
                  <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                  Expériences Professionnelles
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <div 
                      key={i} 
                      className="relative pl-5 pb-4"
                      style={{ borderLeft: `2px solid ${primaryColor}30` }}
                    >
                      <div 
                        className="absolute top-0.5 w-3 h-3 rounded-full border-3 border-white shadow-md"
                        style={{ 
                          left: '-7px',
                          backgroundColor: primaryColor
                        }}
                      ></div>
                      
                      <div className="flex justify-between items-start mb-1.5 gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{exp.poste}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded">
                          {exp.periode}
                        </span>
                      </div>
                      <p className="text-xs font-semibold mb-2" style={{ color: primaryColor }}>{exp.entreprise}</p>
                      <p className="text-xs text-gray-700 leading-relaxed text-justify mb-2">{exp.description}</p>
                      
                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="space-y-1 mt-2 pt-2 border-t border-gray-200">
                          {exp.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                              <span className="text-xs text-gray-700 leading-relaxed">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formation */}
            {formationArray.length > 0 && (
              <div>
                <h2 
                  className="text-base font-bold text-gray-800 mb-4 pb-2 flex items-center gap-2 uppercase tracking-wide"
                  style={{ borderBottom: `2px solid ${primaryColor}` }}
                >
                  <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                  Formation
                </h2>
                <div className="space-y-3">
                  {formationArray.map((form, i) => (
                    <div 
                      key={i}
                      className="relative pl-5"
                      style={{ borderLeft: `2px solid ${primaryColor}30` }}
                    >
                      <div 
                        className="absolute top-0.5 w-3 h-3 rounded-full border-3 border-white shadow-md"
                        style={{ 
                          left: '-7px',
                          backgroundColor: primaryColor
                        }}
                      ></div>
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{form.diplome}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded">
                          {form.annee}
                        </span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: primaryColor }}>{form.ecole}</p>
                      {form.mention && (
                        <ul className="space-y-1 mt-2">
                          {form.mention.split('\n').filter((line: string) => line.trim()).map((line: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                              <span className="mt-0.5" style={{ color: primaryColor }}>•</span>
                              <span className="flex-1">{line.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
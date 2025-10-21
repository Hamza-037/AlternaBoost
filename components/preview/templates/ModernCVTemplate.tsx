"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { GeneratedCV } from "@/types/cv";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Target } from "lucide-react";

interface ModernCVTemplateProps {
  data: GeneratedCV;
  isEditing: boolean;
  onUpdate: (field: string, value: unknown) => void;
  profileImage?: string;
}

export function ModernCVTemplate({
  data,
  isEditing,
  onUpdate,
  profileImage,
}: ModernCVTemplateProps) {
  const primaryColor = "#2563EB"; // Bleu moderne
  const accentColor = "#3B82F6";

  return (
    <Card className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header avec gradient */}
      <div 
        className="relative p-8 pb-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              {isEditing ? (
                <Input
                  value={`${data.prenom} ${data.nom}`}
                  onChange={(e) => {
                    const [prenom, ...nomParts] = e.target.value.split(" ");
                    onUpdate("prenom", prenom || "");
                    onUpdate("nom", nomParts.join(" ") || "");
                  }}
                  className="text-4xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
              ) : (
                `${data.prenom} ${data.nom}`.toUpperCase()
              )}
            </h1>
            
            <div className="text-lg font-medium text-blue-100 mb-4">
              {isEditing ? (
                <Input
                  value={data.formation || ""}
                  onChange={(e) => onUpdate("formation", e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  placeholder="Votre formation"
                />
              ) : (
                data.formation
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-blue-50">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {isEditing ? (
                  <Input
                    value={data.email}
                    onChange={(e) => onUpdate("email", e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm"
                  />
                ) : (
                  data.email
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {isEditing ? (
                  <Input
                    value={data.telephone}
                    onChange={(e) => onUpdate("telephone", e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm"
                  />
                ) : (
                  data.telephone
                )}
              </div>
            </div>
          </div>

          {/* Photo de profil (optionnelle) */}
          {profileImage && (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
              <img 
                src={profileImage} 
                alt="Photo de profil" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Corps du CV */}
      <div className="p-8 space-y-6">
        {/* Objectif / Pitch */}
        {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Target className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <h2 
                className="text-xl font-bold tracking-tight"
                style={{ color: primaryColor }}
              >
                OBJECTIF PROFESSIONNEL
              </h2>
            </div>
            <div className="pl-13">
              {isEditing ? (
                <Textarea
                  value={data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
                  onChange={(e) => onUpdate("pitchPersonnalise", e.target.value)}
                  className="min-h-[80px] border-gray-300 focus:border-blue-500"
                  placeholder="Votre objectif professionnel..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Expériences Professionnelles */}
        {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <h2 
                className="text-xl font-bold tracking-tight"
                style={{ color: primaryColor }}
              >
                EXPÉRIENCES PROFESSIONNELLES
              </h2>
            </div>
            
            <div className="space-y-5 pl-13">
              {data.experiencesAmeliorees.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div 
                    className="absolute -left-[3.25rem] top-2 w-3 h-3 rounded-full border-2"
                    style={{ 
                      backgroundColor: "white",
                      borderColor: primaryColor 
                    }}
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {isEditing ? (
                          <Input
                            value={exp.poste}
                            onChange={(e) => {
                              const newExps = [...data.experiencesAmeliorees!];
                              newExps[index] = { ...newExps[index], poste: e.target.value };
                              onUpdate("experiencesAmeliorees", newExps);
                            }}
                            className="font-bold"
                          />
                        ) : (
                          exp.poste
                        )}
                      </h3>
                      {data.experiences?.[index]?.periode && (
                        <Badge 
                          variant="secondary"
                          className="text-xs font-medium shrink-0"
                          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        >
                          {data.experiences[index].periode}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm font-medium" style={{ color: accentColor }}>
                      {isEditing ? (
                        <Input
                          value={exp.entreprise}
                          onChange={(e) => {
                            const newExps = [...data.experiencesAmeliorees!];
                            newExps[index] = { ...newExps[index], entreprise: e.target.value };
                            onUpdate("experiencesAmeliorees", newExps);
                          }}
                        />
                      ) : (
                        exp.entreprise
                      )}
                    </p>
                    
                    <div className="text-gray-700 leading-relaxed">
                      {isEditing ? (
                        <Textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExps = [...data.experiencesAmeliorees!];
                            newExps[index] = { ...newExps[index], description: e.target.value };
                            onUpdate("experiencesAmeliorees", newExps);
                          }}
                          className="min-h-[80px]"
                        />
                      ) : (
                        <p>{exp.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formation */}
        {data.formation && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <h2 
                className="text-xl font-bold tracking-tight"
                style={{ color: primaryColor }}
              >
                FORMATION
              </h2>
            </div>
            <div className="pl-13">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {data.formation}
                  </h3>
                  {data.ecole && (
                    <p className="text-sm font-medium" style={{ color: accentColor }}>
                      {data.ecole}
                    </p>
                  )}
                </div>
                {data.anneeFormation && (
                  <Badge 
                    variant="secondary"
                    className="text-xs font-medium"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {data.anneeFormation}
                  </Badge>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Compétences */}
        {data.competencesAmeliorees && data.competencesAmeliorees.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Award className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <h2 
                className="text-xl font-bold tracking-tight"
                style={{ color: primaryColor }}
              >
                COMPÉTENCES
              </h2>
            </div>
            <div className="pl-13">
              <div className="flex flex-wrap gap-2">
                {data.competencesAmeliorees.map((comp, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium"
                    style={{ 
                      backgroundColor: `${primaryColor}10`,
                      color: primaryColor,
                      border: `1px solid ${primaryColor}30`
                    }}
                  >
                    {comp}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer subtil */}
      <div className="px-8 pb-6 text-center text-xs text-gray-400">
        CV généré avec AlternaBoost
      </div>
    </Card>
  );
}


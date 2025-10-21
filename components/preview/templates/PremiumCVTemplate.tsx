"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { GeneratedCV } from "@/types/cv";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Target, Globe } from "lucide-react";

interface PremiumCVTemplateProps {
  data: GeneratedCV;
  isEditing: boolean;
  onUpdate: (field: string, value: unknown) => void;
  profileImage?: string;
}

export function PremiumCVTemplate({
  data,
  isEditing,
  onUpdate,
  profileImage,
}: PremiumCVTemplateProps) {
  return (
    <Card className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden">
      <div className="grid grid-cols-[35%_65%] min-h-[297mm]">
        {/* Colonne gauche - Sidebar violet/indigo */}
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-8">
          {/* Photo */}
          {profileImage ? (
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl mb-6">
              <img 
                src={profileImage} 
                alt="Photo" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full bg-white/20 border-4 border-white shadow-2xl mb-6 flex items-center justify-center text-4xl font-bold">
              {data.prenom?.[0]}{data.nom?.[0]}
            </div>
          )}

          {/* Informations personnelles */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
              <div className="text-sm leading-relaxed break-words">
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
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">
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

          {/* Compétences en sidebar */}
          {data.competencesAmeliorees && data.competencesAmeliorees.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 border-white/30 pb-2">
                Compétences
              </h3>
              <div className="space-y-2">
                {data.competencesAmeliorees.map((comp, index) => (
                  <div 
                    key={index} 
                    className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    {comp}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation en sidebar */}
          {data.formation && (
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 border-white/30 pb-2">
                Formation
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-sm">{data.formation}</p>
                {data.ecole && <p className="text-sm text-white/90">{data.ecole}</p>}
                {data.anneeFormation && (
                  <p className="text-xs text-white/80">{data.anneeFormation}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite - Contenu principal */}
        <div className="p-10 space-y-8">
          {/* Nom et titre */}
          <div className="border-b-4 border-purple-600 pb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {isEditing ? (
                <Input
                  value={`${data.prenom} ${data.nom}`}
                  onChange={(e) => {
                    const [prenom, ...nomParts] = e.target.value.split(" ");
                    onUpdate("prenom", prenom || "");
                    onUpdate("nom", nomParts.join(" ") || "");
                  }}
                  className="text-4xl font-bold"
                />
              ) : (
                `${data.prenom} ${data.nom}`.toUpperCase()
              )}
            </h1>
            
            <p className="text-xl text-purple-600 font-semibold">
              {isEditing ? (
                <Input
                  value={data.formation || ""}
                  onChange={(e) => onUpdate("formation", e.target.value)}
                  placeholder="Votre titre professionnel"
                />
              ) : (
                data.formation
              )}
            </p>
          </div>

          {/* Objectif */}
          {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                <Target className="w-6 h-6" />
                PROFIL
              </h2>
              {isEditing ? (
                <Textarea
                  value={data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
                  onChange={(e) => onUpdate("pitchPersonnalise", e.target.value)}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
                </p>
              )}
            </section>
          )}

          {/* Expériences */}
          {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                EXPÉRIENCE PROFESSIONNELLE
              </h2>
              
              <div className="space-y-6">
                {data.experiencesAmeliorees.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-purple-300">
                    {/* Bullet point */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-white" />
                    
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
                            />
                          ) : (
                            exp.poste
                          )}
                        </h3>
                        {data.experiences?.[index]?.periode && (
                          <Badge className="bg-purple-100 text-purple-700 shrink-0">
                            {data.experiences[index].periode}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm font-semibold text-purple-600">
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
                      
                      <div className="text-gray-700 text-sm leading-relaxed">
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
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 pb-6 text-right text-xs text-gray-400">
        CV Premium - AlternaBoost
      </div>
    </Card>
  );
}


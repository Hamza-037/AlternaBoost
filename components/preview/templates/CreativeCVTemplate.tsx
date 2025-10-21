"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { GeneratedCV } from "@/types/cv";
import { Mail, Phone, Briefcase, GraduationCap, Sparkles, Target } from "lucide-react";

interface CreativeCVTemplateProps {
  data: GeneratedCV;
  isEditing: boolean;
  onUpdate: (field: string, value: unknown) => void;
  profileImage?: string;
}

export function CreativeCVTemplate({
  data,
  isEditing,
  onUpdate,
  profileImage,
}: CreativeCVTemplateProps) {
  const gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";

  return (
    <Card className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header créatif avec formes géométriques */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.4) 0%, transparent 50%)
            `
          }}
        />
        
        <div className="relative p-10 pb-8">
          <div className="flex items-start gap-6">
            {/* Photo avec bordure créative */}
            {profileImage && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl rotate-6" />
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                  <img 
                    src={profileImage} 
                    alt="Photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-3"
                style={{ 
                  background: gradient,
                  color: "white"
                }}
              >
                <Sparkles className="w-3 h-3 inline mr-1" />
                CV CRÉATIF
              </div>
              
              <h1 className="text-5xl font-black mb-2 bg-clip-text text-transparent"
                style={{ backgroundImage: gradient }}
              >
                {isEditing ? (
                  <Input
                    value={`${data.prenom} ${data.nom}`}
                    onChange={(e) => {
                      const [prenom, ...nomParts] = e.target.value.split(" ");
                      onUpdate("prenom", prenom || "");
                      onUpdate("nom", nomParts.join(" ") || "");
                    }}
                    className="text-5xl font-black"
                  />
                ) : (
                  `${data.prenom} ${data.nom}`
                )}
              </h1>
              
              <p className="text-xl text-purple-600 font-bold mb-4">
                {isEditing ? (
                  <Input
                    value={data.formation || ""}
                    onChange={(e) => onUpdate("formation", e.target.value)}
                  />
                ) : (
                  data.formation
                )}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                  <Mail className="w-4 h-4 text-purple-600" />
                  {isEditing ? (
                    <Input
                      value={data.email}
                      onChange={(e) => onUpdate("email", e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    data.email
                  )}
                </div>
                
                <div className="flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-lg">
                  <Phone className="w-4 h-4 text-pink-600" />
                  {isEditing ? (
                    <Input
                      value={data.telephone}
                      onChange={(e) => onUpdate("telephone", e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    data.telephone
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vague décorative */}
        <div className="h-6" style={{ background: gradient }} />
      </div>

      {/* Corps du CV avec mise en page créative */}
      <div className="p-10 space-y-8">
        {/* Objectif avec design card */}
        {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full" style={{ background: gradient }} />
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-purple-900">
                  MON PROFIL
                </h2>
              </div>
              {isEditing ? (
                <Textarea
                  value={data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
                  onChange={(e) => onUpdate("pitchPersonnalise", e.target.value)}
                  className="min-h-[100px] bg-white"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Expériences avec timeline créative */}
        {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: gradient }}
              >
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                PARCOURS PROFESSIONNEL
              </h2>
            </div>
            
            <div className="space-y-6">
              {data.experiencesAmeliorees.map((exp, index) => (
                <div 
                  key={index} 
                  className="relative bg-white border-2 border-purple-100 rounded-2xl p-6 hover:border-purple-300 transition-all hover:shadow-lg"
                >
                  {/* Badge numéro */}
                  <div 
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    style={{ background: gradient }}
                  >
                    {index + 1}
                  </div>

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
                        <Badge 
                          className="shrink-0"
                          style={{ 
                            background: gradient,
                            color: "white"
                          }}
                        >
                          {data.experiences[index].periode}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="font-semibold text-purple-600">
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

        {/* Compétences en grille créative */}
        {data.competencesAmeliorees && data.competencesAmeliorees.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: gradient }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                MES COMPÉTENCES
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.competencesAmeliorees.map((comp, index) => (
                <div
                  key={index}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 transition-all"
                >
                  {comp}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer créatif */}
      <div className="h-2" style={{ background: gradient }} />
    </Card>
  );
}


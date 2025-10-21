"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GeneratedCV } from "@/types/cv";

interface MinimalCVTemplateProps {
  data: GeneratedCV;
  isEditing: boolean;
  onUpdate: (field: string, value: unknown) => void;
}

export function MinimalCVTemplate({
  data,
  isEditing,
  onUpdate,
}: MinimalCVTemplateProps) {
  return (
    <Card className="w-full max-w-[210mm] mx-auto bg-white shadow-lg p-12 min-h-[297mm]">
      {/* Header épuré */}
      <div className="border-b border-gray-900 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
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
        
        <p className="text-lg text-gray-700 mb-3">
          {isEditing ? (
            <Input
              value={data.formation || ""}
              onChange={(e) => onUpdate("formation", e.target.value)}
            />
          ) : (
            data.formation
          )}
        </p>

        <div className="text-sm text-gray-600 flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <Input
                value={data.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                className="text-sm max-w-xs"
              />
              <span>|</span>
              <Input
                value={data.telephone}
                onChange={(e) => onUpdate("telephone", e.target.value)}
                className="text-sm max-w-xs"
              />
            </>
          ) : (
            <>
              <span>{data.email}</span>
              <span>|</span>
              <span>{data.telephone}</span>
            </>
          )}
        </div>
      </div>

      {/* Objectif */}
      {(data.pitchPersonnalise || data.objectifAmeliore || data.objectif) && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">
            Profil
          </h2>
          {isEditing ? (
            <Textarea
              value={data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
              onChange={(e) => onUpdate("pitchPersonnalise", e.target.value)}
              className="min-h-[80px]"
            />
          ) : (
            <p className="text-gray-800 leading-relaxed text-justify">
              {data.pitchPersonnalise || data.objectifAmeliore || data.objectif}
            </p>
          )}
        </section>
      )}

      {/* Expériences */}
      {data.experiencesAmeliorees && data.experiencesAmeliorees.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-300 pb-1">
            Expérience Professionnelle
          </h2>
          
          <div className="space-y-5">
            {data.experiencesAmeliorees.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">
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
                    <span className="text-sm text-gray-600 font-medium">
                      {data.experiences[index].periode}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-700 font-medium mb-2 italic">
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
                
                <div className="text-sm text-gray-800 leading-relaxed">
                  {isEditing ? (
                    <Textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExps = [...data.experiencesAmeliorees!];
                        newExps[index] = { ...newExps[index], description: e.target.value };
                        onUpdate("experiencesAmeliorees", newExps);
                      }}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <p>{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formation */}
      {data.formation && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">
            Formation
          </h2>
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="text-base font-bold text-gray-900">{data.formation}</h3>
              {data.ecole && (
                <p className="text-sm text-gray-700 italic">{data.ecole}</p>
              )}
            </div>
            {data.anneeFormation && (
              <span className="text-sm text-gray-600 font-medium">{data.anneeFormation}</span>
            )}
          </div>
        </section>
      )}

      {/* Compétences */}
      {data.competencesAmeliorees && data.competencesAmeliorees.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">
            Compétences
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed">
            {data.competencesAmeliorees.join(" • ")}
          </p>
        </section>
      )}

      {/* Footer discret */}
      <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
        Document généré par AlternaBoost
      </div>
    </Card>
  );
}


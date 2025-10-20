"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { GeneratedCV, CVStyle, CVSection } from "@/types/cv";
import { Globe, Award, Briefcase, Heart, Sparkles } from "lucide-react";

interface CVPreviewHTMLProps {
  data: GeneratedCV;
  isEditing: boolean;
  onUpdate: (field: string, value: unknown) => void;
  style?: CVStyle;
  customSections?: CVSection[];
}

export function CVPreviewHTML({
  data,
  isEditing,
  onUpdate,
  style,
  customSections = [],
}: CVPreviewHTMLProps) {
  // Couleurs personnalisées ou par défaut
  const primaryColor = style?.colorScheme?.primary || "#2563EB";
  const secondaryColor = style?.colorScheme?.secondary || "#3B82F6";
  const accentColor = style?.colorScheme?.accent || "#60A5FA";
  
  // Espacement
  const spacing = style?.layout?.spacing || "normal";
  const spacingClass = spacing === "compact" ? "space-y-4" : spacing === "spacious" ? "space-y-10" : "space-y-6";
  
  // Icônes de section
  const showIcons = style?.layout?.sectionIcons !== false;
  
  // Polices
  const headingFont = style?.typography?.headingFont || "Inter";
  const bodyFont = style?.typography?.bodyFont || "Inter";

  return (
    <Card 
      className={`w-full max-w-[210mm] mx-auto bg-white shadow-2xl p-10 min-h-[297mm] ${spacingClass}`}
      style={{ fontFamily: bodyFont }}
    >
      {/* Header - Informations personnelles */}
      <div 
        className="border-b-2 pb-4 mb-6" 
        style={{ borderColor: primaryColor }}
      >
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: primaryColor, fontFamily: headingFont }}
        >
          {isEditing ? (
            <Input
              value={`${data.prenom} ${data.nom}`}
              onChange={(e) => {
                const [prenom, ...nomParts] = e.target.value.split(" ");
                onUpdate("prenom", prenom || "");
                onUpdate("nom", nomParts.join(" ") || "");
              }}
              className="text-3xl font-bold border-0 border-b-2 border-dashed rounded-none px-0"
              style={{ borderColor: `${primaryColor}40` }}
            />
          ) : (
            `${data.prenom} ${data.nom}`
          )}
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            {isEditing ? (
              <Input
                value={data.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                className="text-sm border-0 border-b border-dashed border-gray-300 rounded-none px-0"
              />
            ) : (
              data.email
            )}{" "}
            •{" "}
            {isEditing ? (
              <Input
                value={data.telephone}
                onChange={(e) => onUpdate("telephone", e.target.value)}
                className="inline-block w-auto text-sm border-0 border-b border-dashed border-gray-300 rounded-none px-0"
              />
            ) : (
              data.telephone
            )}
          </p>
        </div>
      </div>

      {/* Objectif professionnel */}
      {data.objectifAmeliore && (
        <section>
          <h2 
            className="text-lg font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
            style={{ color: primaryColor, fontFamily: headingFont }}
          >
            {showIcons && <span>🎯</span>}
            Objectif Professionnel
          </h2>
          {isEditing ? (
            <Textarea
              value={data.objectifAmeliore}
              onChange={(e) => onUpdate("objectifAmeliore", e.target.value)}
              className="text-sm leading-relaxed text-gray-700 min-h-[80px] border-dashed"
              rows={4}
            />
          ) : (
            <p className="text-sm leading-relaxed text-gray-700 text-justify">
              {data.objectifAmeliore}
            </p>
          )}
        </section>
      )}

      {/* Formation */}
      <section>
        <h2 
          className="text-lg font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
          style={{ color: primaryColor, fontFamily: headingFont }}
        >
          {showIcons && <span>🎓</span>}
          Formation
        </h2>
        <div className="mb-3">
          <p className="text-base font-bold text-gray-900 mb-1">
            {isEditing ? (
              <Input
                value={data.formation}
                onChange={(e) => onUpdate("formation", e.target.value)}
                className="border-0 border-b border-dashed border-gray-300 rounded-none px-0"
              />
            ) : (
              data.formation
            )}
          </p>
          <p className="text-sm text-gray-600">
            {isEditing ? (
              <>
                <Input
                  value={data.ecole}
                  onChange={(e) => onUpdate("ecole", e.target.value)}
                  className="inline-block w-1/2 text-sm border-0 border-b border-dashed border-gray-300 rounded-none px-0 mr-2"
                />{" "}
                •{" "}
                <Input
                  value={data.anneeFormation}
                  onChange={(e) => onUpdate("anneeFormation", e.target.value)}
                  className="inline-block w-auto text-sm border-0 border-b border-dashed border-gray-300 rounded-none px-0"
                />
              </>
            ) : (
              `${data.ecole} • ${data.anneeFormation}`
            )}
          </p>
        </div>
      </section>

      {/* Expériences professionnelles */}
      <section>
        <h2 
          className="text-lg font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
          style={{ color: primaryColor, fontFamily: headingFont }}
        >
          {showIcons && <span>💼</span>}
          Expériences Professionnelles
        </h2>
        {data.experiencesAmeliorees.map((exp, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex justify-between items-start mb-1">
              <p className="text-base font-bold text-gray-900">
                {isEditing ? (
                  <Input
                    value={exp.poste}
                    onChange={(e) => {
                      const newExps = [...data.experiencesAmeliorees];
                      newExps[index] = { ...newExps[index], poste: e.target.value };
                      onUpdate("experiencesAmeliorees", newExps);
                    }}
                    className="border-0 border-b border-dashed border-gray-300 rounded-none px-0"
                  />
                ) : (
                  exp.poste
                )}
              </p>
            </div>
            <p className="text-sm text-gray-600 italic mb-1">
              {isEditing ? (
                <Input
                  value={exp.entreprise}
                  onChange={(e) => {
                    const newExps = [...data.experiencesAmeliorees];
                    newExps[index] = { ...newExps[index], entreprise: e.target.value };
                    onUpdate("experiencesAmeliorees", newExps);
                  }}
                  className="border-0 border-b border-dashed border-gray-300 rounded-none px-0"
                />
              ) : (
                exp.entreprise
              )}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              {exp.periode}
            </p>
            {isEditing ? (
              <Textarea
                value={exp.description}
                onChange={(e) => {
                  const newExps = [...data.experiencesAmeliorees];
                  newExps[index] = { ...newExps[index], description: e.target.value };
                  onUpdate("experiencesAmeliorees", newExps);
                }}
                className="text-sm leading-relaxed text-gray-700 min-h-[60px] border-dashed"
                rows={3}
              />
            ) : (
              <p className="text-sm leading-relaxed text-gray-700">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Compétences */}
      <section>
        <h2 
          className="text-lg font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
          style={{ color: primaryColor, fontFamily: headingFont }}
        >
          {showIcons && <span>⚡</span>}
          Compétences
        </h2>
        {isEditing ? (
          <div className="space-y-2">
            {data.competencesAmeliorees.map((competence, index) => (
              <Input
                key={index}
                value={competence}
                onChange={(e) => {
                  const newComps = [...data.competencesAmeliorees];
                  newComps[index] = e.target.value;
                  onUpdate("competencesAmeliorees", newComps);
                }}
                className="border-0 border-b border-dashed border-gray-300 rounded-none px-0"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.competencesAmeliorees.map((skill, index) => (
              <Badge 
                key={index}
                style={{ 
                  backgroundColor: `${accentColor}20`,
                  color: primaryColor,
                  borderColor: primaryColor,
                }}
                className="border"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </section>

      {/* Sections personnalisées */}
      {customSections.filter(s => s.visible).map((section) => (
        <section key={section.id}>
          <h2 
            className="text-lg font-bold mb-3 uppercase tracking-wide flex items-center gap-2"
            style={{ color: primaryColor, fontFamily: headingFont }}
          >
            {showIcons && (
              <>
                {section.type === "langues" && <Globe className="w-5 h-5" />}
                {section.type === "certifications" && <Award className="w-5 h-5" />}
                {section.type === "projets" && <Briefcase className="w-5 h-5" />}
                {section.type === "interets" && <Heart className="w-5 h-5" />}
                {section.type === "custom" && <Sparkles className="w-5 h-5" />}
              </>
            )}
            {section.titre}
          </h2>
          <div className="space-y-2">
            {Array.isArray(section.contenu) ? (
              <ul className="list-disc list-inside space-y-1">
                {section.contenu.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-700">{section.contenu}</p>
            )}
          </div>
        </section>
      ))}
    </Card>
  );
}

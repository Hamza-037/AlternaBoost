"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { GeneratedLetter, LetterStyle, LetterSection } from "@/types/letter";
import { PenTool, FileText, Sparkles } from "lucide-react";

interface LetterPreviewHTMLV2Props {
  data: GeneratedLetter;
  isEditing: boolean;
  onUpdate: (field: string, value: string) => void;
  style?: LetterStyle;
  customSections?: LetterSection[];
}

export function LetterPreviewHTMLV2({
  data,
  isEditing,
  onUpdate,
  style,
  customSections = [],
}: LetterPreviewHTMLV2Props) {
  // Couleurs personnalisées ou par défaut
  const primaryColor = style?.colorScheme?.primary || "#2563EB";
  const secondaryColor = style?.colorScheme?.secondary || "#3B82F6";
  const accentColor = style?.colorScheme?.accent || "#60A5FA";
  
  // Espacement
  const spacing = style?.layout?.spacing || "normal";
  const spacingClass = spacing === "compact" ? "space-y-4" : spacing === "spacious" ? "space-y-10" : "space-y-6";
  
  // Polices
  const headingFont = style?.typography?.headingFont || "Inter";
  const bodyFont = style?.typography?.bodyFont || "Inter";
  
  // Options d'affichage
  const showIcons = style?.layout?.showIcons || false;
  const showBorders = style?.layout?.showBorders || false;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const ville = data.adresse.split(",")[0];

  return (
    <Card 
      className={`max-w-4xl mx-auto bg-white shadow-2xl ${spacingClass}`}
      style={{ fontFamily: bodyFont }}
    >
      {/* Feuille A4 simulée */}
      <div 
        className="p-12 md:p-16" 
        style={{ 
          minHeight: "1056px",
          border: showBorders ? `2px solid ${primaryColor}` : "none",
          borderRadius: showBorders ? "8px" : "0",
        }}
      >
        {/* En-tête : Expéditeur */}
        <div 
          className="mb-8 text-sm leading-relaxed"
          style={{ color: primaryColor }}
        >
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={`${data.prenom} ${data.nom}`}
                onChange={(e) => {
                  const names = e.target.value.split(" ");
                  onUpdate("prenom", names[0] || "");
                  onUpdate("nom", names.slice(1).join(" ") || "");
                }}
                className="font-semibold"
                style={{ 
                  fontFamily: headingFont,
                  color: primaryColor 
                }}
              />
              <Input
                value={data.adresse}
                onChange={(e) => onUpdate("adresse", e.target.value)}
              />
              <Input
                value={data.telephone}
                onChange={(e) => onUpdate("telephone", e.target.value)}
              />
              <Input
                value={data.email}
                onChange={(e) => onUpdate("email", e.target.value)}
              />
            </div>
          ) : (
            <>
              <p 
                className="font-semibold"
                style={{ fontFamily: headingFont, color: primaryColor }}
              >
                {`${data.prenom} ${data.nom}`}
              </p>
              <p>{data.adresse}</p>
              <p>{data.telephone}</p>
              <p>{data.email}</p>
            </>
          )}
        </div>

        {/* Date et Lieu */}
        <div className="mb-8 text-sm text-right">
          <p>
            {ville}, le {formatDate(data.dateGeneration)}
          </p>
        </div>

        {/* Destinataire */}
        <div className="mb-8 text-sm leading-relaxed">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={data.entreprise}
                onChange={(e) => onUpdate("entreprise", e.target.value)}
                className="font-semibold"
                style={{ fontFamily: headingFont }}
              />
              {data.destinataire && (
                <Input
                  value={data.destinataire}
                  onChange={(e) => onUpdate("destinataire", e.target.value)}
                  placeholder="À l'attention de..."
                />
              )}
            </div>
          ) : (
            <>
              <p 
                className="font-semibold"
                style={{ fontFamily: headingFont }}
              >
                {data.entreprise}
              </p>
              {data.destinataire && <p>À l&apos;attention de {data.destinataire}</p>}
              <p>Service Recrutement</p>
            </>
          )}
        </div>

        {/* Objet */}
        <div 
          className="mb-8"
          style={{ 
            borderBottom: showBorders ? `2px solid ${primaryColor}` : "none",
            paddingBottom: showBorders ? "8px" : "0"
          }}
        >
          {isEditing ? (
            <Input
              value={`Objet : Candidature au poste de ${data.posteVise}`}
              onChange={(e) => onUpdate("posteVise", e.target.value.replace("Objet : Candidature au poste de ", ""))}
              className="font-semibold"
              style={{ fontFamily: headingFont }}
            />
          ) : (
            <p 
              className="font-semibold"
              style={{ fontFamily: headingFont }}
            >
              Objet : Candidature au poste de {data.posteVise}
            </p>
          )}
        </div>

        {/* Corps de la lettre */}
        <div className="space-y-4 mb-8">
          <p>Madame, Monsieur,</p>
          {isEditing ? (
            <Textarea
              value={data.contenuGenere}
              onChange={(e) => onUpdate("contenuGenere", e.target.value)}
              rows={10}
              className="w-full"
              style={{ fontFamily: bodyFont }}
            />
          ) : (
            data.contenuGenere.split("\n").map((paragraph, index) => (
              <p key={index} className="text-justify" style={{ fontFamily: bodyFont }}>
                {paragraph}
              </p>
            ))
          )}
          <p>
            Dans l&apos;attente de votre retour, je vous prie d&apos;agréer, Madame, Monsieur,
            l&apos;expression de mes salutations distinguées.
          </p>
        </div>

        {/* Signature */}
        <div className="text-right mt-8">
          <p 
            className="font-semibold"
            style={{ fontFamily: headingFont }}
          >
            {data.prenom} {data.nom}
          </p>
        </div>

        {/* Sections personnalisées */}
        {customSections.filter(s => s.visible).map((section) => (
          <div key={section.id} className="mt-8">
            <div 
              className="flex items-center gap-2 mb-4"
              style={{ color: primaryColor }}
            >
              {showIcons && (
                <>
                  {section.type === "signature" && <PenTool className="w-5 h-5" />}
                  {section.type === "postscript" && <FileText className="w-5 h-5" />}
                  {section.type === "attachment" && <FileText className="w-5 h-5" />}
                  {section.type === "custom" && <Sparkles className="w-5 h-5" />}
                </>
              )}
              <h3 
                className="text-lg font-semibold"
                style={{ fontFamily: headingFont }}
              >
                {section.titre}
              </h3>
            </div>
            
            {isEditing ? (
              <Textarea
                value={section.contenu}
                onChange={(e) => {
                  const updatedSections = customSections.map(s => 
                    s.id === section.id ? { ...s, contenu: e.target.value } : s
                  );
                  // Note: Il faudrait passer une fonction onUpdateSections
                }}
                rows={3}
                className="w-full"
                style={{ fontFamily: bodyFont }}
              />
            ) : (
              <p 
                className="text-sm leading-relaxed"
                style={{ fontFamily: bodyFont }}
              >
                {section.contenu}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

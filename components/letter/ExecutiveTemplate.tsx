"use client";

import React from "react";
import { EditableLetterContent } from "./EditableLetterContent";

interface ExecutiveTemplateProps {
  letterData: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    entreprise: string;
    destinataire?: string;
    posteVise: string;
    contenuGenere: string;
  };
  headingFont: string;
  bodyFont: string;
  onContentChange: (content: string) => void;
  onRegenerateParagraph?: (index: number) => Promise<void>;
}

export function ExecutiveLetterLayout({
  letterData,
  headingFont,
  bodyFont,
  onContentChange,
  onRegenerateParagraph,
}: ExecutiveTemplateProps) {
  return (
    <div className="bg-white min-h-[1000px] flex">
      {/* Ligne verticale élégante à gauche */}
      <div className="w-1 bg-gradient-to-b from-gray-800 via-gray-600 to-gray-400 flex-shrink-0"></div>
      
      <div className="flex-1 p-16">
        {/* Header minimaliste et élégant */}
        <div className="mb-12 border-b border-gray-300 pb-8">
          <h1 
            className="text-5xl font-serif font-normal text-gray-900 mb-3 tracking-tight"
            style={{ 
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            {letterData.prenom} {letterData.nom}
          </h1>
          <p className="text-base text-gray-600 font-light tracking-wide uppercase" style={{ letterSpacing: "0.1em" }}>
            {letterData.posteVise}
          </p>
          
          {/* Contact sur une ligne - ultra sobre */}
          <div className="mt-6 flex items-center gap-6 text-xs text-gray-500" style={{ fontFamily: bodyFont }}>
            <span>{letterData.email}</span>
            <span>•</span>
            <span>{letterData.telephone}</span>
            <span>•</span>
            <span>{letterData.adresse}</span>
          </div>
        </div>

        {/* Destinataire - format lettre classique */}
        <div className="mb-12">
          <p className="text-gray-900 font-medium mb-1">{letterData.entreprise}</p>
          {letterData.destinataire && (
            <p className="text-gray-600 text-sm">À l'attention de {letterData.destinataire}</p>
          )}
          <p className="text-gray-500 text-sm mt-6">
            {new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Objet - discret */}
        <div className="mb-10">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Objet : </span>
            {letterData.posteVise}
          </p>
          <div className="h-px bg-gradient-to-r from-gray-400 via-gray-200 to-transparent mt-4"></div>
        </div>

        {/* Formule d'appel */}
        <p className="mb-8 text-gray-900">
          {letterData.destinataire || "Madame, Monsieur"},
        </p>

        {/* Contenu - spacieux et aéré */}
        <div style={{ fontFamily: bodyFont, lineHeight: "1.8" }}>
          <EditableLetterContent
            content={letterData.contenuGenere}
            onContentChange={onContentChange}
            onRegenerateParagraph={onRegenerateParagraph}
            primaryColor="#374151"
            template="executive"
          />
        </div>

        {/* Formule de politesse - classique */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-900 mb-16 leading-relaxed">
            Je vous prie d'agréer, {letterData.destinataire || "Madame, Monsieur"}, l'expression de mes salutations distinguées.
          </p>
          
          {/* Signature style manuscrit */}
          <div>
            <p 
              className="text-3xl text-gray-800 mb-2"
              style={{ 
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                fontWeight: 400,
              }}
            >
              {letterData.prenom} {letterData.nom}
            </p>
            <div className="h-px w-32 bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


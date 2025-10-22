"use client";

import React from "react";
import { EditableLetterContent } from "./EditableLetterContent";

interface LetterLayoutProps {
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
  primaryColor: string;
  secondaryColor?: string;
  headingFont: string;
  bodyFont: string;
  onContentChange: (content: string) => void;
  onRegenerateParagraph?: (index: number) => Promise<void>;
}

// Template CLASSIC - Sobre, traditionnel, noir & blanc
export function ClassicLetterLayout({
  letterData,
  primaryColor,
  headingFont,
  bodyFont,
  onContentChange,
  onRegenerateParagraph,
}: LetterLayoutProps) {
  return (
    <div 
      className="bg-white p-12 min-h-[1000px]"
      style={{ fontFamily: bodyFont }}
    >
      {/* Header simple - Aligné à gauche */}
      <div className="mb-8">
        <h2 
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: headingFont }}
        >
          {letterData.prenom} {letterData.nom}
        </h2>
        <div className="text-sm text-gray-600 space-y-0.5">
          <p>{letterData.adresse}</p>
          <p>{letterData.telephone} • {letterData.email}</p>
        </div>
      </div>

      {/* Séparateur discret */}
      <div className="border-t border-gray-300 my-8"></div>

      {/* Destinataire */}
      <div className="mb-8 text-sm">
        <p className="font-semibold text-gray-900">{letterData.entreprise}</p>
        {letterData.destinataire && (
          <p className="text-gray-700">À l'attention de {letterData.destinataire}</p>
        )}
        <p className="mt-6 text-gray-600">
          {new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Objet */}
      <div className="mb-8">
        <p className="text-sm">
          <span className="font-bold">Objet :</span> Candidature au poste de {letterData.posteVise}
        </p>
      </div>

      {/* Formule d'appel */}
      <p className="mb-6 text-gray-900">
        {letterData.destinataire || "Madame, Monsieur"},
      </p>

      {/* Contenu */}
      <EditableLetterContent
        content={letterData.contenuGenere}
        onContentChange={onContentChange}
        onRegenerateParagraph={onRegenerateParagraph}
        primaryColor="#6B7280"
        template="classic"
      />

      {/* Formule de politesse */}
      <div className="mt-8">
        <p className="text-gray-900 mb-12">
          Je vous prie d'agréer, {letterData.destinataire || "Madame, Monsieur"}, l'expression de mes salutations distinguées.
        </p>
        <p className="font-semibold text-gray-900">
          {letterData.prenom} {letterData.nom}
        </p>
      </div>
    </div>
  );
}

// Template MODERN - Design épuré avec accent coloré
export function ModernLetterLayout({
  letterData,
  primaryColor,
  headingFont,
  bodyFont,
  onContentChange,
  onRegenerateParagraph,
}: LetterLayoutProps) {
  return (
    <div 
      className="bg-white min-h-[1000px]"
      style={{ fontFamily: bodyFont }}
    >
      {/* Header moderne avec barre colorée sur le côté */}
      <div className="flex">
        {/* Barre colorée verticale à gauche */}
        <div 
          className="w-2 flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        ></div>
        
        <div className="flex-1 p-12">
          {/* Nom en grand avec couleur */}
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold mb-3"
              style={{ 
                color: primaryColor,
                fontFamily: headingFont,
              }}
            >
              {letterData.prenom} {letterData.nom}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {letterData.email}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {letterData.telephone}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{letterData.adresse}</p>
          </div>

          {/* Ligne de séparation */}
          <div 
            className="h-0.5 w-20 mb-8"
            style={{ backgroundColor: primaryColor }}
          ></div>

          {/* Date et destinataire - côte à côte */}
          <div className="flex justify-between mb-8 text-sm">
            <div>
              <p className="font-semibold text-gray-900 text-base">{letterData.entreprise}</p>
              {letterData.destinataire && (
                <p className="text-gray-600">À l'attention de {letterData.destinataire}</p>
              )}
            </div>
            <div className="text-right text-gray-600">
              <p>
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Objet stylisé */}
          <div className="mb-8 pb-4 border-b border-gray-200">
            <p className="text-sm">
              <span 
                className="font-bold uppercase tracking-wide"
                style={{ color: primaryColor }}
              >
                Objet :
              </span>{" "}
              <span className="text-gray-900">{letterData.posteVise}</span>
            </p>
          </div>

          {/* Formule d'appel */}
          <p className="mb-6 text-gray-900 font-medium">
            {letterData.destinataire || "Madame, Monsieur"},
          </p>

          {/* Contenu */}
          <EditableLetterContent
            content={letterData.contenuGenere}
            onContentChange={onContentChange}
            onRegenerateParagraph={onRegenerateParagraph}
            primaryColor={primaryColor}
            template="modern"
          />

          {/* Formule de politesse */}
          <div className="mt-8">
            <p className="text-gray-900 mb-12">
              Je vous prie d'agréer, {letterData.destinataire || "Madame, Monsieur"}, l'expression de mes salutations distinguées.
            </p>
            <p 
              className="font-bold text-lg"
              style={{ color: primaryColor }}
            >
              {letterData.prenom} {letterData.nom}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template CREATIVE - Design audacieux avec dégradés
export function CreativeLetterLayout({
  letterData,
  primaryColor,
  secondaryColor = "#8B5CF6",
  headingFont,
  bodyFont,
  onContentChange,
  onRegenerateParagraph,
}: LetterLayoutProps) {
  return (
    <div 
      className="bg-white min-h-[1000px]"
      style={{ fontFamily: bodyFont }}
    >
      {/* Header créatif avec dégradé */}
      <div 
        className="p-12 text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <h1 
          className="text-5xl font-black mb-2"
          style={{ fontFamily: headingFont }}
        >
          {letterData.prenom} {letterData.nom}
        </h1>
        <p className="text-lg opacity-90">{letterData.posteVise}</p>
      </div>

      <div className="p-12">
        {/* Infos de contact - Style carte */}
        <div className="flex gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-700">{letterData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: secondaryColor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-gray-700">{letterData.telephone}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-gray-700">{letterData.adresse}</span>
          </div>
        </div>

        {/* Carte destinataire */}
        <div 
          className="p-6 rounded-xl mb-8"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}10 0%, ${secondaryColor}10 100%)`,
            border: `2px solid ${primaryColor}30`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p 
                className="font-bold text-xl mb-1"
                style={{ color: primaryColor }}
              >
                {letterData.entreprise}
              </p>
              {letterData.destinataire && (
                <p className="text-gray-700">À l'attention de {letterData.destinataire}</p>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Formule d'appel */}
        <p className="mb-6 text-gray-900 text-lg">
          {letterData.destinataire || "Madame, Monsieur"},
        </p>

        {/* Contenu */}
        <EditableLetterContent
          content={letterData.contenuGenere}
          onContentChange={onContentChange}
          onRegenerateParagraph={onRegenerateParagraph}
          primaryColor={primaryColor}
          template="creative"
        />

        {/* Formule de politesse avec style */}
        <div className="mt-8">
          <p className="text-gray-900 mb-8">
            Je vous prie d'agréer, {letterData.destinataire || "Madame, Monsieur"}, l'expression de mes salutations distinguées.
          </p>
          <div 
            className="inline-block px-6 py-3 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            }}
          >
            <p className="font-bold text-white text-lg">
              {letterData.prenom} {letterData.nom}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


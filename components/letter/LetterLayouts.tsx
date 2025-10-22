"use client";

import React from "react";
import { EditableLetterContent } from "./EditableLetterContent";
import { OptionalSections } from "./OptionalSections";
import { Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";

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
      {/* Header simple - Aligné à gauche - AMÉLIORÉ */}
      <div className="mb-10">
        <h2 
          className="text-4xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: headingFont }}
        >
          {letterData.prenom} {letterData.nom}
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{letterData.adresse}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{letterData.telephone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{letterData.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur plus épais */}
      <div className="border-t-2 border-gray-400 my-8"></div>

      {/* Destinataire avec espacement amélioré */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <p className="font-bold text-gray-900 text-base">{letterData.entreprise}</p>
        </div>
        {letterData.destinataire && (
          <p className="text-gray-700 ml-6">À l'attention de {letterData.destinataire}</p>
        )}
        <div className="flex items-center gap-2 mt-6 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-500" />
          <p>
            {new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Objet avec séparation */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <p className="text-sm">
          <span className="font-bold uppercase tracking-wide text-gray-700">Objet :</span>{" "}
          <span className="text-gray-900">Candidature au poste de {letterData.posteVise}</span>
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
          {/* Nom en TRÈS grand avec couleur - AMÉLIORÉ */}
          <div className="mb-10">
            <h1 
              className="text-6xl font-black mb-4"
              style={{ 
                color: primaryColor,
                fontFamily: headingFont,
                lineHeight: "1.1",
              }}
            >
              {letterData.prenom} {letterData.nom}
            </h1>
            <p 
              className="text-xl font-medium mb-6"
              style={{ color: `${primaryColor}cc` }}
            >
              {letterData.posteVise}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{letterData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{letterData.telephone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{letterData.adresse}</span>
              </div>
            </div>
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

          {/* Objet stylisé avec timeline */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <span 
                className="font-bold uppercase tracking-wider text-xs"
                style={{ color: primaryColor }}
              >
                Objet de la candidature
              </span>
            </div>
            <p className="text-base font-medium text-gray-900 ml-4 pl-3">
              Candidature au poste de {letterData.posteVise}
            </p>
            <div 
              className="h-0.5 w-full mt-4"
              style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }}
            ></div>
          </div>

          {/* Formule d'appel */}
          <p className="mb-6 text-gray-900 font-medium">
            {letterData.destinataire || "Madame, Monsieur"},
          </p>

          {/* Sections optionnelles - DÉMONSTRATION */}
          <OptionalSections
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            skills={["Python & SQL", "Data Analysis", "Power BI", "Machine Learning", "Gestion de projet", "Communication"]}
            achievements={[
              { value: "+35%", label: "Performance" },
              { value: "5 projets", label: "Livrés" },
              { value: "100%", label: "Satisfaction" },
            ]}
            whyCompany={[
              "Leader de la transition énergétique en France",
              "Opportunités d'innovation et de développement de compétences",
              "Culture d'entreprise axée sur la responsabilité sociale",
            ]}
          />

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
        {/* Infos de contact - Style carte modernisé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="text-sm text-gray-900 truncate">{letterData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: secondaryColor }}
            >
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Téléphone</p>
              <p className="text-sm text-gray-900">{letterData.telephone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Adresse</p>
              <p className="text-sm text-gray-900 truncate">{letterData.adresse}</p>
            </div>
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


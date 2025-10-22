import React from "react";

interface ModernLetterTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  entreprise: string;
  destinataire?: string;
  posteVise: string;
  generatedContent: string;
  primaryColor?: string;
}

export function ModernLetterTemplate({
  prenom,
  nom,
  email,
  telephone,
  adresse,
  entreprise,
  destinataire,
  posteVise,
  generatedContent,
  primaryColor = "#3b82f6",
}: ModernLetterTemplateProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-[21cm] mx-auto bg-white shadow-lg" style={{ minHeight: "29.7cm" }}>
      {/* Bande de couleur en haut */}
      <div
        className="h-3"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="p-12 space-y-6">
        {/* En-tête avec nom en grand */}
        <div className="border-b-2 pb-4" style={{ borderColor: primaryColor }}>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            {prenom} {nom}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {email}
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {telephone}
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {adresse}
            </div>
          </div>
        </div>

        {/* Info destinataire en moderne */}
        <div className="flex justify-between items-start mt-8">
          <div className="text-sm">
            <p className="font-bold text-gray-900">{entreprise}</p>
            {destinataire && (
              <p className="text-gray-600">À l'attention de {destinataire}</p>
            )}
          </div>
          <div className="text-sm text-gray-600 text-right">
            <p>{today}</p>
          </div>
        </div>

        {/* Objet stylisé */}
        <div
          className="mt-8 p-4 rounded-lg border-l-4 bg-gray-50"
          style={{ borderColor: primaryColor }}
        >
          <p className="text-sm">
            <span className="font-semibold" style={{ color: primaryColor }}>
              Objet :
            </span>{" "}
            Candidature au poste de {posteVise}
          </p>
        </div>

        {/* Formule d'appel */}
        <div className="mt-8 text-sm font-medium">
          <p>{destinataire ? `${destinataire},` : "Madame, Monsieur,"}</p>
        </div>

        {/* Contenu de la lettre */}
        <div className="mt-6 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
          {generatedContent}
        </div>

        {/* Formule de politesse */}
        <div className="mt-8 text-sm space-y-4">
          <p>
            Je vous prie d'agréer, {destinataire ? destinataire : "Madame, Monsieur"}, l'expression de mes salutations distinguées.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <div
              className="w-1 h-16"
              style={{ backgroundColor: primaryColor }}
            />
            <p className="font-semibold text-gray-900">
              {prenom} {nom}
            </p>
          </div>
        </div>
      </div>

      {/* Bande de couleur en bas */}
      <div
        className="h-3 mt-auto"
        style={{ backgroundColor: primaryColor }}
      />
    </div>
  );
}


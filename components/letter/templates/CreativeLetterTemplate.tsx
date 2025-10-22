import React from "react";

interface CreativeLetterTemplateProps {
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
  accentColor?: string;
}

export function CreativeLetterTemplate({
  prenom,
  nom,
  email,
  telephone,
  adresse,
  entreprise,
  destinataire,
  posteVise,
  generatedContent,
  primaryColor = "#8b5cf6",
  accentColor = "#ec4899",
}: CreativeLetterTemplateProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-[21cm] mx-auto bg-white shadow-lg relative overflow-hidden" style={{ minHeight: "29.7cm" }}>
      {/* Décorations géométriques */}
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 opacity-10 rounded-full blur-3xl"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, ${primaryColor})`,
        }}
      />

      <div className="relative z-10 p-12 space-y-6">
        {/* En-tête créatif avec dégradé */}
        <div className="relative">
          <div
            className="absolute inset-0 h-full w-1 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${primaryColor}, ${accentColor})`,
            }}
          />
          <div className="pl-6">
            <h1
              className="text-4xl font-bold mb-1"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {prenom} {nom}
            </h1>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <span>{telephone}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span>{adresse}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur créatif */}
        <div className="flex items-center gap-2 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        {/* Destinataire et date */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg" style={{ color: primaryColor }}>
              {entreprise}
            </p>
            {destinataire && (
              <p className="text-sm text-gray-600 mt-1">
                À l'attention de {destinataire}
              </p>
            )}
          </div>
          <div className="text-sm text-gray-600 text-right">
            <p className="font-medium">{today}</p>
          </div>
        </div>

        {/* Objet créatif */}
        <div className="relative mt-8">
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${primaryColor}, ${accentColor})`,
            }}
          />
          <div className="pl-4 py-3">
            <p className="text-sm">
              <span className="font-bold" style={{ color: primaryColor }}>
                Objet :
              </span>{" "}
              <span className="text-gray-800">Candidature au poste de {posteVise}</span>
            </p>
          </div>
        </div>

        {/* Formule d'appel */}
        <div className="mt-8 text-sm font-semibold text-gray-900">
          <p>{destinataire ? `${destinataire},` : "Madame, Monsieur,"}</p>
        </div>

        {/* Contenu de la lettre avec style */}
        <div className="mt-6 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
          {generatedContent}
        </div>

        {/* Formule de politesse */}
        <div className="mt-8 text-sm space-y-6">
          <p className="text-gray-800">
            Je vous prie d'agréer, {destinataire ? destinataire : "Madame, Monsieur"}, l'expression de mes salutations distinguées.
          </p>
          
          {/* Signature créative */}
          <div className="mt-12 relative inline-block">
            <div
              className="absolute -left-6 top-0 bottom-0 w-1 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${accentColor})`,
              }}
            />
            <div className="pl-2">
              <p className="font-bold text-lg" style={{ color: primaryColor }}>
                {prenom} {nom}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page décoratif */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
        }}
      />
    </div>
  );
}


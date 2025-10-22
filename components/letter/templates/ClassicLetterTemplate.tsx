import React from "react";

interface ClassicLetterTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  entreprise: string;
  destinataire?: string;
  posteVise: string;
  generatedContent: string;
}

export function ClassicLetterTemplate({
  prenom,
  nom,
  email,
  telephone,
  adresse,
  entreprise,
  destinataire,
  posteVise,
  generatedContent,
}: ClassicLetterTemplateProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-[21cm] mx-auto bg-white shadow-lg" style={{ minHeight: "29.7cm" }}>
      <div className="p-12 space-y-6">
        {/* En-tête expéditeur */}
        <div className="text-sm space-y-1">
          <p className="font-semibold">
            {prenom} {nom}
          </p>
          <p>{adresse}</p>
          <p>{telephone}</p>
          <p>{email}</p>
        </div>

        {/* Destinataire */}
        <div className="text-sm space-y-1 mt-12">
          <p className="font-semibold">{entreprise}</p>
          {destinataire && <p>À l'attention de {destinataire}</p>}
        </div>

        {/* Lieu et date */}
        <div className="text-right text-sm mt-8">
          <p>{adresse.split(",")[adresse.split(",").length - 1]?.trim() || "Paris"}, le {today}</p>
        </div>

        {/* Objet */}
        <div className="mt-8 text-sm">
          <p>
            <span className="font-semibold">Objet :</span> Candidature au poste de {posteVise}
          </p>
        </div>

        {/* Formule d'appel */}
        <div className="mt-8 text-sm">
          <p>{destinataire ? `${destinataire},` : "Madame, Monsieur,"}</p>
        </div>

        {/* Contenu de la lettre */}
        <div className="mt-6 text-sm leading-relaxed whitespace-pre-wrap">
          {generatedContent}
        </div>

        {/* Formule de politesse */}
        <div className="mt-8 text-sm space-y-4">
          <p>
            Je vous prie d'agréer, {destinataire ? destinataire : "Madame, Monsieur"}, l'expression de mes salutations distinguées.
          </p>
          <p className="mt-12 text-right">
            {prenom} {nom}
          </p>
        </div>
      </div>
    </div>
  );
}


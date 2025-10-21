"use client";

import { useMemo } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { LetterFormData } from "@/types/letter";
import { Card } from "@/components/ui/card";

interface LetterPreviewLiveProps {
  data: Partial<LetterFormData>;
  generatedContent?: string;
  template?: string;
}

export function LetterPreviewLive({
  data,
  generatedContent,
  template = "standard",
}: LetterPreviewLiveProps) {
  const debouncedData = useDebounce(data, 300);

  const preview = useMemo(() => {
    return {
      prenom: debouncedData.prenom || "Votre Prénom",
      nom: debouncedData.nom || "Votre Nom",
      email: debouncedData.email || "email@exemple.com",
      telephone: debouncedData.telephone || "06 00 00 00 00",
      adresse: debouncedData.adresse || "Votre adresse complète",
      entreprise: debouncedData.entreprise || "Nom de l'Entreprise",
      destinataire: debouncedData.destinataire || "Madame, Monsieur",
      posteVise: debouncedData.posteVise || "Poste visé",
      motivations:
        debouncedData.motivations ||
        "Vos motivations pour ce poste apparaîtront ici...",
      atouts: debouncedData.atouts || "Vos atouts et compétences...",
      disponibilite: debouncedData.disponibilite || "Votre disponibilité",
    };
  }, [debouncedData]);

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const renderStandardTemplate = () => (
    <div className="w-full aspect-[1/1.414] bg-white shadow-lg overflow-hidden p-12 text-xs">
      {/* En-tête expéditeur */}
      <div className="mb-8">
        <p className="font-semibold">
          {preview.prenom} {preview.nom}
        </p>
        <p className="text-gray-600">{preview.adresse}</p>
        <p className="text-gray-600">{preview.telephone}</p>
        <p className="text-gray-600">{preview.email}</p>
      </div>

      {/* Destinataire */}
      <div className="mb-8">
        <p className="font-semibold">{preview.entreprise}</p>
        <p className="text-gray-600">À l'attention de {preview.destinataire}</p>
      </div>

      {/* Date et lieu */}
      <div className="mb-8 text-right">
        <p className="text-gray-600">{currentDate}</p>
      </div>

      {/* Objet */}
      <div className="mb-6">
        <p className="font-semibold">
          Objet : Candidature pour le poste de {preview.posteVise}
        </p>
      </div>

      {/* Formule d'appel */}
      <div className="mb-6">
        <p>{preview.destinataire},</p>
      </div>

      {/* Corps de la lettre */}
      <div className="space-y-4 text-justify leading-relaxed">
        {generatedContent ? (
          generatedContent.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-gray-800">
              {paragraph}
            </p>
          ))
        ) : (
          <>
            <p className="text-gray-700">
              Passionné(e) par {preview.motivations}
            </p>
            <p className="text-gray-700">
              Fort(e) de mes compétences en {preview.atouts}, je suis convaincu(e)
              de pouvoir contribuer efficacement à votre équipe.
            </p>
            <p className="text-gray-700">
              Je suis disponible {preview.disponibilite} et reste à votre
              disposition pour un entretien.
            </p>
          </>
        )}
      </div>

      {/* Formule de politesse */}
      <div className="mt-8">
        <p className="text-gray-800">
          Dans l'attente de votre retour, je vous prie d'agréer, {preview.destinataire},
          l'expression de mes salutations distinguées.
        </p>
      </div>

      {/* Signature */}
      <div className="mt-8 text-right">
        <p className="font-semibold">
          {preview.prenom} {preview.nom}
        </p>
      </div>
    </div>
  );

  const renderProfessionalTemplate = () => (
    <div className="w-full aspect-[1/1.414] bg-white shadow-lg overflow-hidden text-xs">
      {/* Bande supérieure */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-1">
          {preview.prenom} {preview.nom}
        </h1>
        <div className="flex gap-4 text-xs opacity-90">
          <span>{preview.telephone}</span>
          <span>•</span>
          <span>{preview.email}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-12">
        {/* Destinataire */}
        <div className="mb-8">
          <p className="font-bold text-purple-800">{preview.entreprise}</p>
          <p className="text-gray-600">À l'attention de {preview.destinataire}</p>
          <p className="text-gray-500 text-right mt-2">{currentDate}</p>
        </div>

        {/* Objet encadré */}
        <div className="mb-8 p-4 bg-purple-50 border-l-4 border-purple-700">
          <p className="font-semibold text-purple-900">
            Objet : Candidature - {preview.posteVise}
          </p>
        </div>

        {/* Formule d'appel */}
        <div className="mb-6">
          <p className="font-semibold">{preview.destinataire},</p>
        </div>

        {/* Corps */}
        <div className="space-y-4 text-justify leading-relaxed">
          {generatedContent ? (
            generatedContent.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-gray-800">
                {paragraph}
              </p>
            ))
          ) : (
            <>
              <p className="text-gray-700">{preview.motivations}</p>
              <p className="text-gray-700">{preview.atouts}</p>
              <p className="text-gray-700">
                Je suis disponible {preview.disponibilite}.
              </p>
            </>
          )}
        </div>

        {/* Formule de politesse */}
        <div className="mt-8">
          <p className="text-gray-800">
            Je vous prie d'agréer, {preview.destinataire}, mes salutations les
            plus respectueuses.
          </p>
        </div>

        {/* Signature avec ligne */}
        <div className="mt-10 pt-6 border-t-2 border-purple-700 text-right">
          <p className="font-bold text-purple-900">
            {preview.prenom} {preview.nom}
          </p>
        </div>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="w-full aspect-[1/1.414] bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg overflow-hidden text-xs">
      <div className="h-full p-10">
        {/* En-tête créatif */}
        <div className="relative mb-10">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-rose-500 opacity-10 rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-2">
              {preview.prenom} {preview.nom}
            </h1>
            <div className="flex gap-3 text-[10px] text-gray-600">
              <span>{preview.email}</span>
              <span>{preview.telephone}</span>
            </div>
          </div>
        </div>

        {/* Informations destinataire dans une carte */}
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-pink-800">{preview.entreprise}</p>
              <p className="text-gray-600 text-[10px]">{preview.destinataire}</p>
            </div>
            <p className="text-gray-500 text-[10px]">{currentDate}</p>
          </div>
        </div>

        {/* Objet stylisé */}
        <div className="mb-6 p-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg">
          <p className="text-[10px] font-semibold">
            Candidature : {preview.posteVise}
          </p>
        </div>

        {/* Corps de la lettre */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow">
          <p className="mb-4 font-semibold text-pink-800">
            {preview.destinataire},
          </p>

          <div className="space-y-3 text-justify leading-relaxed">
            {generatedContent ? (
              generatedContent.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-gray-800 text-[10px]">
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="text-gray-700 text-[10px]">{preview.motivations}</p>
                <p className="text-gray-700 text-[10px]">{preview.atouts}</p>
                <p className="text-gray-700 text-[10px]">
                  Disponible {preview.disponibilite}.
                </p>
              </>
            )}
          </div>

          <p className="mt-6 text-gray-800 text-[10px]">
            Cordialement,
          </p>

          <div className="mt-6 flex justify-end">
            <div className="text-right">
              <p className="font-bold text-pink-800">
                {preview.prenom} {preview.nom}
              </p>
              <div className="mt-1 h-0.5 w-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case "professional":
        return renderProfessionalTemplate();
      case "creative":
        return renderCreativeTemplate();
      case "standard":
      default:
        return renderStandardTemplate();
    }
  };

  return (
    <Card className="bg-gray-100 p-4 rounded-lg shadow-inner">
      <div className="max-w-full overflow-auto">{renderTemplate()}</div>
    </Card>
  );
}


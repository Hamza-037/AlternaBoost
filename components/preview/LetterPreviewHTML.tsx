"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { GeneratedLetter } from "@/types/letter";

interface LetterPreviewHTMLProps {
  data: GeneratedLetter;
  isEditing: boolean;
  onUpdate: (field: keyof GeneratedLetter, value: string) => void;
}

export function LetterPreviewHTML({
  data,
  isEditing,
  onUpdate,
}: LetterPreviewHTMLProps) {
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Extraire la ville depuis l'adresse (avant la première virgule)
  const ville = data.adresse.split(",")[0];

  return (
    <Card className="max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Feuille A4 simulée */}
      <div className="p-12 md:p-16" style={{ minHeight: "1056px" }}>
        {/* En-tête : Expéditeur */}
        <div className="mb-8 text-sm leading-relaxed">
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
              <p className="font-semibold">{`${data.prenom} ${data.nom}`}</p>
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
              <p className="font-semibold">{data.entreprise}</p>
              {data.destinataire && <p>À l&apos;attention de {data.destinataire}</p>}
              <p>Service Recrutement</p>
            </>
          )}
        </div>

        {/* Objet */}
        <div className="mb-8">
          {isEditing ? (
            <Input
              value={`Objet : Candidature au poste de ${data.posteVise}`}
              onChange={(e) => {
                const match = e.target.value.match(/Objet : Candidature au poste de (.+)/);
                if (match) {
                  onUpdate("posteVise", match[1]);
                }
              }}
              className="font-semibold"
            />
          ) : (
            <p className="font-semibold text-sm">
              Objet : Candidature au poste de {data.posteVise}
            </p>
          )}
        </div>

        {/* Corps de la lettre */}
        <div className="mb-8 space-y-6 text-sm leading-relaxed text-justify">
          <p>Madame, Monsieur{data.destinataire ? ` ${data.destinataire.split(" ").pop()}` : ""},</p>

          {isEditing ? (
            <Textarea
              value={data.contenuGenere}
              onChange={(e) => onUpdate("contenuGenere", e.target.value)}
              className="min-h-[300px] font-serif leading-relaxed"
            />
          ) : (
            <>
              {data.contenuGenere.split("\n\n").map((paragraph, index) => (
                <p key={index} className="indent-8">
                  {paragraph}
                </p>
              ))}
            </>
          )}

          <p className="indent-8">
            Dans l&apos;attente de votre retour, je vous prie d&apos;agréer, Madame,
            Monsieur{data.destinataire ? ` ${data.destinataire.split(" ").pop()}` : ""}, l&apos;expression de mes
            salutations distinguées.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-12 text-sm">
          <p className="font-semibold">
            {data.prenom} {data.nom}
          </p>
        </div>
      </div>
    </Card>
  );
}


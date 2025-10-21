"use client";

import { useMemo } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { CVFormValues } from "@/lib/validations/cv-schema";
import { Card } from "@/components/ui/card";

interface CVPreviewLiveProps {
  data: Partial<CVFormValues>;
  template?: string;
}

export function CVPreviewLive({ data, template = "modern" }: CVPreviewLiveProps) {
  // Débouncer les données pour éviter trop de re-renders
  const debouncedData = useDebounce(data, 300);

  // Placeholder pour les champs vides
  const preview = useMemo(() => {
    return {
      nom: debouncedData.nom || "Votre Nom",
      prenom: debouncedData.prenom || "Votre Prénom",
      email: debouncedData.email || "email@exemple.com",
      telephone: debouncedData.telephone || "06 00 00 00 00",
      formation: debouncedData.formation || "Votre Formation",
      ecole: debouncedData.ecole || "Votre École",
      anneeFormation: debouncedData.anneeFormation || "2024",
      experiences: debouncedData.experiences && debouncedData.experiences.length > 0
        ? debouncedData.experiences
        : [
            {
              poste: "Votre Poste",
              entreprise: "Entreprise",
              periode: "Période",
              description: "Description de votre expérience professionnelle...",
            },
          ],
      competences: debouncedData.competences || "Compétences à lister ici",
      objectif: debouncedData.objectif || "Votre objectif professionnel...",
      entrepriseCiblee: debouncedData.entrepriseCiblee || "Entreprise Ciblée",
    };
  }, [debouncedData]);

  // Templates de rendu
  const renderModernTemplate = () => (
    <div className="w-full aspect-[1/1.414] bg-white shadow-lg overflow-hidden text-xs">
      <div className="flex h-full">
        {/* Sidebar gauche */}
        <div className="w-[35%] bg-gradient-to-b from-teal-700 to-teal-900 text-white p-6">
          {/* Photo placeholder */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-4xl">
              {preview.prenom[0]}
              {preview.nom[0]}
            </span>
          </div>

          {/* Nom */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold uppercase">
              {preview.prenom} {preview.nom}
            </h2>
            <p className="text-xs text-teal-200 mt-1">{preview.formation}</p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 pb-2 border-b border-teal-500 uppercase">
              Contact
            </h3>
            <div className="space-y-2 text-xs">
              <p className="break-words">{preview.email}</p>
              <p>{preview.telephone}</p>
            </div>
          </div>

          {/* Compétences */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 pb-2 border-b border-teal-500 uppercase">
              Compétences
            </h3>
            <div className="space-y-1 text-xs text-teal-100">
              {preview.competences.split(",").slice(0, 6).map((comp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-teal-300">•</span>
                  <span className="flex-1">{comp.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="w-[65%] p-6 overflow-hidden">
          {/* En-tête */}
          <div className="mb-6 pb-4 border-b-2 border-teal-700">
            <h1 className="text-2xl font-bold text-teal-800 uppercase">
              {preview.prenom} {preview.nom}
            </h1>
            <p className="text-sm text-teal-600 font-semibold">
              {preview.formation}
            </p>
          </div>

          {/* Objectif */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-teal-800 mb-2 pb-1 border-b-2 border-teal-400 uppercase">
              Profil Professionnel
            </h3>
            <p className="text-[10px] text-gray-700 leading-relaxed">
              {preview.objectif}
            </p>
          </div>

          {/* Expériences */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-teal-800 mb-2 pb-1 border-b-2 border-teal-400 uppercase">
              Expérience
            </h3>
            <div className="space-y-3">
              {preview.experiences.map((exp, i) => (
                <div key={i} className="text-[10px]">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-teal-700">{exp.poste}</h4>
                    <span className="text-teal-600 text-[9px] font-semibold">
                      {exp.periode}
                    </span>
                  </div>
                  <p className="text-gray-600 italic mb-1">{exp.entreprise}</p>
                  <p className="text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formation */}
          <div>
            <h3 className="text-sm font-bold text-teal-800 mb-2 pb-1 border-b-2 border-teal-400 uppercase">
              Formation
            </h3>
            <div className="text-[10px]">
              <h4 className="font-bold text-teal-700">{preview.formation}</h4>
              <p className="text-gray-600">
                {preview.ecole} • {preview.anneeFormation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPremiumTemplate = () => (
    <div className="w-full aspect-[1/1.414] bg-white shadow-lg overflow-hidden text-xs">
      <div className="h-full flex flex-col">
        {/* En-tête élégant */}
        <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {preview.prenom} {preview.nom}
          </h1>
          <p className="text-lg opacity-90">{preview.formation}</p>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <span>{preview.email}</span>
            <span>{preview.telephone}</span>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 p-8 overflow-hidden">
          {/* Objectif */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-6 bg-purple-600"></div>
              Objectif Professionnel
            </h3>
            <p className="text-[11px] text-gray-700 leading-relaxed pl-4">
              {preview.objectif}
            </p>
          </div>

          {/* Expériences */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-6 bg-purple-600"></div>
              Expérience Professionnelle
            </h3>
            <div className="space-y-4 pl-4">
              {preview.experiences.map((exp, i) => (
                <div key={i} className="border-l-2 border-purple-200 pl-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-bold text-purple-700">{exp.poste}</h4>
                    <span className="text-purple-600 text-[10px]">
                      {exp.periode}
                    </span>
                  </div>
                  <p className="text-gray-600 italic text-[10px] mb-1">
                    {exp.entreprise}
                  </p>
                  <p className="text-[10px] text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formation et Compétences côte à côte */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600"></div>
                Formation
              </h3>
              <div className="pl-4 text-[10px]">
                <h4 className="font-bold text-purple-700">{preview.formation}</h4>
                <p className="text-gray-600">{preview.ecole}</p>
                <p className="text-gray-500">{preview.anneeFormation}</p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-purple-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600"></div>
                Compétences
              </h3>
              <div className="pl-4 text-[10px] space-y-1">
                {preview.competences.split(",").slice(0, 5).map((comp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                    <span>{comp.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="w-full aspect-[1/1.414] bg-gradient-to-br from-orange-50 to-red-50 shadow-lg overflow-hidden text-xs">
      <div className="h-full p-8">
        {/* En-tête créatif avec forme géométrique */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 opacity-20 rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
              {preview.prenom}
              <br />
              {preview.nom}
            </h1>
            <p className="text-base font-bold text-orange-700">
              {preview.formation}
            </p>
          </div>
        </div>

        {/* Grid asymétrique */}
        <div className="grid grid-cols-3 gap-6">
          {/* Colonne 1 */}
          <div className="space-y-4">
            {/* Contact */}
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow">
              <h3 className="text-xs font-bold text-orange-800 mb-2 uppercase">
                Contact
              </h3>
              <div className="space-y-1 text-[9px]">
                <p className="break-words">{preview.email}</p>
                <p>{preview.telephone}</p>
              </div>
            </div>

            {/* Compétences */}
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow">
              <h3 className="text-xs font-bold text-orange-800 mb-2 uppercase">
                Compétences
              </h3>
              <div className="space-y-1 text-[9px]">
                {preview.competences.split(",").slice(0, 4).map((comp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-sm"></div>
                    <span>{comp.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonnes 2 et 3 : Contenu principal */}
          <div className="col-span-2 space-y-4">
            {/* Objectif */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xs font-bold mb-2 uppercase">
                Profil Créatif
              </h3>
              <p className="text-[10px] leading-relaxed">{preview.objectif}</p>
            </div>

            {/* Expériences */}
            <div className="space-y-3">
              {preview.experiences.slice(0, 2).map((exp, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-orange-700">
                      {exp.poste}
                    </h4>
                    <span className="text-[9px] text-red-600 font-semibold">
                      {exp.periode}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-600 italic mb-1">
                    {exp.entreprise}
                  </p>
                  <p className="text-[9px] text-gray-700 line-clamp-2">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Formation */}
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow">
              <h3 className="text-xs font-bold text-orange-800 mb-2">
                {preview.formation}
              </h3>
              <p className="text-[9px] text-gray-600">
                {preview.ecole} • {preview.anneeFormation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="w-full aspect-[1/1.414] bg-white shadow-lg overflow-hidden text-xs">
      <div className="h-full p-12">
        {/* En-tête minimaliste */}
        <div className="text-center mb-10 pb-6 border-b border-gray-300">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-2">
            {preview.prenom} {preview.nom}
          </h1>
          <p className="text-sm text-gray-600 uppercase tracking-wider">
            {preview.formation}
          </p>
          <div className="mt-3 flex justify-center gap-4 text-[10px] text-gray-500">
            <span>{preview.email}</span>
            <span>•</span>
            <span>{preview.telephone}</span>
          </div>
        </div>

        {/* Objectif */}
        <div className="mb-8">
          <p className="text-[11px] text-gray-700 leading-relaxed text-center italic">
            {preview.objectif}
          </p>
        </div>

        {/* Expériences */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 text-center">
            Expérience Professionnelle
          </h3>
          <div className="space-y-6">
            {preview.experiences.map((exp, i) => (
              <div key={i} className="text-center">
                <h4 className="font-semibold text-gray-900">{exp.poste}</h4>
                <p className="text-[10px] text-gray-600 mb-1">
                  {exp.entreprise} • {exp.periode}
                </p>
                <p className="text-[10px] text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Formation et Compétences */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-300">
          <div className="text-center">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Formation
            </h3>
            <div className="text-[10px]">
              <p className="font-medium text-gray-900">{preview.formation}</p>
              <p className="text-gray-600">{preview.ecole}</p>
              <p className="text-gray-500">{preview.anneeFormation}</p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Compétences Clés
            </h3>
            <div className="text-[10px] text-gray-700">
              {preview.competences.split(",").slice(0, 4).map((comp, i) => (
                <p key={i}>{comp.trim()}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sélection du template
  const renderTemplate = () => {
    switch (template) {
      case "premium":
        return renderPremiumTemplate();
      case "creative":
        return renderCreativeTemplate();
      case "minimal":
        return renderMinimalTemplate();
      case "modern":
      default:
        return renderModernTemplate();
    }
  };

  return (
    <Card className="bg-gray-100 p-4 rounded-lg shadow-inner">
      <div className="max-w-full overflow-auto">
        {renderTemplate()}
      </div>
    </Card>
  );
}


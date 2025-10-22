"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface CVImagePreviewProps {
  cvName: string;
  template: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Composant pour afficher une vignette visuelle d'un CV
 * Utilise des images statiques générées ou des placeholders
 */
export default function CVImagePreview({ cvName, template, onClick, className = "" }: CVImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Générer le chemin de l'image basé sur le template
  // Pour le moment, on utilise des placeholders, mais vous pourrez ajouter de vraies images
  const getImagePath = () => {
    // Format: /cv-previews/[template]-[index].png
    // Fallback sur placeholder si l'image n'existe pas
    return `/cv-previews/${template.toLowerCase()}-preview.png`;
  };

  // Placeholder SVG moderne en attendant le chargement
  const PlaceholderSVG = () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Pattern de grille */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Icône document */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <svg
          className="w-20 h-20 text-blue-400 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">{template}</p>
          <p className="text-xs text-gray-500 mt-1">Prévisualisation CV</p>
        </div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 left-4 w-20 h-20 bg-purple-200/30 rounded-full blur-xl"></div>
    </div>
  );

  if (hasError) {
    return (
      <div className={`relative aspect-[210/297] cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all ${className}`} onClick={onClick}>
        <PlaceholderSVG />
      </div>
    );
  }

  return (
    <div className={`relative aspect-[210/297] cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all group ${className}`} onClick={onClick}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <PlaceholderSVG />
        </div>
      )}
      
      <Image
        src={getImagePath()}
        alt={`Aperçu CV ${cvName} - Template ${template}`}
        fill
        className={`object-cover object-top transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-105`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Overlay au survol */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-semibold">Cliquez pour voir</span>
          </div>
        </div>
      </div>
    </div>
  );
}


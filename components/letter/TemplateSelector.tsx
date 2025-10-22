"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: "classic" | "modern" | "creative";
  onTemplateChange: (template: "classic" | "modern" | "creative") => void;
}

const templates = [
  {
    id: "classic" as const,
    name: "Classique",
    description: "Style professionnel et traditionnel",
    icon: "📋",
    color: "from-gray-500 to-gray-600",
    preview: "/letter-previews/classic.png",
    bestFor: "Secteurs traditionnels, banque, juridique",
  },
  {
    id: "modern" as const,
    name: "Moderne",
    description: "Design épuré et contemporain",
    icon: "✨",
    color: "from-blue-500 to-indigo-600",
    preview: "/letter-previews/modern.png",
    bestFor: "Tech, startups, marketing",
  },
  {
    id: "creative" as const,
    name: "Créatif",
    description: "Style audacieux avec dégradés",
    icon: "🎨",
    color: "from-purple-500 to-pink-600",
    preview: "/letter-previews/creative.png",
    bestFor: "Design, communication, métiers créatifs",
  },
];

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Template de lettre</h3>
        <p className="text-sm text-gray-600">
          Choisissez le style qui correspond le mieux à votre secteur
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id
                ? "ring-2 ring-purple-600 shadow-lg"
                : "hover:border-purple-300"
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icône et badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-2xl shadow-md`}
                  >
                    {template.icon}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    {selectedTemplate === template.id && (
                      <div className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        Sélectionné
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{template.bestFor}</span>
                  </div>
                </div>

                {/* Indicateur sélectionné */}
                {selectedTemplate === template.id && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info complémentaire */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800 flex items-start gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Le template influence la mise en page et les couleurs. Vous pourrez personnaliser davantage avec les options ci-dessous.
          </span>
        </p>
      </div>
    </div>
  );
}

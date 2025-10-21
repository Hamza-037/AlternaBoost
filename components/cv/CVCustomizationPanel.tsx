"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Palette, Type, Image as ImageIcon, Maximize2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CVCustomizationPanelProps {
  customization: {
    primaryColor: string;
    fontFamily: string;
    fontSize: number;
    photoSize: number;
    spacing: number;
  };
  onUpdate: (customization: any) => void;
}

const FONT_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter (Moderne)" },
  { value: "Roboto, sans-serif", label: "Roboto (Classique)" },
  { value: "Montserrat, sans-serif", label: "Montserrat (Élégant)" },
  { value: "Open Sans, sans-serif", label: "Open Sans (Neutre)" },
  { value: "Poppins, sans-serif", label: "Poppins (Moderne)" },
  { value: "Lato, sans-serif", label: "Lato (Pro)" },
  { value: "Raleway, sans-serif", label: "Raleway (Fin)" },
  { value: "Playfair Display, serif", label: "Playfair (Serif)" },
  { value: "Georgia, serif", label: "Georgia (Classique)" },
];

const PRESET_COLORS = [
  { name: "Cyan", value: "#06B6D4" },
  { name: "Bleu", value: "#3B82F6" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Rose", value: "#EC4899" },
  { name: "Vert", value: "#10B981" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Rouge", value: "#EF4444" },
  { name: "Indigo", value: "#6366F1" },
];

export function CVCustomizationPanel({ customization, onUpdate }: CVCustomizationPanelProps) {
  const handleColorChange = (color: string) => {
    onUpdate({ ...customization, primaryColor: color });
  };

  const handleFontChange = (font: string) => {
    onUpdate({ ...customization, fontFamily: font });
  };

  const handleFontSizeChange = (value: number[]) => {
    onUpdate({ ...customization, fontSize: value[0] });
  };

  const handlePhotoSizeChange = (value: number[]) => {
    onUpdate({ ...customization, photoSize: value[0] });
  };

  const handleSpacingChange = (value: number[]) => {
    onUpdate({ ...customization, spacing: value[0] });
  };

  return (
    <div className="space-y-6">
      {/* Couleur Primaire */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-blue-600" />
          <Label className="text-sm font-semibold text-gray-700">Couleur Primaire</Label>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className={`h-10 rounded-lg border-2 transition-all ${
                customization.primaryColor === color.value
                  ? "border-gray-800 scale-105"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={customization.primaryColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={customization.primaryColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1 font-mono text-sm bg-white border-gray-300"
            placeholder="#06B6D4"
          />
        </div>
      </div>

      <Separator />

      {/* Police */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-blue-600" />
          <Label className="text-sm font-semibold text-gray-700">Police</Label>
        </div>
        
        <select
          value={customization.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500"
          style={{ fontFamily: customization.fontFamily }}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <Separator />

      {/* Taille de texte */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-semibold text-gray-700">Taille du texte</Label>
          </div>
          <span className="text-sm font-bold text-blue-600">{customization.fontSize}%</span>
        </div>
        
        <Slider
          value={[customization.fontSize]}
          onValueChange={handleFontSizeChange}
          min={80}
          max={120}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Petit</span>
          <span>Normal</span>
          <span>Grand</span>
        </div>
      </div>

      <Separator />

      {/* Taille de photo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-semibold text-gray-700">Taille de la photo</Label>
          </div>
          <span className="text-sm font-bold text-blue-600">{customization.photoSize}%</span>
        </div>
        
        <Slider
          value={[customization.photoSize]}
          onValueChange={handlePhotoSizeChange}
          min={80}
          max={150}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Petite</span>
          <span>Moyenne</span>
          <span>Grande</span>
        </div>
      </div>

      <Separator />

      {/* Espacement */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-semibold text-gray-700">Espacement</Label>
          </div>
          <span className="text-sm font-bold text-blue-600">{customization.spacing}%</span>
        </div>
        
        <Slider
          value={[customization.spacing]}
          onValueChange={handleSpacingChange}
          min={80}
          max={120}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Compact</span>
          <span>Normal</span>
          <span>Aéré</span>
        </div>
      </div>

      {/* Preview des changements */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p 
          className="text-sm font-medium mb-2"
          style={{ 
            fontFamily: customization.fontFamily,
            fontSize: `${customization.fontSize}%`,
            color: customization.primaryColor
          }}
        >
          Aperçu du style
        </p>
        <p 
          className="text-xs text-gray-600"
          style={{ 
            fontFamily: customization.fontFamily,
            fontSize: `${customization.fontSize * 0.8}%`
          }}
        >
          Votre CV utilisera ces paramètres de personnalisation pour un rendu unique et professionnel.
        </p>
      </div>
    </div>
  );
}


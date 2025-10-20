"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Type, 
  Layout, 
  Settings, 
  PlusCircle, 
  Trash2, 
  Eye,
  EyeOff,
  FileText,
  PenTool,
  Sparkles
} from "lucide-react";

import type { LetterStyle, LetterSection } from "@/types/letter";

interface LetterCustomizerProps {
  style: LetterStyle;
  sections: LetterSection[];
  onStyleChange: (newStyle: LetterStyle) => void;
  onSectionsChange: (newSections: LetterSection[]) => void;
}

export function LetterCustomizer({
  style,
  sections,
  onStyleChange,
  onSectionsChange,
}: LetterCustomizerProps) {
  
  // Gestion des templates
  const templates = [
    {
      id: "classic",
      name: "Classique",
      description: "Style professionnel traditionnel",
      preview: "📄",
      color: "bg-gray-100 text-gray-800"
    },
    {
      id: "modern", 
      name: "Moderne",
      description: "Design épuré et contemporain",
      preview: "✨",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "creative",
      name: "Créatif",
      description: "Style audacieux et original",
      preview: "🎨",
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Épuré et élégant",
      preview: "📝",
      color: "bg-green-100 text-green-800"
    }
  ];

  // Thèmes de couleurs prédéfinis
  const colorThemes = [
    { name: "Bleu", primary: "#2563EB", secondary: "#3B82F6", accent: "#60A5FA" },
    { name: "Violet", primary: "#7C3AED", secondary: "#8B5CF6", accent: "#A78BFA" },
    { name: "Vert", primary: "#059669", secondary: "#10B981", accent: "#34D399" },
    { name: "Rose", primary: "#DB2777", secondary: "#EC4899", accent: "#F472B6" },
    { name: "Orange", primary: "#EA580C", secondary: "#F97316", accent: "#FB923C" }
  ];

  // Gestion des couleurs
  const handleColorChange = (colorType: keyof LetterStyle['colorScheme'], value: string) => {
    onStyleChange({
      ...style,
      colorScheme: {
        ...style.colorScheme,
        [colorType]: value,
      },
    });
  };

  // Gestion des sections
  const addSection = (type: LetterSection['type']) => {
    const newSection: LetterSection = {
      id: `section_${Date.now()}`,
      type,
      titre: type === "signature" ? "Signature" : 
             type === "postscript" ? "P.S." :
             type === "attachment" ? "Pièces jointes" : "Section personnalisée",
      contenu: "",
      visible: true,
    };
    onSectionsChange([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    onSectionsChange(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, field: keyof LetterSection, value: string | boolean) => {
    onSectionsChange(
      sections.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  return (
    <Card className="p-6 shadow-lg border-2 border-purple-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Settings className="text-purple-600" size={20} />
        Personnalisation de la Lettre
      </h3>

      <Tabs defaultValue="style" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Layout size={16} />
            Style
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette size={16} />
            Couleurs
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type size={16} />
            Typo
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <FileText size={16} />
            Sections
          </TabsTrigger>
        </TabsList>

        {/* Onglet Style */}
        <TabsContent value="style" className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Template de lettre
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onStyleChange({ ...style, template: template.id as any })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    style.template === template.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{template.preview}</div>
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Espacement
            </Label>
            <Select
              value={style.layout.spacing}
              onValueChange={(value) => 
                onStyleChange({
                  ...style,
                  layout: { ...style.layout, spacing: value as any }
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="spacious">Spacieux</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Afficher les icônes
              </Label>
              <Switch
                checked={style.layout.showIcons}
                onCheckedChange={(checked) =>
                  onStyleChange({
                    ...style,
                    layout: { ...style.layout, showIcons: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Afficher les bordures
              </Label>
              <Switch
                checked={style.layout.showBorders}
                onCheckedChange={(checked) =>
                  onStyleChange({
                    ...style,
                    layout: { ...style.layout, showBorders: checked }
                  })
                }
              />
            </div>
          </div>
        </TabsContent>

        {/* Onglet Couleurs */}
        <TabsContent value="colors" className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Thèmes prédéfinis
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    onStyleChange({
                      ...style,
                      colorScheme: {
                        ...style.colorScheme,
                        primary: theme.primary,
                        secondary: theme.secondary,
                        accent: theme.accent,
                      },
                    });
                  }}
                  className="p-2 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex gap-1 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  <div className="text-xs font-medium">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Couleur principale
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.colorScheme.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300"
                />
                <Input
                  value={style.colorScheme.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Couleur secondaire
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.colorScheme.secondary}
                  onChange={(e) => handleColorChange("secondary", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300"
                />
                <Input
                  value={style.colorScheme.secondary}
                  onChange={(e) => handleColorChange("secondary", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Couleur d'accent
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.colorScheme.accent}
                  onChange={(e) => handleColorChange("accent", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300"
                />
                <Input
                  value={style.colorScheme.accent}
                  onChange={(e) => handleColorChange("accent", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Typographie */}
        <TabsContent value="typography" className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Police des titres
            </Label>
            <Select
              value={style.typography.headingFont}
              onValueChange={(value) =>
                onStyleChange({
                  ...style,
                  typography: { ...style.typography, headingFont: value as any }
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Police du texte
            </Label>
            <Select
              value={style.typography.bodyFont}
              onValueChange={(value) =>
                onStyleChange({
                  ...style,
                  typography: { ...style.typography, bodyFont: value as any }
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* Onglet Sections */}
        <TabsContent value="sections" className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Sections existantes
            </Label>
            {sections.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucune section personnalisée</p>
            ) : (
              <div className="space-y-2">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => updateSection(section.id, "visible", !section.visible)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <span className="flex-1 text-sm font-medium">{section.titre}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Ajouter une section
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("signature")}
                className="flex items-center gap-2"
              >
                <PenTool size={16} />
                Signature
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("postscript")}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                P.S.
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("attachment")}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                Pièces jointes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("custom")}
                className="flex items-center gap-2"
              >
                <Sparkles size={16} />
                Personnalisée
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bouton de réinitialisation */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onStyleChange({
              template: "classic",
              colorScheme: {
                primary: "#2563EB",
                secondary: "#3B82F6",
                accent: "#60A5FA",
                text: "#111827",
                background: "#FFFFFF",
              },
              typography: {
                headingFont: "Inter",
                bodyFont: "Inter",
              },
              layout: {
                spacing: "normal",
                showIcons: false,
                showBorders: false,
              },
            });
            onSectionsChange([]);
          }}
          className="w-full"
        >
          Réinitialiser le style
        </Button>
      </div>
    </Card>
  );
}

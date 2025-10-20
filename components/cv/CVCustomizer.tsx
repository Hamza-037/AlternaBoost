"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { CVStyle, CVSection } from "@/types/cv";
import {
  Palette,
  Layout,
  Type,
  Plus,
  Settings,
  Sparkles,
  Globe,
  Award,
  Briefcase,
  Heart,
  ChevronDown,
} from "lucide-react";

interface CVCustomizerProps {
  style: CVStyle;
  sections: CVSection[];
  onStyleChange: (style: CVStyle) => void;
  onSectionsChange: (sections: CVSection[]) => void;
}

const PRESET_COLORS = {
  bleu: { primary: "#2563EB", secondary: "#3B82F6", accent: "#60A5FA" },
  vert: { primary: "#059669", secondary: "#10B981", accent: "#34D399" },
  violet: { primary: "#7C3AED", secondary: "#8B5CF6", accent: "#A78BFA" },
  rose: { primary: "#DB2777", secondary: "#EC4899", accent: "#F472B6" },
  orange: { primary: "#EA580C", secondary: "#F97316", accent: "#FB923C" },
};

const TEMPLATES = [
  {
    id: "modern",
    name: "Moderne",
    description: "Sidebar colorée avec photo",
    preview: "🎨",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Classique et sobre",
    preview: "💼",
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Design original et audacieux",
    preview: "✨",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Épuré et élégant",
    preview: "📄",
  },
];

const SECTION_TYPES = [
  { type: "langues", titre: "Langues", icon: "Globe" },
  { type: "certifications", titre: "Certifications", icon: "Award" },
  { type: "projets", titre: "Projets", icon: "Briefcase" },
  { type: "interets", titre: "Centres d'intérêt", icon: "Heart" },
  { type: "custom", titre: "Section personnalisée", icon: "Plus" },
];

export function CVCustomizer({
  style,
  sections,
  onStyleChange,
  onSectionsChange,
}: CVCustomizerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTemplateChange = (template: string) => {
    onStyleChange({
      ...style,
      template: template as CVStyle["template"],
    });
  };

  const handleColorPresetChange = (presetName: string) => {
    const preset = PRESET_COLORS[presetName as keyof typeof PRESET_COLORS];
    if (preset) {
      onStyleChange({
        ...style,
        colorScheme: {
          ...style.colorScheme,
          ...preset,
        },
      });
    }
  };

  const handleColorChange = (key: keyof CVStyle["colorScheme"], value: string) => {
    onStyleChange({
      ...style,
      colorScheme: {
        ...style.colorScheme,
        [key]: value,
      },
    });
  };

  const addSection = (type: CVSection["type"]) => {
    const sectionType = SECTION_TYPES.find((s) => s.type === type);
    const newSection: CVSection = {
      id: `section-${Date.now()}`,
      type,
      titre: sectionType?.titre || "Nouvelle section",
      contenu: type === "langues" ? ["Français - Natif", "Anglais - Courant"] : "",
      icon: sectionType?.icon,
      visible: true,
    };
    onSectionsChange([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    onSectionsChange(sections.filter((s) => s.id !== id));
  };

  const toggleSectionVisibility = (id: string) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    );
  };

  return (
    <Card className="sticky top-4 shadow-xl border-2 border-blue-100">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Personnalisation avancée
          </CardTitle>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="template" className="text-xs">
                <Layout className="w-4 h-4 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="colors" className="text-xs">
                <Palette className="w-4 h-4 mr-1" />
                Couleurs
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs">
                <Type className="w-4 h-4 mr-1" />
                Typo
              </TabsTrigger>
              <TabsTrigger value="sections" className="text-xs">
                <Plus className="w-4 h-4 mr-1" />
                Sections
              </TabsTrigger>
            </TabsList>

            {/* TAB TEMPLATES */}
            <TabsContent value="template" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                      style.template === template.id
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-3xl mb-2">{template.preview}</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>

              <Separator />

              {/* Espacement */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Espacement</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["compact", "normal", "spacious"] as const).map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() =>
                        onStyleChange({
                          ...style,
                          layout: { ...style.layout, spacing },
                        })
                      }
                      className={`px-3 py-2 text-xs rounded border-2 transition-all ${
                        style.layout.spacing === spacing
                          ? "border-blue-600 bg-blue-50 font-semibold"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {spacing === "compact"
                        ? "Compact"
                        : spacing === "normal"
                        ? "Normal"
                        : "Aéré"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icônes de section */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Icônes de section</Label>
                <button
                  onClick={() =>
                    onStyleChange({
                      ...style,
                      layout: {
                        ...style.layout,
                        sectionIcons: !style.layout.sectionIcons,
                      },
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    style.layout.sectionIcons ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      style.layout.sectionIcons ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </TabsContent>

            {/* TAB COULEURS */}
            <TabsContent value="colors" className="space-y-4">
              {/* Presets */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Thèmes prédéfinis</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRESET_COLORS).map(([name, colors]) => (
                    <button
                      key={name}
                      onClick={() => handleColorPresetChange(name)}
                      className="flex items-center gap-2 px-3 py-2 border-2 rounded-lg hover:shadow-md transition-all"
                      style={{
                        borderColor: colors.primary,
                        backgroundColor: `${colors.primary}10`,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <span className="text-xs font-medium capitalize">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Couleurs personnalisées */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Personnalisation</Label>
                {(
                  [
                    { key: "primary", label: "Couleur principale" },
                    { key: "secondary", label: "Couleur secondaire" },
                    { key: "accent", label: "Couleur d'accent" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={style.colorScheme[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
                    />
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600">{label}</Label>
                      <Input
                        type="text"
                        value={style.colorScheme[key]}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="mt-1 h-8 text-xs font-mono"
                        placeholder="#2563EB"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB TYPOGRAPHIE */}
            <TabsContent value="typography" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Police des titres
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Inter", "Poppins", "Roboto", "Montserrat"] as const).map(
                      (font) => (
                        <button
                          key={font}
                          onClick={() =>
                            onStyleChange({
                              ...style,
                              typography: { ...style.typography, headingFont: font },
                            })
                          }
                          className={`px-3 py-2 text-sm rounded border-2 transition-all ${
                            style.typography.headingFont === font
                              ? "border-blue-600 bg-blue-50 font-semibold"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Police du texte
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Inter", "Poppins", "Roboto", "Montserrat"] as const).map(
                      (font) => (
                        <button
                          key={font}
                          onClick={() =>
                            onStyleChange({
                              ...style,
                              typography: { ...style.typography, bodyFont: font },
                            })
                          }
                          className={`px-3 py-2 text-sm rounded border-2 transition-all ${
                            style.typography.bodyFont === font
                              ? "border-blue-600 bg-blue-50 font-semibold"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB SECTIONS */}
            <TabsContent value="sections" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sections existantes</Label>
                {sections.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    Aucune section personnalisée
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={section.visible ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {section.titre}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSectionVisibility(section.id)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            {section.visible ? "Masquer" : "Afficher"}
                          </button>
                          <button
                            onClick={() => removeSection(section.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Ajouter une section</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SECTION_TYPES.map((sectionType) => (
                    <button
                      key={sectionType.type}
                      onClick={() => addSection(sectionType.type as CVSection["type"])}
                      className="flex items-center gap-2 px-3 py-2 text-xs border-2 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                    >
                      {sectionType.type === "langues" && <Globe className="w-4 h-4" />}
                      {sectionType.type === "certifications" && (
                        <Award className="w-4 h-4" />
                      )}
                      {sectionType.type === "projets" && (
                        <Briefcase className="w-4 h-4" />
                      )}
                      {sectionType.type === "interets" && <Heart className="w-4 h-4" />}
                      {sectionType.type === "custom" && <Plus className="w-4 h-4" />}
                      <span>{sectionType.titre}</span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Bouton de réinitialisation */}
          <Separator />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Réinitialiser aux valeurs par défaut
              onStyleChange({
                template: "modern",
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
                  sectionIcons: true,
                },
              });
              onSectionsChange([]);
            }}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Réinitialiser le style
          </Button>
        </CardContent>
      )}
    </Card>
  );
}


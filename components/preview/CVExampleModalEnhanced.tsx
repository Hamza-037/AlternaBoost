"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, X, Heart, Share2, Eye, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Experience } from "@/types/cv";

interface CVExample {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  formation: string;
  ecole: string;
  anneeDiplome: number;
  anneeFormation: string;
  experiences: Experience[];
  competences: string;
  objectif: string;
  entrepriseCiblee: string;
  experiencesOriginales: string[];
  experiencesAmeliorees: Experience[];
  competencesOriginales: string[];
  competencesAmeliorees: string[];
  objectifAmeliore: string;
  category: string;
  template: string;
  popularity?: number;
  isNew?: boolean;
  rating?: number;
  views?: number;
  downloads?: number;
  testimonial?: {
    author: string;
    role: string;
    company: string;
    text: string;
    avatar?: string;
  };
}

interface CVExampleModalEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CVExample | null;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function CVExampleModalEnhanced({
  isOpen,
  onClose,
  cv,
  onDownload,
  isDownloading,
}: CVExampleModalEnhancedProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "before-after" | "details">("preview");
  const [isFavorite, setIsFavorite] = useState(false);

  if (!cv) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `CV Exemple - ${cv.prenom} ${cv.nom}`,
        text: `Découvrez cet exemple de CV ${cv.category} généré par AlternaBoost`,
        url: window.location.href,
      }).catch(() => {
        // Fallback si partage échoue
        navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papier !");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris !");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header avec actions */}
        <DialogHeader className="sticky top-0 z-20 bg-white border-b px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                {cv.prenom} {cv.nom}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-blue-600">{cv.category}</Badge>
                <Badge variant="outline">{cv.template}</Badge>
                {cv.isNew && <Badge className="bg-green-600">Nouveau</Badge>}
              </div>
              
              {/* Statistiques */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{cv.views?.toLocaleString() || '0'} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{cv.downloads?.toLocaleString() || '0'} téléchargements</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{cv.rating?.toFixed(1) || '4.5'}/5</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Contenu principal */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger value="before-after">
                <TrendingUp className="w-4 h-4 mr-2" />
                Avant/Après
              </TabsTrigger>
              <TabsTrigger value="details">
                <Star className="w-4 h-4 mr-2" />
                Détails
              </TabsTrigger>
            </TabsList>

            {/* Onglet Aperçu */}
            <TabsContent value="preview" className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-2xl p-8">
                  {/* Simulation d'un CV */}
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h2 className="text-3xl font-bold text-gray-900">{cv.prenom} {cv.nom}</h2>
                      <p className="text-lg text-gray-600 mt-1">{cv.objectifAmeliore}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <span>{cv.email}</span>
                        <span>•</span>
                        <span>{cv.telephone}</span>
                        {cv.adresse && (
                          <>
                            <span>•</span>
                            <span>{cv.adresse}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Formation</h3>
                      <div>
                        <p className="font-semibold text-gray-900">{cv.formation}</p>
                        <p className="text-gray-600">{cv.ecole} • {cv.anneeFormation}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Expériences</h3>
                      <div className="space-y-4">
                        {cv.experiencesAmeliorees.map((exp, idx) => (
                          <div key={idx}>
                            <p className="font-semibold text-gray-900">{exp.poste}</p>
                            <p className="text-sm text-gray-600">{exp.entreprise} • {exp.periode}</p>
                            <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Compétences</h3>
                      <div className="flex flex-wrap gap-2">
                        {cv.competencesAmeliorees.map((comp, idx) => (
                          <Badge key={idx} variant="secondary">{comp}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Témoignage si disponible */}
              {cv.testimonial && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {cv.testimonial.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 italic mb-3">"{cv.testimonial.text}"</p>
                      <div>
                        <p className="font-semibold text-gray-900">{cv.testimonial.author}</p>
                        <p className="text-sm text-gray-600">{cv.testimonial.role} • {cv.testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Onglet Avant/Après */}
            <TabsContent value="before-after" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AVANT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      ❌ AVANT (Original)
                    </Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Objectif</h4>
                        <p className="text-gray-700">{cv.objectif}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Expériences</h4>
                        <ul className="space-y-2">
                          {cv.experiencesOriginales.map((exp, idx) => (
                            <li key={idx} className="text-sm text-gray-700">• {exp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Compétences</h4>
                        <div className="flex flex-wrap gap-1">
                          {cv.competencesOriginales.map((comp, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{comp}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* APRÈS */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      ✅ APRÈS (Optimisé IA)
                    </Badge>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Objectif</h4>
                        <p className="text-gray-900 font-medium">{cv.objectifAmeliore}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Expériences</h4>
                        <ul className="space-y-2">
                          {cv.experiencesAmeliorees.slice(0, 2).map((exp, idx) => (
                            <li key={idx} className="text-sm text-gray-900">
                              <strong>{exp.poste}</strong> - {exp.description.substring(0, 100)}...
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Compétences</h4>
                        <div className="flex flex-wrap gap-1">
                          {cv.competencesAmeliorees.map((comp, idx) => (
                            <Badge key={idx} className="text-xs bg-green-600">{comp}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Améliorations clés */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Ce que l'IA a amélioré
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Objectif plus percutant et personnalisé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Descriptions d'expériences détaillées avec résultats mesurables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Compétences enrichies et catégorisées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Vocabulaire professionnel optimisé pour les ATS</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Onglet Détails */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Formation :</span>
                      <span className="font-semibold">{cv.formation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">École :</span>
                      <span className="font-semibold">{cv.ecole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Année :</span>
                      <span className="font-semibold">{cv.anneeDiplome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie :</span>
                      <Badge>{cv.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template :</span>
                      <Badge variant="outline">{cv.template}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg">Statistiques</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-700">Score de popularité</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${((cv.popularity || 0) / 300) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-blue-600">{cv.popularity || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">Note moyenne</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (cv.rating || 4.5)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-bold">{cv.rating?.toFixed(1) || '4.5'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h4 className="font-bold text-lg text-gray-900 mb-3">💡 Pourquoi ce CV fonctionne</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span>Structure claire et professionnelle adaptée au secteur {cv.category}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Objectif personnalisé qui capte l'attention en 5 secondes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span>Expériences décrites avec des résultats mesurables et des verbes d'action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">4.</span>
                    <span>Compétences techniques pertinentes pour le poste ciblé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">5.</span>
                    <span>Template {cv.template} optimisé pour la lisibilité et le passage des ATS</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer avec boutons d'action */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>Ce CV a aidé {cv.downloads || 0} personnes</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button onClick={onDownload} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700">
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


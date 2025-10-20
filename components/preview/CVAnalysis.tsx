"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GeneratedCV } from "@/types/cv";
import type { CVAnalysis as CVAnalysisType } from "@/app/api/analyze-cv/route";

interface CVAnalysisProps {
  cvData: GeneratedCV;
}

export function CVAnalysis({ cvData }: CVAnalysisProps) {
  const [analysis, setAnalysis] = useState<CVAnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse");
      }

      const analysisData: CVAnalysisType = await response.json();
      setAnalysis(analysisData);
      setShowAnalysis(true);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'analyse du CV");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fonction pour déterminer la couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 border-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 border-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 border-yellow-600 bg-yellow-50";
    return "text-red-600 border-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bon";
    if (score >= 40) return "Moyen";
    return "À améliorer";
  };

  return (
    <div className="space-y-4">
      {!showAnalysis ? (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h-6.27A2 2 0 0 0 13 15.73V17h5a2 2 0 0 1 0 4H6a2 2 0 0 1 0-4h5v-1.27a2 2 0 0 0-1.73-1.98H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4c0-1.1.9-2 2-2Z" />
              </svg>
              Analyse IA de votre CV
            </CardTitle>
            <CardDescription>
              Obtenez un score détaillé et des suggestions d&apos;amélioration personnalisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyse en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 11-6 6v3h9l3-3" />
                    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
                  </svg>
                  Analyser mon CV
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Analyse de votre CV</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAnalysis(false)}
                    >
                      Masquer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score global */}
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-white rounded-lg border-2 border-purple-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Score global
                    </p>
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysis.score).split(' ')[0]}`}>
                      {analysis.score}
                      <span className="text-3xl">/100</span>
                    </div>
                    <Badge className={getScoreColor(analysis.score)}>
                      {getScoreLabel(analysis.score)}
                    </Badge>
                  </div>

                  {/* Points forts */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Points forts
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-600 flex-shrink-0 mt-1"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Axes d'amélioration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      Axes d&apos;amélioration
                    </h3>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="flex items-start gap-2 text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-600 flex-shrink-0 mt-1"
                          >
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                            <path d="M3.34 7A10 10 0 1 1 7 3.34" />
                          </svg>
                          <span>{improvement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <path d="M12 2v4" />
                        <path d="M12 18v4" />
                        <path d="M4.93 4.93l2.83 2.83" />
                        <path d="M16.24 16.24l2.83 2.83" />
                        <path d="M2 12h4" />
                        <path d="M18 12h4" />
                        <path d="M4.93 19.07l2.83-2.83" />
                        <path d="M16.24 7.76l2.83-2.83" />
                      </svg>
                      Suggestions concrètes
                    </h3>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="flex items-start gap-2 text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-600 flex-shrink-0 mt-1"
                          >
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          <span>{suggestion}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Bouton pour réanalyser */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      variant="outline"
                      className="w-full"
                    >
                      Réanalyser après modifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}


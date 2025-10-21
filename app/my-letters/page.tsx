"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Download,
  Edit,
  Trash2,
  Search,
  Plus,
  Calendar,
  Building2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Letter {
  id: string;
  title: string;
  targetCompany: string | null;
  targetPosition: string | null;
  status: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyLettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const response = await fetch("/api/user/letters?limit=50");
      if (response.ok) {
        const data = await response.json();
        setLetters(data.letters || []);
      } else {
        toast.error("Erreur lors du chargement des lettres");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette lettre ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/letter/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Lettre supprimée avec succès");
        setLetters(letters.filter((letter) => letter.id !== id));
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de connexion");
    }
  };

  const filteredLetters = letters.filter((letter) => {
    return (
      letter.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.targetCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.targetPosition?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Mes Lettres de Motivation
                </h1>
                <p className="text-gray-600">
                  {letters.length} lettre{letters.length > 1 ? "s" : ""} créée
                  {letters.length > 1 ? "s" : ""}
                </p>
              </div>
              <Link href="/create-letter">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2">
                  <Plus className="w-4 h-4" />
                  Créer une nouvelle lettre
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre, entreprise ou poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>
          </motion.div>

          {/* Liste des lettres */}
          {filteredLetters.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Aucune lettre trouvée avec ces critères"
                  : "Vous n'avez pas encore créé de lettre"}
              </p>
              {!searchTerm && (
                <Link href="/create-letter">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Créer ma première lettre
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLetters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    {/* Preview miniature */}
                    <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
                      {/* Pattern de lignes (lettre) */}
                      <div className="absolute inset-0 opacity-10 p-6">
                        <div className="space-y-2">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-2 bg-white rounded"
                              style={{ width: `${90 - i * 3}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>

                      {/* Icône */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Mail className="w-20 h-20 text-white opacity-30" />
                      </div>

                      {/* Badge status */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={
                            letter.status === "completed"
                              ? "bg-green-500 text-white border-0"
                              : "bg-orange-500 text-white border-0"
                          }
                        >
                          {letter.status === "completed" ? "Complète" : "Brouillon"}
                        </Badge>
                      </div>
                    </div>

                    {/* Informations */}
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">
                        {letter.title || "Lettre sans titre"}
                      </CardTitle>
                      <div className="flex flex-col gap-2 text-sm text-gray-600 mt-2">
                        {letter.targetCompany && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {letter.targetCompany}
                            </span>
                          </div>
                        )}
                        {letter.targetPosition && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {letter.targetPosition}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(letter.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Stats */}
                    <CardContent className="pt-0">
                      <div className="flex gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{letter.viewCount} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{letter.downloadCount} téléchargements</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/edit-letter/${letter.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(letter.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}


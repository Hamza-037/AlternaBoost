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
  FileText,
  Download,
  Edit,
  Trash2,
  Search,
  Plus,
  Calendar,
  Building2,
  Eye,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CV {
  id: string;
  title: string;
  template: string;
  targetCompany: string | null;
  targetPosition: string | null;
  status: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyCVsPage() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      const response = await fetch("/api/user/cvs?limit=50");
      if (response.ok) {
        const data = await response.json();
        setCVs(data.cvs || []);
      } else {
        toast.error("Erreur lors du chargement des CVs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("CV supprimé avec succès");
        setCVs(cvs.filter((cv) => cv.id !== id));
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de connexion");
    }
  };

  const filteredCVs = cvs.filter((cv) => {
    const matchesSearch =
      cv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.targetCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.targetPosition?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "draft" && cv.status === "draft") ||
      (filter === "completed" && cv.status === "completed") ||
      cv.template === filter;

    return matchesSearch && matchesFilter;
  });

  const templateColors: Record<string, string> = {
    modern: "from-blue-500 to-cyan-600",
    premium: "from-purple-500 to-pink-600",
    creative: "from-orange-500 to-red-600",
    minimal: "from-gray-600 to-gray-800",
  };

  const templateNames: Record<string, string> = {
    modern: "Moderne",
    premium: "Premium",
    creative: "Créatif",
    minimal: "Minimaliste",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Mes CVs
                </h1>
                <p className="text-gray-600">
                  {cvs.length} CV{cvs.length > 1 ? "s" : ""} créé
                  {cvs.length > 1 ? "s" : ""}
                </p>
              </div>
              <Link href="/create-cv">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                  <Plus className="w-4 h-4" />
                  Créer un nouveau CV
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Recherche */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par titre, entreprise ou poste..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtres */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("completed")}
                  >
                    Complétés
                  </Button>
                  <Button
                    variant={filter === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("draft")}
                  >
                    Brouillons
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Liste des CVs */}
          {filteredCVs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm || filter !== "all"
                  ? "Aucun CV trouvé avec ces critères"
                  : "Vous n'avez pas encore créé de CV"}
              </p>
              {!searchTerm && filter === "all" && (
                <Link href="/create-cv">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Créer mon premier CV
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCVs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 group">
                    {/* Preview miniature */}
                    <div
                      className={`h-48 bg-gradient-to-br ${
                        templateColors[cv.template] ||
                        "from-gray-400 to-gray-600"
                      } relative overflow-hidden`}
                    >
                      {/* Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-8 gap-2 p-4 h-full">
                          {Array.from({ length: 32 }).map((_, i) => (
                            <div key={i} className="bg-white rounded"></div>
                          ))}
                        </div>
                      </div>

                      {/* Icône */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-20 h-20 text-white opacity-30" />
                      </div>

                      {/* Badge template */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-900 border-0">
                          {templateNames[cv.template] || cv.template}
                        </Badge>
                      </div>

                      {/* Badge status */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={
                            cv.status === "completed"
                              ? "bg-green-500 text-white border-0"
                              : "bg-orange-500 text-white border-0"
                          }
                        >
                          {cv.status === "completed" ? "Complet" : "Brouillon"}
                        </Badge>
                      </div>
                    </div>

                    {/* Informations */}
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">
                        {cv.title || "CV sans titre"}
                      </CardTitle>
                      <div className="flex flex-col gap-2 text-sm text-gray-600 mt-2">
                        {cv.targetCompany && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {cv.targetCompany}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(cv.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Stats */}
                    <CardContent className="pt-0">
                      <div className="flex gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{cv.viewCount} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{cv.downloadCount} téléchargements</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/edit-cv/${cv.id}`} className="flex-1">
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
                          onClick={() => handleDelete(cv.id)}
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


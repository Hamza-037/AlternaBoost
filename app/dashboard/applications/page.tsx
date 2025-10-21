"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Briefcase, 
  Calendar, 
  Edit,
  Trash2,
  Search,
  Filter,
  Building2,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { ApplicationFormDialog } from "@/components/applications/ApplicationFormDialog";
import { DeleteConfirmDialog } from "@/components/applications/DeleteConfirmDialog";
import type { Application } from "@/types/application";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/types/application";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      if (!response.ok) throw new Error("Erreur de chargement");
      
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les candidatures");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur de suppression");

      setApplications(applications.filter((app) => app.id !== id));
      toast.success("Candidature supprimée");
      setDeletingId(null);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingApplication(null);
  };

  const handleSuccess = () => {
    loadApplications();
    handleDialogClose();
  };

  // Filtrer les candidatures
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Stats rapides
  const stats = {
    total: applications.length,
    en_attente: applications.filter((a) => a.status === "en_attente").length,
    entretien: applications.filter((a) => a.status === "entretien").length,
    offre: applications.filter((a) => a.status === "offre").length,
    refus: applications.filter((a) => a.status === "refus").length,
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Mes Candidatures
                </h1>
                <p className="text-gray-600">
                  Suivez toutes vos candidatures en un seul endroit
                </p>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle candidature
              </Button>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Total", value: stats.total, color: "from-gray-500 to-gray-600", icon: Briefcase },
                { label: "En attente", value: stats.en_attente, color: "from-yellow-500 to-orange-500", icon: Clock },
                { label: "Entretiens", value: stats.entretien, color: "from-blue-500 to-cyan-500", icon: Calendar },
                { label: "Offres", value: stats.offre, color: "from-green-500 to-emerald-500", icon: Building2 },
                { label: "Refus", value: stats.refus, color: "from-red-500 to-pink-500", icon: Trash2 },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="border-2 border-gray-100">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-2`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Filtres et recherche */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par entreprise ou poste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="entretien">Entretien</option>
              <option value="offre">Offre</option>
              <option value="refus">Refusé</option>
              <option value="sans_reponse">Sans réponse</option>
            </select>
          </motion.div>

          {/* Liste des candidatures */}
          {filteredApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery || filterStatus !== "all" 
                  ? "Aucune candidature trouvée"
                  : "Commencez à suivre vos candidatures"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterStatus !== "all"
                  ? "Essayez de modifier vos filtres"
                  : "Ajoutez votre première candidature pour commencer"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter une candidature
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {filteredApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${APPLICATION_STATUS_COLORS[application.status as keyof typeof APPLICATION_STATUS_COLORS].bg} border-2 ${APPLICATION_STATUS_COLORS[application.status as keyof typeof APPLICATION_STATUS_COLORS].badge} flex items-center justify-center text-2xl`}>
                                {APPLICATION_STATUS_COLORS[application.status as keyof typeof APPLICATION_STATUS_COLORS].icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {application.companyName}
                                </h3>
                                <p className="text-gray-600 mb-2">{application.position}</p>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(application.appliedDate).toLocaleDateString("fr-FR")}
                                  </span>
                                  {application.contactPerson && (
                                    <span className="flex items-center gap-1">
                                      <Building2 className="w-4 h-4" />
                                      {application.contactPerson}
                                    </span>
                                  )}
                                </div>
                                {application.notes && (
                                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                    {application.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={APPLICATION_STATUS_COLORS[application.status as keyof typeof APPLICATION_STATUS_COLORS].badge}>
                              {APPLICATION_STATUS_LABELS[application.status as keyof typeof APPLICATION_STATUS_LABELS]}
                            </Badge>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(application)}
                              className="hover:bg-blue-50 hover:border-blue-500"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeletingId(application.id)}
                              className="hover:bg-red-50 hover:border-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Dialog pour ajouter/éditer */}
      <ApplicationFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        application={editingApplication}
        onSuccess={handleSuccess}
      />

      {/* Dialog de confirmation de suppression */}
      <DeleteConfirmDialog
        open={deletingId !== null}
        onOpenChange={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
      />

      <Footer />
    </>
  );
}


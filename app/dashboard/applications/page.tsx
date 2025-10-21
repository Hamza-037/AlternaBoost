"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Briefcase, 
  Search,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";
import { ApplicationFormDialog } from "@/components/applications/ApplicationFormDialog";
import { DeleteConfirmDialog } from "@/components/applications/DeleteConfirmDialog";
import { ApplicationStats } from "@/components/applications/ApplicationStats";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import type { Application } from "@/types/application";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "followup" | "status">("date");

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

  // Filtrer et trier les candidatures
  const filteredAndSortedApplications = applications
    .filter((app) => {
      const matchesStatus = filterStatus === "all" || app.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case "followup":
          if (!a.nextFollowUp && !b.nextFollowUp) return 0;
          if (!a.nextFollowUp) return 1;
          if (!b.nextFollowUp) return -1;
          return new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime();
        case "status":
          const statusOrder = ["entretien", "offre", "en_attente", "sans_reponse", "refus"];
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos candidatures...</p>
        </div>
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <Briefcase className="w-10 h-10 text-blue-600" />
                  Mes Candidatures
                </h1>
                <p className="text-gray-600 text-lg">
                  Tableau de bord de suivi professionnel
                </p>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle candidature
              </Button>
            </div>

            {/* Statistiques */}
            <ApplicationStats applications={applications} />
          </motion.div>

          {/* Filtres et recherche */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par entreprise, poste ou lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white shadow-sm"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white appearance-none cursor-pointer shadow-sm min-w-[180px]"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="entretien">Entretien</option>
                    <option value="offre">Offre</option>
                    <option value="refus">Refusé</option>
                    <option value="sans_reponse">Sans réponse</option>
                  </select>
                </div>

                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-white appearance-none cursor-pointer shadow-sm min-w-[180px]"
                  >
                    <option value="date">Plus récentes</option>
                    <option value="followup">À relancer</option>
                    <option value="status">Par statut</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Compteur de résultats */}
            {(searchQuery || filterStatus !== "all") && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-blue-600">
                  {filteredAndSortedApplications.length}
                </span>
                résultat{filteredAndSortedApplications.length > 1 ? "s" : ""}
                {searchQuery && (
                  <span>
                    pour "{searchQuery}"
                  </span>
                )}
              </div>
            )}
          </motion.div>

          {/* Liste des candidatures */}
          {filteredAndSortedApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {searchQuery || filterStatus !== "all" 
                  ? "Aucune candidature trouvée"
                  : "Commencez votre suivi"}
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                {searchQuery || filterStatus !== "all"
                  ? "Essayez de modifier vos filtres ou votre recherche"
                  : "Ajoutez votre première candidature et gardez une trace de toutes vos démarches"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter ma première candidature
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedApplications.map((application, index) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeletingId(id)}
                  />
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

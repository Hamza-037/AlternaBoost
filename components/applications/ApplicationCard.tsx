"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Building2,
  Edit,
  Trash2,
  ExternalLink,
  Bell,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";
import type { Application } from "@/types/application";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/types/application";

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = APPLICATION_STATUS_COLORS[application.status];

  // Vérifier si la date de relance est proche (dans les 3 prochains jours)
  const isFollowUpSoon = application.nextFollowUp 
    ? new Date(application.nextFollowUp).getTime() - Date.now() <= 3 * 24 * 60 * 60 * 1000 
      && new Date(application.nextFollowUp).getTime() > Date.now()
    : false;

  const isOverdue = application.nextFollowUp 
    ? new Date(application.nextFollowUp).getTime() < Date.now()
    : false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className={`border-2 hover:shadow-xl transition-all ${
        isOverdue 
          ? "border-red-300 bg-red-50/30" 
          : isFollowUpSoon 
            ? "border-orange-300 bg-orange-50/30" 
            : "border-gray-100 hover:border-blue-300"
      }`}>
        <CardContent className="p-6">
          {/* En-tête */}
          <div className="flex items-start gap-4 mb-4">
            {/* Icône de statut */}
            <div className={`w-14 h-14 rounded-xl ${statusConfig.bg} border-2 ${statusConfig.border} flex items-center justify-center text-2xl shadow-sm`}>
              {statusConfig.icon}
            </div>

            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    {application.companyName}
                    {application.jobUrl && (
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </h3>
                  <p className="text-gray-700 font-medium mb-2">{application.position}</p>
                  
                  {/* Tags supplémentaires */}
                  <div className="flex flex-wrap gap-2 text-sm">
                    {application.location && (
                      <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3" />
                        {application.location}
                      </span>
                    )}
                    {application.contractType && (
                      <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        <FileText className="w-3 h-3" />
                        {application.contractType}
                      </span>
                    )}
                    {application.salary && (
                      <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        <DollarSign className="w-3 h-3" />
                        {application.salary}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge de statut */}
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${statusConfig.badge} text-xs font-semibold px-3 py-1`}>
                    {APPLICATION_STATUS_LABELS[application.status]}
                  </Badge>
                  
                  {/* Alerte de relance */}
                  {isOverdue && (
                    <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                      <Bell className="w-3 h-3 mr-1" />
                      Relance en retard
                    </Badge>
                  )}
                  {isFollowUpSoon && !isOverdue && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                      <Bell className="w-3 h-3 mr-1" />
                      À relancer bientôt
                    </Badge>
                  )}
                </div>
              </div>

              {/* Infos rapides */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Candidature: {new Date(application.appliedDate).toLocaleDateString("fr-FR")}
                </span>
                {application.contactPerson && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {application.contactPerson}
                  </span>
                )}
                {application.nextFollowUp && (
                  <span className={`flex items-center gap-1.5 ${
                    isOverdue ? "text-red-600 font-semibold" : isFollowUpSoon ? "text-orange-600 font-semibold" : ""
                  }`}>
                    <Clock className="w-4 h-4" />
                    Relance: {new Date(application.nextFollowUp).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>

              {/* Notes (aperçu) */}
              {application.notes && !isExpanded && (
                <p className="text-sm text-gray-600 line-clamp-2 italic">
                  "{application.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Section extensible */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  {/* Notes complètes */}
                  {application.notes && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Notes personnelles
                      </h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {application.notes}
                      </p>
                    </div>
                  )}

                  {/* Historique des statuts */}
                  {application.statusHistory && application.statusHistory.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <History className="w-4 h-4 text-gray-600" />
                        Historique
                      </h4>
                      <div className="space-y-2">
                        {application.statusHistory.map((history, index) => (
                          <div key={index} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                            <div className="flex-1">
                              <p className="text-gray-900">
                                <span className="font-semibold">
                                  {APPLICATION_STATUS_LABELS[history.status]}
                                </span>
                                {" • "}
                                <span className="text-gray-500">
                                  {new Date(history.date).toLocaleDateString("fr-FR")}
                                </span>
                              </p>
                              {history.note && (
                                <p className="text-gray-600 text-xs mt-0.5 italic">
                                  {history.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Réduire
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Voir plus
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(application)}
                className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(application.id)}
                className="hover:bg-red-50 hover:border-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


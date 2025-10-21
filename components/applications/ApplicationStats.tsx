"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Target
} from "lucide-react";
import type { Application } from "@/types/application";

interface ApplicationStatsProps {
  applications: Application[];
}

export function ApplicationStats({ applications }: ApplicationStatsProps) {
  const total = applications.length;
  const stats = {
    en_attente: applications.filter((a) => a.status === "en_attente").length,
    entretien: applications.filter((a) => a.status === "entretien").length,
    offre: applications.filter((a) => a.status === "offre").length,
    refus: applications.filter((a) => a.status === "refus").length,
    sans_reponse: applications.filter((a) => a.status === "sans_reponse").length,
  };

  // Calcul des pourcentages
  const percentages = {
    reponse: total > 0 ? Math.round(((total - stats.sans_reponse) / total) * 100) : 0,
    entretien: total > 0 ? Math.round((stats.entretien / total) * 100) : 0,
    offre: total > 0 ? Math.round((stats.offre / total) * 100) : 0,
    success: total > 0 ? Math.round(((stats.offre + stats.entretien) / total) * 100) : 0,
  };

  const statsCards = [
    {
      label: "Total",
      value: total,
      icon: Briefcase,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
    },
    {
      label: "En attente",
      value: stats.en_attente,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      percentage: total > 0 ? Math.round((stats.en_attente / total) * 100) : 0,
    },
    {
      label: "Entretiens",
      value: stats.entretien,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      percentage: percentages.entretien,
    },
    {
      label: "Offres",
      value: stats.offre,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      percentage: percentages.offre,
    },
    {
      label: "Refus",
      value: stats.refus,
      icon: XCircle,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      percentage: total > 0 ? Math.round((stats.refus / total) * 100) : 0,
    },
  ];

  const performanceMetrics = [
    {
      label: "Taux de réponse",
      value: `${percentages.reponse}%`,
      icon: Target,
      color: percentages.reponse >= 50 ? "text-green-600" : percentages.reponse >= 30 ? "text-yellow-600" : "text-red-600",
      description: `${total - stats.sans_reponse} réponses sur ${total}`,
    },
    {
      label: "Taux de conversion",
      value: `${percentages.success}%`,
      icon: TrendingUp,
      color: percentages.success >= 30 ? "text-green-600" : percentages.success >= 15 ? "text-yellow-600" : "text-orange-600",
      description: `${stats.entretien + stats.offre} positifs sur ${total}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03, y: -2 }}
          >
            <Card className={`border-2 border-gray-100 hover:border-blue-200 transition-all ${stat.bgColor}`}>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.percentage !== undefined && stat.value > 0 && (
                    <span className={`text-xs font-semibold ${stat.textColor}`}>
                      {stat.percentage}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                
                {/* Barre de progression */}
                {stat.percentage !== undefined && stat.value > 0 && (
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Métriques de performance */}
      {total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                        <p className={`text-2xl font-bold ${metric.color}`}>
                          {metric.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}


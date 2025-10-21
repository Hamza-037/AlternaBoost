"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  Crown,
  Calendar,
  CreditCard,
  FileText,
  Mail,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Download,
  Eye,
  Settings,
  BarChart3,
  Zap,
  Clock,
  Star,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fonction pour recharger les données utilisateur
  const refreshUserData = async () => {
    setIsRefreshing(true);
    try {
      // Forcer le rechargement des données Clerk
      await user?.reload();
      
      if (user) {
        const metadata = user.publicMetadata;
        setSubscription({
          plan: metadata.plan || "FREE",
          status: metadata.subscriptionStatus || "active",
          currentPeriodEnd: metadata.currentPeriodEnd,
          cancelAtPeriodEnd: metadata.cancelAtPeriodEnd,
        });
      }
    } catch (error) {
      console.error('Erreur rechargement:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      const metadata = user.publicMetadata;
      setSubscription({
        plan: metadata.plan || "FREE",
        status: metadata.subscriptionStatus || "active",
        currentPeriodEnd: metadata.currentPeriodEnd,
        cancelAtPeriodEnd: metadata.cancelAtPeriodEnd,
      });
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const planColors: Record<string, string> = {
    FREE: "from-gray-500 to-gray-600",
    STARTER: "from-blue-500 to-cyan-500",
    PRO: "from-purple-500 to-pink-500",
    PREMIUM: "from-yellow-500 to-orange-500",
  };

  const planNames: Record<string, string> = {
    FREE: "Gratuit",
    STARTER: "Starter",
    PRO: "Pro",
    PREMIUM: "Premium",
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    past_due: "bg-orange-100 text-orange-800",
    canceled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    active: "Actif",
    trialing: "Essai gratuit",
    past_due: "Paiement en retard",
    canceled: "Annulé",
  };

  const planLimits: Record<string, { cvs: number; letters: number; features: string[] }> = {
    FREE: {
      cvs: 3,
      letters: 1,
      features: ["3 CV basiques", "1 lettre de motivation", "Modèles standards"],
    },
    STARTER: {
      cvs: 15,
      letters: 5,
      features: ["15 CV/mois", "5 lettres/mois", "Tous les modèles", "Optimisation IA"],
    },
    PRO: {
      cvs: 50,
      letters: 20,
      features: ["50 CV/mois", "20 lettres/mois", "Modèles premium", "Analyse avancée"],
    },
    PREMIUM: {
      cvs: -1,
      letters: -1,
      features: ["CV illimités", "Lettres illimitées", "IA avancée", "Support VIP"],
    },
  };

  const currentPlanLimits = planLimits[subscription?.plan || "FREE"];
  const cvUsagePercent = currentPlanLimits.cvs === -1 ? 0 : (0 / currentPlanLimits.cvs) * 100;
  const letterUsagePercent = currentPlanLimits.letters === -1 ? 0 : (0 / currentPlanLimits.letters) * 100;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bonjour, {user?.firstName || "Utilisateur"} 👋
            </h1>
            <p className="text-gray-600">
              Bienvenue sur votre tableau de bord AlternaBoost
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plan actuel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="border-2">
                <CardHeader className={`bg-gradient-to-r ${planColors[subscription?.plan || "FREE"]} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown className="w-8 h-8" />
                      <div>
                        <CardTitle className="text-2xl">
                          Plan {planNames[subscription?.plan || "FREE"]}
                        </CardTitle>
                        <p className="text-white/80 text-sm mt-1">
                          Votre abonnement actuel
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={refreshUserData}
                        disabled={isRefreshing}
                        className="text-white hover:bg-white/20"
                      >
                        {isRefreshing ? "..." : "↻"}
                      </Button>
                      <Badge className={statusColors[subscription?.status || "active"]}>
                        {statusLabels[subscription?.status || "active"]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {subscription?.plan !== "FREE" && subscription?.currentPeriodEnd && (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Prochaine facturation
                          </p>
                          <p className="font-semibold">
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      {subscription.cancelAtPeriodEnd && (
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          <p className="text-sm text-orange-800">
                            Votre abonnement sera annulé à la fin de la période
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {subscription?.plan === "FREE" ? (
                      <Link href="/pricing" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Passer à Premium
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Gérer l'abonnement
                        </Button>
                        {subscription?.plan !== "PREMIUM" && (
                          <Link href="/pricing" className="flex-1">
                            <Button variant="outline" className="w-full">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Upgrade
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats d'utilisation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Utilisation ce mois</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">CV créés</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        0 / {subscription?.plan === "FREE" ? "3" : subscription?.plan === "STARTER" ? "15" : "∞"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Lettres créées</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        0 / {subscription?.plan === "FREE" ? "1" : subscription?.plan === "STARTER" ? "5" : "∞"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "0%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/create-cv">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Créer un CV</h3>
                    <p className="text-sm text-gray-600">
                      Générez un CV professionnel en quelques minutes
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/create-letter">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">
                      Créer une lettre
                    </h3>
                    <p className="text-sm text-gray-600">
                      Rédigez une lettre de motivation personnalisée
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/exemples">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">
                      Voir les exemples
                    </h3>
                    <p className="text-sm text-gray-600">
                      Inspirez-vous de nos modèles professionnels
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

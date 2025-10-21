"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HeaderV2 } from "@/components/landing/HeaderV2";
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
  Zap,
  Star,
  RefreshCw,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Usage {
  plan: string;
  usage: {
    cvs: {
      current: number;
      limit: number;
      remaining: number;
      unlimited: boolean;
    };
    letters: {
      current: number;
      limit: number;
      remaining: number;
      unlimited: boolean;
    };
  };
  resetDate: string;
}

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);

  // Charger l'usage depuis la DB (ou données mock si DB non disponible)
  const loadUsage = async () => {
    try {
      const response = await fetch('/api/user/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      } else {
        // Utiliser des données mock si la DB n'est pas disponible
        setUsage({
          plan: user?.publicMetadata?.plan as string || "FREE",
          usage: {
            cvs: {
              current: 0,
              limit: 3,
              remaining: 3,
              unlimited: false,
            },
            letters: {
              current: 0,
              limit: 1,
              remaining: 1,
              unlimited: false,
            },
          },
          resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        });
      }
    } catch (error) {
      console.error('Erreur chargement usage:', error);
      // Utiliser des données mock en cas d'erreur
      setUsage({
        plan: user?.publicMetadata?.plan as string || "FREE",
        usage: {
          cvs: {
            current: 0,
            limit: 3,
            remaining: 3,
            unlimited: false,
          },
          letters: {
            current: 0,
            limit: 1,
            remaining: 1,
            unlimited: false,
          },
        },
        resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      });
    } finally {
      setIsLoadingUsage(false);
    }
  };

  const refreshUserData = async () => {
    setIsRefreshing(true);
    try {
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
      // Recharger aussi l'usage
      await loadUsage();
      toast.success('Données actualisées');
    } catch (error) {
      console.error('Erreur rechargement:', error);
      toast.error('Erreur lors de l\'actualisation');
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
      
      // Charger l'usage depuis la DB
      loadUsage();
    }
  }, [user]);

  if (!isLoaded || isLoadingUsage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    );
  }

  const planColors: Record<string, string> = {
    FREE: "from-gray-500 to-gray-700",
    STARTER: "from-blue-500 to-cyan-600",
    PRO: "from-purple-500 to-pink-600",
    PREMIUM: "from-amber-500 to-orange-600",
  };

  const planIcons: Record<string, any> = {
    FREE: Crown,
    STARTER: Zap,
    PRO: Star,
    PREMIUM: Sparkles,
  };

  const planNames: Record<string, string> = {
    FREE: "Gratuit",
    STARTER: "Starter",
    PRO: "Pro",
    PREMIUM: "Premium",
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    trialing: "bg-blue-100 text-blue-800 border-blue-200",
    past_due: "bg-orange-100 text-orange-800 border-orange-200",
    canceled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    active: "Actif",
    trialing: "Essai gratuit",
    past_due: "Paiement en retard",
    canceled: "Annulé",
  };

  // Utiliser les vraies données de la DB
  const cvUsed = usage?.usage.cvs.current || 0;
  const cvLimit = usage?.usage.cvs.limit || 3;
  const cvUnlimited = usage?.usage.cvs.unlimited || false;
  
  const lettersUsed = usage?.usage.letters.current || 0;
  const lettersLimit = usage?.usage.letters.limit || 1;
  const lettersUnlimited = usage?.usage.letters.unlimited || false;
  
  const cvUsagePercent = cvUnlimited ? 0 : (cvUsed / cvLimit) * 100;
  const letterUsagePercent = lettersUnlimited ? 0 : (lettersUsed / lettersLimit) * 100;

  const PlanIcon = planIcons[subscription?.plan || "FREE"];

  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header avec salutation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Bonjour, {user?.firstName || "Utilisateur"} 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Prêt à créer votre prochain chef-d'œuvre ?
                </p>
              </div>
              <Button
                onClick={refreshUserData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Carte de plan - 2 colonnes sur desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className={`bg-gradient-to-r ${planColors[subscription?.plan || "FREE"]} text-white rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <PlanIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          Plan {planNames[subscription?.plan || "FREE"]}
                        </CardTitle>
                        <p className="text-white/90 text-sm mt-1">
                          {subscription?.status === "trialing" ? "En période d'essai" : "Votre abonnement actuel"}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[subscription?.status || "active"]} border font-semibold`}>
                      {statusLabels[subscription?.status || "active"]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Informations de facturation */}
                  {subscription?.plan !== "FREE" && subscription?.currentPeriodEnd && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">
                          {subscription?.status === "trialing" ? "Fin de l'essai gratuit" : "Prochaine facturation"}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR", { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {subscription?.cancelAtPeriodEnd && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <p className="text-sm text-orange-800 font-medium">
                        Votre abonnement sera annulé le {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex gap-3 pt-2">
                    {subscription?.plan === "FREE" ? (
                      <Link href="/pricing" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Passer à Premium
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1 gap-2">
                          <CreditCard className="w-4 h-4" />
                          Gérer mon abonnement
                        </Button>
                        {subscription?.plan !== "PREMIUM" && (
                          <Link href="/pricing" className="flex-1">
                            <Button variant="outline" className="w-full gap-2">
                              <TrendingUp className="w-4 h-4" />
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

            {/* Statistiques d'utilisation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-violet-600" />
                    <CardTitle className="text-lg">Utilisation ce mois</CardTitle>
                  </div>
                  <CardDescription>Suivez vos créations</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* CV créés */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900">CV créés</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {cvUsed} / {cvUnlimited ? "∞" : cvLimit}
                      </span>
                    </div>
                    <Progress value={cvUsagePercent} className="h-2.5 bg-blue-100" />
                    {cvUsed >= cvLimit && !cvUnlimited && (
                      <p className="text-xs text-orange-600 font-medium">
                        Limite atteinte ! Passez à un plan supérieur.
                      </p>
                    )}
                  </div>

                  {/* Lettres créées */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Mail className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-900">Lettres créées</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {lettersUsed} / {lettersUnlimited ? "∞" : lettersLimit}
                      </span>
                    </div>
                    <Progress value={letterUsagePercent} className="h-2.5 bg-purple-100" />
                    {lettersUsed >= lettersLimit && !lettersUnlimited && (
                      <p className="text-xs text-orange-600 font-medium">
                        Limite atteinte ! Passez à un plan supérieur.
                      </p>
                    )}
                  </div>

                  {/* Upgrade CTA pour plan gratuit */}
                  {subscription?.plan === "FREE" && (
                    <div className="pt-4 border-t">
                      <div className="p-3 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border border-violet-200">
                        <p className="text-xs text-violet-900 font-medium mb-2">
                          💡 Besoin de plus de créations ?
                        </p>
                        <Link href="/pricing">
                          <Button size="sm" className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                            Voir les plans
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions rapides - Grid amélioré */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-violet-600" />
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/create-cv-v2">
                <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-green-500 text-white text-xs">NOUVEAU</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      Créer un CV
                    </h3>
                    <p className="text-sm text-gray-600">
                      Nouvelle interface avec preview en temps réel
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/create-letter">
                <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-purple-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      Créer une lettre
                    </h3>
                    <p className="text-sm text-gray-600">
                      Rédigez une lettre de motivation personnalisée
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/my-cvs">
                <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-cyan-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-600 transition-colors">
                      Mes CVs
                    </h3>
                    <p className="text-sm text-gray-600">
                      Consultez et modifiez vos CVs créés
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/my-letters">
                <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-pink-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-pink-600 transition-colors">
                      Mes Lettres
                    </h3>
                    <p className="text-sm text-gray-600">
                      Gérez vos lettres de motivation
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* Section Astuces / Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      💡 Astuce du jour
                    </h3>
                    <p className="text-gray-700">
                      Utilisez des verbes d'action forts dans votre CV pour capter l'attention des recruteurs : "Développé", "Optimisé", "Dirigé", "Augmenté"...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}


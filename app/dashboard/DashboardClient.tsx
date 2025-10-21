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
  Briefcase,
  Target,
  Rocket,
  Award,
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

export default function DashboardClientV2() {
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

  useEffect(() => {
    if (isLoaded && user) {
      setSubscription({
        plan: user?.publicMetadata?.plan || "FREE",
        status: "active",
      });
      loadUsage();
    }
  }, [isLoaded, user]);

  const refreshUserData = async () => {
    setIsRefreshing(true);
    await loadUsage();
    toast.success("Données actualisées");
    setIsRefreshing(false);
  };

  const planIcons: Record<string, any> = {
    FREE: Sparkles,
    STARTER: Zap,
    PRO: Crown,
    PREMIUM: Star,
  };

  const PlanIcon = planIcons[subscription?.plan || "FREE"];

  if (!isLoaded || isLoadingUsage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  const cvPercentage = usage?.usage.cvs.unlimited ? 0 : (usage?.usage.cvs.current / usage?.usage.cvs.limit) * 100 || 0;
  const letterPercentage = usage?.usage.letters.unlimited ? 0 : (usage?.usage.letters.current / usage?.usage.letters.limit) * 100 || 0;

  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          
          {/* Hero Header avec stats */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 shadow-2xl">
              {/* Décoration de fond */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
              </div>
              
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        <PlanIcon className="w-3 h-3 mr-1" />
                        Plan {subscription?.plan || "FREE"}
                      </Badge>
                      <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        Bonjour, {user?.firstName || "Étudiant"} 👋
                      </h1>
                      <p className="text-blue-100 text-lg md:text-xl">
                        Prêt à booster votre recherche d'alternance aujourd'hui ?
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={refreshUserData}
                      disabled={isRefreshing}
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Actualiser
                    </Button>
                  </motion.div>
                </div>

                {/* Stats rapides inline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">CVs ce mois</p>
                        <p className="text-white text-2xl font-bold">
                          {usage?.usage.cvs.unlimited ? "∞" : `${usage?.usage.cvs.current}/${usage?.usage.cvs.limit}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Lettres ce mois</p>
                        <p className="text-white text-2xl font-bold">
                          {usage?.usage.letters.unlimited ? "∞" : `${usage?.usage.letters.current}/${usage?.usage.letters.limit}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Prochain reset</p>
                        <p className="text-white text-sm font-medium">
                          {usage ? new Date(usage.resetDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Actions rapides - Design amélioré */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Rocket className="w-7 h-7 text-blue-600" />
                Actions rapides
              </h2>
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="gap-2">
                  <Crown className="w-4 h-4" />
                  Upgrade
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Créer un CV */}
              <Link href="/create-cv-v2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="group h-full border-2 border-transparent hover:border-blue-300 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                          <FileText className="w-7 h-7 text-white" />
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">NOUVEAU</Badge>
                      </div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                        Créer un CV
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Nouvelle interface avec preview en temps réel
                      </p>
                      <div className="flex items-center text-blue-600 font-medium text-sm">
                        Commencer
                        <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>

              {/* Créer une lettre */}
              <Link href="/create-letter">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="group h-full border-2 border-transparent hover:border-purple-300 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                          <Mail className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-purple-600 transition-colors">
                        Créer une lettre
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Rédigez une lettre de motivation personnalisée
                      </p>
                      <div className="flex items-center text-purple-600 font-medium text-sm">
                        Commencer
                        <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>

              {/* Mes Candidatures */}
              <Link href="/dashboard/applications">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="group h-full border-2 border-transparent hover:border-green-300 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                          <Briefcase className="w-7 h-7 text-white" />
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">NOUVEAU</Badge>
                      </div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-green-600 transition-colors">
                        Mes Candidatures
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Suivez toutes vos candidatures en un seul endroit
                      </p>
                      <div className="flex items-center text-green-600 font-medium text-sm">
                        Gérer
                        <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Section Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-7 h-7 text-purple-600" />
              Vos documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mes CVs */}
              <Link href="/my-cvs">
                <motion.div whileHover={{ y: -4 }}>
                  <Card className="group border-2 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-cyan-50/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-cyan-600 transition-colors">
                        Mes CVs
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Consultez et modifiez vos CVs créés
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>

              {/* Mes Lettres */}
              <Link href="/my-letters">
                <motion.div whileHover={{ y: -4 }}>
                  <Card className="group border-2 hover:border-pink-300 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-pink-50/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-pink-600 transition-colors">
                        Mes Lettres
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Gérez vos lettres de motivation
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Tips & Upgrade CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conseils */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Target className="w-5 h-5" />
                    Conseils du jour
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">
                      <strong>Personnalisez</strong> chaque CV selon l'offre ciblée
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">
                      <strong>Mettez en avant</strong> vos compétences les plus pertinentes
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">
                      <strong>Relisez</strong> attentivement avant d'envoyer
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upgrade CTA */}
            {subscription?.plan === "FREE" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      Passez au niveau supérieur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-blue-100">
                      Débloquez toutes les fonctionnalités premium et boostez votre recherche d'alternance
                    </p>
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        CVs et lettres illimités
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Tous les templates premium
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Support prioritaire
                      </li>
                    </ul>
                    <Link href="/pricing">
                      <Button className="w-full bg-white text-purple-600 hover:bg-gray-50 font-semibold">
                        Voir les offres
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


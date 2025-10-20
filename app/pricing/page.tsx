"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const plans = [
  {
    name: "Gratuit",
    price: 0,
    priceId: null,
    icon: Sparkles,
    color: "from-gray-500 to-gray-600",
    features: [
      "3 CV par mois",
      "2 templates de base",
      "Export PDF standard",
      "Génération IA basique",
      "1 lettre de motivation/mois",
    ],
  },
  {
    name: "Starter",
    price: 5.99,
    yearlyPrice: 57.49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    features: [
      "15 CV par mois",
      "4 templates premium",
      "Export PDF haute qualité",
      "IA optimisée",
      "5 lettres de motivation/mois",
      "Analyse CV basique",
      "7 jours d'essai gratuit",
    ],
  },
  {
    name: "Pro",
    price: 10.99,
    yearlyPrice: 105.50,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    popular: true,
    features: [
      "CV illimités",
      "Lettres illimitées",
      "Tous les templates",
      "Export PDF + DOCX",
      "Analyse CV complète + Score ATS",
      "Import CV automatique",
      "Support prioritaire",
      "Sans publicité",
      "7 jours d'essai gratuit",
    ],
  },
  {
    name: "Premium",
    price: 17.99,
    yearlyPrice: 172.70,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    features: [
      "Tout du Plan Pro",
      "Accès anticipé aux nouveautés",
      "Templates personnalisés",
      "Consultation 1-1 mensuelle",
      "API access",
      "Sans logo AlternaBoost",
      "7 jours d'essai gratuit",
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const { isSignedIn } = useUser();

  const handleSubscribe = async (priceId: string | null | undefined, planName: string) => {
    if (!priceId) {
      toast.error("Ce plan n'est pas encore disponible");
      return;
    }

    if (!isSignedIn) {
      toast.error("Veuillez vous connecter pour souscrire");
      window.location.href = "/sign-in?redirect_url=/pricing";
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceId,
          planType: planName.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur lors de la création de la session");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Choisissez votre{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Créez des CV professionnels avec l'IA. Essayez gratuitement pendant 7 jours !
            </p>

            {/* Toggle mensuel/annuel */}
            <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-lg">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-600"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full font-semibold transition-all relative ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-600"
                }`}
              >
                Annuel
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                  -20%
                </Badge>
              </button>
            </div>
          </motion.div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const displayPrice = billingCycle === "yearly" && plan.yearlyPrice 
                ? plan.yearlyPrice 
                : plan.price;

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white z-10">
                      ⭐ Populaire
                    </Badge>
                  )}
                  
                  <Card className={`h-full border-2 ${plan.popular ? 'border-purple-500 shadow-2xl' : 'border-gray-200'} overflow-hidden`}>
                    <CardHeader className={`bg-gradient-to-br ${plan.color} text-white p-6`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-8 h-8" />
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">{displayPrice}€</span>
                        {plan.price > 0 && (
                          <span className="text-white/80">
                            /{billingCycle === "yearly" ? "an" : "mois"}
                          </span>
                        )}
                      </div>
                      {billingCycle === "yearly" && plan.yearlyPrice && (
                        <p className="text-sm text-white/80 mt-1">
                          Soit {(plan.yearlyPrice / 12).toFixed(2)}€/mois
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        onClick={() => handleSubscribe(plan.priceId, plan.name)}
                        disabled={loading === plan.name || plan.price === 0}
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        } text-white`}
                      >
                        {loading === plan.name ? (
                          "Chargement..."
                        ) : plan.price === 0 ? (
                          "Actuel"
                        ) : (
                          `Essayer ${plan.name}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ ou garanties */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 mb-4">
              ✅ Annulation à tout moment • ✅ Pas de frais cachés • ✅ Support réactif
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

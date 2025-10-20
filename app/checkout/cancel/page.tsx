"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, HelpCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 md:p-12 text-center shadow-xl border-orange-100">
          {/* Icône d'annulation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2 
            }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="w-14 h-14 text-white" />
            </div>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Paiement annulé
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mb-8"
          >
            Vous avez annulé le processus de paiement. Aucun montant n'a été débité.
          </motion.p>

          {/* Informations utiles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left"
          >
            <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Besoin d'aide ?
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Si vous avez rencontré un problème avec le paiement, vous pouvez réessayer à tout moment</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Vous pouvez continuer à utiliser votre compte gratuit sans limitation de temps</span>
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>L'essai gratuit de 7 jours reste disponible à tout moment</span>
              </li>
            </ul>
          </motion.div>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => router.push("/pricing")}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold shadow-lg"
            >
              <CreditCard className="mr-2 w-5 h-5" />
              Réessayer
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Retour à l'accueil
            </Button>
          </motion.div>

          {/* Message de support */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-gray-500 mt-8"
          >
            Des questions ou problèmes ? Contactez-nous à{" "}
            <a 
              href="mailto:support@alternaboost.app" 
              className="text-violet-600 hover:underline font-medium"
            >
              support@alternaboost.app
            </a>
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
}

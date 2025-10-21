"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const syncSubscription = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        // Appeler l'API pour synchroniser l'abonnement
        const response = await fetch(`/api/stripe/sync?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.success) {
          setSessionData(data.subscription);
          
          // Attendre 3 secondes puis rediriger vers le dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      } catch (error) {
        console.error('Erreur synchro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncSubscription();
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 md:p-12 text-center shadow-xl border-violet-100">
          {/* Icône de succès animée */}
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
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Paiement réussi ! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mb-8"
          >
            Votre abonnement a été activé avec succès. Profitez de votre <strong>essai gratuit de 7 jours</strong> !
          </motion.p>

          {/* Informations sur l'essai */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-violet-50 border border-violet-200 rounded-lg p-6 mb-8 text-left"
          >
            <h2 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Prochaines étapes
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Un email de confirmation vous a été envoyé</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Votre essai gratuit de <strong>7 jours</strong> commence maintenant</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Aucun prélèvement avant la fin de l'essai</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Vous pouvez annuler à tout moment depuis votre tableau de bord</span>
              </li>
            </ul>
          </motion.div>

          {/* Session ID (pour debug) */}
          {sessionId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-gray-400 mb-6"
            >
              ID de session : {sessionId}
            </motion.p>
          )}

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold shadow-lg"
            >
              Accéder au tableau de bord
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/create-cv")}
              className="border-violet-300 text-violet-700 hover:bg-violet-50"
            >
              <FileText className="mr-2 w-5 h-5" />
              Créer mon premier CV
            </Button>
          </motion.div>

          {/* Message de support */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-gray-500 mt-8"
          >
            Des questions ? Contactez-nous à{" "}
            <a 
              href="mailto:support@alternaboost.app" 
              className="text-violet-600 hover:underline font-medium"
            >
              support@alternaboost.app
            </a>
          </motion.p>
        </Card>

        {/* Confettis effect (optionnel) */}
        <style jsx>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
      </motion.div>
    </div>
  );
}

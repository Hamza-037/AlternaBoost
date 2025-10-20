"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50/50 to-white pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Décoration subtile en arrière-plan */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Contenu gauche */}
          <div className="text-center lg:text-left">
            {/* Badge discret */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-sm">
                <motion.svg
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h-6.27A2 2 0 0 0 13 15.73V17h5a2 2 0 0 1 0 4H6a2 2 0 0 1 0-4h5v-1.27a2 2 0 0 0-1.73-1.98H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4c0-1.1.9-2 2-2Z" />
                </motion.svg>
                Optimisé par l&apos;IA
              </span>
            </motion.div>

            {/* Titre sobre et direct */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Créez un CV professionnel{" "}
              <span className="text-blue-600">en quelques minutes</span>
            </motion.h1>

            {/* Description claire et crédible */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Un outil simple et gratuit pour générer un CV adapté à votre recherche
              d&apos;alternance ou de stage. L&apos;intelligence artificielle reformule
              votre contenu pour le rendre plus impactant.
            </motion.p>

            {/* CTA clair et simple */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Link href="/create-cv">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 py-6 h-auto font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    Créer mon CV gratuitement
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-base px-8 py-6 h-auto font-medium"
                >
                  Voir un exemple
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats crédibles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-600"
            >
              {[
                { label: "100% gratuit" },
                { label: "Aucune inscription requise" },
                { label: "Export PDF immédiat" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Illustration droite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Illustration SVG simple d'un étudiant avec laptop */}
              <svg
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
              >
                {/* Bureau */}
                <rect x="50" y="350" width="400" height="20" fill="#E5E7EB" rx="4" />
                
                {/* Laptop */}
                <motion.g
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect x="150" y="250" width="200" height="120" fill="#1F2937" rx="8" />
                  <rect x="160" y="260" width="180" height="100" fill="#60A5FA" rx="4" />
                  <path d="M 120 370 L 330 370 L 310 390 L 140 390 Z" fill="#374151" />
                </motion.g>

                {/* Documents flottants */}
                <motion.g
                  animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <rect x="320" y="180" width="80" height="100" fill="white" stroke="#D1D5DB" strokeWidth="2" rx="4" />
                  <line x1="330" y1="200" x2="390" y2="200" stroke="#9CA3AF" strokeWidth="2" />
                  <line x1="330" y1="220" x2="390" y2="220" stroke="#9CA3AF" strokeWidth="2" />
                  <line x1="330" y1="240" x2="370" y2="240" stroke="#9CA3AF" strokeWidth="2" />
                </motion.g>

                <motion.g
                  animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <rect x="90" y="150" width="80" height="100" fill="white" stroke="#D1D5DB" strokeWidth="2" rx="4" />
                  <rect x="100" y="170" width="60" height="4" fill="#3B82F6" rx="2" />
                  <line x1="100" y1="190" x2="150" y2="190" stroke="#9CA3AF" strokeWidth="2" />
                  <line x1="100" y1="210" x2="150" y2="210" stroke="#9CA3AF" strokeWidth="2" />
                </motion.g>

                {/* Étoiles décoratives */}
                <motion.circle
                  cx="420"
                  cy="120"
                  r="4"
                  fill="#FBBF24"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle
                  cx="80"
                  cy="100"
                  r="3"
                  fill="#60A5FA"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle
                  cx="400"
                  cy="300"
                  r="3"
                  fill="#A78BFA"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


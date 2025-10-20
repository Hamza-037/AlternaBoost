"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const features = [
  {
    title: "Simple et rapide",
    description:
      "Remplissez un formulaire en quelques minutes. Aucune compétence en design requise.",
    step: "01",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    title: "Optimisé par l'IA",
    description:
      "L'intelligence artificielle reformule vos descriptions pour les rendre plus professionnelles.",
    step: "02",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h-6.27A2 2 0 0 0 13 15.73V17h5a2 2 0 0 1 0 4H6a2 2 0 0 1 0-4h5v-1.27a2 2 0 0 0-1.73-1.98H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4c0-1.1.9-2 2-2Z" />
      </svg>
    ),
  },
  {
    title: "Export PDF instantané",
    description:
      "Téléchargez votre CV au format PDF, prêt à être envoyé aux recruteurs.",
    step: "03",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="comment-ca-marche" className="py-20 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un processus simple en 3 étapes pour obtenir un CV professionnel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full bg-white relative overflow-hidden group">
                  {/* Numéro de l'étape en arrière-plan */}
                  <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-blue-50 transition-colors">
                    {feature.step}
                  </div>
                  
                  <CardHeader className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4 flex items-center justify-center text-white shadow-md"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


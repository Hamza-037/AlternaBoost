"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LetterFormSteps } from "@/components/letter/LetterFormSteps";
import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";

export default function CreateLetterPage() {
  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link href="/">
            <Button variant="ghost" className="mb-6 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Retour à l&apos;accueil
            </Button>
          </Link>

          {/* Badge IA */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-purple-800">Rédaction IA avec GPT-4</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
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
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Créez votre lettre de motivation
              </h1>
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mb-6">
            Remplissez vos informations, <span className="font-semibold text-purple-600">l'IA rédige automatiquement</span> une lettre personnalisée et percutante !
          </p>

          {/* Encadré explicatif IA */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✍️ L'IA rédige pour vous :</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✨ Une introduction captivante adaptée au poste</li>
                  <li>✨ Mise en valeur de vos expériences pertinentes</li>
                  <li>✨ Ton professionnel et personnalisé</li>
                  <li>✨ Conclusion motivante et call-to-action</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulaire par étapes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LetterFormSteps />
        </motion.div>

        {/* Informations complémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Conseils pour une lettre réussie
            </h3>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Soyez précis et authentique dans vos motivations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Mentionnez des éléments concrets sur l&apos;entreprise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Mettez en avant vos atouts en lien avec le poste</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h-6.27A2 2 0 0 0 13 15.73V17h5a2 2 0 0 1 0 4H6a2 2 0 0 1 0-4h5v-1.27a2 2 0 0 0-1.73-1.98H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4c0-1.1.9-2 2-2Z" />
              </svg>
              L&apos;IA rédige automatiquement
            </h3>
            <ul className="space-y-2 text-pink-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">✓</span>
                <span>Structure professionnelle en 3 paragraphes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">✓</span>
                <span>Ton adapté et personnalisé</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">✓</span>
                <span>Formules de politesse automatiques</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
}

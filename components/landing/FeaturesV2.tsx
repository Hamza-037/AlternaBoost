"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Palette, 
  FileText, 
  Download, 
  Brain, 
  Eye,
  Wand2,
  Sparkles,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Avancée",
    description: "GPT-4o-mini optimise votre contenu pour chaque poste",
    color: "from-blue-500 to-cyan-500",
    badge: "Nouveau"
  },
  {
    icon: Palette,
    title: "4 Templates Pro",
    description: "Modern, Premium, Creative, Minimal - choisissez votre style",
    color: "from-purple-500 to-pink-500",
    badge: "Populaire"
  },
  {
    icon: Wand2,
    title: "Personnalisation Totale",
    description: "Couleurs, polices, sections - créez un CV unique",
    color: "from-green-500 to-emerald-500",
    badge: "Exclusif"
  },
  {
    icon: Eye,
    title: "Preview Temps Réel",
    description: "Modifiez et voyez le résultat instantanément",
    color: "from-orange-500 to-red-500",
    badge: "Innovant"
  },
  {
    icon: FileText,
    title: "Lettres de Motivation",
    description: "Générez des lettres personnalisées avec l'IA",
    color: "from-indigo-500 to-purple-500",
    badge: "Bonus"
  },
  {
    icon: Download,
    title: "Export PDF Pro",
    description: "Téléchargez en PDF haute qualité, prêt à envoyer",
    color: "from-teal-500 to-blue-500",
    badge: "Essentiel"
  }
];

const processSteps = [
  {
    step: "1",
    title: "Remplissez le formulaire",
    description: "Informations personnelles, formation, expériences",
    icon: FileText,
    color: "bg-blue-100 text-blue-600"
  },
  {
    step: "2", 
    title: "L'IA optimise votre contenu",
    description: "Reformulation professionnelle automatique",
    icon: Brain,
    color: "bg-purple-100 text-purple-600"
  },
  {
    step: "3",
    title: "Personnalisez le design",
    description: "Template, couleurs, sections selon vos goûts",
    icon: Palette,
    color: "bg-green-100 text-green-600"
  },
  {
    step: "4",
    title: "Téléchargez votre CV",
    description: "PDF professionnel prêt à envoyer",
    icon: Download,
    color: "bg-orange-100 text-orange-600"
  }
];

export function FeaturesV2() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi choisir{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AlternaBoost
            </span>{" "}
            ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une solution complète qui combine l'intelligence artificielle 
            et la personnalisation pour créer le CV parfait.
          </p>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Processus étape par étape */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-lg text-gray-600">
              En 4 étapes simples, créez un CV professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {/* Ligne de connexion */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-4" />
                )}
                
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg`}>
                  {step.step}
                </div>
                
                <div className={`p-4 rounded-xl ${step.color} mb-4 mx-auto w-fit`}>
                  <step.icon className="w-6 h-6" />
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section avantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Avantages exclusifs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700 font-medium">100% Gratuit</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Aucune inscription</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Résultats instantanés</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

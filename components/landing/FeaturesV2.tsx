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
    title: "IA Avancée GPT-4",
    description: "GPT-4o-mini optimise votre contenu pour maximiser vos chances",
    color: "from-blue-500 to-cyan-500",
    badge: "Populaire",
    gradient: "from-blue-50 to-cyan-50"
  },
  {
    icon: Palette,
    title: "4 Templates Premium",
    description: "Modern, Premium, Creative, Minimal - un style pour chaque profil",
    color: "from-purple-500 to-pink-500",
    badge: "Premium",
    gradient: "from-purple-50 to-pink-50"
  },
  {
    icon: Wand2,
    title: "Personnalisation Illimitée",
    description: "Couleurs, polices, sections, espacement - contrôle total",
    color: "from-green-500 to-emerald-500",
    badge: "Premium",
    gradient: "from-green-50 to-emerald-50"
  },
  {
    icon: Eye,
    title: "Preview Instantané",
    description: "Visualisez chaque modification en temps réel, sans attente",
    color: "from-orange-500 to-red-500",
    badge: "Nouveau",
    gradient: "from-orange-50 to-red-50"
  },
  {
    icon: FileText,
    title: "Lettres Intelligentes",
    description: "L'IA génère des lettres de motivation percutantes",
    color: "from-indigo-500 to-purple-500",
    badge: "Nouveau",
    gradient: "from-indigo-50 to-purple-50"
  },
  {
    icon: Download,
    title: "Export Professionnel",
    description: "PDF haute qualité, compatible ATS, prêt pour l'envoi",
    color: "from-teal-500 to-blue-500",
    badge: "Populaire",
    gradient: "from-teal-50 to-blue-50"
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

        {/* Grille des fonctionnalités avec design amélioré */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <Card className={`h-full border-0 bg-gradient-to-br ${feature.gradient} group overflow-hidden relative`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
                <CardContent className="p-8 relative z-10">
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-semibold bg-gradient-to-r ${feature.color} text-white border-0`}
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  
                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center relative z-10"
              >
                {/* Ligne de connexion animée - positionnée ENTRE les éléments */}
                {index < processSteps.length - 1 && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                    className="hidden lg:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 origin-left z-0"
                  />
                )}
                
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg relative`}
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75" />
                  <span className="relative">{step.step}</span>
                </motion.div>
                
                <div className={`inline-flex p-4 rounded-2xl ${step.color} mb-4 shadow-md`}>
                  <step.icon className="w-8 h-8" />
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section avantages avec design amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Nos avantages exclusifs
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour créer un CV professionnel rapidement
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100"
            >
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-gray-900 font-bold text-lg">100% Gratuit</span>
              <span className="text-gray-600 text-sm">Pas de frais cachés, jamais</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100"
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-gray-900 font-bold text-lg">Sans inscription</span>
              <span className="text-gray-600 text-sm">Commencez immédiatement</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100"
            >
              <div className="p-3 bg-purple-100 rounded-full">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <span className="text-gray-900 font-bold text-lg">Résultats instantanés</span>
              <span className="text-gray-600 text-sm">Votre CV en 2 minutes</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

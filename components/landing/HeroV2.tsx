"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CVMockup } from "./CVMockup";

export function HeroV2() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background avec gradient animé amélioré */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50" />
      
      {/* Grid pattern subtil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Formes géométriques animées améliorées */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: 180,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-300/10 to-blue-300/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Contenu texte à gauche */}
          <div className="text-center lg:text-left">
        {/* Badge de nouveauté */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge 
            variant="secondary" 
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Générateur de CV intelligent propulsé par l'IA
          </Badge>
        </motion.div>

        {/* Titre principal avec effet de typing */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Créez votre CV{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            professionnel
          </span>{" "}
          en 2 minutes
        </motion.h1>

        {/* Sous-titre avec animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          L'IA génère un CV sur mesure, vous le personnalisez à votre goût, 
          et vous le téléchargez en PDF. Simple, rapide, efficace.
        </motion.p>


        {/* CTA avec animations et design amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link href="/create-cv-v2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Créer mon CV maintenant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </Link>
          
          <Link href="/exemples">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 hover:border-blue-500 px-10 py-6 text-lg font-semibold hover:bg-blue-50 transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm"
              >
                Voir les exemples
              </Button>
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>100% Sécurisé</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Gratuit</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Sans inscription</span>
          </div>
        </motion.div>

          </div>

          {/* Mockup CV à droite */}
          <div className="hidden lg:block">
            <CVMockup />
          </div>
        </div>

        {/* Indicateur de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

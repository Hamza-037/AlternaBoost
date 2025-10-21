"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle, Star } from "lucide-react";

export function CVMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Card principale du CV mockup */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100 overflow-hidden transform perspective-1000">
        {/* Badge "Premium Quality" */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" />
          Premium
        </div>

        {/* En-tête du CV */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              JS
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-600 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        {/* Section Expérience */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <div className="h-3 bg-blue-600 rounded w-24"></div>
          </div>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="h-3 bg-blue-600 rounded w-28 mb-2"></div>
              <div className="h-2 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-4/5"></div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <div className="h-3 bg-purple-600 rounded w-24 mb-2"></div>
              <div className="h-2 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Section Compétences */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div className="h-3 bg-green-600 rounded w-20"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full w-16"></div>
            <div className="h-6 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full w-20"></div>
            <div className="h-6 bg-gradient-to-r from-green-100 to-green-200 rounded-full w-14"></div>
            <div className="h-6 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-18"></div>
          </div>
        </div>

        {/* Effet de brillance animé */}
        <motion.div
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
      </div>

      {/* Badges flottants animés */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute -bottom-4 -left-4 bg-white rounded-full shadow-xl p-3 border-2 border-green-500"
      >
        <CheckCircle className="w-6 h-6 text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-xl p-3"
      >
        <Star className="w-6 h-6 text-white fill-white" />
      </motion.div>

      {/* Effet de floating */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 pointer-events-none"
      />
    </motion.div>
  );
}


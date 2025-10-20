"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Marie L.",
    role: "Étudiante en Master Informatique",
    content:
      "J'ai trouvé mon alternance grâce à AlternaBoost. Le CV généré était vraiment professionnel et m'a permis de me démarquer.",
    rating: 5,
    avatar: "M",
  },
  {
    name: "Thomas D.",
    role: "Étudiant en Commerce",
    content:
      "Très pratique pour reformuler mes expériences. L'IA a vraiment amélioré la qualité de mon CV sans que j'aie à passer des heures dessus.",
    rating: 5,
    avatar: "T",
  },
  {
    name: "Sarah K.",
    role: "Étudiante en Communication",
    content:
      "Simple et efficace. En 10 minutes j'avais un CV propre et prêt à envoyer. Exactement ce qu'il me fallait.",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Lucas M.",
    role: "Étudiant en Design",
    content:
      "Interface intuitive et résultat au top. Je recommande à tous mes camarades de promo.",
    rating: 5,
    avatar: "L",
  },
];

const stats = [
  { value: "10,000+", label: "CV créés", icon: "📄", gradient: "from-blue-500 to-cyan-500" },
  { value: "4.9/5", label: "Satisfaction", icon: "⭐", gradient: "from-yellow-500 to-orange-500" },
  { value: "2 min", label: "Temps moyen", icon: "⚡", gradient: "from-purple-500 to-pink-500" },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotation du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="temoignages" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Stats améliorés */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
              >
                {/* Effet de fond au hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="text-5xl mb-4 relative z-10"
                >
                  {stat.icon}
                </motion.div>
                <div className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 relative z-10`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium relative z-10">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel avec design amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ils ont réussi avec{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AlternaBoost
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rejoignez des milliers d'étudiants qui ont décroché leur alternance grâce à un CV professionnel
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-gray-100 shadow-2xl bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
                  {/* Decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <CardContent className="pt-12 pb-12 relative z-10">
                    <div className="flex flex-col items-center text-center">
                      {/* Avatar amélioré */}
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                        <span className="relative">{testimonials[currentIndex].avatar}</span>
                      </motion.div>

                      {/* Stars améliorées */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <motion.svg
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.1, type: "spring" }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-yellow-400 drop-shadow-sm"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </motion.svg>
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl font-medium">
                        &quot;{testimonials[currentIndex].content}&quot;
                      </p>

                      {/* Author */}
                      <div>
                        <div className="font-bold text-gray-900 text-xl">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-base text-gray-600 mt-1">
                          {testimonials[currentIndex].role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons améliorés */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full shadow-xl hover:shadow-2xl bg-white border-2 w-12 h-12 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full shadow-xl hover:shadow-2xl bg-white border-2 w-12 h-12 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </motion.div>
          </div>

          {/* Dots améliorés */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-10 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                    : "w-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


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
  { value: "2 500+", label: "CV créés", icon: "📄" },
  { value: "94%", label: "Taux de satisfaction", icon: "⭐" },
  { value: "< 5 min", label: "Temps moyen", icon: "⚡" },
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
        {/* Stats */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-4xl mb-3"
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Ce qu&apos;en disent les étudiants
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des milliers d&apos;étudiants utilisent AlternaBoost pour créer leur CV.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border border-gray-200 shadow-lg bg-white">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center text-center">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                        {testimonials[currentIndex].avatar}
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <motion.svg
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-yellow-400"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </motion.svg>
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed max-w-2xl">
                        &quot;{testimonials[currentIndex].content}&quot;
                      </p>

                      {/* Author */}
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonials[currentIndex].role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg"
            >
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full shadow-md hover:shadow-lg"
            >
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
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


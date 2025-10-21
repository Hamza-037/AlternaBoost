"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { 
  Menu, 
  X, 
  FileText, 
  Mail, 
  Eye, 
  Sparkles,
  ChevronDown,
  ExternalLink
} from "lucide-react";

export function HeaderV2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Accueil", href: "/" },
    { 
      name: "Créer CV", 
      href: "/create-cv-v2",
      badge: "Populaire"
    },
    { 
      name: "Lettre", 
      href: "/create-letter",
      badge: "Nouveau"
    },
    { name: "Exemples", href: "/exemples" },
    { 
      name: "Tarifs", 
      href: "/pricing",
      badge: "7j gratuit"
    },
  ];

  const features = [
    {
      title: "CV Professionnel",
      description: "Générez un CV optimisé par l'IA",
      href: "/create-cv-v2",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Lettre de Motivation", 
      description: "Lettres personnalisées automatiquement",
      href: "/create-letter",
      icon: Mail,
      color: "text-purple-600"
    },
    {
      title: "Exemples de CV",
      description: "Inspirez-vous de nos modèles",
      href: "/exemples",
      icon: Eye,
      color: "text-green-600"
    }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
            >
              A
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                AlternaBoost
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Générateur de CV IA</p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800"
                  >
                    {item.badge}
                  </Badge>
                )}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"
                />
              </Link>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">
                  Connexion
                </Button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <Link href="/create-cv-v2">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Créer mon CV
              </Button>
            </Link>
          </div>

          {/* Menu Mobile */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-4">
                {/* Navigation Mobile */}
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Features Mobile */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 px-3">
                    Fonctionnalités
                  </h3>
                  <div className="space-y-2">
                    {features.map((feature) => (
                      <Link
                        key={feature.title}
                        href={feature.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                        <div>
                          <div className="font-medium text-gray-900">{feature.title}</div>
                          <div className="text-sm text-gray-500">{feature.description}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Mobile */}
                <div className="border-t border-gray-200 pt-4">
                  <Link href="/create-cv-v2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Créer mon CV
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

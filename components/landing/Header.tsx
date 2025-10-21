"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm"
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
                className="text-white"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </motion.div>
            <span className="text-lg md:text-xl font-bold text-gray-900">
              AlternaBoost
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#comment-ca-marche"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Comment ça marche
            </a>
            <Link
              href="/exemples"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Exemples
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Tarifs
            </Link>
            <Link
              href="/create-letter"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Lettre de motivation
            </Link>
          </nav>

          {/* CTA Desktop */}
          <div className="hidden md:block">
            <Link href="/create-cv-v2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                Créer mon CV
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menu"
          >
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
              {isMobileMenuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <nav className="py-4 space-y-4">
                <a
                  href="#comment-ca-marche"
                  className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Comment ça marche
                </a>
              <Link
                href="/exemples"
                className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Exemples
              </Link>
              <Link
                href="/pricing"
                className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link
                href="/create-letter"
                className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Lettre de motivation
              </Link>
                <div className="px-4 pt-2">
                  <Link href="/create-cv-v2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Créer mon CV
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}


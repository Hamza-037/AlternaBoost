export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-400 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              </div>
              <span className="text-white font-bold text-xl">AlternaBoost</span>
            </div>
            <p className="text-base leading-relaxed max-w-md text-gray-300">
              Un outil gratuit pour créer des CV professionnels optimisés par
              l&apos;intelligence artificielle. Conçu pour les étudiants et alternants.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/create-cv" className="hover:text-white transition-colors">
                  Créer un CV
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Exemples
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Fonctionnalités
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@alternaboost.app" className="hover:text-white transition-colors">
                  Email
                </a>
              </li>
              <li>
                <span className="text-gray-500">
                  Mentions légales (à venir)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 AlternaBoost. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-500">
            Propulsé par l&apos;IA · Conçu pour les étudiants
          </p>
        </div>
      </div>
    </footer>
  );
}


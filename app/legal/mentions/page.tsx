import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";

export default function MentionsPage() {
  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Mentions Légales
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Éditeur du site</h2>
              <p className="text-gray-700">
                <strong>AlternaBoost</strong><br />
                [Votre adresse complète]<br />
                [Code postal et Ville]<br />
                France<br />
                Email : contact@alternaboost.com<br />
                Téléphone : [Votre numéro]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Directeur de publication</h2>
              <p className="text-gray-700">
                [Votre nom et prénom]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hébergement</h2>
              <p className="text-gray-700">
                Ce site est hébergé par :<br />
                <strong>Vercel Inc.</strong><br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                États-Unis<br />
                Site web : <a href="https://vercel.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
              </p>
              <p className="text-gray-700">
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Protection des données personnelles</h2>
              <p className="text-gray-700">
                Pour plus d'informations sur la protection de vos données personnelles, veuillez consulter notre{" "}
                <a href="/legal/privacy" className="text-blue-600 hover:underline">
                  Politique de confidentialité
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-700">
                Ce site utilise des cookies nécessaires à son fonctionnement, notamment pour l'authentification des utilisateurs via Clerk.
                Aucun cookie de tracking publicitaire n'est utilisé.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Crédits</h2>
              <p className="text-gray-700">
                Icons : Lucide Icons<br />
                Technologie : Next.js, TypeScript, Tailwind CSS<br />
                IA : OpenAI GPT-4o-mini
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


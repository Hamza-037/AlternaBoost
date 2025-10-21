import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Conditions Générales d'Utilisation
          </h1>

          <p className="text-gray-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objet</h2>
              <p className="text-gray-700">
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation du service AlternaBoost, ainsi que les droits et obligations des parties dans ce cadre.
              </p>
              <p className="text-gray-700 mt-3">
                L'accès au service implique l'acceptation pleine et entière des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description du service</h2>
              <p className="text-gray-700 mb-3">
                AlternaBoost est une plateforme en ligne permettant de :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Créer des CVs professionnels optimisés par intelligence artificielle</li>
                <li>Générer des lettres de motivation personnalisées</li>
                <li>Suivre ses candidatures d'alternance</li>
                <li>Exporter ses documents au format PDF</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Le service est accessible via le site web https://alternaboost.com (ou tout autre domaine associé).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Inscription et compte utilisateur</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">3.1 Conditions d'inscription</h3>
              <p className="text-gray-700">
                L'inscription est ouverte à toute personne physique âgée d'au moins 16 ans.
                Pour les mineurs, une autorisation parentale est requise.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">3.2 Création du compte</h3>
              <p className="text-gray-700">
                L'utilisateur s'engage à fournir des informations exactes et à jour lors de son inscription.
                Il est responsable de la confidentialité de ses identifiants de connexion.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">3.3 Suppression du compte</h3>
              <p className="text-gray-700">
                L'utilisateur peut supprimer son compte à tout moment depuis son espace personnel.
                La suppression entraîne l'effacement définitif de toutes les données associées (CVs, lettres, candidatures).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Tarifs et paiement</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.1 Plans disponibles</h3>
              <p className="text-gray-700 mb-3">
                AlternaBoost propose plusieurs formules :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Plan Gratuit</strong> : Accès limité (3 CVs/mois, 1 lettre/mois)</li>
                <li><strong>Plan Starter</strong> : 5,99€/mois (15 CVs, 5 lettres)</li>
                <li><strong>Plan Pro</strong> : 10,99€/mois (illimité)</li>
                <li><strong>Plan Premium</strong> : 17,99€/mois (illimité + fonctionnalités avancées)</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Les prix sont indiqués en euros TTC. Une réduction de 20% est appliquée sur les abonnements annuels.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.2 Essai gratuit</h3>
              <p className="text-gray-700">
                Tous les plans payants bénéficient d'une période d'essai gratuite de 7 jours.
                Aucun prélèvement n'est effectué pendant cette période.
                L'utilisateur peut annuler à tout moment avant la fin de l'essai.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.3 Paiement</h3>
              <p className="text-gray-700">
                Les paiements sont effectués de manière sécurisée via Stripe.
                L'abonnement est renouvelé automatiquement chaque mois (ou année) jusqu'à résiliation.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.4 Résiliation</h3>
              <p className="text-gray-700">
                L'utilisateur peut résilier son abonnement à tout moment depuis son espace "Mon Abonnement".
                La résiliation prend effet à la fin de la période en cours (pas de remboursement au prorata).
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.5 Droit de rétractation</h3>
              <p className="text-gray-700">
                Conformément à l'article L221-28 du Code de la consommation, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation.
                Ce droit est perdu si vous avez utilisé le service pendant cette période (sauf pendant l'essai gratuit).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Propriété intellectuelle</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.1 Contenu de la plateforme</h3>
              <p className="text-gray-700">
                Tous les éléments de la plateforme (design, code, textes, logos) sont la propriété exclusive d'AlternaBoost
                et sont protégés par le droit d'auteur et le droit des marques.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.2 Contenu généré par l'utilisateur</h3>
              <p className="text-gray-700">
                Les CVs et lettres que vous créez vous appartiennent entièrement.
                Vous conservez tous les droits sur vos contenus et pouvez les utiliser librement.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.3 Licence d'utilisation</h3>
              <p className="text-gray-700">
                En utilisant AlternaBoost, vous accordez à la plateforme une licence non-exclusive pour stocker,
                traiter et afficher vos contenus dans le cadre de la fourniture du service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Utilisation du service</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.1 Usage autorisé</h3>
              <p className="text-gray-700">
                Le service est destiné à un usage personnel et non commercial pour la recherche d'emploi ou d'alternance.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">6.2 Usage interdit</h3>
              <p className="text-gray-700 mb-3">
                Il est strictement interdit de :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Utiliser le service à des fins illégales ou frauduleuses</li>
                <li>Tenter de contourner les limitations techniques</li>
                <li>Extraire, copier ou reproduire le code source</li>
                <li>Revendre ou redistribuer les documents générés par des tiers</li>
                <li>Surcharger les serveurs (spam, abus)</li>
                <li>Utiliser des bots ou scripts automatisés</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intelligence Artificielle</h2>
              <p className="text-gray-700">
                AlternaBoost utilise l'intelligence artificielle (OpenAI GPT-4o-mini) pour optimiser le contenu de vos documents.
              </p>
              <p className="text-gray-700 mt-3">
                <strong>Important :</strong> Les contenus générés par l'IA sont des suggestions.
                Il est de votre responsabilité de vérifier, relire et personnaliser les contenus avant de les utiliser.
                AlternaBoost ne garantit pas l'exactitude ou la pertinence absolue des contenus générés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disponibilité du service</h2>
              <p className="text-gray-700">
                Nous nous efforçons de maintenir le service accessible 24h/24 et 7j/7,
                mais nous ne pouvons garantir une disponibilité absolue (maintenances, pannes techniques, force majeure).
              </p>
              <p className="text-gray-700 mt-3">
                Aucune indemnisation ne sera due en cas d'interruption temporaire du service,
                sauf interruption prolongée de plus de 7 jours consécutifs (remboursement au prorata).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Responsabilités</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">9.1 Responsabilité d'AlternaBoost</h3>
              <p className="text-gray-700">
                AlternaBoost s'engage à fournir un service de qualité mais ne peut être tenu responsable :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Du contenu généré par l'IA (qui reste indicatif)</li>
                <li>De l'utilisation faite des documents par l'utilisateur</li>
                <li>Du succès ou de l'échec d'une candidature</li>
                <li>De la perte de données en cas de force majeure</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">9.2 Responsabilité de l'utilisateur</h3>
              <p className="text-gray-700">
                L'utilisateur est seul responsable :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>De l'exactitude des informations qu'il fournit</li>
                <li>De la vérification et personnalisation des contenus générés</li>
                <li>De l'usage qu'il fait des documents créés</li>
                <li>De la sécurité de ses identifiants de connexion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications des CGU</h2>
              <p className="text-gray-700">
                AlternaBoost se réserve le droit de modifier les présentes CGU à tout moment.
                Les utilisateurs seront informés par email des modifications substantielles.
                La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Droit applicable et juridiction</h2>
              <p className="text-gray-700">
                Les présentes CGU sont soumises au droit français.
                En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
              </p>
              <p className="text-gray-700 mt-3">
                Conformément à l'article L.612-1 du Code de la consommation, vous pouvez recourir gratuitement
                à un médiateur de la consommation en cas de litige.
              </p>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact</h2>
              <p className="text-gray-700">
                Pour toute question concernant les présentes CGU :
              </p>
              <p className="text-gray-700 mt-3">
                <strong>Email :</strong> contact@alternaboost.com<br />
                <strong>Adresse :</strong> [Votre adresse complète]
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


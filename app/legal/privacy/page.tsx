import { HeaderV2 } from "@/components/landing/HeaderV2";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <>
      <HeaderV2 />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Politique de Confidentialité
          </h1>

          <p className="text-gray-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                AlternaBoost s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Données collectées</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.1 Données d'identification</h3>
              <p className="text-gray-700 mb-3">
                Lors de votre inscription, nous collectons :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Mot de passe (chiffré)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.2 Données de contenu</h3>
              <p className="text-gray-700 mb-3">
                Lorsque vous utilisez nos services, nous stockons :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Les CVs que vous créez</li>
                <li>Les lettres de motivation que vous générez</li>
                <li>Les candidatures que vous suivez</li>
                <li>Vos préférences (templates, langue)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.3 Données de paiement</h3>
              <p className="text-gray-700">
                Les informations de paiement sont traitées de manière sécurisée par Stripe. Nous ne stockons jamais vos données bancaires.
                Nous conservons uniquement :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>L'identifiant client Stripe</li>
                <li>Le type d'abonnement souscrit</li>
                <li>La date de renouvellement</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.4 Données techniques</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Adresse IP (pour la sécurité et le rate limiting)</li>
                <li>Type de navigateur et appareil</li>
                <li>Pages visitées et actions effectuées</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Utilisation des données</h2>
              <p className="text-gray-700 mb-3">
                Nous utilisons vos données pour :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Fournir et améliorer nos services</li>
                <li>Générer vos CVs et lettres via l'IA (OpenAI)</li>
                <li>Gérer votre abonnement et facturation</li>
                <li>Vous envoyer des notifications importantes (confirmations, alertes)</li>
                <li>Assurer la sécurité de la plateforme</li>
                <li>Améliorer l'expérience utilisateur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Partage des données</h2>
              <p className="text-gray-700 mb-3">
                Vos données peuvent être partagées avec :
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.1 Services tiers</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Clerk</strong> : Authentification et gestion des utilisateurs</li>
                <li><strong>Stripe</strong> : Traitement sécurisé des paiements</li>
                <li><strong>OpenAI</strong> : Génération de contenu IA (données anonymisées)</li>
                <li><strong>Supabase</strong> : Hébergement de base de données (UE)</li>
                <li><strong>Vercel</strong> : Hébergement de l'application</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.2 Anonymisation pour l'IA</h3>
              <p className="text-gray-700">
                Lorsque nous utilisons OpenAI pour générer du contenu, vos données sont traitées de manière anonyme.
                OpenAI n'utilise pas vos données pour entraîner ses modèles (conformément à notre contrat).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Vos droits (RGPD)</h2>
              <p className="text-gray-700 mb-3">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Droit d'accès</strong> : Consulter les données que nous détenons sur vous</li>
                <li><strong>Droit de rectification</strong> : Corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement</strong> : Supprimer votre compte et toutes vos données</li>
                <li><strong>Droit à la portabilité</strong> : Récupérer vos données dans un format exploitable</li>
                <li><strong>Droit d'opposition</strong> : Refuser certains traitements</li>
                <li><strong>Droit à la limitation</strong> : Limiter le traitement de vos données</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Pour exercer vos droits, contactez-nous à : <a href="mailto:privacy@alternaboost.com" className="text-blue-600 hover:underline">privacy@alternaboost.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Sécurité</h2>
              <p className="text-gray-700">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Chiffrement SSL/TLS pour toutes les connexions</li>
                <li>Mots de passe hachés avec bcrypt</li>
                <li>Rate limiting pour prévenir les abus</li>
                <li>Backups quotidiens chiffrés</li>
                <li>Accès restreint aux données (principe du moindre privilège)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-700 mb-3">
                Nous utilisons des cookies essentiels pour :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Maintenir votre session authentifiée (Clerk)</li>
                <li>Mémoriser vos préférences</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Nous n'utilisons pas de cookies de tracking publicitaire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Conservation des données</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Compte actif</strong> : Tant que votre compte existe</li>
                <li><strong>Après suppression</strong> : 30 jours (backup), puis suppression définitive</li>
                <li><strong>Données de facturation</strong> : 10 ans (obligation légale)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications</h2>
              <p className="text-gray-700">
                Nous nous réservons le droit de modifier cette politique de confidentialité.
                Toute modification sera communiquée par email aux utilisateurs enregistrés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <p className="text-gray-700">
                Pour toute question concernant cette politique ou vos données personnelles :
              </p>
              <p className="text-gray-700 mt-3">
                <strong>Email :</strong> privacy@alternaboost.com<br />
                <strong>Adresse :</strong> [Votre adresse complète]<br />
                <strong>DPO (Délégué à la Protection des Données) :</strong> [Nom si applicable]
              </p>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Autorité de contrôle</h2>
              <p className="text-gray-700">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
              </p>
              <p className="text-gray-700 mt-3">
                <strong>CNIL</strong><br />
                3 Place de Fontenoy<br />
                TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Téléphone : 01 53 73 22 22<br />
                Site web : <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


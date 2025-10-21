/**
 * Script de seed pour AlternaBoost
 * Génère des données de test pour le développement
 * 
 * Exécution: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  // ============================================
  // 1. CRÉER DES UTILISATEURS DE TEST
  // ============================================
  console.log('👤 Création des utilisateurs de test...');

  const userFree = await prisma.user.upsert({
    where: { email: 'free@test.com' },
    update: {},
    create: {
      clerkUserId: 'user_test_free_123',
      email: 'free@test.com',
      firstName: 'Marie',
      lastName: 'Dupont',
      plan: 'FREE',
      subscriptionStatus: 'active',
      cvsCreatedThisMonth: 2,
      lettersCreatedThisMonth: 1,
      usageResetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  const userPro = await prisma.user.upsert({
    where: { email: 'pro@test.com' },
    update: {},
    create: {
      clerkUserId: 'user_test_pro_456',
      email: 'pro@test.com',
      firstName: 'Thomas',
      lastName: 'Martin',
      plan: 'PRO',
      subscriptionStatus: 'active',
      stripeCustomerId: 'cus_test_pro_123',
      stripeSubscriptionId: 'sub_test_pro_123',
      currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      cvsCreatedThisMonth: 15,
      lettersCreatedThisMonth: 8,
      usageResetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  console.log(`✅ Utilisateurs créés: ${userFree.email}, ${userPro.email}`);

  // ============================================
  // 2. CRÉER DES CVS EXEMPLES
  // ============================================
  console.log('📄 Création de CVs de test...');

  const cvModern = await prisma.cV.create({
    data: {
      userId: userFree.id,
      template: 'modern',
      title: 'CV Développeur Web',
      status: 'completed',
      targetCompany: 'Google France',
      targetPosition: 'Développeur Frontend',
      downloadCount: 5,
      data: {
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie.dupont@email.com',
        telephone: '+33 6 12 34 56 78',
        formation: 'Master Informatique',
        ecole: 'Université Paris-Saclay',
        anneeFormation: '2024',
        experiences: [
          {
            poste: 'Développeuse Frontend',
            entreprise: 'StartupXYZ',
            periode: 'Jan 2023 - Présent',
            description: 'Développement d\'applications React avec TypeScript. Mise en place d\'une architecture scalable ayant réduit les temps de chargement de 40%.',
          },
          {
            poste: 'Stagiaire Développeuse',
            entreprise: 'TechCorp',
            periode: 'Mai 2022 - Août 2022',
            description: 'Contribution au développement du site e-commerce en Next.js. Implémentation de fonctionnalités d\'internationalisation.',
          },
        ],
        competences: 'React, TypeScript, Next.js, TailwindCSS, Node.js, PostgreSQL',
        objectif: 'Développeuse frontend passionnée par la création d\'expériences web modernes',
        entrepriseCiblee: 'Google France',
        objectifAmeliore: 'Développeuse frontend passionnée par la création d\'expériences web modernes et performantes. Spécialisée en React et TypeScript, je cherche à rejoindre une équipe innovante pour créer des produits qui font la différence.',
        experiencesAmeliorees: [
          {
            poste: 'Développeuse Frontend',
            entreprise: 'StartupXYZ',
            periode: 'Jan 2023 - Présent',
            description: 'Développement d\'applications React avec TypeScript. Mise en place d\'une architecture scalable ayant réduit les temps de chargement de 40%. Mentorat de 2 développeurs juniors.',
          },
        ],
        competencesAmeliorees: [
          'Frontend: React, Next.js, TypeScript, TailwindCSS',
          'Backend: Node.js, Express, PostgreSQL',
          'Outils: Git, Docker, CI/CD, Figma',
        ],
      },
    },
  });

  const cvPremium = await prisma.cV.create({
    data: {
      userId: userPro.id,
      template: 'premium',
      title: 'CV Data Scientist',
      status: 'completed',
      targetCompany: 'Meta',
      targetPosition: 'Data Scientist',
      downloadCount: 12,
      data: {
        nom: 'Martin',
        prenom: 'Thomas',
        email: 'thomas.martin@email.com',
        telephone: '+33 6 23 45 67 89',
        formation: 'Master Data Science',
        ecole: 'Télécom Paris',
        anneeFormation: '2023',
        experiences: [
          {
            poste: 'Data Scientist',
            entreprise: 'BlaBlaCar',
            periode: 'Sept 2023 - Présent',
            description: 'Analyse de données comportementales de 5M+ utilisateurs. Développement de modèles ML pour optimiser les recommandations de trajets (+15% conversion).',
          },
        ],
        competences: 'Python, Pandas, Scikit-learn, TensorFlow, SQL, Tableau',
        objectif: 'Data Scientist passionné par l\'IA et le ML',
        entrepriseCiblee: 'Meta',
      },
    },
  });

  console.log(`✅ CVs créés: ${cvModern.id}, ${cvPremium.id}`);

  // ============================================
  // 3. CRÉER DES LETTRES DE MOTIVATION
  // ============================================
  console.log('✉️ Création de lettres de motivation...');

  const letter1 = await prisma.letter.create({
    data: {
      userId: userFree.id,
      title: 'Lettre Google France',
      status: 'completed',
      targetCompany: 'Google France',
      targetPosition: 'Développeur Frontend',
      downloadCount: 3,
      generatedContent: `Madame, Monsieur,

Actuellement en Master Informatique à l'Université Paris-Saclay, je souhaite mettre mes compétences en développement frontend au service de Google France dans le cadre d'un poste de Développeur Frontend.

Passionnée par la création d'expériences web modernes, j'ai développé une solide expertise en React et TypeScript lors de mon expérience chez StartupXYZ. J'ai notamment conçu une architecture scalable qui a permis de réduire les temps de chargement de 40%, améliorant significativement l'expérience utilisateur pour plus de 50 000 utilisateurs quotidiens. Ma maîtrise de Next.js et TailwindCSS me permet de créer des interfaces performantes et accessibles.

Rejoindre Google France représenterait pour moi une opportunité unique de travailler sur des projets à impact mondial tout en contribuant à l'innovation technologique. Je suis disponible dès maintenant et serais ravie d'échanger avec vous sur ma candidature.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
      data: {
        prenom: 'Marie',
        nom: 'Dupont',
        email: 'marie.dupont@email.com',
        telephone: '+33 6 12 34 56 78',
        adresse: '123 Rue de Paris, 75001 Paris',
        entreprise: 'Google France',
        destinataire: 'Service Recrutement',
        posteVise: 'Développeur Frontend',
        motivations: 'Passionnée par le développement web moderne et l\'innovation',
        atouts: 'React, TypeScript, Next.js, expérience en startup',
        disponibilite: 'Immédiatement',
      },
    },
  });

  console.log(`✅ Lettre créée: ${letter1.id}`);

  // ============================================
  // 4. CRÉER DES ENTRÉES D'HISTORIQUE
  // ============================================
  console.log('📊 Création de l\'historique d\'usage...');

  await prisma.usageHistory.createMany({
    data: [
      {
        userId: userFree.id,
        action: 'cv_created',
        resourceType: 'cv',
        resourceId: cvModern.id,
        metadata: { template: 'modern' },
      },
      {
        userId: userFree.id,
        action: 'pdf_downloaded',
        resourceType: 'cv',
        resourceId: cvModern.id,
        metadata: { template: 'modern' },
      },
      {
        userId: userPro.id,
        action: 'cv_created',
        resourceType: 'cv',
        resourceId: cvPremium.id,
        metadata: { template: 'premium' },
      },
      {
        userId: userFree.id,
        action: 'letter_created',
        resourceType: 'letter',
        resourceId: letter1.id,
      },
    ],
  });

  console.log('✅ Historique créé');

  // ============================================
  // 5. CRÉER DES STATS QUOTIDIENNES
  // ============================================
  console.log('📈 Création des statistiques...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyStats.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      newUsers: 12,
      activeUsers: 45,
      cvsCreated: 28,
      lettersCreated: 15,
      newSubscriptions: 3,
      canceledSubscriptions: 1,
      revenue: 3597, // 35,97€ en centimes
    },
  });

  console.log('✅ Statistiques créées');

  console.log('\n✨ Seed terminé avec succès!\n');
  console.log('📝 Résumé:');
  console.log('  - 2 utilisateurs de test créés');
  console.log('  - 2 CVs exemples créés');
  console.log('  - 1 lettre de motivation créée');
  console.log('  - Historique d\'usage généré');
  console.log('  - Statistiques quotidiennes initialisées\n');
  console.log('🔐 Comptes de test:');
  console.log(`  - FREE: free@test.com (clerkUserId: user_test_free_123)`);
  console.log(`  - PRO: pro@test.com (clerkUserId: user_test_pro_456)\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });




/**
 * Client Prisma singleton pour AlternaBoost
 * Évite la création de multiples instances en développement
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// Helper pour fermer proprement la connexion
export async function disconnectDB() {
  await db.$disconnect();
}

// Vérifier la connexion à la base de données
export async function checkDatabaseConnection() {
  try {
    await db.$connect();
    console.log('✅ Connexion à la base de données réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    return false;
  }
}




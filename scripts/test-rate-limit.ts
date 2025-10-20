/**
 * Script de test pour le Rate Limiting
 * Usage: npm run test:rate-limit
 */

import { checkRateLimit, rateLimitConfigs } from '../lib/rate-limiter';

console.log('🧪 Test du Rate Limiting\n');

// Test 1: Requêtes successives sous la limite
console.log('📋 Test 1: Requêtes sous la limite');
console.log('Configuration: 5 requêtes par minute\n');

const testIp1 = 'test-ip-1';
for (let i = 1; i <= 3; i++) {
  const result = checkRateLimit(testIp1, rateLimitConfigs.openai);
  console.log(`Requête ${i}:`, {
    success: result.success ? '✅' : '❌',
    remaining: result.remaining,
    limit: result.limit,
  });
}

console.log('\n---\n');

// Test 2: Dépasser la limite
console.log('📋 Test 2: Dépassement de la limite');
console.log('Configuration: 5 requêtes par minute\n');

const testIp2 = 'test-ip-2';
for (let i = 1; i <= 7; i++) {
  const result = checkRateLimit(testIp2, rateLimitConfigs.openai);
  console.log(`Requête ${i}:`, {
    success: result.success ? '✅' : '❌ BLOQUÉE',
    remaining: result.remaining,
    resetIn: Math.ceil((result.reset - Date.now()) / 1000) + 's',
  });
}

console.log('\n---\n');

// Test 3: Configuration personnalisée
console.log('📋 Test 3: Configuration personnalisée');
const customConfig = {
  interval: 10 * 1000, // 10 secondes
  uniqueTokenPerInterval: 3, // 3 requêtes
};
console.log(`Configuration: ${customConfig.uniqueTokenPerInterval} requêtes par ${customConfig.interval / 1000}s\n`);

const testIp3 = 'test-ip-3';
for (let i = 1; i <= 5; i++) {
  const result = checkRateLimit(testIp3, customConfig);
  console.log(`Requête ${i}:`, {
    success: result.success ? '✅' : '❌ BLOQUÉE',
    remaining: result.remaining,
  });
}

console.log('\n---\n');

// Test 4: Attendre le reset
console.log('📋 Test 4: Test du reset après expiration');
console.log('Attendez 11 secondes...');

const testIp4 = 'test-ip-4';
checkRateLimit(testIp4, customConfig);
checkRateLimit(testIp4, customConfig);
checkRateLimit(testIp4, customConfig);
const beforeReset = checkRateLimit(testIp4, customConfig);
console.log('Avant reset:', {
  success: beforeReset.success ? '✅' : '❌ BLOQUÉE',
  remaining: beforeReset.remaining,
});

// Simuler l'attente (dans un vrai test, utiliser un timer)
console.log('⏳ Simulation de l\'attente de 11 secondes...');
setTimeout(() => {
  const afterReset = checkRateLimit(testIp4, customConfig);
  console.log('Après reset:', {
    success: afterReset.success ? '✅' : '❌',
    remaining: afterReset.remaining,
  });
  
  console.log('\n✅ Tests terminés !');
}, 11000);

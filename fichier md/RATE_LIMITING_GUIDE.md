# 🛡️ Rate Limiting & Gestion d'Erreurs

## 📋 Vue d'ensemble

Ce système fournit une protection contre les abus et une gestion d'erreurs centralisée pour l'application AlternaBoost.

---

## 🚦 Rate Limiting

### Configuration actuelle

| Endpoint | Limite | Fenêtre | Raison |
|----------|--------|---------|--------|
| `/api/generate-cv` | 5 requêtes | 1 minute | Coûts OpenAI élevés |
| `/api/generate-cv-data` | 5 requêtes | 1 minute | Coûts OpenAI élevés |
| `/api/analyze-cv` | 10 requêtes | 1 minute | Usage modéré |
| `/api/generate-letter` | 5 requêtes | 1 minute | Coûts OpenAI élevés |

### Comment fonctionne le rate limiting ?

1. **Identification** : Chaque utilisateur est identifié par son adresse IP
2. **Compteur** : Un compteur est incrémenté à chaque requête
3. **Fenêtre temporelle** : Le compteur est réinitialisé après la fenêtre (1 minute)
4. **Blocage** : Si la limite est atteinte, l'utilisateur reçoit une erreur 429

### Exemple de réponse en cas de limite atteinte

```json
{
  "error": "Trop de requêtes",
  "message": "Vous avez atteint la limite de 5 requêtes. Veuillez réessayer dans 45 secondes.",
  "limit": 5,
  "remaining": 0,
  "reset": "2025-10-20T14:30:00.000Z"
}
```

### Headers de réponse

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1729432200000
Retry-After: 45
```

---

## 🔧 Utilisation dans une nouvelle route API

### Exemple simple

```typescript
import { NextRequest } from "next/server";
import { applyRateLimit, getClientIp, rateLimitConfigs } from "@/lib/rate-limiter";
import { handleApiError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    // 1. Extraire l'IP du client
    const clientIp = getClientIp(request.headers);
    
    // 2. Appliquer le rate limiting
    const rateLimitResponse = await applyRateLimit(
      clientIp, 
      rateLimitConfigs.openai // ou .analysis, .download, .strict
    );
    
    // 3. Si limite atteinte, retourner l'erreur
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    // 4. Votre logique métier ici
    // ...
    
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Configuration personnalisée

```typescript
const customConfig = {
  interval: 5 * 60 * 1000, // 5 minutes
  uniqueTokenPerInterval: 20, // 20 requêtes
};

const rateLimitResponse = await applyRateLimit(clientIp, customConfig);
```

---

## ⚠️ Gestion d'Erreurs

### Types d'erreurs disponibles

```typescript
import { 
  ValidationError,
  OpenAIError,
  AuthError,
  RateLimitError,
  NotFoundError 
} from "@/lib/errors";

// Exemple d'utilisation
throw new ValidationError("L'email est invalide", {
  field: "email",
  value: "invalid-email"
});

throw new OpenAIError("Limite de tokens OpenAI atteinte");

throw new NotFoundError("CV non trouvé", { cvId: "123" });
```

### Format de réponse d'erreur

```json
{
  "error": "ValidationError",
  "message": "L'email est invalide",
  "type": "VALIDATION_ERROR",
  "statusCode": 400,
  "context": {
    "field": "email",
    "value": "invalid-email"
  }
}
```

### Logger les erreurs

```typescript
import { logger } from "@/lib/errors";

// En développement : affiche dans la console
// En production : à intégrer avec Sentry

logger.error("Erreur lors de la génération", error, {
  userId: "123",
  action: "generate-cv"
});

logger.warn("Limite presque atteinte", {
  remaining: 1,
  limit: 5
});

logger.info("CV généré avec succès", {
  cvId: "abc-123"
});
```

---

## 📊 Monitoring

### Métriques à surveiller

1. **Taux d'erreurs 429** : Si trop élevé, augmenter les limites
2. **Temps de réponse** : Détecter les ralentissements
3. **Erreurs OpenAI** : Surveiller les coûts et les limites API
4. **IPs bloquées** : Détecter les potentiels abus

### Commandes utiles en développement

```bash
# Tester le rate limiting
for i in {1..10}; do 
  curl -X POST http://localhost:3000/api/generate-cv-data \
    -H "Content-Type: application/json" \
    -d @test-data.json
done
```

---

## 🚀 Migration vers Redis (Production)

Pour une utilisation en production avec plusieurs instances, utilisez Redis :

```typescript
// lib/rate-limiter-redis.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
) {
  const key = `rate-limit:${identifier}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, Math.ceil(config.interval / 1000));
  }
  
  const ttl = await redis.ttl(key);
  
  return {
    success: current <= config.uniqueTokenPerInterval,
    limit: config.uniqueTokenPerInterval,
    remaining: Math.max(0, config.uniqueTokenPerInterval - current),
    reset: Date.now() + (ttl * 1000),
  };
}
```

### Installation

```bash
npm install @upstash/redis
```

### Variables d'environnement

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

---

## 🔐 Améliorations futures

### Authentification utilisateur

Lorsque l'authentification sera implémentée :

```typescript
// Utiliser l'ID utilisateur au lieu de l'IP
const userId = session.user.id;
const rateLimitResponse = await applyRateLimit(userId, rateLimitConfigs.openai);
```

### Tiers d'utilisateurs

```typescript
const userTier = await getUserTier(userId);

const config = {
  free: rateLimitConfigs.strict,      // 3 req/min
  premium: rateLimitConfigs.openai,   // 5 req/min
  enterprise: {                       // 50 req/min
    interval: 60 * 1000,
    uniqueTokenPerInterval: 50,
  },
}[userTier];
```

### Whitelist d'IPs

```typescript
const WHITELISTED_IPS = [
  "192.168.1.1",
  "10.0.0.1",
];

if (WHITELISTED_IPS.includes(clientIp)) {
  // Bypass rate limiting
}
```

---

## 📝 Messages d'erreur personnalisés

Tous les messages sont dans `lib/errors.ts` :

```typescript
export const ErrorMessages = {
  VALIDATION: {
    MISSING_FIELD: "Tous les champs obligatoires doivent être remplis",
    INVALID_EMAIL: "L'adresse email n'est pas valide",
    // ...
  },
  OPENAI: {
    API_KEY_MISSING: "La clé API OpenAI n'est pas configurée",
    RATE_LIMIT: "Trop de requêtes. Veuillez patienter quelques instants",
    // ...
  },
};
```

---

## 🧪 Tests

### Tester le rate limiting

```typescript
// tests/rate-limiter.test.ts
import { checkRateLimit } from "@/lib/rate-limiter";

describe("Rate Limiter", () => {
  it("devrait autoriser les requêtes sous la limite", () => {
    const result = checkRateLimit("test-ip", {
      interval: 60000,
      uniqueTokenPerInterval: 5,
    });
    
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });
  
  it("devrait bloquer après la limite", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("test-ip-2", {
        interval: 60000,
        uniqueTokenPerInterval: 5,
      });
    }
    
    const result = checkRateLimit("test-ip-2", {
      interval: 60000,
      uniqueTokenPerInterval: 5,
    });
    
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });
});
```

---

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans la console
2. Consultez la documentation OpenAI
3. Créez une issue sur GitHub

**Bon développement ! 🚀**

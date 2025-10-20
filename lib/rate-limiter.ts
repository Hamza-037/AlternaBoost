/**
 * Rate Limiter simple basé sur IP
 * Limite le nombre de requêtes par IP sur une période donnée
 */

interface RateLimitConfig {
  interval: number; // Durée de la fenêtre en millisecondes
  uniqueTokenPerInterval: number; // Nombre max de tokens (requêtes) par intervalle
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// Store en mémoire (pour développement - utiliser Redis en production)
const rateLimitStore = new Map<string, RateLimitStore>();

/**
 * Nettoie les anciennes entrées du store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Nettoyage automatique toutes les 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Vérifie si une requête est autorisée selon les limites
 * @param identifier - Identifiant unique (IP, user ID, etc.)
 * @param config - Configuration du rate limiter
 * @returns Object avec success, limit, remaining, reset
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute par défaut
    uniqueTokenPerInterval: 10, // 10 requêtes par minute
  }
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const tokenData = rateLimitStore.get(identifier);

  // Si pas de données ou reset time dépassé, créer nouvelle entrée
  if (!tokenData || now > tokenData.resetTime) {
    const newData: RateLimitStore = {
      count: 1,
      resetTime: now + config.interval,
    };
    rateLimitStore.set(identifier, newData);

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - 1,
      reset: newData.resetTime,
    };
  }

  // Si limite atteinte
  if (tokenData.count >= config.uniqueTokenPerInterval) {
    return {
      success: false,
      limit: config.uniqueTokenPerInterval,
      remaining: 0,
      reset: tokenData.resetTime,
    };
  }

  // Incrémenter le compteur
  tokenData.count++;
  rateLimitStore.set(identifier, tokenData);

  return {
    success: true,
    limit: config.uniqueTokenPerInterval,
    remaining: config.uniqueTokenPerInterval - tokenData.count,
    reset: tokenData.resetTime,
  };
}

/**
 * Extrait l'IP du client depuis les headers de la requête
 * @param headers - Headers de la requête Next.js
 * @returns IP du client
 */
export function getClientIp(headers: Headers): string {
  // Vérifier différentes sources d'IP (selon le déploiement)
  const forwarded = headers.get("x-forwarded-for");
  const real = headers.get("x-real-ip");
  const cloudflare = headers.get("cf-connecting-ip");

  if (cloudflare) return cloudflare;
  if (forwarded) return forwarded.split(",")[0].trim();
  if (real) return real;

  // Fallback pour développement local
  return "127.0.0.1";
}

/**
 * Middleware pour appliquer le rate limiting
 * @param identifier - Identifiant unique
 * @param config - Configuration optionnelle
 * @returns Promise<Response | null> - Response d'erreur si limite atteinte, null sinon
 */
export async function applyRateLimit(
  identifier: string,
  config?: RateLimitConfig
): Promise<Response | null> {
  const result = checkRateLimit(identifier, config);

  if (!result.success) {
    const resetDate = new Date(result.reset);
    const waitSeconds = Math.ceil((result.reset - Date.now()) / 1000);

    return new Response(
      JSON.stringify({
        error: "Trop de requêtes",
        message: `Vous avez atteint la limite de ${result.limit} requêtes. Veuillez réessayer dans ${waitSeconds} secondes.`,
        limit: result.limit,
        remaining: result.remaining,
        reset: resetDate.toISOString(),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
          "Retry-After": waitSeconds.toString(),
        },
      }
    );
  }

  // Pas de limite atteinte, retourner null
  return null;
}

/**
 * Configuration prédéfinie pour différents endpoints
 */
export const rateLimitConfigs = {
  // API OpenAI - plus stricte (coûts)
  openai: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 5, // 5 générations par minute
  },
  
  // Analyse de CV - modéré
  analysis: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 analyses par minute
  },
  
  // Téléchargement PDF - plus permissif
  download: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 20, // 20 téléchargements par minute
  },
  
  // Limite stricte pour éviter les abus
  strict: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 3, // 3 requêtes par minute
  },
};

/**
 * Retourne l'URL de base de l'application en fonction de l'environnement
 * - En production : utilise NEXT_PUBLIC_APP_URL ou détecte automatiquement l'URL Render
 * - En développement : utilise localhost:3000
 */
export function getBaseUrl(): string {
  // 1. Si NEXT_PUBLIC_APP_URL est définie, l'utiliser (priorité maximale)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 2. En production (sur Render), utiliser l'URL Render
  if (process.env.RENDER) {
    // Render expose automatiquement RENDER_EXTERNAL_URL
    if (process.env.RENDER_EXTERNAL_URL) {
      return process.env.RENDER_EXTERNAL_URL;
    }
  }

  // 3. En développement, utiliser localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // 4. Fallback : essayer de détecter depuis les headers (côté serveur uniquement)
  // Note: cette fonction est appelée côté serveur dans les API routes
  return 'http://localhost:3000'; // Fallback sûr
}

/**
 * Version qui accepte la Request pour détecter l'URL depuis les headers
 * Utile pour les API routes
 */
export function getBaseUrlFromRequest(request: Request): string {
  // 1. Priorité à NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 2. Render
  if (process.env.RENDER && process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }

  // 3. Détecter depuis les headers de la requête
  const url = new URL(request.url);
  const protocol = url.protocol;
  const host = request.headers.get('host') || url.host;
  
  return `${protocol}//${host}`;
}


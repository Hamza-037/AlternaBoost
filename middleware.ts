import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes publiques (accessibles sans authentification)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/exemples',
  '/pricing',
  '/cleanup', // Page de nettoyage de session
  '/checkout(.*)', // Pages de confirmation de paiement
  '/api/webhook(.*)', // Pour les webhooks Stripe
]);

export default clerkMiddleware(async (auth, request) => {
  // Protection des routes privées
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

import { useEffect } from "react";

/**
 * Hook personnalisé pour sauvegarder automatiquement les données du formulaire
 * dans le localStorage avec un délai de debounce
 */
export function useAutoSave<T>(watch: T, key: string, delay: number = 1000) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(watch));
      } catch (error) {
        console.warn("Impossible de sauvegarder dans localStorage:", error);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [watch, key, delay]);
}

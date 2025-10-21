import { useEffect, useState } from 'react';

/**
 * Hook pour débouncer une valeur
 * @param value - La valeur à débouncer
 * @param delay - Le délai en millisecondes (défaut: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Créer un timeout pour mettre à jour la valeur debouncée
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timeout si la valeur change avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


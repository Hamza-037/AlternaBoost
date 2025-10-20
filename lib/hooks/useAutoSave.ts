import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseAutoSaveOptions<T> {
  data: T;
  key: string;
  delay?: number; // Délai en ms avant la sauvegarde (défaut: 2000ms)
  enabled?: boolean; // Activer/désactiver l'auto-save
}

/**
 * Hook personnalisé pour sauvegarder automatiquement les données dans localStorage
 * Affiche un toast de confirmation après chaque sauvegarde
 */
export function useAutoSave<T>({
  data,
  key,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isFirstRender = useRef(true);

  const save = useCallback(() => {
    if (!enabled) return;

    try {
      localStorage.setItem(key, JSON.stringify(data));
      
      // Ne pas afficher le toast au premier rendu
      if (!isFirstRender.current) {
        toast.success("Brouillon sauvegardé", {
          duration: 2000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur de sauvegarde", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  }, [data, key, enabled]);

  useEffect(() => {
    // Marquer le premier rendu comme terminé après 1 seconde
    const firstRenderTimeout = setTimeout(() => {
      isFirstRender.current = false;
    }, 1000);

    return () => clearTimeout(firstRenderTimeout);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Nettoyer le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Créer un nouveau timeout pour sauvegarder après le délai
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  // Fonction pour récupérer les données sauvegardées
  const loadSaved = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      return null;
    }
  }, [key]);

  // Fonction pour supprimer les données sauvegardées
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
      toast.info("Brouillon supprimé", {
        duration: 2000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }, [key]);

  return { loadSaved, clearSaved };
}


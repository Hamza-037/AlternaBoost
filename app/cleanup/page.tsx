"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CleanupPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleCleanup = async () => {
    try {
      // Déconnexion complète
      await signOut();
      
      // Supprimer tous les cookies localStorage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        // Supprimer les cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      }
      
      alert("Session nettoyée ! Vous pouvez maintenant vous reconnecter.");
      router.push("/sign-in");
    } catch (error) {
      console.error("Erreur nettoyage:", error);
      alert("Nettoyage effectué. Rechargez la page (F5) puis reconnectez-vous.");
      window.location.href = "/sign-in";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4">
      <Card className="p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">🔧 Nettoyer la session</h1>
        <p className="text-gray-600 mb-6">
          Cette page va nettoyer votre session Clerk et supprimer tous les cookies corrompus.
          Utile si vous avez des problèmes de connexion.
        </p>
        <Button 
          onClick={handleCleanup}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        >
          Nettoyer et se déconnecter
        </Button>
      </Card>
    </div>
  );
}

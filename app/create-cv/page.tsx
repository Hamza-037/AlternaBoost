"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateCVPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers la nouvelle version
    router.replace("/create-cv-fusion");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
}

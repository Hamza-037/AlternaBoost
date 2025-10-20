import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlternaBoost - Créez votre CV professionnel avec l'IA",
  description: "Créez automatiquement un CV professionnel et une lettre de motivation personnalisée grâce à l'intelligence artificielle. Gratuit, rapide et optimisé pour les étudiants et alternants.",
  keywords: ["CV", "alternance", "stage", "étudiant", "IA", "intelligence artificielle"],
  openGraph: {
    title: "AlternaBoost - CV professionnel avec l'IA",
    description: "Créez automatiquement un CV professionnel optimisé par l'IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}

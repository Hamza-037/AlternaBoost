import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { text, field } = await request.json();

    if (!text || !field) {
      return NextResponse.json({ error: "Texte et champ requis" }, { status: 400 });
    }

    let prompt = "";
    
    switch (field) {
      case "objectif":
        prompt = `Améliore cet objectif professionnel pour un CV. Rends-le plus percutant, professionnel et adapté au marché du travail français. Maximum 3 phrases.

Objectif original : "${text}"

Objectif amélioré :`;
        break;
        
      case "experience_description":
        prompt = `Reformule cette description d'expérience professionnelle pour un CV. Utilise des verbes d'action, quantifie les résultats si possible, et rends le texte plus impactant. Maximum 2-3 phrases.

Description originale : "${text}"

Description améliorée :`;
        break;
        
      default:
        prompt = `Améliore ce texte pour un CV professionnel en français : "${text}"`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en rédaction de CV professionnels. Tu reformules et améliores le contenu pour le rendre plus percutant et professionnel. Réponds uniquement avec le texte amélioré, sans introduction ni explication.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const optimized = completion.choices[0].message?.content?.trim() || text;

    return NextResponse.json({ optimized });
  } catch (error) {
    console.error("Erreur optimisation IA:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'optimisation" },
      { status: 500 }
    );
  }
}


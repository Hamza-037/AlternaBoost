import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { letterData, paragraphIndex, context } = await req.json();

    // Récupérer le paragraphe actuel
    const paragraphs = letterData.generatedContent.split("\n\n");
    const currentParagraph = paragraphs[paragraphIndex];

    // Construire le prompt pour OpenAI
    const prompt = `Tu es un expert en rédaction de lettres de motivation professionnelles.

Contexte :
- Poste visé : ${context.posteVise}
- Entreprise : ${context.entreprise}
- Motivations : ${context.motivations}
- Atouts : ${context.atouts}

Paragraphe actuel à régénérer :
${currentParagraph}

Consignes :
1. Régénère ce paragraphe en gardant la même structure et intention
2. Améliore la formulation et rends-le plus impactant
3. Reste professionnel et personnalisé
4. Ne génère QUE le paragraphe, pas de titre ni d'en-tête
5. Maximum 200 mots

Paragraphe régénéré :`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant expert en rédaction de lettres de motivation. Tu réponds toujours en français professionnel.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur OpenAI:", error);
      return NextResponse.json(
        { error: "Erreur lors de la génération avec l'IA" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const newParagraph = data.choices[0].message.content.trim();

    return NextResponse.json({
      newParagraph,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la régénération:", error);
    return NextResponse.json(
      { error: "Erreur lors de la régénération du paragraphe" },
      { status: 500 }
    );
  }
}


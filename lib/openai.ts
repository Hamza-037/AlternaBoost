import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function ameliorerContenuCV(data: {
  objectif: string;
  experiences: Array<{ poste: string; entreprise: string; description: string }>;
  competences: string;
  entrepriseCiblee: string;
}) {
  const prompt = `Tu es un expert en rédaction de CV professionnels pour étudiants et alternants.
  
Contexte :
- Objectif professionnel : ${data.objectif}
- Entreprise ciblée : ${data.entrepriseCiblee}
- Compétences : ${data.competences}

Tâches :
1. Reformule l'objectif professionnel de manière concise, impactante et professionnelle (max 3 lignes).
2. Améliore les descriptions des expériences suivantes en utilisant des verbes d'action et en quantifiant les résultats quand possible.
3. Organise les compétences par catégories pertinentes.

Expériences à améliorer :
${data.experiences.map((exp, i) => `${i + 1}. ${exp.poste} chez ${exp.entreprise} : ${exp.description}`).join("\n")}

Réponds UNIQUEMENT avec un objet JSON valide dans ce format exact :
{
  "objectifAmeliore": "...",
  "experiencesAmeliorees": [
    {
      "poste": "...",
      "entreprise": "...",
      "description": "..."
    }
  ],
  "competencesAmeliorees": ["Catégorie 1: comp1, comp2", "Catégorie 2: comp3, comp4"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Tu es un expert en rédaction de CV professionnels. Tu réponds uniquement en JSON valide.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const result = completion.choices[0].message.content;
  if (!result) {
    throw new Error("Aucune réponse reçue de l'API OpenAI");
  }

  return JSON.parse(result);
}


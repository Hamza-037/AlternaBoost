import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

type CVExperience = {
  poste: string;
  entreprise: string;
  description: string;
};

interface AmeliorationCVInput {
  objectif: string;
  experiences: CVExperience[];
  competences: string;
  entrepriseCiblee: string;
  posteCible?: string;
  descriptionPoste?: string;
  missionsPrioritaires?: string;
  motsClesCibles?: string;
  tonSouhaite?: "professionnel" | "enthousiaste" | "percutant" | "sobre";
}

export async function ameliorerContenuCV(data: AmeliorationCVInput) {
  const contexteSupplementaire: string[] = [];
  if (data.posteCible) contexteSupplementaire.push(`- Poste visé : ${data.posteCible}`);
  if (data.descriptionPoste) contexteSupplementaire.push(`- Résumé de l'offre : ${data.descriptionPoste}`);
  if (data.missionsPrioritaires) contexteSupplementaire.push(`- Missions prioritaires : ${data.missionsPrioritaires}`);
  if (data.motsClesCibles) contexteSupplementaire.push(`- Mots-clés à injecter : ${data.motsClesCibles}`);
  if (data.tonSouhaite) contexteSupplementaire.push(`- Ton souhaité : ${data.tonSouhaite}`);

  const prompt = `Tu es un expert en rédaction de CV pour étudiants et alternants.

Contexte candidat :
- Objectif professionnel : ${data.objectif}
- Entreprise ciblée : ${data.entrepriseCiblee}
- Compétences brutes : ${data.competences}
${contexteSupplementaire.length ? `${contexteSupplementaire.join("\n")}
` : ""}
Tâches :
1. Reformule l'objectif en 2-3 phrases percutantes (ton ${data.tonSouhaite ?? "professionnel"}).
2. Optimise chaque expérience avec verbes d'action, résultats chiffrés et mots-clés fournis quand pertinent.
3. Regroupe les compétences par catégories claires.
4. Crée un pitch personnalisé de 2 phrases aligné sur le poste visé.
5. Donne 3 recommandations concrètes pour renforcer le CV.

Expériences à optimiser :
${data.experiences.map((exp, index) => `${index + 1}. ${exp.poste} chez ${exp.entreprise} : ${exp.description}`).join("\n")}

Réponds uniquement avec un JSON valide de la forme :
{
  "objectifAmeliore": "...",
  "experiencesAmeliorees": [
    { "poste": "...", "entreprise": "...", "description": "..." }
  ],
  "competencesAmeliorees": ["Catégorie 1: comp1, comp2", "Catégorie 2: comp3, comp4"],
  "pitchPersonnalise": "...",
  "recommandationsIA": ["Recommandation 1", "Recommandation 2", "Recommandation 3"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Tu es un expert en rédaction de CV professionnels. Tu réponds uniquement en JSON valide.",
      },
      { role: "user", content: prompt },
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

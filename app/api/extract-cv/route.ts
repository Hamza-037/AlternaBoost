import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { applyRateLimit } from "@/lib/rate-limiter";
import { handleApiError, ValidationError } from "@/lib/errors";
import type { CVExtractionResponse, ExtractedCVData } from "@/types/cv-extraction";

// Configuration pour accepter les fichiers
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log("[extract-cv] Début de la requête");
    
    // 1. Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "127.0.0.1";
    await applyRateLimit(clientIp, {
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 3, // Max 3 extractions par minute (c'est plus lourd)
    });

    console.log("[extract-cv] Rate limit OK");

    // 2. Récupérer le fichier du FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new ValidationError("Aucun fichier fourni");
    }

    console.log("[extract-cv] Fichier reçu:", file.name, file.type, file.size);

    // 3. Valider le type de fichier
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError("Type de fichier non supporté. Utilisez PDF, DOCX ou TXT");
    }

    // 4. Valider la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new ValidationError("Le fichier est trop volumineux (max 10MB)");
    }

    // 5. Convertir le fichier en texte
    let cvText = "";
    const arrayBuffer = await file.arrayBuffer();
    
    if (file.type === "application/pdf") {
      // Pour les PDF, utiliser pdfjs-dist
      cvText = await extractTextFromPDF(arrayBuffer);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // Pour DOCX, extraction de texte avec mammoth
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ arrayBuffer });
      cvText = result.value;
    } else {
      // Pour TXT
      cvText = await file.text();
    }

    console.log("Texte extrait (premiers 500 caractères):", cvText.substring(0, 500));

    if (!cvText || cvText.trim().length < 50) {
      console.log("[extract-cv] Texte extrait trop court:", cvText.length, "caractères");
      throw new ValidationError("Le CV semble vide ou trop court");
    }

    console.log("[extract-cv] Extraction texte OK, longueur:", cvText.length);

    // 6. Extraire les données structurées avec OpenAI
    const extractedData = await extractCVData(cvText);

    console.log("[extract-cv] Données extraites:", JSON.stringify(extractedData, null, 2));

    // 7. Retourner les données extraites
    const response: CVExtractionResponse = {
      success: true,
      data: extractedData,
      message: "CV extrait avec succès"
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("[extract-cv] Erreur:", error);
    return handleApiError(error);
  }
}

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser();
      
      let textContent = '';
      
      // Événement de succès
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          console.log("[PDF Parser] Données reçues, nombre de pages:", pdfData.Pages?.length);
          
          // Extraire le texte de toutes les pages
          if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
            pdfData.Pages.forEach((page: any, pageIndex: number) => {
              console.log(`[PDF Parser] Page ${pageIndex + 1}, nombre de textes:`, page.Texts?.length);
              
              if (page.Texts && Array.isArray(page.Texts)) {
                page.Texts.forEach((text: any) => {
                  if (text.R && Array.isArray(text.R)) {
                    text.R.forEach((r: any) => {
                      if (r.T) {
                        // Décoder le texte URI-encodé avec gestion des erreurs
                        try {
                          textContent += decodeURIComponent(r.T) + ' ';
                        } catch (decodeError) {
                          // Si le décodage échoue, utiliser le texte brut
                          textContent += r.T.replace(/%/g, ' ') + ' ';
                        }
                      }
                    });
                  }
                });
              }
              textContent += '\n\n'; // Séparer les pages
            });
          }
          
          console.log("[PDF Parser] Texte extrait, longueur:", textContent.length);
          console.log("[PDF Parser] Extrait (premiers 200 chars):", textContent.substring(0, 200));
          
          if (textContent.trim().length === 0) {
            reject(new ValidationError("Le PDF semble vide ou le texte n'a pas pu être extrait"));
          } else {
            resolve(textContent.trim());
          }
        } catch (err) {
          console.error("[PDF Parser] Erreur dans le traitement:", err);
          reject(new ValidationError("Erreur lors de l'extraction du texte du PDF"));
        }
      });
      
      // Événement d'erreur
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error("Erreur PDF Parser:", errData);
        reject(new ValidationError("Impossible de lire le fichier PDF. Assurez-vous qu'il s'agit d'un PDF valide et non protégé."));
      });
      
      // Parser le buffer
      const buffer = Buffer.from(arrayBuffer);
      pdfParser.parseBuffer(buffer);
      
    } catch (error) {
      console.error("Erreur parsing PDF:", error);
      reject(new ValidationError("Impossible de lire le fichier PDF. Assurez-vous qu'il s'agit d'un PDF valide et non protégé."));
    }
  });
}

async function extractCVData(cvText: string): Promise<ExtractedCVData> {
  const prompt = `Tu es un expert en analyse de CV. Extrait les informations suivantes d'un CV.

CV à analyser :
${cvText.substring(0, 4000)} // Limite pour éviter les tokens excessifs

Extrait et structure les informations suivantes :
1. Prénom et nom
2. Email et téléphone
3. Adresse (si présente)
4. Dernière formation (diplôme, école, année)
5. Toutes les expériences professionnelles (poste, entreprise, période, description des missions)
6. Compétences techniques et soft skills
7. Objectif professionnel ou pitch (si présent)

Réponds UNIQUEMENT avec un JSON valide de cette structure exacte :
{
  "prenom": "string ou null",
  "nom": "string ou null",
  "email": "string ou null",
  "telephone": "string ou null",
  "adresse": "string ou null",
  "formation": "string ou null",
  "ecole": "string ou null",
  "anneeFormation": "string ou null",
  "experiences": [
    {
      "poste": "string",
      "entreprise": "string",
      "periode": "string",
      "description": "string"
    }
  ],
  "competences": "string (liste séparée par des virgules)",
  "objectif": "string ou null",
  "langueDetectee": "français/anglais/autre"
}

Règles importantes :
- Si une information n'est pas trouvée, utilise null
- Pour les expériences, inclus TOUTES celles trouvées dans le CV
- Pour les compétences, regroupe tout en une seule chaîne séparée par des virgules
- Garde les descriptions d'expériences complètes et fidèles au CV original
- Détecte la langue principale du CV`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Tu es un expert en extraction de données depuis des CV. Tu réponds uniquement en JSON valide, sans texte supplémentaire."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3, // Basse température pour plus de précision
    response_format: { type: "json_object" }
  });

  const result = completion.choices[0].message.content;
  if (!result) {
    throw new Error("Aucune réponse reçue de l'API OpenAI");
  }

  const extractedData: ExtractedCVData = JSON.parse(result);
  
  // Validation basique
  if (!extractedData.nom && !extractedData.prenom) {
    throw new ValidationError("Impossible d'extraire les informations du CV. Vérifiez que le fichier contient bien un CV.");
  }

  return extractedData;
}

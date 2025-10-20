import { renderToBuffer } from "@react-pdf/renderer";
import { LetterTemplate } from "./LetterTemplate";
import type { GeneratedLetter } from "@/types/letter";

/**
 * Génère une lettre de motivation au format PDF
 * 
 * @param data - Données de la lettre générée
 * @returns Buffer du PDF généré
 */
export async function generateLetterPDF(data: GeneratedLetter): Promise<Buffer> {
  const pdfBuffer = await renderToBuffer(<LetterTemplate data={data} />);
  return pdfBuffer;
}


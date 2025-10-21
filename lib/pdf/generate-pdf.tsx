import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PremiumCVTemplate } from "./PremiumCVTemplate";
import { ModernCVTemplate } from "./ModernCVTemplate";
import { CreativeCVTemplate } from "./CreativeCVTemplate";
import { MinimalCVTemplate } from "./MinimalCVTemplate";
import type { GeneratedCV, CVStyle, CVSection } from "@/types/cv";

export type CVTemplateType = "premium" | "modern" | "creative" | "minimal";

/**
 * Génère un CV au format PDF à partir des données structurées
 * 
 * @param data - Données du CV générées (avec améliorations IA)
 * @param template - Type de template à utiliser
 * @param profileImageUrl - URL de la photo de profil (optionnel)
 * @param style - Style personnalisé du CV (optionnel)
 * @param customSections - Sections personnalisées (optionnel)
 * @returns Buffer du PDF généré
 */
export async function generateCVPDF(
  data: GeneratedCV,
  template?: CVTemplateType,
  profileImageUrl?: string,
  style?: CVStyle,
  customSections?: CVSection[]
): Promise<Buffer> {
  // Utiliser le template depuis le style si disponible, sinon utiliser le paramètre, sinon "modern"
  const selectedTemplate = style?.template || template || "modern";
  
  let pdfBuffer: Buffer;
  
  switch (selectedTemplate) {
    case "modern":
      pdfBuffer = await renderToBuffer(
        <ModernCVTemplate 
          data={data}
          profileImageUrl={profileImageUrl}
        />
      );
      break;
      
    case "premium":
      pdfBuffer = await renderToBuffer(
        <PremiumCVTemplate data={data} />
      );
      break;
      
    case "creative":
      pdfBuffer = await renderToBuffer(
        <CreativeCVTemplate 
          data={data}
          style={style}
          profileImageUrl={profileImageUrl}
          customSections={customSections}
        />
      );
      break;
      
    case "minimal":
      pdfBuffer = await renderToBuffer(
        <MinimalCVTemplate 
          data={data}
          style={style}
          customSections={customSections}
        />
      );
      break;
      
    default:
      pdfBuffer = await renderToBuffer(
        <ModernCVTemplate data={data} profileImageUrl={profileImageUrl} />
      );
  }
  
  return pdfBuffer;
}
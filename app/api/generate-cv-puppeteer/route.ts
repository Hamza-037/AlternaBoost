import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { auth } from "@clerk/nextjs/server";
import type { GeneratedCV } from "@/types/cv";

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // 2. Récupérer les données du CV
    const body = await request.json();
    const cvData: GeneratedCV = body;
    const template = body.template || "modern";
    const profileImage = body.profileImageUrl || "";

    // 3. Générer le HTML du CV
    const html = generateCVHTML(cvData, template, profileImage);

    // 4. Lancer Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // 5. Charger le HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // 6. Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // CRUCIAL pour les gradients
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      },
      preferCSSPageSize: false,
    });

    await browser.close();

    // 7. Retourner le PDF
    const fileName = `CV_${cvData.prenom}_${cvData.nom}.pdf`;
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
}

// Fonction pour générer le HTML complet du CV
function generateCVHTML(cvData: GeneratedCV, template: string, profileImage: string): string {
  const { prenom, nom, email, telephone, formation, ecole, anneeFormation } = cvData;
  const objectif = cvData.pitchPersonnalise || cvData.objectifAmeliore || cvData.objectif || "";
  const experiences = cvData.experiencesAmeliorees || [];
  const competences = cvData.competencesAmeliorees || [];

  // Choix du template
  let templateHTML = "";
  
  switch (template) {
    case "premium":
      templateHTML = generatePremiumTemplate(cvData, profileImage);
      break;
    case "creative":
      templateHTML = generateCreativeTemplate(cvData, profileImage);
      break;
    case "minimal":
      templateHTML = generateMinimalTemplate(cvData);
      break;
    case "modern":
    default:
      templateHTML = generateModernTemplate(cvData, profileImage);
      break;
  }

  // Wrapper HTML complet
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CV ${prenom} ${nom}</title>
      
      <!-- Tailwind CSS -->
      <script src="https://cdn.tailwindcss.com"></script>
      
      <!-- Google Fonts -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @page {
          size: A4;
          margin: 0;
        }
        
        .cv-container {
          width: 210mm;
          min-height: 297mm;
          background: white;
        }
        
        /* Ensure images load */
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="cv-container">
        ${templateHTML}
      </div>
    </body>
    </html>
  `;
}

// ===== TEMPLATE 1: MODERNE =====
// Design professionnel avec header gradient bleu et icônes colorées
function generateModernTemplate(cvData: GeneratedCV, profileImage: string): string {
  const { prenom, nom, email, telephone, formation, ecole, anneeFormation } = cvData;
  const objectif = cvData.pitchPersonnalise || cvData.objectifAmeliore || cvData.objectif || "";
  const experiences = cvData.experiencesAmeliorees || [];
  const competences = cvData.competencesAmeliorees || [];

  return `
    <div class="w-full min-h-full bg-white relative overflow-hidden">
      <!-- Décorations géométriques en arrière-plan -->
      <div class="absolute top-0 right-0 w-64 h-64 opacity-5" style="background: radial-gradient(circle, #3B82F6 0%, transparent 70%);"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 opacity-5" style="background: radial-gradient(circle, #2563EB 0%, transparent 70%);"></div>

      <!-- Header avec gradient moderne et formes -->
      <div class="relative p-10 pb-8 text-white overflow-hidden" style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%); box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);">
        <!-- Formes décoratives -->
        <div class="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style="background: white; transform: translate(30%, -30%);"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 opacity-10" style="background: white; transform: translate(-20%, 20%) rotate(45deg);"></div>
        
        <div class="relative z-10 flex items-start justify-between gap-6">
          <div class="flex-1">
            <div class="inline-block px-4 py-1 mb-3 rounded-full text-xs font-bold uppercase tracking-wider" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px);">
              Profil Professionnel
            </div>
            <h1 class="text-6xl font-black mb-2 tracking-tight" style="text-shadow: 0 2px 10px rgba(0,0,0,0.1);">${prenom.toUpperCase()} ${nom.toUpperCase()}</h1>
            <div class="text-2xl font-semibold mb-6" style="color: rgba(255,255,255,0.95);">${formation || ""}</div>
            <div class="flex flex-wrap gap-5 text-sm">
              <div class="flex items-center gap-2 px-4 py-2 rounded-lg" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span class="font-medium">${email}</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 rounded-lg" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span class="font-medium">${telephone}</span>
              </div>
            </div>
          </div>
          ${profileImage ? `
          <div class="relative">
            <div class="absolute inset-0 rounded-2xl opacity-50 blur-xl" style="background: linear-gradient(135deg, #60A5FA, #93C5FD);"></div>
            <div class="relative w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
              <img src="${profileImage}" alt="Photo" class="w-full h-full object-cover" />
            </div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Corps du CV -->
      <div class="p-10 space-y-8">
        ${objectif ? `
        <!-- Objectif avec design card -->
        <section>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #3B82F6, #60A5FA);">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight" style="color: #1E40AF;">OBJECTIF PROFESSIONNEL</h2>
              <div class="h-1 w-20 rounded-full mt-1" style="background: linear-gradient(90deg, #3B82F6, transparent);"></div>
            </div>
          </div>
          <div class="ml-16 p-5 rounded-xl" style="background: linear-gradient(135deg, rgba(59,130,246,0.05), rgba(96,165,250,0.05)); border-left: 4px solid #3B82F6;">
            <p class="text-gray-800 leading-relaxed text-base">${objectif}</p>
          </div>
        </section>
        ` : ''}

        ${experiences.length > 0 ? `
        <!-- Expériences avec timeline -->
        <section>
          <div class="flex items-center gap-4 mb-5">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #3B82F6, #60A5FA);">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight" style="color: #1E40AF;">EXPÉRIENCES PROFESSIONNELLES</h2>
              <div class="h-1 w-20 rounded-full mt-1" style="background: linear-gradient(90deg, #3B82F6, transparent);"></div>
            </div>
          </div>
          <div class="ml-16 space-y-6 relative">
            <!-- Ligne verticale de timeline -->
            <div class="absolute left-0 top-2 bottom-2 w-0.5" style="background: linear-gradient(180deg, #3B82F6, #93C5FD);"></div>
            
            ${experiences.map((exp, index) => {
              const periode = cvData.experiences?.[index]?.periode || "";
              return `
              <div class="relative pl-8">
                <div class="absolute left-0 top-2 w-4 h-4 rounded-full shadow-md" style="background: white; border: 3px solid #3B82F6;"></div>
                <div class="p-5 rounded-xl transition-all" style="background: rgba(59,130,246,0.03); border: 1px solid rgba(59,130,246,0.1);">
                  <div class="flex items-start justify-between gap-4 mb-2">
                    <h3 class="text-xl font-bold text-gray-900">${exp.poste}</h3>
                    ${periode ? `
                    <span class="text-xs font-bold px-4 py-2 rounded-lg shrink-0 shadow-sm" style="background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: #1E40AF;">
                      ${periode}
                    </span>
                    ` : ''}
                  </div>
                  <p class="text-sm font-semibold mb-3" style="color: #3B82F6;">${exp.entreprise}</p>
                  <p class="text-gray-700 leading-relaxed">${exp.description}</p>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </section>
        ` : ''}

        ${formation ? `
        <!-- Formation -->
        <section>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #3B82F6, #60A5FA);">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight" style="color: #1E40AF;">FORMATION</h2>
              <div class="h-1 w-20 rounded-full mt-1" style="background: linear-gradient(90deg, #3B82F6, transparent);"></div>
            </div>
          </div>
          <div class="ml-16 p-5 rounded-xl" style="background: linear-gradient(135deg, rgba(59,130,246,0.05), rgba(96,165,250,0.05)); border-left: 4px solid #3B82F6;">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-1">${formation}</h3>
                ${ecole ? `<p class="text-base font-semibold" style="color: #3B82F6;">${ecole}</p>` : ''}
              </div>
              ${anneeFormation ? `
              <span class="text-xs font-bold px-4 py-2 rounded-lg shadow-sm" style="background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: #1E40AF;">
                ${anneeFormation}
              </span>
              ` : ''}
            </div>
          </div>
        </section>
        ` : ''}

        ${competences.length > 0 ? `
        <!-- Compétences -->
        <section>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #3B82F6, #60A5FA);">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight" style="color: #1E40AF;">COMPÉTENCES</h2>
              <div class="h-1 w-20 rounded-full mt-1" style="background: linear-gradient(90deg, #3B82F6, transparent);"></div>
            </div>
          </div>
          <div class="ml-16 flex flex-wrap gap-3">
            ${competences.map(comp => `
              <span class="px-5 py-2.5 text-sm font-bold rounded-xl shadow-sm transition-all" style="background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: #1E40AF; border: 2px solid rgba(59, 130, 246, 0.2);">
                ${comp}
              </span>
            `).join('')}
          </div>
        </section>
        ` : ''}
      </div>

      <!-- Footer avec branding -->
      <div class="px-10 pb-8">
        <div class="pt-6 border-t-2" style="border-color: rgba(59, 130, 246, 0.1);">
          <p class="text-center text-xs font-medium text-gray-400">CV généré avec ❤️ par <span style="color: #3B82F6; font-weight: 700;">AlternaBoost</span></p>
        </div>
      </div>
    </div>
  `;
}

// ===== TEMPLATE 2: PREMIUM =====
// Design luxueux 2 colonnes avec sidebar colorée (style Canva haut de gamme)
function generatePremiumTemplate(cvData: GeneratedCV, profileImage: string): string {
  const { prenom, nom, email, telephone, formation, ecole, anneeFormation } = cvData;
  const objectif = cvData.pitchPersonnalise || cvData.objectifAmeliore || cvData.objectif || "";
  const experiences = cvData.experiencesAmeliorees || [];
  const competences = cvData.competencesAmeliorees || [];

  return `
    <div class="w-full min-h-full flex bg-white">
      <!-- SIDEBAR GAUCHE (35%) - Violet/Or luxueux -->
      <div class="w-2/5 relative overflow-hidden text-white" style="background: linear-gradient(180deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%);">
        <!-- Formes décoratives dorées -->
        <div class="absolute top-20 right-0 w-32 h-32 rounded-full opacity-20" style="background: linear-gradient(135deg, #FCD34D, #F59E0B); transform: translate(40%, -20%);"></div>
        <div class="absolute bottom-40 left-0 w-24 h-24 opacity-15" style="background: linear-gradient(135deg, #FCD34D, #F59E0B); transform: translate(-30%, 20%) rotate(45deg);"></div>
        
        <div class="relative z-10 p-8 space-y-6">
          <!-- Photo de profil -->
          ${profileImage ? `
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 rounded-full opacity-50 blur-2xl" style="background: linear-gradient(135deg, #FCD34D, #F59E0B);"></div>
              <div class="relative w-40 h-40 rounded-full overflow-hidden border-4 shadow-2xl" style="border-color: rgba(252, 211, 77, 0.5);">
                <img src="${profileImage}" alt="Photo" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          ` : ''}
          
          <!-- Nom -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-black mb-2 leading-tight" style="text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
              ${prenom.toUpperCase()}<br>${nom.toUpperCase()}
            </h1>
            <div class="inline-block px-4 py-2 rounded-full text-sm font-bold mt-2" style="background: linear-gradient(135deg, #FCD34D, #F59E0B); color: #5B21B6;">
              ${formation || "Professionnel"}
            </div>
          </div>

          <!-- CONTACT -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-1 rounded-full" style="background: linear-gradient(90deg, #FCD34D, transparent);"></div>
              <h3 class="text-lg font-black uppercase tracking-wider">Contact</h3>
            </div>
            
            <div class="space-y-3 pl-2">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background: rgba(252, 211, 77, 0.15);">
                  <svg class="w-5 h-5" style="color: #FCD34D;" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <div class="flex-1 text-sm leading-relaxed break-all">
                  <p class="font-semibold">${email}</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background: rgba(252, 211, 77, 0.15);">
                  <svg class="w-5 h-5" style="color: #FCD34D;" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                </div>
                <div class="flex-1 text-sm leading-relaxed">
                  <p class="font-semibold">${telephone}</p>
                </div>
              </div>
            </div>
          </div>

          ${competences.length > 0 ? `
          <!-- COMPÉTENCES -->
          <div class="space-y-4 pt-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-1 rounded-full" style="background: linear-gradient(90deg, #FCD34D, transparent);"></div>
              <h3 class="text-lg font-black uppercase tracking-wider">Compétences</h3>
            </div>
            
            <div class="space-y-2 pl-2">
              ${competences.map(comp => `
                <div class="px-4 py-2 rounded-lg text-sm font-semibold" style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-left: 3px solid #FCD34D;">
                  ${comp}
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${formation ? `
          <!-- FORMATION -->
          <div class="space-y-4 pt-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-1 rounded-full" style="background: linear-gradient(90deg, #FCD34D, transparent);"></div>
              <h3 class="text-lg font-black uppercase tracking-wider">Formation</h3>
            </div>
            
            <div class="pl-2">
              <div class="p-4 rounded-lg" style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-left: 3px solid #FCD34D;">
                <h4 class="text-base font-bold mb-1">${formation}</h4>
                ${ecole ? `<p class="text-sm" style="color: rgba(255, 255, 255, 0.9);">${ecole}</p>` : ''}
                ${anneeFormation ? `<p class="text-xs mt-2 font-semibold" style="color: #FCD34D;">${anneeFormation}</p>` : ''}
              </div>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Pattern décoratif en bas -->
        <div class="absolute bottom-0 left-0 right-0 h-32 opacity-10" style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(252, 211, 77, 0.5) 10px, rgba(252, 211, 77, 0.5) 20px);"></div>
      </div>

      <!-- CONTENU PRINCIPAL (65%) -->
      <div class="w-3/5 bg-white relative">
        <!-- Décorations subtiles -->
        <div class="absolute top-10 right-10 w-32 h-32 rounded-full opacity-5" style="background: radial-gradient(circle, #7C3AED, transparent);"></div>

        <div class="p-10 space-y-8">
          ${objectif ? `
          <!-- OBJECTIF -->
          <section>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #7C3AED, #A78BFA);">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-black" style="color: #5B21B6;">OBJECTIF PROFESSIONNEL</h2>
                <div class="h-1 w-24 rounded-full mt-1" style="background: linear-gradient(90deg, #7C3AED, #FCD34D);"></div>
              </div>
            </div>
            <div class="ml-15 p-5 rounded-xl relative overflow-hidden" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(167, 139, 250, 0.05)); border: 2px solid rgba(124, 58, 237, 0.1);">
              <div class="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style="background: linear-gradient(135deg, #FCD34D, #F59E0B); transform: translate(30%, -30%);"></div>
              <p class="relative text-gray-800 leading-relaxed">${objectif}</p>
            </div>
          </section>
          ` : ''}

          ${experiences.length > 0 ? `
          <!-- EXPÉRIENCES -->
          <section>
            <div class="flex items-center gap-3 mb-5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #7C3AED, #A78BFA);">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-black" style="color: #5B21B6;">EXPÉRIENCES</h2>
                <div class="h-1 w-24 rounded-full mt-1" style="background: linear-gradient(90deg, #7C3AED, #FCD34D);"></div>
              </div>
            </div>
            <div class="ml-15 space-y-5">
              ${experiences.map((exp, index) => {
                const periode = cvData.experiences?.[index]?.periode || "";
                return `
                <div class="relative pl-6 pb-5 border-l-2" style="border-color: rgba(124, 58, 237, 0.2);">
                  <div class="absolute left-0 top-2 w-3 h-3 rounded-full shadow-md" style="background: linear-gradient(135deg, #7C3AED, #FCD34D); transform: translateX(-50%);"></div>
                  <div class="space-y-2">
                    <div class="flex items-start justify-between gap-4">
                      <h3 class="text-lg font-bold text-gray-900">${exp.poste}</h3>
                      ${periode ? `
                      <span class="text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 shadow-sm" style="background: linear-gradient(135deg, #F3E8FF, #E9D5FF); color: #5B21B6;">
                        ${periode}
                      </span>
                      ` : ''}
                    </div>
                    <p class="text-sm font-semibold" style="color: #7C3AED;">${exp.entreprise}</p>
                    <p class="text-gray-700 leading-relaxed text-sm">${exp.description}</p>
                  </div>
                </div>
                `;
              }).join('')}
            </div>
          </section>
          ` : ''}
        </div>

        <!-- Footer avec branding luxe -->
        <div class="px-10 pb-6">
          <div class="pt-4 border-t" style="border-color: rgba(124, 58, 237, 0.1);">
            <p class="text-center text-xs font-medium text-gray-400">
              CV Premium by <span style="background: linear-gradient(90deg, #7C3AED, #FCD34D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;">AlternaBoost</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== TEMPLATE 3: CRÉATIF =====
// Design créatif avec couleurs vives, formes géométriques et style jeune/dynamique
function generateCreativeTemplate(cvData: GeneratedCV, profileImage: string): string {
  const { prenom, nom, email, telephone, formation, ecole, anneeFormation } = cvData;
  const objectif = cvData.pitchPersonnalise || cvData.objectifAmeliore || cvData.objectif || "";
  const experiences = cvData.experiencesAmeliorees || [];
  const competences = cvData.competencesAmeliorees || [];

  return `
    <div class="w-full min-h-full bg-white relative overflow-hidden">
      <!-- Formes géométriques décoratives arc-en-ciel -->
      <div class="absolute top-10 right-10 w-48 h-48 rounded-3xl opacity-10 transform rotate-12" style="background: linear-gradient(135deg, #F59E0B, #EF4444);"></div>
      <div class="absolute top-40 left-20 w-32 h-32 rounded-full opacity-10" style="background: linear-gradient(135deg, #8B5CF6, #EC4899);"></div>
      <div class="absolute bottom-20 right-32 w-40 h-40 opacity-10" style="background: linear-gradient(135deg, #10B981, #3B82F6); transform: rotate(45deg);"></div>
      <div class="absolute bottom-40 left-10 w-24 h-24 rounded-full opacity-10" style="background: linear-gradient(135deg, #F59E0B, #F97316);"></div>

      <!-- Header super créatif avec gradient arc-en-ciel -->
      <div class="relative p-10 pb-8 text-white overflow-hidden" style="background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 25%, #3B82F6 50%, #10B981 75%, #F59E0B 100%);">
        <!-- Formes flottantes -->
        <div class="absolute top-5 right-20 w-20 h-20 rounded-full opacity-20 animate-pulse" style="background: white;"></div>
        <div class="absolute bottom-5 left-32 w-16 h-16 opacity-20" style="background: white; transform: rotate(45deg);"></div>
        <div class="absolute top-1/2 left-10 w-12 h-12 rounded-full opacity-20" style="background: white;"></div>

        <div class="relative z-10">
          <div class="flex items-center justify-between gap-8">
            <!-- Côté gauche : Info -->
            <div class="flex-1">
              <div class="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full text-xs font-black uppercase tracking-widest" style="background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div class="w-2 h-2 rounded-full animate-pulse" style="background: #FCD34D;"></div>
                Portfolio Créatif
              </div>
              
              <h1 class="text-6xl font-black mb-3 leading-none" style="text-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                ${prenom.toUpperCase()}<br>
                <span style="background: linear-gradient(90deg, #FCD34D, #FBBF24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: none;">${nom.toUpperCase()}</span>
              </h1>
              
              <div class="text-xl font-bold mb-6 px-5 py-2 inline-block rounded-xl" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px);">
                ${formation || "Designer Créatif"}
              </div>
              
              <div class="flex flex-wrap gap-3 text-sm">
                <div class="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px);">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(255,255,255,0.3);">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <span>${email}</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px);">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(255,255,255,0.3);">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                  </div>
                  <span>${telephone}</span>
                </div>
              </div>
            </div>

            <!-- Côté droit : Photo avec style créatif -->
            ${profileImage ? `
            <div class="relative flex-shrink-0">
              <div class="absolute inset-0 rounded-2xl opacity-60 blur-2xl" style="background: linear-gradient(135deg, #FCD34D, #F59E0B, #EF4444);"></div>
              <div class="relative w-44 h-44 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform rotate-3" style="box-shadow: 0 15px 40px rgba(0,0,0,0.3);">
                <img src="${profileImage}" alt="Photo" class="w-full h-full object-cover" />
              </div>
              <!-- Petits cercles décoratifs autour de la photo -->
              <div class="absolute -top-2 -left-2 w-6 h-6 rounded-full" style="background: linear-gradient(135deg, #F59E0B, #EF4444);"></div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full" style="background: linear-gradient(135deg, #8B5CF6, #EC4899);"></div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Vague décorative en bas -->
        <div class="absolute bottom-0 left-0 right-0 h-8" style="background: white; clip-path: polygon(0 50%, 10% 40%, 20% 50%, 30% 40%, 40% 50%, 50% 40%, 60% 50%, 70% 40%, 80% 50%, 90% 40%, 100% 50%, 100% 100%, 0 100%);"></div>
      </div>

      <!-- Corps du CV -->
      <div class="p-10 space-y-8">
        ${objectif ? `
        <!-- Objectif avec design coloré -->
        <section>
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-6" style="background: linear-gradient(135deg, #EC4899, #8B5CF6);">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-black mb-2" style="background: linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                MON OBJECTIF
              </h2>
              <div class="h-2 w-32 rounded-full" style="background: linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6);"></div>
            </div>
          </div>
          <div class="ml-20 p-6 rounded-2xl relative overflow-hidden" style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05)); border: 3px solid transparent; background-clip: padding-box; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);">
            <div class="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style="background: linear-gradient(135deg, #F59E0B, #EF4444); transform: translate(30%, -30%);"></div>
            <p class="relative text-gray-800 leading-relaxed text-base">${objectif}</p>
          </div>
        </section>
        ` : ''}

        ${experiences.length > 0 ? `
        <!-- Expériences avec style fun -->
        <section>
          <div class="flex items-start gap-4 mb-5">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6" style="background: linear-gradient(135deg, #10B981, #3B82F6);">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-black mb-2" style="background: linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                EXPÉRIENCES
              </h2>
              <div class="h-2 w-32 rounded-full" style="background: linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6);"></div>
            </div>
          </div>
          <div class="ml-20 space-y-6">
            ${experiences.map((exp, index) => {
              const periode = cvData.experiences?.[index]?.periode || "";
              const colors = [
                { bg: 'rgba(236, 72, 153, 0.1)', border: '#EC4899', badge: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)' },
                { bg: 'rgba(139, 92, 246, 0.1)', border: '#8B5CF6', badge: 'linear-gradient(135deg, #F3E8FF, #E9D5FF)' },
                { bg: 'rgba(59, 130, 246, 0.1)', border: '#3B82F6', badge: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)' },
                { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', badge: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' },
                { bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B', badge: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' },
              ];
              const color = colors[index % colors.length];
              
              return `
              <div class="p-6 rounded-2xl transform hover:scale-102 transition-all" style="background: ${color.bg}; border-left: 5px solid ${color.border}; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <h3 class="text-xl font-black text-gray-900">${exp.poste}</h3>
                  ${periode ? `
                  <span class="text-xs font-black px-4 py-2 rounded-xl shrink-0 shadow-md" style="background: ${color.badge}; color: ${color.border};">
                    ${periode}
                  </span>
                  ` : ''}
                </div>
                <p class="text-sm font-bold mb-3" style="color: ${color.border};">${exp.entreprise}</p>
                <p class="text-gray-700 leading-relaxed">${exp.description}</p>
              </div>
              `;
            }).join('')}
          </div>
        </section>
        ` : ''}

        <div class="grid grid-cols-2 gap-8">
          ${formation ? `
          <!-- Formation -->
          <section>
            <div class="flex items-start gap-3 mb-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12" style="background: linear-gradient(135deg, #F59E0B, #EF4444);">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-black mb-1" style="background: linear-gradient(90deg, #F59E0B, #EF4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  FORMATION
                </h2>
                <div class="h-1.5 w-20 rounded-full" style="background: linear-gradient(90deg, #F59E0B, #EF4444);"></div>
              </div>
            </div>
            <div class="p-5 rounded-xl" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1)); border-left: 4px solid #F59E0B;">
              <h3 class="text-lg font-bold text-gray-900 mb-1">${formation}</h3>
              ${ecole ? `<p class="text-sm font-semibold" style="color: #F59E0B;">${ecole}</p>` : ''}
              ${anneeFormation ? `<p class="text-xs mt-2 font-bold px-3 py-1 rounded-lg inline-block" style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); color: #D97706;">${anneeFormation}</p>` : ''}
            </div>
          </section>
          ` : ''}

          ${competences.length > 0 ? `
          <!-- Compétences -->
          <section>
            <div class="flex items-start gap-3 mb-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12" style="background: linear-gradient(135deg, #8B5CF6, #EC4899);">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-black mb-1" style="background: linear-gradient(90deg, #8B5CF6, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  COMPÉTENCES
                </h2>
                <div class="h-1.5 w-20 rounded-full" style="background: linear-gradient(90deg, #8B5CF6, #EC4899);"></div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              ${competences.map((comp, index) => {
                const tagColors = [
                  'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
                  'linear-gradient(135deg, #F3E8FF, #E9D5FF)',
                  'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                  'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                  'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                ];
                const tagColor = tagColors[index % tagColors.length];
                return `
                  <span class="px-4 py-2 text-sm font-bold rounded-xl shadow-md transform hover:scale-105 transition-all" style="background: ${tagColor}; border: 2px solid rgba(139, 92, 246, 0.2);">
                    ${comp}
                  </span>
                `;
              }).join('')}
            </div>
          </section>
          ` : ''}
        </div>
      </div>

      <!-- Footer créatif -->
      <div class="px-10 pb-8">
        <div class="pt-6 relative">
          <div class="h-2 rounded-full mb-4" style="background: linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6, #10B981, #F59E0B);"></div>
          <p class="text-center text-xs font-bold" style="background: linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            CV CRÉATIF BY ALTERNABOOST ✨
          </p>
        </div>
      </div>
    </div>
  `;
}

// ===== TEMPLATE 4: MINIMAL =====
// Design minimaliste, clean et ATS-friendly (pas de photo, noir & blanc avec accents subtils)
function generateMinimalTemplate(cvData: GeneratedCV): string {
  const { prenom, nom, email, telephone, formation, ecole, anneeFormation } = cvData;
  const objectif = cvData.pitchPersonnalise || cvData.objectifAmeliore || cvData.objectif || "";
  const experiences = cvData.experiencesAmeliorees || [];
  const competences = cvData.competencesAmeliorees || [];

  return `
    <div class="w-full min-h-full bg-white p-12">
      <!-- Header minimaliste et élégant -->
      <header class="mb-10 pb-6 border-b-2" style="border-color: #1F2937;">
        <h1 class="text-5xl font-light mb-2 tracking-wide" style="color: #111827; font-family: 'Inter', sans-serif;">
          ${prenom} <span class="font-bold">${nom.toUpperCase()}</span>
        </h1>
        ${formation ? `
        <p class="text-lg text-gray-600 mb-4 font-light italic">${formation}</p>
        ` : ''}
        
        <div class="flex flex-wrap gap-6 text-sm text-gray-700">
          <div class="flex items-center gap-2">
            <span class="w-1 h-1 rounded-full bg-gray-800"></span>
            <span>${email}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-1 h-1 rounded-full bg-gray-800"></span>
            <span>${telephone}</span>
          </div>
        </div>
      </header>

      <!-- Corps du CV -->
      <div class="space-y-8">
        ${objectif ? `
        <!-- Objectif -->
        <section>
          <h2 class="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b" style="color: #111827; border-color: #E5E7EB;">
            Objectif Professionnel
          </h2>
          <p class="text-gray-700 leading-relaxed text-justify" style="text-align: justify;">
            ${objectif}
          </p>
        </section>
        ` : ''}

        ${experiences.length > 0 ? `
        <!-- Expériences -->
        <section>
          <h2 class="text-lg font-bold uppercase tracking-wider mb-4 pb-2 border-b" style="color: #111827; border-color: #E5E7EB;">
            Expériences Professionnelles
          </h2>
          <div class="space-y-5">
            ${experiences.map((exp, index) => {
              const periode = cvData.experiences?.[index]?.periode || "";
              return `
              <div class="relative pl-6 border-l-2" style="border-color: #E5E7EB;">
                <div class="absolute left-0 top-1 w-2 h-2 rounded-full bg-gray-800" style="transform: translateX(-50%);"></div>
                <div class="space-y-1">
                  <div class="flex items-baseline justify-between gap-4">
                    <h3 class="text-base font-bold text-gray-900">${exp.poste}</h3>
                    ${periode ? `<span class="text-xs text-gray-600 font-medium shrink-0">${periode}</span>` : ''}
                  </div>
                  <p class="text-sm font-medium text-gray-700">${exp.entreprise}</p>
                  <p class="text-sm text-gray-600 leading-relaxed pt-1">${exp.description}</p>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </section>
        ` : ''}

        ${formation ? `
        <!-- Formation -->
        <section>
          <h2 class="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b" style="color: #111827; border-color: #E5E7EB;">
            Formation
          </h2>
          <div class="space-y-1">
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="text-base font-bold text-gray-900">${formation}</h3>
              ${anneeFormation ? `<span class="text-xs text-gray-600 font-medium">${anneeFormation}</span>` : ''}
            </div>
            ${ecole ? `<p class="text-sm text-gray-700">${ecole}</p>` : ''}
          </div>
        </section>
        ` : ''}

        ${competences.length > 0 ? `
        <!-- Compétences -->
        <section>
          <h2 class="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b" style="color: #111827; border-color: #E5E7EB;">
            Compétences
          </h2>
          <div class="flex flex-wrap gap-3">
            ${competences.map(comp => `
              <span class="text-sm text-gray-700 px-3 py-1 border rounded" style="border-color: #D1D5DB;">
                ${comp}
              </span>
            `).join('')}
          </div>
        </section>
        ` : ''}
      </div>

      <!-- Footer minimaliste -->
      <div class="mt-12 pt-6 border-t" style="border-color: #E5E7EB;">
        <p class="text-center text-xs text-gray-400 font-light">
          CV généré par AlternaBoost
        </p>
      </div>
    </div>
  `;
}


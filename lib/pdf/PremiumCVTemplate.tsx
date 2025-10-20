import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { GeneratedCV } from "@/types/cv";

// Enregistrement des polices (optionnel - utilise les polices par défaut si non disponible)
// Pour utiliser Inter, il faudrait l'héberger et la charger ici
// import { Font } from "@react-pdf/renderer";
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

// ========================================
// STYLES DU TEMPLATE PREMIUM
// ========================================
const styles = StyleSheet.create({
  // === Page ===
  page: {
    backgroundColor: "#F9FAFB",
    padding: 40,
    fontFamily: "Helvetica", // Remplacer par "Inter" si police ajoutée
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.5,
  },

  // === En-tête ===
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
  },
  headerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  headerTitle: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "semibold",
  },

  // === Layout deux colonnes ===
  contentContainer: {
    flexDirection: "row",
    gap: 20,
  },

  // Colonne gauche (30% de largeur)
  leftColumn: {
    width: "30%",
    paddingRight: 12,
  },

  // Colonne droite (70% de largeur)
  rightColumn: {
    width: "70%",
    paddingLeft: 12,
  },

  // === Sections ===
  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },

  // === Coordonnées ===
  contactItem: {
    fontSize: 9,
    marginBottom: 6,
    color: "#374151",
    lineHeight: 1.4,
  },

  contactLabel: {
    fontWeight: "bold",
    color: "#111827",
    fontFamily: "Helvetica-Bold",
  },

  // === Compétences ===
  skillItem: {
    marginBottom: 8,
  },

  skillName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },

  skillBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },

  skillBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
  },

  skillLevel: {
    fontSize: 8,
    color: "#6B7280",
    marginTop: 2,
  },

  // === Liste simple (compétences sans niveau) ===
  skillTag: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 4,
    paddingLeft: 8,
  },

  skillBullet: {
    fontSize: 6,
    marginRight: 4,
  },

  // === Objectif professionnel ===
  objectiveText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
    textAlign: "justify",
  },

  // === Expériences ===
  experienceItem: {
    marginBottom: 16,
  },

  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  experienceTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
    fontFamily: "Helvetica-Bold",
  },

  experienceDate: {
    fontSize: 9,
    color: "#6B7280",
    fontStyle: "italic",
  },

  experienceCompany: {
    fontSize: 10,
    color: "#2563EB",
    marginBottom: 6,
    fontWeight: "semibold",
  },

  experienceDescription: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.5,
    textAlign: "justify",
  },

  // === Formation ===
  formationText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },

  // === Pied de page ===
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  footerText: {
    fontSize: 8,
    color: "#9CA3AF",
  },

  footerLogo: {
    fontSize: 9,
    color: "#2563EB",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },

  // === Séparateur visuel ===
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
});

// ========================================
// COMPOSANT : Barre de compétence visuelle
// ========================================
interface SkillBarProps {
  name: string;
  level?: number; // 0-100 ou undefined
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level }) => {
  // Si un niveau est fourni (0-100), afficher une barre
  // Sinon, afficher juste le nom de la compétence
  
  if (level !== undefined) {
    return (
      <View style={styles.skillItem}>
        <Text style={styles.skillName}>{name}</Text>
        <View style={styles.skillBar}>
          <View style={[styles.skillBarFill, { width: `${level}%` }]} />
        </View>
        <Text style={styles.skillLevel}>
          {level >= 80 ? "Expert" : level >= 60 ? "Avancé" : level >= 40 ? "Intermédiaire" : "Débutant"}
        </Text>
      </View>
    );
  }

  // Affichage simple (bullet point)
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.skillBullet}>•</Text>
      <Text style={styles.skillTag}>{name}</Text>
    </View>
  );
};

// ========================================
// COMPOSANT : Section Coordonnées
// ========================================
interface ContactSectionProps {
  data: GeneratedCV;
}

const ContactSection: React.FC<ContactSectionProps> = ({ data }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact</Text>
      
      {data.email && (
        <Text style={styles.contactItem}>
          <Text style={styles.contactLabel}>Email : </Text>
          {data.email}
        </Text>
      )}
      
      {data.telephone && (
        <Text style={styles.contactItem}>
          <Text style={styles.contactLabel}>Tél : </Text>
          {data.telephone}
        </Text>
      )}
    </View>
  );
};

// ========================================
// COMPOSANT : Section Compétences
// ========================================
interface SkillsSectionProps {
  skills: string | string[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // Parse les compétences (peut être string ou array de strings)
  const skillList = Array.isArray(skills)
    ? skills
    : skills
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Compétences</Text>
      {skillList.map((skill, index) => (
        <SkillBar 
          key={index} 
          name={skill} 
          // Pour un rendu plus dynamique, vous pourriez attribuer des niveaux aléatoires
          // ou les récupérer depuis les données. Ici, affichage simple.
          level={undefined} 
        />
      ))}
    </View>
  );
};

// ========================================
// COMPOSANT : Section Objectif
// ========================================
interface ObjectiveSectionProps {
  objective: string;
}

const ObjectiveSection: React.FC<ObjectiveSectionProps> = ({ objective }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Objectif Professionnel</Text>
      <Text style={styles.objectiveText}>{objective}</Text>
    </View>
  );
};

// ========================================
// COMPOSANT : Section Expériences
// ========================================
interface ExperiencesSectionProps {
  experiences: GeneratedCV["experiencesAmeliorees"];
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ experiences }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
      {experiences.map((exp, index) => (
        <View key={index} style={styles.experienceItem}>
          {/* En-tête : Titre + Date */}
          <View style={styles.experienceHeader}>
            <Text style={styles.experienceTitle}>{exp.poste}</Text>
            <Text style={styles.experienceDate}>{exp.periode}</Text>
          </View>
          
          {/* Entreprise */}
          <Text style={styles.experienceCompany}>{exp.entreprise}</Text>
          
          {/* Description */}
          <Text style={styles.experienceDescription}>{exp.description}</Text>
        </View>
      ))}
    </View>
  );
};

// ========================================
// COMPOSANT : Section Formation
// ========================================
interface FormationSectionProps {
  formation: string;
}

const FormationSection: React.FC<FormationSectionProps> = ({ formation }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Formation</Text>
      <Text style={styles.formationText}>{formation}</Text>
    </View>
  );
};

// ========================================
// COMPOSANT PRINCIPAL : Template Premium CV
// ========================================
interface PremiumCVTemplateProps {
  data: GeneratedCV;
}

export const PremiumCVTemplate: React.FC<PremiumCVTemplateProps> = ({ data }) => {
  // Formater la date actuelle pour le pied de page
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===========================
            EN-TÊTE
        =========================== */}
        <View style={styles.header}>
          <Text style={styles.headerName}>
            {data.prenom} {data.nom}
          </Text>
          <Text style={styles.headerTitle}>
            {data.entrepriseCiblee
              ? `Candidat(e) pour ${data.entrepriseCiblee}`
              : "Étudiant(e) en recherche d'alternance"}
          </Text>
        </View>

        {/* ===========================
            CONTENU DEUX COLONNES
        =========================== */}
        <View style={styles.contentContainer}>
          {/* COLONNE GAUCHE (30%) */}
          <View style={styles.leftColumn}>
            {/* Coordonnées */}
            <ContactSection data={data} />

            {/* Compétences */}
            <SkillsSection skills={data.competencesAmeliorees || data.competences} />

            {/* SECTION BONUS : Langues (optionnel, à ajouter si besoin) */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>Langues</Text>
              <Text style={styles.contactItem}>Français : Natif</Text>
              <Text style={styles.contactItem}>Anglais : Courant</Text>
            </View> */}

            {/* SECTION BONUS : Centres d'intérêt (optionnel) */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>Centres d&apos;intérêt</Text>
              <Text style={styles.skillTag}>• Développement open-source</Text>
              <Text style={styles.skillTag}>• Photographie</Text>
              <Text style={styles.skillTag}>• Voyages</Text>
            </View> */}
          </View>

          {/* COLONNE DROITE (70%) */}
          <View style={styles.rightColumn}>
            {/* Objectif professionnel */}
            <ObjectiveSection objective={data.objectifAmeliore || data.objectif} />

            {/* Expériences professionnelles */}
            <ExperiencesSection experiences={data.experiencesAmeliorees} />

            {/* Formation */}
            <FormationSection formation={data.formation} />
          </View>
        </View>

        {/* ===========================
            PIED DE PAGE
        =========================== */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>CV généré le {currentDate}</Text>
          <Text style={styles.footerLogo}>AlternaBoost</Text>
        </View>
      </Page>
    </Document>
  );
};


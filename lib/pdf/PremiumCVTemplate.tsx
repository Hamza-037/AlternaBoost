import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { GeneratedCV } from "@/types/cv";

// ========================================
// STYLES DU TEMPLATE PREMIUM
// ========================================
const styles = StyleSheet.create({
  // === Page ===
  page: {
    backgroundColor: "#F9FAFB",
    padding: 40,
    fontFamily: "Helvetica",
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
    color: "#111827",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 14,
    color: "#2563EB",
    fontFamily: "Helvetica-Bold",
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
    color: "#111827",
    fontFamily: "Helvetica-Bold",
  },

  // === Compétences ===
  skillItem: {
    marginBottom: 8,
  },

  skillName: {
    fontSize: 10,
    color: "#111827",
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },

  skillBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },

  skillBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 2,
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
    color: "#2563EB",
  },

  skillSimpleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 10,
  },

  experienceTitle: {
    fontSize: 11,
    color: "#111827",
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },

  experienceDate: {
    fontSize: 9,
    color: "#6B7280",
    fontStyle: "italic",
    flexShrink: 0,
  },

  experienceCompany: {
    fontSize: 10,
    color: "#2563EB",
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },

  experienceDescription: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.5,
    textAlign: "justify",
  },

  // Bullet points pour expériences
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 5,
  },

  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2563EB",
    marginRight: 6,
    marginTop: 4,
    flexShrink: 0,
  },

  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.4,
  },

  // === Formation ===
  formationItem: {
    marginBottom: 12,
  },

  formationTitle: {
    fontSize: 11,
    color: "#111827",
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },

  formationDetails: {
    fontSize: 9,
    color: "#6B7280",
    lineHeight: 1.4,
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
    fontFamily: "Helvetica-Bold",
  },
});

// ========================================
// UTILS : Extraction des bullet points
// ========================================
const extractBulletPoints = (description: string): string[] => {
  if (!description) return [];
  
  const points = description
    .split(/[.•\-\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 10);
  
  return points.slice(0, 5);
};

// ========================================
// UTILS : Calculer le niveau de compétence
// ========================================
const getSkillLevelLabel = (level: number): string => {
  if (level >= 80) return "Expert";
  if (level >= 60) return "Avancé";
  if (level >= 40) return "Intermédiaire";
  return "Débutant";
};

// ========================================
// COMPOSANT : Barre de compétence visuelle
// ========================================
interface SkillBarProps {
  name: string;
  level?: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level }) => {
  if (level !== undefined && level > 0) {
    const validLevel = Math.min(100, Math.max(0, level));
    
    return (
      <View style={styles.skillItem}>
        <Text style={styles.skillName}>{name}</Text>
        <View style={styles.skillBar}>
          <View style={[styles.skillBarFill, { width: `${validLevel}%` }]} />
        </View>
        <Text style={styles.skillLevel}>
          {getSkillLevelLabel(validLevel)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.skillSimpleContainer}>
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
  const hasContact = data.email || data.telephone;
  
  if (!hasContact) return null;

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
  const skillList = Array.isArray(skills)
    ? skills.filter(Boolean).slice(0, 12)
    : typeof skills === 'string'
    ? skills
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 12)
    : [];

  if (skillList.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Compétences</Text>
      {skillList.map((skill, index) => (
        <SkillBar 
          key={index} 
          name={skill} 
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
  if (!objective || objective.trim().length === 0) return null;

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
  if (!experiences || experiences.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
      {experiences.map((exp, index) => {
        const bulletPoints = extractBulletPoints(exp.description);
        
        return (
          <View key={index} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>{exp.poste}</Text>
              <Text style={styles.experienceDate}>{exp.periode}</Text>
            </View>
            
            <Text style={styles.experienceCompany}>{exp.entreprise}</Text>
            
            {bulletPoints.length > 0 ? (
              bulletPoints.map((point, i) => (
                <View key={i} style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.experienceDescription}>{exp.description}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

// ========================================
// COMPOSANT : Section Formation
// ========================================
interface FormationSectionProps {
  data: GeneratedCV;
}

const FormationSection: React.FC<FormationSectionProps> = ({ data }) => {
  if (!data.formation) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Formation</Text>
      <View style={styles.formationItem}>
        <Text style={styles.formationTitle}>{data.formation}</Text>
        {(data.ecole || data.anneeFormation) && (
          <Text style={styles.formationDetails}>
            {data.ecole}
            {data.ecole && data.anneeFormation && " • "}
            {data.anneeFormation}
          </Text>
        )}
      </View>
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
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const headerSubtitle = data.entrepriseCiblee
    ? `Candidat(e) pour ${data.entrepriseCiblee}`
    : data.formation || "Professionnel(le) en recherche d'opportunités";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* EN-TÊTE */}
        <View style={styles.header}>
          <Text style={styles.headerName}>
            {data.prenom} {data.nom}
          </Text>
          <Text style={styles.headerTitle}>
            {headerSubtitle}
          </Text>
        </View>

        {/* CONTENU DEUX COLONNES */}
        <View style={styles.contentContainer}>
          {/* COLONNE GAUCHE (30%) */}
          <View style={styles.leftColumn}>
            <ContactSection data={data} />
            <SkillsSection skills={data.competencesAmeliorees || data.competences} />
          </View>

          {/* COLONNE DROITE (70%) */}
          <View style={styles.rightColumn}>
            <ObjectiveSection objective={data.objectifAmeliore || data.objectif} />
            <ExperiencesSection experiences={data.experiencesAmeliorees} />
            <FormationSection data={data} />
          </View>
        </View>

        {/* PIED DE PAGE */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>CV généré le {currentDate}</Text>
          <Text style={styles.footerLogo}>AlternaBoost</Text>
        </View>
      </Page>
    </Document>
  );
};
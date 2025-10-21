import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { GeneratedCV } from "@/types/cv";

// ========================================
// STYLES DU TEMPLATE MODERNE (2 colonnes avec sidebar)
// ========================================
const styles = StyleSheet.create({
  // === Page ===
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  // === SIDEBAR GAUCHE (Verte comme ton CV) ===
  sidebar: {
    width: "35%",
    backgroundColor: "#2D5F5D",
    padding: 20,
    paddingTop: 30,
  },

  // Photo de profil
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: "cover",
  },

  // Nom dans la sidebar
  sidebarName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  sidebarRole: {
    fontSize: 10,
    color: "#B8D4D3",
    textAlign: "center",
    marginBottom: 20,
  },

  // Sections de la sidebar
  sidebarSection: {
    marginBottom: 18,
  },

  sidebarSectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#4A8886",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  sidebarItem: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  sidebarIcon: {
    fontSize: 10,
    marginRight: 8,
    color: "#B8D4D3",
    minWidth: 12,
  },

  sidebarText: {
    fontSize: 9,
    color: "#E8F1F0",
    lineHeight: 1.4,
    flex: 1,
  },

  // Barre de progression pour compétences
  skillBar: {
    marginBottom: 10,
  },

  skillName: {
    fontSize: 9,
    color: "#FFFFFF",
    marginBottom: 4,
  },

  skillBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#1A3D3B",
    borderRadius: 3,
  },

  skillBarFill: {
    height: "100%",
    backgroundColor: "#6ABB9A",
    borderRadius: 3,
  },

  // === CONTENU PRINCIPAL (Droite) ===
  mainContent: {
    width: "65%",
    padding: 30,
    paddingTop: 40,
  },

  // En-tête principal
  mainHeader: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#2D5F5D",
  },

  mainName: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  mainRole: {
    fontSize: 13,
    color: "#6ABB9A",
    fontFamily: "Helvetica-Bold",
  },

  // Sections du contenu principal
  mainSection: {
    marginBottom: 20,
  },

  mainSectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#6ABB9A",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Objectif
  objectiveText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.6,
    textAlign: "justify",
  },

  // Expériences
  experienceItem: {
    marginBottom: 15,
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
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
    flex: 1,
  },

  experienceDate: {
    fontSize: 9,
    color: "#6ABB9A",
    fontFamily: "Helvetica-Bold",
    flexShrink: 0,
  },

  experienceCompany: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 6,
    fontStyle: "italic",
  },

  experienceDescription: {
    fontSize: 9,
    color: "#444444",
    lineHeight: 1.5,
    textAlign: "justify",
  },

  // Bullet point
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 5,
  },

  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6ABB9A",
    marginRight: 6,
    marginTop: 4,
    flexShrink: 0,
  },

  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#444444",
    lineHeight: 1.4,
  },

  // Formation
  formationItem: {
    marginBottom: 12,
  },

  formationTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
    marginBottom: 3,
  },

  formationDetails: {
    fontSize: 9,
    color: "#666666",
    lineHeight: 1.4,
  },
});

// ========================================
// COMPOSANT : Icône (simulée avec texte pour React-PDF)
// ========================================
const Icon: React.FC<{ type: string }> = ({ type }) => {
  const icons: Record<string, string> = {
    email: "✉",
    phone: "☎",
    location: "📍",
    linkedin: "💼",
    skill: "✓",
    language: "🌐",
  };

  return <Text style={styles.sidebarIcon}>{icons[type] || "•"}</Text>;
};

// ========================================
// COMPOSANT : Barre de compétence
// ========================================
interface SkillBarProps {
  name: string;
  level: number; // 0-100
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level }) => {
  return (
    <View style={styles.skillBar}>
      <Text style={styles.skillName}>{name}</Text>
      <View style={styles.skillBarContainer}>
        <View style={[styles.skillBarFill, { width: `${Math.min(100, Math.max(0, level))}%` }]} />
      </View>
    </View>
  );
};

// ========================================
// UTILS : Extraction des bullet points
// ========================================
const extractBulletPoints = (description: string): string[] => {
  if (!description) return [];
  
  // Séparer par points ou tirets
  const points = description
    .split(/[.•\-\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 10); // Ignorer les fragments trop courts
  
  return points.slice(0, 5); // Maximum 5 points par expérience
};

// ========================================
// COMPOSANT PRINCIPAL : Template Moderne
// ========================================
interface ModernCVTemplateProps {
  data: GeneratedCV;
  profileImageUrl?: string;
}

export const ModernCVTemplate: React.FC<ModernCVTemplateProps> = ({
  data,
  profileImageUrl,
}) => {
  // Soft skills avec niveaux estimés (à personnaliser selon les données)
  const defaultSoftSkills = [
    { name: "Communication", level: 85 },
    { name: "Travail d'équipe", level: 90 },
    { name: "Organisation", level: 80 },
    { name: "Adaptabilité", level: 88 },
  ];

  // Préparer les compétences pour la sidebar
  const competencesList = Array.isArray(data.competencesAmeliorees)
    ? data.competencesAmeliorees.slice(0, 8)
    : typeof data.competences === 'string'
    ? data.competences.split(',').map(c => c.trim()).filter(Boolean).slice(0, 8)
    : [];

  // Préparer les expériences
  const experiences = Array.isArray(data.experiencesAmeliorees) && data.experiencesAmeliorees.length > 0
    ? data.experiencesAmeliorees
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================================
            SIDEBAR GAUCHE
        ================================ */}
        <View style={styles.sidebar}>
          {/* Photo de profil */}
          {profileImageUrl && (
            <View style={styles.profileImageContainer}>
              <Image
                src={profileImageUrl}
                style={styles.profileImage}
              />
            </View>
          )}

          {/* Nom et rôle */}
          <Text style={styles.sidebarName}>
            {data.prenom} {data.nom}
          </Text>
          <Text style={styles.sidebarRole}>
            {data.entrepriseCiblee || "Candidat(e)"}
          </Text>

          {/* CONTACTS */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>

            {data.email && (
              <View style={styles.sidebarItem}>
                <Icon type="email" />
                <Text style={styles.sidebarText}>{data.email}</Text>
              </View>
            )}

            {data.telephone && (
              <View style={styles.sidebarItem}>
                <Icon type="phone" />
                <Text style={styles.sidebarText}>{data.telephone}</Text>
              </View>
            )}
          </View>

          {/* COMPÉTENCES TECHNIQUES */}
          {competencesList.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Compétences</Text>
              {competencesList.map((comp, index) => (
                <View key={index} style={styles.sidebarItem}>
                  <Icon type="skill" />
                  <Text style={styles.sidebarText}>{comp}</Text>
                </View>
              ))}
            </View>
          )}

          {/* SOFT SKILLS */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Soft Skills</Text>
            {defaultSoftSkills.map((skill, index) => (
              <SkillBar key={index} name={skill.name} level={skill.level} />
            ))}
          </View>
        </View>

        {/* ================================
            CONTENU PRINCIPAL
        ================================ */}
        <View style={styles.mainContent}>
          {/* En-tête principal */}
          <View style={styles.mainHeader}>
            <Text style={styles.mainName}>
              {data.prenom} {data.nom}
            </Text>
            <Text style={styles.mainRole}>
              {data.formation}
            </Text>
          </View>

          {/* PROFIL PROFESSIONNEL */}
          {(data.objectifAmeliore || data.objectif) && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Profil Professionnel</Text>
              <Text style={styles.objectiveText}>
                {data.objectifAmeliore || data.objectif}
              </Text>
            </View>
          )}

          {/* EXPÉRIENCES PROFESSIONNELLES */}
          {experiences.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Expérience Professionnelle</Text>
              {experiences.map((exp, index) => {
                const bulletPoints = extractBulletPoints(exp.description);
                
                return (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceTitle}>{exp.poste}</Text>
                      <Text style={styles.experienceDate}>{exp.periode}</Text>
                    </View>
                    <Text style={styles.experienceCompany}>{exp.entreprise}</Text>

                    {/* Description avec bullet points */}
                    {bulletPoints.length > 0 ? (
                      bulletPoints.map((point, i) => (
                        <View key={i} style={styles.bulletPoint}>
                          <View style={styles.bullet} />
                          <Text style={styles.bulletText}>{point}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.experienceDescription}>
                        {exp.description}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* FORMATION */}
          {(data.formation || data.ecole) && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Formation</Text>
              <View style={styles.formationItem}>
                <Text style={styles.formationTitle}>{data.formation}</Text>
                <Text style={styles.formationDetails}>
                  {data.ecole}
                  {data.anneeFormation && ` • ${data.anneeFormation}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
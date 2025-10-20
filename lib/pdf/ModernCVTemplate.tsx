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
    backgroundColor: "#2D5F5D", // Vert foncé similaire à ton CV
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
    border: "4px solid #FFFFFF",
  },

  // Nom dans la sidebar
  sidebarName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  sidebarRole: {
    fontSize: 11,
    color: "#B8D4D3",
    textAlign: "center",
    marginBottom: 20,
  },

  // Sections de la sidebar
  sidebarSection: {
    marginBottom: 20,
  },

  sidebarSectionTitle: {
    fontSize: 12,
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
    alignItems: "center",
  },

  sidebarIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
    color: "#B8D4D3",
  },

  sidebarText: {
    fontSize: 9,
    color: "#E8F1F0",
    lineHeight: 1.4,
  },

  sidebarLabel: {
    fontSize: 8,
    color: "#B8D4D3",
    marginBottom: 3,
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
    overflow: "hidden",
  },

  skillBarFill: {
    height: "100%",
    backgroundColor: "#6ABB9A",
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
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  mainRole: {
    fontSize: 14,
    color: "#6ABB9A",
    fontFamily: "Helvetica-Bold",
  },

  // Sections du contenu principal
  mainSection: {
    marginBottom: 20,
  },

  mainSectionTitle: {
    fontSize: 14,
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
    marginBottom: 4,
  },

  experienceTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
  },

  experienceDate: {
    fontSize: 9,
    color: "#6ABB9A",
    fontFamily: "Helvetica-Bold",
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
  },

  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6ABB9A",
    marginRight: 6,
    marginTop: 4,
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
  const icons: { [key: string]: string } = {
    email: "✉",
    phone: "☎",
    location: "📍",
    linkedin: "🔗",
    skill: "⚡",
    language: "🌐",
  };

  return <Text style={{ fontSize: 12, marginRight: 6 }}>{icons[type] || "•"}</Text>;
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
        <View style={[styles.skillBarFill, { width: `${level}%` }]} />
      </View>
    </View>
  );
};

// ========================================
// COMPOSANT PRINCIPAL : Template Moderne
// ========================================
interface ModernCVTemplateProps {
  data: GeneratedCV;
  profileImageUrl?: string; // URL de la photo (optionnelle)
}

export const ModernCVTemplate: React.FC<ModernCVTemplateProps> = ({ 
  data, 
  profileImageUrl 
}) => {
  // Compétences avec niveaux (simulation - à améliorer avec vraies données)
  const skillsWithLevels = [
    { name: "Communication", level: 90 },
    { name: "Travail d'équipe", level: 85 },
    { name: "Organisation", level: 88 },
    { name: "Adaptabilité", level: 92 },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ================================
            SIDEBAR GAUCHE
        ================================ */}
        <View style={styles.sidebar}>
          {/* Photo de profil (si fournie) */}
          {profileImageUrl && (
            <View style={styles.profileImageContainer}>
              <Image 
                src={profileImageUrl} 
                style={styles.profileImage}
              />
            </View>
          )}

          {/* Nom et rôle dans la sidebar */}
          <Text style={styles.sidebarName}>
            {data.prenom} {data.nom}
          </Text>
          <Text style={styles.sidebarRole}>
            {data.entrepriseCiblee ? `Candidat(e) ${data.entrepriseCiblee}` : "Étudiant(e)"}
          </Text>

          {/* CONTACTS */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contacts</Text>
            
            <View style={styles.sidebarItem}>
              <Icon type="email" />
              <Text style={styles.sidebarText}>{data.email}</Text>
            </View>

            <View style={styles.sidebarItem}>
              <Icon type="phone" />
              <Text style={styles.sidebarText}>{data.telephone}</Text>
            </View>
          </View>

          {/* COMPÉTENCES TECHNIQUES */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Compétences</Text>
            {Array.isArray(data.competencesAmeliorees) ? (
              data.competencesAmeliorees.slice(0, 6).map((comp, index) => (
                <View key={index} style={styles.sidebarItem}>
                  <Icon type="skill" />
                  <Text style={styles.sidebarText}>{comp}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.sidebarText}>{data.competences}</Text>
            )}
          </View>

          {/* SOFT SKILLS (avec barres) */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Soft Skills</Text>
            {skillsWithLevels.map((skill, index) => (
              <SkillBar key={index} name={skill.name} level={skill.level} />
            ))}
          </View>
        </View>

        {/* ================================
            CONTENU PRINCIPAL (Droite)
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
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Profil Professionnel</Text>
            <Text style={styles.objectiveText}>
              {data.objectifAmeliore || data.objectif}
            </Text>
          </View>

          {/* EXPÉRIENCES PROFESSIONNELLES */}
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Expérience Professionnelle</Text>
            {data.experiencesAmeliorees.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experienceTitle}>{exp.poste}</Text>
                  <Text style={styles.experienceDate}>{exp.periode}</Text>
                </View>
                <Text style={styles.experienceCompany}>{exp.entreprise}</Text>
                
                {/* Description avec bullet points */}
                {exp.description.split('.').filter(s => s.trim()).map((sentence, i) => (
                  sentence.trim() && (
                    <View key={i} style={styles.bulletPoint}>
                      <View style={styles.bullet} />
                      <Text style={styles.bulletText}>{sentence.trim()}.</Text>
                    </View>
                  )
                ))}
              </View>
            ))}
          </View>

          {/* FORMATION */}
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Formation</Text>
            <View style={styles.formationItem}>
              <Text style={styles.formationTitle}>{data.formation}</Text>
              <Text style={styles.formationDetails}>
                {data.ecole} • {data.anneeFormation}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};


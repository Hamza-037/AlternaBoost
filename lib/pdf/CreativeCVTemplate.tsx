import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { GeneratedCV, CVStyle, CVSection } from "@/types/cv";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#FF6B6B",
    padding: 30,
    marginBottom: 30,
    borderRadius: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 15,
  },
  contactItem: {
    color: "#FFFFFF",
    fontSize: 10,
    opacity: 0.9,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottom: "3px solid #FF6B6B",
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  objectiveText: {
    fontSize: 11,
    color: "#333333",
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  experienceItem: {
    marginBottom: 15,
    paddingLeft: 15,
    borderLeft: "4px solid #FFE66D",
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  experienceTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333333",
  },
  experienceDate: {
    fontSize: 10,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  experienceCompany: {
    fontSize: 11,
    color: "#666666",
    marginBottom: 5,
  },
  experienceDescription: {
    fontSize: 10,
    color: "#555555",
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#FFE66D",
    color: "#333333",
    fontSize: 10,
    padding: "6 12",
    borderRadius: 15,
    fontWeight: "bold",
  },
  formationBox: {
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 8,
    borderLeft: "4px solid #4ECDC4",
  },
  formationDegree: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  formationSchool: {
    fontSize: 11,
    color: "#666666",
  },
  customSection: {
    marginBottom: 15,
  },
  customSectionContent: {
    fontSize: 10,
    color: "#555555",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
  },
});

interface CreativeCVTemplateProps {
  data: GeneratedCV;
  style?: CVStyle;
  profileImageUrl?: string;
  customSections?: CVSection[];
}

export const CreativeCVTemplate: React.FC<CreativeCVTemplateProps> = ({
  data,
  style,
  customSections = [],
}) => {
  const primaryColor = style?.colorScheme?.primary || "#FF6B6B";
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête créatif */}
        <View style={[styles.header, { backgroundColor: primaryColor }]}>
          <Text style={styles.name}>
            {data.prenom} {data.nom}
          </Text>
          <Text style={styles.title}>{data.objectifAmeliore}</Text>
          
          <View style={styles.contactRow}>
            {data.email && <Text style={styles.contactItem}>✉ {data.email}</Text>}
            {data.telephone && <Text style={styles.contactItem}>☎ {data.telephone}</Text>}
          </View>
        </View>

        {/* Objectif professionnel */}
        {data.objectifAmeliore && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: primaryColor }]}>
              <Text style={styles.sectionIcon}>🎯</Text>
              <Text style={[styles.sectionTitle, { color: primaryColor }]}>
                Objectif
              </Text>
            </View>
            <Text style={styles.objectiveText}>{data.objectifAmeliore}</Text>
          </View>
        )}

        {/* Expériences */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { borderBottomColor: primaryColor }]}>
            <Text style={styles.sectionIcon}>💼</Text>
            <Text style={[styles.sectionTitle, { color: primaryColor }]}>
              Expériences
            </Text>
          </View>
          
          {data.experiencesAmeliorees.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceTitle}>{exp.poste}</Text>
                <Text style={styles.experienceDate}>{exp.periode}</Text>
              </View>
              <Text style={styles.experienceCompany}>{exp.entreprise}</Text>
              <Text style={styles.experienceDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>

        {/* Formation */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { borderBottomColor: primaryColor }]}>
            <Text style={styles.sectionIcon}>🎓</Text>
            <Text style={[styles.sectionTitle, { color: primaryColor }]}>
              Formation
            </Text>
          </View>
          
          <View style={styles.formationBox}>
            <Text style={styles.formationDegree}>{data.formation}</Text>
            <Text style={styles.formationSchool}>
              {data.ecole} • {data.anneeFormation}
            </Text>
          </View>
        </View>

        {/* Compétences */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { borderBottomColor: primaryColor }]}>
            <Text style={styles.sectionIcon}>⚡</Text>
            <Text style={[styles.sectionTitle, { color: primaryColor }]}>
              Compétences
            </Text>
          </View>
          
          <View style={styles.skillsContainer}>
            {data.competencesAmeliorees.map((skill, index) => (
              <Text key={index} style={styles.skillBadge}>
                {skill}
              </Text>
            ))}
          </View>
        </View>

        {/* Sections personnalisées */}
        {customSections.filter(s => s.visible).map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: primaryColor }]}>
              <Text style={styles.sectionIcon}>
                {section.type === "langues" && "🌐"}
                {section.type === "certifications" && "🏆"}
                {section.type === "projets" && "💻"}
                {section.type === "interets" && "❤️"}
                {section.type === "custom" && "✨"}
              </Text>
              <Text style={[styles.sectionTitle, { color: primaryColor }]}>
                {section.titre}
              </Text>
            </View>
            <View style={styles.customSection}>
              {Array.isArray(section.contenu) ? (
                section.contenu.map((item, index) => (
                  <Text key={index} style={styles.customSectionContent}>
                    • {item}
                  </Text>
                ))
              ) : (
                <Text style={styles.customSectionContent}>{section.contenu}</Text>
              )}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Généré par AlternaBoost - {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};


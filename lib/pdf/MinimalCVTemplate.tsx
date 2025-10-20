import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { GeneratedCV, CVStyle, CVSection } from "@/types/cv";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 60,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 40,
    borderBottom: "1px solid #000000",
    paddingBottom: 20,
  },
  name: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    gap: 20,
    fontSize: 10,
    color: "#666666",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 15,
    borderBottom: "0.5px solid #000000",
    paddingBottom: 5,
  },
  objectiveText: {
    fontSize: 11,
    color: "#333333",
    lineHeight: 1.8,
  },
  experienceItem: {
    marginBottom: 20,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  experienceDate: {
    fontSize: 10,
    color: "#666666",
  },
  experienceCompany: {
    fontSize: 11,
    color: "#666666",
    marginBottom: 6,
  },
  experienceDescription: {
    fontSize: 10,
    color: "#444444",
    lineHeight: 1.6,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillItem: {
    fontSize: 10,
    color: "#333333",
  },
  formationTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  formationDetails: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 3,
  },
  customSectionContent: {
    fontSize: 10,
    color: "#444444",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: "center",
    fontSize: 8,
    color: "#CCCCCC",
    borderTop: "0.5px solid #CCCCCC",
    paddingTop: 10,
  },
});

interface MinimalCVTemplateProps {
  data: GeneratedCV;
  style?: CVStyle;
  customSections?: CVSection[];
}

export const MinimalCVTemplate: React.FC<MinimalCVTemplateProps> = ({
  data,
  customSections = [],
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête minimaliste */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.prenom} {data.nom}
          </Text>
          <Text style={styles.title}>{data.objectifAmeliore}</Text>
          
          <View style={styles.contactRow}>
            {data.email && <Text>{data.email}</Text>}
            {data.telephone && <Text>{data.telephone}</Text>}
          </View>
        </View>

        {/* Objectif */}
        {data.objectifAmeliore && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objectif</Text>
            <Text style={styles.objectiveText}>{data.objectifAmeliore}</Text>
          </View>
        )}

        {/* Expériences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
          
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
          <Text style={styles.sectionTitle}>Formation</Text>
          <Text style={styles.formationTitle}>{data.formation}</Text>
          <Text style={styles.formationDetails}>
            {data.ecole} — {data.anneeFormation}
          </Text>
        </View>

        {/* Compétences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          <View style={styles.skillsList}>
            {data.competencesAmeliorees.map((skill, index) => (
              <Text key={index} style={styles.skillItem}>
                {skill}
                {index < data.competencesAmeliorees.length - 1 && " •"}
              </Text>
            ))}
          </View>
        </View>

        {/* Sections personnalisées */}
        {customSections.filter(s => s.visible).map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.titre}</Text>
            {Array.isArray(section.contenu) ? (
              section.contenu.map((item, index) => (
                <Text key={index} style={styles.customSectionContent}>
                  {item}
                </Text>
              ))
            ) : (
              <Text style={styles.customSectionContent}>{section.contenu}</Text>
            )}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Généré par AlternaBoost — {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};


import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles as styles } from "./styles";
import type { GeneratedCV } from "@/types/cv";

interface CVTemplateProps {
  data: GeneratedCV;
}

export const CVTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header avec informations personnelles */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.prenom} {data.nom}
          </Text>
          <Text style={styles.contact}>{data.email} • {data.telephone}</Text>
          {data.entrepriseCiblee && (
            <Text style={styles.contact}>
              Candidature : {data.entrepriseCiblee}
            </Text>
          )}
        </View>

        {/* Objectif professionnel */}
        {data.objectifAmeliore && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objectif Professionnel</Text>
            <Text style={styles.objectif}>{data.objectifAmeliore}</Text>
          </View>
        )}

        {/* Formation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formation</Text>
          <View style={styles.formationItem}>
            <Text style={styles.formationTitle}>{data.formation}</Text>
            <Text style={styles.formationDetails}>
              {data.ecole} • {data.anneeFormation}
            </Text>
          </View>
        </View>

        {/* Expériences professionnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
          {data.experiencesAmeliorees.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.poste}>{exp.poste}</Text>
              </View>
              <Text style={styles.entreprise}>{exp.entreprise}</Text>
              <Text style={styles.periode}>{data.experiences[index]?.periode}</Text>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>

        {/* Compétences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          <View style={styles.competencesList}>
            {data.competencesAmeliorees.map((competence, index) => (
              <View key={index} style={styles.competenceCategory}>
                <Text>{competence}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};


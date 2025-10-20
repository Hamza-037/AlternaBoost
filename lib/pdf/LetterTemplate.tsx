import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { GeneratedLetter } from "@/types/letter";

// ========================================
// STYLES DE LA LETTRE DE MOTIVATION
// ========================================
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
  },

  // En-tête avec coordonnées
  header: {
    marginBottom: 30,
  },

  senderInfo: {
    marginBottom: 20,
  },

  senderName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
    marginBottom: 3,
  },

  senderDetails: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },

  // Destinataire
  recipientInfo: {
    marginBottom: 20,
    marginTop: 10,
  },

  companyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
    marginBottom: 2,
  },

  recipientDetails: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },

  // Date et objet
  dateLocation: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 20,
    textAlign: "right",
  },

  object: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
    marginBottom: 25,
  },

  // Corps de la lettre
  salutation: {
    fontSize: 11,
    color: "#333333",
    marginBottom: 15,
  },

  paragraph: {
    fontSize: 11,
    color: "#333333",
    lineHeight: 1.8,
    textAlign: "justify",
    marginBottom: 15,
  },

  closing: {
    fontSize: 11,
    color: "#333333",
    marginTop: 20,
    marginBottom: 40,
  },

  signature: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2D5F5D",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 10,
  },

  footerText: {
    fontSize: 8,
    color: "#999999",
    textAlign: "center",
  },
});

// ========================================
// COMPOSANT PRINCIPAL : Template Lettre
// ========================================
interface LetterTemplateProps {
  data: GeneratedLetter;
}

export const LetterTemplate: React.FC<LetterTemplateProps> = ({ data }) => {
  // Format de la date actuelle
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Extraire les adresses (ville) pour le lieu
  const ville = data.adresse.split(",").pop()?.trim() || "Paris";

  // Diviser le contenu généré en paragraphes
  const paragraphs = data.contenuGenere
    .split("\n\n")
    .filter((p) => p.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête : Coordonnées de l'expéditeur */}
        <View style={styles.header}>
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>
              {data.prenom} {data.nom}
            </Text>
            <Text style={styles.senderDetails}>{data.adresse}</Text>
            <Text style={styles.senderDetails}>{data.email}</Text>
            <Text style={styles.senderDetails}>{data.telephone}</Text>
          </View>

          {/* Destinataire */}
          <View style={styles.recipientInfo}>
            <Text style={styles.companyName}>{data.entreprise}</Text>
            {data.destinataire && (
              <Text style={styles.recipientDetails}>
                À l&apos;attention de {data.destinataire}
              </Text>
            )}
          </View>

          {/* Date et lieu */}
          <Text style={styles.dateLocation}>
            {ville}, le {currentDate}
          </Text>

          {/* Objet */}
          <Text style={styles.object}>
            Objet : Candidature pour le poste de {data.posteVise}
          </Text>
        </View>

        {/* Salutation */}
        <Text style={styles.salutation}>
          {data.destinataire
            ? `Madame, Monsieur ${data.destinataire},`
            : "Madame, Monsieur,"}
        </Text>

        {/* Corps de la lettre (paragraphes) */}
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph.trim()}
          </Text>
        ))}

        {/* Formule de politesse */}
        <Text style={styles.closing}>
          Je vous prie d&apos;agréer, {data.destinataire ? `Madame, Monsieur ${data.destinataire}` : "Madame, Monsieur"}, l&apos;expression de mes salutations distinguées.
        </Text>

        {/* Signature */}
        <Text style={styles.signature}>
          {data.prenom} {data.nom}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lettre de motivation générée le {currentDate} avec AlternaBoost
          </Text>
        </View>
      </Page>
    </Document>
  );
};


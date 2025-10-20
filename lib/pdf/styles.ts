import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 3,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  objectif: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#334155",
    textAlign: "justify",
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  poste: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E293B",
  },
  entreprise: {
    fontSize: 10,
    color: "#64748B",
    fontStyle: "italic",
  },
  periode: {
    fontSize: 9,
    color: "#94A3B8",
  },
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#475569",
    marginTop: 3,
  },
  formationItem: {
    marginBottom: 8,
  },
  formationTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  formationDetails: {
    fontSize: 10,
    color: "#64748B",
  },
  competencesList: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#334155",
  },
  competenceCategory: {
    marginBottom: 4,
  },
});


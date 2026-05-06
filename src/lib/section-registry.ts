export type FieldType = "text" | "textarea" | "image" | "markdown" | "url";

export interface SectionField {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  rows?: number;
}

export interface SectionTypeDef {
  label: string;
  fields: SectionField[];
}

export const SECTION_REGISTRY: Record<string, SectionTypeDef> = {
  hero: {
    label: "Hero principal",
    fields: [
      { key: "h1", label: "Titre (H1)", type: "text", help: "Ex: Cabinet Girardello" },
      { key: "subtitle", label: "Sous-titre", type: "text", help: "Ex: Physiotherapie a Morges" },
      { key: "body", label: "Texte d'introduction", type: "textarea", rows: 3 },
      { key: "cta_label", label: "Texte du bouton", type: "text", help: "Ex: Prendre rendez-vous" },
      { key: "cta_url", label: "Lien du bouton", type: "url", help: "Ex: /contact" },
      { key: "image_url", label: "Image de fond", type: "image" },
      { key: "image_alt", label: "Texte alternatif de l'image", type: "text" },
    ],
  },
  intro_physio: {
    label: "Presentation de la physiotherapie",
    fields: [
      { key: "eyebrow", label: "Sur-titre", type: "text", help: "Petit texte au-dessus du titre" },
      { key: "h2", label: "Titre (H2)", type: "text" },
      { key: "body", label: "Contenu (Markdown)", type: "markdown", rows: 10 },
    ],
  },
  team_preview: {
    label: "Apercu de l'equipe",
    fields: [
      { key: "eyebrow", label: "Sur-titre", type: "text" },
      { key: "h2", label: "Titre (H2)", type: "text" },
      { key: "intro", label: "Texte d'introduction", type: "textarea", rows: 3 },
    ],
  },
  gallery_grid: {
    label: "Galerie photos",
    fields: [
      { key: "eyebrow", label: "Sur-titre", type: "text" },
      { key: "h2", label: "Titre (H2)", type: "text" },
      { key: "intro", label: "Texte d'introduction", type: "textarea", rows: 2 },
    ],
  },
  contact_form_section: {
    label: "Section formulaire de contact",
    fields: [
      { key: "eyebrow", label: "Sur-titre", type: "text" },
      { key: "h2", label: "Titre (H2)", type: "text" },
      { key: "body", label: "Texte d'accompagnement", type: "textarea", rows: 3 },
    ],
  },
  cta_fullwidth: {
    label: "CTA pleine largeur",
    fields: [
      { key: "eyebrow", label: "Sur-titre", type: "text" },
      { key: "h2", label: "Titre (H2)", type: "text" },
      { key: "body", label: "Contenu", type: "textarea", rows: 3 },
      { key: "cta_label", label: "Texte du bouton", type: "text" },
      { key: "cta_url", label: "Lien du bouton", type: "url" },
    ],
  },
  team_member_card: {
    label: "Fiche praticien",
    fields: [
      { key: "eyebrow", label: "Sur-titre", type: "text" },
      { key: "h1", label: "Titre de la page (H1)", type: "text" },
      { key: "intro", label: "Texte d'introduction", type: "textarea", rows: 3 },
    ],
  },
  contact_hero: {
    label: "Hero page contact",
    fields: [
      { key: "eyebrow", label: "Sur-titre", type: "text" },
      { key: "h1", label: "Titre (H1)", type: "text" },
      { key: "intro", label: "Texte d'introduction", type: "textarea", rows: 3 },
    ],
  },
  markdown_body: {
    label: "Contenu Markdown",
    fields: [
      { key: "body", label: "Contenu (Markdown)", type: "markdown", rows: 20 },
    ],
  },
};

export const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(SECTION_REGISTRY).map(([key, def]) => [key, def.label])
);

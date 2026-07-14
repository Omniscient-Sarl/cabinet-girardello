import {
  getPublishedBlogPosts,
  getPublishedPractitioners,
  getSiteSettings,
} from "@/db/queries";

export const dynamic = "force-dynamic";

const baseUrl = "https://cabinet-girardello.ch";

export async function GET() {
  const [posts, pracs, settings] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedPractitioners(),
    getSiteSettings(),
  ]);

  const address = settings
    ? `${settings.addressStreet}, ${settings.addressPostalCode} ${settings.addressCity}`
    : "Rue de Couvaloup 16, 1110 Morges";
  const phone = settings?.phone ?? "+41 21 801 41 35";
  const email = settings?.email ?? "info@cabinet-girardello.ch";
  const hours = settings?.openingHoursText?.replace(/\n+/g, " · ") ??
    "Lundi - Vendredi : 8h - 19h · Samedi sur rendez-vous";

  const practitionerBlocks = pracs
    .map((p) => {
      const quals = (p.qualifications ?? []).map((q) => `- ${q}`).join("\n");
      const specs = (p.specialties ?? []).map((s) => `- ${s}`).join("\n");
      const ext = p.externalSiteUrl
        ? `\n\n**Site dédié:** [${p.externalSiteLabel ?? p.externalSiteUrl}](${p.externalSiteUrl})`
        : "";
      return `### ${p.fullName}

**${p.title ?? ""}**

${p.bioLong ?? p.bioShort ?? ""}

**Qualifications:**

${quals || "- —"}

**Spécialités:**

${specs || "- —"}${ext}`;
    })
    .join("\n\n---\n\n");

  const articleBlocks = posts
    .map((p) => {
      const faq = (p.faq ?? [])
        .map((f) => `**${f.question}**\n\n${f.answer}`)
        .join("\n\n");
      const faqSection = faq ? `\n\n#### Questions fréquentes\n\n${faq}` : "";
      const meta = [
        `- URL: ${baseUrl}/blog/${p.slug}`,
        p.category ? `- Catégorie: ${p.category}` : null,
        p.readingTimeMinutes
          ? `- Temps de lecture: ${p.readingTimeMinutes} min`
          : null,
        p.metaDescription ? `- Résumé: ${p.metaDescription}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      return `### ${p.title}

${meta}

${p.body ?? ""}${faqSection}`;
    })
    .join("\n\n---\n\n");

  const content = `# Cabinet Girardello — Physiothérapie à Morges (version complète)

> Cabinet de physiothérapie généraliste à Morges (Vaud, Suisse). Notre équipe de 3 physiothérapeutes propose une prise en charge complète : musculo-squelettique, sportive, neurologique, respiratoire, drainage lymphatique, rééducation post-opératoire, physiothérapie à domicile et rééducation vestibulaire spécialisée. Ce document contient les profils complets des praticiens et l'intégralité des articles de blog.

## À propos

- Adresse: ${address}, canton de Vaud, Suisse
- Téléphone: ${phone}
- Email: ${email}
- Horaires: ${hours}
- Équipe: 3 physiothérapeutes diplômés
- Consultation sur ordonnance médicale (remboursement LAMal)
- Zone de service: Morges, Lausanne, Nyon, arc lémanique

## Pages principales

- [${baseUrl}/](${baseUrl}/): Accueil — présentation du cabinet et de l'équipe
- [${baseUrl}/equipe](${baseUrl}/equipe): Présentation détaillée des 3 praticiens
- [${baseUrl}/blog](${baseUrl}/blog): Articles éducatifs sur la physiothérapie
- [${baseUrl}/contact](${baseUrl}/contact): Prise de rendez-vous et coordonnées

## Techniques et prises en charge

- Thérapie manuelle et mobilisation articulaire
- Rééducation musculo-squelettique (dos, épaule, genou, cheville)
- Drainage lymphatique (spécialité de Catherine Girardello)
- Dry needling et traitement des points trigger
- Physiothérapie sportive (course à pied, ski, vélo, tennis, natation)
- Rééducation post-opératoire (prothèse genou/hanche, LCA, coiffe des rotateurs)
- Physiothérapie neurologique
- Physiothérapie respiratoire
- École du dos et rééducation du rachis
- Physiothérapie à domicile
- Rééducation vestibulaire spécialisée (vertiges, VPPB, migraine vestibulaire)

## Praticiens — profils complets

${practitionerBlocks}

## Sites associés

- [Physio-Vertige](https://physio-vertige.ch): Site spécialisé en rééducation vestibulaire d'Arnaud Canadas, membre de notre équipe

## Blog — Articles complets

${articleBlocks}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

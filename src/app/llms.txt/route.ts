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

  const content = `# Cabinet Girardello — Physiothérapie à Morges

> Cabinet de physiothérapie généraliste à Morges (Vaud, Suisse). Notre équipe de 3 physiothérapeutes propose une prise en charge complète : musculo-squelettique, sportive, neurologique, respiratoire, drainage lymphatique, rééducation post-opératoire, physiothérapie à domicile et rééducation vestibulaire spécialisée.

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

## Praticiens

${pracs
  .map(
    (p) =>
      `- [${p.fullName}](${baseUrl}/equipe): ${p.title ?? ""}${
        p.bioShort ? ` — ${p.bioShort}` : ""
      }`
  )
  .join("\n")}

## Blog — Articles éducatifs

${posts
  .map(
    (p) =>
      `- [${p.title}](${baseUrl}/blog/${p.slug}): ${p.metaDescription ?? ""}`
  )
  .join("\n")}

## Sites associés

- [Physio-Vertige](https://physio-vertige.ch): Site spécialisé en rééducation vestibulaire d'Arnaud Canadas, membre de notre équipe

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

## Détails complets

- [${baseUrl}/llms-full.txt](${baseUrl}/llms-full.txt): Profils complets des praticiens et intégralité des articles de blog
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

import "dotenv/config";
import { db } from "../src/db";
import { practitioners, siteSettings } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function updateCatherine() {
  const result = await db
    .update(practitioners)
    .set({
      fullName: "Catherine Girardello",
      title: "Physiothérapeute, fondatrice du Cabinet Girardello",
      photoAlt:
        "Portrait de Catherine Girardello, physiothérapeute fondatrice du Cabinet Girardello à Morges",
      bioShort:
        "Fondatrice du Cabinet Girardello, Catherine accompagne ses patients depuis plus de 40 ans avec une expertise reconnue en thérapie musculo-squelettique et en drainage lymphatique.",
      bioLong: `Fondatrice du Cabinet Girardello à Morges, Catherine Girardello cumule plus de 40 ans d'expérience en physiothérapie. Elle maîtrise l'ensemble des disciplines de la profession et a développé au fil des années une expertise particulière en thérapie musculo-squelettique et en drainage lymphatique.

Son approche allie rigueur clinique et écoute attentive, fruit de quatre décennies au service de ses patients. Elle accueille au cabinet aussi bien des problématiques aiguës que des suivis au long cours, avec la patience et l'expérience que confère une carrière entièrement dédiée à la rééducation.`,
      qualifications: [
        "Diplôme en physiothérapie",
        "Plus de 40 ans d'expérience clinique",
        "Spécialisation en thérapie musculo-squelettique",
        "Spécialisation en drainage lymphatique",
      ],
      specialties: [
        "Thérapie musculo-squelettique",
        "Drainage lymphatique",
        "Physiothérapie générale",
        "Rééducation fonctionnelle",
      ],
      published: true,
    })
    .where(eq(practitioners.slug, "mme-girardello"))
    .returning({ slug: practitioners.slug, fullName: practitioners.fullName });

  console.log("Catherine updated:", result[0]?.fullName);
}

async function updateGuilhem() {
  const result = await db
    .update(practitioners)
    .set({
      slug: "guilhem-escande",
      fullName: "Guilhem Escande",
      title: "Physiothérapeute",
      photoAlt:
        "Portrait de Guilhem Escande, physiothérapeute au Cabinet Girardello à Morges",
      bioShort:
        "Diplômé en 2016, Guilhem propose une prise en charge polyvalente : sport, dry needling, neurologie, respiratoire, école du dos et physiothérapie à domicile.",
      bioLong: `Diplômé en physiothérapie en 2016, Guilhem Escande exerce au Cabinet Girardello à Morges avec une approche large et polyvalente.

Il prend en charge une grande variété de pathologies — sportives, musculo-squelettiques, neurologiques, respiratoires — et pratique le dry needling pour le traitement des points trigger. Il anime également l'école du dos, un programme de rééducation et d'éducation thérapeutique destiné aux patients souffrant de douleurs rachidiennes.

Guilhem se déplace également à domicile, notamment pour les patients dont la mobilité est réduite ou en post-opératoire précoce.`,
      qualifications: [
        "Diplôme en physiothérapie (2016)",
        "Formation en dry needling et trigger points",
        "Formation en physiothérapie neurologique",
        "Formation en école du dos",
        "Formation en physiothérapie respiratoire",
      ],
      specialties: [
        "Physiothérapie à domicile",
        "Physiothérapie sportive et générale",
        "Rééducation musculo-squelettique",
        "Physiothérapie neurologique",
        "Dry needling et trigger points",
        "Physiothérapie respiratoire",
        "Physiothérapie du rachis et école du dos",
      ],
      published: true,
    })
    .where(eq(practitioners.slug, "praticien-2"))
    .returning({ slug: practitioners.slug, fullName: practitioners.fullName });

  console.log("Guilhem updated:", result[0]?.fullName);
}

async function updateSiteSettings() {
  const existing = await db.select().from(siteSettings).limit(1);
  if (!existing[0]) {
    console.error("No site_settings row found.");
    process.exit(1);
  }

  await db
    .update(siteSettings)
    .set({
      phone: "+41 21 801 41 35",
      contactDestinationEmail: "physioGirardelloMorges@physio-hin.ch",
    })
    .where(eq(siteSettings.id, existing[0].id));

  console.log("Site settings updated: phone + contactDestinationEmail");
}

async function main() {
  await updateCatherine();
  await updateGuilhem();
  await updateSiteSettings();
  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

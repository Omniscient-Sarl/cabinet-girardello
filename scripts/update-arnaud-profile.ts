import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import "dotenv/config";

async function updateArnaudProfile() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const result = await db
    .update(schema.practitioners)
    .set({
      fullName: "Arnaud Canadas",
      title:
        "Physiothérapeute, spécialiste en rééducation vestibulaire",
      photoAlt:
        "Portrait d'Arnaud Canadas, physiothérapeute spécialisé en rééducation vestibulaire au Cabinet Girardello à Morges",
      bioShort:
        "Spécialisé dans le traitement des vertiges et troubles de l'équilibre, Arnaud accompagne les patients souffrant de VPPB, migraine vestibulaire, maladie de Ménière et autres pathologies du système vestibulaire.",
      bioLong: `Arnaud Canadas est physiothérapeute spécialisé en rééducation vestibulaire. Au Cabinet Girardello à Morges, il accompagne les patients souffrant de vertiges, de troubles de l'équilibre et d'instabilité — qu'il s'agisse d'un VPPB, d'une migraine vestibulaire, d'une maladie de Ménière, d'une névrite vestibulaire ou d'un déficit vestibulaire.

Sa pratique combine une écoute attentive, des tests positionnels précis (Dix-Hallpike, HINTS, etc.) et des techniques de rééducation reconnues internationalement, dont la manœuvre d'Epley pour le VPPB. L'objectif : identifier l'origine exacte des vertiges et proposer un protocole adapté, souvent en quelques séances seulement.

Pour les patients qui cherchent spécifiquement une prise en charge vestibulaire, Arnaud reçoit également sur son site dédié [physio-vertige.ch](https://physio-vertige.ch), où sont détaillées les pathologies traitées et les protocoles utilisés.`,
      qualifications: [
        "Diplôme en physiothérapie (2020)",
        "Formation spécialisée en dry needling (2020)",
        "Master en douleur chronique (2021)",
        "Formation VIRE vertiges (2021)",
        "Formation continue en troubles de l'équilibre et vertiges",
        "Diplôme universitaire de prise en charge clinique, paraclinique et thérapeutique des vertiges — Université de Reims (2025)",
      ],
      specialties: [
        "Rééducation vestibulaire",
        "VPPB (vertige positionnel paroxystique bénin)",
        "Migraine vestibulaire",
        "Maladie de Ménière",
        "Troubles de l'équilibre",
        "Mal de débarquement",
        "Vertige post-commotion",
        "Dry needling",
      ],
      externalSiteUrl: "https://physio-vertige.ch",
      externalSiteLabel:
        "Site dédié — Rééducation vestibulaire spécialisée",
      published: true,
      updatedAt: new Date(),
    })
    .where(eq(schema.practitioners.slug, "arnaud-canadas"))
    .returning();

  console.log("Updated practitioner:", result[0]?.fullName);
  console.log(
    "Bio short:",
    result[0]?.bioShort?.substring(0, 100) + "..."
  );
  console.log(
    "Qualifications count:",
    (result[0]?.qualifications as string[])?.length
  );
  console.log(
    "Specialties count:",
    (result[0]?.specialties as string[])?.length
  );
  console.log("External site URL:", result[0]?.externalSiteUrl);
}

updateArnaudProfile().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});

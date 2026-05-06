import "dotenv/config";
import { UTApi } from "uploadthing/server";
import { db } from "../src/db";
import { practitioners } from "../src/db/schema";
import { eq } from "drizzle-orm";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const PHOTOS = [
  {
    slug: "mme-girardello",
    localPath: path.join(os.homedir(), "Downloads", "physio1.jpeg"),
    uploadName: "mme-girardello.jpeg",
    alt: "Portrait de Mme Girardello, physiothérapeute fondatrice du Cabinet Girardello à Morges",
  },
  {
    slug: "praticien-2",
    localPath: path.join(os.homedir(), "Downloads", "physio2.jpeg"),
    uploadName: "praticien-2.jpeg",
    alt: "Portrait d'un physiothérapeute du Cabinet Girardello à Morges",
  },
];

async function main() {
  const utapi = new UTApi();

  for (const photo of PHOTOS) {
    console.log(`\n→ Processing ${photo.slug}...`);

    const buffer = await fs.readFile(photo.localPath);
    const file = new File([buffer], photo.uploadName, { type: "image/jpeg" });
    console.log(`  Read ${(buffer.length / 1024).toFixed(0)} KB`);

    const response = await utapi.uploadFiles(file);
    if (!response.data) {
      console.error(`  ✗ Upload failed:`, response.error);
      continue;
    }

    const url = response.data.ufsUrl ?? response.data.url;
    console.log(`  ✓ Uploaded: ${url}`);

    const updated = await db
      .update(practitioners)
      .set({ photoUrl: url, photoAlt: photo.alt })
      .where(eq(practitioners.slug, photo.slug))
      .returning({ slug: practitioners.slug, photoUrl: practitioners.photoUrl });

    if (updated.length === 0) {
      console.error(`  ✗ No row updated for slug ${photo.slug}`);
    } else {
      console.log(`  ✓ DB updated for ${photo.slug}`);
    }
  }

  console.log("\nAll done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});

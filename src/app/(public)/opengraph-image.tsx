import { OgCard, OG_SIZE, OG_CONTENT_TYPE, loadFonts, createOgImage } from "@/lib/og-utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Cabinet Girardello — Physiotherapie a Morges";

export default async function OpengraphImage() {
  return createOgImage({
    eyebrow: "Cabinet de physiotherapie",
    title: "Cabinet Girardello",
    subtitle: "Physiotherapie a Morges — Votre bien-etre, notre priorite",
  });
}

import { ImageResponse } from "next/og";
import path from "node:path";
import fs from "node:fs/promises";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let fontsCache: { playfair: ArrayBuffer; inter: ArrayBuffer } | null = null;

export async function loadFonts() {
  if (fontsCache) return fontsCache;
  const fontsDir = path.join(process.cwd(), "public", "fonts");
  const [playfair, inter] = await Promise.all([
    fs.readFile(path.join(fontsDir, "PlayfairDisplay-Bold.ttf")),
    fs.readFile(path.join(fontsDir, "Inter-Regular.ttf")),
  ]);
  fontsCache = {
    playfair: new Uint8Array(playfair).buffer,
    inter: new Uint8Array(inter).buffer,
  };
  return fontsCache;
}

interface OgCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function OgCard({ eyebrow, title, subtitle }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        background: "linear-gradient(135deg, #F5F1EA 0%, #FFFFFF 100%)",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontSize: 20,
              color: "#5C7C6A",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "Inter",
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: 56,
            fontFamily: "Playfair Display",
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 24,
              color: "#4E6D5C",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: "#5C7C6A",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 22,
            fontFamily: "Playfair Display",
            fontWeight: 700,
          }}
        >
          G
        </div>
        <div style={{ fontSize: 18, color: "#6b7280" }}>
          Cabinet Girardello — Physiotherapie a Morges
        </div>
      </div>
    </div>
  );
}

export async function createOgImage(props: OgCardProps) {
  const fonts = await loadFonts();
  return new ImageResponse(<OgCard {...props} />, {
    ...OG_SIZE,
    fonts: [
      { name: "Playfair Display", data: fonts.playfair, weight: 700, style: "normal" },
      { name: "Inter", data: fonts.inter, weight: 400, style: "normal" },
    ],
  });
}

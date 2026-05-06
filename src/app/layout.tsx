import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cabinet-girardello.ch"
  ),
  title: {
    default: "Cabinet Girardello — Physiotherapie a Morges",
    template: "%s | Cabinet Girardello",
  },
  description:
    "Cabinet de physiotherapie a Morges. Notre equipe de physiotherapeutes vous accompagne dans votre reeducation et votre bien-etre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="fr"
        className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

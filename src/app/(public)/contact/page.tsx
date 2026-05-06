import type { Metadata } from "next";
import { getPageContent, getSiteSettings } from "@/db/queries";
import { ContactForm } from "@/components/public/contact-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Cabinet Girardello a Morges. Prenez rendez-vous avec nos physiotherapeutes.",
};

export default async function ContactPage() {
  const [content, settings] = await Promise.all([
    getPageContent("contact"),
    getSiteSettings(),
  ]);

  const hero = content?.get("contact_hero") as Record<string, string> | undefined;

  return (
    <div>
      {/* Hero */}
      <section className="flex min-h-[calc(100dvh-4rem)] items-center bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-20">
          {hero?.eyebrow && (
            <p className="text-sm font-medium uppercase tracking-wider text-sage">
              {hero.eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl">
            {hero?.h1 || "Contactez-nous"}
          </h1>
          {hero?.intro && (
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {hero.intro}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Form */}
            <div className="md:col-span-2">
              <h2 className="font-heading text-2xl font-bold">
                Envoyez-nous un message
              </h2>
              <p className="mt-2 text-muted-foreground">
                Remplissez le formulaire ci-dessous et nous vous repondrons dans
                les plus brefs delais.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg font-bold">Coordonnees</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {settings?.addressStreet && (
                    <li className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                      <span>
                        {settings.addressStreet}
                        <br />
                        {settings.addressPostalCode} {settings.addressCity}
                      </span>
                    </li>
                  )}
                  {settings?.phone && (
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-sage" />
                      <a
                        href={`tel:${settings.phone.replace(/\s/g, "")}`}
                        className="hover:text-sage-dark"
                      >
                        {settings.phone}
                      </a>
                    </li>
                  )}
                  {settings?.email && (
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-sage" />
                      <a
                        href={`mailto:${settings.email}`}
                        className="hover:text-sage-dark"
                      >
                        {settings.email}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {settings?.openingHoursText && (
                <div>
                  <h3 className="font-heading text-lg font-bold">
                    Horaires d&apos;ouverture
                  </h3>
                  <div className="mt-3 flex items-start gap-2 text-sm">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    <span className="whitespace-pre-line">
                      {settings.openingHoursText}
                    </span>
                  </div>
                </div>
              )}

              {settings?.googleMapsEmbedUrl && (
                <div className="overflow-hidden rounded-lg">
                  <iframe
                    src={settings.googleMapsEmbedUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte Google Maps"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

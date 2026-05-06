import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { ContactForm } from "@/components/public/contact-form";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { getPageContent, getPublishedPractitioners, getPublishedGalleryImages, getSiteSettings } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";
import { LocalBusinessJsonLd } from "@/components/public/json-ld";
import { SITE_URL } from "@/lib/utils";

export default async function HomePage() {
  const [content, practitioners, gallery, settings] = await Promise.all([
    getPageContent("home"),
    getPublishedPractitioners(),
    getPublishedGalleryImages(),
    getSiteSettings(),
  ]);

  const hero = content?.get("hero") as Record<string, string> | undefined;
  const intro = content?.get("intro_physio") as Record<string, string> | undefined;
  const teamPreview = content?.get("team_preview") as Record<string, string> | undefined;
  const gallerySection = content?.get("gallery_grid") as Record<string, string> | undefined;
  const contactSection = content?.get("contact_form_section") as Record<string, string> | undefined;
  const cta = content?.get("cta_fullwidth") as Record<string, string> | undefined;

  return (
    <>
      <LocalBusinessJsonLd
        name={settings?.cabinetName || "Cabinet Girardello"}
        phone={settings?.phone}
        email={settings?.email}
        street={settings?.addressStreet}
        postalCode={settings?.addressPostalCode}
        city={settings?.addressCity}
        url={SITE_URL}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              {hero?.h1 || "Cabinet Girardello"}
            </h1>
            <p className="mt-4 text-lg text-sage-dark md:text-xl">
              {hero?.subtitle || "Physiotherapie a Morges"}
            </p>
            {hero?.body && (
              <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
                {hero.body}
              </p>
            )}
            <Button render={<Link href={hero?.cta_url || "/contact"} />} size="lg" className="mt-8 bg-sage hover:bg-sage-dark">
              {hero?.cta_label || "Prendre rendez-vous"}
            </Button>
          </div>
        </section>

        {/* Intro physiotherapie */}
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
            {intro?.eyebrow && (
              <p className="text-sm font-medium uppercase tracking-wider text-sage">
                {intro.eyebrow}
              </p>
            )}
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
              {intro?.h2 || "Qu'est-ce que la physiotherapie ?"}
            </h2>
            {intro?.body && (
              <div className="mt-6">
                <MarkdownRenderer content={intro.body} />
              </div>
            )}
          </div>
        </section>

        {/* Team preview */}
        <section className="bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            {teamPreview?.eyebrow && (
              <p className="text-center text-sm font-medium uppercase tracking-wider text-sage">
                {teamPreview.eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-center font-heading text-3xl font-bold text-foreground">
              {teamPreview?.h2 || "Notre equipe"}
            </h2>
            {teamPreview?.intro && (
              <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                {teamPreview.intro}
              </p>
            )}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {practitioners.map((p) => (
                <Link key={p.id} href="/equipe">
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {p.photoUrl ? (
                      <div className="relative h-48 w-full bg-muted">
                        <Image
                          src={p.photoUrl}
                          alt={p.photoAlt || p.fullName}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-sage/10">
                        <span className="font-heading text-3xl text-sage">
                          {p.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-heading text-lg font-bold">{p.fullName}</h3>
                      <p className="text-sm text-sage-dark">{p.title}</p>
                      {p.bioShort && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {p.bioShort}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
              {gallerySection?.eyebrow && (
                <p className="text-center text-sm font-medium uppercase tracking-wider text-sage">
                  {gallerySection.eyebrow}
                </p>
              )}
              <h2 className="mt-2 text-center font-heading text-3xl font-bold text-foreground">
                {gallerySection?.h2 || "Notre cabinet"}
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((img) => (
                  <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={img.imageUrl}
                      alt={img.altText}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact form */}
        <section className="bg-cream">
          <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
            {contactSection?.eyebrow && (
              <p className="text-center text-sm font-medium uppercase tracking-wider text-sage">
                {contactSection.eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-center font-heading text-3xl font-bold text-foreground">
              {contactSection?.h2 || "Contactez-nous"}
            </h2>
            {contactSection?.body && (
              <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                {contactSection.body}
              </p>
            )}
            <div className="mx-auto mt-8 max-w-lg">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* CTA fullwidth */}
        <section className="bg-sage text-white">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
            <h2 className="font-heading text-3xl font-bold">
              {cta?.h2 || "Prenez rendez-vous"}
            </h2>
            {cta?.body && (
              <p className="mt-4 text-white/90">{cta.body}</p>
            )}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  <Phone className="h-5 w-5" />
                  {settings.phone}
                </a>
              )}
              {settings?.addressStreet && (
                <span className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-5 w-5" />
                  {settings.addressStreet}, {settings.addressPostalCode}{" "}
                  {settings.addressCity}
                </span>
              )}
            </div>
            <Button
              render={<Link href={cta?.cta_url || "/contact"} />}
              size="lg"
              variant="outline"
              className="mt-6 border-white bg-transparent text-white hover:bg-white hover:text-sage-dark"
            >
              {cta?.cta_label || "Prendre rendez-vous"}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

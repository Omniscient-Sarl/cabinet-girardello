import type { Metadata } from "next";
import Image from "next/image";
import { getPageContent, getPublishedPractitioners } from "@/db/queries";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Notre equipe",
  description:
    "Decouvrez l'equipe de physiotherapeutes du Cabinet Girardello a Morges.",
};

export default async function EquipePage() {
  const [content, practitioners] = await Promise.all([
    getPageContent("equipe"),
    getPublishedPractitioners(),
  ]);

  const hero = content?.get("team_member_card") as Record<string, string> | undefined;

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-20">
          {hero?.eyebrow && (
            <p className="text-sm font-medium uppercase tracking-wider text-sage">
              {hero.eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl">
            {hero?.h1 || "Notre equipe"}
          </h1>
          {hero?.intro && (
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {hero.intro}
            </p>
          )}
        </div>
      </section>

      {/* Practitioner cards */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="space-y-16">
            {practitioners.map((p) => (
              <article key={p.id} className="flex flex-col gap-8 md:flex-row">
                {/* Photo */}
                <div className="shrink-0 md:w-64">
                  {p.photoUrl ? (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                      <Image
                        src={p.photoUrl}
                        alt={p.photoAlt || p.fullName}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-sage/10">
                      <span className="font-heading text-5xl text-sage">
                        {p.fullName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-bold">{p.fullName}</h2>
                  <p className="text-sage-dark">{p.title}</p>

                  {/* Specialties */}
                  {(p.specialties as string[])?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(p.specialties as string[]).map((s) => (
                        <Badge key={s} variant="secondary" className="bg-sage/10 text-sage-dark">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Bio */}
                  {p.bioLong && (
                    <div className="mt-4">
                      <MarkdownRenderer content={p.bioLong} />
                    </div>
                  )}

                  {/* Qualifications */}
                  {(p.qualifications as string[])?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-heading text-lg font-bold">Qualifications</h3>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {(p.qualifications as string[]).map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* External link */}
                  {p.externalSiteUrl && (
                    <a
                      href={p.externalSiteUrl}
                      target="_blank"
                      rel="external noopener"
                      className="mt-4 inline-flex items-center gap-2 rounded-md bg-sage/10 px-4 py-2 text-sm font-medium text-sage-dark hover:bg-sage/20"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {p.externalSiteLabel || "Site dedie"}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

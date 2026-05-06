import type { Metadata } from "next";
import { getPageContent } from "@/db/queries";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales du Cabinet Girardello.",
};

export default async function MentionsLegalesPage() {
  const content = await getPageContent("mentions-legales");
  const body = content?.get("markdown_body") as Record<string, string> | undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold">Mentions legales</h1>
      {body?.body ? (
        <div className="mt-8">
          <MarkdownRenderer content={body.body} />
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">Contenu a venir.</p>
      )}
    </div>
  );
}

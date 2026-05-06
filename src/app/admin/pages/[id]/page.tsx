export const dynamic = "force-dynamic";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageEditorClient } from "./client";

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pages = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.id, Number(id)))
    .limit(1);

  if (!pages[0]) notFound();

  const sections = await db
    .select()
    .from(schema.pageSections)
    .where(eq(schema.pageSections.pageId, Number(id)))
    .orderBy(asc(schema.pageSections.order));

  return (
    <PageEditorClient
      page={pages[0]}
      initialSections={sections}
    />
  );
}

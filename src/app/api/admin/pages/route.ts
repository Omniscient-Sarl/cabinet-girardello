import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const pages = await db
    .select()
    .from(schema.pages)
    .orderBy(asc(schema.pages.slug));
  return NextResponse.json(pages);
}

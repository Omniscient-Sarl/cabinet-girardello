import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const pages = await db
    .select()
    .from(schema.pages)
    .orderBy(asc(schema.pages.slug));
  return NextResponse.json(pages);
}

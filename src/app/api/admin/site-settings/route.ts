import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const rows = await db.select().from(schema.siteSettings).limit(1);
  return NextResponse.json(rows[0] ?? null);
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const existing = await db.select().from(schema.siteSettings).limit(1);

  if (existing.length === 0) {
    const [row] = await db
      .insert(schema.siteSettings)
      .values({ ...body, updatedAt: new Date() })
      .returning();
    return NextResponse.json(row);
  }

  const [row] = await db
    .update(schema.siteSettings)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(schema.siteSettings.id, existing[0].id))
    .returning();
  return NextResponse.json(row);
}

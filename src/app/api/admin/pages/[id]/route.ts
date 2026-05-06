import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.id, Number(id)))
    .limit(1);
  if (!rows[0]) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(schema.pages)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(schema.pages.id, Number(id)))
    .returning();
  return NextResponse.json(row);
}

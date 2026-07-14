import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const practitioners = await db
    .select()
    .from(schema.practitioners)
    .orderBy(asc(schema.practitioners.displayOrder));
  return NextResponse.json(practitioners);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const [row] = await db
    .insert(schema.practitioners)
    .values(body)
    .returning();
  return NextResponse.json(row);
}

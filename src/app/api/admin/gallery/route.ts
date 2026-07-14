import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const images = await db
    .select()
    .from(schema.galleryImages)
    .orderBy(asc(schema.galleryImages.displayOrder));
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const [row] = await db
    .insert(schema.galleryImages)
    .values(body)
    .returning();
  return NextResponse.json(row);
}

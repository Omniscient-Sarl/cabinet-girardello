import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const { sectionId } = await params;
  const body = await req.json();
  const [row] = await db
    .update(schema.pageSections)
    .set(body)
    .where(eq(schema.pageSections.id, Number(sectionId)))
    .returning();
  return NextResponse.json(row);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const { sectionId } = await params;
  await db
    .delete(schema.pageSections)
    .where(eq(schema.pageSections.id, Number(sectionId)));
  return NextResponse.json({ success: true });
}

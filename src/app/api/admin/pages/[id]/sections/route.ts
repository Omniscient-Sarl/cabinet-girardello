import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sections = await db
    .select()
    .from(schema.pageSections)
    .where(eq(schema.pageSections.pageId, Number(id)))
    .orderBy(asc(schema.pageSections.order));
  return NextResponse.json(sections);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .insert(schema.pageSections)
    .values({ ...body, pageId: Number(id) })
    .returning();
  return NextResponse.json(row);
}

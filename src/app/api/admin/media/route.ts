import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const items = await db
    .select()
    .from(schema.media)
    .orderBy(desc(schema.media.uploadedAt));
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [row] = await db.insert(schema.media).values(body).returning();
  return NextResponse.json(row);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await db.delete(schema.media).where(eq(schema.media.id, Number(id)));
  return NextResponse.json({ success: true });
}

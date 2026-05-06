import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const practitioners = await db
    .select()
    .from(schema.practitioners)
    .orderBy(asc(schema.practitioners.displayOrder));
  return NextResponse.json(practitioners);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [row] = await db
    .insert(schema.practitioners)
    .values(body)
    .returning();
  return NextResponse.json(row);
}

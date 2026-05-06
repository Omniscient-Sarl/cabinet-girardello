import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const posts = await db
    .select()
    .from(schema.blogPosts)
    .orderBy(desc(schema.blogPosts.publishedAt));
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const [row] = await db
    .insert(schema.blogPosts)
    .values(body)
    .returning();
  return NextResponse.json(row);
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  const { ids }: { ids: number[] } = await req.json();
  await Promise.all(
    ids.map((id, index) =>
      db
        .update(schema.pageSections)
        .set({ order: index })
        .where(eq(schema.pageSections.id, id))
    )
  );
  return NextResponse.json({ success: true });
}

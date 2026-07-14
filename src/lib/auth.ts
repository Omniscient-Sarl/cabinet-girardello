import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      userId: null,
    };
  }

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      userId: null,
    };
  }

  return { error: null, userId };
}

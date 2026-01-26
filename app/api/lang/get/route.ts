import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    const lang = existing[0]?.lang ?? "ua";

    return NextResponse.json({ lang });
  } catch (err) {
    console.error("❌ Error in /api/lang/get:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

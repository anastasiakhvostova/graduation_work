import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { lang } = await req.json();

    if (!["ua", "en", "de"].includes(lang)) {
      return NextResponse.json({ message: "Invalid language" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(userProgress).values({ userId, lang });
      console.log("➕ Inserted new user progress with lang:", lang);
    } else {
      await db.update(userProgress).set({ lang }).where(eq(userProgress.userId, userId));
      console.log("🔄 Updated user progress lang to:", lang);
    }

    return NextResponse.json({ lang });
  } catch (err) {
    console.error("❌ Error in /api/lang/set:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

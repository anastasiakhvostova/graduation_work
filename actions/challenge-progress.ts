"use server"

import { revalidatePath } from "next/cache"
import { getUserProgress } from "@/db/queries"
import { auth } from "@clerk/nextjs/server"
import db from "@/db/drizzle"
import { eq, and } from "drizzle-orm"
import { challenges, challengesProgress, userProgress } from "@/db/schema"

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const currentUserProgress = await getUserProgress()
  if (!currentUserProgress) {
    throw new Error("Прогрес користувача не знайдено")
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  })
  if (!challenge) {
    throw new Error("Челендж не знайдено")
  }

  const lessonId = challenge.lessonId

  const existingChallengeProgress = await db.query.challengesProgress.findFirst({
    where: and(
      eq(challengesProgress.userId, userId),
      eq(challengesProgress.challengeId, challengeId)
    ),
  })

  const isPractice = !!existingChallengeProgress

  // ⛔ Якщо це перше проходження і немає сердець — блокуємо
  if (!isPractice && currentUserProgress.hearts === 0) {
    return { error: "серця" }
  }

  // 🔁 ПРАКТИКА (челендж уже є в challengesProgress)
  if (isPractice) {
    // просто гарантуємо, що він completed = true
    await db
      .update(challengesProgress)
      .set({ completed: true })
      .where(eq(challengesProgress.id, existingChallengeProgress.id))

    // ❗ ЖОДНИХ змін до points / hearts на практиці
    revalidatePath("/learn")
    revalidatePath(`/lesson/${lessonId}`)
    revalidatePath("/quests")
    revalidatePath("/leaderboard")

    return { practice: true }
  }

  // 🟢 ПЕРШЕ ПРОХОДЖЕННЯ
  await db.insert(challengesProgress).values({
    challengeId,
    userId,
    completed: true,
  })

  await db
    .update(userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(userProgress.userId, userId))

  revalidatePath("/learn")
  revalidatePath(`/lesson/${lessonId}`)
  revalidatePath("/quests")
  revalidatePath("/leaderboard")

  return { success: true }
}

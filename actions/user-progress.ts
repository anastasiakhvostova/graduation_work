"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm"
import db from "@/db/drizzle";
import { userProgress, challengesProgress, challenges } from "@/db/schema";
import { getCountryById, getUserProgress } from "@/db/queries";
import { POINTS_TO_REFILL } from "@/constant";


// 🟩 Оновлення або створення прогресу при виборі країни
export const upsertUserProgress = async (countryId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Не авторизований");

  const country = await getCountryById(countryId);
  if (!country) throw new Error("Країна не знайдена");

  const existingProgress = await getUserProgress();

  if (existingProgress) {
    await db
      .update(userProgress)
      .set({
        activeCountryId: countryId,
        activeRegionId: null, 
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.png",
      });
  } else {
    await db.insert(userProgress).values({
      userId,
      activeCountryId: countryId,
      activeRegionId: null,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.png",
    });
  }

  revalidatePath("/countries");
  revalidatePath(`/regions/${countryId}`);
  redirect(`/regions/${countryId}`);
};

// 🟦 Оновлення регіону користувача при виборі регіону
export const upsertUserProgressRegion = async (regionId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Не авторизований");

  const existingProgress = await getUserProgress();

  if (existingProgress) {
    await db.update(userProgress).set({
      activeRegionId: regionId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.png",
    });
  } else {
    await db.insert(userProgress).values({
      userId,
      activeRegionId: regionId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.png",
    });
  }

  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (challengeId: number, lessonId: number) => {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Не авторизований")
  }

  const currentUserProgress = await getUserProgress()
   const challenge = await db.query.challenges.findFirst({
  where: eq(challenges.id, challengeId)
  })
  if (!challenge) {
    throw new Error("Challenge not found")
  }
  const existingChallengeProgress = await db.query.challengesProgress.findFirst({
    where: and(
      eq(challengesProgress.userId, userId),
      eq(challengesProgress.challengeId, challengeId)
    )
  })
  const isPractice = !!existingChallengeProgress
  if (isPractice) {
    return {error: "practice"}
  }

  if (!currentUserProgress) {
    throw new Error("Прогрес користувача не знайдено")
  }

  if (currentUserProgress.hearts === 0) {
    return {error: "серця"}
  }

  await db.update(userProgress).set({
    hearts: Math.max(currentUserProgress.hearts - 1, 0)
  }).where(eq(userProgress.userId, userId))
  revalidatePath("/shop")
  revalidatePath("/quests")
  revalidatePath("/learn")
  revalidatePath("/leaderboard")
  revalidatePath(`/lesson/${lessonId}`)

}

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress()

  if (!currentUserProgress) {
    throw new Error("User progress not found")
  }
  if (currentUserProgress.points < POINTS_TO_REFILL) {
    throw new Error("Not enough points")
  }

  await db.update(userProgress).set({
    hearts: 5,
    points: currentUserProgress.points - POINTS_TO_REFILL,
  }).where(eq(userProgress.userId, currentUserProgress.userId))

  revalidatePath("/shop")
   revalidatePath("/quests")
  revalidatePath("/learn")
  revalidatePath("/leaderboard")
}


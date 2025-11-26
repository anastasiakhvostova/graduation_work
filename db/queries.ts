import { cache } from "react"
import db from "./drizzle"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { userProgress, countries, units, regions, challengesProgress, challenges, lessons} from "./schema"


export const getUserProgress = async () => {
    const { userId } = await auth()

    if (!userId) {
        return null
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCountry: true,
            activeRegion: true,  
        }
    })

    return data
}

export const getUnits = cache(async () => {
    const userProgress = await getUserProgress()
    const { userId } =await auth()
    if (!userId || !userProgress?.activeRegionId) {
        return []
    }


    const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.regionId, userProgress.activeRegionId),
    with: {
    lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
        challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
            challengeProgress: {
                where: eq(
                    challengesProgress.userId,
                    userId
                )
            }
            }
            }
        }
        }
    }

    });

    const normalizeData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            if (
                lesson.challenges.length === 0
            ){
                return { ...lesson, completed: false}
            }
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress 
                && challenge.challengeProgress.length > 0
                && challenge.challengeProgress.every((progress) => progress.completed)
            })

            return { ...lesson, completed: allCompletedChallenges}
        })
        return { ...unit, lessons: lessonsWithCompletedStatus}
    })
    return normalizeData
})

export const getCountries = cache(async () => {
    const data = await db.query.countries.findMany()

    return data;
})


export const getCountryById = cache(async (countryId: number) => {
    const data = await db.query.countries.findFirst({
        where: eq(countries.id, countryId)


    })

    return data

})

export const getRegionsByCountryId = cache(async (countryId: number) => {
  const data = await db.query.regions.findMany({
    where: eq(regions.countryId, countryId),
    with: {
        units: {
            orderBy: (units, { asc }) => [asc(units.order)],
            with: {
                lessons: {
                    orderBy: (lessons, { asc }) => [asc(lessons.order)]
                }
            }
        
        }
    }
  });

  return data ?? []; 
});


export const getRegionProgress = cache(async () => {
    const { userId } = await auth()
    const userProgress = await getUserProgress()

    if (!userId || !userProgress?.activeRegionId) {
        return null
    }

    const unitsInActiveRegion = await db.query.units.findMany({
        orderBy: (units, {asc}) => [asc(units.order)],
        where: eq(units.regionId, userProgress.activeRegionId),
        with: {
            lessons: {
                orderBy: (lessons, {asc}) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengesProgress.userId, userId)
                            }
                        }
                    }
                }
            }
        }
    })
    const fisrtUncopletedLesson = unitsInActiveRegion
        .flatMap((unit) => unit.lessons)
        .find(((lesson) => {
            return lesson.challenges.some((challenge) => {
                return !challenge.challengeProgress || challenge.challengeProgress.length === 0 || challenge.challengeProgress.some((progress) => progress.completed  === false)
            })
        }))
    return {
        activeLesson: fisrtUncopletedLesson,
        activeLessonId: fisrtUncopletedLesson?.id
    }
})


export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth()

    if (!userId) {
        return null
    }

    const regionProgress = await getRegionProgress()

    const lessonId = id || regionProgress?.activeLessonId

    if (!lessonId) { 
        return null
    } 

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, {asc}) => [asc(challenges.order)],
                with: {
                    challengeOption: true,
                    challengeProgress: {
                        where: eq(challengesProgress.userId, userId),

                    }
                }
            }
        }
    })

    if (!data || !data.challenges) {
        return null
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed)

        return { ...challenge, completed }
    })
    return { ...data, challenges: normalizedChallenges}
})


export const getLessonPercantage = cache(async () => {
    const regionProgress = await getRegionProgress()

    if (!regionProgress?.activeLessonId) {
        return 0
    }
    const lesson = await getLesson(regionProgress.activeLessonId)

    if (!lesson || lesson.challenges.length === 0) {
  return 0
}

    const completedChallenges = lesson.challenges
        .filter((challenge) => challenge.completed)
    const percentage = Math.round(
        (completedChallenges.length / lesson.challenges.length) * 100
    )

    return percentage
})

export const getTopTenUsers = cache(async () => {
    const { userId } = await auth()

    if (!userId){
        return []
    }
    const data = await db.query.userProgress.findMany({
        orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
        limit: 10,
        columns: {
            userId: true,
            userName: true,
            userImageSrc: true,
            points: true,
        }

    })
    return data
})
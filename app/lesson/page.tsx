import { getLesson, getUserProgress } from "@/db/queries"
import { Quiz } from "./quiz"
import { redirect } from "next/navigation"

const LessonPage = async () => {
  const lessonPromise = getLesson()
  const progressPromise = getUserProgress()

  const [lesson, userProgress] = await Promise.all([
    lessonPromise,
    progressPromise,
  ])

  if (!userProgress) redirect("/learn")

  if (!lesson) {
    return (
      <Quiz
        initialLessonId={0}
        initialLessonChallenges={[]}
        initialHearts={userProgress.hearts}
        initialPercentage={100}
      />
    )
  }

  const completed = lesson.challenges.filter(c => c.completed).length
  const total = lesson.challenges.length || 1
  const initialPercentage = (completed / total) * 100

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
    />
  )
}

export default LessonPage
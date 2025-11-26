"use client"

import { Footer } from "./footer"
import { challengesOptions, challenges } from "@/db/schema"
import { useState, useTransition, useRef } from "react"
import { Header } from "./header"
import { QuestionBubble } from "./question-bubble"
import { Challenge } from "./challenge"
import { WriteChallenge, WriteChallengeRef } from "./write-challenge"
import { upsertChallengeProgress } from "@/actions/challenge-progress"
import { reduceHearts } from "@/actions/user-progress"
import { useAudio, useWindowSize } from "react-use"
import Image from "next/image"
import { ResultCard } from "./result-card"
import Confetti from "react-confetti"
import { useRouter } from "next/navigation"
import { useHeartsModal } from "@/store/use-hearts-modal" // 👈 перевір шлях

type Props = {
  initialLessonId: number
  initialHearts: number
  initialPercentage: number
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOption: typeof challengesOptions.$inferSelect[]
  })[]
}

export const Quiz = ({
  initialLessonId,
  initialHearts,
  initialPercentage,
  initialLessonChallenges,
}: Props) => {
  const router = useRouter()
  const { width, height } = useWindowSize()
  const heartsModal = useHeartsModal()

  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.mp3" })
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.mp3",
  })
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true })

  const [pending, startTransition] = useTransition()

  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(initialPercentage)
  const [challenges] = useState(initialLessonChallenges)

  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompleted = challenges.findIndex((ch) => !ch.completed)
    return uncompleted === -1 ? 0 : uncompleted
  })

  const [isFinished, setIsFinished] = useState(
    initialPercentage >= 100 || activeIndex >= challenges.length
  )

  const [selectedOption, setSelectedOption] = useState<number | undefined>()
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")

  const writeRef = useRef<WriteChallengeRef>(null)

  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOption ?? []

  const playAudio = async (src?: string | null) => {
    if (!src) return
    try {
      const audio = new Audio(src)
      await audio.play()
    } catch {}
  }

  const playChallengeAudio = () => {
    if (challenge?.audioSrc) {
      playAudio(challenge.audioSrc)
      return
    }
    const opt = options.find((o) => o.audioSrc)
    if (opt?.audioSrc) playAudio(opt.audioSrc)
  }

  const onNext = () => {
    if (activeIndex + 1 >= challenges.length) {
      setIsFinished(true)
      setStatus("none")
      return
    }

    setActiveIndex((prev) => prev + 1)
    setStatus("none")
    setSelectedOption(undefined)
    writeRef.current?.clear()
  }

  const onContinue = () => {
    // якщо вже показаний результат — ведемо себе як раніше
    if (status !== "none") {
      if (status === "correct") onNext()
      else setStatus("none")
      return
    }

    // якщо серця вже 0 — одразу показуємо модалку
    if (hearts === 0) {
      heartsModal.open()
      return
    }

    if (!challenge) return

    // --- WRITE challenge ---
    if (challenge.type === "WRITE") {
      const answer = writeRef.current?.getValue() || ""
      const correctAnswer = options.find((o) => o.correct)?.text || ""
      const isCorrect =
        answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()

      setStatus(isCorrect ? "correct" : "wrong")

      if (isCorrect) {
        startTransition(() => {
          upsertChallengeProgress(challenge.id)
          correctControls.play()
          setPercentage((prev) => prev + 100 / challenges.length)
        })
      } else {
        startTransition(() => {
          reduceHearts(challenge.id, initialLessonId).then((res) => {
            // practice: урок уже був пройдений → серця не знімаємо
            if (res && "error" in res) {
              if (res.error === "серця") {
                setHearts(0)
                heartsModal.open()
                return
              }
              if (res.error === "practice") {
                incorrectControls.play()
                return
              }
            }

            incorrectControls.play()
            setHearts((prev) => Math.max(prev - 1, 0))
          })
        })
      }

      return
    }

    // --- інші типи challenge (ASSIST / LISTEN / тощо) ---
    if (!selectedOption) return
    const correctOption = options.find((o) => o.correct)
    if (!correctOption) return

    const isCorrect = correctOption.id === selectedOption
    setStatus(isCorrect ? "correct" : "wrong")

    if (isCorrect) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
        correctControls.play()
        setPercentage((prev) => prev + 100 / challenges.length)
      })
    } else {
      startTransition(() => {
        reduceHearts(challenge.id, initialLessonId).then((res) => {
          if (res && "error" in res) {
            if (res.error === "серця") {
              setHearts(0)
              heartsModal.open()
              return
            }
            if (res.error === "practice") {
              incorrectControls.play()
              return
            }
          }

          incorrectControls.play()
          setHearts((prev) => Math.max(prev - 1, 0))
        })
      })
    }
  }

  if (isFinished) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={1000}
        />

        <div className="flex flex-col gap-y-6 lg:gap-y-10 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.png"
            alt="Finish"
            height={100}
            width={100}
            className="hidden lg:block"
          />
          <Image
            src="/finish.png"
            alt="Finish"
            height={60}
            width={60}
            className="block lg:hidden"
          />

          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Чудова робота! <br /> Ви завершили урок!
          </h1>

          <div className="flex items-center gap-x-4 w-full justify-center">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
          <button
            onClick={() => router.push("/learn")}
            className="mt-6 px-8 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg shadow-md transition"
          >
            Продовжити
          </button>
        </div>
      </>
    )
  }

  if (!challenge) return null

  const title =
    challenge.type === "ASSIST"
      ? "Обери правильну відповідь"
      : challenge.question

  return (
    <>
      {correctAudio}
      {incorrectAudio}
      {finishAudio}

      <Header hearts={hearts} percentage={percentage} />

      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:minh-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>

            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}

              {challenge.type === "LISTEN" && (
                <div className="flex items-center justify-center mb-6">
                  <button
                    onClick={playChallengeAudio}
                    className="flex items-center gap-x-3 px-6 py-3 rounded-full border border-neutral-300 hover:bg-neutral-100 shadow-sm text-lg font-semibold"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24">
                      <path d="M3 10v4h4l5 4V6L7 10H3z" fill="currentColor" />
                    </svg>
                    Прослухати
                  </button>
                </div>
              )}

              {challenge.type === "WRITE" ? (
                <WriteChallenge ref={writeRef} placeholder="Введіть відповідь" />
              ) : (
                <Challenge
                  options={options}
                  onSelect={(id) => {
                    if (status === "none") setSelectedOption(id)
                  }}
                  status={status}
                  selectedOption={selectedOption}
                  disabled={false}
                  type={challenge.type}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer disabled={pending} status={status} onCheck={onContinue} />
    </>
  )
}



// лера
"use client"

import { Footer } from "./footer"
import { challengesOptions, challenges } from "@/db/schema"
import { useState, useTransition, useRef } from "react"
import { Header } from "./header"
import { QuestionBubble } from "./question-bubble"
import { Challenge } from "./challenge"
import { WriteChallenge, WriteChallengeRef } from "./write-challenge"
import { upsertChallengeProgress } from "@/actions/challenge-progress"
import { reduceHearts, type ReduceHeartsResult } from "@/actions/user-progress"
import { useAudio, useWindowSize } from "react-use"
import Image from "next/image"
import { ResultCard } from "./result-card"
import Confetti from "react-confetti"
import { useRouter } from "next/navigation"
import { useHeartsModal } from "@/store/use-hearts-modal"

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
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: false })

  const [pending, startTransition] = useTransition()

  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(initialPercentage)
  const [challengesState] = useState(initialLessonChallenges)

  // шукаємо перший незавершений челендж
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompleted = initialLessonChallenges.findIndex((ch) => !ch.completed)
    return uncompleted === -1 ? 0 : uncompleted
  })

  // урок завершений тільки коли дійшли до кінця масиву
  const [isFinished, setIsFinished] = useState(
    activeIndex >= initialLessonChallenges.length
  )

  // якщо урок був на 100% — це практика
  const isPracticeMode = initialPercentage >= 100

  // модалка при вході в уже пройдений урок
  const [showPracticeModal, setShowPracticeModal] = useState(isPracticeMode)

  const [selectedOption, setSelectedOption] = useState<number | undefined>()
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")

  const writeRef = useRef<WriteChallengeRef>(null)

  const challenge = challengesState[activeIndex]
  const options = challenge?.challengeOption ?? []

  const playAudio = async (src?: string | null) => {
    if (!src) return
    try {
      const audio = new Audio(src)
      await audio.play()
    } catch {
      // ігноруємо помилки
    }
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
    if (activeIndex + 1 >= challengesState.length) {
      setIsFinished(true)
      setStatus("none")
      // аудіо вже підключене як компонент вище
      finishAudio?.props?.autoPlay
      return
    }

    setActiveIndex((prev) => prev + 1)
    setStatus("none")
    setSelectedOption(undefined)
    writeRef.current?.clear()
  }

  const onContinue = () => {
    // якщо вже показано результат за це питання — або далі, або скидаємо статус
    if (status !== "none") {
      if (status === "correct") onNext()
      else setStatus("none")
      return
    }

    // якщо серця закінчились – показуємо модалку
    if (hearts === 0) {
      heartsModal.open()
      return
    }

    if (!challenge) return

    // ---------------- WRITE challenge ----------------
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

          // не збільшуємо відсоток, якщо цей челендж уже був completed
          setPercentage((prev) =>
            challenge.completed ? prev : prev + 100 / challengesState.length
          )
        })
      } else {
        startTransition(() => {
          reduceHearts(challenge.id, initialLessonId).then(
            (res: ReduceHeartsResult) => {
              if (res && "error" in res) {
                if (res.error === "серця") {
                  setHearts(0)
                  heartsModal.open()
                  return
                }
                if (res.error === "practice") {
                  // практика: серця не знімаємо
                  incorrectControls.play()
                  return
                }
              }

              incorrectControls.play()
              setHearts((prev) => Math.max(prev - 1, 0))
            }
          )
        })
      }

      return
    }

    // --------------- інші типи (ASSIST / LISTEN / ...) ---------------
    if (!selectedOption) return
    const correctOption = options.find((o) => o.correct)
    if (!correctOption) return

    const isCorrect = correctOption.id === selectedOption
    setStatus(isCorrect ? "correct" : "wrong")

    if (isCorrect) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
        correctControls.play()

        setPercentage((prev) =>
          challenge.completed ? prev : prev + 100 / challengesState.length
        )
      })
    } else {
      startTransition(() => {
        reduceHearts(challenge.id, initialLessonId).then(
          (res: ReduceHeartsResult) => {
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
          }
        )
      })
    }
  }

  // ---------------- ЕКРАН ЗАВЕРШЕННЯ УРОКУ ----------------
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
            {/* при практиці показуємо 0 балів */}
            <ResultCard
              variant="points"
              value={isPracticeMode ? 0 : challengesState.length * 10}
            />
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

  // ---------------- ОСНОВНИЙ ЕКРАН УРОКУ ----------------
  return (
    <>
      {correctAudio}
      {incorrectAudio}
      {finishAudio}

      <Header hearts={hearts} percentage={percentage} />

      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          {challenge.type === "LISTEN" ? (
            // 🔊 КРАСИВИЙ ЕКРАН ДЛЯ LISTEN
            <div className="w-full flex justify-center px-4">
              <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white/90 shadow-xl px-6 py-10 lg:px-10 lg:py-12 flex flex-col gap-y-8">
                {/* Заголовок */}
                <h1 className="text-center text-2xl lg:text-3xl font-semibold text-slate-900">
                  Послухайте й оберіть. Що означає слово?
                </h1>

                {/* Кнопка "Прослухати" */}
                <div className="flex justify-center">
                  <button
                    onClick={playChallengeAudio}
                    className="inline-flex items-center gap-x-2 rounded-full bg-orange-600 px-7 py-3 
                               text-white text-base lg:text-lg font-medium shadow-lg
                               hover:bg-orange-700 active:scale-[0.98] transition"
                    type="button"
                  >
                    {/* Іконка звуку */}
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      className="shrink-0"
                    >
                      <path
                        d="M3 10v4h4l5 4V6L7 10H3z"
                        fill="currentColor"
                      />
                      <path
                        d="M16.5 8.11a4 4 0 0 1 0 7.78M19 6a7 7 0 0 1 0 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Прослухати</span>
                  </button>
                </div>

                {/* Варіанти відповіді */}
                <div className="mt-4">
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
                </div>
              </div>
            </div>
          ) : (
            // 🧩 ЕКРАН ДЛЯ ІНШИХ ТИПІВ
            <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
              <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                {title}
              </h1>

              <div>
                {challenge.type === "ASSIST" && (
                  <QuestionBubble question={challenge.question} />
                )}

                {challenge.type === "WRITE" ? (
                  <WriteChallenge
                    ref={writeRef}
                    placeholder="Введіть відповідь"
                  />
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
          )}
        </div>
      </div>

      <Footer disabled={pending} status={status} onCheck={onContinue} />

      {/* 🔔 Попап для вже пройденого уроку */}
      {showPracticeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-3">
              Повторне проходження уроку
            </h2>
            <p className="text-sm text-neutral-700 mb-6">
              Ви вже пройшли цей урок на 100%.
              <br />
              Повторне проходження{" "}
              <span className="font-semibold">
                не дає додаткових балів і сердечок.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => router.push("/learn")}
                className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-sm font-medium"
              >
                Вийти
              </button>
              <button
                onClick={() => setShowPracticeModal(false)}
                className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold"
              >
                Продовжити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}




"use client"

import { Footer } from "./footer"
import { challengesOptions, challenges } from "@/db/schema"
import { useState, useTransition, useRef } from "react"
import { Header } from "./header"
import { QuestionBubble } from "./question-bubble"
import { Challenge } from "./challenge"
import { WriteChallenge, WriteChallengeRef } from "./write-challenge"
import { upsertChallengeProgress } from "@/actions/challenge-progress"
import { toast } from "sonner"
import { reduceHearts } from "@/actions/user-progress"
import { useAudio, useWindowSize } from "react-use"
import Image from "next/image"
import { ResultCard } from "./result-card"
import { useRouter } from "next/navigation"
import Confetti from "react-confetti"
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
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal()
  const { width, height } = useWindowSize()
  const router = useRouter()

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true })
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.mp3" })
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.mp3" })
  const [pending, startTransition] = useTransition()
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(initialPercentage)
  const [challenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })
  const [selectedOption, setSelectedOption] = useState<number>()
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")

  const writeRef = useRef<WriteChallengeRef>(null)

  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOption ?? []

  const onNext = () => {
    setActiveIndex((current) => current + 1)
    setSelectedOption(undefined)
    setStatus("none")
    writeRef.current?.clear()
  }

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} tweenDuration={1000} />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.png"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.png"
            alt="Finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Чудова робота! <br /> Ви завершили урок!
          </h1>
          <div className="flex items-center gap-x-4 w-full justify-center">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={initialLessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    )
  }

  const title = challenge.type === "ASSIST" ? "Обери правильну відповідь" : challenge.question

  const onSelect = (id: number) => {
    if (status !== "none") return
    setSelectedOption(id)
  }

  const onContinue = () => {
    if (status !== "none") {
      if (status === "correct") onNext()
      else setStatus("none")
      return
    }

    if (challenge.type === "WRITE") {
      const answer = writeRef.current?.getValue() || ""
      const correctOption = options.find(o => o.correct)?.text || ""
      const isCorrect = answer.trim().toLowerCase() === correctOption.trim().toLowerCase()
      setStatus(isCorrect ? "correct" : "wrong")

      if (isCorrect) {
        startTransition(() => {
          upsertChallengeProgress(challenge.id)
          correctControls.play()
          setPercentage(prev => prev + 100 / challenges.length)
        })
      } else {
        startTransition(() => {
          reduceHearts(challenge.id, initialLessonId).then(() => {
            incorrectControls.play()
            setHearts(prev => Math.max(prev - 1, 0))
          })
        })
      }
      return
    }

    // Для SELECT / ASSIST
    if (!selectedOption) return
    const correctOption = options.find(o => o.correct)
    if (!correctOption) return

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
        correctControls.play()
        setStatus("correct")
        setPercentage(prev => prev + 100 / challenges.length)
      })
    } else {
      startTransition(() => {
        reduceHearts(challenge.id, initialLessonId).then(() => {
          incorrectControls.play()
          setStatus("wrong")
          setHearts(prev => Math.max(prev - 1, 0))
        })
      })
    }
  }

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      {finishAudio}
      <Header hearts={hearts} percentage={percentage} />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              {challenge.type === "WRITE" ? (
                <WriteChallenge ref={writeRef} placeholder="Введіть відповідь" />
            ) : (
                <Challenge
                    options={options}
                    onSelect={onSelect}
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
      <Footer
        disabled={pending}
        status={status}
        onCheck={onContinue}
      />
    </>
  )
}





















    // const { open: openHeartsModal } = useHeartsModal()
    // const { open: openPracticeModal } = usePracticeModal()

//     useMount(() => {
//         if (initialPercentage === 100){
//             openPracticeModal()
//         }
//     })
//     const { width, height } = useWindowSize()

//     const router = useRouter()

//     const [finishAudio] = useAudio({src: "/finish.mp3", autoPlay: true})
//     const [
//         correctAudio,
//         _c,
//         correctControls
//     ] = useAudio({src: "/correct.mp3"})
//     const [
//         incorrectAudio,
//         _i,
//         incorrectControls
//     ] = useAudio({src: "/incorrect.mp3"})

//     const [pending, startTransition] = useTransition()
//     const [lessonId] = useState(initialLessonId)
//     const [hearts, setHearts] = useState(initialHearts)
//     const [percentage, setPercentage] = useState(initialPercentage)
//     const [challenges] = useState(initialLessonChallenges)
//     const [activeIndex, setActiveIndex] = useState(() => {
//         const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
//         return uncompletedIndex === -1 ? 0 : uncompletedIndex
//     })
//     const [selectedOption, setSelectedOption] = useState<number>()
//     const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")
//     const challenge = challenges[activeIndex]
//     const options = challenge?.challengeOption ?? []

//     const onNext = () => {
//         setActiveIndex((current) => current + 1)
//     }

//     const onSelect = (id: number) => {
//         if (status != "none") return

//         setSelectedOption(id)
//     }

//     const onContinue = () => {
//         if(!selectedOption) return

//         if (status === "wrong"){
//             setStatus("none")
//             setSelectedOption(undefined)
//             return
//         }
//         if (status === "correct"){
//             onNext()
//             setStatus("none")
//             setSelectedOption(undefined)
//             return
//         }
//         const correctOption = options.find((option) => option.correct)

//         if (!correctOption){
//             return
//         }
//         if (correctOption.id === selectedOption) {
//             startTransition(() => {
//                 upsertChallengeProgress(challenge.id)
//                     .then((response) => {
//                         if (response?.error === "hearts"){
//                             openHeartsModal()
//                             return
//                         }
//                         correctControls.play()
//                         setStatus("correct")
//                         setPercentage((prev) => prev + 100 /challenges.length)

//                         if (initialPercentage === 100){
//                             setHearts((prev) => Math.min(prev + 1, 5))
//                         }
//                     })
//                     .catch(() => toast.error("Something went wrong. Please try again"))
//             })
//         }
//         else{
//             startTransition(() => {
//                 reduceHearts(challenge.id).then((response) => {if (response?.error === "hearts"){
//                     openHeartsModal()
//                     return
//                 }
//                 incorrectControls.play()
//                 setStatus("wrong")

//                 if (!response?.error) {
//                     setHearts((prev) => Math.max(prev - 1, 0))
//                 }
//             })
//             .catch(() => toast.error("Something went wrong.  Please try again"))
//             })
//         }
//     }

// if (!challenge) { 
//   return (
//     <>
//     {finishAudio}
//     <Confetti
//     width={width} 
//     height={height}
//     recycle={false}
//     numberOfPieces={500}
//     tweenDuration={10000}
//     />
//     <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center gap-y-6">
//       <Image
//         src="/finish.png"
//         alt="Finish"
//         className="hidden lg:block"
//         height={100}
//         width={100}
//       />
//       <Image
//         src="/finish.png"
//         alt="Finish"
//         className="block lg:hidden"
//         height={50}
//         width={50}
//       />

//       <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
//         Great job! <br /> You`ve completed the lesson
//       </h1>

//       {/* картки поруч, але під текстом */}
//       <div className="flex items-center gap-x-4 w-full justify-center">
//         <ResultCard variant="points" value={challenges.length * 10} />
//         <ResultCard variant="hearts" value={hearts} />
//       </div>
//     </div>
//     <Footer
//     lessonId={lessonId}
//     status="completed"
//     onCheck={() => router.push("/learn")}/>
//     </>
//   )
// }


//     const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question
    
    
//     return(
//        <>
//        {incorrectAudio}
//        {correctAudio}
//             <Header 
//             hearts={hearts}
//             percentage={percentage}
//             // hasActiveSubscription={!!userSubscription?.isActive}
//             />
//             <div className="flex-1">
//                 <div className="h-full flex items-center justify-center">
//                     <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
//                         <h1 className="text-lg lg:text-3xl text-center lg:text-start fond-bold text-neutral-700">
//                             {title}
//                         </h1>
//                         <div>
//                             {challenge.type === "SELECT" && (
//                                 <QuestionBubble question={challenge.question}/>
//                             )}
//                             <Challenge options={options} onSelect={onSelect} status={status} selectedOption={selectedOption} disabled={pending} type={challenge.type}/>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//             <Footer
//             disabled={pending || !selectedOption}
//             status={status}
//             onCheck={onContinue}/>
// //        </>
//     )

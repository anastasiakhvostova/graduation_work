import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"
import { quests } from "@/constant"
import { Progress } from "./ui/progress"

type Props = {
  points: number
}

export const Quests = ({ points }: Props) => {
  const currentQuest = quests.find((quest) => points < quest.value)

  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between w-full space-y-2">
        <h3 className="font-bold text-lg">Челенджі</h3>
        <Link href="/quests">
          <Button size="sm" variant="primaryOutline">
            Побачити усі
          </Button>
        </Link>
      </div>
      {currentQuest ? (
        <div
          className="flex items-center w-full p-4 gap-x-4 border-t-2"
          key={currentQuest.title}
        >
          <Image src="/points.png" alt="Points" width={60} height={60} />
          <div className="flex flex-col gap-y-2 w-full">
            <p className="text-neutral-700 text-xl font-bold">
              {currentQuest.title}
            </p>
            <Progress
              value={(points / currentQuest.value) * 100}
              className="h-3"
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-neutral-500 font-medium">
          Усі квести завершено 🎉
        </p>
      )}
    </div>
  )
}

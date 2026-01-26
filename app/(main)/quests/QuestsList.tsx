"use client";

import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constant";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";

type Props = {
  points: number;
};

export const QuestsList = ({ points }: Props) => {
  const { lang } = useLanguage();

  return (
    <div className="w-full flex-col items-center">
      <Image src="/quests.png" alt="Quests" width={90} height={90} />
      <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
        {translations[lang].questsTitle}
      </h1>
      <p className="text-muted-foreground text-center text-lg mb-6">
        {translations[lang].questsDescription}
      </p>
      <ul className="w-full">
        {quests.map((quest) => {
          const progress = (points / quest.value) * 100;
          return (
            <div
              className="flex items-center w-full p-4 gap-x-4 border-t-2"
              key={quest.key}
            >
              <Image src="/points.png" alt="Points" width={60} height={60} />
              <div className="flex flex-col gap-y-2 w-full">
                <p className="text-neutral-700 text-xl font-bold">
                  {translations[lang].quests[quest.key]}
                </p>
                <Progress value={progress} className="h-3" />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

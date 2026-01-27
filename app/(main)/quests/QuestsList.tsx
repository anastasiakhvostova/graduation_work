"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constant";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  points: number;
  hasProgress: boolean;
};

export const QuestsList = ({ points, hasProgress }: Props) => {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [open, setOpen] = useState(false);

  /* open dialog if no progress */
  useEffect(() => {
    if (!hasProgress) {
      setOpen(true);
    }
  }, [hasProgress]);

  return (
    <>
      {/* ===== NO PROGRESS DIALOG ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t.leaderboardNoProgressTitle}
            </DialogTitle>

            <DialogDescription className="text-center mt-2">
              {t.leaderboardNoProgressText}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center">
            <Link
              href="/countries"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {t.goToCountries}
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== QUESTS CONTENT ===== */}
      <div
        className={cn(
          "w-full flex-col items-center transition-all",
          !hasProgress && "grayscale opacity-50 pointer-events-none"
        )}
      >
        <Image
          src="/quests.png"
          alt="Quests"
          width={90}
          height={90}
          className="mx-auto"
        />

        <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
          {t.questsTitle}
        </h1>

        <p className="text-muted-foreground text-center text-lg mb-6">
          {t.questsDescription}
        </p>

        <ul className="w-full">
          {quests.map((quest) => {
            const progress = Math.min(
              (points / quest.value) * 100,
              100
            );

            return (
              <div
                key={quest.key}
                className="flex items-center w-full p-4 gap-x-4 border-t-2"
              >
                <Image
                  src="/points.png"
                  alt="Points"
                  width={60}
                  height={60}
                />

                <div className="flex flex-col gap-y-2 w-full">
                  <p className="text-neutral-700 text-xl font-bold">
                    {t.quests[quest.key]}
                  </p>

                  <Progress value={progress} className="h-3" />
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};

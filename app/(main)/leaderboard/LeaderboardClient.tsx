"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type LeaderboardUser = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
};

type Props = {
  leaderboard: LeaderboardUser[];
  hasProgress: boolean;
};

export const LeaderboardClient = ({ leaderboard, hasProgress }: Props) => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasProgress) {
      setOpen(true);
    }
  }, [hasProgress]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {translations[lang].leaderboardNoProgressTitle}
            </DialogTitle>

            <DialogDescription className="text-center mt-2">
              {translations[lang].leaderboardNoProgressText}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center">
            <Link
              href="/countries"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {translations[lang].goToCountries}
            </Link>
          </div>
        </DialogContent>
      </Dialog>


      <div className="w-full flex-col items-center">
        <Image
          src="/Leardboard.png"
          alt="Leaderboard"
          width={90}
          height={90}
          className="mx-auto"
        />

        <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
          {translations[lang].leaderboardTitle}
        </h1>

        <p className="text-muted-foreground text-center text-lg mb-6">
          {translations[lang].leaderboardDescription}
        </p>

        <Separator className="mb-4 h-0.5 rounded-full" />

        {leaderboard.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-yellow-200/50"
          >
            <p className="font-bold text-lime-700 mr-4">
              {index + 1}
            </p>

            <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
              <AvatarImage src={user.userImageSrc} />
            </Avatar>

            <p className="font-bold text-neutral-800 flex-1">
              {user.userName}
            </p>

            <p className="text-muted-foreground">
              {user.points} XP
            </p>
          </div>
        ))}
      </div>
    </>
  );
};


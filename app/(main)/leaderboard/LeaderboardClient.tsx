"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";

type LeaderboardUser = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
};

type Props = {
  leaderboard: LeaderboardUser[];
};

export const LeaderboardClient = ({ leaderboard }: Props) => {
  const { lang } = useLanguage();

  return (
    <div className="w-full flex-col items-center">
      <Image
        src="/Leardboard.png"
        alt="Leaderboard"
        width={90}
        height={90}
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
  );
};

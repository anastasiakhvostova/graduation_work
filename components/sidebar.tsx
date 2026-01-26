"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { SidebarItem } from "@/components/sidebat-items";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const { lang } = useLanguage(); // беремо обрану мову

  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 border-r-2 flex-col",
        className
      )}
    >
      {/* Верхній блок: картинка + назва */}
      <div className="flex items-center gap-x-2 px-4 py-4">
        <Image src="/mascot.png" height={32} width={32} alt="Mascot" />
        <h1
          className="text-lg font-extrabold tracking-wide"
          style={{ color: "#C3A97F" }}
        >
          Dialecto
        </h1>
      </div>

      {/* Основні пункти сайдбару */}
      <div className="flex flex-col gap-y-2 flex-1 px-4">
        <SidebarItem
          label={translations[lang].sidebarLearn}
          iconSrc="/house.png"
          href="/learn"
          iconSize={38}
        />
        <SidebarItem
          label={translations[lang].sidebarPractice}
          iconSrc="/practice.png"
          href="/practice"
          iconSize={38}
        />

        {/* 🟦 РОЗДІЛЮВАЧ МІЖ ГРУПАМИ */}
        <div className="my-2 h-[2px] w-full bg-[#91d5ff] rounded-full" />

        <SidebarItem
          label={translations[lang].sidebarLeaderboard}
          iconSrc="/Leardboard.png"
          href="/leaderboard"
          iconSize={38}
        />
        <SidebarItem
          label={translations[lang].sidebarChallenges}
          iconSrc="/quests.png"
          href="/quests"
          iconSize={38}
        />
        <SidebarItem
          label={translations[lang].sidebarShop}
          iconSrc="/shop.png"
          href="/shop"
          iconSize={38}
        />
        <SidebarItem
          label={translations[lang].sidebarDictionary}
          iconSrc="/dictionary.png"
          href="/dictionary"
          iconSize={38}
        />
      </div>

      {/* Кнопка користувача */}
      <div className="px-4 py-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};

"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage, Lang } from "./languageContext";
import { ArrowLeftRight } from "lucide-react";

type Translations = { ua: string; en: string; de: string };
type Country = { id: number; title: string; imageSrc: string; translations: Translations };
type Props = { activeCourse: Country | null; hearts: number; points: number };

const languageFlags: Record<Lang, string> = {
  ua: "/flags/ua.png",
  en: "/flags/en.png",
  de: "/flags/de.png",
};

export const UserProgress = ({ activeCourse, points, hearts }: Props) => {
  const { lang, setLang } = useLanguage();

  const cycleLanguage = () => {
    const nextLang: Lang =
      lang === "ua" ? "de" : lang === "de" ? "en" : "ua";
    setLang(nextLang);
  };

  return (
    <div className="flex justify-end items-center gap-3 w-full">
      {/* КНОПКА МОВИ */}
      <div
        onClick={cycleLanguage}
        title="Змінити мову"
        className="
    mr-auto
    flex items-center gap-2
    bg-yellow-100
    px-3 py-1.5
    rounded-xl
    cursor-pointer
    hover:bg-yellow-200
    transition
    shadow-sm
  "
      >
        <Image
          src={languageFlags[lang]}
          alt="Мова"
          width={28}
          height={28}
          className="rounded-md"
        />
        <ArrowLeftRight size={16} className="text-yellow-700" />
      </div>

      {/* БАЛИ */}
      <Link href="/shop" className="flex items-center gap-1 text-orange-500">
        <Image src="/points.png" height={28} width={28} alt="Бали" />
        <span className="font-medium">{points}</span>
      </Link>

      {/* СЕРЦЯ */}
      <Link href="/shop" className="flex items-center gap-1 text-rose-500">
        <Image src="/heart.png" height={22} width={22} alt="Серця" />
        <span className="font-medium">{hearts}</span>
      </Link>
    </div>
  );
};

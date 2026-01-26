"use client";

import Image from "next/image";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";
import { Items } from "./items";
import { UserProgress } from "@/components/user-progress"
type Props = {
  points: number;
  hearts: number;
};


export const ShopList = ({ points, hearts }: Props) => {
  const { lang } = useLanguage();

  return (
    <div className="w-full flex-col items-center">
      <Image 
        src="/shop.png"
        alt="Shop"
        width={90}
        height={90}
      />

      <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
        {translations[lang].sidebarShop}
      </h1>

      <p className="text-muted-foreground text-center text-lg mb-6">
        {translations[lang].shopDescription}
      </p>

      <Items
        hearts={hearts}
        points={points}
      />
    </div>
  );
};

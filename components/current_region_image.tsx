"use client";

import Image from "next/image";

type Props = {
  activeRegionId: number | null;
  className?: string;
};

const REGION_IMAGES: Record<number, string> = {
  7: "/maps/північ.png",
  8: "/maps/захід.png",
  9: "/maps/східне.png",
  10: "/maps/platt.png",
  11: "/maps/mittle.png",
  12: "/maps/odde.png",
  13: "/maps/kokney.png",
  14: "/maps/scause.png",
  15: "/maps/georgie.png",
  16: "/maps/yorkshire.png"
  // додай інші за потреби
};

export const RegionImage = ({ activeRegionId, className }: Props) => {
  if (!activeRegionId) return null;

  const src = REGION_IMAGES[activeRegionId];
  if (!src) return null;

  return (
    <div className={`w-full flex justify-center ${className ?? ""}`}>
      {/* group — щоб керувати ховером і текстом одночасно */}
      <div className="group inline-flex flex-col items-center">
        {/* повідомлення над картинкою */}
        <div
          className="
            mb-2 px-3 py-1 rounded-full
            bg-black/70 text-[11px] text-white
            opacity-0 translate-y-1 pointer-events-none
            transition
            group-hover:opacity-100 group-hover:translate-y-0
          "
        >
          Ви зараз знаходитесь в цьому регіоні
        </div>

        {/* сама картинка з ефектом як у кнопки */}
        <div
          className="
            rounded-xl overflow-hidden
            transition-transform transition-shadow duration-200
            group-hover:scale-105 group-hover:shadow-lg
          "
        >
          <Image
            src={src}
            alt="Ілюстрація діалекту"
            width={320}
            height={320}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};


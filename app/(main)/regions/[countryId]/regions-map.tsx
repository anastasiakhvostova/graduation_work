"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { upsertUserProgressRegion } from "@/actions/user-progress";
import { DIALECT_MAPS } from "../map-config";
import { translations } from "@/components/translations";
import { useLanguage } from "@/components/languageContext";

type Props = {
  countryId: number;
  activeRegionId: number | null;
};

export const DialectMap = ({ countryId, activeRegionId }: Props) => {
  const config = DIALECT_MAPS[countryId];
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { lang } = useLanguage();
  

  if (!config) return null;

  const { viewBox, imageSrc, imageWidth, imageHeight } = config;

  const containerMaxWidth =
    countryId === 2
      ? "max-w-[600px]"
      : countryId === 3
      ? "max-w-[700px]" 
      : "max-w-[900px]"; 


  const hoverStrokeWidthClass =
    countryId === 2
      ? "hover:stroke-[2]" 
      : countryId === 3
      ? "hover:stroke-[2]" 
      : "hover:stroke-[30]"; 

  const handleClick = (id: number) => {
    if (pending) return;

    if (id === activeRegionId) {
      router.push("/learn");
      return;
    }

    startTransition(async () => {
      try {
        await upsertUserProgressRegion(id);
        router.push("/learn");
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <div className={`relative w-full ${containerMaxWidth}`}>
        <svg
          viewBox={viewBox}
          className="w-full h-auto rounded-xl"
          preserveAspectRatio="xMidYMid meet"
        >

          <image
            href={imageSrc}
            x="0"
            y="0"
            width={imageWidth ?? 9105}
            height={imageHeight ?? 5890}
            preserveAspectRatio="xMidYMid meet"
          />
          {config.regions.map((region) => (
            <path
              key={region.id}
              d={region.d}
              onClick={() => handleClick(region.id)}
              fill="transparent"
              stroke="transparent"
              className={`
                cursor-pointer
                transition
                hover:fill-black/10
                hover:stroke-white/70
                ${hoverStrokeWidthClass}
              `}
            >
              <title>{region.name}</title>
            </path>
          ))}
        </svg>

        {countryId === 1 && (
<div className="absolute left-6 bottom-6 rounded-2xl bg-white/95 backdrop-blur px-6 py-4 shadow-md border border-neutral-300 max-w-[600px]">
            <p className="text-xs font-semibold text-neutral-700 mb-2">
              {translations[lang].colorLegendTitle}
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span>{translations[lang].dialects.ua.red}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ffd75a]" />
                <span>{translations[lang].dialects.ua.yellow}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#7ab9ff]" />
                <span>{translations[lang].dialects.ua.blue}</span>
              </div>
            </div>
          </div>
        )}
       {countryId === 2 && (
  <div
    className="
  absolute
  left-0
  top-1/2
  -translate-x-[85%]
  -translate-y-1/2
  rounded-xl
  bg-white/95
  backdrop-blur
  px-6
  py-4
  shadow-md
  border
  border-neutral-200
  max-w-[320px]
  w-full
  z-20
"
  >
    <p className="text-sm font-semibold text-neutral-800 mb-3">
      {translations[lang].colorLegendTitle}
    </p>

    <div className="flex flex-col gap-3 text-sm text-neutral-700 leading-relaxed">
      <div className="flex items-center gap-3">
        <span className="inline-block h-4 w-4 rounded-full bg-[#7ab9ff]" />
        <span>{translations[lang].dialects.de.blue}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-block h-4 w-4 rounded-full bg-[#ffd75a]" />
        <span>{translations[lang].dialects.de.yellow}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-block h-4 w-4 rounded-full bg-[#ffa94d]" />
        <span>{translations[lang].dialects.de.orange}</span>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

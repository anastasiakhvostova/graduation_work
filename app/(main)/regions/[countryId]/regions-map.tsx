"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { upsertUserProgressRegion } from "@/actions/user-progress";
import { DIALECT_MAPS } from "../map-config";

type Props = {
  countryId: number;
  activeRegionId: number | null;
};

export const DialectMap = ({ countryId, activeRegionId }: Props) => {
  const config = DIALECT_MAPS[countryId];
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!config) return null;

  const { viewBox, imageSrc, imageWidth, imageHeight } = config;

  // ✅ різний розмір контейнера для країн
  const containerMaxWidth =
    countryId === 2
      ? "max-w-[600px]" // Німеччина
      : countryId === 3
      ? "max-w-[700px]" // Британія (підбери 650–750 як тобі подобається)
      : "max-w-[900px]"; // Україна

  // ✅ різна товщина обводки при hover
  const hoverStrokeWidthClass =
    countryId === 2
      ? "hover:stroke-[2]" // Німеччина
      : countryId === 3
      ? "hover:stroke-[2]" // Британія
      : "hover:stroke-[30]"; // Україна

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
          {/* фон-карта */}
          <image
            href={imageSrc}
            x="0"
            y="0"
            width={imageWidth ?? 9105}
            height={imageHeight ?? 5890}
            preserveAspectRatio="xMidYMid meet"
          />

          {/* клікабельні регіони */}
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

        {/* легенда для України */}
        {countryId === 1 && (
          <div className="absolute left-6 bottom-6 rounded-xl bg-white/90 backdrop-blur px-4 py-3 shadow-sm border border-neutral-200 max-w-[330px]">
            <p className="text-xs font-semibold text-neutral-700 mb-2">
              Пояснення кольорів:
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span>Червоний — південно-західне наріччя</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ffd75a]" />
                <span>Жовтий — південно-східне наріччя</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#7ab9ff]" />
                <span>Синій — північне наріччя</span>
              </div>
            </div>
          </div>
        )}

        {/* легенда для Німеччини */}
        {countryId === 2 && (
          <div className="absolute right-[119%] top-[22%] translate-x-[-20%] rounded-xl bg-white/90 backdrop-blur px-4 py-3 shadow-sm border border-neutral-200 max-w-[330px]">
            <p className="text-xs font-semibold text-neutral-700 mb-2">
              Пояснення кольорів:
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#7ab9ff]" />
                <span>Синій — Нижньонімецькі діалекти</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ffd75a]" />
                <span>Жовтий — Середньонімецькі діалекти</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ffa94d]" />
                <span>Помаранчевий — Верхньонімецькі діалекти</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Quests } from "@/components/quests";
import { RegionImage } from "@/components/current_region_image";
import { Feedback } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";

type Props = {
  userProgress: any;
  activeRegion: any;
  words: any[];
  videoSrc: string;
  fileSrc: string;
  fileSrcCountry: string;
};


const PracticeClient = ({
  userProgress,
  activeRegion,
  words,
  videoSrc,
  fileSrc,
  fileSrcCountry,
}: Props) => {
  // const { lang } = useLanguage();
  const lang = userProgress.lang as "ua" | "en" | "de";
  const regionTitle =
    userProgress.activeRegion.translations?.[lang] ??
    userProgress.activeRegion.title;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={activeRegion}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        <Quests points={userProgress.points} />
        <RegionImage activeRegionId={activeRegion.id} />
        <Feedback />
      </StickyWrapper>

      <FeedWrapper>
        <h1 className="text-3xl font-bold mb-6">
          {translations[lang].practice.title}: {regionTitle}
        </h1>

        <p className="text-lg font-semibold text-center">
          {translations[lang].practice.watchVideo}
        </p>

        <video controls className="w-full rounded-2xl shadow-lg border">
          <source src={videoSrc} type="video/mp4" />
          {translations[lang].practice.videoNotSupported}
        </video>

        <div className="flex justify-center mt-6 gap-4">
          <a href={fileSrc} download>
            <Button size="lg" variant="primary">
              {translations[lang].practice.downloadRegion}
            </Button>
          </a>

          <a href={fileSrcCountry} download>
            <Button size="lg" variant="secondaryOutline">
              {translations[lang].practice.downloadCountry}
            </Button>
          </a>
        </div>

        <h2 className="text-2xl font-bold text-center mt-10">
          {translations[lang].practice.dictionary}
        </h2>

        {/* Таблиця словника */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 rounded-xl">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-3 border text-lg">ID</th>
                <th className="p-3 border text-lg">{translations[lang].practice.table.audio}</th>
                <th className="p-3 border text-lg">{translations[lang].practice.table.dialect}</th>
                <th className="p-3 border text-lg">{translations[lang].practice.table.translation}</th>
              </tr>
            </thead>
            <tbody>
              {words.map((item: any) => (
                <tr key={item.id} className="text-center">
                  <td className="p-3 border text-lg font-medium">{item.id}</td>
                  <td className="p-3 border">
                    <audio controls className="mx-auto w-32 h-8">
                      <source src={item.audio} type="audio/mpeg" />
                    </audio>
                  </td>
                  <td className="p-3 border text-xl font-semibold">{item.word}</td>
                  <td className="p-3 border text-xl">
                    {item.translations?.[lang] ?? item.translation ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default PracticeClient;

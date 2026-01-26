import { redirect } from "next/navigation";

import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import {
  getUserProgress,
  getUnits,
  getLessonPercantage,
  getRegionProgress,
} from "@/db/queries";
import { Unit } from "./unit";
import { Quests } from "@/components/quests";
import { RegionImage } from "@/components/current_region_image";
import { Feedback } from "@/components/Feedback";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const unitsData = getUnits();
  const regionProgressData = getRegionProgress();
  const lessonPercentageData = getLessonPercantage();

  const [userProgress, units, regionProgress, lessonPercentage] =
    await Promise.all([
      userProgressData,
      unitsData,
      regionProgressData,
      lessonPercentageData,
    ]);

  // 🔐 захист
  if (!userProgress || !userProgress.activeRegion) {
    redirect("/countries");
  }

  if (!regionProgress) {
    redirect("/countries");
  }

  // 🌍 мова користувача
  const lang = userProgress.lang as "ua" | "en" | "de";

  // 🗺️ переклад назви регіону (ТОЛЬКИ тут)
  const regionTitle =
    userProgress.activeRegion.translations?.[lang] ??
    userProgress.activeRegion.title;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeRegion}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />

        <Quests points={userProgress.points} />
        <RegionImage activeRegionId={userProgress.activeRegion.id} />
        <Feedback />
      </StickyWrapper>

      <FeedWrapper>
        <Header title={regionTitle} />

        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              title={unit.title}
              description={unit.description}
              lessons={unit.lessons}
              activeLesson={regionProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;

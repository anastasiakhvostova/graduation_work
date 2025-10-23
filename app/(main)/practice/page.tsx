import { StickyWrapper } from "@/components/sticky-wrapper"; 
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Quests } from "@/components/quests";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const PracticePage = async () => {
  // отримуємо дані про користувача
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeRegion) {
    redirect("/countries");
  }

  const activeRegion = userProgress.activeRegion;

  // Формуємо шляхи до файлів
  const videoSrc = `/videos/${activeRegion.id}.mp4`;
  const fileSrc = `/materials/${activeRegion.id}.docx`;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* Права колонка */}
      <StickyWrapper>
        <UserProgress 
          activeCourse={activeRegion}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        <Quests points={userProgress.points} />
      </StickyWrapper>

      {/* Основна частина */}
      <FeedWrapper>
        <h1 className="text-3xl font-bold mb-6">
          Практика: {activeRegion.title}
        </h1>

        <div className="space-y-6">
          <p className="text-lg font-semibold text-center">
            Продивись навчальне відео з поясненням 👇
          </p>

          {/* Відео */}
          <video
            controls
            className="w-full rounded-2xl shadow-lg border"
          >
            <source src={videoSrc} type="video/mp4" />
            Ваш браузер не підтримує відео.
          </video>

          {/* Кнопка для завантаження */}
          <div className="flex justify-center mt-4">
            <a href={fileSrc} download>
              <Button size="lg" variant="primary">
                Завантажити матеріал
              </Button>
            </a>
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default PracticePage;


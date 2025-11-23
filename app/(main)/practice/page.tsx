import { StickyWrapper } from "@/components/sticky-wrapper"; 
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Quests } from "@/components/quests";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import fs from "fs";
import path from "path";

const PracticePage = async () => {
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeRegion) {
    redirect("/countries");
  }

  const activeRegion = userProgress.activeRegion;

  const countryId = activeRegion.countryId;

  const videoSrc = `/videos/${activeRegion.id}.mp4`;
  const fileSrc = `/materials/${activeRegion.id}.docx`;
  const fileSrcCountry = `/materials/countries/${countryId}.docx`;

  // ✅ Шлях до JSON з словами
  const filePath = path.join(
    process.cwd(),
    "public",
    "words",
    `${activeRegion.id}.json`
  );

  const raw = fs.readFileSync(filePath, "utf8");
  const words = JSON.parse(raw).map((item: any) => ({
    ...item,
    audio: item.audio.replace("REGION_ID", activeRegion.id.toString())
  }));

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress 
          activeCourse={activeRegion}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <h1 className="text-3xl font-bold mb-6">
          Навчальні матеріали: {activeRegion.title}
        </h1>

        <div className="space-y-6">
          <p className="text-lg font-semibold text-center">
            Продивись навчальне відео з поясненням 👇
          </p>

          <video
            controls
            className="w-full rounded-2xl shadow-lg border"
          >
            <source src={videoSrc} type="video/mp4" />
            Ваш браузер не підтримує відео.
          </video>

          <div className="flex justify-center mt-6 gap-4">
            <a href={fileSrc} download>
              <Button size="lg" variant="primary">
                Завантажити матеріали по регіону
              </Button>
            </a>

            <a href={fileSrcCountry} download>
              <Button size="lg" variant="secondaryOutline">
                Завантажити матеріали по країні
              </Button>
            </a>
          </div>
          <h2 className="text-2xl font-bold text-center mt-10">Словник</h2>

          <div className="overflow-x-auto mt-4">
  <table className="min-w-full border border-gray-300 rounded-xl">
    <thead className="bg-orange-100">
      <tr>
        <th className="p-3 border text-lg">ID</th>
        <th className="p-3 border text-lg">Аудіо</th>
        <th className="p-3 border text-lg">Слово в діалекті</th>
        <th className="p-3 border text-lg">Переклад на літературну мову</th>
      </tr>
    </thead>

    <tbody>
      {words.map((item: any) => (
        <tr key={item.id} className="text-center">
          <td className="p-3 border text-lg font-medium">{item.id}</td>

          {/* ✅ Аудіо збільшене трохи */}
          <td className="p-3 border">
            <audio
              controls
              className="mx-auto w-32 h-8"
            >
              <source src={item.audio} type="audio/mpeg" />
            </audio>
          </td>

          <td className="p-3 border text-xl font-semibold">{item.word}</td>
          <td className="p-3 border text-xl">{item.translation}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        </div>

      </FeedWrapper>
    </div>
  );
};

export default PracticePage;




import PracticeClient from "@/app/(main)/practice/PracticeClient";
import { getUserProgress } from "@/db/queries";
import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";

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
    <PracticeClient
      userProgress={userProgress}
      activeRegion={activeRegion}
      words={words}
      videoSrc={videoSrc}
      fileSrc={fileSrc}
      fileSrcCountry={fileSrcCountry}
    />
  );
};

export default PracticePage;




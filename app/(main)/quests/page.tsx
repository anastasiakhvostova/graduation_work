import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { QuestsList } from "@/app/(main)/quests/QuestsList";
import { Feedback } from "@/components/Feedback";

const QuestsPage = async () => {
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeRegion) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeRegion}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        <Feedback />
      </StickyWrapper>
      <FeedWrapper>
        <QuestsList points={userProgress.points} />
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;

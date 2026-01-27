import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import { Feedback } from "@/components/Feedback";
import { Quests } from "@/components/quests";
import { ShopList } from "./ShopList";

const ShopPage = async () => {
  const userProgress = await getUserProgress();

  const hasProgress = !!userProgress?.activeRegion;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        {userProgress && (
          <>
            <UserProgress
              activeCourse={userProgress.activeRegion}
              hearts={userProgress.hearts}
              points={userProgress.points}
            />
            <Quests points={userProgress.points} />
          </>
        )}
        <Feedback />
      </StickyWrapper>

      <FeedWrapper>
        <ShopList
          points={userProgress?.points ?? 0}
          hearts={userProgress?.hearts ?? 0}
          hasProgress={hasProgress}
        />
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;

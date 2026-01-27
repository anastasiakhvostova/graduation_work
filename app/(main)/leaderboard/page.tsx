import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress } from "@/db/queries";
import { Feedback } from "@/components/Feedback";
import { Quests } from "@/components/quests";
import { LeaderboardClient } from "./LeaderboardClient";

const LeaderboardPage = async () => {
  const [userProgress, leaderboard] = await Promise.all([
    getUserProgress(),
    getTopTenUsers(),
  ]);

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
        <LeaderboardClient
          leaderboard={leaderboard}
          hasProgress={hasProgress}
        />
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;

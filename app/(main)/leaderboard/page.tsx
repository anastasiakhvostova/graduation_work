import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Feedback } from "@/components/Feedback";
import { Quests } from "@/components/quests";
import { LeaderboardClient } from "@/app/(main)/leaderboard/LeaderboardClient";

const LeaderboardPage = async () => {
  const [userProgress, leaderboard] = await Promise.all([
    getUserProgress(),
    getTopTenUsers(),
  ]);

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

        <Quests points={userProgress.points} />
        <Feedback />
      </StickyWrapper>

      <FeedWrapper>
        <LeaderboardClient leaderboard={leaderboard} />
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;

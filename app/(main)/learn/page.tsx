import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "./header"
import {UserProgress} from "@/components/user-progress"
import {getUserProgress, getUnits, getLessonPercantage, getRegionProgress} from "@/db/queries"
import { redirect } from "next/navigation"
import { Unit } from "./unit"
import { lessons, units as unitsSchema} from "@/db/schema"
import { Quests } from "@/components/quests";
import { RegionImage } from "@/components/current_region_image";

const LearnPage = async () =>{

    const userProgressData = getUserProgress()
    const regionProgressData = getRegionProgress()
    const lessonPercentageData = getLessonPercantage()
    const unitsData = getUnits()
    const [userProgress, units, regionProgress, lessonPercentage] 
    = await Promise.all([
        userProgressData,
        unitsData,
        regionProgressData,
        lessonPercentageData,
    ])

    if(!userProgress || !userProgress.activeRegion){
        redirect("/countries")
    }

    if (!regionProgress) {
        redirect("")
    }

    return(
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress activeCourse={userProgress.activeRegion}
                hearts={userProgress.hearts}
                points={userProgress.points}
                />
                <Quests points={userProgress.points}/>
                <RegionImage activeRegionId={userProgress.activeRegion?.id ?? null} />
            </StickyWrapper>
            <FeedWrapper>
               <Header title={userProgress.activeRegion.title} />
               {units.map((unit) => (
                <div key={unit.id} className="mb-10">
                    <Unit 
                        id={unit.id}
                        order={unit.order}
                        description={unit.description}
                        title={unit.title}
                        lessons={unit.lessons}
                        activeLesson={regionProgress.activeLesson as typeof lessons.$inferSelect & {
                            unit: typeof unitsSchema.$inferSelect
                        } | undefined}

                        activeLessonPercentage={lessonPercentage}
                    />
                </div>
               ))}
            </FeedWrapper>
        </div>
    )
}
export default LearnPage;
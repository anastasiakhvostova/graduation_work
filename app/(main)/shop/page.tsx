import { FeedWrapper } from "@/components/feed-wrapper"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { UserProgress } from "@/components/user-progress"
import { getUserProgress} from "@/db/queries"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Items } from "./items"
// import { Promo } from "@/components/promo"
// import { Quests } from "@/components/quests"
const ShopPage = async () => {
    const userProgressData = getUserProgress()
    // const userSubscriptionData = getUserSubscription()
    const [
        userProgress,
    ] = await Promise.all([
        userProgressData
    ])

    if (!userProgress || !userProgress.activeRegion){
        redirect("/learn")
    }

    return( 
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse={userProgress.activeRegion}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    // hasActiveSubscription={isPro}
                />
                {/* {!isPro && (<Promo />)} */}
                {/* <Quests points={userProgress.points}/> */}
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex-col items-center">
                    <Image 
                    src="/shop.png"
                    alt="Shop"
                    width={90}
                    height={90}/>
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Магазин
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Витрачай свої бали на круті речі!
                    </p>
                    <Items 
                    hearts={userProgress.hearts}
                    points={userProgress.points}     
                    />
                </div>
            </FeedWrapper>
        </div>
    )
}
export default ShopPage
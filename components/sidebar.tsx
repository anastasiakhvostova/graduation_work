import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { SidebarItem } from "@/components/sidebat-items"
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react" 

type Props = {
    className?: string,
}

export const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn(
            "flex h-full lg:w-[256px] lg:fixed left-0 top-0 border-r-2 flex-col",
            className
        )}>
            
            {/* Верхній блок: картинка + назва */}
            <div className="flex items-center gap-x-2 px-4 py-4">
                <Image src="/mascot.png" height={32} width={32} alt="Mascot" />
                <h1 className="text-lg font-extrabold tracking-wide" style={{ color: "#C3A97F" }}>
                    Dialecto
                </h1>
            </div>

            {/* Основні пункти сайдбару */}
            <div className="flex flex-col gap-y-2 flex-1 px-4">
                <SidebarItem label="Домашня сторінка" iconSrc="/house.png" href="/learn"/>
                <SidebarItem label="Дошка лідерів" iconSrc="/Leardboard.png" href="/leaderboard"/>
                <SidebarItem label="Челенджі" iconSrc="/quests.png" href="/quests"/>
                <SidebarItem label="Магазин" iconSrc="/shop.png" href="/shop"/>
                <SidebarItem label="Навчальні матеріали
                " iconSrc="/practice.png" href="/practice"/>
                <SidebarItem label="Словник" iconSrc="/dictionary.png" href="/dictionary"/>
            </div>

            {/* Кнопка користувача */}
            <div className="px-4 py-4">
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton afterSignOutUrl="/"/>
                </ClerkLoaded>
            </div>
        </div>
    )
}

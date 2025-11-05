"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  iconSrc: string
  href: string
  iconSize?: number // ✅ додано новий проп
}

export const SidebarItem = ({
  label,
  iconSrc,
  href,
  iconSize = 34, // 🔹 розмір за замовчуванням
}: Props) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-x-4 p-3 rounded-xl transition-all duration-200",
          "hover:bg-amber-100 hover:scale-[1.03] cursor-pointer",
          isActive ? "bg-amber-200 font-semibold" : "text-gray-700"
        )}
      >
        <Image
          src={iconSrc}
          width={iconSize}
          height={iconSize}
          alt={label}
          className="object-contain"
        />
        <span className="text-lg">{label}</span>
      </div>
    </Link>
  )
}

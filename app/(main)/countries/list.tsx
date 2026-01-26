"use client"

import { countries, userProgress } from "@/db/schema"
import {Card} from "./card"
import { useRouter } from "next/navigation"
import { useTransition } from "react"


type Props = {
  countries: typeof countries.$inferSelect[]
  activeCountryId: typeof userProgress.$inferSelect.activeCountryId
  lang: string
}

export const List = ({ countries, activeCountryId, lang }: Props) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onClick = (id: number) => {
    if (pending) return
    router.push(`/regions/${id}`)
  }

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {countries.map((country) => {
        const title =
          country.translations?.[lang as keyof typeof country.translations] ??
          country.title

        return (
          <Card
            key={country.id}
            id={country.id}
            title={title}
            imageSrc={country.imageSrc}
            onClick={onClick}
            disabled={pending}
            active={country.id === activeCountryId}
          />
        )
      })}
    </div>
  )
}

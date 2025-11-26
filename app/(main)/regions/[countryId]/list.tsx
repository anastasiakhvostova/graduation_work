"use client";

import { regions } from "@/db/schema";
import { RegionCard } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { upsertUserProgressRegion } from "@/actions/user-progress";
import { toast } from "sonner";

type Props = {
  regions: typeof regions.$inferSelect[];
  activeRegionId: number | null;
};

export const RegionsList = ({ regions, activeRegionId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeRegionId) {
      router.push("/learn");
      return;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {regions.map(region => (
        <RegionCard
          key={region.id}
          id={region.id}
          title={region.title}
          onClick={onClick}
          disabled={pending}
          active={region.id === activeRegionId}
        />
      ))}
    </div>
  );
};
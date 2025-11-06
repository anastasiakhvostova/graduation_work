// File: app/(main)/regions/[countryId]/page.tsx
import { getRegionsByCountryId, getUserProgress } from "@/db/queries";
import { RegionsList } from "./list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface RegionsPageProps {
  params: { countryId: string };
}

const RegionsPage = async (props: RegionsPageProps) => {
  const { params } = await props; // <-- саме ця стрічка важлива
  const countryIdNum = Number(params.countryId);
  if (isNaN(countryIdNum)) {
    throw new Error("Invalid country ID");
  }

  const [regions, userProgress] = await Promise.all([
    getRegionsByCountryId(countryIdNum),
    getUserProgress(),
  ]);

  return (
   <div className="h-full max-w-[912px] px-3 mx-auto">
      <div className="mt-4 mb-6 flex items-center gap-3">
        <Link href="/countries">
          <Button variant="ghost" className="flex items-center gap-2 text-black p-0 h-auto">
            <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
          </Button>
        </Link>

        <h1 className="text-2xl font-bold text-neutral-700">
          Обери країну, діалекти якої хочеш вивчати
        </h1>
    </div>
      <RegionsList
        regions={regions}
        activeRegionId={userProgress?.activeRegionId ?? null}
      />
    </div>
  );
};

export default RegionsPage;
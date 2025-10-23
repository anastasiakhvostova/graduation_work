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
      <Link href="/countries" className="inline-flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm" className="p-1">
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
        <span className="text-neutral-600 hover:underline cursor-pointer">
          Повернутись до вибору країн
        </span>
      </Link>

      <h1 className="text-2xl font-bold text-neutral-700 mb-6">
        Обери регіон який хочеш вивчати
      </h1>
      <RegionsList
        regions={regions}
        activeRegionId={userProgress?.activeRegionId ?? null}
      />
    </div>
  );
};

export default RegionsPage;
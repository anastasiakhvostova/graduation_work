import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  countryId?: number; // ⬅️ тепер optional
};

export const Header = ({ title, countryId }: Props) => {
  return (
    <div className="sticky top-0 bg-orange-50 pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50 rounded-xl px-4">
      {countryId ? (
        <Link href={`/regions/${countryId}`}>
          <Button variant="ghost" title="Повернутись до вибору регіону">
            <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
          </Button>
        </Link>
      ) : (
        <div className="w-10" /> // ⬅️ щоб layout не скакав
      )}

      <h1 className="font-bold text-lg text-neutral-700">{title}</h1>
      <div />
    </div>
  );
};



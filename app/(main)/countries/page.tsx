import { getCountries, getUserProgress } from "@/db/queries";
import { List } from "./list";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CountriesPage = async () => {
  const countriesData = getCountries();
  const userProgressData = getUserProgress();

  const [countries, userProgress] = await Promise.all([
    countriesData,
    userProgressData,
  ]);

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      {/* Кнопка повернення на головну */}
      <div className="mt-4 mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 text-black">
            <ArrowLeft className="h-5 w-5" />
            Повернутись до входу
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-neutral-700">
        Обери країну, діалекти якої хочеш вивчати
      </h1>

      <List
        countries={countries}
        activeCountryId={userProgress?.activeCountryId ?? null}
      />
    </div>
  );
};

export default CountriesPage;

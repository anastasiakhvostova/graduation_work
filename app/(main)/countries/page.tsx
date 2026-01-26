import { getCountries, getUserProgress } from "@/db/queries";
import { List } from "./list";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountriesHeader from "./countries-header";

const CountriesPage = async () => {
  const countriesData = getCountries();
  const userProgressData = getUserProgress();

  const [countries, userProgress] = await Promise.all([
    countriesData,
    userProgressData,
  ]);

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <CountriesHeader />

      <List
        countries={countries}
        activeCountryId={userProgress?.activeCountryId ?? null}
        lang={userProgress?.lang ?? "ua"}
      />
    </div>
  );
};

export default CountriesPage;


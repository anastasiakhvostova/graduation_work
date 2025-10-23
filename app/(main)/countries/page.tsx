import { getCountries, getUserProgress } from "@/db/queries"
import { List } from "./list"

const CountriesPage = async () => {
  const countriesData = getCountries();
  const userProgressData = getUserProgress();

  const [
    countries,
    userProgress,
  ] = await Promise.all([
    countriesData,
    userProgressData
  ])

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">
        Обери країну, діалекти якої хочеш вивчати
      </h1>
      <List 
        countries={countries}
        activeCountryId={userProgress?.activeCountryId ?? null}
      />
    </div>
  )
}

export default CountriesPage;
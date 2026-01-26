"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";

const CountriesHeader = () => {
  const { lang } = useLanguage();

  return (
    <div className="mt-4 mb-6 flex items-center gap-3">
      <Link href="/">
        <Button
          variant="ghost"
          title="Повернутись на головний екран"
          className="flex items-center gap-2 text-black p-0 h-auto"
        >
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
      </Link>


      <h1 className="text-2xl font-bold text-neutral-700">
        {translations[lang].chooseCountry}
      </h1>
    </div>
  );
};

export default CountriesHeader;


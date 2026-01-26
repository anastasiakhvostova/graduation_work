"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotebookText } from "lucide-react";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";

type Props = {
  title: string;
  description: string;
};

const UnitBannerClient = ({ title, description }: Props) => {
  const { lang } = useLanguage();
  const t = translations[lang].unitBanner;

  return (
    <div className="w-full rounded-xl bg-orange-300 p-5 text-gray-800 flex items-center justify-between">
      <div className="space-y-2.5">
        <h3 className="text-2xl lg:text-3xl font-bold">
          {t.title}
        </h3>
        <p className="text-lg lg:text-xl">
          {t.description}
        </p>
      </div>

      <Link href="/practice">
        <Button
          size="lg"
          variant="secondary"
          className="hidden lg:flex border-2 border-b-4 active:border-b-2 text-xl font-semibold px-6 py-3"
        >
          <NotebookText className="mr-3 h-7 w-7" />
          {t.button}
        </Button>
      </Link>
    </div>
  );
};

export default UnitBannerClient;

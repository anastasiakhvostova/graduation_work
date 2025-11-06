import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotebookText } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export const UnitBanner = ({ title, description }: Props) => {
  return (
    <div className="w-full rounded-xl bg-orange-300 p-5 text-gray-800 flex items-center justify-between">
      <div className="space-y-2.5">
        <h3 className="text-2xl lg:text-3xl font-bold">{title}</h3>
        <p className="text-lg lg:text-xl">{description}</p>
      </div>

      <Link href="/practice">
        <Button
          size="lg"
          variant="secondary"
          className="hidden lg:flex border-2 border-b-4 active:border-b-2 text-xl font-semibold px-6 py-3"
        >
          <NotebookText className="mr-3 h-7 w-7" />
          Прочитати
        </Button>
      </Link>
    </div>
  );
};

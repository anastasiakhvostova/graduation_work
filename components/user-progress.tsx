import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { countries } from "@/db/schema";

type Props = {
  activeCourse: typeof countries.$inferSelect | null;
  hearts: number;
  points: number;
};

export const UserProgress = ({ activeCourse, points, hearts }: Props) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Link href="/countries">
        <Button>
          {activeCourse && (
            <Image
              src={activeCourse.imageSrc}
              alt={activeCourse.title}
              className="rounded-md border"
              width={32}
              height={32}
            />
          )}
        </Button>
      </Link>

      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image
            src="/points.png"
            height={28}
            width={28}
            alt="Бали"
            className="mr-2"
          />
          {points}
        </Button>
      </Link>

      <Link href="/shop">
        <Button variant="ghost" className="text-rose-500">
          <Image
            src="/heart.png"
            height={22}
            width={22}
            alt="Серця"
            className="mr-2"
          />
          {hearts}
        </Button>
      </Link>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block w-full border-t-2 border-slate-200 p-4">
      <div className="max-w-screen-lg mx-auto flex flex-col items-center justify-center gap-4">
        <p className="text-center text-black text-xl font-semibold">
          Оберіть мову
        </p>
        <div className="flex items-center justify-evenly w-full">
          <Button
            size="lg"
            variant="ghost"
            className="flex items-center w-auto text-black text-lg font-semibold hover:text-blue-600 transition-colors"
          >
            <Image
              src="/ukraine.png"
              alt="Ukrainian"
              height={32}
              width={40}
              className="mr-4 rounded-md"
            />
            Українська
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="flex items-center w-auto text-black text-lg font-semibold hover:text-blue-600 transition-colors"
          >
            <Image
              src="/germany.png"
              alt="German"
              height={32}
              width={40}
              className="mr-4 rounded-md"
            />
            Deutsch
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="flex items-center w-auto text-black text-lg font-semibold hover:text-blue-600 transition-colors"
          >
            <Image
              src="/britain.png"
              alt="English"
              height={32}
              width={40}
              className="mr-4 rounded-md"
            />
            English
          </Button>
        </div>
      </div>
    </footer>
  );
};


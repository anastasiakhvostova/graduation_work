"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";
import { translations } from "@/components/translations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ================= TYPES ================= */

type Flashcard = {
  id: number;
  word: string;
  translation_ua: string;
  translation_en: string;
  translation_de: string;
  audioSrc: string | null;
};

type Props = {
  flashcards: Flashcard[];
  hasProgress: boolean;
};

/* ================= COMPONENT ================= */

export const FlashcardsPracticeClient = ({
  flashcards,
  hasProgress,
}: Props) => {
  const { lang } = useLanguage();
  const t = translations[lang];

  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  /* show dialog if no progress */
  useEffect(() => {
    if (!hasProgress) {
      setOpen(true);
    }
  }, [hasProgress]);

  /* shuffle cards */
  useEffect(() => {
    setCards([...flashcards].sort(() => Math.random() - 0.5));
  }, [flashcards]);

  if (!cards.length) return null;

  const card = cards[currentIndex];

  const translation =
    lang === "ua"
      ? card.translation_ua
      : lang === "en"
      ? card.translation_en
      : card.translation_de;

  return (
    <>
      {/* ===== NO PROGRESS DIALOG ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t.leaderboardNoProgressTitle}
            </DialogTitle>

            <DialogDescription className="text-center mt-2">
              {t.leaderboardNoProgressText}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center">
            <Link
              href="/countries"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {t.goToCountries}
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== FLASHCARDS CONTENT ===== */}
      <div
        className={cn(
          "w-full max-w-3xl mx-auto text-center transition-all",
          !hasProgress && "grayscale opacity-50 pointer-events-none"
        )}
      >
        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-10">
          {t.flashcards}
        </h1>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-md px-10 py-12 mb-8">
          <div className="text-4xl font-bold mb-6">
            {card.word}
          </div>

          {showTranslation && (
            <div className="text-lg font-medium mb-6">
              {translation}
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button onClick={() => setShowTranslation(v => !v)}>
              {showTranslation
                ? t.hideTranslation
                : t.showTranslation}
            </Button>

            {card.audioSrc && (
              <Button
                variant="secondary"
                onClick={() => new Audio(card.audioSrc!).play()}
              >
                {t.playAudio}
              </Button>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-center gap-4 mb-2">
          <Button
            variant="primaryOutline"
            onClick={() =>
              setCurrentIndex(
                i => (i - 1 + cards.length) % cards.length
              )
            }
          >
            {t.prev}
          </Button>

          <Button
            onClick={() =>
              setCurrentIndex(
                i => (i + 1) % cards.length
              )
            }
          >
            {t.next}
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>
    </>
  );
};

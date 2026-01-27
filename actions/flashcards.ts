import db from "@/db/drizzle";
import { flashcards } from "@/db/schema";

export const getFlashcards = async () => {
  return db.query.flashcards.findMany({
    orderBy: (fc) => fc.order,
  });
};

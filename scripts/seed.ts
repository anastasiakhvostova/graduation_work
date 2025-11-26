import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  try {
    console.log("Seeding database...");

    await db.delete(schema.challengesProgress);
    await db.delete(schema.challengesOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.regions);
    await db.delete(schema.userProgress);
    await db.delete(schema.countries);

    // Країни
    await db.insert(schema.countries).values([
      { id: 1, title: "Україна", imageSrc: "/ukraine.png" },
      { id: 2, title: "Німеччина", imageSrc: "/germany.png" },
      { id: 3, title: "Велика Британія", imageSrc: "/britain.webp" },
    ]);

    // Регіони
    await db.insert(schema.regions).values([
      { id: 7, title: "ПІВНІЧНЕ НАРІЧЧЯ", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 8, title: "ПІВДЕННО-ЗАХІДНЕ НАРІЧЧЯ", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 9, title: "ПІВДЕННО-СХІДНЕ НАРІЧЧЯ", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 10, title: "Нижньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 11, title: "Середньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 12, title: "Верхньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 13, title: "Кокні", countryId: 3, imageSrc: "/britain.webp" },
      { id: 14, title: "Скауз", countryId: 3, imageSrc: "/britain.webp" },
      { id: 15, title: "Джорди", countryId: 3, imageSrc: "/britain.webp" },
      { id: 16, title: "Йоркшир", countryId: 3, imageSrc: "/britain.webp" },
    ]);

    // Юніти
    await db.insert(schema.units).values([
      {
        id: 1,
        regionId: 7,
        title: "Додаток",
        description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
        order: 1,
      },
    ]);

    // Уроки
    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, order: 1, title: "Слова про людей" },
      { id: 2, unitId: 1, order: 2, title: "Природа і село" },
      { id: 3, unitId: 1, order: 3, title: "Хата і побут" },
      { id: 4, unitId: 1, order: 4, title: "Їжа і напої" },
      { id: 5, unitId: 1, order: 5, title: "Дієслова та дії" },
    ]);

    // Завдання та опції
    const northChallenges: typeof schema.challenges.$inferInsert[] = [];
    const northOptions: typeof schema.challengesOptions.$inferInsert[] = [];
    let idCounter = 100;

    const addChallenge = (
      lessonId: number,
      type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
      question: string,
      answers: { text: string; correct: boolean; imageSrc?: string }[],
      audioSrc?: string // тільки для LISTEN
    ) => {
      const chId = idCounter++;
      northChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null });

      answers.forEach((ans) => {
        northOptions.push({
          id: idCounter++,
          challengeId: chId,
          text: ans.text,
          correct: ans.correct,
          imageSrc: ans.imageSrc || null,
        });
      });
    };

    // SELECT
    addChallenge(1, "SELECT", "Що з цього означає «картопля»?", [
      { text: "лєс", correct: false, imageSrc: "/les.png" },
      { text: "бульба", correct: true, imageSrc: "/bulba.png" },
      { text: "калач", correct: false, imageSrc: "/kalach.png" },
    ]);

    // ASSIST
    addChallenge(1, "ASSIST", "Що з цього означає «розмовляти»?", [
      { text: "гуторити", correct: true },
      { text: "клюмба", correct: false },
      { text: "дєдьо", correct: false },
    ]);
    addChallenge(1, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "яблуко", correct: false },
      { text: "картопля", correct: true },
      { text: "капуста", correct: false },
    ], "/audio/7/Бульба.mp3");

    addChallenge(1, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "ліс", correct: true },
      { text: "поле", correct: false },
      { text: "будинок", correct: false },
    ], "/audio/7/Лєс.mp3");
    // WRITE
    addChallenge(1, "WRITE", "Ми з дєдом довго … біля печі", [
      { text: "гуторили", correct: true },
    ]);

    addChallenge(2, "SELECT", "Що з цього означає «чемодан»?", [
      { text: "калачі", correct: false, imageSrc: "/kalachi.png" },
      { text: "клюмба", correct: false, imageSrc: "/klumba.png" },
      { text: "куфер", correct: true, imageSrc: "/kufer.png" },
    ]);

    addChallenge(2, "ASSIST", "Що з цього означає «квітник»?", [
      { text: "порєдок", correct: false},
      { text: "клюмба", correct: true},
      { text: "погрєб", correct: false},
    ]);
    addChallenge(2, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "ящик", correct: false },
      { text: "шафа", correct: false },
      { text: "чемодан", correct: true },
    ], "/audio/7/Куфер.mp3");

    addChallenge(2, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "квітник", correct: true },
      { text: "сарай", correct: false },
      { text: "хата", correct: false },
    ], "/audio/7/Клюмба.mp3");
    addChallenge(2, "WRITE", "Він поклав речі в ….", [
      { text: "куфер", correct: true },
    ]);

    addChallenge(3, "SELECT", "Що з цього означає «льох»?", [
      { text: "шопка", correct: false, imageSrc: "/shopka.png" },
      { text: "погрєб", correct: true, imageSrc: "/погрєб.png" },
      { text: "хвіртка", correct: false, imageSrc: "/hvirtka.png" },
    ]);

    addChallenge(3, "ASSIST", "Що з цього означає «дверна ручка»?", [
      { text: "клямка", correct: true},
      { text: "порєдок", correct: false},
      { text: "калачі", correct: false},
    ]);
     addChallenge(3, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "сходи", correct: false },
      { text: "дверна ручка", correct: true },
      { text: "лопата", correct: false },
    ], "/audio/7/Клямка.mp3");

    addChallenge(3, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "кухня", correct: false },
      { text: "сарай", correct: true },
      { text: "кімната", correct: false },
    ], "/audio/7/Шопка.mp3");

    addChallenge(3, "WRITE", "Мама поставила банки в ….", [
      { text: "погрєб", correct: true },
    ]);

    addChallenge(4, "SELECT", "Що з цього означає «ворота»?", [
      { text: "хвіртка", correct: true, imageSrc: "/hvirtka.png" },
      { text: "хата", correct: false, imageSrc: "/hata.png" },
      { text: "погрєб", correct: false, imageSrc: "/погрєб.png" },
    ]);

    addChallenge(4, "ASSIST", "Що з цього означає «селище»?", [
      { text: "посьолок", correct: true},
      { text: "поляна", correct: false},
      { text: "двір", correct: false},
    ]);

    addChallenge(4, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "район", correct: false },
      { text: "поле", correct: false },
      { text: "селище", correct: true },
    ], "/audio/7/Посьолок.mp3");

    addChallenge(4, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "син", correct: false },
      { text: "хлопець", correct: false },
      { text: "дядько", correct: true },
    ], "/audio/7/Дєдьо.mp3");

    addChallenge(4, "WRITE", "Зайди через ….", [
      { text: "хвіртку", correct: true },
    ]);


    addChallenge(5, "SELECT", "Що з цього означає «місце біля печі»?", [
      { text: "припічок", correct: true, imageSrc: "/kamin.png" },
      { text: "куфер", correct: true, imageSrc: "/kufer.png" },
      { text: "хата", correct: false, imageSrc: "/hata.png" },
    ]);

    addChallenge(5, "ASSIST", "Що з цього означає «пам’ятник»?", [
      { text: "припічок", correct: false},
      { text: "порєдок", correct: false},
      { text: "прип’ятник", correct: true},
    ]);
    addChallenge(5, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "камінь-пам’ятник", correct: true },
      { text: "глечик", correct: false },
      { text: "дерево", correct: false },
    ], "/audio/7/Припятник.mp3")
    addChallenge(5, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "шум", correct: false },
      { text: "порядок", correct: true },
      { text: "безлад", correct: false },
    ], "/audio/7/Порєдок.mp3")
    addChallenge(5, "WRITE", "Діти сиділи на теплому ….", [
      { text: "припічку", correct: true },
    ]);
      await db.insert(schema.units).values([
    {
      id: 2,
      regionId: 8,
      title: "Додаток",
      description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
      order: 1,
      
    },
  ]);

await db.insert(schema.lessons).values([
  { id: 6, unitId: 2, order: 1, title: "Слова про людей" },
  { id: 7, unitId: 2, order: 2, title: "Природа і село" },
  { id: 8, unitId: 2, order: 3, title: "Хата і побут" },
  { id: 9, unitId: 2, order: 4, title: "Їжа і напої" },
  { id: 10, unitId: 2, order: 5, title: "Дії" },
]);
    const swChallenges: typeof schema.challenges.$inferInsert[] = [];
    const swOptions: typeof schema.challengesOptions.$inferInsert[] = [];
    let swIdCounter = 200;

    const addSWChallenge = (
      lessonId: number,
      type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
      question: string,
      answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
      audioSrc?: string // тільки для LISTEN
    ) => {
      const chId = swIdCounter++;
      swChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null });

      answers.forEach((ans) => {
        swOptions.push({
          id: swIdCounter++,
          challengeId: chId,
          text: ans.text,
          correct: ans.correct,
          audioSrc: ans.audioSrc || null,
          imageSrc: ans.imageSrc || null,
        });
      });
    };
    addSWChallenge(6, "SELECT", "Що з цього означає «хазяїн»?", [
      { text: "ґазда", correct: true, imageSrc: "/gazda.png" },
      { text: "леґінь", correct: false, imageSrc: "/legin.png" },
      { text: "пляц", correct: false, imageSrc: "/plats.png" },
    ]);
     addSWChallenge(6, "ASSIST", "Що з цього означає «гарний»?", [
      { text: "файний", correct: true },
      { text: "бляшняр", correct: false},
      { text: "кептар", correct: false},
    ]);
    addSWChallenge(6, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "господар", correct: true },
      { text: "робітник", correct: false },
      { text: "сусід", correct: false },
    ], "/audio/8/газда.mp3")
    addSWChallenge(6, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "старий", correct: false },
      { text: "гарний", correct: true },
      { text: "веселий", correct: false },
    ], "/audio/8/файний.mp3")

    addSWChallenge(6, "WRITE", "Той … має велику хату.", [{ text: "ґазда", correct: true }]);

addSWChallenge(7, "SELECT", "Що з цього означає «підлога»?", [
  { text: "плєцак", correct: false, imageSrc: "/pletsek.png" },
  { text: "леванда", correct: true, imageSrc: "/levanda.png" },
  { text: "пляц", correct: false, imageSrc: "/plats.png" },
]);
addSWChallenge(7, "ASSIST", "Що з цього означає «рюкзак»?", [
  { text: "ліжник", correct: false},
  { text: "кептар", correct: false},
  { text: "плєцак", correct: true},
]);
    addSWChallenge(7, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "шапка", correct: false },
      { text: "светр", correct: false },
      { text: "короткий кожух", correct: true },
    ], "/audio/8/Кужіль.mp3")
    addSWChallenge(7, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "шум", correct: false },
      { text: "порядок", correct: true },
      { text: "безлад", correct: false },
    ], "/audio/8/Порєдок.mp3")

  addSWChallenge(7, "WRITE", "Постав відро на ….", [{ text: "леванду", correct: true }]);

addSWChallenge(8, "SELECT", "Що з цього означає «рушниця»?", [
  { text: "гвер", correct: true, imageSrc: "/rushnyca.png" },
  { text: "пляц", correct: false, imageSrc: "/plats.png" },
  { text: "кептар", correct: false, imageSrc: "/keptar.png" },
]);
addSWChallenge(8, "ASSIST", "Що з цього означає «ділянка землі»?", [
  { text: "файний", correct: false},
  { text: "пляц", correct: true},
  { text: "бляшняр", correct: false},
]);
   addSWChallenge(8, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "меч", correct: false },
      { text: "коса", correct: false },
      { text: "рушниця", correct: true },
    ], "/audio/8/Гвер.mp3")
    addSWChallenge(8, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "майстер, що працює з бляхою", correct: true },
      { text: "кухар", correct: false },
      { text: "тесля", correct: false },
    ], "/audio/8/Бляшнар.mp3")


addSWChallenge(8, "WRITE", "На … ростуть яблуні.", [{ text: "пляці", correct: true }]);

addSWChallenge(9, "SELECT", "Що з цього означає «солодка страва»?", [
  { text: "ліжник", correct: false, imageSrc: "/lizhnyk.png" },
  { text: "ґринджоли", correct: false, imageSrc: "/images/borshch.png" },
  { text: "ліґуміна", correct: true, imageSrc: "/images/syr.png" },
]);
addSWChallenge(9, "ASSIST", "Що з цього означає «санчата»?", [
  { text: "ґринджоли", correct: true},
  { text: "кептар", correct: false},
  { text: "ґазда", correct: false},
]);
 addSWChallenge(9, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "Cтрава з м’яса", correct: false },
      { text: "десерт", correct: true },
      { text: "суп", correct: false },
    ], "/audio/8/ліґуміна.mp3")
    addSWChallenge(9, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "майстер, що працює з бляхою", correct: false },
      { text: "увага", correct: true },
      { text: "тесля", correct: false },
    ], "/audio/8/Позір.mp3")

addSWChallenge(9, "WRITE", "Діти каталися на ….", [{ text: "ґринджолах", correct: true }]);

addSWChallenge(10, "SELECT", "Що з цього означає «прядиво, волокно»?", [
  { text: "гвер", correct: false, imageSrc: "/ryshnyca.png" },
  { text: "кептар", correct: false, imageSrc: "/keptar.png" },
  { text: "кужіль", correct: true, imageSrc: "/kuzhil.png" },
]);

addSWChallenge(10, "SELECT", "Що з цього означає «увага»?", [
  { text: "файний", correct: false},
  { text: "позір", correct: true},
  { text: "пляц", correct: false},
]);
 addSWChallenge(10, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "стежка", correct: false },
      { text: "покривало", correct: false },
      { text: "прядиво", correct: true },
    ], "/audio/8/Кужіль.mp3")
    addSWChallenge(10, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "ворота", correct: false },
      { text: "хвіртка", correct: true },
      { text: "двері", correct: false },
    ], "/audio/8/фіртка.mp3")


addSWChallenge(10, "WRITE", "Зверни …. під час розмови!", [{ text: "позір", correct: true }]);

await db.insert(schema.units).values([
  {
    id: 3,
    regionId: 9,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 11, unitId: 3, order: 1, title: "Основні речення (частина 1)" },
  { id: 12, unitId: 3, order: 2, title: "Основні речення (частина 2)" },
   { id: 13, unitId: 3, order: 3, title: "Сімʼя та дім" },
  { id: 14, unitId: 3, order: 4, title: "Їжа та речі" },
  { id: 15, unitId: 3, order: 5, title: "Дії та рух" },
]);

const easternChallenges: typeof schema.challenges.$inferInsert[] = [];
const easternOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let easternId = 300;

const addEastern = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
   audioSrc?: string // тільки для LISTEN
) => {
  const chId = easternId++;
  easternChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null  });

  answers.forEach((a) => {
    easternOptions.push({
      id: easternId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};

addEastern(11, "SELECT", "Що з цього означає «кукурудза»?", [
  { text: "толока", correct: false, imageSrc: "/toloka.png" },
  { text: "поребрик", correct: false, imageSrc: "/perebryk.png" },
  { text: "пшонка", correct: true, imageSrc: "/pshonka.png"},
]);
addEastern(11, "ASSIST", "Що з цього означає «віз для сіна»?", [
  { text: "поребрик", correct: false },
  { text: "мажара", correct: true},
  { text: "кібитка", correct: false },
]);
 addEastern(11, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "овес", correct: false },
      { text: "пшениця", correct: false },
      { text: "кукурудза", correct: true },
    ], "/audio/9/Пшонка.mp3")
    addEastern(11, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "колиска", correct: false },
      { text: "райдуга", correct: false },
      { text: "двері", correct: true },
    ], "/audio/9/Билиця.mp3")


addEastern(11, "WRITE", "Селяни везли сіно на ….", [
  { text: "мажарі", correct: true },
]);

addEastern(12, "SELECT", "Що з цього означає «бордюр»?", [
  { text: "поребрик", correct: true, imageSrc: "/perebryk.png" },
  { text: "кібитка", correct: false, imageSrc: "/кібитка.png" },
  { text: "ненька", correct: false, imageSrc: "/nenika.png" },
]);
addEastern(12, "ASSIST", "Що з цього означає «колиска»?", [
  { text: "шаньга", correct: false },
  { text: "ненька", correct: true },
  { text: "билиця", correct: false },
]);
 addEastern(12, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "міст", correct: false },
      { text: "бордюр", correct: true },
      { text: "тин", correct: false },
    ], "/audio/9/Поребрик.mp3")
    addEastern(12, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "подушка", correct: false },
      { text: "пелюшка", correct: false },
      { text: "колиска", correct: true },
    ], "/audio/9/Ненька.mp3")

addEastern(12, "WRITE", "Мама поклала дитину в ….", [
  { text: "неньку", correct: true },
]);

addEastern(13, "SELECT", "Що з цього означає «блискавка»?", [
  { text: "змійка", correct: true,  imageSrc: "/zmiyka.png"},
  { text: "веселуха", correct: false, imageSrc: "/veseluha.png" },
  { text: "билиця", correct: false, imageSrc: "/bilka.png" },
]);
addEastern(13, "ASSIST", "Що з цього означає «райдуга»?", [
  { text: "поребрик", correct: false },
  { text: "ненька", correct: false},
  { text: "веселуха", correct: true},
]);
 addEastern(13, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "блискавка", correct: true },
      { text: "змія", correct: false },
      { text: "хвиля", correct: false },
    ], "/audio/9/Змійка.mp3")
    addEastern(13, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "казка", correct: false },
      { text: "білка", correct: true },
      { text: "пташка", correct: false },
    ], "/audio/9/Билиця.mp3")


addEastern(13, "WRITE", "Після дощу з’явилася ….", [
  { text: "веселуха", correct: true },
]);

addEastern(14, "SELECT", "Що з цього означає «будь-яке збіжжя»?", [
  { text: "пшінка", correct: false, imageSrc: "/pshonka.png" },
  { text: "жито", correct: true },
  { text: "байрак", correct: false },
]);
addEastern(14, "ASSIST", "Що з цього означає «яр, балка»?", [
  { text: "байрак", correct: true },
  { text: "кібитка", correct: false},
  { text: "поребрик", correct: false },
]);
 addEastern(14, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "блискавка", correct: true },
      { text: "змія", correct: false },
      { text: "хвиля", correct: false },
    ], "/audio/9/Змійка.mp3")
    addEastern(14, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "казка", correct: false },
      { text: "білка", correct: true },
      { text: "пташка", correct: false },
    ], "/audio/9/Билиця.mp3")

addEastern(14, "WRITE", "Внизу під селом був глибокий ….", [
  { text: "байрак", correct: true },
]);

addEastern(15, "SELECT", "Що з цього означає «світло, райдуга»?", [
  { text: "билиця", correct: false, imageSrc: "/bilka.png" },
  { text: "веселуха", correct: true, imageSrc: "/veseluha.png"},
  { text: "поребрик", correct: false, imageSrc: "/perebryk.png"},
]);
addEastern(15, "ASSIST", "Що з цього означає «баклажани»?", [
  { text: "пшонка", correct: false },
  { text: "синеньки", correct: true},
  { text: "шаньга", correct: false },
]);
 addEastern(15, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "житловий будинок", correct: true },
      { text: "круглий пиріг", correct: false },
      { text: "баклажани", correct: false },
    ], "/audio/9/Хата.mp3")
    addEastern(15, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "казка", correct: false },
      { text: "білка", correct: false },
      { text: "баклажани", correct: true },
    ], "/audio/9/Синеньки.mp3")
addEastern(15, "WRITE", "На городі дозріли ….", [
  { text: "синеньки", correct: true },
]);

await db.insert(schema.units).values([
  {
    id: 4,
    regionId: 10,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 16, unitId: 4, order: 1, title: "Основні речення (частина 1)" },
  { id: 17, unitId: 4, order: 2, title: "Основні речення (частина 2)" },
   { id: 18, unitId: 4, order: 3, title: "Сімʼя та дім" },
  { id: 19, unitId: 4, order: 4, title: "Їжа та речі" },
  { id: 20, unitId: 4, order: 5, title: "Дії та рух" },
]);

const plattChallenges: typeof schema.challenges.$inferInsert[] = [];
const plattOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let plattId = 400;

const addPlatt = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
   audioSrc?: string // тільки для LISTEN
) => {
  const chId = plattId++;
  plattChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null  });

  answers.forEach((a) => {
    plattOptions.push({
      id: plattId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};
addPlatt(16, "SELECT", "Що означає слово 'ik'?", [
  { text: "ти", correct: false, imageSrc: "/ти.png" },
  { text: "я", correct: true, imageSrc: "/я_дівчина.png"},
  { text: "він", correct: false, imageSrc: "/він_хлопець.png"},
]);

addPlatt(16, "ASSIST", "Як перекладається 'maken' стандартною німецькою?", [
  { text: "singen", correct: false },
  { text: "tun", correct: false},
   { text: "machen", correct: true},
]);

 addPlatt(16, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "він", correct: false },
      { text: "ти", correct: false },
      { text: "я", correct: true },
    ], "/audio/10/ik.mp3")
addPlatt(16, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "йти", correct: false },
      { text: "робити", correct: true },
      { text: "співати", correct: false },
    ], "/audio/10/maken.mp3")
addPlatt(16, "WRITE", "Ik heww dat nich …", [
  { text: "verstahn", correct: true },
]);

addPlatt(17, "SELECT", "Що означає слово 'Bröödt'?", [
  { text: "хліб", correct: true, imageSrc: "/хліб.png" },
  { text: "вода", correct: false, imageSrc: "/вода.png"},
  { text: "дім", correct: false, imageSrc: "/дім_Це мій дім_Я вдома.png" },
]);
addPlatt(17, "ASSIST", "Що означає привітання 'Moin!'?", [
  { text: "Прощавай", correct: false },
  { text: "Доброго ранку", correct: true},
  { text: "Як справи", correct: false },
]);
addPlatt(17, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "батько", correct: true },
      { text: "друг", correct: false },
      { text: "учитель", correct: false },
    ], "/audio/10/Vadder.mp3")
addPlatt(17, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "батьки", correct: false },
      { text: "діти", correct: true },
      { text: "друзі", correct: false },
    ], "/audio/10/Kinner.mp3")

addPlatt(17, "WRITE", "Dat is een … ", [
  { text: "bröödt", correct: true },
]);
addPlatt(18, "SELECT", "Що означає 'Vadder' у Plattdeutsch?", [
  { text: "Дідусь", correct: false, imageSrc: "/дідусь.png"},
  { text: "Батько", correct: true, imageSrc: "/батько.png" },
  { text: "Друг", correct: false, imageSrc: "/діти_друг.png" },
]);

addPlatt(18, "ASSIST", "У якому варіанті слово відповідає стандартному 'Kind'?", [
  { text: "Keind", correct: false},
  { text: "Kinner", correct: true},
  { text: "Ken", correct: false},
]);
addPlatt(18, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "робота", correct: false },
      { text: "дім", correct: true },
      { text: "друг", correct: false },
    ], "/audio/10/Huus.mp3")
addPlatt(18, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "час", correct: true },
      { text: "діти", correct: false },
      { text: "друзі", correct: false },
    ], "/audio/10/Tied.mp3")
addPlatt(18, "WRITE", "Wo is dien …?", [
  { text: "vadder", correct: true },
]);

addPlatt(19, "SELECT", "Що означає фраза 'Dat is mien Huus'?", [
      { text: "Це мій дім", correct: true, imageSrc: "/дім_Це мій дім_Я вдома.png" },
      { text: "Там моя школа", correct: false, imageSrc: "/Там моя школа_школа.png" },
      { text: "Де твій дім?", correct: false, imageSrc: "/діти_друг.png" },
    ]);
addPlatt(19, "ASSIST", "Що означає фраза 'Ik heww keen Tied'?", [
      { text: "У мене є час", correct: false },
      { text: "У мене немає часу", correct: true},
      { text: "Ти маєш час", correct: false },
    ]);
addPlatt(19, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "магазин", correct: false },
      { text: "церква", correct: false },
      { text: "школа", correct: true },
    ], "/audio/10/Schoul.mp3")
addPlatt(19, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "розуміти", correct: true },
      { text: "говорити", correct: false },
      { text: "йти", correct: false },
    ], "/audio/10/verstahn.mp3")
addPlatt(19, "WRITE", " Ik heww keen …", [{ text: "tied", correct: true }]);


addPlatt(20, "SELECT", "Що означає речення 'Ik heww dat nich verstahn'?", [
      { text: "Я не зрозумів це", correct: true},
      { text: "Я маю час", correct: false},
      { text: "Це мій дім", correct: false},
    ]);
addPlatt(20, "ASSIST", "Як Plattdeutsch вплинув на стандартну німецьку мову?", [
      { text: "Він є її основою", correct: false },
      { text: "Його фонетика збереглася у північних регіонах", correct: true},
      { text: "Він виник у Швейцарії", correct: false},
    ]);
    addPlatt(20, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "вино", correct: false },
      { text: "молоко", correct: false },
      { text: "хліб", correct: true },
    ], "/audio/10/Broodt  Brood.mp3")
addPlatt(20, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "доброго ранку", correct: true },
      { text: "спокійної ночі", correct: false },
      { text: "прощавай", correct: false },
    ], "/audio/10/moin!.mp3")
addPlatt(20, "WRITE", "Se sünd to de … ", [{ text: "schoul", correct: true }]);


await db.insert(schema.units).values([
  {
    id: 5,
    regionId: 11,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 21, unitId: 5, order: 1, title: "Основні речення (частина 1)" },
  { id: 22, unitId: 5, order: 2, title: "Основні речення (частина 2)" },
   { id: 23, unitId: 5, order: 3, title: "Сімʼя та дім" },
  { id: 24, unitId: 5, order: 4, title: "Їжа та речі" },
  { id: 25, unitId: 5, order: 5, title: "Дії та рух" }
]);

const middleChallenges: typeof schema.challenges.$inferInsert[] = [];
const middleOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let middleId = 500;

const addMiddlet = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
  audioSrc?: string // тільки для LISTEN
) => {
  const chId = middleId++;
  middleChallenges.push({ id: chId, lessonId, type, order: chId, question,audioSrc: audioSrc || null  });

  answers.forEach((a) => {
    middleOptions.push({
      id: middleId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};
addMiddlet(21, "SELECT", "Який з наведених діалектів належить до Mitteldeutsch?", [
  { text: "Швабський", correct: false },
  { text: "Баварський", correct: false },
  { text: "Гессенський", correct: true },
]);

addMiddlet(21, "ASSIST", "Що типово для Mitteldeutsch на фонетичному рівні?", [
  { text: "Вимова з “pf”", correct: false },
  { text: "Збалансована, проміжна фонетика", correct: true },
  { text: "Чергування t → z", correct: false },
]);
addMiddlet(21, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "я", correct: false },
      { text: "ти", correct: true },
      { text: "він", correct: false },
    ], "/audio/11/isch.mp3")
addMiddlet(21, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "час", correct: true },
      { text: "школа", correct: false },
      { text: "друг", correct: false },
    ], "/audio/11/zeit.mp3")

addMiddlet(21, "WRITE", "Isch hab ken … ", [
  { text: "zeit", correct: true },
]);

addMiddlet(22, "SELECT", "Що означає 'Mädsche' у гессенському варіанті?", [
  { text: "Хлопець", correct: false, imageSrc: "/він_хлопець.png" },
  { text: "Дівчина", correct: true, imageSrc: "/я_дівчина.png" },
  { text: "Мама", correct: false, imageSrc: "/мати.png" },
]);

addMiddlet(22, "ASSIST", "Який з цих діалектів може вживати 'wie' замість 'als'?", [
  { text: "Гессенський", correct: true },
  { text: "Швабський", correct: false },
  { text: "Баварський", correct: false },
]);
addMiddlet(22, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "дівчина", correct: true },
      { text: "мати", correct: false },
      { text: "вчителька", correct: false },
    ], "/audio/11/madsche.mp3")
addMiddlet(22, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "як", correct: true },
      { text: "коли", correct: false },
      { text: "бо", correct: false },
    ], "/audio/11/Wie gehts.mp3")

addMiddlet(22, "WRITE", "Des is mei …", [
  { text: "mädsche", correct: true },
]);

addMiddlet(23, "SELECT", "Що означає фраза 'Isch hab ken Zeit'?", [
  { text: "У мене є час", correct: false, imageSrc: "/У мене є час_час_швидко.png" },
  { text: "У мене немає часу", correct: true, imageSrc: "/У мене немає часу.png" },
  { text: "Ти маєш час?", correct: false, imageSrc: "/Ти маєш час (1).png" },
]);

addMiddlet(23, "ASSIST", "Яка особливість у слові 'isch' (замість ich)?", [
  { text: "Південний варіант", correct: false },
  { text: "Типова заміна 'ch' на 'sch'", correct: true },
  { text: "Архаїзм", correct: false },
]);
addMiddlet(23, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "я", correct: true },
      { text: "він", correct: false },
      { text: "ти", correct: false },
    ], "/audio/11/Isch.mp3")
addMiddlet(23, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "великий", correct: false },
      { text: "жоден / ніякий", correct: true },
      { text: "малий", correct: false },
    ], "/audio/11/ken.mp3")

addMiddlet(23, "WRITE", "Isch hab ken … ", [
  { text: "zeit", correct: true },
]);

addMiddlet(24, "SELECT", "Що означає “Schaffe” у контексті «beim Daimler schaffe»?", [
  { text: "Їсти", correct: false, imageSrc: "/їсти.png" },
  { text: "Працювати", correct: true, imageSrc: "/працювати_бути_sein.png" },
  { text: "Співати", correct: false, imageSrc: "/singen_співати.png" },
]);

addMiddlet(24, "ASSIST", "Яке слово у Mitteldeutsch є заміною до 'ein bisschen'?", [
  { text: "a bissle", correct: false },
  { text: "a weng", correct: false },
  { text: "e wänschje", correct: true },
]);
addMiddlet(24, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "їсти", correct: false },
      { text: "працювати", correct: true },
      { text: "спати", correct: false },
    ], "/audio/11/schaffe.mp3")
addMiddlet(24, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "багато", correct: false },
      { text: "трохи", correct: true },
      { text: "швидко", correct: false },
    ], "/audio/11/wenisch.mp3")
addMiddlet(24, "WRITE", "Ich muss viel …", [
  { text: "schaffe", correct: true },
]);


addMiddlet(25, "SELECT", "Що означає “Gude!”?", [
  { text: "Прощання", correct: false, imageSrc: "/Прощавай-побачимось.png" },
  { text: "Дякую", correct: false, imageSrc: "/дякую.png" },
  { text: "Привітання", correct: true, imageSrc: "/Привітання_мати_haben.png" },
]);

addMiddlet(25, "ASSIST", "Яке з цих тверджень вірне щодо Mitteldeutsch?", [
  { text: "Має найменше діалектів", correct: false },
  { text: "Лежить між північчю і півднем", correct: true },
  { text: "Використовується лише в Австрії", correct: false },
]);
addMiddlet(25, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "повільно", correct: false },
      { text: "виглядати", correct: true },
      { text: "втомлений", correct: false },
    ], "/audio/11/aussehn.mp3")
addMiddlet(25, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "втомлений", correct: false },
      { text: "спраглий", correct: false },
      { text: "голодний", correct: true },
    ], "/audio/11/hungrisch.mp3")
addMiddlet(25, "WRITE", "…! Wie geht’s?", [
  { text: "Gude", correct: true },
]);

await db.insert(schema.units).values([
  {
    id: 6,
    regionId: 12,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 26, unitId: 6, order: 1, title: "Основні речення (частина 1)" },
  { id: 27, unitId: 6, order: 2, title: "Основні речення (частина 2)" },
   { id: 28, unitId: 6, order: 3, title: "Сімʼя та дім" },
  { id: 29, unitId: 6, order: 4, title: "Їжа та речі" },
  { id: 30, unitId: 6, order: 5, title: "Дії та рух" }
]);

const oberChallenges: typeof schema.challenges.$inferInsert[] = [];
const oberOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let oberId = 600;

const addOber = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
  audioSrc?: string // тільки для LISTEN
) => {
  const chId = oberId++;
  oberChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null  });

  answers.forEach((a) => {
    oberOptions.push({
      id: oberId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};
addOber(26, "SELECT", "Що означає “Griaß di!” у баварському діалекті?", [
  { text: "Дякую", correct: false, imageSrc: "/дякую.png"},
  { text: "Любов", correct: false, imageSrc: "/любов.png" },
  { text: "привіт", correct: true, imageSrc: "/Як справи_привіт.png" },
]);
addOber(26, "ASSIST", "Як буде 'картопля' у баварському варіанті?", [
  { text: "Kartoffel", correct: false },
  { text: "Erdbirn", correct: false },
  { text: "Erdäpfel", correct: true },
]);
addOber(26, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "до побачення", correct: false },
      { text: "привіт", correct: true },
      { text: "дякую", correct: false },
    ], "/audio/12/Griab di.mp3")
addOber(26, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "огірок", correct: false },
      { text: "яблуко", correct: false },
      { text: "картопля", correct: true },
    ], "/audio/12/Erdapfel.mp3")
addMiddlet(26, "WRITE", "… di! Wie geht’s?", [
  { text: "Griaß", correct: true },
]);

addOber(27, "SELECT", "Що означає 'Gwand' у баварському діалекті?", [
  { text: "Їжа", correct: false, imageSrc: "/їжа.png" },
  { text: "Одяг", correct: true, imageSrc: "/одяг.png" },
  { text: "Гроші", correct: false, imageSrc: "/гроші.png" },
]);
addOber(27, "ASSIST", "Яке з цих дієслів частіше вживається в Perfekt, а не в Präteritum у південних діалектах?", [
  { text: "haben", correct: false },
  { text: "sagen", correct: true },
  { text: "sein", correct: false },
]);
addOber(27, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "Їжа", correct: false },
      { text: "Гроші", correct: false },
      { text: "Одяг ", correct: true },
    ], "/audio/12/Gwand.mp3")
addOber(27, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "школа", correct: true },
      { text: "церква", correct: false },
      { text: "дім / будиночок", correct: false },
    ], "/audio/12/Schui.mp3")
addMiddlet(27, "WRITE", "Des is mei …", [
  { text: "Gwand", correct: true },
]);

addOber(28, "SELECT", "Фраза “i hob koa Zeit” перекладається як", [
  { text: "У тебе є час", correct: false },
  { text: "Я не маю часу", correct: true },
  { text: "Я хочу час", correct: false },
]);
addOber(28, "ASSIST", "Яке з цих слів є швабським варіантом “дівчина”?", [
  { text: "Mädel", correct: false },
  { text: "Mädele", correct: true },
  { text: "Möd", correct: false },
]);
addOber(28, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "допомагати", correct: false },
      { text: "надворі", correct: false },
      { text: "немає", correct: true },
    ], "/audio/12/koa.mp3")
addOber(28, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "дівчина", correct: true },
      { text: "мати", correct: false },
      { text: "хлопець", correct: false },
    ], "/audio/12/Madel  Madele.mp3")
addMiddlet(28, "WRITE", "I hob koa …", [
  { text: "zeit", correct: true },
]);

addOber(29, "SELECT", "Що означає “Bua” в баварському діалекті?", [
  { text: "Пес", correct: false, imageSrc: "/собака.png" },
  { text: "Хлопець", correct: true, imageSrc: "/він_хлопець.png" },
  { text: "Вино", correct: false, imageSrc: "/вино.png" },
]);
addOber(29, "ASSIST", "Яка фонетична зміна притаманна Oberdeutsch?", [
  { text: "t → z", correct: true },
  { text: "ch → k", correct: false },
  { text: "r → ø", correct: false },
]);
addOber(29, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "дідусь", correct: false },
      { text: "хлопець", correct: true },
      { text: "друг", correct: false },
    ], "/audio/12/Bua.mp3")
addOber(29, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "зараз", correct: true },
      { text: "скоро", correct: false },
      { text: "немає", correct: false },
    ], "/audio/12/jetzt.mp3")
addMiddlet(29, "WRITE", "Da … spielt draußen", [
  { text: "bua", correct: true },
]);

addOber(30, "SELECT", "'Da Voda is im Haus' — переклади", [
  { text: "Батько пішов", correct: false },
  { text: "Батько в домі", correct: true },
  { text: "Дім новий", correct: false },
]);
addOber(30, "ASSIST", "Який з варіантів є прикладом вокалізації r у баварській мові?", [
  { text: "Vater → Vatter", correct: false },
  { text: "Vater → Foda", correct: true },
  { text: "Vater → Vadder", correct: false },
]);
addOber(30, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "вчитель", correct: false },
      { text: "дідусь", correct: false },
      { text: "батько", correct: true },
    ], "/audio/12/Voda.mp3")
addOber(30, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "мати", correct: true },
      { text: "батько", correct: false },
      { text: "хлопець", correct: false },
    ], "/audio/12/Muada.mp3")
addMiddlet(30, "WRITE", "Da … is im Haus", [
  { text: "voda", correct: true },
]);


await db.insert(schema.units).values([
  {
    id: 7,
    regionId: 13,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 31, unitId: 7, order: 1, title: "Основні речення (частина 1)" },
  { id: 32, unitId: 7, order: 2, title: "Основні речення (частина 2)" },
   { id: 33, unitId: 7, order: 3, title: "Сімʼя та дім" },
  { id: 34, unitId: 7, order: 4, title: "Їжа та речі" },
  { id: 35, unitId: 7, order: 5, title: "Дії та рух" }
]);

const cockneyChallenges: typeof schema.challenges.$inferInsert[] = [];
const cockneyOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let cockneyId = 700;

const addCockney = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
  audioSrc?: string // тільки для LISTEN
) => {
  const chId = cockneyId++;
  cockneyChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null });

  answers.forEach((a) => {
    cockneyOptions.push({
      id: cockneyId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};
addCockney(31, "SELECT", "Що з цього означає «гроші»?", [
  { text: "china plate", correct: false },
  { text: "bees and honey", correct: true },
  { text: "apples and pears", correct: false },
]);
addCockney(31, "ASSIST", "Що з цього означає «голова»?", [
  { text: "loaf of bread", correct: true },
  { text: "dog and bone", correct: false },
  { text: "bottle and stopper", correct: false },
]);
addCockney(31, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг", correct: false },
      { text: "дружина", correct: false },
      { text: "гроші", correct: true },
    ], "/audio/13/loaf_of_bread.mp3")
addCockney(31, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "мати", correct: true },
      { text: "батько", correct: false },
      { text: "хлопець", correct: false },
    ], "/audio/13/bees_and_honey.mp3")
addCockney(31, "WRITE", "I don’t have any … to buy you this", [
  { text: "bees and honey", correct: true },
]);

addCockney(32, "SELECT", "Що означає 'Gwand' у баварському діалекті?", [
  { text: "Їжа", correct: false },
  { text: "Одяг", correct: true },
  { text: "Гроші", correct: false },
]);
addCockney(32, "ASSIST", "Що з цього означає «друг»?", [
  { text: "loaf of bread", correct: false },
  { text: "bees and honey", correct: false },
  { text: "china plate", correct: true },
]);
addCockney(32, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг", correct: true },
      { text: "сходи", correct: false },
      { text: "украсти", correct: false },
    ], "/audio/13/china_plate.mp3")
addCockney(32, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "сходи", correct: true },
      { text: "чай", correct: false },
      { text: "гроші", correct: false },
    ], "/audio/13/apples_and_pears.mp3")
addCockney(32, "WRITE", "Go up the … and you’ll see the bathroom", [
  { text: "apples and pears", correct: true },
]);

addCockney(33, "SELECT", "Що з цього означає «волосся»?", [
  { text: "barnet (fair)", correct: true },
  { text: "trouble and strife", correct: false },
  { text: "china plate", correct: false },
]);
addCockney(33, "ASSIST", "Що з цього означає «поліцейський»?", [
  { text: "rosie lee", correct: false },
  { text: "butcher’s hook", correct: false },
  { text: "bottle and stopper", correct: true },
]);
addCockney(33, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "голова", correct: false },
      { text: "подив/погляд", correct: true },
      { text: "украсти", correct: false },
    ], "/audio/13/barnet.mp3")
addCockney(33, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "поліцейський", correct: true },
      { text: "дружина", correct: false },
      { text: "сходи", correct: false },
    ], "/audio/13/bottle_and_stopper.mp3")
addCockney(33, "WRITE", "Watch out, the … is about! ", [
  { text: "bottle and stopper", correct: true },
]);

addCockney(34, "SELECT", "Що з цього означає «украсти»?", [
  { text: "loaf of bread", correct: false },
  { text: "half-inch", correct: true },
  { text: "bees and honey", correct: false },
]);
addCockney(34, "ASSIST", "Що з цього означає «дружина»?", [
  { text: "rosie lee", correct: false },
  { text: "china plate", correct: false },
  { text: "trouble and strife", correct: true },
]);
addCockney(34, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "голова", correct: false },
      { text: "подив/погляд", correct: false },
      { text: "дружина", correct: true },
    ], "/audio/13/trouble_and_strife.mp3")
addCockney(34, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "поліцейський", correct: false },
      { text: "дружина", correct: false },
      { text: "украсти", correct: true },
    ], "/audio/13/half-ich.mp3")
addCockney(34, "WRITE", "My … is waiting for me at home", [
  { text: "trouble and strife", correct: true },
]);

addCockney(35, "SELECT", "Що з цього означає «подив/погляд»?", [
  { text: "butcher’s hook", correct: true },
  { text: "china plate", correct: false },
  { text: "apples and pears", correct: false },
]);
addCockney(35, "ASSIST", "	Що з цього означає «чай»?", [
  { text: "bees and honey", correct: false },
  { text: "rosie lee", correct: true },
  { text: "half-inch", correct: false },
]);
addCockney(35, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "голова", correct: false },
      { text: "подив/погляд", correct: true },
      { text: "дружина", correct: false },
    ], "/audio/13/butchers_hook.mp3")
addCockney(35, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг", correct: false },
      { text: "голова", correct: false },
      { text: "чай", correct: true },
    ], "/audio/13/rossie_lee.mp3")
addCockney(35, "WRITE", "Fancy a cup of …? ", [
  { text: "rosie lee", correct: true },
]);



await db.insert(schema.units).values([
  {
    id: 8,
    regionId: 14,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 36, unitId: 8, order: 1, title: "Основні речення (частина 1)" },
  { id: 37, unitId: 8, order: 2, title: "Основні речення (частина 2)" },
   { id: 38, unitId: 8, order: 3, title: "Сімʼя та дім" },
  { id: 39, unitId: 8, order: 4, title: "Їжа та речі" },
  { id: 40, unitId: 8, order: 5, title: "Дії та рух" }
]);

const scouseChallenges: typeof schema.challenges.$inferInsert[] = [];
const scouseOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let scouseId = 800;

const addScouse = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
  audioSrc?: string // тільки для LISTEN
) => {
  const chId = scouseId++;
  scouseChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null });

  answers.forEach((a) => {
    scouseOptions.push({
      id: scouseId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};
addScouse(36, "SELECT", "Що з цього означає «їжа»?", [
  { text: "scran", correct: true },
  { text: "kecks", correct: false },
  { text: "boss", correct: false },
]);
addScouse(36, "ASSIST", "Що з цього означає «штани»?", [
  { text: "scran", correct: false },
  { text: "kecks", correct: true },
  { text: "jarg", correct: false },
]);
addScouse(36, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "їжа", correct: true },
      { text: "гарний/чудовий", correct: false },
      { text: "фальшивий/підробка", correct: false },
    ], "/audio/14/scran.mp3")
addScouse(36, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "штани", correct: true },
      { text: "голова", correct: false },
      { text: "друг/товариш", correct: false },
    ], "/audio/14/kecks.mp3")
addScouse(36, "WRITE", "I’m starving, let’s grab some … before we go out", [
  { text: "scran", correct: true },
]);

addScouse(37, "SELECT", "Що з цього означає «не місцевий/чужак»?", [
  { text: "wool", correct: true },
  { text: "jarg", correct: false },
  { text: "la/lad", correct: false },
]);
addScouse(37, "ASSIST", "Що з цього означає «фальшивий/підробка»?", [
  { text: "boss", correct: false },
  { text: "jarg", correct: true },
  { text: "div", correct: false },
]);
addScouse(37, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "не місцевий/чужак", correct: true },
      { text: "дитина", correct: false },
      { text: "алкогольний напій", correct: false },
    ], "/audio/14/wool.mp3")
addScouse(37, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "дурень", correct: false },
      { text: "фальшивий/підробка", correct: true },
      { text: "голова", correct: false },
    ], "/audio/14/jarg.mp3")
addScouse(37, "WRITE", "That … just moved here last week, he doesn’t know the city.", [
  { text: "wool", correct: true },
]);

addScouse(38, "SELECT", "Що з цього означає «голова»?", [
  { text: "lid", correct: true },
  { text: "bevvy", correct: false },
  { text: "div", correct: false },
]);
addScouse(38, "ASSIST", "Що з цього означає «друг/товариш»?", [
  { text: "la/lad", correct: true },
  { text: "liddo/little one", correct: false },
  { text: "boss", correct: false },
]);
addScouse(38, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг/товариш", correct: true },
      { text: "дитина", correct: false },
      { text: "штани", correct: false },
    ], "/audio/14/la.mp3")
addScouse(38, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "їжа", correct: false },
      { text: "гарний/чудовий", correct: false },
      { text: "голова", correct: true },
    ], "/audio/14/lid.mp3")
addScouse(38, "WRITE", "Me and my … are going to watch the football", [
  { text: "la/lad", correct: true },
  { text: "lad", correct: true },
  { text: "la", correct: true },
]);

addScouse(39, "SELECT", "Що з цього означає «дурень»?", [
  { text: "kecks", correct: false },
  { text: "div", correct: true },
  { text: "boss", correct: false },
]);
addScouse(39, "ASSIST", "Що з цього означає «дитина»?", [
  { text: "liddo/little one", correct: true },
  { text: "la/lad", correct: false },
  { text: "scran", correct: false },
]);
addScouse(39, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг/товариш", correct: false },
      { text: "дурень", correct: true },
      { text: "фальшивий/підробка", correct: false },
    ], "/audio/14/div.mp3")
addScouse(39, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "не місцевий/чужак", correct: false },
      { text: "дитина", correct: true },
      { text: "друг/товариш", correct: false },
    ], "/audio/14/liddo.mp3")
addScouse(39, "WRITE", "Come on, …, time for bed", [
  { text: "liddo/little one", correct: true },
  { text: "liddo", correct: true },
  { text: "little one", correct: true },
]);

addScouse(40, "SELECT", "Що з цього означає «алкогольний напій»?", [
  { text: "scran", correct: false },
  { text: "bevvy", correct: true },
  { text: "wool", correct: false },
]);
addScouse(40, "ASSIST", "Що з цього означає «гарний/чудовий»?", [
  { text: "div", correct: false },
  { text: "boss", correct: true },
  { text: "jarg", correct: false },
]);
addScouse(40, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг/товариш", correct: false },
      { text: "дурень", correct: true },
      { text: "фальшивий/підробка", correct: false },
    ], "/audio/14/div.mp3")
addScouse(40, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "не місцевий/чужак", correct: false },
      { text: "дитина", correct: true },
      { text: "друг/товариш", correct: false },
    ], "/audio/14/liddo.mp3")
addScouse(40, "WRITE", "That match was …, la! ", [
  { text: "boss", correct: true },
]);


await db.insert(schema.units).values([
  {
    id: 9,
    regionId: 15,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 41, unitId: 9, order: 1, title: "Основні речення (частина 1)" },
  { id: 42, unitId: 9, order: 2, title: "Основні речення (частина 2)" },
   { id: 43, unitId: 9, order: 3, title: "Сімʼя та дім" },
  { id: 44, unitId: 9, order: 4, title: "Їжа та речі" },
  { id: 45, unitId: 9, order: 5, title: "Дії та рух" }
]);

const geordieChallenges: typeof schema.challenges.$inferInsert[] = [];
const geordieOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let geordieId = 900;

const addGeordie = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
  audioSrc?: string // тільки для LISTEN
) => {
  const chId = geordieId++;
  geordieChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null });

  answers.forEach((a) => {
    geordieOptions.push({
      id: geordieId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};
addGeordie(41, "SELECT", "Що з цього означає «хліб»?", [
  { text: "toon", correct: false },
  { text: "breed", correct: true },
  { text: "spuggy", correct: false },
]);
addGeordie(41, "ASSIST", "Що з цього означає «друг»?", [
  { text: "marra", correct: true },
  { text: "gadgie", correct: false },
  { text: "nappa", correct: false },
]);
addGeordie(41, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "горобець", correct: false },
      { text: "хліб", correct: true },
      { text: "бруд", correct: false },
    ], "/audio/15/breed.mp3")
addGeordie(41, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "чоловік", correct: false },
      { text: "светр", correct: false },
      { text: "друг", correct: true },
    ], "/audio/15/marra.mp3")
addGeordie(41, "WRITE", "He’s my … from school", [
  { text: "marra", correct: true },
]);

addGeordie(42, "SELECT", "Що з цього означає «голова»?", [
  { text: "nappa", correct: true },
  { text: "toon", correct: false },
  { text: "clart", correct: false },
]);
addGeordie(42, "ASSIST", "Що з цього означає «дитина»?", [
  { text: "gadgie", correct: false },
  { text: "bairn", correct: true },
  { text: "radgie", correct: false },
]);
addGeordie(42, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "дитина", correct: true },
      { text: "хліб", correct: false },
      { text: "бруд", correct: false },
    ], "/audio/15/bairn.mp3")
addGeordie(42, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "чоловік", correct: false },
      { text: "голова", correct: true },
      { text: "друг", correct: false },
    ], "/audio/15/nappa.mp3")
addGeordie(42, "WRITE", "Use your … and think before you speak! ", [
  { text: "nappa", correct: true },
]);

addGeordie(43, "SELECT", "Що з цього означає «бруд»?", [
  { text: "gadgie", correct: false },
  { text: "clart", correct: true },
  { text: "radgie", correct: false },
]);
addGeordie(43, "ASSIST", "Що з цього означає «місто (особливо Ньюкасл)»?", [
  { text: "toon", correct: true },
  { text: "clart", correct: false },
  { text: "gansey", correct: false },
]);
addGeordie(43, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "місто", correct: true },
      { text: "хліб", correct: false },
      { text: "сердитий", correct: false },
    ], "/audio/15/toon.mp3")
addGeordie(43, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "светр", correct: false },
      { text: "бруд", correct: true },
      { text: "дитина", correct: false },
    ], "/audio/15/clart.mp3")
addGeordie(43, "WRITE", "You’ve got … all over your boots", [
  { text: "clart", correct: true },
]);

addGeordie(44, "SELECT", "Що з цього означає «чоловік»?", [
  { text: "gadgie", correct: true },
  { text: "nappa", correct: false },
  { text: "spuggy", correct: false },
]);
addGeordie(44, "ASSIST", "Що з цього означає «светр»?", [
  { text: "toon", correct: false },
  { text: "gansey", correct: true },
  { text: "bairn", correct: false },
]);
addGeordie(44, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "дитина", correct: false },
      { text: "чоловік", correct: true },
      { text: "горобець", correct: false },
    ], "/audio/15/gadgie.mp3")
addGeordie(44, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг", correct: false },
      { text: "светр", correct: true },
      { text: "чоловік", correct: false },
    ], "/audio/15/gansey.mp3")
addGeordie(44, "WRITE", "He’s wearing his new … today", [
  { text: "gansey", correct: true },
]);

addGeordie(45, "SELECT", "Що з цього означає «сердитий»?", [
  { text: "radgie", correct: true },
  { text: "spuggy", correct: false },
  { text: "toon", correct: false },
]);
addGeordie(45, "ASSIST", "Що з цього означає «горобець»?", [
  { text: "spuggy", correct: true },
  { text: "bairn", correct: false },
  { text: "gadgie", correct: false },
]);
addGeordie(45, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "сердитий", correct: true },
      { text: "хліб", correct: false },
      { text: "дитина", correct: false },
    ], "/audio/15/radgie.mp3")
addGeordie(45, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "друг", correct: false },
      { text: "горобець", correct: true },
      { text: "голова", correct: false },
    ], "/audio/15/spuggy.mp3")
addGeordie(45, "WRITE", "He gets a bit … when his team loses ", [
  { text: "radgie", correct: true },
]);


await db.insert(schema.units).values([
  {
    id: 10,
    regionId: 16,
    title: "Додаток",
    description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
    order: 1,
  },
]);

await db.insert(schema.lessons).values([
  { id: 46, unitId: 10, order: 1, title: "Основні речення (частина 1)" },
  { id: 47, unitId: 10, order: 2, title: "Основні речення (частина 2)" },
   { id: 48, unitId: 10, order: 3, title: "Сімʼя та дім" },
  { id: 49, unitId: 10, order: 4, title: "Їжа та речі" },
  { id: 50, unitId: 10, order: 5, title: "Дії та рух" }
]);

const yorkChallenges: typeof schema.challenges.$inferInsert[] = [];
const yorkOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let yorkId = 1000;

const addYork = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[],
  audioSrc?: string // тільки для LISTEN
) => {
  const chId = yorkId++;
  yorkChallenges.push({ id: chId, lessonId, type, order: chId, question, audioSrc: audioSrc || null });

  answers.forEach((a) => {
    yorkOptions.push({
      id: geordieId++,
      challengeId: chId,
      text: a.text,
      correct: a.correct,
      audioSrc: a.audioSrc || null,
      imageSrc: a.imageSrc || null,
    });
  });
};
addYork(46, "SELECT", "Що з цього означає «кінь»?", [
  { text: "cuddy", correct: true },
  { text: "croft", correct: false },
  { text: "pannier", correct: false },
]);
addYork(46, "ASSIST", "Що з цього означає «кошик»?", [
  { text: "pannier", correct: true },
  { text: "garth", correct: false },
  { text: "kist", correct: false },
]);
addYork(46, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "кінь", correct: true },
      { text: "овечка", correct: false },
      { text: "сад/двір", correct: false },
    ], "/audio/16/cuddy.mp3")
addYork(46, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "коробка/скриня", correct: false },
      { text: "стайня", correct: false },
      { text: "кошик", correct: true },
    ], "/audio/16/Pannier.mp3")
addYork(46, "WRITE", "ut the apples in the … before you carry them.", [
  { text: "pannier", correct: true },
]);

addYork(47, "SELECT", "Що з цього означає «сад/двір»?", [
  { text: "garth", correct: true },
  { text: "ginnel", correct: false },
  { text: "beck", correct: false },
]);
addYork(47, "ASSIST", "Що з цього означає «коробка/скриня»?", [
  { text: "kist", correct: true },
  { text: "croft", correct: false },
  { text: "staithe", correct: false },
]);
addYork(47, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "коробка/скриня", correct: true },
      { text: "стайня", correct: false },
      { text: "вузький прохід/провулок", correct: false },
    ], "/audio/16/kist.mp3")
addYork(47, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "сад/двір", correct: false },
      { text: "місто", correct: true },
      { text: "невелика ферма/земельна ділянка", correct: false },
    ], "/audio/16/Garth.mp3")
addYork(47, "WRITE", "Fetch that … from the loft", [
  { text: "kist", correct: true },
]);

addYork(48, "SELECT", "Що з цього означає «невеликий потік/струмок»?", [
  { text: "staithe", correct: false },
  { text: "neddy", correct: false },
  { text: "beck", correct: true },
]);
addYork(48, "ASSIST", "Що з цього означає «невелика ферма/земельна ділянка»?", [
  { text: "croft", correct: true },
  { text: "cuddy", correct: false },
  { text: "garth", correct: false },
]);
addYork(48, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "коробка/скриня", correct: true },
      { text: "стайня", correct: false },
      { text: "вузький прохід/провулок", correct: false },
    ], "/audio/16/Beck.mp3")
addYork(48, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "стайня", correct: false },
      { text: "місто", correct: false },
      { text: "невеликий потік/струмок", correct: true },
    ], "/audio/16/Garth.mp3")
addYork(48, "WRITE", "The … runs behind the cottages", [
  { text: "beck", correct: true },
]);

addYork(49, "SELECT", "Що з цього означає «гавань/причал»?", [
  { text: "staithe", correct: true },
  { text: "ginnel", correct: false },
  { text: "cuddy", correct: false },
]);
addYork(49, "ASSIST", "Що з цього означає «вузький прохід/провулок»?", [
  { text: "pannier", correct: false },
  { text: "croft", correct: false },
  { text: "ginnel", correct: true },
]);
addYork(49, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "кошик", correct: false },
      { text: "стайня", correct: false },
      { text: "вузький прохід/провулок", correct: true },
    ], "/audio/16/Ginnel.mp3")
addYork(49, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "гавань/причал", correct: true },
      { text: "сад/двір", correct: false },
      { text: "невелика ферма/земельна ділянка", correct: false },
    ], "/audio/16/Staithe.mp3")
addYork(49, "WRITE", "She went down the … behind the shop", [
  { text: "ginnel", correct: true },
]);

addYork(50, "SELECT", "Що з цього означає «вівця»?", [
  { text: "yow", correct: true },
  { text: "cuddy", correct: false },
  { text: "beck", correct: false },
]);
addYork(50, "ASSIST", "Що з цього означає «кінь»?", [
  { text: "croft", correct: false },
  { text: "pannier", correct: false },
  { text: "neddy", correct: true },
]);
addYork(50, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "кошик", correct: false },
      { text: "вівця", correct: true },
      { text: "кінь", correct: false },
    ], "/audio/16/Yow.mp3")
addYork(50, "LISTEN", "Послухайте й оберіть. Що означає слово", [
      { text: "кінь", correct: true },
      { text: "невеликий потік/струмок", correct: false },
      { text: "вузький прохід/провулок ", correct: false },
    ], "/audio/16/Neddy.mp3")
addYork(50, "WRITE", "The … were grazing peacefully in the field", [
  { text: "yow", correct: true },
]);
  
// // ✅ Вставка в базу
   await db.insert(schema.challenges).values(easternChallenges);
    await db.insert(schema.challengesOptions).values(easternOptions);
   await db.insert(schema.challenges).values(yorkChallenges);
    await db.insert(schema.challengesOptions).values(yorkOptions);
   await db.insert(schema.challenges).values(geordieChallenges);
    await db.insert(schema.challengesOptions).values(geordieOptions);
    await db.insert(schema.challenges).values(scouseChallenges);
    await db.insert(schema.challengesOptions).values(scouseOptions);
    await db.insert(schema.challenges).values(cockneyChallenges);
    await db.insert(schema.challengesOptions).values(cockneyOptions);
     await db.insert(schema.challenges).values(oberChallenges);
    await db.insert(schema.challengesOptions).values(oberOptions);

    await db.insert(schema.challenges).values(plattChallenges);
    await db.insert(schema.challengesOptions).values(plattOptions);
    await db.insert(schema.challenges).values(middleChallenges);
    await db.insert(schema.challengesOptions).values(middleOptions);

    await db.insert(schema.challenges).values(northChallenges);
    await db.insert(schema.challengesOptions).values(northOptions);
    await db.insert(schema.challenges).values(swChallenges);
    await db.insert(schema.challengesOptions).values(swOptions);

    console.log("✅ Seeding finished successfully!");
  } catch (error) {
    console.error(error);
    throw new Error("❌ Failed to seed the database");
  }
}

main();



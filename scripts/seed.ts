import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  try {
    console.log("🌾 Seeding database...");

    // Очистка таблиць
    await db.delete(schema.challengesProgress);
    await db.delete(schema.challengesOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.regions);
    await db.delete(schema.userProgress);
    await db.delete(schema.countries);

    // === КРАЇНИ ===
    await db.insert(schema.countries).values([
      { id: 1, title: "Ukrainian", imageSrc: "/ukraine.png" },
      { id: 2, title: "German", imageSrc: "/germany.png" },
      { id: 3, title: "English", imageSrc: "/britain.webp" },
    ]);

    // === РЕГІОНИ ===
    await db.insert(schema.regions).values([
      { id: 7, title: "Північне наріччя", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 8, title: "Південно-західне наріччя", countryId: 1, imageSrc: "/ukraine.png" },
      // { id: 9, title: "Південно-східне наріччя", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 10, title: "Нижньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 11, title: "Середньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      // { id: 12, title: "Верхньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 13, title: "-", countryId: 3, imageSrc: "/britain.webp" },
      { id: 14, title: "-", countryId: 3, imageSrc: "/britain.webp" },
    ]);

    // === ЮНІТ ДЛЯ ПІВНІЧНОГО НАРІЧЧЯ ===
    await db.insert(schema.units).values([
      {
        id: 2,
        regionId: 7,
        title: "Додаток",
        description: "Перед тим як практикуватись радимо, прочитати навчальні матеріали.",
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      { id: 6, unitId: 2, order: 1, title: "Слова про людей" },
      { id: 7, unitId: 2, order: 2, title: "Природа і село" },
      { id: 8, unitId: 2, order: 3, title: "Хата і побут" },
      { id: 9, unitId: 2, order: 4, title: "Їжа і напої" },
      { id: 10, unitId: 2, order: 5, title: "Дієслова та дії" },
    ]);

    // 🟩 Масиви для завдань
    const northChallenges: typeof schema.challenges.$inferInsert[] = [];
    const northOptions: typeof schema.challengesOptions.$inferInsert[] = [];
    let idCounter = 100;

    // 🧩 Функція для створення завдань
    const addChallenge = (
      lessonId: number,
      type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
      question: string,
      answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
    ) => {
      const chId = idCounter++;
      northChallenges.push({ id: chId, lessonId, type, order: chId, question });

      answers.forEach((ans) => {
        northOptions.push({
          id: idCounter++,
          challengeId: chId,
          text: ans.text,
          correct: ans.correct,
          audioSrc: ans.audioSrc || null,
          imageSrc: ans.imageSrc || null,
        });
      });
    };

    // === Урок 1: Слова про людей ===
    addChallenge(6, "SELECT", "Що означає слово «гуторити»?", [
      { text: "розмовляти", correct: true, audioSrc: "/audio/rozmovlyaty.mp3", imageSrc: "/images/rozmovlyaty.png" },
      { text: "співати", correct: false, audioSrc: "/audio/spivaty.mp3", imageSrc: "/images/spivaty.png" },
      { text: "плакати", correct: false, audioSrc: "/audio/plakaty.mp3", imageSrc: "/images/plakaty.png" },
    ]);

    addChallenge(6, "ASSIST", "Переклади: дєдьо", [
      { text: "дідусь", correct: true, audioSrc: "/audio/didus.mp3" },
      { text: "хлопець", correct: false, audioSrc: "/audio/hlopets.mp3" },
      { text: "онук", correct: false, audioSrc: "/audio/onuk.mp3" },
    ]);

    addChallenge(6, "SELECT", "Що означає «дєдьо гуторить»?", [
      { text: "Дід розмовляє", correct: true, audioSrc: "/audio/did_rozmovlyaye.mp3", imageSrc: "/images/did_rozmovlyaye.png" },
      { text: "Дід співає", correct: false, audioSrc: "/audio/did_spivaye.mp3", imageSrc: "/images/did_spivaye.png" },
      { text: "Дід працює", correct: false, audioSrc: "/audio/did_pratsyuye.mp3", imageSrc: "/images/did_pratsyuye.png" },
    ]);

    addChallenge(6, "LISTEN", "Прослухай і вибери значення слова «ліс»", [
      { text: "лєс", correct: true, audioSrc: "/audio/les.mp3" },
      { text: "луг", correct: false, audioSrc: "/audio/lug.mp3" },
      { text: "лось", correct: false, audioSrc: "/audio/los.mp3" },
    ]);

    addChallenge(6, "WRITE", "Напиши слово, що означає «говорити»", [
      { text: "гуторити", correct: true },
    ]);

    // === Урок 2: Природа і село ===
    addChallenge(7, "SELECT", "Що означає «ставок»?", [
      { text: "невелике озеро", correct: true, audioSrc: "/audio/stavok.mp3", imageSrc: "/images/stavok.png" },
      { text: "парк", correct: false, audioSrc: "/audio/park.mp3", imageSrc: "/images/park.png" },
      { text: "гора", correct: false, audioSrc: "/audio/gora.mp3", imageSrc: "/images/gora.png" },
    ]);

    addChallenge(7, "ASSIST", "Переклади: гутірка", [
      { text: "розмова", correct: true, audioSrc: "/audio/rozmova.mp3" },
      { text: "пісня", correct: false, audioSrc: "/audio/pisnya.mp3" },
      { text: "прогулянка", correct: false, audioSrc: "/audio/progulyanka.mp3" },
    ]);

    addChallenge(7, "SELECT", "Що означає слово «грунь»?", [
      { text: "пагорб", correct: true, audioSrc: "/audio/pagorb.mp3", imageSrc: "/images/pagorb.png" },
      { text: "болото", correct: false, audioSrc: "/audio/boloto.mp3", imageSrc: "/images/boloto.png" },
      { text: "рівнина", correct: false, audioSrc: "/audio/rivnina.mp3", imageSrc: "/images/rivnina.png" },
    ]);

    addChallenge(7, "LISTEN", "Прослухай слово «муркотіти»", [
      { text: "вуркотати", correct: true, audioSrc: "/audio/vurkotaty.mp3" },
      { text: "вуркочати", correct: false, audioSrc: "/audio/vurkohaty.mp3" },
      { text: "варкачати", correct: false, audioSrc: "/audio/varkachaty.mp3" },
    ]);

    addChallenge(7, "WRITE", "Напиши переклад слова «грунь»", [
      { text: "пагорб", correct: true },
    ]);

    // === Урок 3: Хата і побут ===
    addChallenge(8, "SELECT", "Що означає слово «піч»?", [
      { text: "камін", correct: false, audioSrc: "/audio/kamin.mp3", imageSrc: "/images/kamin.png" },
      { text: "кухня", correct: false, audioSrc: "/audio/kuhnya.mp3", imageSrc: "/images/kuhnya.png" },
      { text: "піч", correct: true, audioSrc: "/audio/pich.mp3", imageSrc: "/images/pich.png" },
    ]);

    addChallenge(8, "ASSIST", "Переклади: покуть", [
      { text: "кут хати", correct: true, audioSrc: "/audio/kut_haty.mp3" },
      { text: "двері", correct: false, audioSrc: "/audio/dveri.mp3" },
      { text: "вікно", correct: false, audioSrc: "/audio/vikno.mp3" },
    ]);

    addChallenge(8, "SELECT", "Що означає «мисник»?", [
      { text: "шафа для посуду", correct: true, audioSrc: "/audio/shafa.mp3", imageSrc: "/images/shafa.png" },
      { text: "стіл", correct: false, audioSrc: "/audio/stil.mp3", imageSrc: "/images/stil.png" },
      { text: "стілець", correct: false, audioSrc: "/audio/stilets.mp3", imageSrc: "/images/stilets.png" },
    ]);

    addChallenge(8, "LISTEN", "Прослухай слово «місце біля печі»", [
      { text: "припічок", correct: true, audioSrc: "/audio/pripichok.mp3" },
      { text: "підлога", correct: false, audioSrc: "/audio/pidloga.mp3" },
      { text: "стіна", correct: false, audioSrc: "/audio/stina.mp3" },
    ]);

    addChallenge(8, "WRITE", "Напиши переклад слова «покуть»", [
      { text: "кут хати", correct: true },
    ]);

    // === Урок 4: Їжа ===
    addChallenge(9, "SELECT", "Що означає «бурак»?", [
      { text: "буряк", correct: true, audioSrc: "/audio/buryak.mp3", imageSrc: "/images/buryak.png" },
      { text: "морква", correct: false, audioSrc: "/audio/morkva.mp3", imageSrc: "/images/morkva.png" },
      { text: "капуста", correct: false, audioSrc: "/audio/kapusta.mp3", imageSrc: "/images/kapusta.png" },
    ]);

    addChallenge(9, "ASSIST", "Переклади: кулеша", [
      { text: "каша з кукурудзяного борошна", correct: true, audioSrc: "/audio/kulesha.mp3" },
      { text: "борщ", correct: false, audioSrc: "/audio/borsh.mp3" },
      { text: "сир", correct: false, audioSrc: "/audio/syr.mp3" },
    ]);

    addChallenge(9, "SELECT", "Що означає «лєпка»?", [
      { text: "вареники", correct: true, audioSrc: "/audio/varenyky.mp3", imageSrc: "/images/varenyky.png" },
      { text: "сирники", correct: false, audioSrc: "/audio/syrnyky.mp3", imageSrc: "/images/syrnyky.png" },
      { text: "галушки", correct: false, audioSrc: "/audio/galushky.mp3", imageSrc: "/images/galushky.png" },
    ]);

    addChallenge(9, "LISTEN", "Обери слово хліб", [
      { text: "хліб", correct: true, audioSrc: "/audio/hlib.mp3" },
      { text: "булочка", correct: false, audioSrc: "/audio/bulochka.mp3" },
      { text: "паляниця", correct: false, audioSrc: "/audio/palyanytsya.mp3" },
    ]);

    addChallenge(9, "WRITE", "Напиши переклад слова «кулеша»", [
      { text: "каша з кукурудзи", correct: true },
    ]);

    // === Урок 5: Дії ===
    addChallenge(10, "SELECT", "Що означає «співати» на півночі?", [
      { text: "гуторити", correct: false, audioSrc: "/audio/gutority.mp3", imageSrc: "/images/gutority.png" },
      { text: "співати", correct: true, audioSrc: "/audio/spivaty.mp3", imageSrc: "/images/spivaty.png" },
      { text: "говорити", correct: false, audioSrc: "/audio/hovoryty.mp3", imageSrc: "/images/hovoryty.png" },
    ]);

    addChallenge(10, "ASSIST", "Переклади: гуторка", [
      { text: "розмова", correct: true, audioSrc: "/audio/rozmova.mp3" },
      { text: "спів", correct: false, audioSrc: "/audio/spiv.mp3" },
      { text: "сварка", correct: false, audioSrc: "/audio/svarka.mp3" },
    ]);

    addChallenge(10, "SELECT", "Що означає слово «молоти»?", [
      { text: "говорити", correct: false, audioSrc: "/audio/hovoryty.mp3", imageSrc: "/images/hovoryty.png" },
      { text: "товкти", correct: true, audioSrc: "/audio/tovkty.mp3", imageSrc: "/images/tovkty.png" },
      { text: "жартувати", correct: false, audioSrc: "/audio/zhartuvaty.mp3", imageSrc: "/images/zhartuvaty.png" },
    ]);

    addChallenge(10, "LISTEN", "Прослухай і вибери слово «ходити»", [
      { text: "іти", correct: true, audioSrc: "/audio/ity.mp3" },
      { text: "йти", correct: false, audioSrc: "/audio/yty.mp3" },
      { text: "ходь", correct: false, audioSrc: "/audio/khod.mp3" },
    ]);

    addChallenge(10, "WRITE", "Напиши слово, яке означає «розмовляти»", [
      { text: "гуторити", correct: true },
    ]);
      await db.insert(schema.units).values([
    {
      id: 3,
      regionId: 8,
      title: "Основи діалекту",
      description: "Вивчай лексику південно-західного наріччя — від слів до вимови.",
      order: 1,
    },
  ]);

await db.insert(schema.lessons).values([
  { id: 11, unitId: 3, order: 1, title: "Слова про людей" },
  { id: 12, unitId: 3, order: 2, title: "Природа і село" },
  { id: 13, unitId: 3, order: 3, title: "Хата і побут" },
  { id: 14, unitId: 3, order: 4, title: "Їжа і напої" },
  { id: 15, unitId: 3, order: 5, title: "Дії" },
]);
    // === ПІВДЕННО-ЗАХІДНЕ НАРІЧЧЯ ===
    const swChallenges: typeof schema.challenges.$inferInsert[] = [];
    const swOptions: typeof schema.challengesOptions.$inferInsert[] = [];
    let swIdCounter = 200;

    const addSWChallenge = (
      lessonId: number,
      type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
      question: string,
      answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
    ) => {
      const chId = swIdCounter++;
      swChallenges.push({ id: chId, lessonId, type, order: chId, question });

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
    // === Урок 1: Слова про людей ===
    addSWChallenge(11, "SELECT", "Що означає слово «файний»?", [
      { text: "гарний", correct: true, audioSrc: "/audio/faynyy.mp3" },
      { text: "злий", correct: false, audioSrc: "/audio/zlyy.mp3" },
      { text: "маленький", correct: false, audioSrc: "/audio/malenkyy.mp3" },
      { text: "брудний", correct: false, audioSrc: "/audio/brudnyy.mp3" },
    ]);
     addSWChallenge(11, "SELECT", "Слово «ґазда» означає:", [
      { text: "господар", correct: true, audioSrc: "/audio/hozhar.mp3" },
      { text: "селянин", correct: false, audioSrc: "/audio/selyanyn.mp3" },
      { text: "друг", correct: false, audioSrc: "/audio/drug.mp3" },
      { text: "кухар", correct: false, audioSrc: "/audio/kukhar.mp3" },
    ]);
    addSWChallenge(11, "ASSIST", "Напиши переклад слова «баняк»", [
      { text: "каструля", correct: true, audioSrc: "/audio/kastrulya.mp3", imageSrc: "/images/kastrulya.png" },
      { text: "відро", correct: false, audioSrc: "/audio/vidro.mp3", imageSrc: "/images/vidro.png" },
    ]);  
    addSWChallenge(11, "ASSIST", "Напиши переклад слова «баняк»", [
  { text: "каструля", correct: true, audioSrc: "/audio/kastrulya.mp3" },
  { text: "відро", correct: false, audioSrc: "/audio/vidro.mp3" },
]);

  addSWChallenge(11, "LISTEN", "Прослухай і вибери правильну вимову слова «ґринджоли»", [
    { text: "ґринджоли", correct: true, audioSrc: "/audio/gryndzholy.mp3" },
    { text: "гринджоли", correct: false, audioSrc: "/audio/hrindzholy.mp3" },
  ]);
  addSWChallenge(11, "WRITE", "Мій тато — добрий ______.", [{ text: "ґазда", correct: true }]);

// Урок 2: Природа і село
addSWChallenge(12, "SELECT", "Що означає «грунь»?", [
  { text: "пагорб", correct: true, audioSrc: "/audio/pagorb.mp3", imageSrc: "/images/pagorb.png" },
  { text: "болото", correct: false, audioSrc: "/audio/boloto.mp3", imageSrc: "/images/boloto.png" },
  { text: "рівнина", correct: false, audioSrc: "/audio/rivnyna.mp3", imageSrc: "/images/rivnyna.png" },
]);

addSWChallenge(12, "ASSIST", "Переклади слово «гутірка»", [
  { text: "розмова", correct: true, audioSrc: "/audio/rozmova.mp3" },
  { text: "пісня", correct: false, audioSrc: "/audio/pisnya.mp3" },
  { text: "прогулянка", correct: false, audioSrc: "/audio/progulyanka.mp3" },
]);

addSWChallenge(12, "LISTEN", "Прослухай слово «муркотіти»", [
  { text: "вуркотати", correct: true, audioSrc: "/audio/vurkotaty.mp3" },
  { text: "мурчати", correct: false, audioSrc: "/audio/murchaty.mp3" },
]);

addSWChallenge(12, "WRITE", "Напиши переклад слова «грунь»", [{ text: "пагорб", correct: true }]);

// Урок 3: Хата і побут
addSWChallenge(13, "SELECT", "Що означає слово «мисник»?", [
  { text: "шафа для посуду", correct: true, audioSrc: "/audio/shafa_posud.mp3", imageSrc: "/images/shafa_posud.png" },
  { text: "стіл", correct: false, audioSrc: "/audio/stil.mp3", imageSrc: "/images/stil.png" },
  { text: "стілець", correct: false, audioSrc: "/audio/stilets.mp3", imageSrc: "/images/stilets.png" },
]);

addSWChallenge(13, "ASSIST", "Переклади слово «покуть»", [
  { text: "кут хати", correct: true, audioSrc: "/audio/kut_haty.mp3" },
  { text: "вікно", correct: false, audioSrc: "/audio/vikno.mp3" },
]);

addSWChallenge(13, "LISTEN", "Прослухай слово «припічок»", [
  { text: "місце біля печі", correct: true, audioSrc: "/audio/prypichok.mp3" },
]);

addSWChallenge(13, "WRITE", "У мене стоїть глечик на ______.", [{ text: "миснику", correct: true }]);

// Урок 4: Їжа і напої
addSWChallenge(14, "SELECT", "Що означає «кулеша»?", [
  { text: "каша з кукурудзяного борошна", correct: true, audioSrc: "/audio/kulesha.mp3", imageSrc: "/images/kulesha.png" },
  { text: "борщ", correct: false, audioSrc: "/audio/borshch.mp3", imageSrc: "/images/borshch.png" },
  { text: "сир", correct: false, audioSrc: "/audio/syr.mp3", imageSrc: "/images/syr.png" },
]);

addSWChallenge(14, "ASSIST", "Переклади слово «бурак»", [
  { text: "буряк", correct: true, audioSrc: "/audio/buryak.mp3" },
  { text: "морква", correct: false, audioSrc: "/audio/morkva.mp3" },
]);

addSWChallenge(14, "LISTEN", "Прослухай і вибери слово «вареники»", [
  { text: "лєпка", correct: true, audioSrc: "/audio/lepkа.mp3" },
  { text: "галушки", correct: false, audioSrc: "/audio/galushky.mp3" },
]);

addSWChallenge(14, "WRITE", "Мама приготувала смачну ______.", [{ text: "кулешу", correct: true }]);

// Урок 5: Дії
addSWChallenge(15, "SELECT", "Що означає «гуторити»?", [
  { text: "розмовляти", correct: true, audioSrc: "/audio/gutoryty.mp3", imageSrc: "/images/rozmova.png" },
  { text: "співати", correct: false, audioSrc: "/audio/spivaty.mp3", imageSrc: "/images/spivaty.png" },
  { text: "жартувати", correct: false, audioSrc: "/audio/zhartuvaty.mp3", imageSrc: "/images/zhartuvaty.png" },
]);

addSWChallenge(15, "ASSIST", "Переклади слово «молоти»", [
  { text: "товкти", correct: true, audioSrc: "/audio/tovkty.mp3" },
  { text: "говорити", correct: false, audioSrc: "/audio/hovoryty.mp3" },
]);

addSWChallenge(15, "LISTEN", "Прослухай і вибери слово «іти»", [
  { text: "ходити", correct: true, audioSrc: "/audio/ity.mp3" },
  { text: "стояти", correct: false, audioSrc: "/audio/stoyaty.mp3" },
]);

addSWChallenge(15, "WRITE", "Напиши переклад слова «гуторити»", [{ text: "розмовляти", correct: true }]);
  
// === UNIT для Нижньонімецьких діалектів (Plattdeutsch) ===
await db.insert(schema.units).values([
  {
    id: 4,
    regionId: 10,
    title: "Основи Plattdeutsch",
    description: "Перші речення, слова та вимова в Нижньонімецьких діалектах.",
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

// === МОДУЛЬ 2: Нижньонімецькі діалекти (Plattdeutsch)
const plattChallenges: typeof schema.challenges.$inferInsert[] = [];
const plattOptions: typeof schema.challengesOptions.$inferInsert[] = [];
let plattId = 300;

const addPlatt = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = plattId++;
  plattChallenges.push({ id: chId, lessonId, type, order: chId, question });

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

// === LESSON 1 ===
addPlatt(16, "SELECT", "Вибери правильне речення", [
  { text: "He dat nich verstahn.", correct: false },
  { text: "Ik heww dat nich verstahn.", correct: true, audioSrc: "/audio/ik_heww_dat_nich_verstahn.mp3" },
  { text: "Ik heb dat nicht verstanden.", correct: false },
  { text: "Dat nich heww verstahn.", correct: false },
]);

addPlatt(16, "ASSIST", "Постав слова у правильному порядку: mien / Huus / is / dat", [
  { text: "Dat is mien Huus.", correct: true },
  { text: "is dat mien Huus.", correct: false, audioSrc: "/audio/dat_is_mien_huus.mp3" },
   { text: "Huus is dat mien.", correct: false, audioSrc: "/audio/dat_is_mien_huus.mp3" },
]);

addPlatt(16, "WRITE", "Напиши речення зі словами: ik / heww / keen / Tied", [
  { text: "Ik heww keen Tied.", correct: true },
]);

addPlatt(16, "LISTEN", "he_kummt_later переклда речення:", [
  { text: "Він прийде пізніше", correct: true},
  { text: "Він уже тут", correct: false },
  { text: "Я пішов додому", correct: false },
  { text: "Він не чув", correct: false },
]);

addPlatt(16, "ASSIST", "Збери речення: Wi / gaht / to / de / Markt", [
  { text: "Wi gaht to de Markt.", correct: true},
  { text: "Markt Wi gaht to de.", correct: false},
  { text: "Markt Wi to de gaht.", correct: false},
]);

// === LESSON 2 ===
addPlatt(17, "SELECT", "Вибери правильне речення", [
  { text: "Een Bröödt is dat.", correct: false },
  { text: "Dat is een Bröödt.", correct: true, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "Ik heww Bröödt.", correct: false },
  { text: "Bröödt een dat.", correct: false },
]);

addPlatt(17, "LISTEN", "wo_is_dien_vadder переклад:", [
  { text: "Де твій батько?", correct: true},
  { text: "Це мій дім.", correct: false },
  { text: "Твій тато спить.", correct: false },
  { text: "Я йду додому.", correct: false },
]);

addPlatt(17, "WRITE", "Напиши речення зі словами: ik / mutt / na / Huus", [
  { text: "Ik mutt na Huus.", correct: true },
  // { text: "mutt Ik na Huus.", correct: false },
  // { text: "Huus mutt Ik na.", correct: false },
]);

addPlatt(17, "ASSIST", "Збери речення: se / sünd / to / de / Schoul", [
  { text: "Se sünd to de Schoul.", correct: true},
  { text: "Schoul Se sünd to de Schoul.", correct: false},
  { text: "Schoul Se sünd de to Schoul.", correct: false},
]);
// === LESSON 3: Сімʼя та дім ===
addPlatt(18, "SELECT", "Що означає 'Dat is mien Huus'?", [
  { text: "Це мій дім", correct: true},
  { text: "Твій дім тут", correct: false },
  { text: "Де мій дім?", correct: false },
  { text: "Мій тато вдома", correct: false },
]);

addPlatt(18, "ASSIST", "Збери речення: Wo / is / dien / Vadder?", [
  { text: "Wo is dien Vadder?", correct: true},
  { text: "Vadder? Wo is dien Vadder?", correct: false},
  { text: "dien Wo is dien Vadder?", correct: false},
]);

addPlatt(18, "LISTEN", "dat_is_dien_vadder вибери правильний переклад", [
  { text: "Мій батько вдома", correct: true},
  { text: "Дім старий", correct: false },
  { text: "Тато пішов на роботу", correct: false },
]);

addPlatt(18, "WRITE", "Напиши речення: Dat is mien Huus", [
  { text: "Dat is mien Huus.", correct: true },
]);

// === LESSON 4: Їжа та речі ===
addPlatt(19, "SELECT", "Що означає 'Dat is een Bröödt'?", [
  { text: "Це хліб", correct: true},
  { text: "Це сир", correct: false },
  { text: "Це м’ясо", correct: false },
  { text: "Це суп", correct: false },
]);

addPlatt(19, "ASSIST", "Постав слова у правильному порядку: Dat / is / een / Bröödt", [
  { text: "Dat is een Bröödt.", correct: true},
  { text: "Bröödt Dat is een.", correct: false},
  { text: "is Bröödt Dat is een.", correct: false},
]);

addPlatt(19, "LISTEN", "вибери переклад слова 'eten'", [
  { text: "їсти", correct: true},
  { text: "пити", correct: false },
  { text: "спати", correct: false },
]);

addPlatt(19, "WRITE", "Напиши речення: Ik heww dat nich verstahn", [
  { text: "Ik heww dat nich verstahn.", correct: true },
]);

// === LESSON 5: Дії та рух ===
addPlatt(20, "SELECT", "Що означає 'He kümmt later'?", [
  { text: "Він прийде пізніше", correct: true},
  { text: "Він уже тут", correct: false },
  { text: "Він спить", correct: false },
  { text: "Я йду додому", correct: false },
]);

addPlatt(20, "ASSIST", "Склади речення: Ik / mutt / na / Huus", [
  { text: "Ik mutt na Huus.", correct: true},
  { text: "Huus Ik mutt na.", correct: false},
  { text: "Huus Ik na mutt.", correct: false},
]);

addPlatt(20, "LISTEN", "ik_mutt_na_huus вибери речення з тим самим змістом", [
  { text: "Я йду додому", correct: true},
  { text: "Він іде додому", correct: false },
  { text: "Ми в школі", correct: false },
]);

addPlatt(20, "WRITE", "Напиши речення: Se sünd to de Schoul", [
  { text: "Se sünd to de Schoul.", correct: true },
]);

// === UNIT для Нижньонімецьких діалектів (Plattdeutsch) ===
await db.insert(schema.units).values([
  {
    id: 5,
    regionId: 11,
    title: "Основи Plattdeutsch",
    description: "Перші речення, слова та вимова в Середньонімечьких діалектах.",
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
let middleId = 400;

const addMiddlet = (
  lessonId: number,
  type: "SELECT" | "ASSIST" | "LISTEN" | "WRITE",
  question: string,
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = middleId++;
  middleChallenges.push({ id: chId, lessonId, type, order: chId, question });

  answers.forEach((a) => {
    middleOptions.push({
      id: plattId++,
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
  { text: "Баварський", correct: true },
  { text: "Гессенський", correct: false },
  { text: "Швейцарський", correct: false },
]);

addMiddlet(21, "SELECT", "Що типово для Mitteldeutsch на фонетичному рівні?", [
  { text: "Вимова з “pf”", correct: true },
  { text: "Збалансована, проміжна фонетика", correct: false },
  { text: "Чергування t → z", correct: false },
  { text: "Вокалізація 'r'", correct: false },
]);
addMiddlet(21, "ASSIST", "Isch / hab / ken / Zeit", [
  { text: "Isch hab ken Zeit.", correct: true },
  { text: "Zeit Isch hab ken.", correct: false },
  { text: "Isch ken hab Zeit.", correct: false },
]);

addMiddlet(21, "ASSIST", "Der / Mann / wo / beim / Daimler / schaffe", [
  { text: "Der Mann wo beim Daimler schaffe.", correct: true },
   { text: "Daimler Der Mann wo beim Daimler schaffe.", correct: false },
    { text: "Der Mann wo beim Daimler wo schaffe.", correct: false },
]);


addMiddlet(21, "SELECT", "Що означає 'Mädsche' у гессенському варіанті?", [
  { text: "Хлопець", correct: false },
  { text: "Дівчина", correct: true },
  { text: "Мама", correct: false },
  { text: "Бабуся", correct: false },
]);
addMiddlet(21, "WRITE", "Переклади: 'я не маю часу'", [
  { text: "Isch hab ken Zeit", correct: true },
]);

addMiddlet(22, "SELECT", "Який з цих діалектів може вживати 'wie' замість 'als'?", [
  { text: "Гессенський", correct: true },
  { text: "Швабський", correct: false },
  { text: "Баварський", correct: false },
  { text: "Plattdeutsch", correct: false },
]);

addMiddlet(22, "SELECT", "Що означає речення 'Isch hab ken Zeit'?", [
  { text: "У мене є час", correct: false },
  { text: "У мене немає часу", correct: true },
  { text: "У тебе є час", correct: false },
  { text: "Ти маєш час", correct: false },
]);
addMiddlet(22, "ASSIST", "Isch / geh / heem / jetz", [
  { text: "Isch geh jetz heem.", correct: true },
  { text: "Isch jetz geh heem.", correct: false },
  { text: "Isch jetz heem.", correct: false },
]);

addMiddlet(22, "ASSIST", "Gude / wie / geht’s / dir?", [
  { text: "Gude, wie geht’s dir?", correct: true },
  { text: "wie geht’s dir?", correct: false },
  { text: "Gude, dir wie geht’s?", correct: false },
]);
addMiddlet(22, "WRITE", "Переклади: 'привіт'", [
  { text: "Gude", correct: true },
]);
addMiddlet(23, "SELECT", "Що означає речення 'Isch hab ken Zeit'?", [
  { text: "У мене є час", correct: false },
  { text: "У мене немає часу", correct: true },
  { text: "У тебе є час", correct: false },
  { text: "Ти маєш час", correct: false },
]);

addMiddlet(23, "SELECT", "Яка особливість у слові 'isch' (замість ich)?", [
  { text: "Південний варіант", correct: true },
  { text: "Типова заміна 'ch' на 'sch'", correct: false },
  { text: "Гортанне r", correct: false },
  { text: "Архаїзм", correct: false },
]);
addMiddlet(23, "ASSIST", "Es / is / net / schlimm", [
  { text: "Es schlimm is net schlimm.", correct: false },
  { text: "Es is net schlimm.", correct: true },
  { text: "Es net is schlimm.", correct: false },
]);

addMiddlet(23, "ASSIST", "Du / bisch / mein / Fründ", [
  { text: "Fründ Du bisch mein.", correct: false },
  { text: "Du mein bisch Fründ.", correct: false },
  { text: "Du bisch mein Fründ.", correct: true },
]);
addMiddlet(23, "WRITE", "Напиши фразу: 'він дома'", [
  { text: "He is doheem", correct: true },
]);

addMiddlet(24, "SELECT", "Що означає 'Schaffe' у контексті «beim Daimler schaffe»?", [
  { text: "Їсти", correct: false },
  { text: "Працювати", correct: true },
  { text: "Ламати", correct: false },
  { text: "Дивитись", correct: false },
]);

addMiddlet(24, "SELECT", "Яке слово у Mitteldeutsch є заміною до 'ein bisschen'?", [
  { text: "a bissle", correct: false },
  { text: "a weng", correct: true },
  { text: "e wänschje", correct: false },
  { text: "ganz", correct: false },
]);
addMiddlet(24, "ASSIST", "Was / machst / du / heit?", [
  { text: "Was machst du heit?", correct: true },
  { text: "Was heit machst?", correct: false },
   { text: "Was heit machst du?", correct: false },
]);

addMiddlet(24, "ASSIST", "Mer / ginn / in / die / Stadt", [
  { text: "Mer ginn in die Stadt.", correct: true },
  { text: "Mer die ginn in Stadt.", correct: false },
  { text: "Mer in die ginn in Stadt.", correct: false },
]);
addMiddlet(24, "WRITE", "Переклади: 'що ти робиш?'", [
  { text: "Was machst du?", correct: true },
]);
addMiddlet(25, "SELECT", "'Gude!' — це:", [
  { text: "Прощання", correct: false },
  { text: "Дякую", correct: true },
  { text: "Привітання", correct: false },
  { text: "Погодження", correct: false },
]);

addMiddlet(25, "SELECT", "Яке з цих тверджень вірне щодо Mitteldeutsch?", [
  { text: "Має найменше діалектів", correct: true },
  { text: "Лежить між північчю і півднем", correct: false },
  { text: "Всі діалекти стандартизовані", correct: false },
  { text: "Використовується лише в Австрії", correct: false },
]);
addMiddlet(25, "ASSIST", "He / is / doheem", [
  { text: "He is doheem.", correct: true },
  { text: "is He doheem.", correct: false },
  { text: "He doheem. is", correct: false },
]);

addMiddlet(25, "ASSIST", "Des / is / mei / Auto", [
  { text: "Des is mei Auto.", correct: true },
  { text: "Des mei is Auto.", correct: false},
  { text: "is Des mei Auto.", correct: false},
]);
addMiddlet(25, "WRITE", "Переклади: 'я йду додому'", [
  { text: "Isch geh heem", correct: true },
]);




// ✅ Вставка в базу
    await db.insert(schema.challenges).values(plattChallenges);
    await db.insert(schema.challengesOptions).values(plattOptions);
    await db.insert(schema.challenges).values(middleChallenges);
    await db.insert(schema.challengesOptions).values(middleOptions);

    // ✅ Вставка в БД
    await db.insert(schema.challenges).values(northChallenges);
    await db.insert(schema.challengesOptions).values(northOptions);
    // ✅ Вставка Південно-західного наріччя
    // await db.insert(schema.challenges).values(northChallenges);
    // await db.insert(schema.challengesOptions).values(northOptions);
    await db.insert(schema.challenges).values(swChallenges);
    await db.insert(schema.challengesOptions).values(swOptions);

    console.log("✅ Seeding finished successfully!");
  } catch (error) {
    console.error(error);
    throw new Error("❌ Failed to seed the database");
  }
}

main();



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

    await db.insert(schema.countries).values([
      { id: 1, title: "Україна", imageSrc: "/ukraine.png" },
      { id: 2, title: "Німеччина", imageSrc: "/germany.png" },
      { id: 3, title: "Велика Британія", imageSrc: "/britain.webp" },
    ]);

    await db.insert(schema.regions).values([
      { id: 7, title: "Північне наріччя", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 8, title: "Південно-західне наріччя", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 9, title: "Південно-східне наріччя", countryId: 1, imageSrc: "/ukraine.png" },
      { id: 10, title: "Нижньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 11, title: "Середньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 12, title: "Верхньонімецькі діалекти", countryId: 2, imageSrc: "/germany.png" },
      { id: 13, title: "Кокні", countryId: 3, imageSrc: "/britain.webp" },
      { id: 14, title: "Скауз", countryId: 3, imageSrc: "/britain.webp" },
      { id: 15, title: "Джорди", countryId: 3, imageSrc: "/britain.webp" },
      { id: 16, title: "Йоркшир", countryId: 3, imageSrc: "/britain.webp" },
    ]);

    await db.insert(schema.units).values([
      {
        id: 1,
        regionId: 7,
        title: "Додаток",
        description: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, order: 1, title: "Слова про людей" },
      { id: 2, unitId: 1, order: 2, title: "Природа і село" },
      { id: 3, unitId: 1, order: 3, title: "Хата і побут" },
      { id: 4, unitId: 1, order: 4, title: "Їжа і напої" },
      { id: 5, unitId: 1, order: 5, title: "Дієслова та дії" },
    ]);

    const northChallenges: typeof schema.challenges.$inferInsert[] = [];
    const northOptions: typeof schema.challengesOptions.$inferInsert[] = [];
    let idCounter = 100;

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

    addChallenge(1, "SELECT", "Що з цього означає «картопля»?", [
      { text: "лєс", correct: false, audioSrc: "/audio/rozmovlyaty.mp3", imageSrc: "/les.png" },
      { text: "бульба", correct: true, audioSrc: "/audio/spivaty.mp3", imageSrc: "/bulba.png" },
      { text: "калач", correct: false, audioSrc: "/audio/plakaty.mp3", imageSrc: "/kalach.png" },
    ]);

    addChallenge(1, "ASSIST", "Що з цього означає «розмовляти»?", [
      { text: "гуторити", correct: true, audioSrc: "/audio/didus.mp3" },
      { text: "клюмба", correct: false, audioSrc: "/audio/hlopets.mp3" },
      { text: "дєдьо", correct: false, audioSrc: "/audio/onuk.mp3" },
    ]);

    // addChallenge(6, "SELECT", "Що означає «дєдьо гуторить»?", [
    //   { text: "Дід розмовляє", correct: true, audioSrc: "/audio/did_rozmovlyaye.mp3", imageSrc: "/images/did_rozmovlyaye.png" },
    //   { text: "Дід співає", correct: false, audioSrc: "/audio/did_spivaye.mp3", imageSrc: "/images/did_spivaye.png" },
    //   { text: "Дід працює", correct: false, audioSrc: "/audio/did_pratsyuye.mp3", imageSrc: "/images/did_pratsyuye.png" },
    // ]);

    // addChallenge(6, "LISTEN", "Прослухай і вибери значення слова «ліс»", [
    //   { text: "лєс", correct: true, audioSrc: "/audio/les.mp3" },
    //   { text: "луг", correct: false, audioSrc: "/audio/lug.mp3" },
    //   { text: "лось", correct: false, audioSrc: "/audio/los.mp3" },
    // ]);

    addChallenge(1, "WRITE", "Ми з дєдом довго … біля печі", [
      { text: "гуторили", correct: true },
    ]);

    addChallenge(2, "SELECT", "Що з цього означає «чемодан»?", [
      { text: "кулачі", correct: false, audioSrc: "/audio/stavok.mp3", imageSrc: "/kalachi.png" },
      { text: "клюмба", correct: false, audioSrc: "/audio/park.mp3", imageSrc: "/klumba.png" },
      { text: "куфер", correct: true, audioSrc: "/audio/gora.mp3", imageSrc: "/kufer.png" },
    ]);

    addChallenge(2, "ASSIST", "Що з цього означає «квітник»?", [
      { text: "порєдок", correct: false, audioSrc: "/audio/rozmova.mp3" },
      { text: "клюмба", correct: true, audioSrc: "/audio/pisnya.mp3" },
      { text: "погрєб", correct: false, audioSrc: "/audio/progulyanka.mp3" },
    ]);

    // addChallenge(7, "SELECT", "Що означає слово «грунь»?", [
    //   { text: "пагорб", correct: true, audioSrc: "/audio/pagorb.mp3", imageSrc: "/images/pagorb.png" },
    //   { text: "болото", correct: false, audioSrc: "/audio/boloto.mp3", imageSrc: "/images/boloto.png" },
    //   { text: "рівнина", correct: false, audioSrc: "/audio/rivnina.mp3", imageSrc: "/images/rivnina.png" },
    // ]);

    // addChallenge(7, "LISTEN", "Прослухай слово «муркотіти»", [
    //   { text: "вуркотати", correct: true, audioSrc: "/audio/vurkotaty.mp3" },
    //   { text: "вуркочати", correct: false, audioSrc: "/audio/vurkohaty.mp3" },
    //   { text: "варкачати", correct: false, audioSrc: "/audio/varkachaty.mp3" },
    // ]);

    addChallenge(2, "WRITE", "Він поклав речі в ….", [
      { text: "куфер", correct: true },
    ]);

    addChallenge(3, "SELECT", "Що з цього означає «льох»?", [
      { text: "шопка", correct: false, audioSrc: "/audio/kamin.mp3", imageSrc: "/shopka.png" },
      { text: "погрєб", correct: true, audioSrc: "/audio/kuhnya.mp3", imageSrc: "/погрєб.png" },
      { text: "хвіртка", correct: false, audioSrc: "/audio/pich.mp3", imageSrc: "/hvirtka.png" },
    ]);

    // addChallenge(8, "ASSIST", "Переклади: покуть", [
    //   { text: "кут хати", correct: true, audioSrc: "/audio/kut_haty.mp3" },
    //   { text: "двері", correct: false, audioSrc: "/audio/dveri.mp3" },
    //   { text: "вікно", correct: false, audioSrc: "/audio/vikno.mp3" },
    // ]);

    addChallenge(3, "SELECT", "Що з цього означає «дверна ручка»?", [
      { text: "клямка", correct: true, audioSrc: "/audio/shafa.mp3", imageSrc: "/images/shafa.png" },
      { text: "порєдок", correct: false, audioSrc: "/audio/stil.mp3", imageSrc: "/images/stil.png" },
      { text: "калачі", correct: false, audioSrc: "/audio/stilets.mp3", imageSrc: "/images/stilets.png" },
    ]);

    // addChallenge(8, "LISTEN", "Прослухай слово «місце біля печі»", [
    //   { text: "припічок", correct: true, audioSrc: "/audio/pripichok.mp3" },
    //   { text: "підлога", correct: false, audioSrc: "/audio/pidloga.mp3" },
    //   { text: "стіна", correct: false, audioSrc: "/audio/stina.mp3" },
    // ]);

    addChallenge(3, "WRITE", "Мама поставила банки в ….", [
      { text: "погрєб", correct: true },
    ]);

    addChallenge(4, "SELECT", "Що з цього означає «ворота»?", [
      { text: "хвіртка", correct: true, audioSrc: "/audio/buryak.mp3", imageSrc: "/hvirtka.png" },
      { text: "хата", correct: false, audioSrc: "/audio/morkva.mp3", imageSrc: "/hata.png" },
      { text: "погрєб", correct: false, audioSrc: "/audio/kapusta.mp3", imageSrc: "/погрєб.png" },
    ]);

    // addChallenge(9, "ASSIST", "Переклади: кулеша", [
    //   { text: "каша з кукурудзяного борошна", correct: true, audioSrc: "/audio/kulesha.mp3" },
    //   { text: "борщ", correct: false, audioSrc: "/audio/borsh.mp3" },
    //   { text: "сир", correct: false, audioSrc: "/audio/syr.mp3" },
    // ]);

    addChallenge(4, "SELECT", "Що з цього означає «селище»?", [
      { text: "поляна", correct: false, audioSrc: "/audio/varenyky.mp3", imageSrc: "/images/varenyky.png" },
      { text: "посьолок", correct: true, audioSrc: "/audio/syrnyky.mp3", imageSrc: "/images/syrnyky.png" },
      { text: "двір", correct: false, audioSrc: "/audio/galushky.mp3", imageSrc: "/images/galushky.png" },
    ]);

    // addChallenge(9, "LISTEN", "Обери слово хліб", [
    //   { text: "хліб", correct: true, audioSrc: "/audio/hlib.mp3" },
    //   { text: "булочка", correct: false, audioSrc: "/audio/bulochka.mp3" },
    //   { text: "паляниця", correct: false, audioSrc: "/audio/palyanytsya.mp3" },
    // ]);

    addChallenge(4, "WRITE", "Зайди через ….", [
      { text: "хвіртку", correct: true },
    ]);


    addChallenge(5, "SELECT", "Що з цього означає «місце біля печі»?", [
      { text: "припічок", correct: false, audioSrc: "/audio/hovoryty.mp3", imageSrc: "/kamin.png" },
      { text: "куфер", correct: true, audioSrc: "/audio/tovkty.mp3", imageSrc: "/kufer.png" },
      { text: "хата", correct: false, audioSrc: "/audio/zhartuvaty.mp3", imageSrc: "/hata.png" },
    ]);

    addChallenge(5, "SELECT", "Що з цього означає «пам’ятник»?", [
      { text: "припічок", correct: false, audioSrc: "/audio/gutority.mp3", imageSrc: "/gutority.png" },
      { text: "порєдок", correct: false, audioSrc: "/audio/spivaty.mp3", imageSrc: "/images/spivaty.png" },
      { text: "прип’ятник", correct: true, audioSrc: "/audio/hovoryty.mp3", imageSrc: "/images/hovoryty.png" },
    ]);

    // addChallenge(10, "ASSIST", "Переклади: гуторка", [
    //   { text: "розмова", correct: true, audioSrc: "/audio/rozmova.mp3" },
    //   { text: "спів", correct: false, audioSrc: "/audio/spiv.mp3" },
    //   { text: "сварка", correct: false, audioSrc: "/audio/svarka.mp3" },
    // ]);

    // addChallenge(10, "LISTEN", "Прослухай і вибери слово «ходити»", [
    //   { text: "іти", correct: true, audioSrc: "/audio/ity.mp3" },
    //   { text: "йти", correct: false, audioSrc: "/audio/yty.mp3" },
    //   { text: "ходь", correct: false, audioSrc: "/audio/khod.mp3" },
    // ]);

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
    addSWChallenge(6, "SELECT", "Що з цього означає «хазяїн»?", [
      { text: "ґазда", correct: true, imageSrc: "/gazda.png" },
      { text: "леґінь", correct: false, imageSrc: "/legin.png" },
      { text: "пляц", correct: false, imageSrc: "/plats.png" },
    ]);
     addSWChallenge(6, "SELECT", "Що з цього означає «гарний»?", [
      { text: "файний", correct: true, audioSrc: "/audio/hozhar.mp3" },
      { text: "бляшняр", correct: false, audioSrc: "/audio/selyanyn.mp3" },
      { text: "кептар", correct: false, audioSrc: "/audio/drug.mp3" },
    ]);
//     addSWChallenge(11, "ASSIST", "Напиши переклад слова «баняк»", [
//       { text: "каструля", correct: true, audioSrc: "/audio/kastrulya.mp3", imageSrc: "/images/kastrulya.png" },
//       { text: "відро", correct: false, audioSrc: "/audio/vidro.mp3", imageSrc: "/images/vidro.png" },
//     ]);  
//     addSWChallenge(11, "ASSIST", "Напиши переклад слова «баняк»", [
//   { text: "каструля", correct: true, audioSrc: "/audio/kastrulya.mp3" },
//   { text: "відро", correct: false, audioSrc: "/audio/vidro.mp3" },
// ]);

  // addSWChallenge(11, "LISTEN", "Прослухай і вибери правильну вимову слова «ґринджоли»", [
  //   { text: "ґринджоли", correct: true, audioSrc: "/audio/gryndzholy.mp3" },
  //   { text: "гринджоли", correct: false, audioSrc: "/audio/hrindzholy.mp3" },
  // ]);
  addSWChallenge(6, "WRITE", "Той … має велику хату.", [{ text: "ґазда", correct: true }]);

addSWChallenge(7, "SELECT", "Що з цього означає «підлога»?", [
  { text: "плєцак", correct: false, audioSrc: "/audio/pagorb.mp3", imageSrc: "/pletsek.png" },
  { text: "леванда", correct: true, audioSrc: "/audio/boloto.mp3", imageSrc: "/levanda.png" },
  { text: "пляц", correct: false, audioSrc: "/audio/rivnyna.mp3", imageSrc: "/plats.png" },
]);
addSWChallenge(7, "SELECT", "Що з цього означає «рюкзак»?", [
  { text: "ліжник", correct: false, audioSrc: "/audio/pagorb.mp3", imageSrc: "/images/pagorb.png" },
  { text: "кептар", correct: false, audioSrc: "/audio/boloto.mp3", imageSrc: "/images/boloto.png" },
  { text: "плєцак", correct: true, audioSrc: "/audio/rivnyna.mp3", imageSrc: "/images/rivnyna.png" },
]);


// addSWChallenge(7, "ASSIST", "Переклади слово «гутірка»", [
//   { text: "розмова", correct: true, audioSrc: "/audio/rozmova.mp3" },
//   { text: "пісня", correct: false, audioSrc: "/audio/pisnya.mp3" },
//   { text: "прогулянка", correct: false, audioSrc: "/audio/progulyanka.mp3" },
// ]);

// addSWChallenge(7, "LISTEN", "Прослухай слово «муркотіти»", [
//   { text: "вуркотати", correct: true, audioSrc: "/audio/vurkotaty.mp3" },
//   { text: "мурчати", correct: false, audioSrc: "/audio/murchaty.mp3" },
// ]);

addSWChallenge(7, "WRITE", "Постав відро на ….", [{ text: "леванду", correct: true }]);

addSWChallenge(8, "SELECT", "Що з цього означає «рушниця»?", [
  { text: "гвер", correct: true, audioSrc: "/audio/shafa_posud.mp3", imageSrc: "/rushnyca.png" },
  { text: "пляц", correct: false, imageSrc: "/plats.png" },
  { text: "кептар", correct: false, audioSrc: "/audio/stilets.mp3", imageSrc: "/keptar.png" },
]);
addSWChallenge(8, "SELECT", "Що з цього означає «ділянка землі»?", [
  { text: "файний", correct: false, audioSrc: "/audio/shafa_posud.mp3", imageSrc: "/images/shafa_posud.png" },
  { text: "пляц", correct: true, audioSrc: "/audio/stil.mp3", imageSrc: "/images/stil.png" },
  { text: "бляшняр", correct: false, audioSrc: "/audio/stilets.mp3", imageSrc: "/images/stilets.png" },
]);

// addSWChallenge(8, "ASSIST", "Переклади слово «покуть»", [
//   { text: "кут хати", correct: true, audioSrc: "/audio/kut_haty.mp3" },
//   { text: "вікно", correct: false, audioSrc: "/audio/vikno.mp3" },
// ]);

// addSWChallenge(8, "LISTEN", "Прослухай слово «припічок»", [
//   { text: "місце біля печі", correct: true, audioSrc: "/audio/prypichok.mp3" },
// ]);

addSWChallenge(8, "WRITE", "На … ростуть яблуні.", [{ text: "пляці", correct: true }]);

addSWChallenge(9, "SELECT", "Що з цього означає «солодка страва»?", [
  { text: "ліжник", correct: false, audioSrc: "/audio/kulesha.mp3", imageSrc: "/lizhnyk.png" },
  { text: "ґринджоли", correct: false, audioSrc: "/audio/borshch.mp3", imageSrc: "/images/borshch.png" },
  { text: "ліґуміна", correct: true, audioSrc: "/audio/syr.mp3", imageSrc: "/images/syr.png" },
]);
addSWChallenge(9, "SELECT", "Що з цього означає «санчата»?", [
  { text: "ґринджоли", correct: true, audioSrc: "/audio/kulesha.mp3", imageSrc: "/gryndzholy.png" },
  { text: "кептар", correct: false, audioSrc: "/audio/borshch.mp3", imageSrc: "/keptar.png" },
  { text: "ґазда", correct: false, audioSrc: "/audio/syr.mp3", imageSrc: "/gazda.png" },
]);

// addSWChallenge(9, "ASSIST", "Переклади слово «бурак»", [
//   { text: "буряк", correct: true, audioSrc: "/audio/buryak.mp3" },
//   { text: "морква", correct: false, audioSrc: "/audio/morkva.mp3" },
// ]);

// addSWChallenge(9, "LISTEN", "Прослухай і вибери слово «вареники»", [
//   { text: "лєпка", correct: true, audioSrc: "/audio/lepkа.mp3" },
//   { text: "галушки", correct: false, audioSrc: "/audio/galushky.mp3" },
// ]);

addSWChallenge(9, "WRITE", "Діти каталися на ….", [{ text: "ґринджолах", correct: true }]);

addSWChallenge(10, "SELECT", "Що з цього означає «прядиво, волокно»?", [
  { text: "гвер", correct: false, audioSrc: "/audio/gutoryty.mp3", imageSrc: "/ryshnyca.png" },
  { text: "кептар", correct: false, audioSrc: "/audio/spivaty.mp3", imageSrc: "/keptar.png" },
  { text: "кужіль", correct: true, audioSrc: "/audio/zhartuvaty.mp3", imageSrc: "/kuzhil.png" },
]);

addSWChallenge(10, "SELECT", "Що з цього означає «увага»?", [
  { text: "файний", correct: false, audioSrc: "/audio/gutoryty.mp3", imageSrc: "/rozmova.png" },
  { text: "позір", correct: true, audioSrc: "/audio/spivaty.mp3", imageSrc: "/images/spivaty.png" },
  { text: "пляц", correct: false, audioSrc: "/audio/zhartuvaty.mp3", imageSrc: "/images/zhartuvaty.png" },
]);
// addSWChallenge(10, "ASSIST", "Переклади слово «молоти»", [
//   { text: "товкти", correct: true, audioSrc: "/audio/tovkty.mp3" },
//   { text: "говорити", correct: false, audioSrc: "/audio/hovoryty.mp3" },
// ]);

// addSWChallenge(10, "LISTEN", "Прослухай і вибери слово «іти»", [
//   { text: "ходити", correct: true, audioSrc: "/audio/ity.mp3" },
//   { text: "стояти", correct: false, audioSrc: "/audio/stoyaty.mp3" },
// ]);

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
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = easternId++;
  easternChallenges.push({ id: chId, lessonId, type, order: chId, question });

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
addEastern(11, "SELECT", "Що з цього означає «віз для сіна»?", [
  { text: "поребрик", correct: false },
  { text: "мажара", correct: true, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "кібитка", correct: false },
]);



addEastern(11, "WRITE", "Селяни везли сіно на ….", [
  { text: "мажарі", correct: true },

]);

addEastern(12, "SELECT", "Що з цього означає «бордюр»?", [
  { text: "поребрик", correct: true, imageSrc: "/perebryk.png" },
  { text: "кібитка", correct: false, imageSrc: "/кібитка.png" },
  { text: "ненька", correct: false, imageSrc: "/nenika.png" },
]);
addEastern(12, "SELECT", "Що з цього означає «колиска»?", [
  { text: "шаньга", correct: false },
  { text: "ненька", correct: true, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "билиця", correct: false },
]);

addEastern(12, "WRITE", "Мама поклала дитину в ….", [
  { text: "неньку", correct: true },

]);

addEastern(13, "SELECT", "Що з цього означає «блискавка»?", [
  { text: "змійка", correct: true,  imageSrc: "/zmiyka.png"},
  { text: "веселуха", correct: false, imageSrc: "/veseluha.png" },
  { text: "билиця", correct: false, imageSrc: "/bilka.png" },
]);
addEastern(13, "SELECT", "Що з цього означає «райдуга»?", [
  { text: "поребрик", correct: false },
  { text: "ненька", correct: false, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "веселуха", correct: true, imageSrc: "/veseluha.png" },
]);

addEastern(13, "WRITE", "Після дощу з’явилася ….", [
  { text: "веселуха", correct: true },
]);

addEastern(14, "SELECT", "Що з цього означає «будь-яке збіжжя»?", [
  { text: "пшінка", correct: false },
  { text: "жито", correct: true, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "байрак", correct: false },
]);
addEastern(14, "SELECT", "Що з цього означає «яр, балка»?", [
  { text: "байрак", correct: true },
  { text: "кібитка", correct: false, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "поребрик", correct: false },
]);

addEastern(14, "WRITE", "Внизу під селом був глибокий ….", [
  { text: "байрак", correct: true },

]);

addEastern(15, "SELECT", "Що з цього означає «світло, райдуга»?", [
  { text: "билиця", correct: false },
  { text: "веселуха", correct: true, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "поребрик", correct: false },
]);
addEastern(15, "SELECT", "Що з цього означає «баклажани»?", [
  { text: "пшонка", correct: false },
  { text: "синеньки", correct: true, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "шаньга", correct: false },
]);

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
addPlatt(16, "SELECT", "Що означає слово 'ik'?", [
  { text: "ти", correct: false },
  { text: "я", correct: true, audioSrc: "/audio/ik_heww_dat_nich_verstahn.mp3" },
  { text: "він", correct: false },
]);

addPlatt(16, "ASSIST", "Як перекладається 'maken' стандартною німецькою?", [
  { text: "singen", correct: false },
  { text: "tun", correct: false, audioSrc: "/audio/dat_is_mien_huus.mp3" },
   { text: "machen", correct: true, audioSrc: "/audio/dat_is_mien_huus.mp3" },
]);

addPlatt(16, "WRITE", "Ik heww dat nich …", [
  { text: "verstahn", correct: true },
]);

addPlatt(17, "SELECT", "Що означає слово 'Bröödt'?", [
  { text: "хліб", correct: true },
  { text: "вода", correct: false, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "дім", correct: false },
]);
addPlatt(17, "SELECT", "Що означає привітання 'Moin!'?", [
  { text: "Прощавай", correct: false },
  { text: "Доброго ранку", correct: true, audioSrc: "/audio/dat_is_een_broodt.mp3" },
  { text: "Як справи", correct: false },
]);



addPlatt(17, "WRITE", "Dat is een … ", [
  { text: "bröödt", correct: true },

]);
addPlatt(18, "SELECT", "Що означає 'Vadder' у Plattdeutsch?", [
  { text: "Дідусь", correct: false},
  { text: "Батько", correct: true },
  { text: "Друг", correct: false },
]);

addPlatt(18, "SELECT", "У якому варіанті слово відповідає стандартному 'Kind'?", [
  { text: "Keind", correct: false},
  { text: "Kinner", correct: true},
  { text: "Ken", correct: false},
]);



addPlatt(18, "WRITE", "Wo is dien …?", [
  { text: "vadder", correct: true },
]);
addPlatt(19, "SELECT", "Що означає фраза 'Dat is mien Huus'?", [
      { text: "Це мій дім", correct: true, audioSrc: "/audio/faynyy.mp3" },
      { text: "Там моя школа", correct: false, audioSrc: "/audio/zlyy.mp3" },
      { text: "Де твій дім?", correct: false, audioSrc: "/audio/malenkyy.mp3" },
    ]);
addPlatt(19, "SELECT", "Що означає фраза 'Ik heww keen Tied'?", [
      { text: "У мене є час", correct: false, audioSrc: "/audio/hozhar.mp3" },
      { text: "У мене немає часу", correct: true, audioSrc: "/audio/selyanyn.mp3" },
      { text: "Ти маєш час", correct: false, audioSrc: "/audio/drug.mp3" },
    ]);
addPlatt(19, "WRITE", " Ik heww keen …", [{ text: "tied", correct: true }]);


addPlatt(20, "SELECT", "Що означає речення 'Ik heww dat nich verstahn'?", [
      { text: "Я не зрозумів це", correct: true, audioSrc: "/audio/faynyy.mp3" },
      { text: "Я маю час", correct: false, audioSrc: "/audio/zlyy.mp3" },
      { text: "Це мій дім", correct: false, audioSrc: "/audio/malenkyy.mp3" },
    ]);
addPlatt(20, "SELECT", "Як Plattdeutsch вплинув на стандартну німецьку мову?", [
      { text: "Він є її основою", correct: false, audioSrc: "/audio/hozhar.mp3" },
      { text: "Його фонетика збереглася у північних регіонах", correct: true, audioSrc: "/audio/selyanyn.mp3" },
      { text: "Він виник у Швейцарії", correct: false, audioSrc: "/audio/drug.mp3" },
    ]);
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
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = middleId++;
  middleChallenges.push({ id: chId, lessonId, type, order: chId, question });

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

addMiddlet(21, "SELECT", "Що типово для Mitteldeutsch на фонетичному рівні?", [
  { text: "Вимова з “pf”", correct: false },
  { text: "Збалансована, проміжна фонетика", correct: true },
  { text: "Чергування t → z", correct: false },
]);


addMiddlet(21, "WRITE", "Isch hab ken … ", [
  { text: "zeit", correct: true },
]);

addMiddlet(22, "SELECT", "Що означає 'Mädsche' у гессенському варіанті?", [
  { text: "Хлопець", correct: false },
  { text: "Дівчина", correct: true },
  { text: "Мама", correct: false },
]);

addMiddlet(22, "SELECT", "Який з цих діалектів може вживати 'wie' замість 'als'?", [
  { text: "Гессенський", correct: true },
  { text: "Швабський", correct: false },
  { text: "Баварський", correct: false },
]);

addMiddlet(22, "WRITE", "Des is mei …", [
  { text: "mädsche", correct: true },
]);

addMiddlet(23, "SELECT", "Що означає фраза 'Isch hab ken Zeit'?", [
  { text: "У мене є час", correct: false },
  { text: "У мене немає часу", correct: true },
  { text: "У тебе є час", correct: false },
]);

addMiddlet(23, "SELECT", "Яка особливість у слові 'isch' (замість ich)?", [
  { text: "Південний варіант", correct: false },
  { text: "Типова заміна 'ch' на 'sch'", correct: true },
  { text: "Архаїзм", correct: false },
]);

addMiddlet(23, "WRITE", "Isch hab ken … ", [
  { text: "zeit", correct: true },
]);

addMiddlet(24, "SELECT", "Що означає “Schaffe” у контексті «beim Daimler schaffe»?", [
  { text: "Їсти", correct: false },
  { text: "Працювати", correct: true },
  { text: "Ламати", correct: false },
]);

addMiddlet(24, "SELECT", "Яке слово у Mitteldeutsch є заміною до 'ein bisschen'?", [
  { text: "a bissle", correct: false },
  { text: "a weng", correct: false },
  { text: "e wänschje", correct: true },
]);
addMiddlet(24, "WRITE", "Ich muss viel …", [
  { text: "schaffe", correct: true },
]);


addMiddlet(25, "SELECT", "Що означає “Gude!”?", [
  { text: "Прощання", correct: false },
  { text: "Дякую", correct: false },
  { text: "Привітання", correct: true },
  { text: "Погодження", correct: false },
]);

addMiddlet(25, "SELECT", "Яке з цих тверджень вірне щодо Mitteldeutsch?", [
  { text: "Має найменше діалектів", correct: false },
  { text: "Лежить між північчю і півднем", correct: true },
  { text: "Використовується лише в Австрії", correct: false },
]);
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
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = oberId++;
  oberChallenges.push({ id: chId, lessonId, type, order: chId, question });

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
  { text: "Дякую", correct: false },
  { text: "Побачимось", correct: false },
  { text: "привіт", correct: true },
]);
addOber(26, "SELECT", "Як буде 'картопля' у баварському варіанті?", [
  { text: "Kartoffel", correct: false },
  { text: "Erdbirn", correct: false },
  { text: "Erdäpfel", correct: true },
]);
addMiddlet(26, "WRITE", "… di! Wie geht’s?", [
  { text: "Griaß", correct: true },
]);

addOber(27, "SELECT", "Що означає 'Gwand' у баварському діалекті?", [
  { text: "Їжа", correct: false },
  { text: "Одяг", correct: true },
  { text: "Гроші", correct: false },
]);
addOber(27, "SELECT", "Яке з цих дієслів частіше вживається в Perfekt, а не в Präteritum у південних діалектах?", [
  { text: "haben", correct: false },
  { text: "sagen", correct: true },
  { text: "sein", correct: false },
]);
addMiddlet(27, "WRITE", "Des is mei …", [
  { text: "Gwand", correct: true },
]);

addOber(28, "SELECT", "Фраза “i hob koa Zeit” перекладається як", [
  { text: "У тебе є час", correct: false },
  { text: "Я не маю часу", correct: true },
  { text: "Я хочу час", correct: false },
]);
addOber(28, "SELECT", "Яке з цих слів є швабським варіантом “дівчина”?", [
  { text: "Mädel", correct: false },
  { text: "Mädele", correct: true },
  { text: "Möd", correct: false },
]);
addMiddlet(28, "WRITE", "I hob koa …", [
  { text: "zeit", correct: true },
]);

addOber(29, "SELECT", "Що означає “Bua” в баварському діалекті?", [
  { text: "Пес", correct: false },
  { text: "Хлопець", correct: true },
  { text: "Вино", correct: false },
]);
addOber(29, "SELECT", "Яка фонетична зміна притаманна Oberdeutsch?", [
  { text: "t → z", correct: true },
  { text: "ch → k", correct: false },
  { text: "r → ø", correct: false },
]);
addMiddlet(29, "WRITE", "Da … spielt draußen", [
  { text: "bua", correct: true },
]);

addOber(30, "SELECT", "'Da Voda is im Haus' — переклади", [
  { text: "Батько пішов", correct: false },
  { text: "Батько в домі", correct: true },
  { text: "Дім новий", correct: false },
]);
addOber(30, "SELECT", "Який з варіантів є прикладом вокалізації r у баварській мові?", [
  { text: "Vater → Vatter", correct: false },
  { text: "Vater → Foda", correct: true },
  { text: "Vater → Vadder", correct: false },
]);
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
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = cockneyId++;
  cockneyChallenges.push({ id: chId, lessonId, type, order: chId, question });

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
addCockney(31, "SELECT", "Що з цього означає «голова»?", [
  { text: "loaf of bread", correct: true },
  { text: "dog and bone", correct: false },
  { text: "bottle and stopper", correct: false },
]);
addCockney(31, "WRITE", "I don’t have any … to buy you this", [
  { text: "bees and honey", correct: true },
]);

addCockney(32, "SELECT", "Що означає 'Gwand' у баварському діалекті?", [
  { text: "Їжа", correct: false },
  { text: "Одяг", correct: true },
  { text: "Гроші", correct: false },
]);
addCockney(32, "SELECT", "Що з цього означає «друг»?", [
  { text: "loaf of bread", correct: false },
  { text: "bees and honey", correct: false },
  { text: "china plate", correct: true },
]);
addCockney(32, "WRITE", "Go up the … and you’ll see the bathroom", [
  { text: "apples and pears", correct: true },
]);

addCockney(33, "SELECT", "Що з цього означає «волосся»?", [
  { text: "barnet (fair)", correct: true },
  { text: "trouble and strife", correct: false },
  { text: "china plate", correct: false },
]);
addCockney(33, "SELECT", "Що з цього означає «поліцейський»?", [
  { text: "rosie lee", correct: false },
  { text: "butcher’s hook", correct: false },
  { text: "bottle and stopper", correct: true },
]);
addCockney(33, "WRITE", "Watch out, the … is about! ", [
  { text: "bottle and stopper", correct: true },
]);

addCockney(34, "SELECT", "Що з цього означає «украсти»?", [
  { text: "loaf of bread", correct: false },
  { text: "half-inch", correct: true },
  { text: "bees and honey", correct: false },
]);
addCockney(34, "SELECT", "Що з цього означає «дружина»?", [
  { text: "rosie lee", correct: false },
  { text: "china plate", correct: false },
  { text: "trouble and strife", correct: true },
]);
addCockney(34, "WRITE", "My … is waiting for me at home", [
  { text: "trouble and strife", correct: true },
]);

addCockney(35, "SELECT", "Що з цього означає «подив/погляд»?", [
  { text: "butcher’s hook", correct: true },
  { text: "china plate", correct: false },
  { text: "apples and pears", correct: false },
]);
addCockney(35, "SELECT", "2)	Що з цього означає «чай»?", [
  { text: "bees and honey", correct: false },
  { text: "rosie lee", correct: true },
  { text: "half-inch", correct: false },
]);
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
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = scouseId++;
  scouseChallenges.push({ id: chId, lessonId, type, order: chId, question });

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
addScouse(36, "SELECT", "Що з цього означає «штани»?", [
  { text: "scran", correct: false },
  { text: "kecks", correct: true },
  { text: "jarg", correct: false },
]);
addScouse(36, "WRITE", "I’m starving, let’s grab some … before we go out", [
  { text: "scran", correct: true },
]);

addScouse(37, "SELECT", "Що з цього означає «не місцевий/чужак»?", [
  { text: "wool", correct: true },
  { text: "jarg", correct: false },
  { text: "la/lad", correct: false },
]);
addScouse(37, "SELECT", "Що з цього означає «фальшивий/підробка»?", [
  { text: "boss", correct: false },
  { text: "jarg", correct: true },
  { text: "div", correct: false },
]);
addScouse(37, "WRITE", "That … just moved here last week, he doesn’t know the city.", [
  { text: "wool", correct: true },
]);

addScouse(38, "SELECT", "Що з цього означає «голова»?", [
  { text: "lid", correct: true },
  { text: "bevvy", correct: false },
  { text: "div", correct: false },
]);
addScouse(38, "SELECT", "Що з цього означає «друг/товариш»?", [
  { text: "la/lad", correct: true },
  { text: "liddo/little one", correct: false },
  { text: "boss", correct: false },
]);
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
addScouse(39, "SELECT", "Що з цього означає «дитина»?", [
  { text: "liddo/little one", correct: true },
  { text: "la/lad", correct: false },
  { text: "scran", correct: false },
]);
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
addScouse(40, "SELECT", "Що з цього означає «гарний/чудовий»?", [
  { text: "div", correct: false },
  { text: "boss", correct: true },
  { text: "jarg", correct: false },
]);
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
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = geordieId++;
  geordieChallenges.push({ id: chId, lessonId, type, order: chId, question });

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
addGeordie(41, "SELECT", "Що з цього означає «друг»?", [
  { text: "marra", correct: true },
  { text: "gadgie", correct: false },
  { text: "nappa", correct: false },
]);
addGeordie(41, "WRITE", "He’s my … from school", [
  { text: "marra", correct: true },
]);

addGeordie(42, "SELECT", "Що з цього означає «голова»?", [
  { text: "nappa", correct: true },
  { text: "toon", correct: false },
  { text: "clart", correct: false },
]);
addGeordie(42, "SELECT", "Що з цього означає «дитина»?", [
  { text: "gadgie", correct: false },
  { text: "bairn", correct: true },
  { text: "radgie", correct: false },
]);
addGeordie(42, "WRITE", "Use your … and think before you speak! ", [
  { text: "nappa", correct: true },
]);

addGeordie(43, "SELECT", "Що з цього означає «бруд»?", [
  { text: "gadgie", correct: false },
  { text: "clart", correct: true },
  { text: "radgie", correct: false },
]);
addGeordie(43, "SELECT", "Що з цього означає «місто (особливо Ньюкасл)»?", [
  { text: "toon", correct: true },
  { text: "clart", correct: false },
  { text: "gansey", correct: false },
]);
addGeordie(43, "WRITE", "You’ve got … all over your boots", [
  { text: "clart", correct: true },
]);

addGeordie(44, "SELECT", "Що з цього означає «чоловік»?", [
  { text: "gadgie", correct: true },
  { text: "nappa", correct: false },
  { text: "spuggy", correct: false },
]);
addGeordie(44, "SELECT", "Що з цього означає «светр»?", [
  { text: "toon", correct: false },
  { text: "gansey", correct: true },
  { text: "bairn", correct: false },
]);
addGeordie(44, "WRITE", "He’s wearing his new … today", [
  { text: "gansey", correct: true },
]);

addGeordie(45, "SELECT", "Що з цього означає «сердитий»?", [
  { text: "radgie", correct: true },
  { text: "spuggy", correct: false },
  { text: "toon", correct: false },
]);
addGeordie(45, "SELECT", "Що з цього означає «горобець»?", [
  { text: "spuggy", correct: true },
  { text: "bairn", correct: false },
  { text: "gadgie", correct: false },
]);
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
  answers: { text: string; correct: boolean; audioSrc?: string; imageSrc?: string }[]
) => {
  const chId = yorkId++;
  yorkChallenges.push({ id: chId, lessonId, type, order: chId, question });

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
addYork(46, "SELECT", "Що з цього означає «кошик»?", [
  { text: "pannier", correct: true },
  { text: "garth", correct: false },
  { text: "kist", correct: false },
]);
addYork(46, "WRITE", "ut the apples in the … before you carry them.", [
  { text: "pannier", correct: true },
]);

addYork(47, "SELECT", "Що з цього означає «сад/двір»?", [
  { text: "garth", correct: true },
  { text: "ginnel", correct: false },
  { text: "beck", correct: false },
]);
addYork(47, "SELECT", "Що з цього означає «коробка/скриня»?", [
  { text: "kist", correct: true },
  { text: "croft", correct: false },
  { text: "staithe", correct: false },
]);
addYork(47, "WRITE", "Fetch that … from the loft", [
  { text: "kist", correct: true },
]);

addYork(48, "SELECT", "Що з цього означає «невеликий потік/струмок»?", [
  { text: "staithe", correct: false },
  { text: "neddy", correct: false },
  { text: "beck", correct: true },
]);
addYork(48, "SELECT", "Що з цього означає «невелика ферма/земельна ділянка»?", [
  { text: "croft", correct: true },
  { text: "cuddy", correct: false },
  { text: "garth", correct: false },
]);
addYork(48, "WRITE", "The … runs behind the cottages", [
  { text: "beck", correct: true },
]);

addYork(49, "SELECT", "Що з цього означає «гавань/причал»?", [
  { text: "staithe", correct: true },
  { text: "ginnel", correct: false },
  { text: "cuddy", correct: false },
]);
addYork(49, "SELECT", "Що з цього означає «вузький прохід/провулок»?", [
  { text: "pannier", correct: false },
  { text: "croft", correct: false },
  { text: "ginnel", correct: true },
]);
addYork(49, "WRITE", "She went down the … behind the shop", [
  { text: "ginnel", correct: true },
]);

addYork(50, "SELECT", "Що з цього означає «вівця»?", [
  { text: "yow", correct: true },
  { text: "cuddy", correct: false },
  { text: "beck", correct: false },
]);
addYork(50, "SELECT", "Що з цього означає «кінь»?", [
  { text: "croft", correct: false },
  { text: "pannier", correct: false },
  { text: "neddy", correct: true },
]);
addYork(50, "WRITE", "The … were grazing peacefully in the field", [
  { text: "yow", correct: true },
]);
  
// ✅ Вставка в базу
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



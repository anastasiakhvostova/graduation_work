import UnitBannerClient from "./unit-banner-client";

type Props = {
  title: string;
  description: string;
};

export const UnitBanner = (props: Props) => {
  return <UnitBannerClient {...props} />;
};

//  id: 10,
//     regionId: 16,
//     title: {
//       ua: "Додаток",
//       en: "Appendix",
//       de: "Anhang",
//     },
//     description: {
//       ua: "Перед тим, як практикуватися, радимо прочитати навчальні матеріали",
//       en: "Before practicing, we recommend reading the learning materials",
//       de: "Bevor Sie üben, empfehlen wir, die Lernmaterialien zu lesen",
//     },
//     order: 1,
import type { HomeCmsData, HomeSectionConfig, HeroSlide } from "@/types/cms";

export const defaultHomeSections: HomeSectionConfig[] = [
  { id: "hero", label: "FV / Hero", isVisible: true },
  { id: "fukuIcons", label: "FUKU ICONS", isVisible: true },
  { id: "ranking", label: "FUKUOKA RANKING", isVisible: true },
  { id: "weekendGuide", label: "WEEKEND GUIDE", isVisible: true },
  { id: "newInFukuoka", label: "NEW IN FUKUOKA", isVisible: true },
  { id: "magazine", label: "MAGAZINE", isVisible: true },
  { id: "pickupContents", label: "PICK UP CONTENTS", isVisible: true },
];

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    label: "特集",
    title: "いま福岡で、\n会いたい人と店。",
    subtitle: "気になるあの人、行きつけのあの店。\n福岡の“いま”をつなげる。",
    image: "/images/hero.jpg",
    ctaText: "最新ランキングを見る",
    ctaHref: "/ranking",
    overlayColor: "rgba(17,17,17,0.72)",
    textColor: "#ffffff",
    buttonColor: "#e52421",
    buttonTextColor: "#ffffff",
    titleFontSize: "lg",
    subtitleFontSize: "md",
    align: "left",
    isVisible: true,
    backgroundColor: "#111111",
    cornerRadius: "medium",
    spacing: "standard",
  },
  {
    id: "hero-2",
    label: "WEEKEND",
    title: "今週末、\nどこ行く？",
    subtitle: "カフェ、居酒屋、イベントまで。福岡の週末を探す。",
    image: "/images/weekend/ramen-main.jpg",
    ctaText: "WEEKEND GUIDEを見る",
    ctaHref: "/weekend/ramen",
    overlayColor: "rgba(17,17,17,0.68)",
    textColor: "#ffffff",
    buttonColor: "#e52421",
    buttonTextColor: "#ffffff",
    titleFontSize: "lg",
    subtitleFontSize: "md",
    align: "left",
    isVisible: true,
    backgroundColor: "#111111",
    cornerRadius: "medium",
    spacing: "standard",
  },
  {
    id: "hero-3",
    label: "ICONS",
    title: "福岡をつくる、\n注目の人。",
    subtitle: "モデル、美容師、DJ、クリエイターを見つける。",
    image: "/images/icons/yui.jpg",
    ctaText: "FUKU ICONSを見る",
    ctaHref: "/icons",
    overlayColor: "rgba(17,17,17,0.70)",
    textColor: "#ffffff",
    buttonColor: "#e52421",
    buttonTextColor: "#ffffff",
    titleFontSize: "lg",
    subtitleFontSize: "md",
    align: "left",
    isVisible: true,
    backgroundColor: "#111111",
    cornerRadius: "medium",
    spacing: "standard",
  },
  {
    id: "hero-4",
    label: "RANKING",
    title: "みんなの“好き”で、\n福岡が動く。",
    subtitle: "好きなスーパー、駅、街、店を投票で決める。",
    image: "/images/ranking/super-bonrepas.jpg",
    ctaText: "投票する",
    ctaHref: "/ranking?mode=vote",
    overlayColor: "rgba(17,17,17,0.70)",
    textColor: "#ffffff",
    buttonColor: "#e52421",
    buttonTextColor: "#ffffff",
    titleFontSize: "lg",
    subtitleFontSize: "md",
    align: "left",
    isVisible: true,
    backgroundColor: "#111111",
    cornerRadius: "medium",
    spacing: "standard",
  },
  {
    id: "hero-5",
    label: "MAGAZINE",
    title: "福岡の空気を、\nWebと紙で残す。",
    subtitle: "FUKU-MEETS MAGAZINE 最新号をチェック。",
    image: "/images/paper-cover.jpg",
    ctaText: "最新号を見る",
    ctaHref: "/magazine/latest",
    overlayColor: "rgba(17,17,17,0.72)",
    textColor: "#ffffff",
    buttonColor: "#e52421",
    buttonTextColor: "#ffffff",
    titleFontSize: "lg",
    subtitleFontSize: "md",
    align: "left",
    isVisible: true,
    backgroundColor: "#111111",
    cornerRadius: "medium",
    spacing: "standard",
  },
];

export const defaultHomeCmsData: HomeCmsData = {
  hero: {
    slides: defaultHeroSlides,
    autoplay: true,
    intervalMs: 4500,
    height: "standard",
    isVisible: true,
  },
  sections: defaultHomeSections,
};

export function mergeHomeCmsData(input?: Partial<HomeCmsData> | null): HomeCmsData {
  if (!input) return defaultHomeCmsData;
  const savedSlides = input.hero?.slides ?? [];
  const slides = defaultHeroSlides.map((defaultSlide, index) => ({ ...defaultSlide, ...(savedSlides[index] ?? {}) }));
  const savedSections = input.sections ?? [];
  const sections = savedSections.length
    ? savedSections.map((section) => ({ ...defaultHomeSections.find((item) => item.id === section.id), ...section })) as HomeSectionConfig[]
    : defaultHomeSections;
  const missingSections = defaultHomeSections.filter((section) => !sections.some((item) => item.id === section.id));

  return {
    hero: {
      ...defaultHomeCmsData.hero,
      ...input.hero,
      slides,
    },
    sections: [...sections, ...missingSections],
    updatedAt: input.updatedAt,
  };
}

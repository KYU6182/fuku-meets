export type HeroSlide = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
  overlayColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  titleFontSize: "sm" | "md" | "lg" | "xl";
  subtitleFontSize: "sm" | "md" | "lg";
  align: "left" | "center";
  isVisible: boolean;
  backgroundColor?: string;
  cornerRadius?: "small" | "medium" | "large";
  spacing?: "compact" | "standard" | "spacious";
};

export type HomeSectionId =
  | "hero"
  | "fukuIcons"
  | "ranking"
  | "weekendGuide"
  | "newInFukuoka"
  | "magazine"
  | "pickupContents";

export type HomeSectionConfig = {
  id: HomeSectionId;
  label: string;
  isVisible: boolean;
};

export type HomeCmsData = {
  hero: {
    slides: HeroSlide[];
    autoplay: boolean;
    intervalMs: number;
    height: "compact" | "standard" | "large";
    isVisible: boolean;
  };
  sections: HomeSectionConfig[];
  updatedAt?: string;
};

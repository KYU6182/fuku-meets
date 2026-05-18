export type CmsImage = {
  id: string;
  url: string;
  name: string;
  alt: string;
  category: "fv" | "banner" | "shop" | "icons" | "news" | "magazine" | "ranking" | "other";
  bucket?: string;
  path?: string;
  createdAt: string;
};

export type CmsPageSlug = "home" | "ranking" | "news" | "icons" | "magazine";
export type CmsStatus = "draft" | "public";

export type CmsPresetStyle = {
  background: "white" | "lightGray" | "beige" | "black";
  accent: "red" | "black";
  headingSize: "md" | "lg" | "xl" | "magazine";
  cardStyle: "default" | "pickup" | "dark" | "compact";
  layout: "single" | "horizontalCards" | "grid" | "magazineList";
  ctaStyle: "redPrimary" | "blackPrimary" | "outline";
};

export type CmsSectionBase = {
  id: string;
  title: string;
  subtitle: string;
  isVisible: boolean;
};

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
  | "tonight"
  | "ranking"
  | "fukuIcons"
  | "localMedia"
  | "startGuide"
  | "safety"
  | "magazine"
  | "followUs";

export type HomeSectionConfig = {
  id: HomeSectionId;
  label: string;
  isVisible: boolean;
};

export type HomeCmsData = {
  hero: {
    id: "hero";
    slides: HeroSlide[];
    autoplay: boolean;
    intervalMs: number;
    height: "compact" | "standard" | "large";
    isVisible: boolean;
  };
  tonight: {
    id: "tonight";
    title: string;
    subtitle: string;
    description: string;
    showNewBadge: boolean;
    categoryIds: string[];
    ctaText: string;
    ctaHref: string;
    isVisible: boolean;
  };
  ranking: {
    id: "ranking";
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    isVisible: boolean;
  };
  fukuIcons: {
    id: "fukuIcons";
    title: string;
    subtitle: string;
    description: string;
    featuredIconIds: string[];
    ctaText: string;
    ctaHref: string;
    isVisible: boolean;
  };
  localMedia: {
    id: "localMedia";
    title: string;
    subtitle: string;
    description: string;
    featuredNewsIds: string[];
    ctaText: string;
    ctaHref: string;
    isVisible: boolean;
  };
  startGuide: {
    id: "startGuide";
    title: string;
    subtitle: string;
    mainCardTitle: string;
    mainCardDescription: string;
    mainCardImage: string;
    ctaText: string;
    ctaHref: string;
    isVisible: boolean;
  };
  safety: {
    id: "safety";
    title: string;
    description: string;
    items: {
      id: string;
      title: string;
      description: string;
      icon: string;
    }[];
    isVisible: boolean;
  };
  magazine: {
    id: "magazine";
    title: string;
    subtitle: string;
    description: string;
    image: string;
    ctaText: string;
    ctaHref: string;
    isVisible: boolean;
  };
  followUs: {
    id: "followUs";
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    isVisible: boolean;
  };
  sectionOrder: HomeSectionId[];
  updatedAt?: string;
  publishedAt?: string;
};

export type RankingCmsData = {
  heroTitle: string;
  heroSubtitle: string;
  defaultTab: string;
  tabs: {
    id: string;
    label: string;
    isVisible: boolean;
  }[];
  featuredThemeIds: string[];
  isVisible: boolean;
  updatedAt?: string;
  publishedAt?: string;
};

export type NewsCmsData = {
  title: string;
  subtitle: string;
  featuredArticleIds: string[];
  categories: string[];
  isVisible: boolean;
  updatedAt?: string;
  publishedAt?: string;
};

export type IconsCmsData = {
  title: string;
  subtitle: string;
  heroDescription: string;
  featuredIconIds: string[];
  coverRankingTitle: string;
  entryCtaText: string;
  recommendCtaText: string;
  isVisible: boolean;
  updatedAt?: string;
  publishedAt?: string;
};

export type MagazineCmsData = {
  title: string;
  subtitle: string;
  coverImage: string;
  latestIssueTitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  isVisible: boolean;
  updatedAt?: string;
  publishedAt?: string;
};

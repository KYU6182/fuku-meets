import { storageKeys } from "@/lib/storageKeys";
import type {
  CmsImage,
  HomeCmsData,
  HomeSectionConfig,
  HomeSectionId,
  IconsCmsData,
  MagazineCmsData,
  NewsCmsData,
  RankingCmsData,
  HeroSlide,
} from "@/types/cms";

const sectionLabels: Record<HomeSectionId, string> = {
  hero: "FV / Hero",
  tonight: "TONIGHT IN FUKUOKA",
  ranking: "FUKUOKA RANKING",
  fukuIcons: "FUKU ICONS / PEOPLE",
  localMedia: "LOCAL MEDIA / NEWS",
  startGuide: "START GUIDE",
  safety: "安心・安全",
  magazine: "MAGAZINE",
  followUs: "FOLLOW US",
};

export const defaultSectionOrder: HomeSectionId[] = [
  "hero",
  "tonight",
  "ranking",
  "fukuIcons",
  "localMedia",
  "startGuide",
  "safety",
  "magazine",
  "followUs",
];

export const defaultHomeSections: HomeSectionConfig[] = defaultSectionOrder.map((id) => ({
  id,
  label: sectionLabels[id],
  isVisible: true,
}));

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    label: "MEET",
    title: "福岡の“好き”を見つけて、\nリアルに会いにいく。",
    subtitle: "店、人、街、カルチャーを見つけて、\n参加して、つながろう。",
    image: "/images/hero.jpg",
    ctaText: "今夜のMEETを見る",
    ctaHref: "/meet",
    overlayColor: "rgba(255,255,255,0.78)",
    textColor: "#111111",
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
    label: "TONIGHT",
    title: "今日集まれる\n福岡のコミュニティ。",
    subtitle: "ライブ後、カフェ作業、一人参加OK。\n同じ熱量の人と会いにいく。",
    image: "/images/meet/creep-live.jpg",
    ctaText: "MEETを見る",
    ctaHref: "/meet",
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
    overlayColor: "rgba(17,17,17,0.7)",
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
    subtitle: "ランキングから、次のMEETや特集が生まれる。",
    image: "/images/ranking/super-bonrepas.jpg",
    ctaText: "投票する",
    ctaHref: "/ranking?mode=vote",
    overlayColor: "rgba(17,17,17,0.7)",
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
    label: "VISITOR",
    title: "福岡に来た夜、\nどこ行く？",
    subtitle: "遠征・観光・ひとり旅でも、地元のリアルにつながれる。",
    image: "/images/fukuoka-city.jpg",
    ctaText: "初めての方へ",
    ctaHref: "/start-guide",
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

export function getDefaultHomeCmsData(): HomeCmsData {
  return {
    hero: {
      id: "hero",
      slides: defaultHeroSlides.map((slide) => ({ ...slide })),
      autoplay: true,
      intervalMs: 4500,
      height: "standard",
      isVisible: true,
    },
    tonight: {
      id: "tonight",
      title: "TONIGHT IN FUKUOKA",
      subtitle: "今日の気分や趣味で集まれるコミュニティ。",
      description: "初めてでも安心して参加できます。素敵な出会いを楽しもう。",
      showNewBadge: true,
      categoryIds: ["music", "drink-now", "midnight", "girls", "solo", "visitor", "cafe-work"],
      ctaText: "すべて見る",
      ctaHref: "/meet",
      isVisible: true,
    },
    ranking: {
      id: "ranking",
      title: "FUKUOKA RANKING",
      subtitle: "みんなの“いつもの福岡”ランキング",
      description: "暮らしの中で見つけた、リアルに助かる・通いたくなるお気に入りをシェアしよう。",
      ctaText: "ランキングページへ",
      ctaHref: "/ranking",
      isVisible: true,
    },
    fukuIcons: {
      id: "fukuIcons",
      title: "FUKU ICONS / PEOPLE",
      subtitle: "福岡をつくる、注目の人たち。",
      description: "人からMEETへ、店へ。気になるアイコンの推しをチェック。",
      featuredIconIds: ["yui", "rena", "keita"],
      ctaText: "FUKU ICONSを見る",
      ctaHref: "/icons",
      isVisible: true,
    },
    localMedia: {
      id: "localMedia",
      title: "LOCAL MEDIA / NEWS",
      subtitle: "福岡のカルチャーを、記事で知る。",
      description: "ライブ後の店、街のニュース、遠征ガイドまで。福岡の“いま”を記事でチェック。",
      featuredNewsIds: ["local-news-fukuoka-now", "fukuoka-food-feature", "area-guide-fukuoka"],
      ctaText: "NEWSを見る",
      ctaHref: "/news",
      isVisible: true,
    },
    startGuide: {
      id: "startGuide",
      title: "START GUIDE",
      subtitle: "はじめての福岡、はじめてのFUKU-MEETS。",
      mainCardTitle: "福岡に来た夜、どこ行く？",
      mainCardDescription: "観光・遠征・ひとり旅でも安心。今日参加できるMEETと地元民の推し店をチェック。",
      mainCardImage: "/images/fukuoka-city.jpg",
      ctaText: "VISITOR GUIDEを見る",
      ctaHref: "/visitor",
      isVisible: true,
    },
    safety: {
      id: "safety",
      title: "安心・安全に楽しめる仕組み",
      description: "みんなが気持ちよくつながれる場を守っています。",
      items: [
        { id: "verify", title: "本人確認", description: "参加者の安全性を高めます。", icon: "ShieldCheck" },
        { id: "review", title: "レビュー", description: "参加後の声で安心感を見える化。", icon: "Star" },
        { id: "report", title: "通報・ブロック", description: "迷惑行為にすぐ対応します。", icon: "Siren" },
        { id: "women", title: "女性安心設計", description: "女性限定や男女比を事前に確認。", icon: "Users" },
        { id: "age", title: "20歳以上確認", description: "飲酒を伴うMEETは20歳以上のみ。", icon: "BadgeCheck" },
        { id: "venue", title: "店舗は参加者に共有", description: "詳細は参加者にのみ共有される場合があります。", icon: "MapPin" },
      ],
      isVisible: true,
    },
    magazine: {
      id: "magazine",
      title: "FUKU-MEETS MAGAZINE",
      subtitle: "福岡の空気を、Webと紙で残すローカルマガジン。",
      description: "Web記事、フリーペーパー、設置店舗を通じて、福岡の人・店・街・イベントを特集します。",
      image: "/images/paper-cover.jpg",
      ctaText: "最新号を見る",
      ctaHref: "/magazine",
      isVisible: true,
    },
    followUs: {
      id: "followUs",
      title: "FOLLOW US",
      subtitle: "Instagramで、今夜の福岡をチェック。",
      description: "今日のMEET、ランキング、遠征ガイド、参加レポートを更新中。",
      ctaText: "Instagramを見る",
      ctaHref: "/meet",
      isVisible: true,
    },
    sectionOrder: [...defaultSectionOrder],
  };
}

export const defaultHomeCmsData = getDefaultHomeCmsData();

export function getDefaultRankingCmsData(): RankingCmsData {
  return {
    heroTitle: "FUKUOKA RANKING",
    heroSubtitle: "みんなの“好き”で、福岡のランキングが変わる。",
    defaultTab: "daily",
    tabs: [
      { id: "food", label: "FOOD", isVisible: true },
      { id: "people", label: "PEOPLE", isVisible: true },
      { id: "daily", label: "DAILY", isVisible: true },
      { id: "night", label: "NIGHT", isVisible: true },
      { id: "area", label: "AREA", isVisible: true },
    ],
    featuredThemeIds: ["supermarket", "station", "city", "late-night"],
    isVisible: true,
  };
}

export function getDefaultNewsCmsData(): NewsCmsData {
  return {
    title: "NEWS",
    subtitle: "福岡の“いま”を見逃さない。",
    featuredArticleIds: ["local-news-fukuoka-now", "weekend-event", "new-shop"],
    categories: ["すべて", "ローカルニュース", "イベント", "新店舗", "FUKU ICONS", "グルメ", "カルチャー"],
    isVisible: true,
  };
}

export function getDefaultIconsCmsData(): IconsCmsData {
  return {
    title: "FUKU ICONS",
    subtitle: "福岡をつくる、注目のアイコンたち。",
    heroDescription: "モデル、美容師、DJ、アーティスト、クリエイター。福岡で活動する“気になる人”を見つけて、応援しよう。",
    featuredIconIds: ["yui", "rena", "anna"],
    coverRankingTitle: "COVER RANKING",
    entryCtaText: "一般エントリーする",
    recommendCtaText: "推しを推薦する",
    isVisible: true,
  };
}

export function getDefaultMagazineCmsData(): MagazineCmsData {
  return {
    title: "FUKU-MEETS MAGAZINE",
    subtitle: "福岡の空気を、Webと紙で残すローカルマガジン。",
    coverImage: "/images/paper-cover.jpg",
    latestIssueTitle: "vol.01 福岡のいまを歩く。",
    description: "人、店、まちのこと。この街の“今”を切り取る、FUKU-MEETS最新号ができました。",
    ctaText: "最新号を見る",
    ctaHref: "/magazine/latest",
    isVisible: true,
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function safeRead<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function safeRemove(key: string) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(key);
}

function withTimestamp<T extends { updatedAt?: string }>(data: T): T {
  return { ...data, updatedAt: new Date().toISOString() };
}

function withPublishedTimestamp<T extends { updatedAt?: string; publishedAt?: string }>(data: T): T {
  const now = new Date().toISOString();
  return { ...data, updatedAt: now, publishedAt: now };
}

function normalizeHome(input?: Partial<HomeCmsData> | null): HomeCmsData {
  const defaults = getDefaultHomeCmsData();
  if (!input) return defaults;

  const legacyHomeIds = ["weekendGuide", "newInFukuoka", "pickupContents", "pickupCommunity", "rankingMeet", "visitorGuide", "safetyCommunity"];
  const rawOrder = (input.sectionOrder ?? []).map(String);
  const hasLegacyHomeShape =
    rawOrder.some((id) => legacyHomeIds.includes(id)) ||
    legacyHomeIds.some((id) => Object.prototype.hasOwnProperty.call(input, id));

  if (hasLegacyHomeShape) {
    return {
      ...defaults,
      updatedAt: input.updatedAt,
      publishedAt: input.publishedAt,
    };
  }

  const legacySections = (input as unknown as { sections?: HomeSectionConfig[] }).sections;
  const legacyOrder = legacySections?.map((section) => section.id).filter((id): id is HomeSectionId => defaultSectionOrder.includes(id)) ?? [];
  const sectionOrder = (input.sectionOrder?.length ? input.sectionOrder : legacyOrder.length ? legacyOrder : defaults.sectionOrder)
    .filter((id): id is HomeSectionId => defaultSectionOrder.includes(id));
  const fullOrder = [...sectionOrder, ...defaultSectionOrder.filter((id) => !sectionOrder.includes(id))];

  const visibilityFromLegacy = (id: HomeSectionId) => legacySections?.find((section) => section.id === id)?.isVisible;
  const savedSlides = input.hero?.slides ?? [];
  const slides = defaults.hero.slides.map((slide, index) => ({ ...slide, ...(savedSlides[index] ?? {}) }));

  return {
    ...defaults,
    ...input,
    hero: {
      ...defaults.hero,
      ...input.hero,
      id: "hero",
      isVisible: input.hero?.isVisible ?? visibilityFromLegacy("hero") ?? defaults.hero.isVisible,
      slides,
    },
    tonight: { ...defaults.tonight, ...input.tonight, isVisible: input.tonight?.isVisible ?? visibilityFromLegacy("tonight") ?? defaults.tonight.isVisible },
    ranking: { ...defaults.ranking, ...input.ranking, isVisible: input.ranking?.isVisible ?? visibilityFromLegacy("ranking") ?? defaults.ranking.isVisible },
    fukuIcons: { ...defaults.fukuIcons, ...input.fukuIcons, isVisible: input.fukuIcons?.isVisible ?? visibilityFromLegacy("fukuIcons") ?? defaults.fukuIcons.isVisible },
    localMedia: { ...defaults.localMedia, ...input.localMedia, isVisible: input.localMedia?.isVisible ?? visibilityFromLegacy("localMedia") ?? defaults.localMedia.isVisible },
    startGuide: { ...defaults.startGuide, ...input.startGuide, isVisible: input.startGuide?.isVisible ?? visibilityFromLegacy("startGuide") ?? defaults.startGuide.isVisible },
    safety: { ...defaults.safety, ...input.safety, isVisible: input.safety?.isVisible ?? visibilityFromLegacy("safety") ?? defaults.safety.isVisible },
    magazine: { ...defaults.magazine, ...input.magazine, isVisible: input.magazine?.isVisible ?? visibilityFromLegacy("magazine") ?? defaults.magazine.isVisible },
    followUs: { ...defaults.followUs, ...input.followUs, isVisible: input.followUs?.isVisible ?? visibilityFromLegacy("followUs") ?? defaults.followUs.isVisible },
    sectionOrder: fullOrder,
    updatedAt: input.updatedAt,
    publishedAt: input.publishedAt,
  };
}

export function mergeHomeCmsData(input?: Partial<HomeCmsData> | null): HomeCmsData {
  return normalizeHome(input);
}

function readHome(key: string) {
  return normalizeHome(safeRead<Partial<HomeCmsData>>(key));
}

function readHomeWithLegacy(primary: string, legacy: string) {
  const current = safeRead<Partial<HomeCmsData>>(primary);
  if (current) return normalizeHome(current);
  const old = safeRead<Partial<HomeCmsData>>(legacy);
  if (old) {
    const migrated = normalizeHome(old);
    safeWrite(primary, migrated);
    return migrated;
  }
  return null;
}

export function getHomeDraft() {
  return readHomeWithLegacy(storageKeys.cmsHomeDraft, storageKeys.adminHomeDraft) ?? getPublishedHome();
}

export function saveHomeDraft(data: HomeCmsData) {
  const next = withTimestamp(normalizeHome(data));
  safeWrite(storageKeys.cmsHomeDraft, next);
  return next;
}

export function getPublishedHome() {
  return readHomeWithLegacy(storageKeys.cmsHomePublished, storageKeys.adminHomePublished) ?? getDefaultHomeCmsData();
}

export function publishHome(data: HomeCmsData) {
  const next = withPublishedTimestamp(normalizeHome(data));
  safeWrite(storageKeys.cmsHomePublished, next);
  return next;
}

export function resetHomeDraft() {
  safeRemove(storageKeys.cmsHomeDraft);
  return getPublishedHome();
}

function createReader<T extends { updatedAt?: string; publishedAt?: string }>(
  draftKey: string,
  publishedKey: string,
  defaults: () => T,
) {
  const normalize = (input?: Partial<T> | null): T => ({ ...defaults(), ...(input ?? {}) });
  return {
    getDraft() {
      return normalize(safeRead<Partial<T>>(draftKey) ?? safeRead<Partial<T>>(publishedKey));
    },
    saveDraft(data: T) {
      const next = withTimestamp(normalize(data));
      safeWrite(draftKey, next);
      return next;
    },
    getPublished() {
      return normalize(safeRead<Partial<T>>(publishedKey));
    },
    publish(data: T) {
      const next = withPublishedTimestamp(normalize(data));
      safeWrite(publishedKey, next);
      return next;
    },
  };
}

const rankingStore = createReader(storageKeys.cmsRankingDraft, storageKeys.cmsRankingPublished, getDefaultRankingCmsData);
const newsStore = createReader(storageKeys.cmsNewsDraft, storageKeys.cmsNewsPublished, getDefaultNewsCmsData);
const iconsStore = createReader(storageKeys.cmsIconsDraft, storageKeys.cmsIconsPublished, getDefaultIconsCmsData);
const magazineStore = createReader(storageKeys.cmsMagazineDraft, storageKeys.cmsMagazinePublished, getDefaultMagazineCmsData);

export const getRankingDraft = rankingStore.getDraft;
export const saveRankingDraft = rankingStore.saveDraft;
export const getPublishedRanking = rankingStore.getPublished;
export const publishRanking = rankingStore.publish;

export const getNewsDraft = newsStore.getDraft;
export const saveNewsDraft = newsStore.saveDraft;
export const getPublishedNews = newsStore.getPublished;
export const publishNews = newsStore.publish;

export const getIconsDraft = iconsStore.getDraft;
export const saveIconsDraft = iconsStore.saveDraft;
export const getPublishedIcons = iconsStore.getPublished;
export const publishIcons = iconsStore.publish;

export const getMagazineDraft = magazineStore.getDraft;
export const saveMagazineDraft = magazineStore.saveDraft;
export const getPublishedMagazine = magazineStore.getPublished;
export const publishMagazine = magazineStore.publish;

export function getMediaLibrary(): CmsImage[] {
  return safeRead<CmsImage[]>(storageKeys.cmsMediaLibrary) ?? [];
}

export function saveMediaLibrary(images: CmsImage[]) {
  safeWrite(storageKeys.cmsMediaLibrary, images);
  return images;
}

export function addMediaImage(image: CmsImage) {
  const images = [image, ...getMediaLibrary()];
  return saveMediaLibrary(images);
}

export function deleteMediaImage(id: string) {
  return saveMediaLibrary(getMediaLibrary().filter((image) => image.id !== id));
}

export function getHomeSections(data: HomeCmsData): HomeSectionConfig[] {
  return data.sectionOrder.map((id) => ({ id, label: sectionLabels[id], isVisible: data[id].isVisible }));
}

export function getHomeSectionLabel(id: HomeSectionId) {
  return sectionLabels[id];
}

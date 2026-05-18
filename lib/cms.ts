import { storageKeys } from "@/lib/storageKeys";
import {
  defaultHomeCmsData,
  defaultSectionOrder,
  getDefaultHomeCmsData,
  sectionLabels,
} from "@/lib/cms/homeDefaults";
import type {
  CmsImage,
  CmsPageSlug,
  HomeCmsData,
  HomeSectionConfig,
  HomeSectionId,
  IconsCmsData,
  MagazineCmsData,
  NewsCmsData,
  RankingCmsData,
} from "@/types/cms";
export { defaultHomeCmsData, defaultSectionOrder, getDefaultHomeCmsData };

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

type CmsApiResponse<T> = {
  data?: T;
  images?: CmsImage[];
  source?: "supabase" | "fallback";
  error?: string;
  meta?: {
    updatedAt?: string;
    publishedAt?: string;
  };
};

function getAdminSessionHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const session = window.localStorage.getItem(storageKeys.adminSession);
  return session ? { "x-fuku-admin-session": session } : {};
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()) as T;
}

function isBrowser() {
  return typeof window !== "undefined";
}

async function getPublicCms<T>(page: CmsPageSlug, fallback: () => T, normalize: (data?: Partial<T> | null) => T) {
  if (!isBrowser()) return fallback();
  try {
    const result = await fetchJson<CmsApiResponse<T>>(`/api/cms/${page}?status=public`, { cache: "no-store" });
    return normalize((result.data ?? null) as Partial<T> | null);
  } catch {
    // 公開サイトはブラウザごとの差分を避けるため、localStorageには絶対にフォールバックしません。
    return fallback();
  }
}

async function getAdminCms<T>(page: CmsPageSlug, status: "draft" | "public", fallback: () => T, normalize: (data?: Partial<T> | null) => T) {
  if (!isBrowser()) return fallback();
  try {
    const result = await fetchJson<CmsApiResponse<T>>(`/api/admin/cms/${page}?status=${status}`, {
      cache: "no-store",
      headers: getAdminSessionHeader(),
    });
    return normalize((result.data ?? null) as Partial<T> | null);
  } catch {
    return fallback();
  }
}

async function writeAdminCms<T>(
  page: CmsPageSlug,
  data: T,
  action: "save" | "publish" | "sync-defaults",
  localDraftWrite: (data: T) => T,
  normalize: (data?: Partial<T> | null) => T,
) {
  if (!isBrowser()) return normalize(data as Partial<T>);
  const result = await fetchJson<CmsApiResponse<T>>(`/api/admin/cms/${page}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...getAdminSessionHeader(),
    },
    body: JSON.stringify({ action, data }),
  });

  if (result.source !== "supabase" || result.error) {
    throw new Error(result.error ?? "Supabaseへの保存に失敗しました");
  }

  const normalized = normalize((result.data ?? data) as Partial<T>);
  if (action === "save" || action === "sync-defaults") {
    // localStorageはStudioの下書き補助だけに使います。公開HOMEはこの値を読みません。
    localDraftWrite(normalized as T);
  }
  return normalized;
}

const normalizeGeneric = <T extends { updatedAt?: string; publishedAt?: string }>(defaults: () => T) => (input?: Partial<T> | null): T => ({
  ...defaults(),
  ...(input ?? {}),
});

export async function getPublishedHomeAsync() {
  return getPublicCms<HomeCmsData>("home", getDefaultHomeCmsData, mergeHomeCmsData);
}

export async function getHomeDraftAsync() {
  return getAdminCms<HomeCmsData>("home", "draft", getDefaultHomeCmsData, mergeHomeCmsData);
}

export async function saveHomeDraftAsync(data: HomeCmsData) {
  return writeAdminCms<HomeCmsData>("home", data, "save", saveHomeDraft, mergeHomeCmsData);
}

export async function publishHomeAsync(data: HomeCmsData) {
  return writeAdminCms<HomeCmsData>("home", data, "publish", saveHomeDraft, mergeHomeCmsData);
}

export async function syncHomeDraftFromDefaultsAsync() {
  return writeAdminCms<HomeCmsData>("home", getDefaultHomeCmsData(), "sync-defaults", saveHomeDraft, mergeHomeCmsData);
}

export async function syncHomePublishedFromDefaultsAsync() {
  return writeAdminCms<HomeCmsData>("home", getDefaultHomeCmsData(), "publish", saveHomeDraft, mergeHomeCmsData);
}

export async function getPublishedRankingAsync() {
  return getPublicCms<RankingCmsData>("ranking", getDefaultRankingCmsData, normalizeGeneric(getDefaultRankingCmsData));
}

export async function getRankingDraftAsync() {
  return getAdminCms<RankingCmsData>("ranking", "draft", getDefaultRankingCmsData, normalizeGeneric(getDefaultRankingCmsData));
}

export async function saveRankingDraftAsync(data: RankingCmsData) {
  return writeAdminCms<RankingCmsData>("ranking", data, "save", saveRankingDraft, normalizeGeneric(getDefaultRankingCmsData));
}

export async function publishRankingAsync(data: RankingCmsData) {
  return writeAdminCms<RankingCmsData>("ranking", data, "publish", saveRankingDraft, normalizeGeneric(getDefaultRankingCmsData));
}

export async function getPublishedNewsAsync() {
  return getPublicCms<NewsCmsData>("news", getDefaultNewsCmsData, normalizeGeneric(getDefaultNewsCmsData));
}

export async function getNewsDraftAsync() {
  return getAdminCms<NewsCmsData>("news", "draft", getDefaultNewsCmsData, normalizeGeneric(getDefaultNewsCmsData));
}

export async function saveNewsDraftAsync(data: NewsCmsData) {
  return writeAdminCms<NewsCmsData>("news", data, "save", saveNewsDraft, normalizeGeneric(getDefaultNewsCmsData));
}

export async function publishNewsAsync(data: NewsCmsData) {
  return writeAdminCms<NewsCmsData>("news", data, "publish", saveNewsDraft, normalizeGeneric(getDefaultNewsCmsData));
}

export async function getPublishedIconsAsync() {
  return getPublicCms<IconsCmsData>("icons", getDefaultIconsCmsData, normalizeGeneric(getDefaultIconsCmsData));
}

export async function getIconsDraftAsync() {
  return getAdminCms<IconsCmsData>("icons", "draft", getDefaultIconsCmsData, normalizeGeneric(getDefaultIconsCmsData));
}

export async function saveIconsDraftAsync(data: IconsCmsData) {
  return writeAdminCms<IconsCmsData>("icons", data, "save", saveIconsDraft, normalizeGeneric(getDefaultIconsCmsData));
}

export async function publishIconsAsync(data: IconsCmsData) {
  return writeAdminCms<IconsCmsData>("icons", data, "publish", saveIconsDraft, normalizeGeneric(getDefaultIconsCmsData));
}

export async function getPublishedMagazineAsync() {
  return getPublicCms<MagazineCmsData>("magazine", getDefaultMagazineCmsData, normalizeGeneric(getDefaultMagazineCmsData));
}

export async function getMagazineDraftAsync() {
  return getAdminCms<MagazineCmsData>("magazine", "draft", getDefaultMagazineCmsData, normalizeGeneric(getDefaultMagazineCmsData));
}

export async function saveMagazineDraftAsync(data: MagazineCmsData) {
  return writeAdminCms<MagazineCmsData>("magazine", data, "save", saveMagazineDraft, normalizeGeneric(getDefaultMagazineCmsData));
}

export async function publishMagazineAsync(data: MagazineCmsData) {
  return writeAdminCms<MagazineCmsData>("magazine", data, "publish", saveMagazineDraft, normalizeGeneric(getDefaultMagazineCmsData));
}

export async function getMediaLibraryAsync() {
  if (!isBrowser()) return getMediaLibrary();
  try {
    const result = await fetchJson<CmsApiResponse<CmsImage[]>>("/api/admin/cms/assets", {
      cache: "no-store",
      headers: getAdminSessionHeader(),
    });
    return result.images ?? getMediaLibrary();
  } catch {
    return getMediaLibrary();
  }
}

export function getHomeSections(data: HomeCmsData): HomeSectionConfig[] {
  return data.sectionOrder.map((id) => ({ id, label: sectionLabels[id], isVisible: data[id].isVisible }));
}

export function getHomeSectionLabel(id: HomeSectionId) {
  return sectionLabels[id];
}

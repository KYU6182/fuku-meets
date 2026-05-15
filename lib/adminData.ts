import { storageKeys } from "./storageKeys";
import { icons } from "./data/icons";
import { newsArticles } from "./data/news";
import { spots } from "./data/spots";
import type { AdminLog, FormSubmission, Icon, News, Ranking, Shop, UserProfile } from "@/types/admin";

export const adminShops: Shop[] = spots.map((spot) => ({
  ...spot,
  status: spot.isVerified ? "published" : "pending",
}));

export const adminNews: News[] = newsArticles.map((article) => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  category: article.category,
  excerpt: article.summary,
  body: article.body.join("\n\n"),
  image: article.image,
  tags: [article.category, "福岡"],
  relatedSpotIds: ["daimyo-kakurega-izakaya"],
  relatedIconIds: ["yui"],
  seoTitle: `${article.title} | FUKU-MEETS`,
  seoDescription: article.summary,
  status: "published",
  publishedAt: article.date,
}));

export const adminIcons: Icon[] = icons.map((icon) => ({
  id: icon.id,
  slug: icon.slug,
  name: icon.name,
  category: icon.category,
  area: icon.area,
  profile: icon.copy,
  image: icon.image,
  instagram: icon.instagram,
  votes: icon.votes,
  supportCount: Math.round(icon.votes * 0.42),
  status: "published",
  isCoverCandidate: icon.rank <= 3,
}));

export const adminRankings: Ranking[] = [
  {
    id: "supermarket",
    slug: "supermarket",
    title: "好きなスーパー",
    category: "DAILY",
    description: "日常の味方！通いやすくて、品ぞろえも◎",
    periodStart: "2024-05-01",
    periodEnd: "2024-05-31",
    status: "published",
    isSponsored: false,
    entries: ["ボンラパス", "ハローデイ", "サニー", "マックスバリュ"].map((name, index) => ({
      id: `supermarket-${index + 1}`,
      rankingId: "supermarket",
      targetType: "custom",
      targetId: name,
      name,
      image: `/images/ranking/super-${index + 1}.jpg`,
      votes: [1842, 1233, 987, 845][index],
      status: "published",
    })),
  },
  {
    id: "station",
    slug: "station",
    title: "好きな駅",
    category: "DAILY",
    description: "通勤・通学も、おでかけも。よく使う駅はここ！",
    periodStart: "2024-05-01",
    periodEnd: "2024-05-31",
    status: "published",
    isSponsored: false,
    entries: ["薬院駅", "天神駅", "博多駅"].map((name, index) => ({
      id: `station-${index + 1}`,
      rankingId: "station",
      targetType: "area",
      targetId: name,
      name,
      image: `/images/ranking/station-${index + 1}.jpg`,
      votes: [2109, 1732, 1421][index],
      status: "published",
    })),
  },
];

export const adminForms: FormSubmission[] = [
  {
    id: "form-1",
    type: "FUKU ICONS一般エントリー",
    name: "HARU",
    email: "haru@example.com",
    instagram: "@haru_fuku",
    message: "モデルとしてエントリーしたいです。",
    status: "new",
    createdAt: "2026.05.15 10:12",
  },
  {
    id: "form-2",
    type: "店舗推薦",
    name: "薬院の静かなカフェ",
    email: "shop@example.com",
    instagram: "@yakuin_cafe",
    message: "夜も使いやすいお店です。",
    status: "reviewing",
    createdAt: "2026.05.14 18:42",
  },
  {
    id: "form-3",
    type: "フリーペーパー設置申請",
    name: "大名セレクトショップ",
    email: "paper@example.com",
    instagram: "@daimyo_select",
    message: "20部設置可能です。",
    status: "approved",
    createdAt: "2026.05.13 09:30",
  },
];

export const adminUsers: UserProfile[] = [
  {
    id: "admin-1",
    name: "FUKU編集部",
    email: "admin@fuku-meets.local",
    role: "super_admin",
    fukuType: "編集部",
    savedSpotIds: [],
    votedRankingIds: [],
    followedIconIds: [],
    supportedIconIds: [],
    createdAt: "2026.05.01",
  },
  {
    id: "user-1",
    name: "tenjin girl",
    email: "user@example.com",
    role: "user",
    fukuType: "夜カフェ派",
    savedSpotIds: ["tenjin-night-cafe"],
    votedRankingIds: ["supermarket"],
    followedIconIds: ["yui"],
    supportedIconIds: ["yui"],
    createdAt: "2026.05.10",
  },
];

export const adminLogs: AdminLog[] = [
  { id: "log-1", adminUserId: "admin-1", action: "NEWSを公開しました", resourceType: "news", resourceId: "local-news-fukuoka-now", createdAt: "2026.05.15 11:00" },
  { id: "log-2", adminUserId: "admin-1", action: "ランキングを編集しました", resourceType: "ranking", resourceId: "supermarket", createdAt: "2026.05.15 10:20" },
  { id: "log-3", adminUserId: "admin-1", action: "店舗情報を更新しました", resourceType: "shop", resourceId: "daimyo-kakurega-izakaya", createdAt: "2026.05.14 18:10" },
  { id: "log-4", adminUserId: "admin-1", action: "FUKU ICONSを承認しました", resourceType: "icon", resourceId: "haru", createdAt: "2026.05.14 14:05" },
];

export function addAdminLog(action: string, resourceType: string, resourceId: string) {
  if (typeof window === "undefined") return;
  const current = JSON.parse(window.localStorage.getItem(storageKeys.adminLogs) ?? "[]") as AdminLog[];
  const nextLog: AdminLog = {
    id: `local-${Date.now()}`,
    adminUserId: "local-admin",
    action,
    resourceType,
    resourceId,
    createdAt: new Date().toLocaleString("ja-JP"),
  };
  window.localStorage.setItem(storageKeys.adminLogs, JSON.stringify([nextLog, ...current]));
}

// Security notes for the real CMS:
// - Do not physically delete content; mark records archived.
// - Validate uploads: jpg/png/webp only, SVG prohibited, 5MB max.
// - Store Markdown, not raw HTML, and render through a sanitizer.
// - Persist every mutation to admin_logs.
// - Enforce permissions with Supabase RLS and server-side role checks.

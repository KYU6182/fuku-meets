import { storageKeys } from "@/lib/storageKeys";
import { getCurrentUser } from "@/lib/userAuth";
import type { RankingCategoryId, RankingEntry, RankingTheme, RankingVoteRecord } from "@/types/rankingSystem";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? JSON.stringify(fallback)) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function toVotes(value: string | number) {
  if (typeof value === "number") return value;
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

export const rankingCategories: { id: RankingCategoryId; label: string }[] = [
  { id: "food", label: "FOOD" },
  { id: "people", label: "PEOPLE" },
  { id: "daily", label: "DAILY" },
  { id: "night", label: "NIGHT" },
  { id: "area", label: "AREA" },
];

const period = "2024.05.01 - 2024.05.31";

function entry(rank: number, slug: string, name: string, votes: number, image: string, extra: Partial<RankingEntry> = {}): RankingEntry {
  return {
    rank,
    slug,
    name,
    votes,
    image,
    area: extra.area ?? "福岡エリア",
    description: extra.description ?? `${name}は、福岡の日常でリアルに選ばれている人気候補です。`,
    tags: extra.tags ?? ["通いやすい", "日常で助かる"],
    pickedComments: extra.pickedComments ?? ["日常で使いやすくて助かる", "つい選びたくなる安心感がある"],
    ...extra,
  };
}

export const rankingThemes: RankingTheme[] = [
  {
    id: "supermarket",
    slug: "supermarket",
    category: "daily",
    title: "好きなスーパー",
    description: "日常の味方！通いやすくて、品ぞろえも◎",
    period,
    image: "/images/ranking/super-bonrepas.jpg",
    top3: ["ボンラパス", "ハローデイ", "サニー"],
    entries: [
      entry(1, "bon-repas", "ボンラパス", 1842, "/images/ranking/super-bonrepas.jpg", {
        area: "薬院",
        address: "福岡市中央区 薬院駅 徒歩5分",
        tags: ["地元密着", "品ぞろえ◎", "新鮮野菜", "おしゃれ"],
        pickedComments: ["惣菜が強くて帰り道に寄りやすい", "ちょっと良い日常感がある"],
      }),
      entry(2, "halloday", "ハローデイ", 1233, "/images/ranking/super-halloday.jpg", {
        pickedComments: ["野菜コーナーが見やすくて好き", "惣菜が強い。仕事帰りに助かる"],
      }),
      entry(3, "sunny", "サニー", 987, "/images/ranking/super-sunny.jpg", {
        pickedComments: ["24時間営業がありがたい", "結局いちばん行く安心感"],
      }),
      entry(4, "maxvalu", "マックスバリュ", 845, "/images/ranking/super-maxvalu.jpg", { note: "あと32票でTOP3" }),
      entry(5, "nishitetsu-store", "にしてつストア", 792, "/images/ranking/super-nishitetsu.jpg", { note: "あと50票でTOP3" }),
      entry(6, "trial", "TRIAL", 701, "/images/ranking/super-trial.jpg", { note: "急上昇" }),
      entry(7, "gyomu-super", "業務スーパー", 655, "/images/ranking/super-gyomu.jpg"),
      entry(8, "reganet", "レガネット", 602, "/images/ranking/super-reganet.jpg"),
      entry(9, "makii", "マキイ", 588, "/images/ranking/super-makii.jpg", { note: "急上昇" }),
      entry(10, "lopia", "ロピア", 540, "/images/ranking/super-lopia.jpg"),
    ],
  },
  {
    id: "station",
    slug: "station",
    category: "daily",
    title: "好きな駅",
    description: "通勤・通学も、おでかけも。よく使う駅はここ！",
    period,
    image: "/images/ranking/station-yakuin.jpg",
    top3: ["薬院駅", "天神駅", "博多駅"],
    entries: [
      entry(1, "yakuin-station", "薬院駅", 2109, "/images/ranking/station-yakuin.jpg", { area: "薬院" }),
      entry(2, "tenjin-station", "天神駅", 1732, "/images/ranking/station-tenjin.jpg", { area: "天神" }),
      entry(3, "hakata-station", "博多駅", 1421, "/images/ranking/station-hakata.jpg", { area: "博多" }),
      entry(4, "nishijin-station", "西新駅", 1098, "/images/ranking/station-nishijin.jpg"),
      entry(5, "ropponmatsu-station", "六本松駅", 1086, "/images/ranking/station-ropponmatsu.jpg"),
      entry(6, "ohashi-station", "大橋駅", 945, "/images/ranking/station-ohashi.jpg"),
    ],
  },
  {
    id: "city",
    slug: "area",
    category: "daily",
    title: "住みたい街",
    description: "住むならこんな街に暮らしたい！",
    period,
    image: "/images/ranking/city-yakuin.jpg",
    top3: ["薬院", "大名", "六本松"],
    entries: [
      entry(1, "yakuin", "薬院", 1876, "/images/ranking/city-yakuin.jpg", { area: "薬院" }),
      entry(2, "daimyo", "大名", 1312, "/images/ranking/city-daimyo.jpg", { area: "大名" }),
      entry(3, "ropponmatsu", "六本松", 1086, "/images/ranking/city-ropponmatsu.jpg", { area: "六本松" }),
      entry(4, "nishijin", "西新", 1020, "/images/ranking/city-nishijin.jpg"),
      entry(5, "hirao", "平尾", 911, "/images/ranking/city-hirao.jpg"),
      entry(6, "ohori-park", "大濠公園", 880, "/images/ranking/city-ohori.jpg"),
    ],
  },
  {
    id: "night-help",
    slug: "late-night",
    category: "daily",
    title: "深夜助かる場所",
    description: "遅くなった日も、ここがあると安心。",
    period,
    image: "/images/ranking/night-seven.jpg",
    top3: ["セブン-イレブン", "TRIAL GO", "すき家"],
    entries: [
      entry(1, "seven-eleven", "セブン-イレブン", 2243, "/images/ranking/night-seven.jpg", { area: "全エリア" }),
      entry(2, "trial-go", "TRIAL GO", 1498, "/images/ranking/night-trial.jpg"),
      entry(3, "sukiya", "すき家", 1205, "/images/ranking/night-sukiya.jpg"),
      entry(4, "don-quijote", "ドン・キホーテ", 1118, "/images/ranking/night-donki.jpg"),
      entry(5, "ichiran", "一蘭", 1030, "/images/ranking/night-ichiran.jpg"),
      entry(6, "familymart", "ファミリーマート", 902, "/images/ranking/night-familymart.jpg"),
    ],
  },
  ...["cafe", "izakaya", "ramen", "bakery"].map((slug, index) =>
    simpleTheme(slug, ["カフェ", "居酒屋", "ラーメン", "パン"][index], "food"),
  ),
  ...["model", "hair", "dj", "creator"].map((slug, index) =>
    simpleTheme(slug, ["モデル", "美容師", "DJ", "クリエイター"][index], "people"),
  ),
  ...["club", "shisha", "bar"].map((slug, index) =>
    simpleTheme(slug, ["クラブ", "シーシャ", "バー"][index], "night"),
  ),
  ...["tenjin", "daimyo", "imaizumi", "yakuin", "hakata", "nakasu"].map((slug, index) =>
    simpleTheme(slug, ["天神", "大名", "今泉", "薬院", "博多", "中洲"][index], "area"),
  ),
];

function simpleTheme(slug: string, title: string, category: RankingCategoryId): RankingTheme {
  return {
    id: slug,
    slug,
    category,
    title,
    description: `${title}でいま注目されている候補をチェック。`,
    period,
    image: `/images/ranking/${slug}-1.jpg`,
    top3: [`${title} 1`, `${title} 2`, `${title} 3`],
    entries: Array.from({ length: 6 }, (_, index) =>
      entry(index + 1, `${slug}-${index + 1}`, index < 3 ? `${title} ${index + 1}` : `${title}候補 ${index + 1}`, 1420 - index * 137, `/images/ranking/${slug}-${index + 1}.jpg`),
    ),
  };
}

export function getThemesByCategory(category: RankingCategoryId) {
  return rankingThemes.filter((theme) => theme.category === category);
}

export function getRankingTheme(slugOrId: string) {
  return rankingThemes.find((theme) => theme.slug === slugOrId || theme.id === slugOrId) ?? null;
}

export function getRankingEntry(rankingSlug: string, entrySlug: string) {
  const theme = getRankingTheme(rankingSlug);
  if (!theme) return null;
  const entry = theme.entries.find((item) => item.slug === entrySlug) ?? null;
  return entry ? { theme, entry } : null;
}

function entryKey(rankingSlug: string, entrySlug: string) {
  return `${rankingSlug}:${entrySlug}`;
}

export function getEntryVoteCount(rankingSlug: string, entryItem: Pick<RankingEntry, "slug" | "votes">) {
  const deltas = readJson<Record<string, number>>(storageKeys.rankingEntries, {});
  return toVotes(entryItem.votes) + (deltas[entryKey(rankingSlug, entryItem.slug)] ?? 0);
}

export function getRankingVoteState(rankingSlug: string) {
  const user = getCurrentUser();
  const key = user ? storageKeys.rankingVotes : storageKeys.guestRankingVotes;
  const votes = readJson<RankingVoteRecord[]>(key, []);
  const userKey = user?.userId ?? "guest";
  return votes.find((vote) => vote.userId === userKey && vote.rankingSlug === rankingSlug) ?? null;
}

export function voteRankingEntry(rankingSlug: string, entrySlug: string) {
  const user = getCurrentUser();
  const userKey = user?.userId ?? "guest";
  const key = user ? storageKeys.rankingVotes : storageKeys.guestRankingVotes;
  const votes = readJson<RankingVoteRecord[]>(key, []);
  if (!user) {
    const votedThemeCount = new Set(votes.filter((vote) => vote.userId === userKey).map((vote) => vote.rankingSlug)).size;
    if (votedThemeCount >= 5 && !votes.some((vote) => vote.userId === userKey && vote.rankingSlug === rankingSlug)) {
      return { ok: false, reason: "limit" as const, message: "もっと投票するにはログインしてください。" };
    }
  }
  if (votes.some((vote) => vote.userId === userKey && vote.rankingSlug === rankingSlug)) {
    return { ok: false, reason: "voted" as const, message: "このランキングは投票済みです" };
  }
  const nextVote: RankingVoteRecord = { userId: userKey, rankingSlug, entrySlug, createdAt: new Date().toISOString() };
  writeJson(key, [nextVote, ...votes]);
  const deltas = readJson<Record<string, number>>(storageKeys.rankingEntries, {});
  const keyName = entryKey(rankingSlug, entrySlug);
  writeJson(storageKeys.rankingEntries, { ...deltas, [keyName]: (deltas[keyName] ?? 0) + 1 });
  return { ok: true, reason: "ok" as const, message: "投票しました" };
}

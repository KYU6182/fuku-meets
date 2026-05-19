import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { RankingCategoryId, RankingEntry, RankingTheme } from "@/types/rankingSystem";

type RankingThemeRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  description: string | null;
  period_start?: string | null;
  period_end?: string | null;
  thumbnail_url?: string | null;
  sort_order?: number | null;
  display_order?: number | null;
  updated_at?: string | null;
  created_at?: string | null;
};

type RankingEntryRow = {
  id: string;
  ranking_id: string;
  slug: string;
  name: string;
  area?: string | null;
  description?: string | null;
  tags?: string[] | null;
  votes?: number | null;
  thumbnail_url?: string | null;
  hero_image_url?: string | null;
  address?: string | null;
  url?: string | null;
  map_url?: string | null;
  instagram_url?: string | null;
  display_order?: number | null;
  rank?: number | null;
  updated_at?: string | null;
  created_at?: string | null;
  content?: {
    pickedComments?: string[];
    [key: string]: unknown;
  } | null;
};

const validCategories = new Set<RankingCategoryId>(["food", "people", "daily", "night", "area"]);

function normalizeCategory(value: string | null | undefined): RankingCategoryId {
  const category = String(value || "daily").toLowerCase() as RankingCategoryId;
  return validCategories.has(category) ? category : "daily";
}

function period(start?: string | null, end?: string | null) {
  return [start, end].filter(Boolean).join(" - ");
}

function sortEntries(a: RankingEntryRow, b: RankingEntryRow) {
  const byVotes = Number(b.votes ?? 0) - Number(a.votes ?? 0);
  if (byVotes !== 0) return byVotes;
  const byOrder = Number(a.display_order ?? a.rank ?? 9999) - Number(b.display_order ?? b.rank ?? 9999);
  if (byOrder !== 0) return byOrder;
  return String(b.updated_at ?? b.created_at ?? "").localeCompare(String(a.updated_at ?? a.created_at ?? ""));
}

function mapEntry(row: RankingEntryRow, index: number): RankingEntry {
  return {
    rank: index + 1,
    slug: row.slug,
    name: row.name,
    votes: Number(row.votes ?? 0),
    image: row.hero_image_url || row.thumbnail_url || "",
    area: row.area || "福岡エリア",
    description: row.description || `${row.name}は、福岡のみんなの投票で選ばれている候補です。`,
    tags: Array.isArray(row.tags) ? row.tags : [],
    address: row.address || undefined,
    mapUrl: row.map_url || row.url || undefined,
    instagramUrl: row.instagram_url || undefined,
    pickedComments: row.content?.pickedComments ?? [],
  };
}

function mapTheme(theme: RankingThemeRow, entries: RankingEntryRow[]): RankingTheme {
  const sortedEntries = entries.sort(sortEntries).map(mapEntry);
  return {
    id: theme.id,
    slug: theme.slug,
    category: normalizeCategory(theme.category),
    title: theme.title,
    description: theme.description || "みんなの“好き”を集めたランキングです。",
    period: period(theme.period_start, theme.period_end),
    image: theme.thumbnail_url || "",
    top3: sortedEntries.slice(0, 3).map((entry) => entry.name),
    entries: sortedEntries,
  };
}

export async function fetchPublishedRankingThemes(): Promise<RankingTheme[]> {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return [];

  const { data: themes, error: themesError } = await supabase
    .from("ranking_themes")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (themesError || !themes?.length) return [];

  const themeRows = themes as RankingThemeRow[];
  const themeIds = themeRows.map((theme) => theme.id);
  const { data: entries, error: entriesError } = await supabase
    .from("ranking_entries")
    .select("*")
    .eq("status", "published")
    .in("ranking_id", themeIds);
  if (entriesError) return [];

  const entryRows = (entries ?? []) as RankingEntryRow[];
  return themeRows.map((theme) => mapTheme(theme, entryRows.filter((entry) => entry.ranking_id === theme.id)));
}

export async function fetchPublishedRankingTheme(rankingSlug: string) {
  const themes = await fetchPublishedRankingThemes();
  return themes.find((theme) => theme.slug === rankingSlug || theme.id === rankingSlug) ?? null;
}

export async function fetchPublishedRankingEntry(rankingSlug: string, entrySlug: string) {
  const theme = await fetchPublishedRankingTheme(rankingSlug);
  if (!theme) return null;
  const entry = theme.entries.find((item) => item.slug === entrySlug) ?? null;
  return entry ? { theme, entry } : null;
}

import RankingEntryDetailPage from "@/components/RankingEntryDetailPage";
import { getRankingEntry } from "@/lib/rankingSystem";

export default async function RankingEntryPage({
  params,
}: {
  params: Promise<{ rankingSlug: string; entrySlug: string }>;
}) {
  const { rankingSlug, entrySlug } = await params;
  const result = getRankingEntry(rankingSlug, entrySlug);

  if (!result) {
    return <RankingEntryDetailPage theme={{ id: "not-found", slug: "not-found", category: "daily", title: "RANKING", description: "候補が見つかりません。", period: "", image: "", top3: [], entries: [] }} entry={{ rank: 0, slug: "not-found", name: "候補が見つかりません", votes: 0, image: "", description: "ランキングページへ戻って候補を選んでください。", tags: [] }} />;
  }

  return <RankingEntryDetailPage theme={result.theme} entry={result.entry} />;
}

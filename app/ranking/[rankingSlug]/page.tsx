import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import RankingCommentSection from "@/components/RankingCommentSection";
import RankingEntryCard from "@/components/RankingEntryCard";
import { getRankingTheme } from "@/lib/rankingSystem";

export default async function RankingThemePage({ params }: { params: Promise<{ rankingSlug: string }> }) {
  const { rankingSlug } = await params;
  const theme = getRankingTheme(rankingSlug);

  if (!theme) {
    return (
      <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
        <Header />
        <main className="pb-28"><PageHero title="RANKING" copy="ランキングが見つかりません。" /></main>
        <BottomNav active="ranking" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title={theme.title} copy={theme.description} />
        <section className="space-y-3 bg-white px-4 py-5">
          <p className="text-[11px] font-bold text-fuku-gray">集計期間：{theme.period}</p>
          <div className="grid gap-3">
            {theme.entries.map((entry) => <RankingEntryCard key={entry.slug} rankingSlug={theme.slug} entry={entry} />)}
          </div>
        </section>
        <RankingCommentSection rankingSlug={theme.slug} title={theme.title} />
      </main>
      <BottomNav active="ranking" />
    </div>
  );
}

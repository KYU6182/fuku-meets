import RankingCommentForm from "./RankingCommentForm";

export default function RankingCommentSection({ rankingSlug, title }: { rankingSlug: string; title: string }) {
  return (
    <section className="border-t border-fuku-border bg-white px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-black text-fuku-black">このランキングへの推しコメント</h2>
        <a href={`/ranking/${rankingSlug}`} className="text-[11px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <RankingCommentForm rankingSlug={rankingSlug} title={title} />
    </section>
  );
}

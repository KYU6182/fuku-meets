import type { Metadata } from "next";
import GuideLayout from "@/components/GuideLayout";
import LinkCard from "@/components/LinkCard";

export const metadata: Metadata = {
  title: "まず行きたい福岡の定番スポット | FUKU-MEETS",
  description: "福岡初心者が最初に行きたい定番スポット、エリア情報、FAQをまとめました。",
};

export default function StandardSpotsPage() {
  return (
    <GuideLayout title="まず行きたい定番スポット" copy="福岡らしさを感じる場所から始めよう。">
      {["大濠公園", "天神地下街", "博多駅周辺", "中洲屋台", "糸島ドライブ"].map((title) => (
        <LinkCard key={title} href="/search" title={title} description="アクセス、過ごし方、近くのおすすめ店をチェック。" />
      ))}
      <SeoBlock />
    </GuideLayout>
  );
}

function SeoBlock() {
  return <div className="rounded-[16px] bg-white p-5 text-[13px] font-bold leading-relaxed text-fuku-gray">目次 / エリア情報 / FAQ / 関連リンク / CTAを含むSEO向け記事ページです。</div>;
}

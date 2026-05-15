import type { Metadata } from "next";
import GuideLayout from "@/components/GuideLayout";
import LinkCard from "@/components/LinkCard";

export const metadata: Metadata = {
  title: "福岡で最初に住みたい街ガイド | FUKU-MEETS",
  description: "薬院、六本松、西新、平尾、大橋、博多、天神周辺の家賃目安や生活しやすさを紹介。",
};

export default function BestAreasToLivePage() {
  return (
    <GuideLayout title="福岡で最初に住みたい街ガイド" copy="家賃、スーパー、駅アクセスで選ぶ。">
      {["薬院", "六本松", "西新", "平尾", "大橋", "博多", "天神周辺"].map((title) => (
        <LinkCard key={title} href={`/ranking?theme=city`} title={title} description="生活しやすさ、スーパー、駅アクセス、初心者向け度を紹介。" />
      ))}
      <div className="rounded-[16px] bg-white p-5 text-[13px] font-bold leading-relaxed text-fuku-gray">家賃目安 / 生活しやすさ / FAQ / 関連ランキングを順次更新します。</div>
    </GuideLayout>
  );
}

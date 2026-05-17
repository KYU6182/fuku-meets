import { ArrowRight, MapPin } from "lucide-react";

type LegacyVisitorGuideCms = {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  isVisible?: boolean;
};

const visitorCards = [
  "ライブ後に行ける店",
  "博多駅近くで夜ごはん",
  "一人旅でも入りやすい店",
  "PayPayドーム周辺",
  "福岡サンパレス周辺",
  "今日参加できるMEET",
];

export default function VisitorGuideSection({ cms }: { cms?: LegacyVisitorGuideCms }) {
  if (cms?.isVisible === false) return null;
  return (
    <section className="bg-[#fbfaf7] px-5 py-8">
      <p className="headline-condensed text-[37px] uppercase leading-none text-fuku-black">{cms?.title ?? "VISITOR GUIDE"}</p>
      <h2 className="mt-3 text-[22px] font-black text-fuku-black">{cms?.subtitle ?? "福岡に来た人へ。"}</h2>
      <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "遠征・観光・ひとり旅でも、地元のリアルにつながれる。"}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {visitorCards.map((title) => (
          <a key={title} href="/visitor" className="min-h-[86px] rounded-[13px] border border-fuku-border bg-white p-3 shadow-soft">
            <MapPin className="text-fuku-red" size={18} />
            <p className="mt-3 text-[13px] font-black leading-tight text-fuku-black">{title}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="rounded-full bg-fuku-light px-2 py-1 text-[9px] font-black text-fuku-gray">駅近</span>
              <span className="rounded-full bg-[#fff1f1] px-2 py-1 text-[9px] font-black text-fuku-red">一人OK</span>
            </div>
          </a>
        ))}
      </div>
      <a href={cms?.ctaHref ?? "/visitor"} className="mt-5 flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-fuku-black bg-white text-[13px] font-black text-fuku-black">
        {cms?.ctaText ?? "福岡ビジターガイドを見る"}
        <ArrowRight size={16} />
      </a>
    </section>
  );
}

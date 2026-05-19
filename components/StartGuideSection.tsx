import { ArrowRight, MapPin, Sparkles, Trophy } from "lucide-react";
import type { HomeCmsData } from "@/types/cms";

const guideCards = [
  { title: "はじめて使う人へ", description: "FUKU-MEETSの楽しみ方", href: "/start-guide", icon: Sparkles },
  { title: "今日参加できるMEET", description: "一人参加OK・女性参加あり", href: "/meet/today", icon: MapPin },
  { title: "ランキングから探す", description: "みんなの“好き”から店とMEETを見つける", href: "/ranking", icon: Trophy },
];

export default function StartGuideSection({ cms }: { cms?: HomeCmsData["startGuide"] }) {
  if (cms?.isVisible === false) return null;
  return (
    <section className="bg-[#fbfaf7] px-5 py-8">
      <p className="headline-condensed text-[36px] uppercase leading-none text-fuku-black">{cms?.title ?? "START GUIDE"}</p>
      <p className="mt-2 text-[14px] font-black leading-relaxed text-fuku-black">{cms?.subtitle ?? "はじめての福岡、はじめてのFUKU-MEETS。"}</p>
      <a
        href={cms?.ctaHref ?? "/visitor"}
        className="mt-5 block overflow-hidden rounded-[16px] border border-fuku-border bg-white shadow-soft"
      >
        <div
          className="h-[146px] bg-fuku-light bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg,rgba(255,255,255,.72),rgba(255,255,255,.08)),url('${cms?.mainCardImage ?? "/images/fukuoka-city.jpg"}')` }}
        />
        <div className="p-4">
          <h3 className="text-[22px] font-black leading-tight text-fuku-black">{cms?.mainCardTitle ?? "福岡に来た夜、どこ行く？"}</h3>
          <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.mainCardDescription ?? "観光・遠征・ひとり旅でも安心。今日参加できるMEETと地元民の推し店をチェック。"}</p>
          <span className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-full bg-fuku-red px-5 text-[12px] font-black text-white">
            {cms?.ctaText ?? "VISITOR GUIDEを見る"}
            <ArrowRight size={15} />
          </span>
        </div>
      </a>
      <div className="mt-4 grid gap-3">
        {guideCards.map(({ title, description, href, icon: Icon }) => (
          <a key={title} href={href} className="flex min-h-[72px] items-center gap-3 rounded-[12px] border border-fuku-border bg-white p-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff1f1] text-fuku-red"><Icon size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-black text-fuku-black">{title}</span>
              <span className="mt-1 block text-[11px] font-bold text-fuku-gray">{description}</span>
            </span>
            <ArrowRight size={16} />
          </a>
        ))}
      </div>
    </section>
  );
}

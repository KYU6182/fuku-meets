import { ArrowRight } from "lucide-react";
import type { HomeCmsData } from "@/types/cms";

const chips = ["新店舗", "特集", "インタビュー", "ライブ後ガイド", "遠征ガイド", "街のトレンド"];

const listArticles = [
  {
    image: "/images/news-1.jpg",
    title: "今月オープン！薬院の注目カフェ3選",
    description: "朝も夜も使える新店を編集部がチェック。",
    date: "2024.05.19",
    tags: ["薬院", "新店舗"],
    href: "/news/local-news-fukuoka-now",
  },
  {
    image: "/images/news-2.jpg",
    title: "福岡のライブハウス最新事情【2024年版】",
    description: "ライブ後の動き方までまとめました。",
    date: "2024.05.18",
    tags: ["音楽", "ライブ"],
    href: "/news/fukuoka-food-feature",
  },
  {
    image: "/images/news-3.jpg",
    title: "地元民が通う！博多の屋台おすすめマップ",
    description: "遠征勢にもすすめたい夜ごはんガイド。",
    date: "2024.05.17",
    tags: ["博多", "屋台"],
    href: "/news/area-guide-fukuoka",
  },
  {
    image: "/images/weekend-night.jpg",
    title: "5月の福岡イベントまとめ｜音楽・グルメ・アート",
    description: "今週末の予定を立てる前にチェック。",
    date: "2024.05.16",
    tags: ["イベント", "週末"],
    href: "/news",
  },
];

export default function LocalMediaSection({ cms }: { cms?: HomeCmsData["localMedia"] }) {
  if (cms?.isVisible === false) return null;
  return (
    <section className="border-y border-fuku-border bg-white px-5 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="headline-condensed text-[37px] uppercase leading-none text-fuku-black">{cms?.title ?? "LOCAL MEDIA / NEWS"}</p>
          <p className="mt-2 text-[14px] font-black text-fuku-black">{cms?.subtitle ?? "福岡のカルチャーを、記事で知る。"}</p>
        </div>
        <a href={cms?.ctaHref ?? "/news"} className="mt-2 shrink-0 text-[12px] font-black text-fuku-black">
          {cms?.ctaText ?? "NEWSを見る"} →
        </a>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {chips.map((chip, index) => (
          <a key={chip} href={`/news?category=${encodeURIComponent(chip)}`} className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-black ${index === 0 ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white text-fuku-black"}`}>
            {chip}
          </a>
        ))}
      </div>

      <a
        href="/news/local-news-fukuoka-now"
        className="relative mt-5 block min-h-[234px] overflow-hidden rounded-[16px] bg-fuku-light bg-cover bg-center shadow-soft"
        style={{ backgroundImage: "linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.72)),url('/images/news-1.jpg')" }}
      >
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <span className="rounded-[4px] bg-fuku-red px-2 py-1 text-[10px] font-black">ライブ後ガイド</span>
          <h3 className="mt-3 text-[22px] font-black leading-tight">ライブ後に行きたい天神の店 5選</h3>
          <p className="mt-2 text-[12px] font-bold leading-relaxed">ライブの余韻そのままに、徒歩圏内で立ち寄れる名店を厳選してご紹介！</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black">
            <span>2024.05.20</span>
            <span>天神</span>
            <span>グルメ</span>
          </div>
        </div>
      </a>

      <div className="mt-4 grid gap-3">
        {listArticles.map((article) => (
          <a key={article.title} href={article.href} className="grid grid-cols-[92px_1fr_24px] items-center gap-3 rounded-[13px] border border-fuku-border bg-white p-2 shadow-soft">
            <div className="h-[78px] rounded-[9px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${article.image}')` }} />
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[13px] font-black leading-snug text-fuku-black">{article.title}</h3>
              <p className="mt-1 line-clamp-1 text-[10px] font-bold text-fuku-gray">{article.description}</p>
              <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-black text-fuku-red">
                <span>{article.date}</span>
                {article.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
            <ArrowRight size={18} className="text-fuku-black" />
          </a>
        ))}
      </div>

      <a href={cms?.ctaHref ?? "/news"} className="mt-5 flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-fuku-black text-[13px] font-black text-white">
        {cms?.ctaText ?? "NEWSを見る"}
        <ArrowRight size={16} />
      </a>
    </section>
  );
}

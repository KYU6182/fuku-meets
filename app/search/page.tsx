"use client";

import { Coffee, Crown, Moon, Search, Send, UserRound, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import IconCard from "@/components/IconCard";
import LinkCard from "@/components/LinkCard";
import PageHero from "@/components/PageHero";
import SpotCard from "@/components/SpotCard";
import { icons } from "@/lib/data/icons";
import { newsArticles } from "@/lib/data/news";
import { spots } from "@/lib/data/spots";

const moods = ["ひとり時間", "デート", "友達", "夜遊び", "朝活", "雨の日"];
const genres = [
  { label: "カフェ", icon: Coffee },
  { label: "居酒屋", icon: Utensils },
  { label: "ラーメン", icon: Utensils },
  { label: "パン", icon: Coffee },
  { label: "美容室", icon: UserRound },
  { label: "シーシャ", icon: Moon },
  { label: "クラブ", icon: Crown },
  { label: "FUKU ICONS", icon: UserRound },
];
const areas = ["天神", "大名", "今泉", "薬院", "博多", "中洲"];
const popular = ["天神 夜カフェ", "深夜ラーメン", "福岡 初デート", "今週末 イベント"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const word = query.trim().toLowerCase();
    if (!word) return { spots: spots.slice(0, 3), icons: icons.slice(0, 2), news: newsArticles.slice(0, 2) };
    return {
      spots: spots.filter((spot) => [spot.name, spot.area, spot.category, ...spot.tags].join(" ").toLowerCase().includes(word)).slice(0, 5),
      icons: icons.filter((icon) => [icon.name, icon.area, icon.category].join(" ").toLowerCase().includes(word)).slice(0, 5),
      news: newsArticles.filter((article) => [article.title, article.category, article.summary].join(" ").toLowerCase().includes(word)).slice(0, 5),
    };
  }, [query]);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="SEARCH" copy="福岡の“行きたい”を探す。" />
        <section className="space-y-6 px-4 py-5">
          <label className="flex min-h-[50px] items-center gap-3 rounded-full border border-fuku-border bg-white px-4">
            <Search size={18} className="text-fuku-gray" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
              placeholder="店名・エリア・ジャンル・人で検索"
            />
          </label>
          <div className="rounded-[16px] border border-fuku-border bg-white p-4">
            <p className="text-[12px] font-black text-fuku-red">AI風検索</p>
            <button type="button" onClick={() => setQuery("天神 カフェ ひとり")} className="mt-2 text-left text-[15px] font-black leading-relaxed text-fuku-black">
              今夜、天神でひとりで入れるカフェ
            </button>
          </div>

          <ChipSection title="気分で探す" items={moods} onSelect={setQuery} />
          <div>
            <h2 className="mb-3 text-[17px] font-black">ジャンルから探す</h2>
            <div className="grid grid-cols-4 gap-2">
              {genres.map(({ label, icon: Icon }) => (
                <button key={label} type="button" onClick={() => setQuery(label)} className="min-h-[76px] rounded-[12px] border border-fuku-border bg-white text-[10px] font-black">
                  <Icon className="mx-auto mb-2" size={20} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <ChipSection title="エリアから探す" items={areas} onSelect={setQuery} />
          <ChipSection title="人気検索ワード" items={popular} onSelect={setQuery} />

          <div className="space-y-3">
            <h2 className="text-[17px] font-black">検索結果</h2>
            {results.spots.map((spot) => <SpotCard key={spot.slug} spot={spot} />)}
            {results.icons.map((icon) => <IconCard key={icon.slug} icon={icon} />)}
            {results.news.map((article) => (
              <LinkCard key={article.slug} href={`/news/${article.slug}`} title={article.title} description={article.summary} />
            ))}
          </div>

          <div className="grid gap-3">
            <LinkCard href="/forms/shop-recommend" title="店舗推薦" description="見つからないお店を編集部へ知らせる。" icon={<Send size={20} />} />
            <LinkCard href="/forms/contact" title="取材リクエスト" description="気になる人・店・街の取材希望を送る。" icon={<Send size={20} />} />
          </div>
        </section>
      </main>
      <BottomNav active="home" />
    </div>
  );
}

function ChipSection({ title, items, onSelect }: { title: string; items: string[]; onSelect: (value: string) => void }) {
  return (
    <div>
      <h2 className="mb-3 text-[17px] font-black">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button key={item} type="button" onClick={() => onSelect(item)} className="min-h-[36px] rounded-full border border-fuku-border bg-white px-4 text-[12px] font-black">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

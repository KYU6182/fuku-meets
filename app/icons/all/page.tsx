"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import IconCard from "@/components/IconCard";
import PageHero from "@/components/PageHero";
import { icons } from "@/lib/data/icons";

const genres = ["すべて", "モデル", "美容師", "DJ", "アーティスト", "インフルエンサー", "クリエイター", "学生"];
const areas = ["すべて", "天神", "大名", "薬院", "中洲", "六本松"];

export default function IconsAllPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("すべて");
  const [area, setArea] = useState("すべて");
  const [sort, setSort] = useState("人気順");
  const filtered = useMemo(() => {
    return [...icons]
      .filter((icon) => genre === "すべて" || icon.tab === genre)
      .filter((icon) => area === "すべて" || icon.area.includes(area))
      .filter((icon) => [icon.name, icon.category, icon.area].join(" ").toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sort === "新着順" ? b.rank - a.rank : b.votes - a.votes));
  }, [area, genre, query, sort]);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="FUKU ICONS ALL" copy="すべてのアイコンをチェック。" />
        <section className="space-y-4 px-4 py-5">
          <label className="flex min-h-[46px] items-center gap-2 rounded-full border border-fuku-border bg-white px-4">
            <Search size={17} className="text-fuku-gray" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
              placeholder="名前・ジャンル・エリアで検索"
            />
          </label>
          <ChipRow items={genres} value={genre} onChange={setGenre} />
          <ChipRow items={areas} value={area} onChange={setArea} />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 w-full rounded-full border border-fuku-border bg-white px-4 text-[13px] font-black"
          >
            {["人気順", "新着順", "投票数順", "急上昇"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="space-y-3">
            {filtered.map((icon) => (
              <IconCard key={icon.slug} icon={icon} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

function ChipRow({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`min-h-[36px] shrink-0 rounded-full px-4 text-[12px] font-black ${
            value === item ? "bg-fuku-red text-white" : "border border-fuku-border bg-white text-fuku-black"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

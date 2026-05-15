"use client";

import { Filter } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import SpotCard from "@/components/SpotCard";
import { spots } from "@/lib/data/spots";
import { weekendAreas, weekendMoods } from "@/lib/data/weekend";

export default function WeekendCategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;
  const [mood, setMood] = useState("");
  const [area, setArea] = useState("");
  const filtered = useMemo(
    () =>
      spots.filter((spot) => {
        const categoryMatch = category === "ranking" || spot.category === category;
        const moodMatch = !mood || spot.moods.includes(mood) || spot.tags.includes(mood);
        const areaMatch = !area || spot.area === area;
        return categoryMatch && moodMatch && areaMatch;
      }),
    [area, category, mood],
  );

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="WEEKEND GUIDE" copy={`${categoryLabel(category)}を探す`} description="気分とエリアで、週末の行き先を絞り込めます。" />
        <section className="space-y-4 px-4 py-5">
          <h2 className="flex items-center gap-2 text-[16px] font-black"><Filter size={18} className="text-fuku-red" />条件を選ぶ</h2>
          <ChipRow items={weekendMoods} value={mood} onChange={setMood} />
          <ChipRow items={weekendAreas} value={area} onChange={setArea} />
          <div className="space-y-3">
            {filtered.length > 0 ? filtered.map((spot) => <SpotCard key={spot.slug} spot={spot} />) : <EmptyState message="条件に合うお店を準備中です" />}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

function categoryLabel(category: string) {
  const map: Record<string, string> = {
    izakaya: "居酒屋",
    ramen: "ラーメン",
    beauty: "美容室",
    cafe: "カフェ",
    bakery: "パン",
    shisha: "シーシャ",
    club: "クラブ",
    ranking: "人気ランキング",
  };
  return map[category] ?? "福岡スポット";
}

function ChipRow({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      {["", ...items].map((item) => (
        <button
          key={item || "all"}
          type="button"
          onClick={() => onChange(item)}
          className={`min-h-[36px] shrink-0 rounded-full px-4 text-[12px] font-black ${value === item ? "bg-fuku-red text-white" : "border border-fuku-border bg-white"}`}
        >
          {item || "すべて"}
        </button>
      ))}
    </div>
  );
}

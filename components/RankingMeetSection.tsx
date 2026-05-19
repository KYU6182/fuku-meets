"use client";

import { ArrowRight, Building2, Moon, ShoppingBasket, Train } from "lucide-react";
import { useEffect, useState } from "react";
import RankingVoteButton from "./RankingVoteButton";
import type { HomeCmsData } from "@/types/cms";

type RankingEntry = {
  rank: number;
  name: string;
  votes: string;
  image: string;
  href: string;
  rankingSlug: string;
  entrySlug: string;
};

type RankingTheme = {
  id: string;
  title: string;
  description: string;
  icon: typeof ShoppingBasket;
  href: string;
  entries: RankingEntry[];
};

type ApiRankingEntry = {
  slug?: string;
  name?: string;
  votes?: number | string;
  rank?: number;
  image?: string;
  thumbnailUrl?: string;
};

type ApiRankingTheme = {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  entries?: ApiRankingEntry[];
};

const rankingThemes: RankingTheme[] = [
  {
    id: "supermarket",
    title: "好きなスーパー",
    description: "日常の味方！通いやすくて、品ぞろえも◎",
    icon: ShoppingBasket,
    href: "/ranking?theme=supermarket",
    entries: [
      { rank: 1, name: "ボンラパス", votes: "1,842票", image: "/images/ranking/super-bonrepas.jpg", href: "/ranking/supermarket/bon-repas", rankingSlug: "supermarket", entrySlug: "bon-repas" },
      { rank: 2, name: "ハローデイ", votes: "1,233票", image: "/images/ranking/super-halloday.jpg", href: "/ranking/supermarket/halloday", rankingSlug: "supermarket", entrySlug: "halloday" },
      { rank: 3, name: "サニー", votes: "987票", image: "/images/ranking/super-sunny.jpg", href: "/ranking/supermarket/sunny", rankingSlug: "supermarket", entrySlug: "sunny" },
    ],
  },
  {
    id: "station",
    title: "好きな駅",
    description: "通勤・通学も、おでかけも。よく使う駅はここ！",
    icon: Train,
    href: "/ranking?theme=station",
    entries: [
      { rank: 1, name: "薬院駅", votes: "2,169票", image: "/images/ranking/station-yakuin.jpg", href: "/ranking/station/yakuin-station", rankingSlug: "station", entrySlug: "yakuin-station" },
      { rank: 2, name: "天神駅", votes: "1,732票", image: "/images/ranking/station-tenjin.jpg", href: "/ranking/station/tenjin-station", rankingSlug: "station", entrySlug: "tenjin-station" },
      { rank: 3, name: "博多駅", votes: "1,421票", image: "/images/ranking/station-hakata.jpg", href: "/ranking/station/hakata-station", rankingSlug: "station", entrySlug: "hakata-station" },
    ],
  },
  {
    id: "city",
    title: "住みたい街",
    description: "住むならこんな街に暮らしたい！",
    icon: Building2,
    href: "/ranking?theme=city",
    entries: [
      { rank: 1, name: "薬院", votes: "1,876票", image: "/images/ranking/city-yakuin.jpg", href: "/ranking/area/yakuin", rankingSlug: "area", entrySlug: "yakuin" },
      { rank: 2, name: "大名", votes: "1,312票", image: "/images/ranking/city-daimyo.jpg", href: "/ranking/area/daimyo", rankingSlug: "area", entrySlug: "daimyo" },
      { rank: 3, name: "六本松", votes: "1,089票", image: "/images/ranking/city-ropponmatsu.jpg", href: "/ranking/area/ropponmatsu", rankingSlug: "area", entrySlug: "ropponmatsu" },
    ],
  },
  {
    id: "late-night",
    title: "深夜助かる場所",
    description: "遅くなった日も、ここがあると安心。",
    icon: Moon,
    href: "/ranking?theme=late-night",
    entries: [
      { rank: 1, name: "セブンイレブン", votes: "2,243票", image: "/images/ranking/night-seven.jpg", href: "/ranking/late-night/seven-eleven", rankingSlug: "late-night", entrySlug: "seven-eleven" },
      { rank: 2, name: "TRIAL GO", votes: "1,498票", image: "/images/ranking/night-trial.jpg", href: "/ranking/late-night/trial-go", rankingSlug: "late-night", entrySlug: "trial-go" },
      { rank: 3, name: "すき家", votes: "1,205票", image: "/images/ranking/night-sukiya.jpg", href: "/ranking/late-night/sukiya", rankingSlug: "late-night", entrySlug: "sukiya" },
    ],
  },
];

function iconForTheme(id: string) {
  if (id.includes("station")) return Train;
  if (id.includes("city") || id.includes("area")) return Building2;
  if (id.includes("night")) return Moon;
  return ShoppingBasket;
}

function normalizeThemes(items: ApiRankingTheme[]): RankingTheme[] {
  return items
    .filter((item) => item.title)
    .slice(0, 4)
    .map((theme) => {
      const id = theme.slug || theme.id || "ranking";
      return {
        id,
        title: theme.title || "ランキング",
        description: theme.description || "みんなの“好き”を集めたランキング",
        icon: iconForTheme(id),
        href: `/ranking?theme=${encodeURIComponent(id)}`,
        entries: (theme.entries ?? []).slice(0, 3).map((entry, index) => ({
          rank: entry.rank || index + 1,
          name: entry.name || `候補 ${index + 1}`,
          votes: `${Number(entry.votes ?? 0).toLocaleString("ja-JP")}票`,
          image: entry.image || entry.thumbnailUrl || "/images/ranking/super-bonrepas.jpg",
          href: `/ranking/${id}/${entry.slug || entry.name || index + 1}`,
          rankingSlug: id,
          entrySlug: entry.slug || String(index + 1),
        })),
      };
    });
}

const badgeClass: Record<number, string> = {
  1: "bg-[#f5b400]",
  2: "bg-[#9ca3af]",
  3: "bg-[#c9824a]",
};

function TopCard({ entry }: { entry: RankingEntry }) {
  return (
    <div className="overflow-hidden rounded-[9px] border border-fuku-border bg-[#f8f8f8]">
      <a href={entry.href} className="relative block aspect-[16/10] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${entry.image}')` }}>
        <span className={`absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-br-[6px] text-[14px] font-black text-white ${badgeClass[entry.rank] ?? "bg-fuku-red"}`}>
          {entry.rank}
        </span>
      </a>
      <div className="p-2">
        <a href={entry.href} className="line-clamp-1 text-[12px] font-black leading-tight text-fuku-black">{entry.name}</a>
        <p className="mt-1 text-[10px] font-black text-fuku-gray">{entry.votes}</p>
        <div className="mt-2 grid grid-cols-2 gap-1">
          <RankingVoteButton rankingSlug={entry.rankingSlug} entrySlug={entry.entrySlug} compact />
          <a href={entry.href} className="rounded-full border border-fuku-border px-2 py-1 text-center text-[10px] font-black text-fuku-black">
            詳細
          </a>
        </div>
      </div>
    </div>
  );
}

export default function RankingMeetSection({ cms }: { cms?: HomeCmsData["ranking"] }) {
  const [themes, setThemes] = useState<RankingTheme[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/content/rankings", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: { items?: ApiRankingTheme[] }) => {
        if (mounted) setThemes(normalizeThemes(data.items ?? []));
      })
      .catch(() => {
        if (mounted) setThemes([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (cms?.isVisible === false) return null;
  return (
    <section className="mt-8 border-y border-[#eee] bg-white px-4 py-8">
      <p className="headline-condensed text-[39px] uppercase leading-none text-fuku-black">{cms?.title ?? "FUKUOKA RANKING"}</p>
      <h2 className="mt-3 text-[19px] font-black leading-tight text-fuku-black">{cms?.subtitle ?? "みんなの“いつもの福岡”ランキング"}</h2>
      <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "暮らしの中で見つけた、リアルに助かる・通いたくなるお気に入りをシェアしよう。"}</p>

      <div className="mt-6 grid gap-3">
        {themes.length ? themes.map((theme) => {
          const Icon = theme.icon;
          return (
            <article key={theme.id} className="rounded-[12px] border border-[#eadfd8] bg-white p-3 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <Icon className="mt-0.5 shrink-0 text-[#e85b61]" size={23} />
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-black leading-tight text-fuku-black">{theme.title}</h3>
                    <p className="mt-1 text-[10px] font-bold leading-relaxed text-fuku-gray">{theme.description}</p>
                  </div>
                </div>
                <a href={theme.href} className="shrink-0 text-[10px] font-black text-fuku-black">詳細 ＞</a>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {theme.entries.map((entry) => (
                  <TopCard key={entry.name} entry={entry} />
                ))}
              </div>
            </article>
          );
        }) : (
          <div className="rounded-[16px] border border-dashed border-fuku-border bg-[#fbfaf7] p-6 text-center">
            <p className="text-[18px] font-black text-fuku-black">ランキングは準備中です</p>
            <p className="mt-2 text-[12px] font-bold text-fuku-gray">公開されたランキングが登録されると、ここに表示されます。</p>
          </div>
        )}
      </div>

      <a href={cms?.ctaHref ?? "/ranking"} className="mx-auto mt-6 flex min-h-[48px] w-4/5 items-center justify-center gap-3 rounded-full bg-fuku-red text-[14px] font-black text-white">
        {cms?.ctaText ?? "ランキングページへ"}
        <ArrowRight size={17} />
      </a>
    </section>
  );
}

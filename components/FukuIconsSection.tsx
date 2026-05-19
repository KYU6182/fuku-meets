"use client";

import { ArrowRight, Heart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import IconVoteButton from "./IconVoteButton";
import type { HomeCmsData } from "@/types/cms";

type IconData = {
  rank: number;
  image: string;
  name: string;
  genre: string;
  votes: string;
};

type FukuIconsSectionProps = {
  iconsData: IconData[];
  cms?: HomeCmsData["fukuIcons"];
};

type RankedIcon = {
  rank: number;
  name: string;
  genre: string;
  area: string;
  votes: string;
  votesNumber: number;
  image: string;
  href: string;
  slug: string;
  profile?: string;
  attentionScore?: string | number;
};

const defaultRanking: RankedIcon[] = [
  { rank: 1, name: "YUI", genre: "model / creator", area: "天神エリア", votes: "2,430票", votesNumber: 2430, image: "/images/icons/yui.jpg", href: "/icons/yui", slug: "yui", profile: "福岡から全国へ。いま注目したい次世代アイコン。", attentionScore: "98.7" },
  { rank: 2, name: "RENA", genre: "model", area: "大名エリア", votes: "1,982票", votesNumber: 1982, image: "/images/icons/rena.jpg", href: "/icons/rena", slug: "rena", profile: "", attentionScore: "95.4" },
  { rank: 3, name: "ANNA", genre: "model", area: "天神エリア", votes: "1,540票", votesNumber: 1540, image: "/images/icons/anna.jpg", href: "/icons/anna", slug: "anna", profile: "", attentionScore: "91.2" },
];

type ApiIcon = {
  slug?: string;
  name?: string;
  category?: string;
  area?: string;
  image?: string;
  avatarUrl?: string;
  profile?: string;
  votes?: number | string;
  supportCount?: number | string;
  rank?: number;
  attentionScore?: number | string;
  updatedAt?: string;
  createdAt?: string;
};

function rerankIcons(items: RankedIcon[]) {
  return [...items]
    .sort((a, b) => b.votesNumber - a.votesNumber || a.name.localeCompare(b.name))
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      votes: `${item.votesNumber.toLocaleString("ja-JP")}票`,
    }));
}

function normalizeIcons(items: ApiIcon[]) {
  if (!items.length) return defaultRanking;
  return rerankIcons(
    items
      .map((item, index) => ({
        rank: index + 1,
        name: item.name || "NO NAME",
        genre: item.category || "creator",
        area: item.area || "福岡エリア",
        votes: "",
        votesNumber: Number(item.votes ?? item.supportCount ?? 0),
        image: item.image || item.avatarUrl || "/images/icons/yui.jpg",
        href: `/icons/${item.slug || item.name || index + 1}`,
        slug: item.slug || String(item.name || index + 1),
        profile: item.profile,
        attentionScore: item.attentionScore,
      }))
      .slice(0, 6),
  ).slice(0, 3);
}

const badgeClass: Record<number, string> = {
  1: "bg-[#f5b400]",
  2: "bg-[#9ca3af]",
  3: "bg-[#c9824a]",
};

export default function FukuIconsSection({ cms }: FukuIconsSectionProps) {
  const [ranking, setRanking] = useState(() => normalizeIcons([]));

  useEffect(() => {
    let mounted = true;
    fetch("/api/content/icons", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: { items?: ApiIcon[] }) => {
        if (mounted && data.items?.length) setRanking(normalizeIcons(data.items));
      })
      .catch(() => {
        if (mounted) setRanking(normalizeIcons([]));
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (cms?.isVisible === false) return null;
  const weekly = ranking[0];

  function updateVotes(slug: string, nextVotes?: number) {
    setRanking((current) =>
      rerankIcons(
        current.map((person) =>
          person.slug === slug
            ? { ...person, votesNumber: nextVotes ?? person.votesNumber + 1 }
            : person,
        ),
      ),
    );
  }

  return (
    <section className="mt-8 border-y border-fuku-border bg-white px-5 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="headline-condensed text-[38px] uppercase leading-none text-fuku-black">{cms?.title ?? "FUKU ICONS"}</p>
          <p className="mt-2 text-[14px] font-black text-fuku-black">{cms?.subtitle ?? "福岡をつくる、注目のアイコンたち。"}</p>
        </div>
        <a href={cms?.ctaHref ?? "/icons"} className="mt-2 shrink-0 text-[12px] font-black text-fuku-black">すべて見る →</a>
      </div>

      <article className="mt-5 overflow-hidden rounded-[16px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <p className="headline-condensed text-[24px] uppercase leading-none text-fuku-black">WEEKLY ICON</p>
          <span className="rounded-full border border-fuku-red px-2 py-1 text-[10px] font-black text-fuku-red">今週の注目アイコン</span>
        </div>
        <div className="mt-4 grid gap-4 min-[390px]:grid-cols-[150px_1fr]">
          <a href={weekly.href} className="block aspect-[4/3] rounded-[12px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${weekly.image}')` }} />
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="headline-condensed text-[42px] uppercase leading-none text-fuku-black">{weekly.name}</h3>
                <p className="mt-1 text-[12px] font-black text-fuku-gray">{weekly.genre}</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] font-black leading-relaxed text-fuku-black">
              {weekly.profile || "福岡から全国へ。いま注目したい次世代アイコン。"}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-black text-fuku-black">
              <span className="inline-flex items-center gap-1"><MapPin size={14} /> {weekly.area.replace("エリア", "")}</span>
              <span className="text-fuku-red">注目度<br />{weekly.attentionScore || "98.7"}%</span>
              <span>投票数<br />{weekly.votes.replace("票", "")}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={weekly.href} className="flex min-h-[42px] items-center justify-center rounded-[9px] bg-fuku-red text-[12px] font-black text-white">プロフィールを見る</a>
              <IconVoteButton
                slug={weekly.slug}
                className="min-h-[42px] rounded-[9px] border border-fuku-red bg-white px-3 text-[12px] text-fuku-red"
                onVoted={(payload) => updateVotes(weekly.slug, payload?.votes)}
              />
            </div>
          </div>
        </div>
      </article>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="headline-condensed text-[28px] uppercase leading-none text-fuku-black">ICONS RANKING</h3>
        <a href="/icons/all" className="text-[11px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {ranking.map((person) => (
          <article key={person.name} className="relative rounded-[12px] border border-fuku-border bg-white p-2 text-center shadow-soft">
            <span className={`absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-[5px] text-[12px] font-black text-white ${badgeClass[person.rank]}`}>
              {person.rank}
            </span>
            <a href={person.href} className="mx-auto mt-2 block h-16 w-16 rounded-full bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${person.image}')` }} />
            <a href={person.href} className="mt-2 block text-[14px] font-black leading-none text-fuku-black">{person.name}</a>
            <p className="mt-1 text-[9px] font-black leading-tight text-fuku-gray">{person.genre}</p>
            <p className="mt-1 text-[9px] font-black text-fuku-gray">{person.area}</p>
            <p className="mt-1 text-[10px] font-black text-fuku-black">{person.votes}</p>
            <div className="mt-2 grid gap-1">
              <IconVoteButton
                slug={person.slug}
                className="min-h-[34px] rounded-[8px] px-2 text-[10px]"
                onVoted={(payload) => updateVotes(person.slug, payload?.votes)}
              />
              <a href={person.href} className="flex min-h-[32px] items-center justify-center rounded-[8px] border border-fuku-border text-[10px] font-black text-fuku-black">
                プロフィール
              </a>
            </div>
          </article>
        ))}
      </div>

      <a href={cms?.ctaHref ?? "/icons"} className="mt-5 flex min-h-[88px] items-center gap-4 rounded-[12px] border border-fuku-border bg-[#fbfaf7] p-4 shadow-soft">
        <div className="min-w-0 flex-1">
          <p className="headline-condensed text-[24px] uppercase leading-none text-fuku-black">{cms?.ctaText ?? "FUKU ICONSを見る"}</p>
          <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "福岡で輝くアイコンたちのインタビューや特集をチェック。"}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-fuku-black">
          <ArrowRight size={18} />
        </span>
      </a>

    </section>
  );
}

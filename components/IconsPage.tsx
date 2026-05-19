"use client";

import { MapPin, Quote, UserRound, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import IconVoteButton from "./IconVoteButton";
import { useToast } from "./Toast";
import { getDefaultIconsCmsData, getPublishedIconsAsync } from "@/lib/cms";
import type { IconsCmsData } from "@/types/cms";

type IconPerson = {
  rank: number;
  slug: string;
  name: string;
  category: string;
  tab: string;
  area: string;
  votes: number;
  image: string;
  heroImage?: string;
  profile?: string;
  attention?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiIcon = Record<string, unknown>;

const categoryTabs = ["すべて", "モデル", "美容師", "DJ", "アーティスト", "インフルエンサー", "クリエイター", "学生"];

const iconSpots = [
  {
    title: "ICONSが通う薬院カフェ",
    description: "こだわりのラテと居心地のよい空間。",
    area: "薬院エリア",
    image: "/images/spots/cafe-yakuin.jpg",
  },
  {
    title: "大名のヘアサロン",
    description: "撮影前にも立ち寄りやすい人気サロン。",
    area: "大名エリア",
    image: "/images/spots/salon-daimyo.jpg",
  },
  {
    title: "中洲の音楽イベント",
    description: "福岡の夜を熱くするローカルパーティー。",
    area: "中洲エリア",
    image: "/images/spots/club-nakasu.jpg",
  },
];

const comments = [
  {
    user: "@fuku_love",
    text: "自然体なのに芯があって、見ているだけで元気をもらえます！",
  },
  {
    user: "@tenjin_girl",
    text: "福岡っぽい感性がある。福岡らしさを大切にしているところが◎",
  },
  {
    user: "@camera_lover",
    text: "撮影の世界観がかっこいい。いつもチェックしています！",
  },
];

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function dateValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function sortIcons(items: IconPerson[]) {
  return [...items]
    .sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      const bTime = Date.parse(b.updatedAt || b.createdAt || "");
      const aTime = Date.parse(a.updatedAt || a.createdAt || "");
      if (Number.isFinite(bTime) && Number.isFinite(aTime) && bTime !== aTime) return bTime - aTime;
      return a.name.localeCompare(b.name);
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function normalizeIcons(items: ApiIcon[]) {
  return sortIcons(
    items.map((item, index) => {
      const slug = stringValue(item.slug, stringValue(item.id, `${index + 1}`));
      const category = stringValue(item.category, "creator");
      const image =
        stringValue(item.avatarUrl) ||
        stringValue(item.avatar_url) ||
        stringValue(item.profileImage) ||
        stringValue(item.image) ||
        stringValue(item.heroImageUrl) ||
        stringValue(item.hero_image_url) ||
        "/images/icons/yui.jpg";

      return {
        rank: index + 1,
        slug,
        name: stringValue(item.name, "NO NAME"),
        category,
        tab: category,
        area: stringValue(item.area, "福岡エリア"),
        votes: numberValue(item.supportCount, numberValue(item.support_count, numberValue(item.votes, 0))),
        image,
        heroImage: stringValue(item.heroImageUrl) || stringValue(item.hero_image_url) || image,
        profile:
          stringValue(item.profileText) ||
          stringValue(item.profile_text) ||
          stringValue(item.profile) ||
          stringValue(item.copy) ||
          "福岡から全国へ。いま注目したい次世代アイコン。",
        attention: stringValue(item.attentionScore) || stringValue(item.attention_score) || "98.7%",
        createdAt: dateValue(item.createdAt) || dateValue(item.created_at),
        updatedAt: dateValue(item.updatedAt) || dateValue(item.updated_at),
      };
    }),
  );
}

function formatVotes(votes: number) {
  return votes.toLocaleString("ja-JP");
}

function updatePersonVotes(people: IconPerson[], slug: string, nextVotes?: number) {
  return sortIcons(
    people.map((person) =>
      person.slug === slug
        ? {
            ...person,
            votes: nextVotes ?? person.votes + 1,
            updatedAt: new Date().toISOString(),
          }
        : person,
    ),
  );
}

function IconsHero({ cms }: { cms: IconsCmsData }) {
  return (
    <section className="border-b border-fuku-border bg-white px-5 py-8">
      <h1 className="headline-condensed text-[58px] uppercase leading-[0.9] text-fuku-black">{cms.title}</h1>
      <p className="mt-4 text-[17px] font-black leading-relaxed text-fuku-black">{cms.subtitle}</p>
      <p className="mt-4 max-w-[350px] text-[13px] font-bold leading-relaxed text-fuku-black">{cms.heroDescription}</p>
    </section>
  );
}

function WeeklyIconCard({ person, onVote }: { person: IconPerson; onVote: (slug: string, votes?: number) => void }) {
  return (
    <section className="bg-white px-4 py-6">
      <article className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="headline-condensed text-[29px] uppercase leading-none text-fuku-black">WEEKLY ICON</h2>
          <span className="rounded-full border border-fuku-red px-3 py-1 text-[10px] font-black text-fuku-red">今週の注目アイコン</span>
        </div>
        <div className="grid gap-4 min-[390px]:grid-cols-[1.08fr_.92fr]">
          <a
            href={`/icons/${person.slug}`}
            className="min-h-[330px] rounded-[16px] bg-fuku-light bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.08), rgba(17,17,17,.08)), url('${person.heroImage || person.image}')`,
              backgroundPosition: "center top",
            }}
          />
          <div className="min-w-0">
            <h3 className="headline-condensed text-[48px] uppercase leading-none text-fuku-black">{person.name}</h3>
            <p className="mt-2 text-[16px] font-black text-fuku-gray">{person.category}</p>
            <p className="mt-5 text-[15px] font-black leading-relaxed text-fuku-black">{person.profile}</p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Metric label="エリア" value={person.area.replace("エリア", "")} />
              <Metric label="注目度" value={person.attention || "98.7%"} accent />
              <Metric label="投票数" value={formatVotes(person.votes)} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={`/icons/${person.slug}`}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-fuku-red px-3 text-[13px] font-black text-white"
              >
                <UserRound size={17} />
                プロフィールを見る
              </a>
              <IconVoteButton
                slug={person.slug}
                variant="outline"
                className="min-h-[54px] rounded-[10px] px-3 text-[13px]"
                onVoted={(payload) => onVote(person.slug, payload?.supportCount ?? payload?.votes)}
              />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-black text-fuku-gray">{label}</p>
      <p className={`mt-1 text-[14px] font-black ${accent ? "text-fuku-red" : "text-fuku-black"}`}>{value}</p>
    </div>
  );
}

function IconCategoryTabs({ selectedCategory, onSelect }: { selectedCategory: string; onSelect: (category: string) => void }) {
  return (
    <div className="bg-white px-4 pb-5">
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {categoryTabs.slice(0, 5).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            className={`min-h-[48px] min-w-[108px] shrink-0 rounded-full border px-6 text-[14px] font-black ${
              selectedCategory === tab ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white text-fuku-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-[#f5b400]";
  if (rank === 2) return "bg-[#9ca3af]";
  if (rank === 3) return "bg-[#c9824a]";
  return "bg-fuku-black";
}

function TopIconCard({ person, onVote }: { person: IconPerson; onVote: (slug: string, votes?: number) => void }) {
  return (
    <article className="min-w-[236px] overflow-hidden rounded-[14px] border border-fuku-border bg-white shadow-soft">
      <div className="relative">
        <span className={`absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-[7px] text-[17px] font-black text-white ${rankBadgeClass(person.rank)}`}>
          {person.rank}
        </span>
        <a
          href={`/icons/${person.slug}`}
          className="block h-[180px] bg-fuku-light bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.08), rgba(17,17,17,.12)), url('${person.image}')`,
            backgroundPosition: "center top",
          }}
        />
      </div>
      <div className="p-4">
        <a href={`/icons/${person.slug}`} className="headline-condensed block text-[27px] uppercase leading-none text-fuku-black">
          {person.name}
        </a>
        <p className="mt-1 text-[12px] font-black text-fuku-gray">{person.category}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-[12px] font-black text-fuku-gray">
          <MapPin size={15} />
          {person.area}
        </p>
        <p className="mt-2 text-[17px] font-black text-fuku-black">{formatVotes(person.votes)}票</p>
        <div className="mt-4 grid gap-2">
          <a
            href={`/icons/${person.slug}`}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[9px] bg-fuku-red px-3 text-[12px] font-black text-white"
          >
            <UserRound size={15} />
            プロフィールを見る
          </a>
          <IconVoteButton
            slug={person.slug}
            variant="outline"
            className="min-h-[44px] rounded-[9px] px-3 text-[12px]"
            onVoted={(payload) => onVote(person.slug, payload?.supportCount ?? payload?.votes)}
          />
        </div>
      </div>
    </article>
  );
}

function IconsRanking({ people, onVote }: { people: IconPerson[]; onVote: (slug: string, votes?: number) => void }) {
  const topPeople = people.slice(0, 6);

  return (
    <section className="bg-white px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="headline-condensed text-[34px] uppercase leading-none text-fuku-black">ICONS RANKING</h2>
        <a href="/icons/all" className="text-[12px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {topPeople.map((person) => (
          <TopIconCard key={person.slug} person={person} onVote={onVote} />
        ))}
      </div>
    </section>
  );
}

function NewFaceSection({ people, onVote }: { people: IconPerson[]; onVote: (slug: string, votes?: number) => void }) {
  const newFaces = [...people]
    .sort((a, b) => Date.parse(b.createdAt || "") - Date.parse(a.createdAt || ""))
    .slice(0, 6);

  if (newFaces.length === 0) return null;

  return (
    <section className="border-t border-fuku-border bg-white px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-end gap-4">
          <h2 className="headline-condensed text-[36px] uppercase leading-none text-fuku-black">NEW FACE</h2>
          <p className="pb-1 text-[12px] font-black text-fuku-black">新しく参加したFUKU ICONS</p>
        </div>
        <a href="/icons/all" className="shrink-0 text-[12px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {newFaces.map((person) => (
          <article key={person.slug} className="grid min-w-[286px] grid-cols-[124px_1fr] overflow-hidden rounded-[16px] border border-fuku-border bg-white shadow-soft">
            <a
              href={`/icons/${person.slug}`}
              className="relative min-h-[196px] bg-fuku-light bg-cover bg-center"
              style={{ backgroundImage: `url('${person.image}')`, backgroundPosition: "center top" }}
            >
              <span className="absolute left-3 top-3 rounded-[7px] bg-fuku-red px-3 py-2 text-[12px] font-black text-white">NEW</span>
            </a>
            <div className="flex min-w-0 flex-col justify-center p-4">
              <h3 className="headline-condensed text-[28px] uppercase leading-none text-fuku-black">{person.name}</h3>
              <p className="mt-2 text-[14px] font-black text-fuku-black">{person.category}</p>
              <p className="mt-3 text-[12px] font-black text-fuku-gray">{person.area}</p>
              <div className="mt-5 grid gap-2">
                <a href={`/icons/${person.slug}`} className="flex min-h-[42px] items-center justify-center gap-2 rounded-[8px] bg-fuku-red text-[12px] font-black text-white">
                  <UserRound size={15} />
                  プロフィールを見る
                </a>
                <IconVoteButton
                  slug={person.slug}
                  variant="outline"
                  className="min-h-[42px] rounded-[8px] px-3 text-[12px]"
                  onVoted={(payload) => onVote(person.slug, payload?.supportCount ?? payload?.votes)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function IconsSpotSection() {
  return (
    <section className="bg-white px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-black text-fuku-black">ICONSが通う店</h2>
        <a href="/search" className="text-[12px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {iconSpots.map((spot) => (
          <article key={spot.title} className="min-w-[190px] overflow-hidden rounded-[14px] border border-fuku-border bg-white">
            <div
              className="h-[116px] bg-fuku-light bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.1), rgba(17,17,17,.16)), url('${spot.image}')` }}
            />
            <div className="p-3">
              <h3 className="text-[13px] font-black leading-snug text-fuku-black">{spot.title}</h3>
              <p className="mt-2 text-[11px] font-bold leading-relaxed text-fuku-gray">{spot.description}</p>
              <p className="mt-2 flex items-center gap-1 text-[10px] font-black text-fuku-black">
                <MapPin size={12} />
                {spot.area}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function IconCommentsSection() {
  return (
    <section className="bg-white px-4 pb-28 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-black text-fuku-black">みんなの推しコメント</h2>
        <a href="/icons/comments" className="text-[11px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {comments.map((comment) => (
          <article key={comment.user} className="min-w-[236px] rounded-[12px] border border-fuku-border bg-white p-4">
            <Quote size={25} className="text-fuku-black" />
            <p className="mt-3 text-[12px] font-bold leading-relaxed text-fuku-black">{comment.text}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-fuku-light">
                <Users size={14} />
              </span>
              <p className="text-[11px] font-black text-fuku-black">{comment.user}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function IconsPage() {
  const [cms, setCms] = useState<IconsCmsData>(() => getDefaultIconsCmsData());
  const [people, setPeople] = useState<IconPerson[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  useEffect(() => {
    let mounted = true;
    void getPublishedIconsAsync().then((published) => {
      if (mounted) setCms(published);
    });

    fetch("/api/content/icons", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: { items?: ApiIcon[] }) => {
        if (mounted) setPeople(normalizeIcons(data.items ?? []));
      })
      .catch(() => {
        if (mounted) setPeople([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visiblePeople = useMemo(() => {
    if (selectedCategory === "すべて") return people;
    return sortIcons(people.filter((person) => person.tab === selectedCategory || person.category.includes(selectedCategory)));
  }, [people, selectedCategory]);

  function handleVote(slug: string, votes?: number) {
    setPeople((current) => updatePersonVotes(current, slug, votes));
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main>
        <IconsHero cms={cms} />
        {people.length ? (
          <>
            <WeeklyIconCard person={people[0]} onVote={handleVote} />
            <IconCategoryTabs selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
            <IconsRanking people={visiblePeople} onVote={handleVote} />
            <NewFaceSection people={people} onVote={handleVote} />
            <IconsSpotSection />
          </>
        ) : (
          <section className="bg-white px-4 py-10">
            <div className="rounded-[16px] border border-dashed border-fuku-border bg-[#fbfaf7] p-6 text-center">
              <p className="text-[18px] font-black text-fuku-black">FUKU ICONSは準備中です</p>
              <p className="mt-2 text-[12px] font-bold text-fuku-gray">管理画面から公開されたアイコンが登録されると、ここに表示されます。</p>
            </div>
          </section>
        )}
        <IconCommentsSection />
      </main>
      <BottomNav active="home" />
      <PageToastBridge />
    </div>
  );
}

function PageToastBridge() {
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    const handler = (event: Event) => {
      showToast((event as CustomEvent<string>).detail);
    };
    window.addEventListener("fuku-toast", handler);
    return () => window.removeEventListener("fuku-toast", handler);
  }, [showToast]);

  return <ToastViewport />;
}

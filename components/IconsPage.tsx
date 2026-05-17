"use client";

import {
  ArrowRight,
  Bookmark,
  Crown,
  Flame,
  Heart,
  MapPin,
  Megaphone,
  Quote,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { addToLocalList, useToast } from "./Toast";
import IconActionButtons from "./IconActionButtons";
import { getDefaultIconsCmsData, getPublishedIcons } from "@/lib/cms";
import { supportIcon } from "@/lib/iconVoteSystem";
import { storageKeys } from "@/lib/storageKeys";
import type { IconsCmsData } from "@/types/cms";

type IconPerson = {
  rank: number;
  name: string;
  category: string;
  tab: string;
  area: string;
  votes: number;
  image: string;
};

type NewFace = {
  name: string;
  category: string;
  area: string;
  image: string;
};

type IconSpot = {
  title: string;
  description: string;
  area: string;
  image: string;
};

const categoryTabs = [
  "すべて",
  "モデル",
  "美容師",
  "DJ",
  "アーティスト",
  "インフルエンサー",
  "クリエイター",
  "学生",
];

const iconsRanking: IconPerson[] = [
  {
    rank: 1,
    name: "YUI",
    category: "model / creator",
    tab: "モデル",
    area: "天神エリア",
    votes: 2430,
    image: "/images/icons/yui.jpg",
  },
  {
    rank: 2,
    name: "RENA",
    category: "model",
    tab: "モデル",
    area: "大名エリア",
    votes: 1982,
    image: "/images/icons/rena.jpg",
  },
  {
    rank: 3,
    name: "ANNA",
    category: "model",
    tab: "モデル",
    area: "天神エリア",
    votes: 1540,
    image: "/images/icons/anna.jpg",
  },
  {
    rank: 4,
    name: "MIO",
    category: "model",
    tab: "モデル",
    area: "薬院エリア",
    votes: 1322,
    image: "/images/icons/mio.jpg",
  },
  {
    rank: 5,
    name: "SORA",
    category: "美容師 / creator",
    tab: "美容師",
    area: "大名エリア",
    votes: 1108,
    image: "/images/icons/sora.jpg",
  },
  {
    rank: 6,
    name: "KEITA",
    category: "DJ / producer",
    tab: "DJ",
    area: "中洲エリア",
    votes: 987,
    image: "/images/icons/keita.jpg",
  },
  {
    rank: 7,
    name: "AOI",
    category: "artist",
    tab: "アーティスト",
    area: "今泉エリア",
    votes: 842,
    image: "/images/icons/aoi.jpg",
  },
  {
    rank: 8,
    name: "RINA",
    category: "influencer",
    tab: "インフルエンサー",
    area: "天神エリア",
    votes: 790,
    image: "/images/icons/rina.jpg",
  },
  {
    rank: 9,
    name: "KENTO",
    category: "creator",
    tab: "クリエイター",
    area: "大名エリア",
    votes: 734,
    image: "/images/icons/kento.jpg",
  },
  {
    rank: 10,
    name: "NANA",
    category: "student creator",
    tab: "学生",
    area: "六本松エリア",
    votes: 688,
    image: "/images/icons/nana.jpg",
  },
];

const newFaces: NewFace[] = [
  { name: "HARU", category: "モデル", area: "薬院エリア", image: "/images/icons/haru.jpg" },
  { name: "KENTO", category: "クリエイター", area: "大名エリア", image: "/images/icons/kento.jpg" },
  { name: "RINA", category: "インフルエンサー", area: "天神エリア", image: "/images/icons/rina.jpg" },
];

const iconSpots: IconSpot[] = [
  {
    title: "YUIが通う薬院カフェ",
    description: "こだわりのラテと居心地のよい空間。",
    area: "薬院エリア",
    image: "/images/spots/cafe-yakuin.jpg",
  },
  {
    title: "RENAが行く大名の美容室",
    description: "デザインカラーが得意な人気サロン。",
    area: "大名エリア",
    image: "/images/spots/salon-daimyo.jpg",
  },
  {
    title: "KEITA出演のクラブイベント",
    description: "福岡の夜を熱くする人気パーティー。",
    area: "中洲エリア",
    image: "/images/spots/club-nakasu.jpg",
  },
];

const comments = [
  {
    user: "@fuku_love",
    text: "雰囲気が好き。自然体なのに芯があって、見ているだけで元気をもらえます！",
  },
  {
    user: "@tenjin_girl",
    text: "福岡っぽい感性がある。トレンドをつくるのに、福岡らしさを大切にしているところが◎",
  },
  {
    user: "@camera_lover",
    text: "撮影の世界観がかっこいい。どの作品もセンスがあって、いつもチェックしています！",
  },
];

function support(slug = "yui") {
  const result = supportIcon(slug);
  if (result.ok) addToLocalList(storageKeys.supportedIcons, slug);
  showGlobalToast(result.message);
}

function save() {
  addToLocalList(storageKeys.savedIcons, "icons");
  showGlobalToast("保存しました");
}

function follow() {
  addToLocalList(storageKeys.followedIcons, "icons");
  showGlobalToast("フォローしました");
}

function showGlobalToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("fuku-toast", { detail: message }));
}

function IconsHero({ cms }: { cms: IconsCmsData }) {
  return (
    <section className="border-b border-fuku-border bg-white px-5 py-8">
      <h1 className="headline-condensed text-[58px] uppercase leading-[0.9] text-fuku-black">
        {cms.title}
      </h1>
      <p className="mt-4 text-[17px] font-black leading-relaxed text-fuku-black">
        {cms.subtitle}
      </p>
      <p className="mt-4 max-w-[350px] text-[13px] font-bold leading-relaxed text-fuku-black">
        {cms.heroDescription}
      </p>
    </section>
  );
}

function WeeklyIconCard() {
  return (
    <section className="bg-white px-4 py-6">
      <article className="rounded-[16px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="headline-condensed text-[27px] uppercase leading-none text-fuku-black">
            WEEKLY ICON
          </h2>
          <span className="rounded-full border border-fuku-red px-3 py-1 text-[10px] font-black text-fuku-red">
            今週の注目アイコン
          </span>
        </div>
        <div className="grid gap-4 min-[390px]:grid-cols-[1.05fr_1fr]">
          <div
            className="min-h-[226px] rounded-[12px] bg-fuku-light bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,.08), rgba(17,17,17,.14)), url('/images/icons/yui.jpg')",
            }}
          />
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[34px] font-black leading-none text-fuku-black">YUI</h3>
                <p className="mt-2 text-[13px] font-bold text-fuku-gray">model / creator</p>
              </div>
              <span className="rounded-full bg-fuku-light px-4 py-2 text-[12px] font-black text-fuku-black">
                RANK 1
              </span>
            </div>
            <p className="mt-4 text-[14px] font-black leading-relaxed text-fuku-black">
              福岡から全国へ。
              <br />
              いま注目したい次世代アイコン。
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "エリア", value: "天神", icon: MapPin },
                { label: "注目度", value: "98.7%", icon: Flame },
                { label: "投票数", value: "2,430", icon: Crown },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <Icon size={17} className="text-fuku-black" />
                  <p className="mt-1 text-[10px] font-bold text-fuku-gray">{label}</p>
                  <p className="text-[12px] font-black text-fuku-black">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href="/icons/yui"
                className="flex min-h-[44px] items-center justify-center rounded-[8px] bg-fuku-red text-[13px] font-black text-white"
              >
                プロフィールを見る
              </a>
              <button
                type="button"
                onClick={() => support("yui")}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] border border-fuku-red bg-white text-[13px] font-black text-fuku-red"
              >
                <Heart size={17} />
                応援する
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

function IconCategoryTabs({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="bg-white px-4 pb-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {categoryTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            className={`min-h-[40px] shrink-0 rounded-full border px-5 text-[12px] font-black ${
              selectedCategory === tab
                ? "border-fuku-red bg-fuku-red text-white"
                : "border-fuku-border bg-white text-fuku-black"
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
  return "bg-fuku-light";
}

function TopIconCard({ person }: { person: IconPerson }) {
  return (
    <article className="rounded-[12px] border border-fuku-border bg-white p-3">
      <div className="relative text-center">
        <span
          className={`absolute -left-2 -top-2 z-10 grid h-7 w-7 place-items-center rounded-[5px] text-[13px] font-black text-white ${rankBadgeClass(
            person.rank,
          )}`}
        >
          {person.rank}
        </span>
        <div
          className="mx-auto h-20 w-20 rounded-full bg-fuku-light bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.1), rgba(17,17,17,.12)), url('${person.image}')`,
          }}
        />
        <h3 className="mt-3 text-[16px] font-black text-fuku-black">{person.name}</h3>
        <p className="mt-1 min-h-[28px] text-[10px] font-bold leading-snug text-fuku-black">
          {person.category}
        </p>
        <p className="mt-1 text-[10px] font-bold text-fuku-gray">{person.area}</p>
        <p className="mt-1 text-[12px] font-black text-fuku-black">
          {person.votes.toLocaleString()}票
        </p>
      </div>
      <div className="mt-4">
        <IconActionButtons slug={person.name.toLowerCase()} compact />
      </div>
    </article>
  );
}

function RankingListRow({ person }: { person: IconPerson }) {
  return (
    <li className="grid grid-cols-[34px_42px_1fr_auto] items-center gap-3 border-b border-fuku-border py-3">
      <span className="text-center text-[18px] font-black text-fuku-black">{person.rank}</span>
      <div
        className="h-9 w-9 rounded-full bg-fuku-light bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.1), rgba(17,17,17,.12)), url('${person.image}')`,
        }}
      />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-black text-fuku-black">{person.name}</p>
        <p className="truncate text-[10px] font-bold text-fuku-gray">
          {person.category}　{person.area}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[12px] font-black text-fuku-black">{person.votes.toLocaleString()}票</p>
        <button type="button" onClick={() => support(person.name.toLowerCase())} className="mt-1 min-h-[30px] rounded-full border border-fuku-red px-4 text-[11px] font-black text-fuku-red">
          応援する
        </button>
      </div>
    </li>
  );
}

function IconsRanking({ people }: { people: IconPerson[] }) {
  const top3 = people.slice(0, 3);
  const rest = people.slice(3, 6);

  return (
    <section className="bg-white px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="headline-condensed text-[27px] uppercase leading-none text-fuku-black">
          ICONS RANKING
        </h2>
        <a href="/icons/all" className="text-[11px] font-black text-fuku-black">
          すべて見る →
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {top3.map((person) => (
          <TopIconCard key={person.name} person={person} />
        ))}
      </div>
      <ol className="mt-4 rounded-[12px] border border-fuku-border bg-white px-3">
        {rest.map((person) => (
          <RankingListRow key={person.name} person={person} />
        ))}
      </ol>
    </section>
  );
}

function NewFaceSection() {
  return (
    <section className="bg-white px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-end gap-3">
          <h2 className="headline-condensed text-[28px] uppercase leading-none text-fuku-black">NEW FACE</h2>
          <p className="text-[11px] font-black text-fuku-black">新しく参加したFUKU ICONS</p>
        </div>
        <a href="/icons/all" className="shrink-0 text-[11px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {newFaces.map((face) => (
          <article key={face.name} className="grid min-w-[236px] grid-cols-[92px_1fr] overflow-hidden rounded-[12px] border border-fuku-border bg-white">
            <div
              className="bg-fuku-light bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.1), rgba(17,17,17,.12)), url('${face.image}')`,
              }}
            />
            <div className="relative p-3">
              <span className="absolute left-3 top-3 rounded-[5px] bg-fuku-red px-2 py-1 text-[9px] font-black text-white">
                NEW
              </span>
              <h3 className="mt-7 text-[16px] font-black text-fuku-black">{face.name}</h3>
              <p className="text-[11px] font-bold text-fuku-black">{face.category}</p>
              <p className="mt-1 text-[10px] font-bold text-fuku-gray">{face.area}</p>
              <button type="button" onClick={() => support(face.name.toLowerCase())} className="mt-3 min-h-[32px] w-full rounded-full border border-fuku-red text-[11px] font-black text-fuku-red">
                応援する
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function IconsSpotSection() {
  return (
    <section className="bg-white px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-black text-fuku-black">ICONSが通う店</h2>
        <a href="/search" className="text-[11px] font-black text-fuku-black">すべて見る →</a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {iconSpots.map((spot) => (
          <article key={spot.title} className="overflow-hidden rounded-[12px] border border-fuku-border bg-white">
            <div
              className="h-[88px] bg-fuku-light bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.1), rgba(17,17,17,.16)), url('${spot.image}')`,
              }}
            />
            <div className="p-3">
              <h3 className="text-[12px] font-black leading-snug text-fuku-black">{spot.title}</h3>
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-fuku-gray">{spot.description}</p>
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

function IconsEntryCta({ cms }: { cms: IconsCmsData }) {
  return (
    <section className="grid gap-3 bg-white px-4 py-5">
      <article className="relative overflow-hidden rounded-[14px] border border-[#f5caca] bg-white p-4">
        <div className="absolute left-4 top-6 h-12 w-1 bg-fuku-red" />
        <Crown className="absolute right-4 top-5 text-fuku-black/12" size={58} />
        <h2 className="pl-4 text-[17px] font-black leading-snug text-fuku-black">
          FUKU ICONSに
          <br />
          エントリーしませんか？
        </h2>
        <p className="mt-3 pl-4 text-[11px] font-bold leading-relaxed text-fuku-gray">
          モデル・美容師・アーティストなど、あなたの魅力をFUKU ICONSで発信しよう。
        </p>
        <a
          href="/forms/icon-entry"
          className="mt-4 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[8px] bg-fuku-red text-[12px] font-black text-white"
        >
          {cms.entryCtaText}
          <ArrowRight size={15} />
        </a>
      </article>
      <article className="relative overflow-hidden rounded-[14px] border border-[#f5caca] bg-white p-4">
        <div className="absolute left-4 top-6 h-12 w-1 bg-fuku-red" />
        <Megaphone className="absolute right-4 top-5 text-fuku-black/12" size={58} />
        <h2 className="pl-4 text-[17px] font-black leading-snug text-fuku-black">
          あなたの推しを
          <br />
          教えてください。
        </h2>
        <p className="mt-3 pl-4 text-[11px] font-bold leading-relaxed text-fuku-gray">
          身近にいる“気になる人”を推薦して、一緒に福岡を盛り上げよう。
        </p>
        <a
          href="/forms/icon-recommend"
          className="mt-4 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[8px] border border-fuku-red bg-white text-[12px] font-black text-fuku-red"
        >
          {cms.recommendCtaText}
          <ArrowRight size={15} />
        </a>
      </article>
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
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  useEffect(() => {
    setCms(getPublishedIcons());
  }, []);
  const filteredPeople = useMemo(() => {
    if (selectedCategory === "すべて") return iconsRanking;
    return iconsRanking
      .filter((person) => person.tab === selectedCategory)
      .map((person, index) => ({ ...person, rank: index + 1 }));
  }, [selectedCategory]);
  const visiblePeople = filteredPeople.length >= 3 ? filteredPeople : iconsRanking;

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main>
        <IconsHero cms={cms} />
        <WeeklyIconCard />
        <IconCategoryTabs selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        <IconsRanking people={visiblePeople} />
        <NewFaceSection />
        <IconsSpotSection />
        <IconsEntryCta cms={cms} />
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

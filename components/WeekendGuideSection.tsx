"use client";

import {
  ArrowRight,
  Beer,
  Bookmark,
  Coffee,
  Crown,
  Croissant,
  FlaskConical,
  LucideIcon,
  MapPin,
  Music,
  Newspaper,
  Scissors,
  Send,
  Soup,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";
import { spots } from "@/lib/data/spots";
type LegacyWeekendCms = {
  title?: string;
  subtitle?: string;
  defaultCategory?: string;
  visibleCategoryIds?: string[];
  isVisible?: boolean;
};

type WeekendCategory = {
  label: string;
  icon: string;
  active?: boolean;
};

type WeekendSelect = {
  image: string;
  label: string;
  title: string;
  description: string;
};

type WeekendGuideSectionProps = {
  weekendCategories: WeekendCategory[];
  weekendSelects: WeekendSelect[];
  cms?: LegacyWeekendCms;
};

type WeekendGuideKey =
  | "izakaya"
  | "ramen"
  | "beauty"
  | "cafe"
  | "bakery"
  | "shisha"
  | "club"
  | "ranking";

type WeekendCard = {
  title: string;
  label: string;
  description: string;
  image: string;
  slug?: string;
};

type ActionItem = {
  label: string;
  description?: string;
  icon: LucideIcon;
};

type ExtraPanel = {
  title: string;
  items: {
    name: string;
    image: string;
  }[];
};

type WeekendGuide = {
  label: string;
  icon: LucideIcon;
  href: string;
  title: string;
  description: string;
  moodTags: string[];
  areaTags: string[];
  cta: string;
  image: string;
  sectionTitle: string;
  cards: WeekendCard[];
  actions: ActionItem[];
  note?: string;
  extraPanels?: ExtraPanel[];
};

const categoryOrder: WeekendGuideKey[] = [
  "izakaya",
  "ramen",
  "beauty",
  "cafe",
  "bakery",
  "shisha",
  "club",
  "ranking",
];

const allMoods = ["今営業中", "ひとりOK", "デート", "2軒目", "深夜営業", "今から行ける", "保存が多い", "急上昇"];
const allAreas = ["大名", "今泉", "薬院", "天神", "博多", "中洲"];

const weekendGuides: Record<WeekendGuideKey, WeekendGuide> = {
  izakaya: {
    label: "居酒屋",
    icon: Beer,
    href: "/weekend/izakaya",
    title: "今夜、どこの居酒屋行く？",
    description: "今営業中・ひとりでも入りやすい・デート向き・2軒目に使える店を探す",
    moodTags: ["今営業中", "ひとりOK", "デート", "2軒目"],
    areaTags: ["大名", "今泉", "薬院", "天神"],
    cta: "居酒屋ガイドをもっと見る",
    image: "/images/weekend/izakaya-main.jpg",
    sectionTitle: "みんなの投票 TOP3",
    cards: [
      {
        title: "大名の隠れ家居酒屋",
        label: "大名エリア",
        description: "カウンターでゆっくり飲める人気店",
        image: "/images/weekend/izakaya-1.jpg",
        slug: "daimyo-kakurega-izakaya",
      },
      {
        title: "今泉のデート居酒屋",
        label: "今泉エリア",
        description: "会話しやすい落ち着いた空間",
        image: "/images/weekend/izakaya-2.jpg",
        slug: "imaizumi-date-izakaya",
      },
      {
        title: "薬院の二軒目使い",
        label: "薬院エリア",
        description: "仕事終わりにも寄りやすい",
        image: "/images/weekend/izakaya-3.jpg",
        slug: "yakuin-second-spot",
      },
    ],
    actions: [
      { label: "保存する", description: "気になるお店を保存", icon: Bookmark },
      { label: "投票する", description: "お気に入りに投票", icon: ThumbsUp },
      { label: "友達に送る", description: "気になるお店をシェア", icon: Send },
    ],
  },
  ramen: {
    label: "ラーメン",
    icon: Soup,
    href: "/weekend/ramen",
    title: "飲んだあと、どの一杯で締める？",
    description: "深夜ラーメン・豚骨・ひとりでも入りやすい店を探す",
    moodTags: ["深夜営業", "飲み終わり", "ひとりOK", "今から行ける"],
    areaTags: ["天神", "中洲", "博多", "大名"],
    cta: "ラーメンガイドをもっと見る",
    image: "/images/weekend/ramen-main.jpg",
    sectionTitle: "深夜ラーメンランキング TOP3",
    cards: [
      {
        title: "大名の深夜ラーメン",
        label: "大名エリア",
        description: "飲み終わりの一杯に。夜でも入りやすい人気店",
        image: "/images/weekend/ramen-1.jpg",
        slug: "daimyo-late-ramen",
      },
      {
        title: "博多で外さない豚骨",
        label: "博多エリア",
        description: "福岡初心者にもすすめたい定番の味",
        image: "/images/weekend/ramen-2.jpg",
        slug: "hakata-tonkotsu-standard",
      },
      {
        title: "ひとりで入りやすい店",
        label: "全エリア",
        description: "さっと食べて帰れる、安心感のある一軒",
        image: "/images/weekend/ramen-3.jpg",
        slug: "daimyo-late-ramen",
      },
    ],
    actions: [
      { label: "保存する", description: "気になるお店を保存", icon: Bookmark },
      { label: "投票する", description: "お気に入りに投票", icon: ThumbsUp },
      { label: "今から行ける店を見る", description: "営業中を探す", icon: ArrowRight },
    ],
  },
  beauty: {
    label: "美容室",
    icon: Scissors,
    href: "/weekend/beauty",
    title: "福岡で、誰に髪を任せる？",
    description: "人気美容師・サロンモデル募集・雰囲気で選ぶ美容室を探す",
    moodTags: ["カット", "カラー", "メンズ", "韓国風", "ハイトーン"],
    areaTags: ["大名", "天神", "薬院", "今泉"],
    cta: "美容室ガイドをもっと見る",
    image: "/images/weekend/beauty-main.jpg",
    sectionTitle: "人気美容師ランキング TOP3",
    cards: [
      {
        title: "YUI",
        label: "大名エリア",
        description: "韓国風レイヤーが人気のスタイリスト",
        image: "/images/weekend/beauty-1.jpg",
      },
      {
        title: "MIO",
        label: "今泉エリア",
        description: "ハイトーンと柔らかいカラーが得意",
        image: "/images/weekend/beauty-2.jpg",
      },
      {
        title: "KEITA",
        label: "薬院エリア",
        description: "メンズカットで支持される実力派",
        image: "/images/weekend/beauty-3.jpg",
      },
    ],
    extraPanels: [
      {
        title: "FUKU ICONS掲載美容師",
        items: [
          { name: "SAYAKA", image: "/images/weekend/beauty-icon-1.jpg" },
          { name: "TAKUMI", image: "/images/weekend/beauty-icon-2.jpg" },
          { name: "AYAKA", image: "/images/weekend/beauty-icon-3.jpg" },
        ],
      },
      {
        title: "施術後に寄りたいカフェ",
        items: [
          { name: "CAFE", image: "/images/weekend/beauty-cafe-1.jpg" },
          { name: "SWEETS", image: "/images/weekend/beauty-cafe-2.jpg" },
          { name: "LUNCH", image: "/images/weekend/beauty-cafe-3.jpg" },
        ],
      },
    ],
    actions: [
      { label: "推し美容師に投票", icon: ThumbsUp },
      { label: "サロンモデル募集を見る", icon: UserRound },
    ],
  },
  cafe: {
    label: "カフェ",
    icon: Coffee,
    href: "/weekend/cafe",
    title: "今日の気分に合うカフェを探す。",
    description: "夜カフェ・ひとり時間・デート・作業・雨の日に使える店",
    moodTags: ["夜カフェ", "ひとり時間", "デート", "作業", "雨の日", "スイーツ"],
    areaTags: ["薬院", "大名", "今泉", "天神"],
    cta: "カフェガイドをもっと見る",
    image: "/images/weekend/cafe-main.jpg",
    sectionTitle: "人気TOP3",
    cards: [
      {
        title: "夜まで使える落ち着いた一軒",
        label: "夜カフェ TOP3",
        description: "仕事帰りや夜のひとり時間にもぴったり",
        image: "/images/weekend/cafe-1.jpg",
        slug: "tenjin-night-cafe",
      },
      {
        title: "静かに過ごせる人気店",
        label: "ひとりカフェ TOP3",
        description: "読書や作業に集中できる居心地のいいカフェ",
        image: "/images/weekend/cafe-2.jpg",
        slug: "tenjin-night-cafe",
      },
      {
        title: "会話が弾む雰囲気のいい店",
        label: "デートカフェ TOP3",
        description: "おしゃれで心地よい空間で、特別な時間を",
        image: "/images/weekend/cafe-3.jpg",
        slug: "tenjin-night-cafe",
      },
    ],
    actions: [
      { label: "保存する", icon: Bookmark },
      { label: "投票する", icon: ThumbsUp },
      { label: "友達に送る", icon: Send },
    ],
  },
  bakery: {
    label: "パン",
    icon: Croissant,
    href: "/weekend/bakery",
    title: "週末の朝、どのパン屋から始める？",
    description: "朝行きたい・手土産にしたい・クロワッサン・駅近の店を探す",
    moodTags: ["朝活", "手土産", "クロワッサン", "ハード系", "駅近"],
    areaTags: ["大濠", "薬院", "平尾", "六本松"],
    cta: "パン屋ガイドをもっと見る",
    image: "/images/weekend/bakery-main.jpg",
    sectionTitle: "週末の朝に行きたい TOP3",
    cards: [
      {
        title: "朝行きたいパン屋",
        label: "大濠エリア",
        description: "焼きたてで始まる週末",
        image: "/images/weekend/bakery-1.jpg",
        slug: "ohori-morning-bakery",
      },
      {
        title: "手土産にしたいパン",
        label: "薬院エリア",
        description: "友達にも渡したくなる味",
        image: "/images/weekend/bakery-2.jpg",
        slug: "ohori-morning-bakery",
      },
      {
        title: "地元で愛される店",
        label: "六本松エリア",
        description: "毎週通いたくなるベーカリー",
        image: "/images/weekend/bakery-3.jpg",
        slug: "ohori-morning-bakery",
      },
    ],
    actions: [
      { label: "保存する", icon: Bookmark },
      { label: "友達に送る", icon: Send },
      { label: "この店を推す", icon: ThumbsUp },
    ],
  },
  shisha: {
    label: "シーシャ",
    icon: FlaskConical,
    href: "/weekend/shisha",
    title: "今夜、どこでチルする？",
    description: "初心者向け・デート向き・ひとりチル・深夜営業・音楽がいい店を探す",
    moodTags: ["初心者向け", "デート", "ひとりチル", "深夜営業", "音楽がいい"],
    areaTags: ["大名", "今泉", "中洲", "天神"],
    cta: "シーシャガイドをもっと見る",
    image: "/images/weekend/shisha-main.jpg",
    sectionTitle: "編集部セレクト",
    cards: [
      {
        title: "初めてでも行きやすい店",
        label: "大名エリア",
        description: "落ち着いた空気感ではじめてでも安心",
        image: "/images/weekend/shisha-1.jpg",
        slug: "daimyo-shisha-beginner",
      },
      {
        title: "デート向きシーシャ",
        label: "今泉エリア",
        description: "ゆっくり話せる夜にぴったり",
        image: "/images/weekend/shisha-2.jpg",
        slug: "daimyo-shisha-beginner",
      },
      {
        title: "深夜まで使える店",
        label: "中洲エリア",
        description: "終電前にも立ち寄りやすい",
        image: "/images/weekend/shisha-3.jpg",
        slug: "daimyo-shisha-beginner",
      },
    ],
    note: "※ 年齢確認が必要な場合があります",
    actions: [
      { label: "保存する", icon: Bookmark },
      { label: "友達に送る", icon: Send },
      { label: "この店を推す", icon: ThumbsUp },
    ],
  },
  club: {
    label: "クラブ",
    icon: Music,
    href: "/weekend/club",
    title: "今週末、どの夜に行く？",
    description: "クラブイベント・DJ出演情報・初心者向けの夜を探す",
    moodTags: ["今週末", "DJ出演", "初心者向け", "HIPHOP", "HOUSE"],
    areaTags: ["中洲", "天神", "大名", "親不孝"],
    cta: "クラブイベントを見る",
    image: "/images/weekend/club-main.jpg",
    sectionTitle: "今週末のイベント",
    cards: [
      {
        title: "SATURDAY NIGHT",
        label: "中洲エリア",
        description: "人気DJが集まる週末イベント",
        image: "/images/weekend/club-1.jpg",
        slug: "nakasu-saturday-night",
      },
      {
        title: "FUKU ICONS DJ出演",
        label: "天神エリア",
        description: "注目DJの出演情報をチェック",
        image: "/images/weekend/club-2.jpg",
        slug: "nakasu-saturday-night",
      },
      {
        title: "初めてでも行きやすい夜",
        label: "大名エリア",
        description: "初心者向けイベントガイド",
        image: "/images/weekend/club-3.jpg",
        slug: "nakasu-saturday-night",
      },
    ],
    actions: [
      { label: "イベントを保存する", icon: Bookmark },
      { label: "友達に送る", icon: Send },
      { label: "NEWSでも見る", icon: Newspaper },
    ],
  },
  ranking: {
    label: "人気ランキング",
    icon: Crown,
    href: "/ranking",
    title: "今週末、みんなが見ているランキング。",
    description: "今週末行きたい店・今営業中・保存数が多い・急上昇の店を探す",
    moodTags: ["今週行きたい", "今営業中", "保存が多い", "急上昇", "友達に送られている"],
    areaTags: ["天神", "大名", "今泉", "中洲"],
    cta: "人気ランキングを見る",
    image: "/images/weekend/ranking-main.jpg",
    sectionTitle: "人気TOP3",
    cards: [
      {
        title: "いま最も保存されている店",
        label: "保存数 TOP3",
        description: "保存されている人気店をランキングでチェック",
        image: "/images/weekend/ranking-1.jpg",
      },
      {
        title: "投票が伸びている注目店",
        label: "急上昇 TOP3",
        description: "今、投票が急増中の話題のお店を紹介",
        image: "/images/weekend/ranking-2.jpg",
      },
      {
        title: "友達に送られている人気スポット",
        label: "シェア TOP3",
        description: "シェア数が多い人気店をランキングでチェック",
        image: "/images/weekend/ranking-3.jpg",
      },
    ],
    actions: [
      { label: "保存する", icon: Bookmark },
      { label: "投票する", icon: ThumbsUp },
      { label: "友達に送る", icon: Send },
    ],
  },
};

function CategoryButton({
  guideKey,
  guide,
  selected,
  onSelect,
}: {
  guideKey: WeekendGuideKey;
  guide: WeekendGuide;
  selected: boolean;
  onSelect: (key: WeekendGuideKey) => void;
}) {
  const Icon = guide.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(guideKey)}
      className={`flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[12px] border text-center transition ${
        selected
          ? "border-fuku-red bg-fuku-red text-white shadow-soft"
          : "border-[#eadfd8] bg-white text-fuku-black"
      }`}
      aria-pressed={selected}
    >
      <Icon size={28} strokeWidth={2.5} />
      <span className="whitespace-nowrap text-[11px] font-black leading-tight tracking-wide">
        {guide.label}
      </span>
    </button>
  );
}

function WeekendHeroCard({
  guide,
  selectedMood,
  selectedArea,
  onMoodSelect,
  onAreaSelect,
  detailHref,
}: {
  guide: WeekendGuide;
  selectedMood: string;
  selectedArea: string;
  onMoodSelect: (mood: string) => void;
  onAreaSelect: (area: string) => void;
  detailHref: string;
}) {
  const moods = Array.from(new Set([...guide.moodTags, ...allMoods]));
  const areas = Array.from(new Set([...guide.areaTags, ...allAreas]));

  return (
    <article
      className="mt-5 overflow-hidden rounded-[14px] bg-fuku-black bg-cover bg-center p-5 text-white shadow-soft"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.76) 44%, rgba(0,0,0,0.34) 100%), linear-gradient(135deg, #111111, #36302b), url('${guide.image}')`,
      }}
    >
      <h3 className="max-w-[320px] text-[29px] font-black leading-[1.25] tracking-wide">
        {guide.title}
      </h3>
      <p className="mt-3 max-w-[300px] text-[13px] font-black leading-relaxed text-white/[0.92]">
        {guide.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {moods.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => onMoodSelect(tag)}
            className={`rounded-full border px-4 py-2 text-[12px] font-black ${
              selectedMood === tag
                ? "border-fuku-red bg-fuku-red text-white"
                : "border-white/[0.58] bg-black/[0.16] text-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-white/[0.25] pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <MapPin size={18} className="shrink-0 text-white" />
          {areas.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => onAreaSelect(tag)}
              className="min-w-[70px] rounded-full border border-white/[0.58] bg-black/[0.14] px-4 py-2 text-center text-[12px] font-black text-white"
              style={selectedArea === tag ? { backgroundColor: "#e52421", borderColor: "#e52421" } : undefined}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <a
        href={detailHref}
        className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-3 rounded-[8px] border border-white bg-black/[0.1] px-4 text-[15px] font-black tracking-wide text-white"
      >
        {guide.cta}
        <ArrowRight size={19} />
      </a>
    </article>
  );
}

function WeekendSelectCard({ card, index }: { card: WeekendCard; index: number }) {
  return (
    <a
      href={`/spots/${card.slug ?? "daimyo-kakurega-izakaya"}`}
      className="min-w-0 overflow-hidden rounded-[10px] border border-[#eadfd8] bg-white"
    >
      <div
        className="relative h-[98px] bg-[#d8d5cf] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(17,17,17,0.18)), url('${card.image}')`,
        }}
      >
        <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-br-[8px] bg-fuku-red text-[15px] font-black text-white">
          {index + 1}
        </span>
      </div>
      <div className="relative min-h-[144px] p-3 pb-10">
        <p className="text-[10px] font-black leading-tight text-fuku-red">{card.label}</p>
        <h4 className="mt-2 text-[13px] font-black leading-snug text-fuku-black">
          {card.title}
        </h4>
        <p className="mt-2 text-[11px] font-semibold leading-relaxed text-fuku-gray">
          {card.description}
        </p>
        <span className="absolute bottom-3 right-3 text-fuku-black" aria-label={`${card.title}を保存`}>
          <Bookmark size={20} strokeWidth={2} />
        </span>
      </div>
    </a>
  );
}

function ExtraPanels({ panels }: { panels: ExtraPanel[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {panels.map((panel) => (
        <article key={panel.title} className="rounded-[12px] bg-fuku-light p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-[12px] font-black text-fuku-black">{panel.title}</h4>
            <a href="/icons/all" className="shrink-0 text-[10px] font-black text-fuku-black">
              すべて見る →
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {panel.items.map((item) => (
              <div key={item.name} className="min-w-0 text-center">
                <div
                  className="mx-auto h-12 w-12 rounded-full bg-[#d8d5cf] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(17,17,17,0.12)), url('${item.image}')`,
                  }}
                />
                <p className="mt-2 truncate text-[9px] font-black text-fuku-black">{item.name}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function ActionBar({ actions }: { actions: ActionItem[] }) {
  return (
    <div
      className={`mt-5 grid overflow-hidden rounded-[12px] border border-[#eadfd8] bg-white shadow-soft ${
        actions.length === 2 ? "grid-cols-2" : "grid-cols-3"
      }`}
    >
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <a
            key={action.label}
            href="/search"
            className={`flex min-h-[72px] items-center justify-center gap-2 px-2 text-center ${
              index > 0 ? "border-l border-[#eadfd8]" : ""
            }`}
          >
            <Icon size={24} strokeWidth={2.2} className="shrink-0 text-fuku-black" />
            <span className="min-w-0">
              <span className="block text-[12px] font-black leading-tight text-fuku-black">
                {action.label}
              </span>
              {action.description ? (
                <span className="mt-1 hidden text-[9px] font-bold leading-tight text-fuku-gray min-[390px]:block">
                  {action.description}
                </span>
              ) : null}
            </span>
          </a>
        );
      })}
    </div>
  );
}

export default function WeekendGuideSection({ cms }: WeekendGuideSectionProps) {
  const isHidden = cms?.isVisible === false;
  const initialCategory = ((cms?.defaultCategory as WeekendGuideKey | undefined) ?? "ramen");
  const safeInitialCategory = categoryOrder.includes(initialCategory) ? initialCategory : "ramen";
  const visibleCategoryIds = cms?.visibleCategoryIds ?? [];
  const visibleCategories = visibleCategoryIds.length
    ? categoryOrder.filter((key) => visibleCategoryIds.includes(key))
    : categoryOrder;
  const [selectedCategory, setSelectedCategory] = useState<WeekendGuideKey>(safeInitialCategory);
  const [selectedMood, setSelectedMood] = useState("深夜営業");
  const [selectedArea, setSelectedArea] = useState("大名");
  const selectedGuide = weekendGuides[selectedCategory];
  const detailHref = `${selectedGuide.href}?mood=${encodeURIComponent(selectedMood)}&area=${encodeURIComponent(selectedArea)}`;
  const filteredCards = useMemo(() => {
    const category = selectedCategory === "ranking" ? "" : selectedCategory;
    const matches = spots
      .filter((spot) => (!category || spot.category === category))
      .filter((spot) => !selectedMood || spot.moods.includes(selectedMood) || spot.tags.includes(selectedMood))
      .filter((spot) => !selectedArea || spot.area === selectedArea)
      .slice(0, 3)
      .map((spot) => ({
        title: spot.name,
        label: `${spot.area}エリア`,
        description: spot.description,
        image: spot.images[0],
        slug: spot.slug,
      }));

    return matches.length > 0 ? matches : selectedGuide.cards;
  }, [selectedArea, selectedCategory, selectedGuide.cards, selectedMood]);

  function handleCategory(key: WeekendGuideKey) {
    setSelectedCategory(key);
    setSelectedMood(weekendGuides[key].moodTags[0]);
    setSelectedArea(weekendGuides[key].areaTags[0]);
  }

  if (isHidden) return null;

  return (
    <section className="bg-white px-5 py-10">
      <SectionHeader title={cms?.title ?? "WEEKEND GUIDE"} subtitle={cms?.subtitle ?? "今週の気分で、福岡をめぐる。"} />

      <div className="grid grid-cols-4 gap-2">
        {visibleCategories.map((key) => (
          <CategoryButton
            key={key}
            guideKey={key}
            guide={weekendGuides[key]}
            selected={selectedCategory === key}
            onSelect={handleCategory}
          />
        ))}
      </div>

      <WeekendHeroCard
        guide={selectedGuide}
        selectedMood={selectedMood}
        selectedArea={selectedArea}
        onMoodSelect={setSelectedMood}
        onAreaSelect={setSelectedArea}
        detailHref={detailHref}
      />

      <div className="mt-7 flex items-center justify-between gap-4">
        <h3 className="border-l-4 border-fuku-red pl-3 text-[20px] font-black tracking-wide text-fuku-black">
          {selectedGuide.sectionTitle}
        </h3>
        <a href={detailHref} className="shrink-0 text-[11px] font-black text-fuku-black">
          すべて見る →
        </a>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {filteredCards.map((card, index) => (
          <WeekendSelectCard key={card.title} card={card} index={index} />
        ))}
      </div>

      {filteredCards === selectedGuide.cards ? (
        <p className="mt-3 rounded-[10px] bg-fuku-light px-4 py-3 text-[12px] font-bold text-fuku-gray">
          条件に合うお店を準備中です。近い候補を表示しています。
        </p>
      ) : null}

      {selectedGuide.extraPanels ? <ExtraPanels panels={selectedGuide.extraPanels} /> : null}

      {selectedGuide.note ? (
        <p className="mt-4 rounded-[10px] bg-fuku-light px-4 py-3 text-center text-[12px] font-bold text-fuku-gray">
          {selectedGuide.note}
        </p>
      ) : null}

    </section>
  );
}

import {
  ArrowRight,
  Crown,
  Home,
  LucideIcon,
  Moon,
  ShoppingBasket,
  Train,
} from "lucide-react";
import FukuVoteBanner from "./FukuVoteBanner";
type LegacyRankingCms = {
  title?: string;
  subtitle?: string;
  description?: string;
  visibleThemeIds?: string[];
  ctaText?: string;
  ctaHref?: string;
  isVisible?: boolean;
};

type Category = {
  label: string;
  active?: boolean;
};

type CafeRankingItem = {
  rank: number;
  image: string;
  title: string;
  area: string;
  description: string;
  votes: string;
};

type DailyRankingGroup = {
  title: string;
  items: {
    rank: number;
    name: string;
    votes?: string;
  }[];
};

type RankingSectionProps = {
  rankingCategories: Category[];
  cafeRanking: CafeRankingItem[];
  dailyRanking: DailyRankingGroup[];
  cms?: LegacyRankingCms;
};

type DailyRankingItem = {
  rank: number;
  name: string;
  votes: string;
  image: string;
};

type DailyRankingBlockData = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  items: DailyRankingItem[];
};

const dailyRankingBlocks: DailyRankingBlockData[] = [
  {
    id: "supermarket",
    title: "好きなスーパー",
    description: "日常の味方！通いやすくて、品ぞろえも◎",
    icon: ShoppingBasket,
    href: "/ranking?theme=supermarket",
    items: [
      {
        rank: 1,
        name: "ボンラパス",
        votes: "1,842票",
        image: "/images/ranking/super-bonrepas.jpg",
      },
      {
        rank: 2,
        name: "ハローデイ",
        votes: "1,233票",
        image: "/images/ranking/super-halloday.jpg",
      },
      {
        rank: 3,
        name: "サニー",
        votes: "987票",
        image: "/images/ranking/super-sunny.jpg",
      },
    ],
  },
  {
    id: "station",
    title: "好きな駅",
    description: "通勤・通学も、おでかけも。よく使う駅はここ！",
    icon: Train,
    href: "/ranking?theme=station",
    items: [
      {
        rank: 1,
        name: "薬院駅",
        votes: "2,109票",
        image: "/images/ranking/station-yakuin.jpg",
      },
      {
        rank: 2,
        name: "天神駅",
        votes: "1,732票",
        image: "/images/ranking/station-tenjin.jpg",
      },
      {
        rank: 3,
        name: "博多駅",
        votes: "1,421票",
        image: "/images/ranking/station-hakata.jpg",
      },
    ],
  },
  {
    id: "city",
    title: "住みたい街",
    description: "住むならこんな街に暮らしたい！",
    icon: Home,
    href: "/ranking?theme=city",
    items: [
      {
        rank: 1,
        name: "薬院",
        votes: "1,876票",
        image: "/images/ranking/city-yakuin.jpg",
      },
      {
        rank: 2,
        name: "大名",
        votes: "1,312票",
        image: "/images/ranking/city-daimyo.jpg",
      },
      {
        rank: 3,
        name: "六本松",
        votes: "1,086票",
        image: "/images/ranking/city-ropponmatsu.jpg",
      },
    ],
  },
  {
    id: "late-night",
    title: "深夜助かる場所",
    description: "遅くなった日も、ここがあると安心。",
    icon: Moon,
    href: "/ranking?theme=late-night",
    items: [
      {
        rank: 1,
        name: "セブン-イレブン",
        votes: "2,243票",
        image: "/images/ranking/night-seven.jpg",
      },
      {
        rank: 2,
        name: "TRIAL GO",
        votes: "1,498票",
        image: "/images/ranking/night-trial.jpg",
      },
      {
        rank: 3,
        name: "すき家",
        votes: "1,205票",
        image: "/images/ranking/night-sukiya.jpg",
      },
    ],
  },
];

const miniCategoryCards = [
  {
    title: "モデル",
    href: "/ranking?category=people&theme=model",
    people: [
      { name: "YUI", votes: "1,024票", image: "/images/yui.jpg" },
      { name: "RENA", votes: "892票", image: "/images/rena.jpg" },
      { name: "ANNA", votes: "732票", image: "/images/anna.jpg" },
    ],
  },
  {
    title: "好きなスーパー",
    href: "/ranking?category=daily&theme=supermarket",
    people: [
      {
        name: "ボンラパス",
        votes: "1,156票",
        image: "/images/ranking/super-bonrepas.jpg",
      },
      { name: "サニー", votes: "978票", image: "/images/ranking/super-sunny.jpg" },
      {
        name: "マックスバリュ",
        votes: "845票",
        image: "/images/ranking/super-maxvalu.jpg",
      },
    ],
  },
];

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-[#f5b400]";
  if (rank === 2) return "bg-[#9ca3af]";
  return "bg-[#c9824a]";
}

function DailyRankingCard({ item }: { item: DailyRankingItem }) {
  return (
    <article className="overflow-hidden rounded-[8px] border border-[#eeeeee] bg-[#f8f8f8]">
      <div
        className="relative aspect-[16/9] bg-[#d8d5cf] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(17,17,17,0.12)), url('${item.image}')`,
        }}
      >
        <span
          className={`absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-br-[5px] text-[16px] font-black text-white ${rankBadgeClass(
            item.rank,
          )}`}
        >
          {item.rank}
        </span>
      </div>
      <div className="p-2">
        <h4 className="break-words text-[11px] font-black leading-snug text-fuku-black">
          {item.name}
        </h4>
        <p className="mt-1 text-[10px] font-black leading-none text-fuku-gray">{item.votes}</p>
        <a
          href={`/ranking?mode=vote&item=${encodeURIComponent(item.name)}`}
          className="mt-2 inline-flex min-h-[28px] items-center rounded-full border border-fuku-red px-3 text-[10px] font-black text-fuku-red"
        >
          投票
        </a>
      </div>
    </article>
  );
}

function DailyRankingBlock({ block }: { block: DailyRankingBlockData }) {
  const Icon = block.icon;

  return (
    <article className="mb-3 rounded-[12px] border border-[#eadfd8] bg-white p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <Icon size={22} className="mt-0.5 shrink-0 text-[#e85b61]" strokeWidth={2.4} />
          <div className="min-w-0">
            <h3 className="text-[18px] font-black leading-tight tracking-wide text-fuku-black">
              {block.title}
            </h3>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-fuku-gray">
              {block.description}
            </p>
          </div>
        </div>
        <a
          href={block.href}
          className="mt-1 shrink-0 whitespace-nowrap text-[10px] font-black tracking-wide text-fuku-gray"
        >
          すべて見る ＞
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {block.items.map((item) => (
          <DailyRankingCard key={`${block.title}-${item.name}`} item={item} />
        ))}
      </div>
    </article>
  );
}

function MiniCategoryCard({
  card,
}: {
  card: (typeof miniCategoryCards)[number];
}) {
  return (
    <article className="min-w-[184px] rounded-[12px] border border-[#eeeeee] bg-white p-3">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-black text-fuku-black">{card.title}</h3>
        <span className="rounded-[5px] border border-fuku-red px-2 py-1 text-[10px] font-black text-fuku-red">
          TOP3
        </span>
      </div>
      <div className="flex items-end gap-2">
        {card.people.map((person) => (
          <div key={`${card.title}-${person.name}`} className="min-w-0 flex-1 text-center">
            <div
              className="mx-auto h-12 w-12 rounded-full bg-[#d8d5cf] bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(17,17,17,0.1)), url('${person.image}')`,
              }}
            />
            <p className="mt-2 truncate text-[10px] font-black text-fuku-black">{person.name}</p>
            <p className="mt-1 text-[9px] font-bold text-fuku-gray">{person.votes}</p>
          </div>
        ))}
        <a
          href={card.href}
          className="mb-4 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fuku-red text-white"
          aria-label={`${card.title}を見る`}
        >
          <ArrowRight size={17} />
        </a>
      </div>
    </article>
  );
}

export default function RankingSection({ cms }: RankingSectionProps) {
  if (cms?.isVisible === false) return null;
  const visibleThemeIds = cms?.visibleThemeIds ?? [];
  const visibleBlocks = visibleThemeIds.length
    ? dailyRankingBlocks.filter((block) => visibleThemeIds.includes(block.id))
    : dailyRankingBlocks;
  const titleParts = (cms?.title ?? "FUKUOKA RANKING").split(/\s+/).filter(Boolean);

  return (
    <section className="mt-8 border-y border-[#eeeeee] bg-white px-4 py-6">
      <div className="relative mb-6 overflow-hidden rounded-[12px] bg-white px-1 pb-2 pt-1">
        <div className="absolute right-0 top-0 h-28 w-32 rounded-full bg-[#f2eee8] opacity-80" />
        <div className="absolute right-6 top-4 h-24 w-px rotate-[12deg] bg-[#d8d5cf]" />
        <div className="absolute right-12 top-12 h-12 w-16 border-b border-r border-[#d8d5cf]" />
        <div className="relative">
          <h2 className="headline-condensed text-[42px] font-black uppercase leading-[0.9] text-[#111111]">
            {titleParts.length > 1 ? (
              titleParts.map((part) => (
                <span key={part} className="block">{part}</span>
              ))
            ) : (
              <span className="block">{cms?.title ?? "FUKUOKA RANKING"}</span>
            )}
          </h2>
          <p className="mt-7 text-[14px] font-black leading-relaxed text-fuku-black">
            {cms?.subtitle ?? "みんなの“いつもの福岡”ランキング"}
          </p>
          <p className="mt-2 max-w-[300px] text-[12px] font-semibold leading-relaxed text-fuku-gray">
            {cms?.description ?? "暮らしの中で見つけた、リアルに助かる・通いたくなるお気に入りをシェアしよう。"}
          </p>
        </div>
      </div>

      <div>
        {visibleBlocks.map((block) => (
          <DailyRankingBlock key={block.title} block={block} />
        ))}
      </div>

      <FukuVoteBanner />

      <div className="pt-1 text-center">
        <a
          href={cms?.ctaHref ?? "/ranking"}
          className="mx-auto mt-6 flex h-12 w-4/5 items-center justify-center gap-3 rounded-full bg-fuku-red px-5 text-[15px] font-black tracking-wide text-white"
        >
          {cms?.ctaText ?? "ランキングページへ"}
          <ArrowRight size={18} />
        </a>
        <p className="mt-3 text-[13px] font-black text-fuku-black">
          TOP4以降はランキングページで見られるよ！
        </p>
      </div>

      <div className="mt-8 border-t border-[#eeeeee] pt-6">
        <div className="mb-4 flex items-center gap-2">
          <Crown size={18} className="text-fuku-red" />
          <h3 className="text-[18px] font-black tracking-wide text-fuku-black">
            他のカテゴリーもチェック！
          </h3>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {miniCategoryCards.map((card) => (
            <MiniCategoryCard key={card.title} card={card} />
          ))}
        </div>
        <p className="mt-4 text-center text-[10px] font-bold text-fuku-gray">
          ※ ランキングの集計期間：2024.05.01〜2024.05.31
        </p>
      </div>
    </section>
  );
}

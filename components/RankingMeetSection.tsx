import { ArrowRight, Building2, Moon, ShoppingBasket, Train } from "lucide-react";
import type { HomeCmsData } from "@/types/cms";

type RankingEntry = {
  rank: number;
  name: string;
  votes: string;
  image: string;
  href: string;
};

type RankingTheme = {
  id: string;
  title: string;
  description: string;
  icon: typeof ShoppingBasket;
  href: string;
  entries: RankingEntry[];
};

const rankingThemes: RankingTheme[] = [
  {
    id: "supermarket",
    title: "好きなスーパー",
    description: "日常の味方！通いやすくて、品ぞろえも◎",
    icon: ShoppingBasket,
    href: "/ranking?theme=supermarket",
    entries: [
      { rank: 1, name: "ボンラパス", votes: "1,842票", image: "/images/ranking/super-bonrepas.jpg", href: "/ranking/supermarket/bon-repas" },
      { rank: 2, name: "ハローデイ", votes: "1,233票", image: "/images/ranking/super-halloday.jpg", href: "/ranking/supermarket/halloday" },
      { rank: 3, name: "サニー", votes: "987票", image: "/images/ranking/super-sunny.jpg", href: "/ranking/supermarket/sunny" },
    ],
  },
  {
    id: "station",
    title: "好きな駅",
    description: "通勤・通学も、おでかけも。よく使う駅はここ！",
    icon: Train,
    href: "/ranking?theme=station",
    entries: [
      { rank: 1, name: "薬院駅", votes: "2,169票", image: "/images/ranking/station-yakuin.jpg", href: "/ranking/station/yakuin-station" },
      { rank: 2, name: "天神駅", votes: "1,732票", image: "/images/ranking/station-tenjin.jpg", href: "/ranking/station/tenjin-station" },
      { rank: 3, name: "博多駅", votes: "1,421票", image: "/images/ranking/station-hakata.jpg", href: "/ranking/station/hakata-station" },
    ],
  },
  {
    id: "city",
    title: "住みたい街",
    description: "住むならこんな街に暮らしたい！",
    icon: Building2,
    href: "/ranking?theme=city",
    entries: [
      { rank: 1, name: "薬院", votes: "1,876票", image: "/images/ranking/city-yakuin.jpg", href: "/ranking/area/yakuin" },
      { rank: 2, name: "大名", votes: "1,312票", image: "/images/ranking/city-daimyo.jpg", href: "/ranking/area/daimyo" },
      { rank: 3, name: "六本松", votes: "1,089票", image: "/images/ranking/city-ropponmatsu.jpg", href: "/ranking/area/ropponmatsu" },
    ],
  },
  {
    id: "late-night",
    title: "深夜助かる場所",
    description: "遅くなった日も、ここがあると安心。",
    icon: Moon,
    href: "/ranking?theme=late-night",
    entries: [
      { rank: 1, name: "セブンイレブン", votes: "2,243票", image: "/images/ranking/night-seven.jpg", href: "/ranking/late-night/seven-eleven" },
      { rank: 2, name: "TRIAL GO", votes: "1,498票", image: "/images/ranking/night-trial.jpg", href: "/ranking/late-night/trial-go" },
      { rank: 3, name: "すき家", votes: "1,205票", image: "/images/ranking/night-sukiya.jpg", href: "/ranking/late-night/sukiya" },
    ],
  },
];

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
        <a href="/ranking?mode=vote" className="mt-2 block rounded-full border border-fuku-red px-2 py-1 text-center text-[10px] font-black text-fuku-red">
          投票
        </a>
      </div>
    </div>
  );
}

export default function RankingMeetSection({ cms }: { cms?: HomeCmsData["ranking"] }) {
  if (cms?.isVisible === false) return null;
  return (
    <section className="mt-8 border-y border-[#eee] bg-white px-4 py-8">
      <p className="headline-condensed text-[39px] uppercase leading-none text-fuku-black">{cms?.title ?? "FUKUOKA RANKING"}</p>
      <h2 className="mt-3 text-[19px] font-black leading-tight text-fuku-black">{cms?.subtitle ?? "みんなの“いつもの福岡”ランキング"}</h2>
      <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "暮らしの中で見つけた、リアルに助かる・通いたくなるお気に入りをシェアしよう。"}</p>

      <div className="mt-6 grid gap-3">
        {rankingThemes.map((theme) => {
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
                <a href={theme.href} className="shrink-0 text-[10px] font-black text-fuku-black">すべて見る ＞</a>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {theme.entries.map((entry) => (
                  <TopCard key={entry.name} entry={entry} />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-[12px] border border-[#f5caca] bg-[#fff1f1] p-4">
        <p className="headline-condensed text-[28px] uppercase leading-none text-fuku-red">FUKUOKA RANKING</p>
        <h3 className="mt-2 text-[18px] font-black leading-tight text-fuku-black">あなたの“いつもの福岡”を教えて！</h3>
        <p className="mt-1 text-[12px] font-bold text-fuku-gray">みんなの投票で、ランキングが変わる！</p>
        <a href="/ranking" className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-fuku-red px-6 text-[12px] font-black text-white">
          今すぐ投票する
          <ArrowRight size={15} />
        </a>
      </div>

      <a href={cms?.ctaHref ?? "/ranking"} className="mx-auto mt-6 flex min-h-[48px] w-4/5 items-center justify-center gap-3 rounded-full bg-fuku-red text-[14px] font-black text-white">
        {cms?.ctaText ?? "ランキングページへ"}
        <ArrowRight size={17} />
      </a>
    </section>
  );
}

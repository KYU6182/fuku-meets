import { ArrowRight, HeartHandshake, Sparkles, Vote } from "lucide-react";
import ActionCard from "./ActionCard";
import IconPersonCard from "./IconPersonCard";
import SectionHeader from "./SectionHeader";

type IconData = {
  rank: number;
  image: string;
  name: string;
  genre: string;
  votes: string;
};

type FukuIconsSectionProps = {
  iconsData: IconData[];
};

export default function FukuIconsSection({ iconsData }: FukuIconsSectionProps) {
  return (
    <section className="mt-8 border-y border-fuku-border bg-white px-5 py-7">
      <SectionHeader
        title="FUKU ICONS / PEOPLE"
        subtitle="福岡をつくる、注目のアイコンたち。"
        actionLabel="すべて見る →"
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        {iconsData.map((person) => (
          <IconPersonCard key={person.name} {...person} />
        ))}
      </div>

      <a
        href="/icons"
        className="flex min-h-[92px] items-center gap-4 rounded-[10px] border border-fuku-border bg-white p-3 shadow-soft"
      >
        <div className="flex w-[88px] shrink-0 -space-x-8">
          {iconsData.map((person) => (
            <div
              key={person.name}
              className="h-[58px] w-[58px] rounded-[6px] border-2 border-white bg-fuku-light bg-cover bg-center"
              style={{ backgroundImage: `url('${person.image}')` }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="headline-condensed text-[22px] uppercase leading-none text-fuku-black">
            FUKU ICONSを見る
          </p>
          <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">
            福岡で輝くアイコンたちのインタビューや特集をチェック。
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-fuku-black">
          <ArrowRight size={18} />
        </span>
      </a>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ActionCard icon={Sparkles} title="一般エントリー" caption="自分で応募" href="/forms/icon-entry" />
        <ActionCard icon={HeartHandshake} title="推しを推薦" caption="友だちを推す" href="/forms/icon-recommend" />
        <ActionCard icon={Vote} title="表紙投票" caption="次号を選ぶ" href="/icons/cover-vote" />
      </div>
    </section>
  );
}

import { Bookmark, MessageCircle } from "lucide-react";

type RankingCardProps = {
  rank: number;
  image: string;
  title: string;
  area: string;
  description: string;
  votes: string;
};

export default function RankingCard({
  rank,
  image,
  title,
  area,
  description,
  votes,
}: RankingCardProps) {
  return (
    <article className="overflow-hidden rounded-[9px] border border-fuku-border bg-white">
      <div
        className="relative h-[148px] bg-fuku-light bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(17,17,17,0.05), rgba(17,17,17,0.24)), url('${image}')`,
        }}
      >
        <span
          className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-[5px] text-[16px] font-black text-white ${
            rank === 1 ? "bg-[#ffc400]" : rank === 2 ? "bg-[#a8a8a8]" : "bg-[#cf8a53]"
          }`}
        >
          {rank}
        </span>
        <button
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/[0.92] text-fuku-black"
          aria-label={`${title}を保存`}
        >
          <Bookmark size={18} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[17px] font-black leading-snug text-fuku-black">{title}</h3>
            <p className="mt-1 text-[12px] font-bold text-fuku-gray">{area}</p>
          </div>
          <p className="shrink-0 text-[12px] font-black text-fuku-red">{votes}</p>
        </div>
        <p className="mt-3 text-[12px] font-semibold leading-relaxed text-fuku-gray">
          {description}
        </p>
        <a
          href="/ranking?mode=vote"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-black tracking-wide text-fuku-black"
        >
          <MessageCircle size={14} className="text-fuku-red" />
          推しコメントを書く
        </a>
      </div>
    </article>
  );
}

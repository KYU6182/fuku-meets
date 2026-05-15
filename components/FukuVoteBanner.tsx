import { ArrowRight, Heart } from "lucide-react";

export default function FukuVoteBanner() {
  return (
    <a
      href="/ranking?mode=vote"
      className="relative mt-3 flex min-h-[108px] overflow-hidden rounded-[12px] border border-[#f5caca] bg-[#fff1f1] p-[14px]"
    >
      <div className="relative z-10 max-w-[300px] pr-14">
        <p className="headline-condensed text-[22px] uppercase leading-none text-fuku-black">
          FUKUOKA RANKING
        </p>
        <h3 className="mt-1 text-[14px] font-black leading-snug text-fuku-black">
          あなたの「いつもの福岡」を教えて！
        </h3>
        <p className="mt-1 text-[11px] font-bold leading-relaxed text-fuku-gray">
          みんなの投票で、ランキングが変わる！
        </p>
        <span className="mt-3 inline-flex min-h-[42px] items-center gap-2 rounded-full bg-fuku-red px-4 text-[12px] font-black text-white">
          今すぐ投票する
          <ArrowRight size={15} />
        </span>
      </div>
      <div className="absolute -right-1 bottom-3 h-[82px] w-[48px] rotate-[-8deg] rounded-[11px] border-[4px] border-fuku-black bg-white shadow-soft">
        <div className="mx-auto mt-2 h-1 w-5 rounded-full bg-fuku-black" />
        <div className="mx-auto mt-4 grid h-9 w-9 place-items-center rounded-full bg-[#fff1f1] text-fuku-red">
          <Heart size={20} fill="#e52421" />
        </div>
      </div>
    </a>
  );
}

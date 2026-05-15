import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="px-4 pt-4">
      <div
        className="relative min-h-[386px] overflow-hidden rounded-[10px] bg-fuku-black bg-cover bg-center shadow-soft"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(17,17,17,0.08) 0%, rgba(17,17,17,0.28) 45%, rgba(17,17,17,0.78) 100%), url('/images/hero.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.16),transparent_16rem)]" />
        <div className="relative z-10 flex min-h-[386px] flex-col justify-end px-5 pb-6">
          <span className="mb-4 w-fit rounded-[4px] bg-fuku-red px-3 py-1 text-[11px] font-black tracking-widest text-white">
            特集
          </span>
          <h1 className="text-[37px] font-black leading-[1.22] tracking-wide text-white">
            いま福岡で、
            <br />
            会いたい人と店。
          </h1>
          <p className="mt-3 max-w-[310px] text-[14px] font-bold leading-relaxed text-white/[0.92]">
            気になるあの人、行きつけのあの店。
            <br />
            福岡の“いま”をつなげる。
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <a
              href="/ranking"
              className="inline-flex min-h-[46px] items-center gap-3 rounded-full bg-fuku-red px-5 text-[13px] font-black tracking-wide text-white"
            >
              最新ランキングを見る
              <ArrowRight size={17} />
            </a>
            <p className="text-[13px] font-black tracking-widest text-white/[0.85]">1 / 5</p>
          </div>
          <div className="mt-6 flex gap-2">
            {[0, 1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={`h-2 rounded-full ${dot === 0 ? "w-7 bg-white" : "w-2 bg-white/[0.55]"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import type { HomeCmsData } from "@/types/cms";

export default function PaperSection({ cms }: { cms?: HomeCmsData["magazine"] }) {
  if (cms?.isVisible === false) return null;
  return (
    <section className="bg-white px-4 pt-10">
      <article className="relative overflow-hidden rounded-[14px] border border-fuku-border bg-[#f5f0e8] p-5">
        <div className="relative z-10 max-w-[210px]">
          <SectionHeader
            title={cms?.title ?? "FUKU-MEETS MAGAZINE"}
            subtitle={cms?.subtitle ?? "福岡の空気を、Webと紙で残すローカルマガジン。"}
            className="mb-8"
          />
          <p className="text-[13px] font-black uppercase tracking-widest text-fuku-black">vol.01</p>
          <h3 className="mt-3 text-[23px] font-black leading-snug text-fuku-black">
            福岡の“今”を届ける。
          </h3>
          <p className="mt-3 text-[12px] font-bold leading-relaxed text-fuku-black">
            {cms?.description ?? "Web記事、フリーペーパー、設置店舗を通じて、福岡の人・店・街・イベントを特集します。"}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <a
              href={cms?.ctaHref ?? "/magazine"}
              className="inline-flex min-h-[44px] w-fit items-center gap-3 rounded-full bg-fuku-black px-5 text-[12px] font-black text-white"
            >
              {cms?.ctaText ?? "最新号を見る"}
              <ArrowRight size={15} />
            </a>
            <a
              href="/magazine/locations"
              className="inline-flex min-h-[44px] w-fit items-center gap-3 rounded-full border border-fuku-black bg-white px-5 text-[12px] font-black text-fuku-black"
            >
              設置場所
              <ArrowRight size={15} />
            </a>
          </div>
          <a href="/forms/freepaper" className="mt-4 block text-[11px] font-black text-fuku-gray">
            フリーペーパー設置申請 →
          </a>
        </div>

        <div
          className="absolute bottom-12 right-4 h-[190px] w-[132px] rotate-[8deg] rounded-[4px] border-[7px] border-white bg-white bg-cover bg-center shadow-phone"
          style={{ backgroundImage: `url('${cms?.image ?? "/images/paper-cover.jpg"}')` }}
        >
          <div className="h-full w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(17,17,17,0.18))]" />
        </div>
        <span className="absolute bottom-9 right-4 z-20 grid h-[62px] w-[62px] place-items-center rounded-full bg-fuku-black text-center text-[12px] font-black leading-tight text-white">
          TAKE
          <br />
          FREE
        </span>
      </article>
    </section>
  );
}

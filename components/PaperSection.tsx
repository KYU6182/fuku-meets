import { ArrowRight, CalendarDays, Coffee, FileText, ShoppingBag, Building2 } from "lucide-react";
import type { HomeCmsData } from "@/types/cms";

export default function PaperSection({ cms }: { cms?: HomeCmsData["magazine"] }) {
  if (cms?.isVisible === false) return null;

  return (
    <section className="bg-white px-4 pt-10">
      <article className="relative overflow-hidden rounded-[28px] border border-[#e8ddd4] bg-[linear-gradient(135deg,#fffaf4_0%,#f1e9df_100%)] p-6 shadow-soft">
        <div className="absolute right-6 top-6 grid grid-cols-6 gap-2 opacity-50">
          {Array.from({ length: 24 }).map((_, index) => (
            <span key={index} className="h-1 w-1 rounded-full bg-fuku-red" />
          ))}
        </div>
        <div className="relative z-10 max-w-[230px]">
          <h2 className="headline-condensed text-[46px] uppercase leading-[0.95] text-fuku-black">
            FUKU-MEETS
            <br />
            MAGAZINE
          </h2>
          <p className="mt-5 text-[17px] font-black leading-relaxed text-fuku-black">
            {cms?.subtitle ?? "福岡の空気を、Webと紙で残すローカルマガジン。"}
          </p>
          <span className="mt-8 inline-flex rounded-[7px] bg-fuku-red px-3 py-2 text-[13px] font-black tracking-widest text-white">
            VOL.01
          </span>
          <h3 className="mt-5 text-[30px] font-black leading-tight text-fuku-black">
            福岡の<span className="text-fuku-red">“今”</span>を
            <br />
            届ける。
          </h3>
          <div className="mt-3 h-[2px] w-12 bg-fuku-red" />
          <p className="mt-5 whitespace-pre-line text-[14px] font-bold leading-[1.9] text-fuku-black">
            {cms?.description ?? "Web記事、フリーペーパー、\n設置店舗を通して、\n福岡の人・店・街・イベントを\n特集します。"}
          </p>

          <div className="mt-7 grid gap-3">
            <a
              href={cms?.ctaHref ?? "/magazine"}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-fuku-red px-5 text-[14px] font-black text-white shadow-[0_12px_28px_rgba(229,36,33,0.24)]"
            >
              {cms?.ctaText ?? "最新号を見る"}
              <ArrowRight size={17} />
            </a>
            <a
              href="/magazine/locations"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full border border-fuku-red bg-white px-5 text-[14px] font-black text-fuku-red"
            >
              設置場所
              <ArrowRight size={17} />
            </a>
            <a href="/forms/paper-placement" className="inline-flex items-center gap-2 text-[12px] font-black text-fuku-black">
              <FileText size={15} />
              フリーペーパー設置申請
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-[104px] right-2 h-[268px] w-[178px] rotate-[8deg] rounded-[5px] border-[9px] border-white bg-white bg-cover bg-center shadow-phone min-[390px]:right-5"
          style={{ backgroundImage: `url('${cms?.image ?? "/images/paper-cover.jpg"}')` }}
        >
          <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,.2),rgba(229,36,33,.12))] p-4">
            <p className="font-serif text-[34px] italic leading-none text-[#b8747d]">nimini</p>
            <div className="rounded bg-white/75 p-2">
              <p className="text-[10px] font-black text-fuku-red">FEATURE</p>
              <p className="mt-1 text-[17px] font-black leading-tight text-[#b8747d]">なんか、気になるあの店。</p>
            </div>
          </div>
        </div>
        <span className="absolute bottom-[98px] right-5 z-20 grid h-[78px] w-[78px] place-items-center rounded-full border border-white/80 bg-[#c8848b] text-center text-[16px] font-black leading-tight text-white shadow-soft">
          TAKE
          <br />
          FREE
        </span>

        <div className="relative z-20 mt-10 grid grid-cols-4 overflow-hidden rounded-[18px] bg-white/85 text-center shadow-soft backdrop-blur">
          {[
            { label: "グルメ", icon: Coffee },
            { label: "ショッピング", icon: ShoppingBag },
            { label: "街・カルチャー", icon: Building2 },
            { label: "イベント", icon: CalendarDays },
          ].map(({ label, icon: Icon }, index) => (
            <div key={label} className={`px-2 py-4 ${index > 0 ? "border-l border-[#ead8d2]" : ""}`}>
              <Icon className="mx-auto text-fuku-black" size={23} />
              <p className="mt-2 text-[10px] font-black text-fuku-black">{label}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

import { ArrowRight, Music2 } from "lucide-react";
import type { HomeCmsData } from "@/types/cms";

export default function HomeFollowUsSection({ cms }: { cms?: HomeCmsData["followUs"] }) {
  if (cms?.isVisible === false) return null;
  return (
    <section className="bg-white px-5 py-8">
      <p className="headline-condensed text-[39px] uppercase leading-none text-fuku-black">{cms?.title ?? "FOLLOW US"}</p>
      <p className="mt-2 text-[14px] font-black text-fuku-black">{cms?.subtitle ?? "福岡の“今”をSNSでも。"}</p>
      <div className="mt-5 rounded-[16px] border border-fuku-border bg-white p-4 shadow-soft">
        <a href={cms?.ctaHref ?? "/meet"} className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)] text-white">
            <span className="h-8 w-8 rounded-[9px] border-2 border-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[18px] font-black text-fuku-black">Instagram</span>
            <span className="mt-1 block text-[13px] font-black text-fuku-gray">@fuku_meets.jp</span>
            <span className="mt-2 block text-[11px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "福岡の“今”をSNSでも。"}</span>
          </span>
          <ArrowRight size={19} className="shrink-0 text-fuku-black" />
        </a>
        <div className="mt-4 flex items-center justify-between border-t border-fuku-border pt-4">
          <p className="text-[12px] font-black text-fuku-black">TikTok / X でも更新中</p>
          <div className="flex gap-2">
            <a href="/news" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full bg-fuku-black text-white">
              <Music2 size={17} />
            </a>
            <a href="/news" aria-label="X" className="grid h-10 w-10 place-items-center rounded-full bg-fuku-black text-[13px] font-black text-white">
              X
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

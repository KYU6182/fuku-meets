import { BadgeCheck, MapPin, ShieldCheck, Siren, Star, Users } from "lucide-react";
import type { HomeCmsData } from "@/types/cms";

const iconMap = { ShieldCheck, BadgeCheck, Users, Star, Siren, MapPin };

export default function SafetyCommunitySection({ cms }: { cms?: HomeCmsData["safety"] }) {
  if (cms?.isVisible === false) return null;
  const items = cms?.items ?? [];
  return (
    <section className="border-y border-fuku-border bg-white px-5 py-8">
      <div className="rounded-[16px] border border-fuku-border bg-[#fbfaf7] p-5">
        <div className="flex gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-fuku-red shadow-soft">
            <ShieldCheck size={30} />
          </span>
          <div>
            <h2 className="text-[22px] font-black leading-tight text-fuku-black">{cms?.title ?? "安心・安全に楽しめる仕組み"}</h2>
            <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "みんなが気持ちよくつながれる場を守っています。"}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {items.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? ShieldCheck;
            return (
              <div key={item.id} className="rounded-[12px] border border-fuku-border bg-white p-3">
                <Icon className="text-fuku-red" size={20} />
                <p className="mt-2 text-[12px] font-black text-fuku-black">{item.title}</p>
                <p className="mt-1 text-[10px] font-bold leading-relaxed text-fuku-gray">{item.description}</p>
              </div>
            );
          })}
        </div>
        <a href="/start-guide" className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-full border border-fuku-black px-5 text-[12px] font-black text-fuku-black">
          初参加の安心ガイドを見る →
        </a>
      </div>
    </section>
  );
}

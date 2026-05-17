import { ArrowRight } from "lucide-react";
import CommunityMiniCard from "./CommunityMiniCard";
import { getCommunities } from "@/lib/communityMeet";

type LegacyPickupCommunityCms = {
  title?: string;
  subtitle?: string;
  communityIds?: string[];
  ctaText?: string;
  ctaHref?: string;
  isVisible?: boolean;
};

export default function PickUpCommunitySection({ cms }: { cms?: LegacyPickupCommunityCms }) {
  if (cms?.isVisible === false) return null;
  const communities = getCommunities();
  const ids = cms?.communityIds?.length ? cms.communityIds : communities.map((item) => item.id);
  const picked = ids.map((id) => communities.find((item) => item.id === id || item.slug === id)).filter(Boolean).slice(0, 6) as typeof communities;

  return (
    <section className="bg-white px-5 py-8">
      <div className="rounded-[18px] bg-fuku-black p-4 text-white shadow-phone">
        <span className="rounded-[5px] bg-fuku-red px-3 py-1 text-[10px] font-black uppercase tracking-widest">PICK UP</span>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="headline-condensed text-[34px] uppercase leading-none">{cms?.title ?? "PICK UP"}</p>
            <p className="mt-2 text-[18px] font-black">{cms?.subtitle ?? "注目のコミュニティ"}</p>
          </div>
          <a href={cms?.ctaHref ?? "/meet"} className="text-[12px] font-black text-white">{cms?.ctaText ?? "すべて見る"} →</a>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {picked.map((community) => (
            <CommunityMiniCard key={community.id} community={community} dark />
          ))}
        </div>
        <a href={cms?.ctaHref ?? "/meet"} className="mt-5 flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-fuku-red text-[14px] font-black text-white">
          {cms?.ctaText ?? "コミュニティを探す"}
          <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}

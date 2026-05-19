import { Bookmark, CalendarDays, MapPin } from "lucide-react";
import CommunityGenderRatio from "./CommunityGenderRatio";
import CommunityParticipantAvatars from "./CommunityParticipantAvatars";
import type { CommunityMeet } from "@/types/communityMeet";

function fallbackForCategory(category: string) {
  if (category.includes("音楽") || category.includes("ライブ")) return "linear-gradient(135deg,#101828,#2f7dd1)";
  if (category.includes("飲み")) return "linear-gradient(135deg,#25110b,#e85b61)";
  if (category.includes("カフェ")) return "linear-gradient(135deg,#eadfd8,#8b6f58)";
  if (category.includes("女子")) return "linear-gradient(135deg,#fff1f1,#e83b75)";
  if (category.includes("深夜")) return "linear-gradient(135deg,#111111,#334155)";
  return "linear-gradient(135deg,#f2eee8,#ffffff)";
}

export default function CommunityCard({ community }: { community: CommunityMeet }) {
  const image = community.image || "";
  return (
    <article className="overflow-hidden rounded-[16px] border border-fuku-border bg-white shadow-soft">
      <a
        href={`/meet/${community.slug}`}
        className="relative block aspect-[16/9] bg-fuku-light bg-cover bg-center"
        style={{ backgroundImage: image ? `linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.28)),url('${image}')` : fallbackForCategory(community.category) }}
      >
        <span className="absolute left-2 top-2 rounded-[5px] bg-fuku-black px-2 py-1 text-[10px] font-black text-white">{community.category}</span>
        <span className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-fuku-black" aria-label="保存">
          <Bookmark size={18} />
        </span>
      </a>
      <div className="grid gap-3 p-3">
        <a href={`/meet/${community.slug}`} className="block">
          <h2 className="line-clamp-1 text-[18px] font-black leading-tight text-fuku-black">{community.title}</h2>
          <p className="mt-1 line-clamp-1 text-[12px] font-bold text-fuku-gray">{community.publicAreaLabel ?? community.venueName}</p>
        </a>
        <div className="flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-fuku-red">{tag}</span>
          ))}
        </div>
        <div className="grid gap-1 text-[11px] font-black text-fuku-black">
          <span className="inline-flex items-center gap-1"><CalendarDays size={13} /> {community.date.slice(5).replace("-", ".")} {community.startTime}〜</span>
          <span className="inline-flex items-center gap-1"><MapPin size={13} /> {community.area}エリア</span>
        </div>
        <div className="grid grid-cols-[1fr_96px] items-center gap-3 border-t border-fuku-border pt-3">
          <div>
            <p className="text-[11px] font-black text-fuku-black">参加予定 <span className="text-fuku-red">{community.participantCount}人</span></p>
            <div className="mt-2"><CommunityParticipantAvatars count={community.participantCount} /></div>
          </div>
          <CommunityGenderRatio maleRatio={community.maleRatio} femaleRatio={community.femaleRatio} size={58} />
        </div>
      </div>
    </article>
  );
}

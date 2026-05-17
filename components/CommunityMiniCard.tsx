import { CalendarDays, MapPin } from "lucide-react";
import CommunityParticipantAvatars from "./CommunityParticipantAvatars";
import type { CommunityMeet } from "@/types/communityMeet";

export default function CommunityMiniCard({ community, dark = false }: { community: CommunityMeet; dark?: boolean }) {
  return (
    <a href={`/meet/${community.slug}`} className={`block min-w-[210px] overflow-hidden rounded-[12px] border ${dark ? "border-white/15 bg-white text-fuku-black" : "border-fuku-border bg-white text-fuku-black"} shadow-soft`}>
      <div
        className="relative h-[118px] bg-fuku-light bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.24)),url('${community.image}')` }}
      >
        <span className="absolute left-3 top-3 rounded-[5px] bg-fuku-black px-2 py-1 text-[10px] font-black text-white">
          {community.category}
        </span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-[16px] font-black leading-tight">{community.title}</h3>
        <p className="mt-1 text-[11px] font-bold text-fuku-gray">{community.area}エリア</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {community.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-[#fff1f1] px-2 py-1 text-[9px] font-black text-fuku-red">{tag}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[11px] font-black text-fuku-black">参加予定 <span className="text-fuku-red">{community.participantCount}人</span></p>
          <CommunityParticipantAvatars count={community.participantCount} />
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-fuku-border pt-2 text-[10px] font-black text-fuku-gray">
          <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {community.date.slice(5).replace("-", ".")}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {community.area}</span>
          <span className="text-fuku-red">800円</span>
        </div>
      </div>
    </a>
  );
}

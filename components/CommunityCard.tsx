import { Bookmark, CalendarDays, MapPin } from "lucide-react";
import CommunityGenderRatio from "./CommunityGenderRatio";
import CommunityParticipantAvatars from "./CommunityParticipantAvatars";
import type { CommunityMeet } from "@/types/communityMeet";

export default function CommunityCard({ community }: { community: CommunityMeet }) {
  return (
    <article className="grid grid-cols-[118px_1fr_82px] overflow-hidden rounded-[14px] border border-fuku-border bg-white shadow-soft">
      <a
        href={`/meet/${community.slug}`}
        className="relative min-h-[128px] bg-fuku-light bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.22)),url('${community.image}')` }}
      >
        <span className="absolute left-2 top-2 rounded-[5px] bg-fuku-black px-2 py-1 text-[10px] font-black text-white">{community.category}</span>
      </a>
      <a href={`/meet/${community.slug}`} className="min-w-0 border-r border-fuku-border p-3">
        <h2 className="line-clamp-1 text-[17px] font-black leading-tight text-fuku-black">{community.title}</h2>
        <p className="mt-1 line-clamp-1 text-[11px] font-bold text-fuku-gray">{community.venueName}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[#fff1f1] px-2 py-1 text-[9px] font-black text-fuku-red">{tag}</span>
          ))}
        </div>
        <div className="mt-2 grid gap-1 text-[10px] font-black text-fuku-black">
          <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {community.date.slice(5).replace("-", ".")} {community.startTime}〜</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {community.area}エリア</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[10px] font-black text-fuku-black">参加予定 <span className="text-fuku-red">{community.participantCount}人</span></p>
          <CommunityParticipantAvatars count={community.participantCount} />
        </div>
      </a>
      <div className="relative grid place-items-center p-2">
        <button type="button" className="absolute right-2 top-2 text-fuku-black" aria-label="保存">
          <Bookmark size={20} />
        </button>
        <CommunityGenderRatio maleRatio={community.maleRatio} femaleRatio={community.femaleRatio} size={62} />
      </div>
    </article>
  );
}

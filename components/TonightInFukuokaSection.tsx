import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Coffee,
  MapPin,
  Moon,
  Music,
  ShieldCheck,
  Star,
  Users,
  Wine,
} from "lucide-react";
import CommunityGenderRatio from "@/components/CommunityGenderRatio";
import CommunityParticipantAvatars from "@/components/CommunityParticipantAvatars";
import { getCommunities, meetCategories } from "@/lib/communityMeet";
import type { HomeCmsData } from "@/types/cms";
import type { CommunityMeet } from "@/types/communityMeet";

const iconMap = {
  music: Music,
  "drink-now": Wine,
  midnight: Moon,
  girls: Users,
  solo: BadgeCheck,
  visitor: MapPin,
  "cafe-work": Coffee,
  sauna: Users,
};

const requestedCategories = ["music", "drink-now", "midnight", "girls", "solo"];

function formatDate(community: CommunityMeet) {
  return `${community.date.slice(5).replace("-", ".")} ${community.startTime}〜`;
}

function MiniPickupCard({ community }: { community: CommunityMeet }) {
  return (
    <a href={`/meet/${community.slug}`} className="block min-w-[178px] overflow-hidden rounded-[12px] bg-white text-fuku-black shadow-soft">
      <div
        className="relative h-[104px] bg-fuku-light bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.32)),url('${community.image}')` }}
      >
        <span className="absolute left-2 top-2 rounded-[4px] bg-fuku-black px-2 py-1 text-[10px] font-black text-white">
          {community.category}
        </span>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-[15px] font-black leading-tight">{community.title}</h3>
        <p className="mt-1 text-[11px] font-bold text-fuku-gray">{community.venueName}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {community.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-[#fff1f1] px-2 py-1 text-[9px] font-black text-fuku-red">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] font-black">
            参加予定 <span className="text-fuku-red">{community.participantCount}人</span>
          </p>
          <CommunityParticipantAvatars count={community.participantCount} />
        </div>
      </div>
    </a>
  );
}

function CommunityListCard({ community }: { community: CommunityMeet }) {
  return (
    <a href={`/meet/${community.slug}`} className="grid grid-cols-[104px_1fr_78px] overflow-hidden rounded-[14px] border border-fuku-border bg-white shadow-soft">
      <div
        className="relative min-h-[142px] bg-fuku-light bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.3)),url('${community.image}')` }}
      >
        <span className="absolute left-2 top-2 rounded-[4px] bg-fuku-black px-2 py-1 text-[9px] font-black text-white">
          {community.category}
        </span>
      </div>
      <div className="min-w-0 p-3">
        <h3 className="line-clamp-1 text-[16px] font-black leading-tight text-fuku-black">{community.title}</h3>
        <p className="mt-1 line-clamp-1 text-[11px] font-bold text-fuku-gray">{community.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[#fff1f1] px-2 py-1 text-[9px] font-black text-fuku-red">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 grid gap-1 text-[10px] font-black text-fuku-black">
          <span>{formatDate(community)}</span>
          <span>{community.area}エリア</span>
          <span>
            参加予定 <b className="text-fuku-red">{community.participantCount}人</b>
          </span>
        </div>
        <div className="mt-2">
          <CommunityParticipantAvatars count={community.participantCount} />
        </div>
      </div>
      <div className="relative border-l border-fuku-border px-2 py-3">
        <button type="button" aria-label="保存" className="absolute right-2 top-2 text-fuku-black">
          <Bookmark size={18} />
        </button>
        <div className="mt-7">
          <CommunityGenderRatio maleRatio={community.maleRatio} femaleRatio={community.femaleRatio} size={56} />
        </div>
      </div>
    </a>
  );
}

export default function TonightInFukuokaSection({ cms }: { cms?: HomeCmsData["tonight"] }) {
  if (cms?.isVisible === false) return null;
  const communities = getCommunities().filter((community) => community.status === "published");
  const featured = communities.slice(0, 3);
  const listed = communities.slice(0, 5);
  const categoryIds = cms?.categoryIds?.length ? cms.categoryIds : requestedCategories;
  const categories = categoryIds
    .map((id) => meetCategories.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 5) as typeof meetCategories;

  return (
    <section className="border-y border-fuku-border bg-white px-5 py-9">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="headline-condensed text-[37px] uppercase leading-none text-fuku-black">{cms?.title ?? "TONIGHT IN FUKUOKA"}</h2>
            {(cms?.showNewBadge ?? true) ? <span className="rounded-[6px] bg-fuku-red px-3 py-1 text-[11px] font-black text-white">NEW</span> : null}
          </div>
          <p className="mt-3 text-[15px] font-black leading-relaxed text-fuku-black">{cms?.subtitle ?? "今日の気分や趣味で集まれるコミュニティ。"}</p>
          <p className="mt-1 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "初めてでも安心して参加できます。素敵な出会いを楽しもう！"}</p>
        </div>
        <a href={cms?.ctaHref ?? "/meet"} className="mt-2 shrink-0 text-[12px] font-black text-fuku-black">
          {cms?.ctaText ?? "すべて見る"} →
        </a>
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
        {categories.map((category) => {
          const Icon = iconMap[category.id as keyof typeof iconMap] ?? Users;
          return (
            <a key={category.id} href={`/meet?category=${encodeURIComponent(category.label)}`} className="grid min-h-[112px] min-w-[116px] place-items-center rounded-[12px] border border-fuku-border bg-white p-3 text-center shadow-soft">
              <Icon className="text-fuku-red" size={32} strokeWidth={2.4} />
              <span className="mt-2 text-[13px] font-black leading-tight text-fuku-black">{category.label}</span>
            </a>
          );
        })}
      </div>

      <div className="mt-7 rounded-[18px] bg-fuku-black p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded-[4px] bg-fuku-red px-2 py-1 text-[10px] font-black tracking-widest text-white">PICK UP</span>
            <h3 className="mt-3 text-[24px] font-black leading-tight">注目のコミュニティ</h3>
          </div>
          <a href="/meet" className="mt-2 shrink-0 text-[12px] font-black text-white">
            すべて見る →
          </a>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
          {featured.map((community) => (
            <MiniPickupCard key={community.id} community={community} />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {listed.map((community) => (
          <CommunityListCard key={community.id} community={community} />
        ))}
      </div>

      <div className="mt-6 rounded-[16px] border border-fuku-border bg-[#fbfaf7] p-4">
        <p className="text-[16px] font-black text-fuku-black">はじめての方へ</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["1", "見つける", "気になるMEETを探す"],
            ["2", "参加する", "安心してすぐ参加"],
            ["3", "楽しむ", "リアルにつながる"],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-[12px] bg-white p-3 text-center">
              <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-fuku-red text-[12px] font-black text-white">{step}</span>
              <p className="mt-2 text-[12px] font-black text-fuku-black">{title}</p>
              <p className="mt-1 text-[9px] font-bold leading-snug text-fuku-gray">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <a href="/visitor" className="mt-4 flex items-center justify-between gap-3 rounded-[16px] border border-fuku-border bg-white p-4 shadow-soft">
        <div>
          <p className="text-[15px] font-black text-fuku-black">遠征・観光で福岡に来た人へ</p>
          <p className="mt-1 text-[11px] font-bold leading-relaxed text-fuku-gray">おすすめスポットや当日参加OKのMEETを紹介！</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fuku-black text-white">
          <ArrowRight size={17} />
        </span>
      </a>

      <div className="mt-4 grid grid-cols-4 gap-2 rounded-[14px] border border-fuku-border bg-white p-3 text-center">
        {[
          [ShieldCheck, "本人確認済み"],
          [Star, "レビューあり"],
          [BadgeCheck, "女性安心設計"],
          [Users, "通報・ブロック"],
        ].map(([Icon, label]) => {
          const SafeIcon = Icon as typeof ShieldCheck;
          return (
            <div key={label as string} className="min-w-0">
              <SafeIcon className="mx-auto text-fuku-red" size={20} />
              <p className="mt-1 text-[9px] font-black leading-tight text-fuku-black">{label as string}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import {
  BadgeCheck,
  Bookmark,
  Briefcase,
  Camera,
  Handshake,
  HeartHandshake,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import CommunityGenderRatio from "@/components/CommunityGenderRatio";
import CommunityParticipantAvatars from "@/components/CommunityParticipantAvatars";
import {
  defaultCommunities,
  getFallbackCategoryMeets,
  getPublishedCommunitiesAsync,
  homeMeetCategories,
} from "@/lib/communityMeet";
import type { HomeCmsData } from "@/types/cms";
import type { CommunityMeet } from "@/types/communityMeet";

type MeetCategory = (typeof homeMeetCategories)[number];

function formatDate(community: CommunityMeet) {
  return `${community.date.slice(5).replace("-", ".")} ${community.startTime}〜`;
}

function meetImageStyle(community: CommunityMeet) {
  if (community.image) {
    return { backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.28)),url('${community.image}')` };
  }
  const fallback = community.category.includes("音楽")
    ? "linear-gradient(135deg,#101828,#2f7dd1)"
    : community.category.includes("飲み")
      ? "linear-gradient(135deg,#25110b,#e85b61)"
      : community.category.includes("カフェ")
        ? "linear-gradient(135deg,#eadfd8,#8b6f58)"
        : community.category.includes("女子")
          ? "linear-gradient(135deg,#fff1f1,#e83b75)"
          : "linear-gradient(135deg,#111111,#334155)";
  return { backgroundImage: fallback };
}

function MiniPickupCard({ community }: { community: CommunityMeet }) {
  return (
    <a href={`/meet/${community.slug}`} className="block min-w-[178px] overflow-hidden rounded-[12px] bg-white text-fuku-black shadow-soft">
      <div
        className="relative h-[104px] bg-fuku-light bg-cover bg-center"
        style={meetImageStyle(community)}
      >
        <span className="absolute left-2 top-2 rounded-[4px] bg-fuku-black px-2 py-1 text-[10px] font-black text-white">
          MEET
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
    <a href={`/meet/${community.slug}`} className="block overflow-hidden rounded-[16px] border border-fuku-border bg-white shadow-soft">
      <div
        className="relative aspect-[16/9] bg-fuku-light bg-cover bg-center"
        style={meetImageStyle(community)}
      >
        <span className="absolute left-2 top-2 rounded-[4px] bg-fuku-black px-2 py-1 text-[9px] font-black text-white">
          MEET
        </span>
        <span className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-fuku-black">
          <Bookmark size={17} />
        </span>
      </div>
      <div className="grid gap-3 p-3">
        <div>
          <h3 className="line-clamp-1 text-[17px] font-black leading-tight text-fuku-black">{community.title}</h3>
          <p className="mt-1 line-clamp-1 text-[11px] font-bold text-fuku-gray">{community.description}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[#fff1f1] px-2 py-1 text-[9px] font-black text-fuku-red">
              {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_76px] gap-3 border-t border-fuku-border pt-3">
          <div className="grid gap-1 text-[10px] font-black text-fuku-black">
            <span>{formatDate(community)}</span>
            <span>{community.publicAreaLabel ?? `${community.area}エリア`}</span>
            <span>
              参加予定 <b className="text-fuku-red">{community.participantCount}人</b>
            </span>
            <div className="mt-1">
              <CommunityParticipantAvatars count={community.participantCount} />
            </div>
          </div>
          <CommunityGenderRatio maleRatio={community.maleRatio} femaleRatio={community.femaleRatio} size={54} />
        </div>
      </div>
    </a>
  );
}

const categoryIconMap: Record<string, typeof Users> = {
  "men-relaxed": Users,
  "women-safe": HeartHandshake,
  "new-fukuoka": Handshake,
  expedition: Briefcase,
  tourism: Camera,
};

export default function TonightInFukuokaSection({ cms }: { cms?: HomeCmsData["tonight"] }) {
  const [communities, setCommunities] = useState(() => defaultCommunities.filter((community) => community.status === "published"));
  const [categories, setCategories] = useState<MeetCategory[]>(() => homeMeetCategories.filter((category) => category.isVisible));
  const [selectedCategory, setSelectedCategory] = useState("women-safe");
  const [categoryCommunities, setCategoryCommunities] = useState<CommunityMeet[]>(() => getFallbackCategoryMeets("women-safe"));

  useEffect(() => {
    let mounted = true;
    void getPublishedCommunitiesAsync().then((items) => {
      if (mounted) setCommunities(items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    void fetch("/api/meet-categories", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!mounted || !payload?.categories?.length) return;
        setCategories(payload.categories);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    void fetch(`/api/meet-categories/${encodeURIComponent(selectedCategory)}/meets`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!mounted) return;
        const nextCommunities = payload?.communities?.length
          ? (payload.communities as CommunityMeet[])
          : getFallbackCategoryMeets(selectedCategory);
        setCategoryCommunities(nextCommunities);
      })
      .catch(() => {
        if (mounted) setCategoryCommunities(getFallbackCategoryMeets(selectedCategory));
      });
    return () => {
      mounted = false;
    };
  }, [selectedCategory]);

  if (cms?.isVisible === false) return null;
  const featured = communities.slice(0, 3);
  const selectedCategoryLabel = categories.find((category) => category.id === selectedCategory)?.label ?? "女の子同士で安心";
  return (
    <section className="border-y border-fuku-border bg-white px-5 py-9">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="headline-condensed text-[37px] uppercase leading-none text-fuku-black">{cms?.title ?? "TONIGHT IN FUKUOKA"}</h2>
            {(cms?.showNewBadge ?? true) ? <span className="rounded-[6px] bg-fuku-red px-3 py-1 text-[11px] font-black text-white">NEW</span> : null}
          </div>
          <p className="mt-3 text-[15px] font-black leading-relaxed text-fuku-black">{cms?.subtitle ?? "今日の気分や趣味で参加できるMEET。"}</p>
          <p className="mt-1 text-[12px] font-bold leading-relaxed text-fuku-gray">{cms?.description ?? "初めてでも安心して参加できます。素敵な出会いを楽しもう！"}</p>
        </div>
        <a href={cms?.ctaHref ?? "/meet"} className="mt-2 shrink-0 text-[12px] font-black text-fuku-black">
          {cms?.ctaText ?? "すべて見る"} →
        </a>
      </div>

      <div className="mt-7 rounded-[18px] bg-fuku-black p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded-[4px] bg-fuku-red px-2 py-1 text-[10px] font-black tracking-widest text-white">PICK UP</span>
            <h3 className="mt-3 text-[24px] font-black leading-tight">注目のMEET</h3>
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

      <div className="mt-7">
        <h3 className="text-[18px] font-black text-fuku-black">カテゴリで探す</h3>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
          {categories.map((category) => {
            const Icon = categoryIconMap[category.id] ?? Users;
            const isActive = category.id === selectedCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`grid min-h-[112px] min-w-[116px] place-items-center rounded-[14px] border px-3 py-4 text-center transition ${
                  isActive ? "border-fuku-red bg-[#fff1f1] text-fuku-red" : "border-fuku-border bg-white text-fuku-black"
                }`}
              >
                <Icon size={30} strokeWidth={2.3} />
                <span className="mt-3 text-[13px] font-black leading-tight">{category.label}</span>
                <span className="mt-1 line-clamp-2 text-[9px] font-bold leading-tight text-fuku-gray">{category.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[20px] font-black text-fuku-black">{selectedCategoryLabel}のMEET</h3>
          <a href={`/meet?category=${selectedCategory}`} className="shrink-0 text-[12px] font-black text-fuku-black">
            すべて見る →
          </a>
        </div>
        <div className="mt-3 grid gap-3">
          {categoryCommunities.slice(0, 3).map((community) => (
            <CommunityListCard key={`${selectedCategory}-${community.id}`} community={community} />
          ))}
        </div>
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

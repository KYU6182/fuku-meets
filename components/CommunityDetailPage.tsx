"use client";

import { CalendarDays, MapPin, Share2, ShieldCheck, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import CommunityGenderRatio from "./CommunityGenderRatio";
import CommunityJoinButton from "./CommunityJoinButton";
import Header from "./Header";
import { defaultCommunities, getCommunityBySlugAsync } from "@/lib/communityMeet";

export default function CommunityDetailPage({ slug }: { slug: string }) {
  const [community, setCommunity] = useState(() => defaultCommunities.find((item) => item.slug === slug || item.id === slug) ?? defaultCommunities[0]);
  useEffect(() => {
    let mounted = true;
    void getCommunityBySlugAsync(slug).then((item) => {
      if (mounted && item) setCommunity(item);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-[#fbfaf7] shadow-phone">
      <Header />
      <main className="pb-28">
        <div className="px-4 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <a href="/meet" className="text-[13px] font-black text-fuku-black">← 戻る</a>
            <button type="button" className="inline-flex items-center gap-2 text-[13px] font-black"><Share2 size={16} /> シェア</button>
          </div>
          <div
            className="relative h-[214px] rounded-t-[16px] bg-fuku-light bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.28)),url('${community.image}')` }}
          >
            <span className="absolute left-4 top-4 rounded-[6px] bg-fuku-black px-3 py-2 text-[12px] font-black text-white">{community.category}</span>
          </div>
          <section className="-mt-3 rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
            <h1 className="text-[34px] font-black leading-tight text-fuku-black">{community.title}</h1>
            <p className="mt-2 text-[14px] font-black text-fuku-gray">{community.venueName}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {community.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-[#fff1f1] px-3 py-2 text-[11px] font-black text-fuku-red">{tag}</span>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-[1fr_104px] gap-4 rounded-[14px] border border-fuku-border p-4">
              <div className="grid gap-3 text-[13px] font-black text-fuku-black">
                <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {community.date} {community.startTime}〜{community.endTime}</span>
                <span className="inline-flex items-center gap-2"><MapPin size={16} /> {community.area}エリア（詳細は参加者に共有）</span>
                <span className="inline-flex items-center gap-2"><Users size={16} /> 参加予定 {community.participantCount}人</span>
              </div>
              <CommunityGenderRatio maleRatio={community.maleRatio} femaleRatio={community.femaleRatio} size={76} />
            </div>
          </section>
        </div>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[20px] font-black text-fuku-black">この会について</h2>
          <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-black">{community.description}</p>
          <p className="mt-3 text-[12px] font-bold leading-relaxed text-fuku-gray">20歳未満の飲酒は禁止です。連絡先交換の強要、セクハラ、勧誘、迷惑行為は禁止です。</p>
        </section>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[20px] font-black text-fuku-black">参加メンバー</h2>
          <div className="mt-4 flex items-start gap-4 overflow-x-auto pb-1">
            {["20代後半\n福岡市", "20代前半\n福岡市", "20代後半\n北九州市", "20代前半\n福岡市", "+7人\n参加予定"].map((label, index) => (
              <div key={label} className="min-w-[68px] text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-fuku-red bg-fuku-light bg-cover bg-center text-[12px] font-black text-fuku-gray" style={{ backgroundImage: index < 4 ? `url('/images/icons/${index % 2 ? "haru" : "kento"}.jpg')` : undefined }}>
                  {index === 4 ? "+7人" : ""}
                </div>
                <p className="mt-2 whitespace-pre-line text-[10px] font-bold leading-relaxed text-fuku-black">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[20px] font-black text-fuku-black">幹事情報とレビュー</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${community.hostAvatar}')` }} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-black text-fuku-black">{community.hostName} <span className="rounded-full bg-[#eadfd8] px-2 py-1 text-[10px]">{community.hostRank}</span></p>
              <p className="mt-1 text-[11px] font-bold text-fuku-gray">開催{community.hostEventCount}回 / レビュー {community.hostReviewScore}</p>
            </div>
            <Star className="text-[#f5b400]" />
          </div>
        </section>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[20px] font-black text-fuku-black">安心表示</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["本人確認済みユーザーのみ", "通報・ブロックあり", "参加後レビューあり", "店舗は参加者にのみ共有"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-[10px] bg-[#fff1f1] px-3 py-2 text-[11px] font-black text-fuku-red"><ShieldCheck size={14} /> {item}</span>
            ))}
          </div>
        </section>

        <div className="sticky bottom-[86px] z-30 mx-4 mt-5 rounded-[18px] bg-white/95 p-3 shadow-phone backdrop-blur">
          <CommunityJoinButton community={community} />
        </div>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

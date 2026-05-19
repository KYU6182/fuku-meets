"use client";

import { CalendarDays, Filter, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import CommunityCard from "@/components/CommunityCard";
import { defaultCommunities, getPublishedCommunitiesAsync } from "@/lib/communityMeet";
import type { CommunityMeet } from "@/types/communityMeet";

export default function TodayMeetPage() {
  const [items, setItems] = useState<CommunityMeet[]>(defaultCommunities);

  useEffect(() => {
    let mounted = true;
    void getPublishedCommunitiesAsync().then((communities) => {
      if (!mounted) return;
      const visible = communities.filter((community) => community.status === "published" && community.participantCount < community.capacity);
      setItems(visible.length ? visible : defaultCommunities);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main className="px-5 pb-28 pt-7">
        <a href="/visitor" className="text-[13px] font-black text-fuku-black">← VISITOR GUIDE</a>
        <h1 className="headline-condensed mt-4 text-[44px] uppercase leading-none text-fuku-black">TODAY MEETS</h1>
        <p className="mt-3 text-[14px] font-black leading-relaxed text-fuku-black">
          今日参加できるMEET。一人参加OK・女性参加あり・20歳以上確認など、安心表示を見て選べます。
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["一人参加OK", "女性参加あり", "20歳以上確認"].map((label) => (
            <span key={label} className="rounded-[12px] border border-fuku-border bg-[#fbfaf7] px-2 py-3 text-center text-[10px] font-black text-fuku-black">
              {label}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[12px] font-black text-fuku-gray">開催候補 {items.length}件</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-fuku-border px-3 py-2 text-[11px] font-black text-fuku-black">
            <Filter size={13} /> おすすめ順
          </span>
        </div>
        <div className="mt-4 grid gap-4">
          {items.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
        <section className="mt-6 rounded-[16px] border border-fuku-border bg-[#fff1f1] p-5">
          <h2 className="text-[18px] font-black text-fuku-black">参加前に確認</h2>
          <div className="mt-3 grid gap-2 text-[12px] font-bold text-fuku-black">
            <p><CalendarDays size={14} className="mr-2 inline text-fuku-red" />開催日・開始時間を確認してください。</p>
            <p><MapPin size={14} className="mr-2 inline text-fuku-red" />店舗詳細は参加確定後に共有されます。</p>
          </div>
        </section>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

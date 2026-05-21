"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import CommunityMiniCard from "@/components/CommunityMiniCard";
import Header from "@/components/Header";
import { getCommunities, getCommunityInterests } from "@/lib/communityMeet";
import { getCurrentUser } from "@/lib/userAuth";
import type { CommunityMeet } from "@/types/communityMeet";

type ChatListPayload = {
  chats?: {
    meet?: CommunityMeet | null;
  }[];
};

export default function MyPageMeetsPage() {
  const [joined, setJoined] = useState<CommunityMeet[]>([]);
  const [interests, setInterests] = useState<CommunityMeet[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    const communities = getCommunities();
    if (!user) return;
    const interestIds = getCommunityInterests().filter((item) => item.userId === user.userId).map((item) => item.communityId);
    setInterests(communities.filter((item) => interestIds.includes(item.id)));
    void fetch(`/api/mypage/chats?userId=${encodeURIComponent(user.userId)}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: ChatListPayload | null) => {
        const confirmed = (payload?.chats ?? [])
          .map((item) => item.meet)
          .filter((item): item is CommunityMeet => Boolean(item));
        setJoined(confirmed);
      })
      .catch(() => setJoined([]));
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="px-4 pb-28 pt-6">
        <h1 className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">MY MEETS</h1>
        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-[18px] font-black text-fuku-black">参加予定MEET</h2>
            <a href="/mypage/chats" className="text-[12px] font-black text-fuku-red">チャット一覧 →</a>
          </div>
          {joined.length ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {joined.map((community) => <CommunityMiniCard key={community.id} community={community} />)}
            </div>
          ) : (
            <div className="rounded-[16px] border border-fuku-border bg-white p-4">
              <p className="text-[14px] font-black text-fuku-black">まだ参加予定のMEETはありません。</p>
              <a href="/meet" className="mt-3 inline-flex min-h-[42px] items-center rounded-full bg-fuku-red px-5 text-[12px] font-black text-white">
                今夜のMEETを探す
              </a>
            </div>
          )}
        </section>
        <section className="mt-6">
          <h2 className="mb-3 text-[18px] font-black text-fuku-black">興味あり</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(interests.length ? interests : getCommunities().slice(2, 4)).map((community) => <CommunityMiniCard key={community.id} community={community} />)}
          </div>
        </section>
        <a href="/meet/reviews" className="mt-6 flex min-h-[72px] items-center justify-between rounded-[14px] border border-fuku-border bg-white p-4 text-[14px] font-black text-fuku-black">
          レビュー待ちのMEETを見る
          <span className="text-fuku-red">→</span>
        </a>
      </main>
      <BottomNav active="mypage" />
    </div>
  );
}

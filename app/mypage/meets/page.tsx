"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import CommunityMiniCard from "@/components/CommunityMiniCard";
import Header from "@/components/Header";
import { getCommunities, getCommunityInterests, getCommunityParticipants } from "@/lib/communityMeet";
import { getCurrentUser } from "@/lib/userAuth";
import type { CommunityMeet } from "@/types/communityMeet";

export default function MyPageMeetsPage() {
  const [joined, setJoined] = useState<CommunityMeet[]>([]);
  const [interests, setInterests] = useState<CommunityMeet[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    const communities = getCommunities();
    if (!user) return;
    const joinedIds = getCommunityParticipants().filter((item) => item.userId === user.userId && item.status === "joined").map((item) => item.communityId);
    const interestIds = getCommunityInterests().filter((item) => item.userId === user.userId).map((item) => item.communityId);
    setJoined(communities.filter((item) => joinedIds.includes(item.id)));
    setInterests(communities.filter((item) => interestIds.includes(item.id)));
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="px-4 pb-28 pt-6">
        <h1 className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">MY MEETS</h1>
        <section className="mt-6">
          <h2 className="mb-3 text-[18px] font-black text-fuku-black">参加予定コミュニティ</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(joined.length ? joined : getCommunities().slice(0, 2)).map((community) => <CommunityMiniCard key={community.id} community={community} />)}
          </div>
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

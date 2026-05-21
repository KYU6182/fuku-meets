"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCommunityInterest, joinCommunity } from "@/lib/communityMeet";
import { getCurrentUser } from "@/lib/userAuth";
import { getCurrentUserProfile } from "@/lib/userCommunity";
import type { CommunityMeet } from "@/types/communityMeet";

type CommunityJoinButtonProps = {
  community: CommunityMeet;
  joinedLabel?: string;
};

export default function CommunityJoinButton({ community, joinedLabel }: CommunityJoinButtonProps) {
  const router = useRouter();
  const [joined, setJoined] = useState(false);
  const [interested, setInterested] = useState(false);
  const confirmed = joined || Boolean(joinedLabel);
  const feeText = `${(community.fee ?? 800).toLocaleString("ja-JP")}円`;

  function ensureUser() {
    const user = getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return null;
    }
    const profile = getCurrentUserProfile();
    if (!profile) {
      router.push("/mypage/profile");
      return null;
    }
    return { user, profile };
  }

  function join() {
    const auth = ensureUser();
    if (!auth) return;
    joinCommunity(community, auth.user.userId, auth.profile.displayName, auth.profile.avatar);
    setJoined(true);
  }

  function interest() {
    const auth = ensureUser();
    if (!auth) return;
    addCommunityInterest(community, auth.user.userId, auth.profile.displayName, auth.profile.avatar);
    setInterested(true);
  }

  if (confirmed) {
    return (
      <div className="grid grid-cols-3 gap-2">
        <button type="button" disabled className="min-h-[52px] rounded-full bg-fuku-red px-2 text-[12px] font-black text-white">
          {joinedLabel ?? "参加確定済み"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/mypage/meets")}
          className="min-h-[52px] rounded-full border border-fuku-black bg-white px-2 text-[12px] font-black text-fuku-black"
        >
          チャットを見る
        </button>
        <button
          type="button"
          onClick={() => router.push(`/meet/${community.slug}#location`)}
          className="min-h-[52px] rounded-full border border-fuku-red bg-white px-2 text-[12px] font-black text-fuku-red"
        >
          店舗詳細
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_0.72fr] gap-3">
      <button type="button" onClick={join} className="min-h-[54px] rounded-full bg-fuku-red text-[15px] font-black text-white">
        参加する {feeText}
      </button>
      <button type="button" onClick={interest} className="min-h-[54px] rounded-full border border-fuku-black bg-white text-[14px] font-black text-fuku-black">
        {interested ? "興味あり済み" : "興味ありに追加"}
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCommunityInterest, joinCommunity } from "@/lib/communityMeet";
import { getCurrentUser } from "@/lib/userAuth";
import { getCurrentUserProfile } from "@/lib/userCommunity";
import type { CommunityMeet } from "@/types/communityMeet";

export default function CommunityJoinButton({ community }: { community: CommunityMeet }) {
  const router = useRouter();
  const [joined, setJoined] = useState(false);
  const [interested, setInterested] = useState(false);

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

  return (
    <div className="grid grid-cols-[1fr_0.72fr] gap-3">
      <button type="button" onClick={join} className="min-h-[54px] rounded-full bg-fuku-red text-[15px] font-black text-white">
        {joined ? "参加予定" : "参加する（無料）"}
      </button>
      <button type="button" onClick={interest} className="min-h-[54px] rounded-full border border-fuku-black bg-white text-[14px] font-black text-fuku-black">
        {interested ? "興味あり済み" : "興味ありに追加"}
      </button>
    </div>
  );
}

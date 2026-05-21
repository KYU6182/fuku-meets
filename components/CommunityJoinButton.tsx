"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCommunityInterest } from "@/lib/communityMeet";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");
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

  function openCheckoutModal() {
    const auth = ensureUser();
    if (!auth) return;
    setError("");
    setShowConfirm(true);
  }

  async function startCheckout() {
    const auth = ensureUser();
    if (!auth) return;
    setIsRedirecting(true);
    setError("");
    try {
      const response = await fetch("/api/payments/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetSlug: community.slug,
          userId: auth.user.userId,
          email: auth.user.email,
          displayName: auth.profile.displayName,
          avatarUrl: auth.profile.avatar,
        }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "決済ページを作成できませんでした");
      }
      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "決済ページを作成できませんでした");
      setIsRedirecting(false);
    }
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
          onClick={() => router.push(`/mypage/meets/${community.slug}/chat`)}
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
    <>
      <div className="grid grid-cols-[1fr_0.72fr] gap-3">
        <button type="button" onClick={openCheckoutModal} className="min-h-[54px] rounded-full bg-fuku-red text-[15px] font-black text-white">
          参加する {feeText}
        </button>
        <button type="button" onClick={interest} className="min-h-[54px] rounded-full border border-fuku-black bg-white text-[14px] font-black text-fuku-black">
          {interested ? "興味あり済み" : "興味ありに追加"}
        </button>
      </div>

      {showConfirm ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/55 px-5">
          <div className="w-full max-w-[370px] rounded-[22px] bg-white p-5 shadow-2xl">
            <p className="text-[20px] font-black leading-tight text-fuku-black">
              {community.title}に参加しますか？
            </p>
            <div className="mt-4 grid gap-2 rounded-[16px] bg-[#fbfaf7] p-4 text-[13px] font-bold leading-relaxed text-fuku-black">
              <p>参加費：{feeText}</p>
              <p>店舗詳細：参加確定後に共有</p>
              <p>チャット：参加確定後にマイページで利用可能</p>
              <p>キャンセル：前日23:59まで可能</p>
            </div>
            {error ? <p className="mt-3 rounded-[12px] bg-[#fff1f1] px-3 py-2 text-[12px] font-bold text-fuku-red">{error}</p> : null}
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={startCheckout}
                disabled={isRedirecting}
                className="min-h-[50px] rounded-full bg-fuku-red text-[14px] font-black text-white disabled:opacity-60"
              >
                {isRedirecting ? "Stripeへ移動中..." : "Stripeで支払う"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isRedirecting}
                className="min-h-[48px] rounded-full border border-fuku-border bg-white text-[13px] font-black text-fuku-black disabled:opacity-60"
              >
                やめる
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

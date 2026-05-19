"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { hasCoverVotedToday, hasSupportedIcon } from "@/lib/iconVoteSystem";
import { storageKeys } from "@/lib/storageKeys";
import { useToast } from "./Toast";

export default function IconVoteButton({
  slug,
  mode = "support",
  className = "",
  onVoted,
}: {
  slug: string;
  mode?: "support" | "cover";
  className?: string;
  onVoted?: (payload?: { votes?: number; supportCount?: number }) => void;
}) {
  const [done, setDone] = useState(false);
  const [limit, setLimit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    setDone(mode === "cover" ? hasCoverVotedToday() : hasSupportedIcon(slug));
  }, [mode, slug]);

  async function vote() {
    setLoading(true);
    setLimit(false);
    try {
      const response = await fetch("/api/icons/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, mode }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; votes?: number; supportCount?: number };
      if (!response.ok || !result.ok) throw new Error(result.message || "投票に失敗しました");

      if (typeof window !== "undefined") {
        if (mode === "cover") {
          const today = new Date().toISOString().slice(0, 10);
          window.localStorage.setItem(storageKeys.guestIconVotes, JSON.stringify([{ slug, type: "cover", date: today }]));
        } else {
          const current = JSON.parse(window.localStorage.getItem(storageKeys.supportedIcons) ?? "[]") as string[];
          if (!current.includes(slug)) window.localStorage.setItem(storageKeys.supportedIcons, JSON.stringify([slug, ...current]));
        }
      }
      setDone(true);
      onVoted?.({ votes: result.votes, supportCount: result.supportCount });
      showToast(result.message || (mode === "cover" ? "表紙投票しました" : "応援しました"));
    } catch (error) {
      showToast(error instanceof Error ? error.message : "投票に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={vote}
        disabled={done || loading}
        className={`${className || "min-h-[44px] rounded-full px-5 text-[13px]"} inline-flex items-center justify-center gap-2 font-black ${
          done ? "border border-fuku-border bg-white text-fuku-gray" : "bg-fuku-red text-white"
        }`}
      >
        <Heart size={16} fill={done ? "none" : "#fff"} />
        {loading ? "送信中" : mode === "cover" ? (done ? "本日投票済み" : "表紙に投票") : done ? "応援済み" : "応援する"}
      </button>
      {limit ? (
        <div className="mt-2 rounded-[10px] bg-[#fff1f1] p-3 text-[11px] font-bold text-fuku-black">
          もっと応援するにはログインしてください。
          <div className="mt-2 flex gap-2">
            <a href="/auth/login" className="rounded-full bg-fuku-black px-3 py-1 text-white">ログイン</a>
            <a href="/auth/register" className="rounded-full border border-fuku-red px-3 py-1 text-fuku-red">会員登録</a>
          </div>
        </div>
      ) : null}
      <ToastViewport />
    </>
  );
}

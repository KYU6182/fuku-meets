"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { coverVoteIcon, hasCoverVotedToday, hasSupportedIcon, supportIcon } from "@/lib/iconVoteSystem";
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
  onVoted?: () => void;
}) {
  const [done, setDone] = useState(false);
  const [limit, setLimit] = useState(false);
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    setDone(mode === "cover" ? hasCoverVotedToday() : hasSupportedIcon(slug));
  }, [mode, slug]);

  function vote() {
    const result = mode === "cover" ? coverVoteIcon(slug) : supportIcon(slug);
    showToast(result.message);
    if (result.ok) {
      setDone(true);
      onVoted?.();
    }
    if (result.reason === "limit") setLimit(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={vote}
        disabled={done}
        className={`${className || "min-h-[44px] rounded-full px-5 text-[13px]"} inline-flex items-center justify-center gap-2 font-black ${
          done ? "border border-fuku-border bg-white text-fuku-gray" : "bg-fuku-red text-white"
        }`}
      >
        <Heart size={16} fill={done ? "none" : "#fff"} />
        {mode === "cover" ? (done ? "本日投票済み" : "表紙に投票") : done ? "応援済み" : "応援する"}
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

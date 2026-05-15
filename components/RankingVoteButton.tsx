"use client";

import { useEffect, useState } from "react";
import { getRankingVoteState, voteRankingEntry } from "@/lib/rankingSystem";
import { useToast } from "./Toast";

export default function RankingVoteButton({
  rankingSlug,
  entrySlug,
  compact = false,
  onVoted,
}: {
  rankingSlug: string;
  entrySlug: string;
  compact?: boolean;
  onVoted?: () => void;
}) {
  const [votedEntry, setVotedEntry] = useState("");
  const [limit, setLimit] = useState(false);
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    setVotedEntry(getRankingVoteState(rankingSlug)?.entrySlug ?? "");
  }, [rankingSlug]);

  function vote() {
    const result = voteRankingEntry(rankingSlug, entrySlug);
    showToast(result.message);
    if (result.ok) {
      setVotedEntry(entrySlug);
      onVoted?.();
    }
    if (result.reason === "limit") setLimit(true);
  }

  const voted = votedEntry === entrySlug;
  const disabled = Boolean(votedEntry);

  return (
    <>
      <button
        type="button"
        onClick={vote}
        disabled={disabled}
        className={`${compact ? "min-h-[32px] px-3 text-[11px]" : "min-h-[40px] px-4 text-[12px]"} rounded-[8px] font-black ${
          voted ? "bg-fuku-black text-white" : disabled ? "bg-fuku-light text-fuku-gray" : "bg-fuku-red text-white"
        }`}
      >
        {voted ? "投票済み" : disabled ? "投票済み" : "投票する"}
      </button>
      {limit ? (
        <div className="mt-2 rounded-[10px] bg-[#fff1f1] p-3 text-[11px] font-bold text-fuku-black">
          もっと投票するにはログインしてください。
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

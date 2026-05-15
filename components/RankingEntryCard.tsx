"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import RankingPickedComments from "./RankingPickedComments";
import RankingVoteButton from "./RankingVoteButton";
import { getEntryVoteCount } from "@/lib/rankingSystem";
import type { RankingEntry } from "@/types/rankingSystem";

export default function RankingEntryCard({ rankingSlug, entry }: { rankingSlug: string; entry: RankingEntry }) {
  const [voteDelta, setVoteDelta] = useState(0);
  const count = getEntryVoteCount(rankingSlug, entry) + voteDelta;
  const badgeClass = entry.rank === 1 ? "bg-[#f5b400]" : entry.rank === 2 ? "bg-[#9ca3af]" : entry.rank === 3 ? "bg-[#c9824a]" : "bg-fuku-black";

  return (
    <article className="overflow-hidden rounded-[14px] border border-fuku-border bg-white shadow-soft">
      <a href={`/ranking/${rankingSlug}/${entry.slug}`} className="block">
        <div className="relative h-[122px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.12), rgba(17,17,17,.16)), url('${entry.image}')` }}>
          <span className={`absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full text-[17px] font-black text-white ${badgeClass}`}>{entry.rank}</span>
        </div>
        <div className="p-3">
          <h3 className="text-[15px] font-black text-fuku-black">{entry.name} 〉</h3>
          <p className="mt-1 text-[18px] font-black text-fuku-red">{count.toLocaleString()}票</p>
        </div>
      </a>
      <div className="px-3 pb-3">
        <div className="grid grid-cols-[44px_1fr] gap-2">
          <button type="button" className="grid min-h-[40px] place-items-center rounded-[8px] border border-fuku-border" aria-label={`${entry.name}を保存`}>
            <Bookmark size={18} />
          </button>
          <RankingVoteButton rankingSlug={rankingSlug} entrySlug={entry.slug} onVoted={() => setVoteDelta((value) => value + 1)} />
        </div>
        <RankingPickedComments comments={entry.pickedComments} />
      </div>
    </article>
  );
}

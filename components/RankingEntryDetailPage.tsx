"use client";

import { Bookmark, Heart, Instagram, MapPin } from "lucide-react";
import { useState } from "react";
import BottomNav from "./BottomNav";
import Button from "./Button";
import Header from "./Header";
import RankingImagePostForm from "./RankingImagePostForm";
import RankingVoteButton from "./RankingVoteButton";
import { getCommentsByTarget } from "@/lib/userCommunity";
import { getEntryVoteCount } from "@/lib/rankingSystem";
import type { RankingEntry, RankingTheme } from "@/types/rankingSystem";

export default function RankingEntryDetailPage({ theme, entry }: { theme: RankingTheme; entry: RankingEntry }) {
  const [voteDelta, setVoteDelta] = useState(0);
  const targetId = `${theme.slug}:${entry.slug}`;
  const comments = getCommentsByTarget("ranking", targetId);
  const goodCount = comments.reduce((sum, comment) => sum + comment.goodCount, 0);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <section className="bg-white px-4 py-5">
          <a href={`/ranking/${theme.slug}`} className="text-[12px] font-black text-fuku-black">← ランキングに戻る</a>
          <div className="mt-4 rounded-[16px] border border-fuku-border bg-white p-4 shadow-soft">
            <div className="h-[260px] rounded-[14px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${entry.image}')` }} />
            <div className="mt-4">
              <span className="rounded-full bg-[#fff1f1] px-3 py-1 text-[11px] font-black text-fuku-red">👑 {entry.rank}位　{theme.title}</span>
              <h1 className="mt-3 text-[34px] font-black leading-tight text-fuku-black">{entry.name}</h1>
              <p className="mt-2 flex items-center gap-1 text-[13px] font-bold text-fuku-gray"><MapPin size={14} />{entry.area}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => <span key={tag} className="rounded-full border border-fuku-border px-3 py-1 text-[11px] font-black">#{tag}</span>)}
              </div>
              <p className="mt-4 text-[13px] font-bold leading-relaxed text-fuku-black">{entry.description}</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                <Info label="票数" value={`${(getEntryVoteCount(theme.slug, entry) + voteDelta).toLocaleString()}票`} />
                <Info label="保存" value="24" />
                <Info label="コメント" value={`${comments.length}`} />
                <Info label="GOOD" value={`${goodCount}`} accent />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <RankingVoteButton rankingSlug={theme.slug} entrySlug={entry.slug} onVoted={() => setVoteDelta((value) => value + 1)} />
                <Button variant="light"><Bookmark size={16} />保存する</Button>
                {entry.mapUrl ? <Button href={entry.mapUrl} variant="light"><MapPin size={16} />マップで見る</Button> : <Button href="/search" variant="light"><MapPin size={16} />近くで探す</Button>}
                {entry.instagramUrl ? <Button href={entry.instagramUrl} variant="light"><Instagram size={16} />Instagram</Button> : <Button href="/news" variant="light"><Heart size={16} />関連記事</Button>}
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-fuku-border bg-white px-4 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-black text-fuku-black">みんなの推しコメント</h2>
            <a href={`/ranking/${theme.slug}`} className="text-[11px] font-black text-fuku-black">すべて見る →</a>
          </div>
          <RankingImagePostForm rankingSlug={theme.slug} entrySlug={entry.slug} title={entry.name} />
        </section>
        <section className="border-t border-fuku-border bg-white px-4 py-5">
          <h2 className="text-[18px] font-black text-fuku-black">みんなの投稿写真</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {comments.flatMap((comment) => comment.imageUrls).slice(0, 6).map((image) => <img key={image} src={image} alt="" className="aspect-square rounded-[10px] object-cover" />)}
            {!comments.some((comment) => comment.imageUrls.length) ? <p className="col-span-3 rounded-[12px] bg-fuku-light p-4 text-[12px] font-bold text-fuku-gray">まだ写真投稿はありません。</p> : null}
          </div>
        </section>
      </main>
      <BottomNav active="ranking" />
    </div>
  );
}

function Info({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[10px] border border-fuku-border bg-white p-3 text-center">
      <p className="text-[9px] font-black text-fuku-gray">{label}</p>
      <p className={`mt-1 text-[14px] font-black ${accent ? "text-fuku-red" : "text-fuku-black"}`}>{value}</p>
    </div>
  );
}

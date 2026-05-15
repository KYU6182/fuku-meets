"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { addToLocalList, useToast } from "@/components/Toast";
import { icons } from "@/lib/data/icons";
import { storageKeys } from "@/lib/storageKeys";

export default function CoverVotePage() {
  const [votedToday, setVotedToday] = useState(false);
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    setVotedToday(window.localStorage.getItem("fuku_cover_vote_date") === todayKey());
  }, []);

  function vote(slug: string) {
    if (votedToday) {
      showToast("本日の投票権は使用済みです");
      return;
    }
    addToLocalList(storageKeys.votedItems, `cover:${slug}:${todayKey()}`);
    window.localStorage.setItem("fuku_cover_vote_date", todayKey());
    setVotedToday(true);
    showToast("表紙に投票しました");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="COVER VOTE" copy="次の表紙は、あなたの1票で決まる。" />
        <section className="px-4 py-5">
          <div className="rounded-[16px] border border-fuku-border bg-white p-5 text-center">
            <p className="text-[12px] font-black text-fuku-gray">投票終了まで</p>
            <p className="mt-2 text-[28px] font-black text-fuku-black">05日 12時間 45分</p>
            <p className="mt-2 rounded-full bg-fuku-light px-4 py-2 text-[12px] font-black">
              本日の投票権 {votedToday ? "0/1" : "1/1"}
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {icons.slice(0, 3).map((icon) => (
              <article key={icon.slug} className="flex items-center gap-3 rounded-[14px] border border-fuku-border bg-white p-3">
                <div className="h-14 w-14 rounded-full bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${icon.image}')` }} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-black">{icon.name}</p>
                  <p className="text-[11px] font-bold text-fuku-gray">{icon.category}</p>
                  <p className="text-[11px] font-black">{icon.votes.toLocaleString()}票</p>
                </div>
                <button type="button" onClick={() => vote(icon.slug)} className={`min-h-[40px] rounded-full px-4 text-[12px] font-black ${votedToday ? "bg-fuku-light text-fuku-gray" : "bg-fuku-red text-white"}`}>
                  {votedToday ? "投票済み" : "投票する"}
                </button>
              </article>
            ))}
          </div>
          <Button href="https://x.com/intent/tweet?text=FUKU%20ICONS%20COVER%20VOTE" variant="light" className="mt-5 w-full">
            <Share2 size={16} />
            この投票をシェア
          </Button>
        </section>
      </main>
      <BottomNav active="home" />
      <ToastViewport />
    </div>
  );
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

"use client";

import { Bookmark, Crown, Heart, Map, Newspaper, Settings, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import LinkCard from "@/components/LinkCard";
import PageHero from "@/components/PageHero";
import { storageKeys } from "@/lib/storageKeys";

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [counts, setCounts] = useState({ saves: 0, votes: 0, supports: 0 });

  useEffect(() => {
    const session = window.localStorage.getItem(storageKeys.userSession);
    setIsLoggedIn(Boolean(session));
    setCounts({
      saves: read(storageKeys.savedSpots).length + read(storageKeys.savedNews).length + read(storageKeys.savedIcons).length,
      votes: read(storageKeys.votedItems).length,
      supports: read(storageKeys.supportedIcons).length,
    });
  }, []);

  function login() {
    window.localStorage.setItem(storageKeys.userSession, JSON.stringify({ isLoggedIn: true, name: "FUKU USER", role: "user" }));
    setIsLoggedIn(true);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="MY PAGE" copy="保存・投票・応援履歴をまとめる。" />
        <section className="px-4 py-5">
          {!isLoggedIn ? (
            <div className="rounded-[16px] border border-fuku-border bg-white p-5 text-center">
              <UserRound className="mx-auto text-fuku-red" size={34} />
              <p className="mt-4 text-[16px] font-black text-fuku-black">
                FUKU-MEETSにログインすると、保存した店や投票履歴を見返せます
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button onClick={login}>ログインする</Button>
                <Button variant="outline" onClick={login}>新規登録する</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-[16px] bg-fuku-black p-5 text-white">
                <p className="text-[14px] font-black text-white">FUKU USER</p>
                <p className="text-[11px] font-black text-white/70">FUKU TYPE</p>
                <h2 className="mt-2 text-[24px] font-black">夜カフェとローカルカルチャー派</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Stat label="保存数" value={counts.saves} />
                <Stat label="投票数" value={counts.votes} />
                <Stat label="応援中" value={counts.supports} />
              </div>
              <LinkCard href="/mypage/dashboard" title="MY DASHBOARD" description="今週のアクションをまとめて見る" icon={<UserRound size={20} />} />
              <LinkCard href="/mypage/saves" title="保存一覧を見る" description="保存したお店・NEWS・ICONS" icon={<Bookmark size={20} />} />
              <LinkCard href="/mypage/votes" title="投票履歴を見る" description="投票したランキングと対象" icon={<Crown size={20} />} />
              <LinkCard href="/mypage/icons" title="応援中のICONSを見る" description="推しの最新情報を見る" icon={<Heart size={20} />} />
              <LinkCard href="/weekend/izakaya" title="保存した週末プラン" description="週末の行き先をまとめる" icon={<Map size={20} />} />
              <LinkCard href="/news" title="最近見た記事" description="読んだ記事をもう一度見る" icon={<Newspaper size={20} />} />
              <LinkCard href="/mypage/settings" title="プロフィール編集" description="名前、FUKU TYPE、通知設定を変更" icon={<Settings size={20} />} />
              <div className="rounded-[16px] border border-fuku-border bg-white p-5">
                <h2 className="text-[18px] font-black">MY FUKU MAP</h2>
                <div className="mt-4 h-32 rounded-[12px] bg-[linear-gradient(135deg,#f2eee8,#fff1f1)]" />
              </div>
              <LinkCard href="/forms/ranking-theme" title="今週のFUKU ACTION" description="次に見たいランキングを提案する" icon={<Crown size={20} />} />
            </div>
          )}
        </section>
      </main>
      <BottomNav active="mypage" />
    </div>
  );
}

function read(key: string) {
  return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] border border-fuku-border bg-white p-4 text-center">
      <p className="text-[10px] font-black text-fuku-gray">{label}</p>
      <p className="mt-1 text-[22px] font-black text-fuku-black">{value}</p>
    </div>
  );
}

"use client";

import { Bookmark, Crown, Heart, MessageCircle, Settings, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import LinkCard from "./LinkCard";
import PageHero from "./PageHero";
import { storageKeys } from "@/lib/storageKeys";

type MyPageKind = "dashboard" | "saves" | "votes" | "icons" | "comments" | "settings";

const titles: Record<MyPageKind, { title: string; copy: string }> = {
  dashboard: { title: "MY DASHBOARD", copy: "今週のアクション状況をまとめて確認。" },
  saves: { title: "SAVES", copy: "保存したお店・NEWS・FUKU ICONS。" },
  votes: { title: "VOTES", copy: "投票したランキングと対象。" },
  icons: { title: "MY ICONS", copy: "フォロー中・応援中のFUKU ICONS。" },
  comments: { title: "COMMENTS", copy: "自分の推しコメント一覧。" },
  settings: { title: "SETTINGS", copy: "プロフィールと通知設定。" },
};

export default function MyPageSubPage({ kind }: { kind: MyPageKind }) {
  const [items, setItems] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setItems({
      savedSpots: read(storageKeys.savedSpots),
      savedNews: read(storageKeys.savedNews),
      savedIcons: read(storageKeys.savedIcons),
      votedItems: read(storageKeys.votedItems),
      supportedIcons: read(storageKeys.supportedIcons),
      followedIcons: read(storageKeys.followedIcons),
    });
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title={titles[kind].title} copy={titles[kind].copy} />
        <section className="space-y-4 px-4 py-5">
          {kind === "dashboard" ? (
            <>
              <ActionSummary items={items} />
              <LinkCard href="/mypage/saves" title="保存したお店" description="あとで行きたいスポットを確認" icon={<Bookmark size={20} />} />
              <LinkCard href="/mypage/votes" title="投票したランキング" description="投票履歴と現在順位を見る" icon={<Crown size={20} />} />
              <LinkCard href="/mypage/icons" title="応援中FUKU ICONS" description="フォロー中・応援中の人を確認" icon={<Heart size={20} />} />
              <LinkCard href="/ranking?mode=vote" title="おすすめランキング" description="今日投票できるテーマへ" icon={<Crown size={20} />} />
              <LinkCard href="/weekend/cafe" title="あなた向けWEEKEND GUIDE" description="保存傾向から週末の行き先を探す" icon={<Bookmark size={20} />} />
            </>
          ) : kind === "saves" ? (
            <ListGroups groups={[["お店", items.savedSpots], ["NEWS", items.savedNews], ["FUKU ICONS", items.savedIcons], ["週末プラン", items.savedSpots]]} />
          ) : kind === "votes" ? (
            <ListGroups groups={[["投票したランキング", items.votedItems], ["投票した対象", items.votedItems]]} />
          ) : kind === "icons" ? (
            <ListGroups groups={[["フォロー中", items.followedIcons], ["応援した", items.supportedIcons], ["表紙投票した", items.votedItems?.filter((item) => item.startsWith("cover:"))]]} />
          ) : kind === "comments" ? (
            <ListGroups groups={[["推しコメント", ["まだ投稿はありません", "コメント投稿機能は次フェーズで拡張予定"]]]} />
          ) : (
            <SettingsPanel />
          )}
        </section>
      </main>
      <BottomNav active="mypage" />
    </div>
  );
}

function read(key: string) {
  if (typeof window === "undefined") return [];
  return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
}

function ActionSummary({ items }: { items: Record<string, string[]> }) {
  const cards = [
    ["保存数", (items.savedSpots?.length ?? 0) + (items.savedNews?.length ?? 0) + (items.savedIcons?.length ?? 0)],
    ["投票数", items.votedItems?.length ?? 0],
    ["応援中", items.supportedIcons?.length ?? 0],
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-[14px] border border-fuku-border bg-white p-4 text-center">
          <p className="text-[10px] font-black text-fuku-gray">{label}</p>
          <p className="mt-1 text-[22px] font-black text-fuku-black">{value}</p>
        </div>
      ))}
    </div>
  );
}

function ListGroups({ groups }: { groups: [string, string[] | undefined][] }) {
  return (
    <>
      {groups.map(([title, list]) => (
        <section key={title} className="rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[17px] font-black text-fuku-black">{title}</h2>
          <div className="mt-3 space-y-2">
            {(list && list.length > 0 ? list : ["まだ履歴はありません"]).map((item) => (
              <div key={item} className="rounded-[10px] bg-fuku-light px-4 py-3 text-[12px] font-black text-fuku-black">
                {item}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function SettingsPanel() {
  return (
    <form className="space-y-4 rounded-[16px] border border-fuku-border bg-white p-5">
      {["名前", "メール", "好きなエリア", "FUKU TYPE"].map((field) => (
        <label key={field} className="block">
          <span className="text-[12px] font-black text-fuku-black">{field}</span>
          <input className="mt-2 h-11 w-full rounded-[10px] border border-fuku-border px-3 outline-none focus:border-fuku-red" />
        </label>
      ))}
      <label className="flex items-center justify-between rounded-[10px] bg-fuku-light px-4 py-3 text-[13px] font-black">
        通知設定
        <input type="checkbox" defaultChecked />
      </label>
      <label className="flex items-center justify-between rounded-[10px] bg-fuku-light px-4 py-3 text-[13px] font-black">
        メルマガ受信設定
        <input type="checkbox" defaultChecked />
      </label>
      <button type="button" className="min-h-[44px] w-full rounded-full bg-fuku-red text-[13px] font-black text-white">
        更新する
      </button>
    </form>
  );
}

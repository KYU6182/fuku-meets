"use client";

import { useState } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { defaultCommunities, saveCommunities, getCommunities } from "@/lib/communityMeet";

export default function CreateCommunityPage() {
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");

  function submit() {
    const base = defaultCommunities[0];
    saveCommunities([
      {
        ...base,
        id: `community-${Date.now()}`,
        slug: `community-${Date.now()}`,
        title: title || "新しいFUKU-MEET",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...getCommunities(),
    ]);
    setSubmitted(true);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="px-4 pb-28 pt-6">
        <h1 className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">CREATE MEET</h1>
        <p className="mt-3 text-[14px] font-black text-fuku-black">好きなテーマで、福岡の仲間を集めよう。</p>
        <section className="mt-6 rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
          {submitted ? (
            <div className="py-10 text-center">
              <h2 className="text-[22px] font-black text-fuku-black">作成しました</h2>
              <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">管理者承認後に公開されます。</p>
              <a href="/meet" className="mt-6 inline-flex min-h-[46px] items-center rounded-full bg-fuku-red px-6 text-[13px] font-black text-white">一覧へ戻る</a>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                ["タイトル", "例）ライブ後に語る会"],
                ["カテゴリ", "音楽・ライブ"],
                ["エリア", "天神"],
                ["日付", "2024-05-25"],
                ["開始時間", "21:30"],
                ["終了時間", "24:30"],
                ["参加上限", "12"],
                ["年齢層", "20代中心"],
              ].map(([label, placeholder]) => (
                <label key={label} className="block">
                  <span className="text-[12px] font-black text-fuku-black">{label}</span>
                  <input value={label === "タイトル" ? title : undefined} onChange={(event) => label === "タイトル" && setTitle(event.target.value)} placeholder={placeholder} className="mt-2 h-12 w-full rounded-[12px] border border-fuku-border px-3 text-[13px] font-bold" />
                </label>
              ))}
              <label className="block">
                <span className="text-[12px] font-black text-fuku-black">説明文</span>
                <textarea className="mt-2 min-h-[120px] w-full rounded-[12px] border border-fuku-border p-3 text-[13px] font-bold" placeholder="どんな人に来てほしいか、安心ルールを書きましょう。" />
              </label>
              <div className="rounded-[12px] bg-[#fff1f1] p-4 text-[12px] font-bold leading-relaxed text-fuku-black">
                20歳未満の飲酒は禁止です。連絡先交換の強要、セクハラ、勧誘、迷惑行為は禁止です。
              </div>
              <button type="button" onClick={submit} className="min-h-[50px] w-full rounded-full bg-fuku-red text-[14px] font-black text-white">下書きとして作成する</button>
            </div>
          )}
        </section>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

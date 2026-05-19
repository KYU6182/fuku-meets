"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import CommunityCard from "./CommunityCard";
import Header from "./Header";
import { defaultCommunities, getPublishedCommunitiesAsync, meetCategories } from "@/lib/communityMeet";

export default function CommunityListPage() {
  const [category, setCategory] = useState("すべて");
  const [communities, setCommunities] = useState(() => defaultCommunities.filter((item) => item.status === "published"));
  useEffect(() => {
    let mounted = true;
    void getPublishedCommunitiesAsync().then((items) => {
      if (mounted) setCommunities(items);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const filtered = category === "すべて" ? communities : communities.filter((item) => item.category === category || item.tags.includes(category));

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main className="px-4 pb-28 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <a href="/" className="text-[13px] font-black text-fuku-black">← 戻る</a>
            <h1 className="headline-condensed mt-5 text-[44px] uppercase leading-none text-fuku-black">MEETS</h1>
            <p className="mt-2 text-[16px] font-black text-fuku-black">気の合う仲間と、最高の時間を。</p>
          </div>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
          {["すべて", ...meetCategories.map((item) => item.label), "絞り込み"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setCategory(label)}
              className={`min-h-[38px] shrink-0 rounded-full border px-4 text-[12px] font-black ${
                category === label ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white text-fuku-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between text-[13px] font-black">
          <p>全 {filtered.length} 件</p>
          <p>おすすめ順⌄</p>
        </div>
        <div className="mt-4 grid gap-3">
          {filtered.map((community) => <CommunityCard key={community.id} community={community} />)}
        </div>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

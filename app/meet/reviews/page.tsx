"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { saveCommunityReview } from "@/lib/communityMeet";

export default function MeetReviewsPage() {
  const [done, setDone] = useState(false);
  function submit() {
    saveCommunityReview({
      id: `review-${Date.now()}`,
      communityId: "creep-hype-live-drink",
      reviewerId: "guest",
      hostId: "host-naoto",
      rating: 5,
      safetyRating: 5,
      hostRating: 5,
      venueRating: 4,
      comment: "安心して参加できました。",
      wouldJoinAgain: true,
      createdAt: new Date().toISOString(),
    });
    setDone(true);
  }
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="px-4 pb-28 pt-6">
        <h1 className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">MEET REVIEW</h1>
        <section className="mt-6 rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
          {done ? <p className="text-[16px] font-black text-fuku-black">レビューを保存しました。</p> : (
            <div className="space-y-4">
              {["会の満足度", "幹事の安心感", "参加者のマナー", "店の雰囲気"].map((label) => (
                <label key={label} className="block text-[13px] font-black text-fuku-black">{label}<select className="mt-2 h-12 w-full rounded-[12px] border border-fuku-border px-3"><option>5</option><option>4</option><option>3</option></select></label>
              ))}
              <textarea className="min-h-[120px] w-full rounded-[12px] border border-fuku-border p-3 text-[13px] font-bold" placeholder="また参加したい理由や安心できた点" />
              <button type="button" onClick={submit} className="min-h-[48px] w-full rounded-full bg-fuku-red text-[14px] font-black text-white">レビューを投稿</button>
            </div>
          )}
        </section>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

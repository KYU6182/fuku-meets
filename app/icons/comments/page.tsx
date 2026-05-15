"use client";

import { MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { iconComments, icons } from "@/lib/data/icons";

export default function IconCommentsPage() {
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState("すべて");
  const comments = useMemo(
    () =>
      iconComments.filter((comment) => {
        const matchesTarget = target === "すべて" || comment.iconName === target;
        const matchesQuery = comment.text.includes(query) || comment.user.includes(query);
        return matchesTarget && matchesQuery;
      }),
    [query, target],
  );

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="推しコメント" copy="みんなの応援の声を読む。" />
        <section className="space-y-4 px-4 py-5">
          <label className="flex min-h-[46px] items-center gap-2 rounded-full border border-fuku-border bg-white px-4">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" placeholder="コメントを検索" />
          </label>
          <select value={target} onChange={(event) => setTarget(event.target.value)} className="h-11 w-full rounded-full border border-fuku-border bg-white px-4 text-[13px] font-black">
            {["すべて", ...icons.map((icon) => icon.name)].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <div className="space-y-3">
            {comments.map((comment) => (
              <article key={`${comment.iconName}-${comment.user}`} className="rounded-[14px] border border-fuku-border bg-white p-4">
                <MessageCircle size={18} className="text-fuku-red" />
                <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-black">{comment.text}</p>
                <p className="mt-3 text-[11px] font-black text-fuku-gray">
                  {comment.iconName} / {comment.user}
                </p>
              </article>
            ))}
          </div>
          <Button href="/forms/icon-recommend" className="w-full">コメント投稿CTA</Button>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

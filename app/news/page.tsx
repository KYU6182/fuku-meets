"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { newsArticles } from "@/lib/data/news";

const tabs = ["すべて", "ローカルニュース", "イベント", "新店舗", "FUKU ICONS", "グルメ", "カルチャー"];

export default function NewsPage() {
  const [tab, setTab] = useState("すべて");
  const articles = tab === "すべて" ? newsArticles : newsArticles.filter((article) => article.category === tab);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="NEWS" copy="福岡の“いま”を見逃さない。" />
        <section className="px-4 py-5">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`min-h-[36px] shrink-0 rounded-full px-4 text-[12px] font-black ${tab === item ? "bg-fuku-red text-white" : "border border-fuku-border bg-white"}`}
              >
                {item}
              </button>
            ))}
          </div>

          <h2 className="mt-6 text-[18px] font-black">PICK UP NEWS</h2>
          <div className="mt-3 space-y-3">
            {articles.map((article) => (
              <a key={article.slug} href={`/news/${article.slug}`} className="flex gap-3 rounded-[14px] border border-fuku-border bg-white p-3">
                <div className="h-24 w-28 shrink-0 rounded-[10px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${article.image}')` }} />
                <span className="min-w-0">
                  <span className="text-[10px] font-black text-fuku-red">{article.category}</span>
                  <span className="mt-1 block text-[14px] font-black leading-snug">{article.title}</span>
                  <span className="mt-2 block text-[10px] font-bold text-fuku-gray">{article.date}</span>
                </span>
              </a>
            ))}
          </div>

          <a href="/forms/event-submit" className="mt-6 flex min-h-[82px] items-center gap-4 rounded-[14px] bg-white p-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff1f1] text-fuku-red">
              <CalendarPlus size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-black">イベント投稿</span>
              <span className="mt-1 block text-[11px] font-bold text-fuku-gray">福岡のイベントを編集部へ送る。</span>
            </span>
            <span className="font-black text-fuku-red">→</span>
          </a>
        </section>
      </main>
      <BottomNav active="news" />
    </div>
  );
}

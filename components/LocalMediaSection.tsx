"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { HomeCmsData } from "@/types/cms";

const chips = ["新店舗", "特集", "インタビュー", "ライブ後ガイド", "遠征ガイド", "街のトレンド"];

type ApiNews = {
  slug?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  summary?: string;
  image?: string;
  coverImageUrl?: string;
  category?: string;
  tags?: string[];
  date?: string;
  publishedAt?: string;
  relatedMeetIds?: string[];
  isLiveInfo?: boolean;
};

function normalizeArticles(items: ApiNews[]) {
  return items.slice(0, 5).map((item, index) => ({
    image: item.image || item.coverImageUrl || "/images/news-1.jpg",
    title: item.title || `NEWS ${index + 1}`,
    description: item.excerpt || item.summary || item.description || "福岡の今を届ける記事です。",
    date: item.date || item.publishedAt || "2024.05.20",
    tags: item.tags?.length ? item.tags.slice(0, 2) : [item.category || "NEWS"],
    href: `/news/${item.slug || index + 1}`,
    category: item.category || (item.isLiveInfo ? "今週のライブ情報" : "NEWS"),
    relatedMeetIds: item.relatedMeetIds || [],
  }));
}

export default function LocalMediaSection({ cms }: { cms?: HomeCmsData["localMedia"] }) {
  const [articles, setArticles] = useState<ReturnType<typeof normalizeArticles>>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/content/news", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: { items?: ApiNews[] }) => {
        if (mounted) setArticles(normalizeArticles(data.items ?? []));
      })
      .catch(() => {
        if (mounted) setArticles([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (cms?.isVisible === false) return null;
  const mainArticle = articles[0];
  const articleList = articles.slice(1);

  return (
    <section className="border-y border-fuku-border bg-white px-5 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="headline-condensed text-[37px] uppercase leading-none text-fuku-black">{cms?.title ?? "LOCAL MEDIA / NEWS"}</p>
          <p className="mt-2 text-[14px] font-black text-fuku-black">{cms?.subtitle ?? "福岡のカルチャーを、記事で知る。"}</p>
        </div>
        <a href={cms?.ctaHref ?? "/news"} className="mt-2 shrink-0 text-[12px] font-black text-fuku-black">
          {cms?.ctaText ?? "NEWSを見る"} →
        </a>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {chips.map((chip, index) => (
          <a key={chip} href={`/news?category=${encodeURIComponent(chip)}`} className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-black ${index === 0 ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white text-fuku-black"}`}>
            {chip}
          </a>
        ))}
      </div>

      {mainArticle ? (
        <a
          href={mainArticle.href}
          className="relative mt-5 block min-h-[234px] overflow-hidden rounded-[16px] bg-fuku-light bg-cover bg-center shadow-soft"
          style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.72)),url('${mainArticle.image}')` }}
        >
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="rounded-[4px] bg-fuku-red px-2 py-1 text-[10px] font-black">{mainArticle.category}</span>
            <h3 className="mt-3 text-[22px] font-black leading-tight">{mainArticle.title}</h3>
            <p className="mt-2 text-[12px] font-bold leading-relaxed">{mainArticle.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black">
              <span>{mainArticle.date}</span>
              {mainArticle.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </a>
      ) : (
        <div className="mt-5 rounded-[16px] border border-dashed border-fuku-border bg-[#fbfaf7] p-6 text-center">
          <p className="text-[18px] font-black text-fuku-black">記事は準備中です</p>
          <p className="mt-2 text-[12px] font-bold text-fuku-gray">近日公開</p>
        </div>
      )}

      <div className="mt-4 grid gap-3">
        {articleList.map((article) => (
          <a key={article.title} href={article.href} className="grid grid-cols-[92px_1fr_24px] items-center gap-3 rounded-[13px] border border-fuku-border bg-white p-2 shadow-soft">
            <div className="h-[78px] rounded-[9px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${article.image}')` }} />
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[13px] font-black leading-snug text-fuku-black">{article.title}</h3>
              <p className="mt-1 line-clamp-1 text-[10px] font-bold text-fuku-gray">{article.description}</p>
              <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-black text-fuku-red">
                <span>{article.date}</span>
                {article.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
            <ArrowRight size={18} className="text-fuku-black" />
          </a>
        ))}
      </div>

      <a href={cms?.ctaHref ?? "/news"} className="mt-5 flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-fuku-black text-[13px] font-black text-white">
        {cms?.ctaText ?? "NEWSを見る"}
        <ArrowRight size={16} />
      </a>
    </section>
  );
}

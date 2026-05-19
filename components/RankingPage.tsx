"use client";

import {
  ArrowRight,
  Bookmark,
  Building2,
  Coffee,
  Crown,
  MapPin,
  Moon,
  ShoppingBasket,
  Store,
  Train,
  Utensils,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { ElementType } from "react";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import RankingCommentSection from "./RankingCommentSection";
import RankingPickedComments from "./RankingPickedComments";
import RankingVoteButton from "./RankingVoteButton";
import { useToast } from "./Toast";
import { getDefaultRankingCmsData, getPublishedRankingAsync } from "@/lib/cms";
import type { RankingCmsData } from "@/types/cms";

type CategoryId = "food" | "people" | "daily" | "night" | "area";

type ApiRankingEntry = {
  rank?: number;
  slug?: string;
  name?: string;
  votes?: number | string;
  image?: string;
  thumbnailUrl?: string;
  heroImageUrl?: string;
  area?: string;
  description?: string;
  tags?: string[];
  pickedComments?: string[];
};

type ApiRankingTheme = {
  id?: string;
  slug?: string;
  category?: string;
  title?: string;
  description?: string;
  period?: string;
  image?: string;
  entries?: ApiRankingEntry[];
};

type RankingEntryView = {
  rank: number;
  slug: string;
  name: string;
  votes: number;
  image: string;
  area: string;
  description: string;
  pickedComments: string[];
};

type RankingThemeView = {
  id: string;
  slug: string;
  category: CategoryId;
  title: string;
  description: string;
  period: string;
  icon: ElementType;
  entries: RankingEntryView[];
};

const rankingCategories: { id: CategoryId; label: string }[] = [
  { id: "food", label: "FOOD" },
  { id: "people", label: "PEOPLE" },
  { id: "daily", label: "DAILY" },
  { id: "night", label: "NIGHT" },
  { id: "area", label: "AREA" },
];

const iconMap: Record<CategoryId, ElementType> = {
  food: Coffee,
  people: Crown,
  daily: ShoppingBasket,
  night: Moon,
  area: MapPin,
};

function normalizeCategory(value: string | undefined): CategoryId {
  const category = String(value || "daily").toLowerCase();
  return ["food", "people", "daily", "night", "area"].includes(category) ? (category as CategoryId) : "daily";
}

function normalizeThemes(items: ApiRankingTheme[]): RankingThemeView[] {
  return items
    .filter((item) => item.title && (item.slug || item.id))
    .map((theme) => {
      const category = normalizeCategory(theme.category);
      const slug = theme.slug || theme.id || "ranking";
      return {
        id: theme.id || slug,
        slug,
        category,
        title: theme.title || "ランキング",
        description: theme.description || "みんなの“好き”を集めたランキングです。",
        period: theme.period || "",
        icon: iconMap[category] || Store,
        entries: (theme.entries ?? [])
          .map((entry, index) => ({
            rank: entry.rank || index + 1,
            slug: entry.slug || `entry-${index + 1}`,
            name: entry.name || `候補 ${index + 1}`,
            votes: Number(entry.votes ?? 0),
            image: entry.heroImageUrl || entry.thumbnailUrl || entry.image || "",
            area: entry.area || "福岡エリア",
            description: entry.description || "",
            pickedComments: entry.pickedComments || [],
          }))
          .sort((a, b) => b.votes - a.votes || a.rank - b.rank)
          .map((entry, index) => ({ ...entry, rank: index + 1 })),
      };
    });
}

function fallbackImage(category: CategoryId) {
  if (category === "food") return "linear-gradient(135deg,#2b211c,#d7b17b)";
  if (category === "people") return "linear-gradient(135deg,#111,#777)";
  if (category === "night") return "linear-gradient(135deg,#100f1f,#e52421)";
  if (category === "area") return "linear-gradient(135deg,#d8e7e1,#7a9b8f)";
  return "linear-gradient(135deg,#f2eee8,#d7cec2)";
}

function EntryImage({ entry, category }: { entry: RankingEntryView; category: CategoryId }) {
  return (
    <div
      className="relative h-[110px] rounded-[12px] bg-cover bg-center"
      style={entry.image ? { backgroundImage: `url('${entry.image}')` } : { background: fallbackImage(category) }}
    >
      <span
        className={`absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full text-[15px] font-black text-white ${
          entry.rank === 1 ? "bg-[#f5b400]" : entry.rank === 2 ? "bg-[#9ca3af]" : entry.rank === 3 ? "bg-[#c9824a]" : "bg-fuku-black"
        }`}
      >
        {entry.rank}
      </span>
    </div>
  );
}

function EntryCard({ theme, entry, compact = false }: { theme: RankingThemeView; entry: RankingEntryView; compact?: boolean }) {
  const [delta, setDelta] = useState(0);
  const href = `/ranking/${theme.slug}/${entry.slug}`;

  return (
    <article className="overflow-hidden rounded-[14px] border border-fuku-border bg-white shadow-soft">
      <a href={href} className="block p-2 pb-0">
        <EntryImage entry={entry} category={theme.category} />
      </a>
      <div className="p-3">
        <a href={href} className="line-clamp-1 text-[14px] font-black text-fuku-black">
          {entry.name}
        </a>
        <p className="mt-1 text-[17px] font-black text-fuku-red">{(entry.votes + delta).toLocaleString("ja-JP")}票</p>
        {!compact ? <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-relaxed text-fuku-gray">{entry.description || entry.area}</p> : null}
        <RankingPickedComments comments={entry.pickedComments} />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <RankingVoteButton rankingSlug={theme.slug} entrySlug={entry.slug} compact onVoted={() => setDelta((value) => value + 1)} />
          <a href={href} className="grid min-h-[32px] place-items-center rounded-[8px] border border-fuku-border text-[11px] font-black text-fuku-black">
            詳細
          </a>
        </div>
      </div>
    </article>
  );
}

function EmptyRanking() {
  return (
    <section className="bg-white px-4 py-8">
      <div className="rounded-[18px] border border-dashed border-fuku-border bg-[#fbfaf7] p-8 text-center">
        <p className="headline-condensed text-[30px] uppercase leading-none text-fuku-black">COMING SOON</p>
        <h2 className="mt-3 text-[18px] font-black text-fuku-black">ランキングは準備中です</h2>
        <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">
          管理画面で公開されたランキングが登録されると、ここに表示されます。
        </p>
      </div>
    </section>
  );
}

export default function RankingPage() {
  const searchParams = useSearchParams();
  const [cms, setCms] = useState<RankingCmsData>(() => getDefaultRankingCmsData());
  const [themes, setThemes] = useState<RankingThemeView[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("daily");
  const [selectedThemeSlug, setSelectedThemeSlug] = useState("");
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getPublishedRankingAsync(),
      fetch("/api/content/rankings", { cache: "no-store" }).then((response) => (response.ok ? response.json() : { items: [] })),
    ])
      .then(([publishedCms, data]: [RankingCmsData, { items?: ApiRankingTheme[] }]) => {
        if (!mounted) return;
        const nextThemes = normalizeThemes(data.items ?? []);
        setCms(publishedCms);
        setThemes(nextThemes);

        const queryCategory = searchParams.get("category") as CategoryId | null;
        const queryTheme = searchParams.get("theme");
        const initialCategory =
          queryCategory && rankingCategories.some((category) => category.id === queryCategory)
            ? queryCategory
            : normalizeCategory(publishedCms.defaultTab);
        const themeFromQuery = queryTheme ? nextThemes.find((theme) => theme.slug === queryTheme || theme.id === queryTheme) : undefined;
        const themeForCategory = nextThemes.find((theme) => theme.category === initialCategory) ?? nextThemes[0];
        setSelectedCategory(themeFromQuery?.category ?? initialCategory);
        setSelectedThemeSlug(themeFromQuery?.slug ?? themeForCategory?.slug ?? "");
      })
      .catch(() => {
        if (!mounted) return;
        setThemes([]);
        showToast("ランキングの読み込みに失敗しました");
      });
    return () => {
      mounted = false;
    };
  }, [searchParams, showToast]);

  const visibleCategories = useMemo(() => {
    const cmsTabs = cms.tabs
      .filter((tab) => tab.isVisible)
      .map((tab) => ({ id: normalizeCategory(tab.id), label: tab.label }));
    return cmsTabs.length ? cmsTabs : rankingCategories;
  }, [cms.tabs]);

  const categoryThemes = themes.filter((theme) => theme.category === selectedCategory);
  const selectedTheme = categoryThemes.find((theme) => theme.slug === selectedThemeSlug) ?? categoryThemes[0] ?? themes[0];

  function selectCategory(category: CategoryId) {
    setSelectedCategory(category);
    setSelectedThemeSlug(themes.find((theme) => theme.category === category)?.slug ?? "");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <section className="border-b border-fuku-border bg-white px-5 py-7">
          <h1 className="headline-condensed text-[50px] uppercase leading-none text-fuku-black">{cms.heroTitle}</h1>
          <p className="mt-3 text-[15px] font-black leading-relaxed text-fuku-red">{cms.heroSubtitle}</p>
          <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">
            公開中のランキングだけを表示しています。管理画面で作成・公開するとここに反映されます。
          </p>
        </section>

        <section className="sticky top-[112px] z-20 border-b border-fuku-border bg-white px-4 py-4">
          <div className="grid grid-cols-5 overflow-hidden rounded-full border border-fuku-border bg-white shadow-soft">
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                className={`min-h-[42px] text-[11px] font-black ${
                  selectedCategory === category.id ? "bg-fuku-red text-white" : "text-fuku-black"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {!themes.length ? (
          <EmptyRanking />
        ) : (
          <>
            <section className="bg-white px-4 py-5">
              <h2 className="mb-4 flex items-center gap-2 text-[18px] font-black text-fuku-black">
                <Crown size={20} className="text-fuku-red" />
                公開中ランキング
              </h2>
              {!categoryThemes.length ? (
                <div className="rounded-[16px] border border-dashed border-fuku-border bg-[#fbfaf7] p-6 text-center">
                  <p className="text-[16px] font-black text-fuku-black">このカテゴリのランキングは準備中です</p>
                </div>
              ) : (
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                  {categoryThemes.map((theme) => {
                    const Icon = theme.icon;
                    const active = selectedTheme?.slug === theme.slug;
                    return (
                      <button
                        key={theme.slug}
                        type="button"
                        onClick={() => setSelectedThemeSlug(theme.slug)}
                        className={`min-w-[180px] rounded-[14px] border bg-white p-3 text-left ${
                          active ? "border-fuku-red" : "border-fuku-border"
                        }`}
                      >
                        <Icon size={22} className="text-fuku-red" />
                        <h3 className="mt-3 text-[15px] font-black text-fuku-black">{theme.title}</h3>
                        <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-relaxed text-fuku-gray">{theme.description}</p>
                        <p className="mt-3 text-[10px] font-black text-fuku-red">TOP10を表示</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {selectedTheme ? (
              <section className="border-t border-fuku-border bg-white px-4 py-5">
                <div className="mb-4">
                  <h2 className="text-[28px] font-black leading-tight text-fuku-black">{selectedTheme.title}</h2>
                  <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-gray">{selectedTheme.description}</p>
                  {selectedTheme.period ? <p className="mt-2 text-[11px] font-bold text-fuku-gray">集計期間：{selectedTheme.period}</p> : null}
                </div>
                {selectedTheme.entries.length ? (
                  <div className="grid gap-3">
                    <div className="grid grid-cols-3 gap-2">
                      {selectedTheme.entries.slice(0, 3).map((entry) => (
                        <EntryCard key={entry.slug} theme={selectedTheme} entry={entry} compact />
                      ))}
                    </div>
                    <div className="rounded-[14px] border border-fuku-border bg-white">
                      {selectedTheme.entries.slice(3, 10).map((entry) => (
                        <div key={entry.slug} className="grid grid-cols-[32px_1fr_auto] items-center gap-2 border-b border-fuku-border p-3 last:border-b-0">
                          <span className="text-center text-[18px] font-black text-fuku-black">{entry.rank}</span>
                          <a href={`/ranking/${selectedTheme.slug}/${entry.slug}`} className="min-w-0">
                            <span className="block truncate text-[14px] font-black text-fuku-black">{entry.name}</span>
                            <span className="block text-[11px] font-bold text-fuku-gray">{entry.votes.toLocaleString("ja-JP")}票</span>
                          </a>
                          <div className="flex items-center gap-2">
                            <RankingVoteButton rankingSlug={selectedTheme.slug} entrySlug={entry.slug} compact />
                            <a href={`/ranking/${selectedTheme.slug}/${entry.slug}`} className="rounded-[8px] border border-fuku-border px-3 py-2 text-[11px] font-black">
                              詳細
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[16px] border border-dashed border-fuku-border bg-[#fbfaf7] p-6 text-center">
                    <p className="text-[16px] font-black text-fuku-black">候補は準備中です</p>
                  </div>
                )}
              </section>
            ) : null}

            {selectedTheme ? <RankingCommentSection rankingSlug={selectedTheme.slug} title={selectedTheme.title} /> : null}
          </>
        )}
      </main>
      <BottomNav active="ranking" />
      <ToastViewport />
    </div>
  );
}

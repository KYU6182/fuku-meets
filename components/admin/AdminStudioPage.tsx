"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, MonitorSmartphone, RotateCcw, Save, Send, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminStatusBadge from "./AdminStatusBadge";
import DirectImageUploader from "./DirectImageUploader";
import FvSlideEditor from "./FvSlideEditor";
import FukuIconsSection from "../FukuIconsSection";
import HeroSection from "../HeroSection";
import HomeFollowUsSection from "../HomeFollowUsSection";
import LocalMediaSection from "../LocalMediaSection";
import PaperSection from "../PaperSection";
import RankingMeetSection from "../RankingMeetSection";
import SafetyCommunitySection from "../SafetyCommunitySection";
import StartGuideSection from "../StartGuideSection";
import TonightInFukuokaSection from "../TonightInFukuokaSection";
import { useToast } from "../Toast";
import {
  getDefaultHomeCmsData,
  getHomeDraft,
  getHomeDraftAsync,
  getHomeSectionLabel,
  getHomeSections,
  getIconsDraft,
  getIconsDraftAsync,
  getMagazineDraft,
  getMagazineDraftAsync,
  getNewsDraft,
  getNewsDraftAsync,
  getPublishedHome,
  getPublishedIcons,
  getPublishedMagazine,
  getPublishedNews,
  getPublishedRanking,
  getRankingDraft,
  getRankingDraftAsync,
  publishHomeAsync,
  publishIconsAsync,
  publishMagazineAsync,
  publishNewsAsync,
  publishRankingAsync,
  resetHomeDraft,
  saveHomeDraftAsync,
  saveIconsDraftAsync,
  saveMagazineDraftAsync,
  saveNewsDraftAsync,
  saveRankingDraftAsync,
  syncHomeDraftFromDefaultsAsync,
  syncHomePublishedFromDefaultsAsync,
} from "@/lib/cms";
import { storageKeys } from "@/lib/storageKeys";
import type { HomeCmsData, HomeSectionId, HeroSlide, IconsCmsData, MagazineCmsData, NewsCmsData, RankingCmsData } from "@/types/cms";

type StudioPage = "home" | "ranking" | "news" | "icons" | "magazine";
type MobileMode = "preview" | "edit";

const pageLabels: Record<StudioPage, string> = {
  home: "HOME",
  ranking: "RANKING",
  news: "NEWS",
  icons: "FUKU ICONS",
  magazine: "MAGAZINE",
};

const pageHrefs: Record<StudioPage, string> = {
  home: "/",
  ranking: "/ranking",
  news: "/news",
  icons: "/icons",
  magazine: "/magazine",
};

const pageDraftKeys: Record<StudioPage, string> = {
  home: storageKeys.cmsHomeDraft,
  ranking: storageKeys.cmsRankingDraft,
  news: storageKeys.cmsNewsDraft,
  icons: storageKeys.cmsIconsDraft,
  magazine: storageKeys.cmsMagazineDraft,
};

const pagePublishedKeys: Record<StudioPage, string> = {
  home: storageKeys.cmsHomePublished,
  ranking: storageKeys.cmsRankingPublished,
  news: storageKeys.cmsNewsPublished,
  icons: storageKeys.cmsIconsPublished,
  magazine: storageKeys.cmsMagazinePublished,
};

const iconsData = [
  { rank: 1, image: "/images/yui.jpg", name: "YUI", genre: "model・creator", votes: "1.2k" },
  { rank: 2, image: "/images/rena.jpg", name: "RENA", genre: "model", votes: "987" },
  { rank: 3, image: "/images/keita.jpg", name: "KEITA", genre: "artist", votes: "873" },
];

const newInFukuokaItems = [
  { icon: "MapPin", title: "まず行きたい定番スポット", description: "福岡の人気エリアや観光名所を紹介" },
  { icon: "Building2", title: "最初に住みたい街", description: "住環境や家賃の目安、エリアを厳選" },
  { icon: "Utensils", title: "はじめての行きつけ特集", description: "カフェ、ランチ、美容室まで紹介" },
];

const pickupContents = [
  { image: "/images/news-1.jpg", label: "LOCAL NEWS", title: "いま、福岡で注目したい人と店、まちの話題。", date: "2026.05.14" },
  { image: "/images/news-2.jpg", label: "FEATURE", title: "いま行きたい福岡の注目グルメ特集。", date: "2026.05.12" },
  { image: "/images/news-3.jpg", label: "CITY GUIDE", title: "知らないと損する、エリア別・福岡ガイド。", date: "2026.05.10" },
];

function readStorageMeta(key: string) {
  if (typeof window === "undefined") return { updatedAt: "未保存", title: "未公開" };
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { updatedAt: "未保存", title: "未公開" };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const title = typeof parsed.heroTitle === "string"
      ? parsed.heroTitle
      : typeof parsed.title === "string"
        ? parsed.title
        : typeof parsed.latestIssueTitle === "string"
          ? parsed.latestIssueTitle
          : Array.isArray((parsed.hero as { slides?: unknown[] } | undefined)?.slides)
            ? ((parsed.hero as { slides: { title?: string }[] }).slides[0]?.title ?? "HOME")
            : "保存済み";
    return { updatedAt: String(parsed.publishedAt ?? parsed.updatedAt ?? "保存済み"), title };
  } catch {
    return { updatedAt: "読み込みエラー", title: "読み込みエラー" };
  }
}

export default function AdminStudioPage() {
  const [selectedPage, setSelectedPage] = useState<StudioPage>("home");
  const [homeDraft, setHomeDraft] = useState<HomeCmsData>(() => getDefaultHomeCmsData());
  const [rankingDraft, setRankingDraft] = useState<RankingCmsData>(() => getRankingDraft());
  const [newsDraft, setNewsDraft] = useState<NewsCmsData>(() => getNewsDraft());
  const [iconsDraft, setIconsDraft] = useState<IconsCmsData>(() => getIconsDraft());
  const [magazineDraft, setMagazineDraft] = useState<MagazineCmsData>(() => getMagazineDraft());
  const [selectedHomeSectionId, setSelectedHomeSectionId] = useState<HomeSectionId>("hero");
  const [selectedGenericSection, setSelectedGenericSection] = useState("hero");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [mobileMode, setMobileMode] = useState<MobileMode>("preview");
  const [metaNonce, setMetaNonce] = useState(0);
  const [operationStatus, setOperationStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    let mounted = true;
    async function loadDrafts() {
      const [home, ranking, news, icons, magazine] = await Promise.all([
        getHomeDraftAsync(),
        getRankingDraftAsync(),
        getNewsDraftAsync(),
        getIconsDraftAsync(),
        getMagazineDraftAsync(),
      ]);
      if (!mounted) return;
      setHomeDraft(home);
      setRankingDraft(ranking);
      setNewsDraft(news);
      setIconsDraft(icons);
      setMagazineDraft(magazine);
      setMetaNonce((value) => value + 1);
    }
    void loadDrafts();
    return () => {
      mounted = false;
    };
  }, []);

  const homeSections = useMemo(() => getHomeSections(homeDraft), [homeDraft]);
  const selectedHomeSection = homeSections.find((section) => section.id === selectedHomeSectionId) ?? homeSections[0];
  const publishedMeta = readStorageMeta(pagePublishedKeys[selectedPage]);
  const draftMeta = readStorageMeta(pageDraftKeys[selectedPage]);
  void metaNonce;

  function updateHero(patch: Partial<HomeCmsData["hero"]>) {
    setHomeDraft((current) => ({ ...current, hero: { ...current.hero, ...patch } }));
  }

  function updateSlide(index: number, patch: Partial<HeroSlide>) {
    setHomeDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        slides: current.hero.slides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)),
      },
    }));
  }

  function updateHomeSection<K extends Exclude<HomeSectionId, "hero">>(sectionId: K, patch: Partial<HomeCmsData[K]>) {
    setHomeDraft((current) => ({
      ...current,
      [sectionId]: { ...current[sectionId], ...patch },
    }));
  }

  function toggleHomeSection(sectionId: HomeSectionId) {
    if (sectionId === "hero") {
      setHomeDraft((current) => ({ ...current, hero: { ...current.hero, isVisible: !current.hero.isVisible } }));
      return;
    }
    updateHomeSection(sectionId, { isVisible: !homeDraft[sectionId].isVisible } as Partial<HomeCmsData[typeof sectionId]>);
  }

  function moveHomeSection(direction: "up" | "down") {
    setHomeDraft((current) => {
      const index = current.sectionOrder.indexOf(selectedHomeSectionId);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.sectionOrder.length) return current;
      const sectionOrder = [...current.sectionOrder];
      const [target] = sectionOrder.splice(index, 1);
      sectionOrder.splice(nextIndex, 0, target);
      return { ...current, sectionOrder };
    });
  }

  async function saveDraft() {
    try {
      if (selectedPage === "home") setHomeDraft(await saveHomeDraftAsync(homeDraft));
      if (selectedPage === "ranking") setRankingDraft(await saveRankingDraftAsync(rankingDraft));
      if (selectedPage === "news") setNewsDraft(await saveNewsDraftAsync(newsDraft));
      if (selectedPage === "icons") setIconsDraft(await saveIconsDraftAsync(iconsDraft));
      if (selectedPage === "magazine") setMagazineDraft(await saveMagazineDraftAsync(magazineDraft));
      setMetaNonce((value) => value + 1);
      const message = `${pageLabels[selectedPage]}の下書きをSupabaseに保存しました`;
      setOperationStatus({ type: "success", message });
      showToast(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : "下書き保存に失敗しました";
      setOperationStatus({ type: "error", message });
      showToast(message);
    }
  }

  async function publishDraft() {
    try {
      if (selectedPage === "home") {
        const next = await publishHomeAsync(homeDraft);
        setHomeDraft(next);
      }
      if (selectedPage === "ranking") setRankingDraft(await publishRankingAsync(rankingDraft));
      if (selectedPage === "news") setNewsDraft(await publishNewsAsync(newsDraft));
      if (selectedPage === "icons") setIconsDraft(await publishIconsAsync(iconsDraft));
      if (selectedPage === "magazine") setMagazineDraft(await publishMagazineAsync(magazineDraft));
      setMetaNonce((value) => value + 1);
      const message = `${pageLabels[selectedPage]}をSupabase publicに公開しました`;
      setOperationStatus({ type: "success", message });
      showToast(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : "公開に失敗しました";
      setOperationStatus({ type: "error", message });
      showToast(message);
    }
  }

  function resetDraft() {
    if (selectedPage === "home") {
      setHomeDraft(resetHomeDraft());
      setActiveSlideIndex(0);
    }
    if (selectedPage === "ranking") setRankingDraft(getPublishedRanking());
    if (selectedPage === "news") setNewsDraft(getPublishedNews());
    if (selectedPage === "icons") setIconsDraft(getPublishedIcons());
    if (selectedPage === "magazine") setMagazineDraft(getPublishedMagazine());
    showToast(`${pageLabels[selectedPage]}の下書きを公開データへ戻しました`);
  }

  async function syncHomeFromCodeDefaults(publish = false) {
    try {
      const next = publish ? await syncHomePublishedFromDefaultsAsync() : await syncHomeDraftFromDefaultsAsync();
      setHomeDraft(next);
      setSelectedPage("home");
      setSelectedHomeSectionId("hero");
      setActiveSlideIndex(0);
      setMetaNonce((value) => value + 1);
      const message = publish ? "現在のコード初期値をSupabase publicへ反映しました" : "現在のコード初期値をSupabase draftへ再同期しました";
      setOperationStatus({ type: "success", message });
      showToast(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : "再同期に失敗しました";
      setOperationStatus({ type: "error", message });
      showToast(message);
    }
  }

  return (
    <AdminLayout title="CMS Studio">
      <div className="mb-4 rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[220px_1fr_auto_auto_auto_auto_auto_auto] lg:items-center">
          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-widest text-fuku-gray">編集ページ</span>
            <select
              data-testid="studio-page-select"
              value={selectedPage}
              onChange={(event) => {
                setSelectedPage(event.target.value as StudioPage);
                setSelectedGenericSection("hero");
              }}
              className="mt-2 h-11 w-full rounded-full border border-fuku-border bg-white px-4 text-[13px] font-black"
            >
              <option value="home">HOME</option>
              <option value="ranking">RANKING</option>
              <option value="news">NEWS</option>
              <option value="icons">FUKU ICONS</option>
              <option value="magazine">MAGAZINE</option>
            </select>
          </label>
          <div className="rounded-[12px] bg-fuku-light px-4 py-3 text-[12px] font-bold leading-relaxed text-fuku-gray">
            下書きはdraftキー、公開はpublishedキーへ保存します。公開サイトはpublishedだけを読みます。
          </div>
          <a href={pageHrefs[selectedPage]} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-border px-5 text-[13px] font-black">
            <Eye size={16} />
            公開ページを見る
          </a>
          <button data-testid="studio-save-draft" type="button" onClick={saveDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-border px-5 text-[13px] font-black">
            <Save size={16} />
            下書き保存
          </button>
          <button data-testid="studio-publish" type="button" onClick={publishDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white">
            <Send size={16} />
            公開する
          </button>
          <button data-testid="studio-reset-draft" type="button" onClick={resetDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-fuku-black px-5 text-[13px] font-black text-white">
            <RotateCcw size={16} />
            リセット
          </button>
          <button type="button" onClick={() => void syncHomeFromCodeDefaults(false)} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-red px-5 text-[12px] font-black text-fuku-red">
            現在値から再同期
          </button>
          <button type="button" onClick={() => void syncHomeFromCodeDefaults(true)} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#fff1f1] px-5 text-[12px] font-black text-fuku-red">
            現在値を公開
          </button>
        </div>
        {operationStatus ? (
          <p className={`mt-3 rounded-[12px] px-4 py-3 text-[12px] font-black ${operationStatus.type === "success" ? "bg-[#eefbf1] text-[#166534]" : "bg-[#fff1f1] text-fuku-red"}`}>
            {operationStatus.message}
          </p>
        ) : null}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 xl:hidden">
        <button type="button" onClick={() => setMobileMode("preview")} className={`min-h-[42px] rounded-full text-[13px] font-black ${mobileMode === "preview" ? "bg-fuku-red text-white" : "bg-white text-fuku-black"}`}>プレビュー</button>
        <button type="button" onClick={() => setMobileMode("edit")} className={`min-h-[42px] rounded-full text-[13px] font-black ${mobileMode === "edit" ? "bg-fuku-red text-white" : "bg-white text-fuku-black"}`}>編集</button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[440px_minmax(380px,1fr)]">
        <div className={`${mobileMode === "edit" ? "block" : "hidden"} xl:block`}>
          {selectedPage === "home" ? (
            <HomeEditorPanel
              draft={homeDraft}
              sections={homeSections}
              selectedSectionId={selectedHomeSectionId}
              selectedSectionLabel={selectedHomeSection?.label ?? "FV / Hero"}
              activeSlideIndex={activeSlideIndex}
              onSelectedSectionChange={setSelectedHomeSectionId}
              onActiveSlideIndexChange={setActiveSlideIndex}
              onHeroChange={updateHero}
              onSlideChange={updateSlide}
              onSectionChange={updateHomeSection}
              onToggleSection={toggleHomeSection}
              onMoveSection={moveHomeSection}
            />
          ) : (
            <GenericPageEditor
              selectedPage={selectedPage}
              selectedSection={selectedGenericSection}
              onSelectedSectionChange={setSelectedGenericSection}
              rankingDraft={rankingDraft}
              newsDraft={newsDraft}
              iconsDraft={iconsDraft}
              magazineDraft={magazineDraft}
              onRankingChange={setRankingDraft}
              onNewsChange={setNewsDraft}
              onIconsChange={setIconsDraft}
              onMagazineChange={setMagazineDraft}
            />
          )}
          <PublishDebugPanel selectedPage={selectedPage} draftMeta={draftMeta} publishedMeta={publishedMeta} />
        </div>

        <div className={`${mobileMode === "preview" ? "block" : "hidden"} xl:block`}>
          <StudioPreview
            selectedPage={selectedPage}
            homeDraft={homeDraft}
            selectedHomeSectionId={selectedHomeSectionId}
            selectedGenericSection={selectedGenericSection}
            rankingDraft={rankingDraft}
            newsDraft={newsDraft}
            iconsDraft={iconsDraft}
            magazineDraft={magazineDraft}
            onSelectHomeSection={(id) => {
              setSelectedHomeSectionId(id);
              setMobileMode("edit");
            }}
            onSelectGenericSection={(id) => {
              setSelectedGenericSection(id);
              setMobileMode("edit");
            }}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-fuku-border bg-white/95 p-3 shadow-phone xl:hidden">
        <button type="button" onClick={saveDraft} className="mx-auto flex min-h-[48px] w-full max-w-[430px] items-center justify-center gap-2 rounded-full bg-fuku-red text-[14px] font-black text-white">
          <Save size={17} />
          下書きを保存
        </button>
      </div>
      <ToastViewport />
    </AdminLayout>
  );
}

function HomeEditorPanel({
  draft,
  sections,
  selectedSectionId,
  selectedSectionLabel,
  activeSlideIndex,
  onSelectedSectionChange,
  onActiveSlideIndexChange,
  onHeroChange,
  onSlideChange,
  onSectionChange,
  onToggleSection,
  onMoveSection,
}: {
  draft: HomeCmsData;
  sections: ReturnType<typeof getHomeSections>;
  selectedSectionId: HomeSectionId;
  selectedSectionLabel: string;
  activeSlideIndex: number;
  onSelectedSectionChange: (id: HomeSectionId) => void;
  onActiveSlideIndexChange: (index: number) => void;
  onHeroChange: (patch: Partial<HomeCmsData["hero"]>) => void;
  onSlideChange: (index: number, patch: Partial<HeroSlide>) => void;
  onSectionChange: <K extends Exclude<HomeSectionId, "hero">>(sectionId: K, patch: Partial<HomeCmsData[K]>) => void;
  onToggleSection: (id: HomeSectionId) => void;
  onMoveSection: (direction: "up" | "down") => void;
}) {
  const selected = sections.find((section) => section.id === selectedSectionId);

  return (
    <aside className="space-y-4">
      <section className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">HOME Sections</p>
            <h2 className="mt-1 text-[22px] font-black text-fuku-black">セクション管理</h2>
          </div>
          <MonitorSmartphone size={20} />
        </div>
        <div className="space-y-2">
          {sections.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectedSectionChange(item.id)}
              data-testid={`studio-section-${item.id}`}
              className={`flex min-h-[44px] w-full items-center justify-between rounded-[12px] border px-3 text-left text-[12px] font-black ${
                selectedSectionId === item.id ? "border-fuku-red bg-[#fff1f1] text-fuku-red" : "border-fuku-border bg-white text-fuku-black"
              }`}
            >
              <span>{index + 1}. {item.label}</span>
              <span>{item.isVisible ? "表示" : "非表示"}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">Edit Panel</p>
            <h2 className="mt-1 text-[24px] font-black text-fuku-black">{selectedSectionLabel}</h2>
          </div>
          <AdminStatusBadge status={selected?.isVisible ? "published" : "private"} />
        </div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => onToggleSection(selectedSectionId)} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
            {selected?.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
            表示
          </button>
          <button data-testid="studio-move-section-up" type="button" onClick={() => onMoveSection("up")} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
            <ArrowUp size={15} />
            上へ
          </button>
          <button data-testid="studio-move-section-down" type="button" onClick={() => onMoveSection("down")} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
            <ArrowDown size={15} />
            下へ
          </button>
        </div>

        {selectedSectionId === "hero" ? (
          <FvSlideEditor hero={draft.hero} activeIndex={activeSlideIndex} onActiveIndexChange={onActiveSlideIndexChange} onHeroChange={onHeroChange} onSlideChange={onSlideChange} />
        ) : selectedSectionId === "tonight" ? (
          <TonightHomeEditor value={draft.tonight} onChange={(patch) => onSectionChange("tonight", patch)} />
        ) : selectedSectionId === "ranking" ? (
          <RankingHomeEditor value={draft.ranking} onChange={(patch) => onSectionChange("ranking", patch)} />
        ) : selectedSectionId === "fukuIcons" ? (
          <FukuIconsEditor value={draft.fukuIcons} onChange={(patch) => onSectionChange("fukuIcons", patch)} />
        ) : selectedSectionId === "localMedia" ? (
          <LocalMediaHomeEditor value={draft.localMedia} onChange={(patch) => onSectionChange("localMedia", patch)} />
        ) : selectedSectionId === "startGuide" ? (
          <StartGuideHomeEditor value={draft.startGuide} onChange={(patch) => onSectionChange("startGuide", patch)} />
        ) : selectedSectionId === "safety" ? (
          <SafetyHomeEditor value={draft.safety} onChange={(patch) => onSectionChange("safety", patch)} />
        ) : selectedSectionId === "magazine" ? (
          <MagazineHomeEditor value={draft.magazine} onChange={(patch) => onSectionChange("magazine", patch)} />
        ) : (
          <FollowUsHomeEditor value={draft.followUs} onChange={(patch) => onSectionChange("followUs", patch)} />
        )}
      </section>
    </aside>
  );
}

function Field({ label, value, onChange, textarea = false, testId }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; testId?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-black uppercase tracking-widest text-fuku-gray">{label}</span>
      {textarea ? (
        <textarea data-testid={testId} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-[96px] w-full rounded-[12px] border border-fuku-border px-3 py-3 text-[13px] font-bold" />
      ) : (
        <input data-testid={testId} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-[12px] border border-fuku-border px-3 text-[13px] font-bold" />
      )}
    </label>
  );
}

function CsvField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return <Field label={label} value={value.join(", ")} onChange={(text) => onChange(text.split(",").map((item) => item.trim()).filter(Boolean))} />;
}

function FukuIconsEditor({ value, onChange }: { value: HomeCmsData["fukuIcons"]; onChange: (patch: Partial<HomeCmsData["fukuIcons"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field testId="studio-home-fukuIcons-title" label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="サブタイトル" value={value.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <Field label="説明文" value={value.description} onChange={(description) => onChange({ description })} textarea />
      <CsvField label="表示する人物ID" value={value.featuredIconIds} onChange={(featuredIconIds) => onChange({ featuredIconIds })} />
      <Field label="CTAテキスト" value={value.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
      <Field label="CTAリンク" value={value.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
    </div>
  );
}

function TonightHomeEditor({ value, onChange }: { value: HomeCmsData["tonight"]; onChange: (patch: Partial<HomeCmsData["tonight"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="サブタイトル" value={value.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <Field label="説明文" value={value.description} onChange={(description) => onChange({ description })} textarea />
      <CsvField label="表示カテゴリID" value={value.categoryIds} onChange={(categoryIds) => onChange({ categoryIds })} />
      <Field label="CTAテキスト" value={value.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
      <Field label="CTAリンク" value={value.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      <label className="flex items-center gap-2 text-[12px] font-black text-fuku-black">
        <input type="checkbox" checked={value.showNewBadge} onChange={(event) => onChange({ showNewBadge: event.target.checked })} />
        NEWラベルを表示
      </label>
    </div>
  );
}

function StartGuideHomeEditor({ value, onChange }: { value: HomeCmsData["startGuide"]; onChange: (patch: Partial<HomeCmsData["startGuide"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="サブタイトル" value={value.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <Field label="メインカードタイトル" value={value.mainCardTitle} onChange={(mainCardTitle) => onChange({ mainCardTitle })} />
      <Field label="メインカード説明" value={value.mainCardDescription} onChange={(mainCardDescription) => onChange({ mainCardDescription })} textarea />
      <DirectImageUploader value={value.mainCardImage} onSelect={(mainCardImage) => onChange({ mainCardImage })} />
      <Field label="CTAテキスト" value={value.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
      <Field label="CTAリンク" value={value.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
    </div>
  );
}

function RankingHomeEditor({ value, onChange }: { value: HomeCmsData["ranking"]; onChange: (patch: Partial<HomeCmsData["ranking"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="サブタイトル" value={value.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <Field label="説明文" value={value.description} onChange={(description) => onChange({ description })} textarea />
      <Field label="CTAテキスト" value={value.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
      <Field label="CTAリンク" value={value.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
    </div>
  );
}

function LocalMediaHomeEditor({ value, onChange }: { value: HomeCmsData["localMedia"]; onChange: (patch: Partial<HomeCmsData["localMedia"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="サブタイトル" value={value.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <Field label="説明文" value={value.description} onChange={(description) => onChange({ description })} textarea />
      <CsvField label="表示記事ID" value={value.featuredNewsIds} onChange={(featuredNewsIds) => onChange({ featuredNewsIds })} />
      <Field label="CTAテキスト" value={value.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
      <Field label="CTAリンク" value={value.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
    </div>
  );
}

function MagazineHomeEditor({ value, onChange }: { value: HomeCmsData["magazine"]; onChange: (patch: Partial<HomeCmsData["magazine"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="サブタイトル" value={value.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <Field label="説明文" value={value.description} onChange={(description) => onChange({ description })} textarea />
      <DirectImageUploader value={value.image} onSelect={(image) => onChange({ image })} />
      <Field label="CTAテキスト" value={value.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
      <Field label="CTAリンク" value={value.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
    </div>
  );
}

function SafetyHomeEditor({ value, onChange }: { value: HomeCmsData["safety"]; onChange: (patch: Partial<HomeCmsData["safety"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="説明文" value={value.description} onChange={(description) => onChange({ description })} textarea />
      <CsvField
        label="表示項目タイトル"
        value={value.items.map((item) => item.title)}
        onChange={(titles) => onChange({ items: titles.map((title, index) => value.items[index] ? { ...value.items[index], title } : { id: `item-${index}`, title, description: "", icon: "ShieldCheck" }) })}
      />
    </div>
  );
}

function FollowUsHomeEditor({ value, onChange }: { value: HomeCmsData["followUs"]; onChange: (patch: Partial<HomeCmsData["followUs"]>) => void }) {
  return (
    <div className="space-y-4">
      <Field label="タイトル" value={value.title} onChange={(title) => onChange({ title })} />
      <Field label="サブタイトル" value={value.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <Field label="説明文" value={value.description} onChange={(description) => onChange({ description })} textarea />
      <Field label="CTAテキスト" value={value.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
      <Field label="CTAリンク" value={value.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
    </div>
  );
}

function GenericPageEditor({
  selectedPage,
  selectedSection,
  onSelectedSectionChange,
  rankingDraft,
  newsDraft,
  iconsDraft,
  magazineDraft,
  onRankingChange,
  onNewsChange,
  onIconsChange,
  onMagazineChange,
}: {
  selectedPage: StudioPage;
  selectedSection: string;
  onSelectedSectionChange: (section: string) => void;
  rankingDraft: RankingCmsData;
  newsDraft: NewsCmsData;
  iconsDraft: IconsCmsData;
  magazineDraft: MagazineCmsData;
  onRankingChange: (value: RankingCmsData) => void;
  onNewsChange: (value: NewsCmsData) => void;
  onIconsChange: (value: IconsCmsData) => void;
  onMagazineChange: (value: MagazineCmsData) => void;
}) {
  const sections = getGenericSections(selectedPage);
  return (
    <aside className="space-y-4">
      <section className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">{pageLabels[selectedPage]} Sections</p>
        <div className="mt-3 grid gap-2">
          {sections.map((section) => (
            <button data-testid={`studio-generic-section-${section.id}`} key={section.id} type="button" onClick={() => onSelectedSectionChange(section.id)} className={`min-h-[42px] rounded-[12px] border px-3 text-left text-[12px] font-black ${selectedSection === section.id ? "border-fuku-red bg-[#fff1f1] text-fuku-red" : "border-fuku-border bg-white text-fuku-black"}`}>
              {section.label}
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        {selectedPage === "ranking" ? (
          <div className="space-y-4">
            <Field testId="studio-ranking-title" label="Heroタイトル" value={rankingDraft.heroTitle} onChange={(heroTitle) => onRankingChange({ ...rankingDraft, heroTitle })} />
            <Field label="Heroサブタイトル" value={rankingDraft.heroSubtitle} onChange={(heroSubtitle) => onRankingChange({ ...rankingDraft, heroSubtitle })} textarea />
            <Field label="初期タブ" value={rankingDraft.defaultTab} onChange={(defaultTab) => onRankingChange({ ...rankingDraft, defaultTab })} />
            <CsvField label="注目テーマID" value={rankingDraft.featuredThemeIds} onChange={(featuredThemeIds) => onRankingChange({ ...rankingDraft, featuredThemeIds })} />
          </div>
        ) : selectedPage === "news" ? (
          <div className="space-y-4">
            <Field testId="studio-news-title" label="タイトル" value={newsDraft.title} onChange={(title) => onNewsChange({ ...newsDraft, title })} />
            <Field label="サブタイトル" value={newsDraft.subtitle} onChange={(subtitle) => onNewsChange({ ...newsDraft, subtitle })} />
            <CsvField label="カテゴリ" value={newsDraft.categories} onChange={(categories) => onNewsChange({ ...newsDraft, categories })} />
            <CsvField label="注目記事ID" value={newsDraft.featuredArticleIds} onChange={(featuredArticleIds) => onNewsChange({ ...newsDraft, featuredArticleIds })} />
          </div>
        ) : selectedPage === "icons" ? (
          <div className="space-y-4">
            <Field testId="studio-icons-title" label="タイトル" value={iconsDraft.title} onChange={(title) => onIconsChange({ ...iconsDraft, title })} />
            <Field label="サブタイトル" value={iconsDraft.subtitle} onChange={(subtitle) => onIconsChange({ ...iconsDraft, subtitle })} />
            <Field label="説明文" value={iconsDraft.heroDescription} onChange={(heroDescription) => onIconsChange({ ...iconsDraft, heroDescription })} textarea />
            <CsvField label="注目人物ID" value={iconsDraft.featuredIconIds} onChange={(featuredIconIds) => onIconsChange({ ...iconsDraft, featuredIconIds })} />
            <Field label="エントリーCTA" value={iconsDraft.entryCtaText} onChange={(entryCtaText) => onIconsChange({ ...iconsDraft, entryCtaText })} />
            <Field label="推薦CTA" value={iconsDraft.recommendCtaText} onChange={(recommendCtaText) => onIconsChange({ ...iconsDraft, recommendCtaText })} />
          </div>
        ) : (
          <div className="space-y-4">
            <Field testId="studio-magazine-title" label="タイトル" value={magazineDraft.title} onChange={(title) => onMagazineChange({ ...magazineDraft, title })} />
            <Field label="サブタイトル" value={magazineDraft.subtitle} onChange={(subtitle) => onMagazineChange({ ...magazineDraft, subtitle })} />
            <Field label="最新号タイトル" value={magazineDraft.latestIssueTitle} onChange={(latestIssueTitle) => onMagazineChange({ ...magazineDraft, latestIssueTitle })} />
            <Field label="説明文" value={magazineDraft.description} onChange={(description) => onMagazineChange({ ...magazineDraft, description })} textarea />
            <DirectImageUploader value={magazineDraft.coverImage} onSelect={(coverImage) => onMagazineChange({ ...magazineDraft, coverImage })} />
            <Field label="CTAテキスト" value={magazineDraft.ctaText} onChange={(ctaText) => onMagazineChange({ ...magazineDraft, ctaText })} />
            <Field label="CTAリンク" value={magazineDraft.ctaHref} onChange={(ctaHref) => onMagazineChange({ ...magazineDraft, ctaHref })} />
          </div>
        )}
      </section>
    </aside>
  );
}

function StudioPreview({
  selectedPage,
  homeDraft,
  selectedHomeSectionId,
  selectedGenericSection,
  rankingDraft,
  newsDraft,
  iconsDraft,
  magazineDraft,
  onSelectHomeSection,
  onSelectGenericSection,
}: {
  selectedPage: StudioPage;
  homeDraft: HomeCmsData;
  selectedHomeSectionId: HomeSectionId;
  selectedGenericSection: string;
  rankingDraft: RankingCmsData;
  newsDraft: NewsCmsData;
  iconsDraft: IconsCmsData;
  magazineDraft: MagazineCmsData;
  onSelectHomeSection: (id: HomeSectionId) => void;
  onSelectGenericSection: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-[12px] font-black text-fuku-gray">
        <Smartphone size={16} />
        {pageLabels[selectedPage]} プレビュー。セクションをクリックして編集します。
      </div>
      <div className="mx-auto max-w-[430px] overflow-hidden rounded-[32px] border-[10px] border-fuku-black bg-white shadow-phone">
        <div className="flex h-12 items-center justify-between border-b border-fuku-border px-5">
          <span className="headline-condensed text-[24px] text-fuku-black">FUKU-MEETS</span>
          <span className="text-[11px] font-black text-fuku-red">DRAFT</span>
        </div>
        <div className="max-h-[720px] overflow-y-auto bg-white pb-6">
          {selectedPage === "home" ? (
            homeDraft.sectionOrder.map((sectionId) => {
              if (!homeDraft[sectionId].isVisible) return null;
              return (
                <div key={sectionId} role="button" tabIndex={0} onClick={() => onSelectHomeSection(sectionId)} className={`block border-2 transition ${selectedHomeSectionId === sectionId ? "border-fuku-red" : "border-transparent"}`}>
                  {renderHomePreviewSection(sectionId, homeDraft)}
                </div>
              );
            })
          ) : (
            getGenericSections(selectedPage).map((section) => (
              <div key={section.id} role="button" tabIndex={0} onClick={() => onSelectGenericSection(section.id)} className={`border-2 px-5 py-5 ${selectedGenericSection === section.id ? "border-fuku-red" : "border-transparent"}`}>
                <GenericPreviewBlock section={section.label} selectedPage={selectedPage} rankingDraft={rankingDraft} newsDraft={newsDraft} iconsDraft={iconsDraft} magazineDraft={magazineDraft} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function renderHomePreviewSection(sectionId: HomeSectionId, cms: HomeCmsData) {
  switch (sectionId) {
    case "hero":
      return <HeroSection cms={cms.hero} />;
    case "tonight":
      return <TonightInFukuokaSection cms={cms.tonight} />;
    case "ranking":
      return <RankingMeetSection cms={cms.ranking} />;
    case "fukuIcons":
      return <FukuIconsSection cms={cms.fukuIcons} iconsData={iconsData} />;
    case "localMedia":
      return <LocalMediaSection cms={cms.localMedia} />;
    case "startGuide":
      return <StartGuideSection cms={cms.startGuide} />;
    case "safety":
      return <SafetyCommunitySection cms={cms.safety} />;
    case "magazine":
      return <PaperSection cms={cms.magazine} />;
    case "followUs":
      return <HomeFollowUsSection cms={cms.followUs} />;
  }
}

function getGenericSections(page: StudioPage) {
  if (page === "ranking") {
    return [
      { id: "hero", label: "Hero" },
      { id: "tabs", label: "Category Tabs" },
      { id: "featured", label: "Featured Ranking" },
      { id: "cards", label: "Ranking Cards" },
      { id: "comments", label: "Comment Pickup" },
      { id: "vote", label: "Vote CTA" },
    ];
  }
  if (page === "news") {
    return [
      { id: "hero", label: "Hero" },
      { id: "tabs", label: "Category Tabs" },
      { id: "pickup", label: "Pick Up Contents" },
      { id: "articles", label: "Article List" },
      { id: "event", label: "Event CTA" },
    ];
  }
  if (page === "icons") {
    return [
      { id: "hero", label: "Hero" },
      { id: "weekly", label: "Weekly Icon" },
      { id: "ranking", label: "Icons Ranking" },
      { id: "cover", label: "Cover Ranking" },
      { id: "entry", label: "Entry CTA" },
      { id: "recommend", label: "Recommend CTA" },
    ];
  }
  return [
    { id: "hero", label: "Hero" },
    { id: "latest", label: "Latest Issue" },
    { id: "backnumber", label: "Back Number" },
    { id: "placement", label: "Placement CTA" },
    { id: "request", label: "Free Paper Request CTA" },
  ];
}

function GenericPreviewBlock({
  section,
  selectedPage,
  rankingDraft,
  newsDraft,
  iconsDraft,
  magazineDraft,
}: {
  section: string;
  selectedPage: StudioPage;
  rankingDraft: RankingCmsData;
  newsDraft: NewsCmsData;
  iconsDraft: IconsCmsData;
  magazineDraft: MagazineCmsData;
}) {
  const title = selectedPage === "ranking" ? rankingDraft.heroTitle : selectedPage === "news" ? newsDraft.title : selectedPage === "icons" ? iconsDraft.title : magazineDraft.title;
  const subtitle = selectedPage === "ranking" ? rankingDraft.heroSubtitle : selectedPage === "news" ? newsDraft.subtitle : selectedPage === "icons" ? iconsDraft.subtitle : magazineDraft.subtitle;
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">{section}</p>
      <h2 className="headline-condensed mt-2 text-[36px] uppercase leading-none text-fuku-black">{title}</h2>
      <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">{subtitle}</p>
      <div className="mt-4 rounded-[14px] border border-fuku-border bg-fuku-light p-4">
        <p className="text-[12px] font-black text-fuku-black">このページのCMSデータを公開すると {pageHrefs[selectedPage]} に反映されます。</p>
      </div>
    </div>
  );
}

function PublishDebugPanel({ selectedPage, draftMeta, publishedMeta }: { selectedPage: StudioPage; draftMeta: { updatedAt: string; title: string }; publishedMeta: { updatedAt: string; title: string } }) {
  return (
    <section className="mt-4 rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
      <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">公開データ確認</p>
      <dl className="mt-3 grid gap-2 text-[12px] font-bold text-fuku-gray">
        <div className="flex justify-between gap-3"><dt>編集中ページ</dt><dd className="font-black text-fuku-black">{pageLabels[selectedPage]}</dd></div>
        <div className="flex justify-between gap-3"><dt>draft更新</dt><dd className="text-right">{draftMeta.updatedAt}</dd></div>
        <div className="flex justify-between gap-3"><dt>published更新</dt><dd className="text-right">{publishedMeta.updatedAt}</dd></div>
        <div className="flex justify-between gap-3"><dt>公開タイトル</dt><dd className="text-right font-black text-fuku-black">{publishedMeta.title}</dd></div>
      </dl>
      <a href={pageHrefs[selectedPage]} className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full border border-fuku-border px-4 text-[12px] font-black">
        公開ページを見る
      </a>
    </section>
  );
}

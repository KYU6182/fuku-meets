"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, MonitorSmartphone, RotateCcw, Save, Send, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminStatusBadge from "./AdminStatusBadge";
import FvSlideEditor from "./FvSlideEditor";
import HeroSection from "../HeroSection";
import { useToast } from "../Toast";
import { defaultHomeCmsData, mergeHomeCmsData } from "@/lib/cms";
import { storageKeys } from "@/lib/storageKeys";
import type { HomeCmsData, HomeSectionId, HeroSlide } from "@/types/cms";

type MobileMode = "preview" | "edit";

export default function AdminStudioPage() {
  const [draft, setDraft] = useState<HomeCmsData>(defaultHomeCmsData);
  const [selectedPage, setSelectedPage] = useState("home");
  const [selectedSectionId, setSelectedSectionId] = useState<HomeSectionId>("hero");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [mobileMode, setMobileMode] = useState<MobileMode>("preview");
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKeys.adminHomeDraft);
    if (saved) setDraft(mergeHomeCmsData(JSON.parse(saved)));
  }, []);

  const selectedSection = useMemo(
    () => draft.sections.find((section) => section.id === selectedSectionId) ?? draft.sections[0],
    [draft.sections, selectedSectionId],
  );

  function updateHero(patch: Partial<HomeCmsData["hero"]>) {
    setDraft((current) => ({ ...current, hero: { ...current.hero, ...patch } }));
  }

  function updateSlide(index: number, patch: Partial<HeroSlide>) {
    setDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        slides: current.hero.slides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)),
      },
    }));
  }

  function toggleSection(sectionId: HomeSectionId) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === sectionId ? { ...section, isVisible: !section.isVisible } : section)),
      hero: sectionId === "hero" ? { ...current.hero, isVisible: !current.hero.isVisible } : current.hero,
    }));
  }

  function moveSection(direction: "up" | "down") {
    setDraft((current) => {
      const index = current.sections.findIndex((section) => section.id === selectedSectionId);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.sections.length) return current;
      const sections = [...current.sections];
      const [target] = sections.splice(index, 1);
      sections.splice(nextIndex, 0, target);
      return { ...current, sections };
    });
  }

  function saveDraft() {
    const next = { ...draft, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(storageKeys.adminHomeDraft, JSON.stringify(next));
    setDraft(next);
    showToast("下書き保存しました");
  }

  function publishDraft() {
    const next = { ...draft, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(storageKeys.adminHomePublished, JSON.stringify(next));
    setDraft(next);
    showToast("公開しました。HOMEに反映されます");
  }

  function resetDraft() {
    window.localStorage.removeItem(storageKeys.adminHomeDraft);
    setDraft(defaultHomeCmsData);
    setActiveSlideIndex(0);
    showToast("下書きをリセットしました");
  }

  return (
    <AdminLayout title="Visual Studio">
      <div className="mb-4 rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[220px_1fr_auto_auto_auto_auto] lg:items-center">
          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-widest text-fuku-gray">編集ページ</span>
            <select value={selectedPage} onChange={(event) => setSelectedPage(event.target.value)} className="mt-2 h-11 w-full rounded-full border border-fuku-border bg-white px-4 text-[13px] font-black">
              <option value="home">HOME</option>
              <option value="ranking">RANKING</option>
              <option value="news">NEWS</option>
              <option value="icons">FUKU ICONS</option>
              <option value="magazine">MAGAZINE</option>
            </select>
          </label>
          <div className="rounded-[12px] bg-fuku-light px-4 py-3 text-[12px] font-bold leading-relaxed text-fuku-gray">
            HOMEのFV 5枚スライド、画像、コピー、色、余白、表示順を編集できます。公開した内容だけが公開HOMEに反映されます。
          </div>
          <a href="/" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-border px-5 text-[13px] font-black">
            <Eye size={16} />
            公開ページを見る
          </a>
          <button type="button" onClick={saveDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-border px-5 text-[13px] font-black">
            <Save size={16} />
            下書き保存
          </button>
          <button type="button" onClick={publishDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white">
            <Send size={16} />
            公開する
          </button>
          <button type="button" onClick={resetDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-fuku-black px-5 text-[13px] font-black text-white">
            <RotateCcw size={16} />
            リセット
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 xl:hidden">
        <button type="button" onClick={() => setMobileMode("preview")} className={`min-h-[42px] rounded-full text-[13px] font-black ${mobileMode === "preview" ? "bg-fuku-red text-white" : "bg-white text-fuku-black"}`}>プレビュー</button>
        <button type="button" onClick={() => setMobileMode("edit")} className={`min-h-[42px] rounded-full text-[13px] font-black ${mobileMode === "edit" ? "bg-fuku-red text-white" : "bg-white text-fuku-black"}`}>編集</button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[430px_minmax(380px,1fr)]">
        <div className={`${mobileMode === "edit" ? "block" : "hidden"} xl:block`}>
          <EditorPanel
            draft={draft}
            selectedSectionId={selectedSectionId}
            selectedSectionLabel={selectedSection.label}
            activeSlideIndex={activeSlideIndex}
            onSelectedSectionChange={setSelectedSectionId}
            onActiveSlideIndexChange={setActiveSlideIndex}
            onHeroChange={updateHero}
            onSlideChange={updateSlide}
            onToggleSection={toggleSection}
            onMoveSection={moveSection}
          />
        </div>
        <div className={`${mobileMode === "preview" ? "block" : "hidden"} xl:block`}>
          <PreviewPanel draft={draft} selectedSectionId={selectedSectionId} onSelect={(id) => { setSelectedSectionId(id); setMobileMode("edit"); }} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-fuku-border bg-white/95 p-3 shadow-phone xl:hidden">
        <button type="button" onClick={saveDraft} className="mx-auto flex min-h-[48px] w-full max-w-[430px] items-center justify-center gap-2 rounded-full bg-fuku-red text-[14px] font-black text-white">
          <Save size={17} />
          Studioの下書きを保存
        </button>
      </div>
      <ToastViewport />
    </AdminLayout>
  );
}

function EditorPanel({
  draft,
  selectedSectionId,
  selectedSectionLabel,
  activeSlideIndex,
  onSelectedSectionChange,
  onActiveSlideIndexChange,
  onHeroChange,
  onSlideChange,
  onToggleSection,
  onMoveSection,
}: {
  draft: HomeCmsData;
  selectedSectionId: HomeSectionId;
  selectedSectionLabel: string;
  activeSlideIndex: number;
  onSelectedSectionChange: (id: HomeSectionId) => void;
  onActiveSlideIndexChange: (index: number) => void;
  onHeroChange: (patch: Partial<HomeCmsData["hero"]>) => void;
  onSlideChange: (index: number, patch: Partial<HeroSlide>) => void;
  onToggleSection: (id: HomeSectionId) => void;
  onMoveSection: (direction: "up" | "down") => void;
}) {
  const section = draft.sections.find((item) => item.id === selectedSectionId);

  return (
    <aside className="space-y-4">
      <section className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">Section Order</p>
            <h2 className="mt-1 text-[22px] font-black text-fuku-black">セクション管理</h2>
          </div>
          <MonitorSmartphone size={20} />
        </div>
        <div className="space-y-2">
          {draft.sections.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectedSectionChange(item.id)}
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
          <AdminStatusBadge status={section?.isVisible ? "published" : "private"} />
        </div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => onToggleSection(selectedSectionId)} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
            {section?.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
            表示
          </button>
          <button type="button" onClick={() => onMoveSection("up")} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
            <ArrowUp size={15} />
            上へ
          </button>
          <button type="button" onClick={() => onMoveSection("down")} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
            <ArrowDown size={15} />
            下へ
          </button>
        </div>

        {selectedSectionId === "hero" ? (
          <FvSlideEditor
            hero={draft.hero}
            activeIndex={activeSlideIndex}
            onActiveIndexChange={onActiveSlideIndexChange}
            onHeroChange={onHeroChange}
            onSlideChange={onSlideChange}
          />
        ) : (
          <GenericSectionEditor sectionLabel={selectedSectionLabel} />
        )}
      </section>
    </aside>
  );
}

function GenericSectionEditor({ sectionLabel }: { sectionLabel: string }) {
  return (
    <div className="rounded-[14px] border border-fuku-border bg-fuku-light p-4">
      <p className="text-[14px] font-black text-fuku-black">{sectionLabel}の編集</p>
      <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">
        まずはFV編集を重点対応しています。このセクションも同じStyle Editorへ拡張できるように表示/非表示と並び替えを保存します。
      </p>
    </div>
  );
}

function PreviewPanel({
  draft,
  selectedSectionId,
  onSelect,
}: {
  draft: HomeCmsData;
  selectedSectionId: HomeSectionId;
  onSelect: (id: HomeSectionId) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-[12px] font-black text-fuku-gray">
        <Smartphone size={16} />
        リアルタイムスマホプレビュー。クリックすると編集パネルへ移動します。
      </div>
      <div className="mx-auto max-w-[430px] overflow-hidden rounded-[32px] border-[10px] border-fuku-black bg-white shadow-phone">
        <div className="flex h-12 items-center justify-between border-b border-fuku-border px-5">
          <span className="headline-condensed text-[24px] text-fuku-black">FUKU-MEETS</span>
          <span className="text-[11px] font-black text-fuku-red">DRAFT</span>
        </div>
        <div className="max-h-[720px] overflow-y-auto bg-white pb-6">
          {draft.sections.filter((section) => section.isVisible).map((section) => (
            <div
              key={section.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(section.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(section.id);
              }}
              className={`block w-full border-2 text-left transition ${
                selectedSectionId === section.id ? "border-fuku-red" : "border-transparent"
              }`}
            >
              {section.id === "hero" ? (
                <HeroSection hero={draft.hero} />
              ) : (
                <PreviewPlaceholder label={section.label} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewPlaceholder({ label }: { label: string }) {
  return (
    <div className="px-4 py-6">
      <p className="headline-condensed text-[34px] uppercase leading-none text-fuku-black">{label}</p>
      <p className="mt-2 text-[12px] font-bold text-fuku-gray">クリックして表示/非表示や順番を編集</p>
      <div className="mt-4 h-24 rounded-[12px] bg-[linear-gradient(135deg,#f2eee8,#fff1f1)]" />
    </div>
  );
}

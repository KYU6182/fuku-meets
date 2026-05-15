"use client";

import { ArrowDown, ArrowUp, Eye, Image, LayoutTemplate, Save, Send, Smartphone, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminStatusBadge from "./AdminStatusBadge";
import AdminFormField from "./AdminFormField";
import { useToast } from "../Toast";
import { storageKeys } from "@/lib/storageKeys";

type StudioSectionId = "hero" | "icons" | "ranking" | "weekend" | "newIn" | "magazine" | "pickup";

type StudioSection = {
  id: StudioSectionId;
  label: string;
  visible: boolean;
};

type HomeStudioDraft = {
  page: "home";
  heroImage: string;
  heroTitle: string;
  heroCopy: string;
  heroCtaText: string;
  heroCtaLink: string;
  iconsPeople: string;
  rankingThemes: string;
  weekendCategories: string;
  newInCards: string;
  magazineTitle: string;
  magazineCopy: string;
  pickupArticles: string;
  sections: StudioSection[];
  updatedAt?: string;
};

const defaultDraft: HomeStudioDraft = {
  page: "home",
  heroImage: "/images/hero.jpg",
  heroTitle: "いま福岡で、\n会いたい人と店。",
  heroCopy: "気になるあの人、行きつけのあの店。\n福岡の“いま”をつなげる。",
  heroCtaText: "最新ランキングを見る",
  heroCtaLink: "/ranking",
  iconsPeople: "YUI / RENA / KEITA",
  rankingThemes: "好きなスーパー / 好きな駅 / 住みたい街 / 深夜助かる場所",
  weekendCategories: "居酒屋 / ラーメン / 美容室 / カフェ / パン / シーシャ / クラブ / 人気ランキング",
  newInCards: "まず行きたい定番スポット / 最初に住みたい街 / はじめての行きつけ特集",
  magazineTitle: "FUKU-MEETS MAGAZINE",
  magazineCopy: "福岡の空気を、Webと紙で残すローカルマガジン。",
  pickupArticles: "LOCAL NEWS / FEATURE / CITY GUIDE",
  sections: [
    { id: "hero", label: "FV / Hero", visible: true },
    { id: "icons", label: "FUKU ICONS", visible: true },
    { id: "ranking", label: "FUKUOKA RANKING", visible: true },
    { id: "weekend", label: "WEEKEND GUIDE", visible: true },
    { id: "newIn", label: "NEW IN FUKUOKA", visible: true },
    { id: "magazine", label: "MAGAZINE", visible: true },
    { id: "pickup", label: "PICK UP CONTENTS", visible: true },
  ],
};

const mediaOptions = [
  "/images/hero.jpg",
  "/images/fukuoka-city.jpg",
  "/images/paper-cover.jpg",
  "/images/news-1.jpg",
];

const sectionFieldMap: Record<StudioSectionId, Array<keyof HomeStudioDraft>> = {
  hero: ["heroImage", "heroTitle", "heroCopy", "heroCtaText", "heroCtaLink"],
  icons: ["iconsPeople"],
  ranking: ["rankingThemes"],
  weekend: ["weekendCategories"],
  newIn: ["newInCards"],
  magazine: ["magazineTitle", "magazineCopy"],
  pickup: ["pickupArticles"],
};

const fieldLabels: Partial<Record<keyof HomeStudioDraft, string>> = {
  heroImage: "FV画像",
  heroTitle: "FVタイトル",
  heroCopy: "FVサブコピー",
  heroCtaText: "FV CTAテキスト",
  heroCtaLink: "FV CTAリンク",
  iconsPeople: "表示人物",
  rankingThemes: "表示ランキングテーマ",
  weekendCategories: "表示カテゴリ",
  newInCards: "NEW IN FUKUOKAカード",
  magazineTitle: "MAGAZINEタイトル",
  magazineCopy: "MAGAZINEコピー",
  pickupArticles: "表示記事",
};

export default function AdminStudioPage() {
  const [draft, setDraft] = useState<HomeStudioDraft>(defaultDraft);
  const [selectedPage, setSelectedPage] = useState("home");
  const [selectedSectionId, setSelectedSectionId] = useState<StudioSectionId>("hero");
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKeys.adminHomeDraft);
    if (saved) {
      setDraft({ ...defaultDraft, ...JSON.parse(saved) });
    }
  }, []);

  const selectedSection = useMemo(
    () => draft.sections.find((section) => section.id === selectedSectionId) ?? draft.sections[0],
    [draft.sections, selectedSectionId],
  );

  function updateField(field: keyof HomeStudioDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function toggleSection(sectionId: StudioSectionId) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === sectionId ? { ...section, visible: !section.visible } : section)),
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
    showToast("公開しました");
  }

  return (
    <AdminLayout title="Visual Studio">
      <div className="mb-4 rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[220px_1fr_auto_auto_auto] lg:items-center">
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
            MVPではHOME編集に対応。ほかのページは同じ構造へ拡張できます。
          </div>
          <a href="/" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-border px-5 text-[13px] font-black">
            <Eye size={16} />
            プレビュー
          </a>
          <button type="button" onClick={saveDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-border px-5 text-[13px] font-black">
            <Save size={16} />
            下書き保存
          </button>
          <button type="button" onClick={publishDraft} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white">
            <Send size={16} />
            公開
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[390px_minmax(360px,1fr)]">
        <EditorPanel
          draft={draft}
          selectedSection={selectedSection}
          onFieldChange={updateField}
          onToggle={() => toggleSection(selectedSection.id)}
          onMove={moveSection}
        />
        <PreviewPanel draft={draft} selectedSectionId={selectedSectionId} onSelect={setSelectedSectionId} />
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
  selectedSection,
  onFieldChange,
  onToggle,
  onMove,
}: {
  draft: HomeStudioDraft;
  selectedSection: StudioSection;
  onFieldChange: (field: keyof HomeStudioDraft, value: string) => void;
  onToggle: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const fields = sectionFieldMap[selectedSection.id];

  return (
    <aside className="order-2 rounded-[18px] border border-fuku-border bg-white p-4 shadow-soft xl:order-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">Edit Section</p>
          <h2 className="mt-1 text-[24px] font-black text-fuku-black">{selectedSection.label}</h2>
        </div>
        <AdminStatusBadge status={selectedSection.visible ? "published" : "private"} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={onToggle} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
          {selectedSection.visible ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
          表示
        </button>
        <button type="button" onClick={() => onMove("up")} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
          <ArrowUp size={16} />
          上へ
        </button>
        <button type="button" onClick={() => onMove("down")} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
          <ArrowDown size={16} />
          下へ
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {fields.map((field) => {
          if (field === "heroImage") {
            return (
              <div key={field} className="rounded-[14px] border border-fuku-border bg-fuku-light p-3">
                <p className="text-[12px] font-black text-fuku-black">メディアライブラリ</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {mediaOptions.map((media) => (
                    <button
                      key={media}
                      type="button"
                      onClick={() => onFieldChange("heroImage", media)}
                      className={`rounded-[10px] border bg-white p-2 text-left text-[10px] font-bold ${
                        draft.heroImage === media ? "border-fuku-red text-fuku-red" : "border-fuku-border text-fuku-gray"
                      }`}
                    >
                      <span className="mb-2 grid h-14 place-items-center rounded-[8px] bg-[linear-gradient(135deg,#111,#e52421)] text-white">
                        <Image size={16} />
                      </span>
                      {media}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <AdminFormField
              key={field}
              label={fieldLabels[field] ?? field}
              type={String(draft[field]).length > 42 ? "textarea" : "text"}
              value={String(draft[field])}
              onChange={(value) => onFieldChange(field, value)}
            />
          );
        })}
      </div>

      <div className="mt-5 rounded-[14px] bg-fuku-light p-4">
        <p className="text-[12px] font-black text-fuku-black">セクション並び替え</p>
        <div className="mt-3 space-y-2">
          {draft.sections.map((section, index) => (
            <div key={section.id} className={`flex items-center justify-between rounded-[10px] bg-white px-3 py-2 text-[12px] font-black ${section.id === selectedSection.id ? "text-fuku-red" : "text-fuku-black"}`}>
              <span>{index + 1}. {section.label}</span>
              <span>{section.visible ? "表示" : "非表示"}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function PreviewPanel({
  draft,
  selectedSectionId,
  onSelect,
}: {
  draft: HomeStudioDraft;
  selectedSectionId: StudioSectionId;
  onSelect: (id: StudioSectionId) => void;
}) {
  return (
    <section className="order-1 xl:order-2">
      <div className="mb-3 flex items-center gap-2 text-[12px] font-black text-fuku-gray">
        <Smartphone size={16} />
        スマホプレビュー。セクションをクリックして編集できます。
      </div>
      <div className="mx-auto max-w-[430px] overflow-hidden rounded-[32px] border-[10px] border-fuku-black bg-white shadow-phone">
        <div className="flex h-12 items-center justify-between border-b border-fuku-border px-5">
          <span className="headline-condensed text-[24px] text-fuku-black">FUKU-MEETS</span>
          <LayoutTemplate size={18} />
        </div>
        <div className="max-h-[680px] overflow-y-auto bg-white p-4">
          {draft.sections.map((section) => {
            if (!section.visible) return null;
            return (
              <button
                type="button"
                key={section.id}
                onClick={() => onSelect(section.id)}
                className={`mb-4 block w-full rounded-[16px] border p-4 text-left transition ${
                  selectedSectionId === section.id ? "border-fuku-red ring-2 ring-fuku-red/20" : "border-fuku-border"
                }`}
              >
                <PreviewSection draft={draft} section={section} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PreviewSection({ draft, section }: { draft: HomeStudioDraft; section: StudioSection }) {
  if (section.id === "hero") {
    return (
      <div className="min-h-[260px] rounded-[14px] bg-[linear-gradient(135deg,#111,#4b1a1a)] p-5 text-white">
        <span className="rounded-full bg-fuku-red px-3 py-1 text-[11px] font-black">特集</span>
        <h3 className="mt-12 whitespace-pre-line text-[28px] font-black leading-tight">{draft.heroTitle}</h3>
        <p className="mt-4 whitespace-pre-line text-[12px] font-bold leading-relaxed text-white/80">{draft.heroCopy}</p>
        <span className="mt-5 inline-flex rounded-full bg-fuku-red px-4 py-3 text-[12px] font-black">{draft.heroCtaText}</span>
      </div>
    );
  }

  const body: Record<StudioSectionId, string> = {
    hero: "",
    icons: draft.iconsPeople,
    ranking: draft.rankingThemes,
    weekend: draft.weekendCategories,
    newIn: draft.newInCards,
    magazine: `${draft.magazineTitle}\n${draft.magazineCopy}`,
    pickup: draft.pickupArticles,
  };

  return (
    <div>
      <p className="headline-condensed text-[28px] uppercase leading-none text-fuku-black">{section.label}</p>
      <p className="mt-3 whitespace-pre-line text-[12px] font-bold leading-relaxed text-fuku-gray">{body[section.id]}</p>
      <div className="mt-4 h-24 rounded-[12px] bg-[linear-gradient(135deg,#f2eee8,#fff1f1)]" />
    </div>
  );
}

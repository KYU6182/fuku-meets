"use client";

import { CheckCircle2, Copy, FileText, ImageIcon, Lightbulb, ListChecks, Save, Search, Sparkles, Tags } from "lucide-react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminFormField from "./AdminFormField";
import { useToast } from "../Toast";
import { generateBannerDrafts, generateMockTags, generateMockText, generateRankingIdeas, importShopCandidates, runQualityCheck } from "@/lib/aiTools";
import type { AiContentType } from "@/types/ai";
import { storageKeys } from "@/lib/storageKeys";

export type AiToolMode = "dashboard" | "editor" | "tags" | "ranking-ideas" | "quality-check" | "banner" | "import-shops";

const aiCards = [
  { title: "AI文章作成", href: "/admin/ai/editor", icon: FileText, description: "NEWS、店舗紹介、プロフィール、SEO、SNS文を下書き化。" },
  { title: "AIタグ付け", href: "/admin/ai/tags", icon: Tags, description: "エリア、ジャンル、気分、SEOタグを整理。" },
  { title: "ランキングテーマ提案", href: "/admin/ai/ranking-ideas", icon: Lightbulb, description: "投票が集まりやすいランキング案を作成。" },
  { title: "公開前チェック", href: "/admin/ai/quality-check", icon: ListChecks, description: "画像、alt、PR表記、リンク切れを確認。" },
  { title: "バナー作成", href: "/admin/ai/banner", icon: ImageIcon, description: "FV、NEWS、MAGAZINE用のバナー案を作成。" },
  { title: "店舗取り込みAI", href: "/admin/ai/import-shops", icon: Search, description: "公式APIや投稿候補をFUKU-MEETS形式に整形。" },
];

export default function AdminAiToolsPage({ mode }: { mode: AiToolMode }) {
  if (mode === "dashboard") return <AiDashboard />;
  return <AiToolDetail mode={mode} />;
}

function AiDashboard() {
  return (
    <AdminLayout title="AI Tools">
      <div className="mb-6 rounded-[20px] border border-fuku-border bg-white p-6 shadow-soft">
        <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">AI CMS Assistant</p>
        <h2 className="mt-2 text-[32px] font-black text-fuku-black">編集部の作業を、公開前まで軽くする。</h2>
        <p className="mt-3 max-w-3xl text-[14px] font-bold leading-relaxed text-fuku-gray">
          今はモック生成です。将来はOpenAI APIのサーバー処理へ差し替え、生成結果は必ず管理者確認後に公開する設計です。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {aiCards.map(({ title, href, icon: Icon, description }) => (
          <a key={href} href={href} className="group rounded-[18px] border border-fuku-border bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-fuku-red">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff1f1] text-fuku-red">
              <Icon size={22} />
            </span>
            <h3 className="mt-5 text-[20px] font-black text-fuku-black">{title}</h3>
            <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-gray">{description}</p>
            <p className="mt-5 text-[12px] font-black text-fuku-red">開く →</p>
          </a>
        ))}
      </div>
    </AdminLayout>
  );
}

function AiToolDetail({ mode }: { mode: Exclude<AiToolMode, "dashboard"> }) {
  const { showToast, ToastViewport } = useToast();
  const [contentType, setContentType] = useState<AiContentType>("NEWS記事");
  const [sourceText, setSourceText] = useState("");
  const [tone, setTone] = useState("FUKU-MEETSらしく");
  const [area, setArea] = useState("薬院");
  const [genre, setGenre] = useState("カフェ");
  const [target, setTarget] = useState("福岡初心者");
  const [purpose, setPurpose] = useState("保存と投票を増やす");
  const [bannerType, setBannerType] = useState("FV");
  const [bannerTitle, setBannerTitle] = useState("今週末、福岡で会いたい店");
  const [bannerCopy, setBannerCopy] = useState("保存したくなるローカルガイド。");
  const [bannerColor, setBannerColor] = useState("#e52421");
  const [shopSource, setShopSource] = useState("Google Places");
  const [result, setResult] = useState<unknown>(null);

  function saveDraft(payload: unknown) {
    if (typeof window === "undefined") return;
    const drafts = JSON.parse(window.localStorage.getItem(storageKeys.adminDrafts) ?? "[]") as unknown[];
    drafts.unshift({ mode, payload, createdAt: new Date().toISOString() });
    window.localStorage.setItem(storageKeys.adminDrafts, JSON.stringify(drafts.slice(0, 20)));
    showToast("下書きに保存しました");
  }

  function copyResult() {
    navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
    showToast("コピーしました");
  }

  function run() {
    const next =
      mode === "editor" ? generateMockText({ contentType, source: sourceText, tone }) :
      mode === "tags" ? generateMockTags(sourceText) :
      mode === "ranking-ideas" ? generateRankingIdeas({ area, genre, target, purpose }) :
      mode === "quality-check" ? runQualityCheck(sourceText) :
      mode === "banner" ? generateBannerDrafts({ type: bannerType, title: bannerTitle, subtitle: bannerCopy, color: bannerColor }) :
      importShopCandidates({ area, genre, source: shopSource });
    setResult(next);
    showToast("AIモック生成しました");
  }

  const title = {
    editor: "AI文章作成",
    tags: "AIタグ付け",
    "ranking-ideas": "ランキングテーマ提案",
    "quality-check": "公開前チェック",
    banner: "バナー作成",
    "import-shops": "店舗取り込みAI",
  }[mode];

  return (
    <AdminLayout title={title}>
      <div className="grid gap-5 xl:grid-cols-[410px_1fr]">
        <section className="rounded-[18px] border border-fuku-border bg-white p-5 shadow-soft">
          <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">Input</p>
          <h2 className="mt-1 text-[24px] font-black text-fuku-black">{title}</h2>
          <div className="mt-5 space-y-4">
            {mode === "editor" ? (
              <>
                <AdminFormField label="種別選択" type="select" value={contentType} options={["NEWS記事", "店舗紹介文", "FUKU ICONSプロフィール", "SEO description", "Instagram投稿文"]} onChange={(value) => setContentType(value as AiContentType)} />
                <AdminFormField label="元情報" type="textarea" value={sourceText} onChange={setSourceText} placeholder="店名、特徴、エリア、伝えたいこと" />
                <AdminFormField label="トーン" type="select" value={tone} options={["FUKU-MEETSらしく", "SEO向け", "Instagram向け", "短め", "丁寧"]} onChange={setTone} />
              </>
            ) : null}

            {mode === "tags" || mode === "quality-check" ? (
              <AdminFormField label={mode === "tags" ? "タグ付けしたい本文" : "公開前チェック対象の本文"} type="textarea" value={sourceText} onChange={setSourceText} placeholder="NEWS本文、店舗紹介、プロフィールなど" />
            ) : null}

            {mode === "ranking-ideas" || mode === "import-shops" ? (
              <>
                <AdminFormField label="エリア" value={area} onChange={setArea} />
                <AdminFormField label="ジャンル" value={genre} onChange={setGenre} />
              </>
            ) : null}

            {mode === "ranking-ideas" ? (
              <>
                <AdminFormField label="対象ユーザー" value={target} onChange={setTarget} />
                <AdminFormField label="目的" value={purpose} onChange={setPurpose} />
              </>
            ) : null}

            {mode === "banner" ? (
              <>
                <AdminFormField label="バナー種類" type="select" value={bannerType} options={["FV", "ランキング", "NEWS", "MAGAZINE", "Instagram"]} onChange={setBannerType} />
                <AdminFormField label="タイトル" value={bannerTitle} onChange={setBannerTitle} />
                <AdminFormField label="サブコピー" value={bannerCopy} onChange={setBannerCopy} />
                <AdminFormField label="カラー" value={bannerColor} onChange={setBannerColor} />
              </>
            ) : null}

            {mode === "import-shops" ? (
              <>
                <AdminFormField label="条件" value={purpose} onChange={setPurpose} />
                <AdminFormField label="取得元" type="select" value={shopSource} options={["Google Places", "ホットペッパー", "ユーザー推薦"]} onChange={setShopSource} />
                <div className="rounded-[12px] border border-[#f5caca] bg-[#fff1f1] p-4 text-[12px] font-bold leading-relaxed text-fuku-gray">
                  公式API利用・管理者確認後公開が前提です。無許可スクレイピングや自動公開は行いません。
                </div>
              </>
            ) : null}

            <button type="button" onClick={run} className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-fuku-red text-[14px] font-black text-white">
              <Sparkles size={17} />
              生成する
            </button>
          </div>
        </section>

        <section className="rounded-[18px] border border-fuku-border bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">Output</p>
              <h2 className="mt-1 text-[24px] font-black text-fuku-black">生成結果</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={copyResult} disabled={!result} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-fuku-border px-4 text-[12px] font-black disabled:opacity-40">
                <Copy size={15} />
                コピー
              </button>
              <button type="button" onClick={() => saveDraft(result)} disabled={!result} className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-fuku-black px-4 text-[12px] font-black text-white disabled:opacity-40">
                <Save size={15} />
                下書きに保存
              </button>
            </div>
          </div>
          {result ? <AiResultView mode={mode} result={result} /> : <EmptyAiResult />}
        </section>
      </div>
      <ToastViewport />
    </AdminLayout>
  );
}

function EmptyAiResult() {
  return (
    <div className="mt-5 grid min-h-[360px] place-items-center rounded-[16px] bg-fuku-light p-8 text-center">
      <div>
        <Sparkles className="mx-auto text-fuku-red" size={34} />
        <p className="mt-4 text-[14px] font-black text-fuku-black">入力して生成すると、ここに結果が表示されます。</p>
        <p className="mt-2 text-[12px] font-bold text-fuku-gray">実API接続前のモックUIです。</p>
      </div>
    </div>
  );
}

function AiResultView({ mode, result }: { mode: Exclude<AiToolMode, "dashboard">; result: unknown }) {
  if (mode === "banner" && Array.isArray(result)) {
    return (
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {result.map((item: any, index) => (
          <div key={item.layout} className="overflow-hidden rounded-[16px] border border-fuku-border bg-white">
            <div className="min-h-[170px] p-5 text-white" style={{ background: item.palette }}>
              <p className="text-[11px] font-black uppercase tracking-widest">BANNER {index + 1}</p>
              <h3 className="mt-8 text-[24px] font-black leading-tight">{item.title}</h3>
              <p className="mt-3 text-[12px] font-bold text-white/80">{item.subtitle}</p>
            </div>
            <p className="p-4 text-[12px] font-bold text-fuku-gray">{item.layout}</p>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "quality-check" && Array.isArray(result)) {
    return (
      <div className="mt-5 space-y-3">
        {result.map((item: any) => (
          <div key={item.item} className="flex gap-3 rounded-[14px] border border-fuku-border p-4">
            <CheckCircle2 className={item.status === "OK" ? "text-emerald-600" : item.status === "注意" ? "text-amber-600" : "text-fuku-red"} size={20} />
            <div>
              <p className="text-[14px] font-black">{item.item} / {item.status}</p>
              <p className="mt-1 text-[12px] font-bold leading-relaxed text-fuku-gray">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "import-shops" && Array.isArray(result)) {
    return (
      <div className="mt-5 space-y-4">
        {result.map((item: any) => (
          <article key={item.id} className="rounded-[16px] border border-fuku-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-black">{item.name}</h3>
                <p className="mt-1 text-[12px] font-bold text-fuku-gray">{item.area} / {item.genre} / {item.source}</p>
              </div>
              <span className="rounded-full bg-[#fff1f1] px-3 py-1 text-[11px] font-black text-fuku-red">{item.duplicateStatus}</span>
            </div>
            <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">{item.generatedDescription}</p>
            <div className="mt-3 flex flex-wrap gap-2">{item.tags.map((tag: string) => <span key={tag} className="rounded-full bg-fuku-light px-3 py-1 text-[11px] font-black">#{tag}</span>)}</div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <pre className="mt-5 min-h-[360px] overflow-auto rounded-[16px] bg-[#111] p-5 text-[12px] font-bold leading-relaxed text-white">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}

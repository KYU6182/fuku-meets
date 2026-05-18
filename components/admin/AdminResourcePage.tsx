"use client";

import { Edit, Eye, Plus } from "lucide-react";
import { useState } from "react";
import { addAdminLog, adminForms, adminIcons, adminNews, adminRankings, adminShops, adminUsers } from "@/lib/adminData";
import type { AdminStatus } from "@/types/admin";
import AdminCard from "./AdminCard";
import AdminFormField from "./AdminFormField";
import AdminImagePicker from "./AdminImagePicker";
import AdminLayout from "./AdminLayout";
import AdminStatusBadge from "./AdminStatusBadge";
import AdminTable from "./AdminTable";
import { useToast } from "../Toast";

type ResourceKind = "news" | "rankings" | "shops" | "icons" | "events" | "magazine" | "forms" | "users" | "media" | "home" | "settings" | "logs";
type ResourceRow = { title: string; meta: string; status: AdminStatus; editHref?: string };
type ResourceConfig = { title: string; eyebrow: string; description: string; rows: ResourceRow[]; newHref?: string };
type EditableKind = "news" | "rankings" | "shops" | "icons";
type RankingEntryForm = {
  id?: string;
  slug: string;
  name: string;
  area: string;
  description: string;
  tags: string;
  votes: string;
  rank: string;
  image: string;
  heroImageUrl: string;
  status: string;
};

export function AdminResourceListPage({ kind }: { kind: ResourceKind }) {
  const config = getConfig(kind);
  const { showToast, ToastViewport } = useToast();

  function updateStatus(label: string) {
    addAdminLog(`${label}を更新しました`, kind, label);
    showToast("更新しました");
  }

  return (
    <AdminLayout title={config.title}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">{config.eyebrow}</p>
          <h2 className="mt-1 text-[28px] font-black text-fuku-black">{config.title}</h2>
          <p className="mt-1 text-[13px] font-bold text-fuku-gray">{config.description}</p>
        </div>
        {config.newHref ? (
          <a href={config.newHref} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white">
            <Plus size={16} />
            新規作成
          </a>
        ) : null}
      </div>

      {kind === "media" ? <MediaPanel /> : null}
      {kind === "home" ? <HomeEditorPanel /> : null}
      {kind === "settings" ? <SettingsPanel /> : null}

      {config.rows.length > 0 ? (
        <AdminTable
          rows={config.rows}
          columns={[
            { header: "名前", render: (item) => <span className="font-black">{item.title}</span> },
            { header: "種別", render: (item) => item.meta },
            { header: "ステータス", render: (item) => <AdminStatusBadge status={item.status} /> },
            {
              header: "操作",
              render: (item) => (
                <div className="flex gap-2">
                  {item.editHref ? (
                    <a href={item.editHref} className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-fuku-border px-3 text-[11px] font-black">
                      <Edit size={13} />
                      編集
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => updateStatus(item.title)}
                    className="inline-flex min-h-[34px] items-center gap-1 rounded-full bg-fuku-black px-3 text-[11px] font-black text-white"
                  >
                    <Eye size={13} />
                    公開/確認
                  </button>
                </div>
              ),
            },
          ]}
        />
      ) : null}
      <ToastViewport />
    </AdminLayout>
  );
}

export function AdminEditPage({ kind, mode, id }: { kind: EditableKind; mode: "new" | "edit"; id?: string }) {
  const config = getEditConfig(kind, id);
  const { showToast, ToastViewport } = useToast();
  const [status, setStatus] = useState("draft");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    config.fields.forEach((field) => {
      values[field.label] = field.value ?? (field.options?.[0] ?? "");
    });
    return values;
  });
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [rankingEntries, setRankingEntries] = useState<RankingEntryForm[]>(() => getInitialRankingEntries(kind, id));

  async function save(label: string, nextStatus?: string) {
    setIsSaving(true);
    setSaveError("");
    try {
      const payload = buildPayload(kind, id, fieldValues, nextStatus ?? status, rankingEntries);
      const response = await fetch(`/api/admin/content/${kind}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...getAdminSessionHeader(),
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.error) throw new Error(result.error ?? "Supabaseへの保存に失敗しました");
      addAdminLog(label, kind, payload.id ?? id ?? "new");
      showToast(label);
    } catch (error) {
      const message = error instanceof Error ? error.message : "保存に失敗しました";
      setSaveError(message);
      showToast(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout title={`${config.title} ${mode === "new" ? "新規作成" : "編集"}`}>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <form className="space-y-4 rounded-[16px] border border-fuku-border bg-white p-5" onSubmit={(event) => event.preventDefault()}>
          {config.fields.map((field) => (
            "type" in field && field.type === "file" ? (
              <AdminImagePicker
                key={field.label}
                label={field.label}
                category={kind === "icons" ? "icons" : kind === "rankings" ? "ranking" : kind === "news" ? "news" : "shop"}
                value={fieldValues[field.label] ?? ""}
                onChange={(url) => setFieldValues((current) => ({ ...current, [field.label]: url }))}
                helpText={`${field.label}をSupabase Storageへ保存し、保存後のURLを編集値として使います。`}
              />
            ) : (
              <AdminFormField
                key={field.label}
                {...field}
                value={fieldValues[field.label] ?? ""}
                onChange={(value) => setFieldValues((current) => ({ ...current, [field.label]: value }))}
              />
            )
          ))}
          {kind === "rankings" ? <RankingEntriesEditor entries={rankingEntries} onChange={setRankingEntries} /> : null}
          {kind === "icons" ? <IconsExtraEditor values={fieldValues} onChange={setFieldValues} /> : null}
          {kind === "news" ? <NewsExtraEditor values={fieldValues} onChange={setFieldValues} /> : null}
          {saveError ? <p className="rounded-[10px] bg-[#fff1f1] px-4 py-3 text-[12px] font-black text-fuku-red">{saveError}</p> : null}
          <div className="grid gap-3 border-t border-fuku-border pt-5 sm:grid-cols-3">
            <button type="button" disabled={isSaving} onClick={() => { setStatus("draft"); void save("下書き保存しました", "draft"); }} className="min-h-[44px] rounded-full border border-fuku-border text-[13px] font-black disabled:opacity-60">
              下書き保存
            </button>
            <button type="button" disabled={isSaving} onClick={() => { setStatus("published"); void save("公開しました", "published"); }} className="min-h-[44px] rounded-full bg-fuku-red text-[13px] font-black text-white disabled:opacity-60">
              公開する
            </button>
            <button type="button" disabled={isSaving} onClick={() => { setStatus("private"); void save("非公開にしました", "private"); }} className="min-h-[44px] rounded-full bg-fuku-black text-[13px] font-black text-white disabled:opacity-60">
              非公開
            </button>
          </div>
        </form>
        <aside className="space-y-4">
          <AdminCard title="現在のステータス">
            <div className="mt-3"><AdminStatusBadge status={status as AdminStatus} /></div>
          </AdminCard>
          <AdminCard title="セキュリティメモ">
            <ul className="mt-3 space-y-2 text-[12px] font-bold leading-relaxed text-fuku-gray">
              <li>・削除はarchived化で対応</li>
              <li>・本文はMarkdown想定、HTMLは直接出力しない</li>
              <li>・画像はjpg/png/webpのみ、SVGは禁止</li>
              <li>・本番はSupabase Auth/RLSでrole確認</li>
            </ul>
          </AdminCard>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-fuku-border bg-white/95 p-3 shadow-phone xl:hidden">
        <button type="button" onClick={() => { setStatus("draft"); void save("下書き保存しました", "draft"); }} className="mx-auto flex min-h-[48px] w-full max-w-[430px] items-center justify-center rounded-full bg-fuku-red text-[14px] font-black text-white">
          下書き保存
        </button>
      </div>
      <ToastViewport />
    </AdminLayout>
  );
}

function getConfig(kind: ResourceKind): ResourceConfig {
  const row = (title: string, meta: string, status: string, editHref?: string) => ({ title, meta, status: status as AdminStatus, editHref });
  const configs = {
    news: {
      title: "NEWS管理",
      eyebrow: "Content",
      description: "記事一覧、下書き、公開、非公開、プレビューを管理します。",
      newHref: "/admin/news/new",
      rows: adminNews.map((item) => row(item.title, item.category, item.status, `/admin/news/${item.id}/edit`)),
    },
    rankings: {
      title: "ランキング管理",
      eyebrow: "Ranking",
      description: "テーマ追加、候補追加、投票数、集計期間、PR表示を管理します。",
      newHref: "/admin/rankings/new",
      rows: adminRankings.map((item) => row(item.title, item.category, item.status, `/admin/rankings/${item.id}/edit`)),
    },
    shops: {
      title: "店舗管理",
      eyebrow: "Shop",
      description: "店舗情報、画像、営業時間、タグ、PR/通常掲載を管理します。",
      newHref: "/admin/shops/new",
      rows: adminShops.map((item) => row(item.name, `${item.category} / ${item.area}`, item.status, `/admin/shops/${item.id}/edit`)),
    },
    icons: {
      title: "FUKU ICONS管理",
      eyebrow: "People",
      description: "掲載人物、表紙候補、一般エントリー、推薦を管理します。",
      newHref: "/admin/icons/new",
      rows: adminIcons.map((item) => row(item.name, `${item.category} / ${item.area}`, item.status, `/admin/icons/${item.id}/edit`)),
    },
    forms: {
      title: "フォーム投稿",
      eyebrow: "Submission",
      description: "お問い合わせ、掲載希望、店舗推薦、FUKU ICONS応募などを確認します。",
      rows: adminForms.map((item) => row(item.name, item.type, item.status)),
    },
    users: {
      title: "ユーザー管理",
      eyebrow: "Users",
      description: "一般ユーザーと管理者権限を確認します。role変更はsuper_adminのみ。",
      rows: adminUsers.map((item) => row(item.name, item.email, item.role)),
    },
    logs: {
      title: "操作ログ",
      eyebrow: "Audit",
      description: "誰が、いつ、何を、どのリソースへ行ったかを確認します。",
      rows: [],
    },
    events: {
      title: "イベント管理",
      eyebrow: "Events",
      description: "投稿イベントの承認、NEWS掲載、公開/非公開を管理します。",
      rows: adminForms.filter((item) => item.type.includes("イベント")).map((item) => row(item.name, item.createdAt, item.status)),
    },
    magazine: {
      title: "MAGAZINE管理",
      eyebrow: "Magazine",
      description: "最新号、表紙画像、掲載店舗、設置場所、設置申請を管理します。",
      rows: [row("vol.01 福岡のいまを歩く", "最新号", "published"), row("設置場所リスト", "店舗管理", "reviewing")],
    },
    media: {
      title: "画像管理",
      eyebrow: "Media",
      description: "画像アップロード、alt編集、非表示切り替えを管理します。",
      rows: [],
    },
    home: {
      title: "HOME管理",
      eyebrow: "Home",
      description: "FV、表示人物、HOMEランキング、MAGAZINEバナーなどを編集します。",
      rows: [],
    },
    settings: {
      title: "サイト設定",
      eyebrow: "Settings",
      description: "サイト名、SNSリンク、メールマガジン、メンテナンス表示を管理します。",
      rows: [],
    },
  } satisfies Record<ResourceKind, ResourceConfig>;

  return configs[kind];
}

function getEditConfig(kind: EditableKind, id?: string) {
  const news = adminNews.find((item) => item.id === id || item.slug === id);
  const ranking = adminRankings.find((item) => item.id === id || item.slug === id);
  const icon = adminIcons.find((item) => item.id === id || item.slug === id);
  const shop = adminShops.find((item) => item.id === id || item.slug === id);
  const base = {
    news: {
      title: "NEWS",
      fields: [
        { label: "タイトル", value: news?.title ?? "" },
        { label: "スラッグ", value: news?.slug ?? "" },
        { label: "カテゴリ", type: "select" as const, value: news?.category ?? "ローカルニュース", options: ["ローカルニュース", "イベント", "新店舗", "FUKU ICONS", "グルメ", "カルチャー", "今週のライブ情報", "ライブ後ガイド", "遠征ガイド"] },
        { label: "アイキャッチ画像", type: "file" as const, value: news?.image ?? "" },
        { label: "抜粋", type: "textarea" as const, value: news?.excerpt ?? "" },
        { label: "本文Markdown", type: "textarea" as const, value: news?.body ?? "" },
        { label: "タグ", value: news?.tags?.join(", ") ?? "" },
        { label: "関連MEET", value: "" },
        { label: "関連ランキング", value: "" },
        { label: "関連FUKU ICONS", value: news?.relatedIconIds?.join(", ") ?? "" },
        { label: "公開日", type: "date" as const, value: "" },
        { label: "会場", value: "" },
        { label: "アーティスト名", value: "" },
        { label: "SEOタイトル", value: news?.seoTitle ?? "" },
        { label: "SEO description", type: "textarea" as const, value: news?.seoDescription ?? "" },
        { label: "公開ステータス", type: "select" as const, value: news?.status ?? "draft", options: ["draft", "published", "archived"] },
      ],
    },
    rankings: {
      title: "ランキング",
      fields: [
        { label: "ランキング名", value: ranking?.title ?? "" },
        { label: "スラッグ", value: ranking?.slug ?? "" },
        { label: "カテゴリ", type: "select" as const, value: ranking?.category ?? "DAILY", options: ["FOOD", "PEOPLE", "DAILY", "NIGHT", "AREA"] },
        { label: "説明", type: "textarea" as const, value: ranking?.description ?? "" },
        { label: "集計開始日", type: "date" as const, value: ranking?.periodStart ?? "" },
        { label: "集計終了日", type: "date" as const, value: ranking?.periodEnd ?? "" },
        { label: "サムネ画像", type: "file" as const, value: "" },
        { label: "CTAリンク", value: ranking ? `/ranking/${ranking.slug}` : "" },
        { label: "関連MEET", value: "" },
        { label: "表示順", type: "number" as const, value: "0" },
        { label: "公開ステータス", type: "select" as const, value: ranking?.status ?? "draft", options: ["draft", "published", "private", "archived"] },
      ],
    },
    shops: {
      title: "店舗",
      fields: [
        { label: "店舗名", value: shop?.name ?? "" },
        { label: "スラッグ", value: shop?.slug ?? "" },
        { label: "ジャンル", value: shop?.category ?? "" },
        { label: "エリア", value: shop?.area ?? "" },
        { label: "最寄駅", value: shop?.station ?? "" },
        { label: "住所", value: shop?.address ?? "" },
        { label: "営業時間", value: shop?.openingHours ?? "" },
        { label: "Instagram", value: shop?.instagramUrl ?? "" },
        { label: "Google Maps URL", value: shop?.mapUrl ?? "" },
        { label: "画像", type: "file" as const, value: shop?.images?.[0] ?? "" },
        { label: "説明文", type: "textarea" as const, value: shop?.description ?? "" },
        { label: "AIまとめ", type: "textarea" as const, value: shop?.aiSummary ?? "" },
        { label: "推しポイント", value: shop?.tags?.join(", ") ?? "" },
        { label: "ステータス", type: "select" as const, value: shop?.status ?? "pending", options: ["pending", "published", "private", "archived"] },
      ],
    },
    icons: {
      title: "FUKU ICONS",
      fields: [
        { label: "名前", value: icon?.name ?? "" },
        { label: "スラッグ", value: icon?.slug ?? "" },
        { label: "肩書き", value: icon?.category ?? "" },
        { label: "ジャンル", value: icon?.category ?? "" },
        { label: "エリア", value: icon?.area ?? "" },
        { label: "プロフィール", type: "textarea" as const, value: icon?.profile ?? "" },
        { label: "プロフィール画像", type: "file" as const, value: icon?.image ?? "" },
        { label: "ヒーロー画像", type: "file" as const, value: icon?.image ?? "" },
        { label: "Instagram", value: icon?.instagram ?? "" },
        { label: "ランク", type: "number" as const, value: "1" },
        { label: "注目度", value: "98.7" },
        { label: "投票数", type: "number" as const, value: String(icon?.votes ?? 0) },
        { label: "応援数", type: "number" as const, value: String(icon?.supportCount ?? 0) },
        { label: "表紙候補", type: "select" as const, value: icon?.isCoverCandidate ? "ON" : "OFF", options: ["ON", "OFF"] },
        { label: "ステータス", type: "select" as const, value: icon?.status ?? "pending", options: ["pending", "draft", "published", "private", "archived"] },
      ],
    },
  };

  return base[kind];
}

function getAdminSessionHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem("fuku_admin_session");
  return raw ? { "x-fuku-admin-session": raw } : {};
}

function splitList(value = "") {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function slugify(value: string, fallback: string) {
  return (value || fallback)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function getInitialRankingEntries(kind: EditableKind, id?: string): RankingEntryForm[] {
  if (kind !== "rankings") return [];
  const ranking = adminRankings.find((item) => item.id === id || item.slug === id) ?? adminRankings[0];
  return ranking.entries.map((entry, index) => ({
    id: entry.id,
    slug: slugify(entry.targetId || entry.name, `${ranking.slug}-${index + 1}`),
    name: entry.name,
    area: "",
    description: "",
    tags: "",
    votes: String(entry.votes),
    rank: String(index + 1),
    image: entry.image,
    heroImageUrl: entry.image,
    status: entry.status,
  }));
}

function buildPayload(kind: EditableKind, id: string | undefined, values: Record<string, string>, status: string, entries: RankingEntryForm[]) {
  if (kind === "news") {
    return {
      id: id || slugify(values["スラッグ"], `news-${Date.now()}`),
      slug: values["スラッグ"],
      title: values["タイトル"],
      category: values["カテゴリ"],
      image: values["アイキャッチ画像"],
      excerpt: values["抜粋"],
      body: values["本文Markdown"],
      tags: splitList(values["タグ"]),
      relatedMeetIds: splitList(values["関連MEET"]),
      relatedRankingIds: splitList(values["関連ランキング"]),
      relatedIconIds: splitList(values["関連FUKU ICONS"]),
      publishedAt: values["公開日"],
      venue: values["会場"],
      artistName: values["アーティスト名"],
      isLiveInfo: values["カテゴリ"] === "今週のライブ情報",
      status,
    };
  }
  if (kind === "icons") {
    return {
      id: id || slugify(values["スラッグ"], `icon-${Date.now()}`),
      slug: values["スラッグ"],
      name: values["名前"],
      title: values["肩書き"],
      category: values["ジャンル"] || values["肩書き"],
      area: values["エリア"],
      profile: values["プロフィール"],
      image: values["プロフィール画像"],
      avatarUrl: values["プロフィール画像"],
      heroImageUrl: values["ヒーロー画像"],
      galleryImages: splitList(values["フォトギャラリー画像"]),
      instagram: values["Instagram"],
      rank: Number(values["ランク"] || 99),
      attentionScore: values["注目度"],
      votes: Number(values["投票数"] || 0),
      supportCount: Number(values["応援数"] || 0),
      isCoverCandidate: values["表紙候補"] === "ON",
      interviewText: values["インタビュー本文"],
      favoritePlaces: splitList(values["よく行く店リスト"]),
      relatedMeetIds: splitList(values["関連MEET"]),
      relatedNewsIds: splitList(values["関連NEWS"]),
      status,
    };
  }
  if (kind === "rankings") {
    return {
      id: id || slugify(values["スラッグ"], `ranking-${Date.now()}`),
      slug: values["スラッグ"],
      title: values["ランキング名"],
      category: values["カテゴリ"],
      description: values["説明"],
      periodStart: values["集計開始日"],
      periodEnd: values["集計終了日"],
      image: values["サムネ画像"],
      ctaHref: values["CTAリンク"],
      relatedMeetIds: splitList(values["関連MEET"]),
      sortOrder: Number(values["表示順"] || 0),
      status,
      entries: entries.map((entry) => ({
        ...entry,
        tags: splitList(entry.tags),
        votes: Number(entry.votes || 0),
        rank: Number(entry.rank || 0),
        image: entry.image,
        thumbnailUrl: entry.image,
        heroImageUrl: entry.heroImageUrl,
      })),
    };
  }
  return {
    id: id || slugify(values["スラッグ"], `shop-${Date.now()}`),
    slug: values["スラッグ"],
    name: values["店舗名"],
    category: values["ジャンル"],
    area: values["エリア"],
    station: values["最寄駅"],
    address: values["住所"],
    openingHours: values["営業時間"],
    instagramUrl: values["Instagram"],
    mapUrl: values["Google Maps URL"],
    images: values["画像"] ? [values["画像"]] : [],
    description: values["説明文"],
    aiSummary: values["AIまとめ"],
    tags: splitList(values["推しポイント"]),
    status,
  };
}

function RankingEntriesEditor({ entries, onChange }: { entries: RankingEntryForm[]; onChange: (entries: RankingEntryForm[]) => void }) {
  function update(index: number, patch: Partial<RankingEntryForm>) {
    onChange(entries.map((entry, currentIndex) => currentIndex === index ? { ...entry, ...patch } : entry));
  }
  function addEntry() {
    onChange([...entries, { slug: `entry-${entries.length + 1}`, name: "", area: "", description: "", tags: "", votes: "0", rank: String(entries.length + 1), image: "", heroImageUrl: "", status: "published" }]);
  }
  return (
    <section className="rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-black text-fuku-black">ランキング候補</h3>
          <p className="mt-1 text-[11px] font-bold text-fuku-gray">候補サムネと詳細メイン画像をSupabaseへ保存します。</p>
        </div>
        <button type="button" onClick={addEntry} className="rounded-full bg-fuku-black px-4 py-2 text-[11px] font-black text-white">候補追加</button>
      </div>
      <div className="mt-4 space-y-4">
        {entries.map((entry, index) => (
          <article key={`${entry.id ?? "entry"}-${index}`} className="space-y-3 rounded-[12px] border border-fuku-border bg-white p-3">
            <div className="grid gap-3 md:grid-cols-3">
              <AdminFormField label="順位" type="number" value={entry.rank} onChange={(value) => update(index, { rank: value })} />
              <AdminFormField label="候補名" value={entry.name} onChange={(value) => update(index, { name: value })} />
              <AdminFormField label="候補スラッグ" value={entry.slug} onChange={(value) => update(index, { slug: value })} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <AdminImagePicker label="候補サムネ画像" category="ranking" value={entry.image} onChange={(url) => update(index, { image: url })} />
              <AdminImagePicker label="候補詳細メイン画像" category="ranking" value={entry.heroImageUrl} onChange={(url) => update(index, { heroImageUrl: url })} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <AdminFormField label="エリア" value={entry.area} onChange={(value) => update(index, { area: value })} />
              <AdminFormField label="投票数" type="number" value={entry.votes} onChange={(value) => update(index, { votes: value })} />
              <AdminFormField label="ステータス" type="select" value={entry.status} onChange={(value) => update(index, { status: value })} options={["published", "draft", "private", "archived"]} />
            </div>
            <AdminFormField label="説明文" type="textarea" value={entry.description} onChange={(value) => update(index, { description: value })} />
            <AdminFormField label="タグ（カンマ区切り）" value={entry.tags} onChange={(value) => update(index, { tags: value })} />
            <button type="button" onClick={() => onChange(entries.filter((_, currentIndex) => currentIndex !== index))} className="rounded-full border border-fuku-border px-4 py-2 text-[11px] font-black text-fuku-red">
              候補をarchived扱いで外す
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function IconsExtraEditor({ values, onChange }: { values: Record<string, string>; onChange: (values: Record<string, string>) => void }) {
  const set = (key: string, value: string) => onChange({ ...values, [key]: value });
  return (
    <section className="space-y-3 rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-4">
      <h3 className="text-[16px] font-black text-fuku-black">プロフィール詳細</h3>
      <AdminImagePicker label="フォトギャラリー画像" category="icons" value={values["フォトギャラリー画像"] ?? ""} onChange={(url) => set("フォトギャラリー画像", [...splitList(values["フォトギャラリー画像"]), url].join(", "))} />
      <AdminFormField label="インタビュー本文" type="textarea" value={values["インタビュー本文"] ?? ""} onChange={(value) => set("インタビュー本文", value)} />
      <AdminFormField label="よく行く店リスト" value={values["よく行く店リスト"] ?? ""} onChange={(value) => set("よく行く店リスト", value)} />
      <AdminFormField label="関連MEET" value={values["関連MEET"] ?? ""} onChange={(value) => set("関連MEET", value)} />
      <AdminFormField label="関連NEWS" value={values["関連NEWS"] ?? ""} onChange={(value) => set("関連NEWS", value)} />
    </section>
  );
}

function NewsExtraEditor({ values, onChange }: { values: Record<string, string>; onChange: (values: Record<string, string>) => void }) {
  const set = (key: string, value: string) => onChange({ ...values, [key]: value });
  return (
    <section className="space-y-3 rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-4">
      <h3 className="text-[16px] font-black text-fuku-black">ライブ情報 / MEET連携</h3>
      <p className="text-[11px] font-bold text-fuku-gray">カテゴリを「今週のライブ情報」にすると、記事詳細で関連MEET CTAを表示するためのデータとして保存します。</p>
      <AdminFormField label="関連MEET" value={values["関連MEET"] ?? ""} onChange={(value) => set("関連MEET", value)} />
      <AdminFormField label="関連ランキング" value={values["関連ランキング"] ?? ""} onChange={(value) => set("関連ランキング", value)} />
      <AdminFormField label="会場" value={values["会場"] ?? ""} onChange={(value) => set("会場", value)} />
      <AdminFormField label="アーティスト名" value={values["アーティスト名"] ?? ""} onChange={(value) => set("アーティスト名", value)} />
    </section>
  );
}

function MediaPanel() {
  const [mediaImage, setMediaImage] = useState("");
  return (
    <div className="mb-5 grid gap-5 lg:grid-cols-[360px_1fr]">
      <AdminCard title="画像アップロードUI">
        <div className="mt-4">
          <AdminImagePicker value={mediaImage} onChange={setMediaImage} category="other" label="共通メディア画像" />
        </div>
      </AdminCard>
      <AdminCard title="画像一覧">
        <div className="mt-4 grid grid-cols-4 gap-3">
          {["hero", "news", "shop", "icon"].map((item) => (
            <div key={item} className="h-24 rounded-[10px] bg-[linear-gradient(135deg,#f2eee8,#fff1f1)] p-2 text-[11px] font-black">
              {item}
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function HomeEditorPanel() {
  const sections = ["FV画像 / タイトル / CTA", "FUKU ICONS表示人物", "HOMEランキング表示テーマ", "WEEKEND GUIDE表示カテゴリ", "NEW IN FUKUOKAカード", "MAGAZINEバナー", "PICK UP CONTENTS"];
  return (
    <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((section) => (
        <AdminCard key={section} title={section} caption="保存ボタンと公開サイトプレビュー導線を想定">
          <div className="mt-4 h-24 rounded-[10px] bg-fuku-light" />
          <a href="/" className="mt-4 inline-flex min-h-[36px] items-center rounded-full border border-fuku-border px-4 text-[12px] font-black">
            公開サイトで見る
          </a>
        </AdminCard>
      ))}
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="mb-5 grid gap-4 lg:grid-cols-2">
      {["サイト名", "サイト説明", "HOME FV", "Instagram", "TikTok", "X", "メールマガジン設定", "メンテナンス表示", "お問い合わせ先"].map((field) => (
        <AdminFormField key={field} label={field} />
      ))}
    </div>
  );
}

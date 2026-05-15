"use client";

import { Edit, Eye, Plus } from "lucide-react";
import { useState } from "react";
import { addAdminLog, adminForms, adminIcons, adminNews, adminRankings, adminShops, adminUsers } from "@/lib/adminData";
import type { AdminStatus } from "@/types/admin";
import AdminCard from "./AdminCard";
import AdminFormField from "./AdminFormField";
import AdminLayout from "./AdminLayout";
import AdminStatusBadge from "./AdminStatusBadge";
import AdminTable from "./AdminTable";
import { useToast } from "../Toast";

type ResourceKind = "news" | "rankings" | "shops" | "icons" | "events" | "magazine" | "forms" | "users" | "media" | "home" | "settings" | "logs";
type ResourceRow = { title: string; meta: string; status: AdminStatus; editHref?: string };
type ResourceConfig = { title: string; eyebrow: string; description: string; rows: ResourceRow[]; newHref?: string };

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

export function AdminEditPage({ kind, mode, id }: { kind: "news" | "rankings" | "shops" | "icons"; mode: "new" | "edit"; id?: string }) {
  const config = getEditConfig(kind, id);
  const { showToast, ToastViewport } = useToast();
  const [status, setStatus] = useState("draft");

  function save(label: string) {
    addAdminLog(label, kind, id ?? "new");
    showToast(label);
  }

  return (
    <AdminLayout title={`${config.title} ${mode === "new" ? "新規作成" : "編集"}`}>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <form className="space-y-4 rounded-[16px] border border-fuku-border bg-white p-5" onSubmit={(event) => event.preventDefault()}>
          {config.fields.map((field) => (
            <AdminFormField key={field.label} {...field} />
          ))}
          <div className="grid gap-3 border-t border-fuku-border pt-5 sm:grid-cols-3">
            <button type="button" onClick={() => save("下書き保存しました")} className="min-h-[44px] rounded-full border border-fuku-border text-[13px] font-black">
              下書き保存
            </button>
            <button type="button" onClick={() => { setStatus("published"); save("公開しました"); }} className="min-h-[44px] rounded-full bg-fuku-red text-[13px] font-black text-white">
              公開する
            </button>
            <button type="button" onClick={() => { setStatus("private"); save("非公開にしました"); }} className="min-h-[44px] rounded-full bg-fuku-black text-[13px] font-black text-white">
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

function getEditConfig(kind: "news" | "rankings" | "shops" | "icons", id?: string) {
  const base = {
    news: {
      title: "NEWS",
      fields: [
        { label: "タイトル", value: id ? adminNews.find((item) => item.id === id)?.title : "" },
        { label: "スラッグ" },
        { label: "カテゴリ", type: "select" as const, options: ["ローカルニュース", "イベント", "新店舗", "FUKU ICONS", "グルメ", "カルチャー"] },
        { label: "アイキャッチ画像", type: "file" as const },
        { label: "抜粋", type: "textarea" as const },
        { label: "本文Markdown", type: "textarea" as const },
        { label: "タグ" },
        { label: "関連店舗" },
        { label: "関連FUKU ICONS" },
        { label: "SEOタイトル" },
        { label: "SEO description", type: "textarea" as const },
        { label: "公開ステータス", type: "select" as const, options: ["draft", "published", "private", "archived"] },
      ],
    },
    rankings: {
      title: "ランキング",
      fields: [
        { label: "ランキング名" },
        { label: "スラッグ" },
        { label: "カテゴリ", type: "select" as const, options: ["FOOD", "PEOPLE", "DAILY", "NIGHT", "AREA"] },
        { label: "説明", type: "textarea" as const },
        { label: "集計開始日", type: "date" as const },
        { label: "集計終了日", type: "date" as const },
        { label: "候補追加", type: "textarea" as const },
        { label: "公開ステータス", type: "select" as const, options: ["draft", "published", "private", "archived"] },
      ],
    },
    shops: {
      title: "店舗",
      fields: [
        { label: "店舗名" },
        { label: "スラッグ" },
        { label: "ジャンル" },
        { label: "エリア" },
        { label: "最寄駅" },
        { label: "住所" },
        { label: "営業時間" },
        { label: "Instagram" },
        { label: "Google Maps URL" },
        { label: "画像", type: "file" as const },
        { label: "説明文", type: "textarea" as const },
        { label: "AIまとめ", type: "textarea" as const },
        { label: "推しポイント" },
        { label: "ステータス", type: "select" as const, options: ["pending", "published", "private", "archived"] },
      ],
    },
    icons: {
      title: "FUKU ICONS",
      fields: [
        { label: "名前" },
        { label: "スラッグ" },
        { label: "ジャンル" },
        { label: "エリア" },
        { label: "プロフィール", type: "textarea" as const },
        { label: "画像", type: "file" as const },
        { label: "Instagram" },
        { label: "投票数", type: "number" as const },
        { label: "応援数", type: "number" as const },
        { label: "表紙候補", type: "select" as const, options: ["ON", "OFF"] },
        { label: "ステータス", type: "select" as const, options: ["pending", "published", "private", "archived"] },
      ],
    },
  };

  return base[kind];
}

function MediaPanel() {
  return (
    <div className="mb-5 grid gap-5 lg:grid-cols-[360px_1fr]">
      <AdminCard title="画像アップロードUI">
        <div className="mt-4 rounded-[14px] border border-dashed border-fuku-border bg-fuku-light p-8 text-center text-[13px] font-bold text-fuku-gray">
          jpg / png / webp のみ。SVG禁止。5MB以下。
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

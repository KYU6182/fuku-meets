"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminFormField from "./AdminFormField";
import { defaultCommunities, getAdminCommunitiesAsync, saveAdminCommunityAsync } from "@/lib/communityMeet";
import type { CommunityMeet } from "@/types/communityMeet";

type CommunityFormState = Pick<
  CommunityMeet,
  | "id"
  | "slug"
  | "title"
  | "category"
  | "image"
  | "area"
  | "venueName"
  | "date"
  | "startTime"
  | "endTime"
  | "description"
  | "capacity"
  | "participantCount"
  | "maleRatio"
  | "femaleRatio"
  | "hostName"
  | "status"
> & {
  tagsText: string;
  noticesText: string;
  isSoloFriendly: boolean;
  isWomenOnly: boolean;
  isBeginnerFriendly: boolean;
  isVerifiedOnly: boolean;
};

const base = defaultCommunities[0];

function toFormState(item?: CommunityMeet): CommunityFormState {
  const source = item ?? base;
  const nextId = item?.id ?? `meet-${Date.now()}`;
  return {
    id: nextId,
    slug: item?.slug ?? "",
    title: item?.title ?? "",
    category: source.category,
    image: source.image,
    area: source.area,
    venueName: source.venueName,
    date: source.date,
    startTime: source.startTime,
    endTime: source.endTime,
    description: item?.description ?? "",
    capacity: source.capacity,
    participantCount: item?.participantCount ?? 0,
    maleRatio: source.maleRatio,
    femaleRatio: source.femaleRatio,
    hostName: source.hostName,
    status: item?.status ?? "draft",
    tagsText: source.tags.join(" / "),
    noticesText: source.notices?.join("\n") ?? "",
    isSoloFriendly: source.isSoloFriendly,
    isWomenOnly: source.isWomenOnly,
    isBeginnerFriendly: source.isBeginnerFriendly,
    isVerifiedOnly: source.isVerifiedOnly,
  };
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_/]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCommunityForm({ mode }: { mode: "new" | "edit" }) {
  const [form, setForm] = useState<CommunityFormState>(() => toFormState());
  const [statusText, setStatusText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit") return;
    const id = window.location.pathname.split("/").filter(Boolean).at(-2);
    if (!id) return;
    let mounted = true;
    void getAdminCommunitiesAsync().then((items) => {
      if (!mounted) return;
      const current = items.find((item) => item.id === id || item.slug === id);
      if (current) setForm(toFormState(current));
    });
    return () => {
      mounted = false;
    };
  }, [mode]);

  const previewSlug = useMemo(() => form.slug || slugify(form.title) || form.id, [form.id, form.slug, form.title]);

  function setField<K extends keyof CommunityFormState>(key: K, value: CommunityFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setSaving(true);
    setStatusText("");
    try {
      const now = new Date().toISOString();
      const tags = form.tagsText.split(/[、,\n/]/).map((tag) => tag.trim()).filter(Boolean);
      const notices = form.noticesText.split("\n").map((notice) => notice.trim()).filter(Boolean);
      const community: Partial<CommunityMeet> = {
        ...base,
        ...form,
        slug: previewSlug,
        tags,
        notices,
        fee: 800,
        isSoloFriendly: form.isSoloFriendly,
        isWomenOnly: form.isWomenOnly,
        isBeginnerFriendly: form.isBeginnerFriendly,
        isVerifiedOnly: form.isVerifiedOnly,
        updatedAt: now,
        createdAt: mode === "new" ? now : undefined,
      };
      await saveAdminCommunityAsync(community);
      setStatusText("保存しました。公開ステータスなら /meet に反映されます。");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title={`MEET${mode === "new" ? "新規作成" : "編集"}`}>
      <form className="grid gap-4 rounded-[16px] border border-fuku-border bg-white p-5" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminFormField label="タイトル" value={form.title} onChange={(value) => setField("title", value)} placeholder="クリープハイプ飲み会" />
          <AdminFormField label="スラッグ" value={form.slug} onChange={(value) => setField("slug", slugify(value))} placeholder={previewSlug} />
          <AdminFormField label="カテゴリ" value={form.category} onChange={(value) => setField("category", value)} placeholder="音楽・ライブ" />
          <AdminFormField label="画像URL" value={form.image} onChange={(value) => setField("image", value)} placeholder="/images/meet/creep-live.jpg" />
          <AdminFormField label="エリア" value={form.area} onChange={(value) => setField("area", value)} placeholder="天神" />
          <AdminFormField label="集合場所" value={form.venueName} onChange={(value) => setField("venueName", value)} placeholder="参加者にのみ共有" />
          <AdminFormField label="開催日" type="date" value={form.date} onChange={(value) => setField("date", value)} />
          <AdminFormField label="開始時間" value={form.startTime} onChange={(value) => setField("startTime", value)} placeholder="21:30" />
          <AdminFormField label="終了時間" value={form.endTime} onChange={(value) => setField("endTime", value)} placeholder="24:30" />
          <AdminFormField label="定員" type="number" value={String(form.capacity)} onChange={(value) => setField("capacity", Number(value))} />
          <AdminFormField label="参加予定人数" type="number" value={String(form.participantCount)} onChange={(value) => setField("participantCount", Number(value))} />
          <AdminFormField label="男性比率" type="number" value={String(form.maleRatio)} onChange={(value) => setField("maleRatio", Number(value))} />
          <AdminFormField label="女性比率" type="number" value={String(form.femaleRatio)} onChange={(value) => setField("femaleRatio", Number(value))} />
          <AdminFormField label="幹事名" value={form.hostName} onChange={(value) => setField("hostName", value)} placeholder="ナオト" />
          <AdminFormField label="ステータス" type="select" value={form.status} onChange={(value) => setField("status", value as CommunityMeet["status"])} options={["draft", "published", "closed", "archived"]} />
        </div>

        <AdminFormField label="説明文" type="textarea" value={form.description} onChange={(value) => setField("description", value)} placeholder="このMEETの説明" />
        <AdminFormField label="タグ（/ 区切り）" value={form.tagsText} onChange={(value) => setField("tagsText", value)} placeholder="一人参加OK / 男女ペアOK / 20代中心" />
        <AdminFormField label="注意事項・キャンセル規定（改行区切り）" type="textarea" value={form.noticesText} onChange={(value) => setField("noticesText", value)} />

        <div className="grid gap-2 rounded-[12px] border border-fuku-border p-4 text-[13px] font-bold sm:grid-cols-2">
          {[
            ["isSoloFriendly", "一人参加OK"],
            ["isWomenOnly", "女性限定"],
            ["isBeginnerFriendly", "初心者歓迎"],
            ["isVerifiedOnly", "本人確認推奨"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form[key as keyof CommunityFormState])}
                onChange={(event) => setField(key as keyof CommunityFormState, event.target.checked as never)}
                className="h-4 w-4 accent-fuku-red"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="rounded-[12px] bg-[#fff1f1] p-4 text-[12px] font-bold leading-relaxed text-fuku-black">
          参加費は初期検証のため800円固定です。本番ではSupabase Authの管理者ロール、RLS、操作ログ、Storageアップロード検証を必ず通します。
        </div>
        {statusText ? <p className="rounded-[12px] bg-fuku-light p-3 text-[12px] font-black text-fuku-black">{statusText}</p> : null}
        <button type="button" onClick={() => void submit()} disabled={saving} className="min-h-[46px] rounded-full bg-fuku-red text-[13px] font-black text-white disabled:opacity-60">
          {saving ? "保存中..." : "保存する"}
        </button>
      </form>
    </AdminLayout>
  );
}

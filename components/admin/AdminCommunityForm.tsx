"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminFormField from "./AdminFormField";
import AdminImagePicker from "./AdminImagePicker";
import { defaultCommunities, getAdminCommunitiesAsync, homeMeetCategories, saveAdminCommunityAsync } from "@/lib/communityMeet";
import type { CommunityMeet } from "@/types/communityMeet";

type CommunityFormState = Pick<
  CommunityMeet,
  | "id"
  | "slug"
  | "title"
  | "category"
  | "image"
  | "heroImage"
  | "area"
  | "venueName"
  | "detailVenueName"
  | "publicAreaLabel"
  | "participantVenueName"
  | "participantAddress"
  | "participantMemo"
  | "participantNotes"
  | "date"
  | "startTime"
  | "endTime"
  | "description"
  | "fee"
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
  isWomenFriendly: boolean;
  isAge20Only: boolean;
  isBeginnerFriendly: boolean;
  isVerifiedOnly: boolean;
  artistName: string;
  artistSlug: string;
  splitBillRecommended: boolean;
  identityVerifiedRequired: boolean;
  locationHiddenUntilJoined: boolean;
  firstTimerRate: number;
  localRate: number;
  travelerRate: number;
  maleCount: number;
  femaleCount: number;
  participantProfilesText: string;
  faqsText: string;
  canLeaveEarly: boolean;
  canJoinLate: boolean;
  nonAlcoholOk: boolean;
  firstTimerSupport: boolean;
  privateVenueName: string;
  privateAddress: string;
  privateGoogleMapUrl: string;
  privateReservationName: string;
  privateMeetingMemo: string;
  privateHostContactMemo: string;
  cancelUntil: string;
  waitlistEnabled: boolean;
  autoPromoteWaitlist: boolean;
  relatedMeetTabsText: string;
  homeCategoryIds: string[];
  homePickup: boolean;
  homeCategorySortOrder: number;
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
    heroImage: source.heroImage ?? source.image,
    area: source.area,
    venueName: source.venueName,
    detailVenueName: source.detailVenueName ?? "",
    publicAreaLabel: source.publicAreaLabel ?? source.venueName,
    participantVenueName: source.participantVenueName ?? source.detailVenueName ?? "",
    participantAddress: source.participantAddress ?? "",
    participantMemo: source.participantMemo ?? "",
    participantNotes: source.participantNotes ?? source.notices?.join("\n") ?? "",
    date: source.date,
    startTime: source.startTime,
    endTime: source.endTime,
    description: item?.description ?? "",
    fee: source.fee ?? 800,
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
    isWomenFriendly: source.isWomenFriendly ?? !source.isWomenOnly,
    isAge20Only: source.isAge20Only ?? false,
    isBeginnerFriendly: source.isBeginnerFriendly,
    isVerifiedOnly: source.isVerifiedOnly,
    artistName: source.artist?.name ?? "",
    artistSlug: source.artist?.slug ?? "",
    splitBillRecommended: source.safety?.splitBillRecommended ?? false,
    identityVerifiedRequired: source.safety?.identityVerifiedRequired ?? source.isVerifiedOnly,
    locationHiddenUntilJoined: source.safety?.locationHiddenUntilJoined ?? source.venueVisibility === "participants_only",
    firstTimerRate: source.safety?.firstTimerRate ?? 0,
    localRate: source.safety?.localRate ?? 0,
    travelerRate: source.safety?.travelerRate ?? 0,
    maleCount: source.safety?.maleCount ?? Math.round(((item?.participantCount ?? source.participantCount) * source.maleRatio) / 100),
    femaleCount: source.safety?.femaleCount ?? Math.round(((item?.participantCount ?? source.participantCount) * source.femaleRatio) / 100),
    participantProfilesText: formatParticipantProfiles(source.participantProfiles),
    faqsText: formatFaqs(source.faqs),
    canLeaveEarly: source.joinOptions?.canLeaveEarly ?? false,
    canJoinLate: source.joinOptions?.canJoinLate ?? false,
    nonAlcoholOk: source.joinOptions?.nonAlcoholOk ?? false,
    firstTimerSupport: source.joinOptions?.firstTimerSupport ?? source.isBeginnerFriendly,
    privateVenueName: source.privateLocation?.venueName ?? source.participantVenueName ?? "",
    privateAddress: source.privateLocation?.address ?? source.participantAddress ?? "",
    privateGoogleMapUrl: source.privateLocation?.googleMapUrl ?? "",
    privateReservationName: source.privateLocation?.reservationName ?? "",
    privateMeetingMemo: source.privateLocation?.meetingMemo ?? source.participantMemo ?? "",
    privateHostContactMemo: source.privateLocation?.hostContactMemo ?? "",
    cancelUntil: source.cancelPolicy?.cancelUntil ?? "",
    waitlistEnabled: source.cancelPolicy?.waitlistEnabled ?? true,
    autoPromoteWaitlist: source.cancelPolicy?.autoPromoteWaitlist ?? false,
    relatedMeetTabsText: formatRelatedMeetTabs(source.relatedMeetTabs),
    homeCategoryIds: source.homeCategoryIds ?? [],
    homePickup: source.homePickup ?? false,
    homeCategorySortOrder: source.homeCategorySortOrder ?? 0,
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

type ParticipantProfileInput = NonNullable<CommunityMeet["participantProfiles"]>[number];
type MeetFaqInput = NonNullable<CommunityMeet["faqs"]>[number];
type RelatedMeetTabInput = NonNullable<CommunityMeet["relatedMeetTabs"]>[number];

function formatParticipantProfiles(items: CommunityMeet["participantProfiles"] = []) {
  return items
    .map((item) => [item.genderLabel, item.ageLabel, item.areaLabel, item.fanHistory ?? "", item.favoriteSong ?? "", item.comment ?? ""].join(" | "))
    .join("\n");
}

function parseParticipantProfiles(text: string): ParticipantProfileInput[] {
  const profiles: ParticipantProfileInput[] = [];
  text.split("\n").forEach((line, index) => {
    const [genderLabel, ageLabel, areaLabel, fanHistory, favoriteSong, comment] = line.split("|").map((item) => item.trim());
    if (!genderLabel || !ageLabel || !areaLabel) return;
    profiles.push({
      id: `profile-${Date.now()}-${index}`,
      genderLabel,
      ageLabel,
      areaLabel,
      fanHistory,
      favoriteSong,
      comment,
    });
  });
  return profiles;
}

function formatFaqs(items: CommunityMeet["faqs"] = []) {
  return [...items]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => [item.question, item.answer].join(" | "))
    .join("\n");
}

function parseFaqs(text: string): MeetFaqInput[] {
  const faqs: MeetFaqInput[] = [];
  text.split("\n").forEach((line, index) => {
    const [question, answer] = line.split("|").map((item) => item.trim());
    if (!question || !answer) return;
    faqs.push({
      id: `faq-${Date.now()}-${index}`,
      question,
      answer,
      order: index + 1,
    });
  });
  return faqs;
}

function formatRelatedMeetTabs(items: CommunityMeet["relatedMeetTabs"] = []) {
  return items.map((item) => [item.label, item.type, item.meetSlugs.join(",")].join(" | ")).join("\n");
}

function parseRelatedMeetTabs(text: string): RelatedMeetTabInput[] {
  const tabs: RelatedMeetTabInput[] = [];
  text.split("\n").forEach((line) => {
    const [label, type, slugs] = line.split("|").map((item) => item.trim());
    if (!label || !type) return;
    tabs.push({
      label,
      type,
      meetSlugs: (slugs ?? "").split(",").map((slug) => slug.trim()).filter(Boolean),
    });
  });
  return tabs;
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
      const participantProfiles = parseParticipantProfiles(form.participantProfilesText);
      const faqs = parseFaqs(form.faqsText);
      const relatedMeetTabs = parseRelatedMeetTabs(form.relatedMeetTabsText);
      const community: Partial<CommunityMeet> = {
        ...base,
        ...form,
        slug: previewSlug,
        tags,
        notices,
        fee: Number(form.fee || 800),
        isSoloFriendly: form.isSoloFriendly,
        isWomenOnly: form.isWomenOnly,
        isWomenFriendly: form.isWomenFriendly,
        isAge20Only: form.isAge20Only,
        isBeginnerFriendly: form.isBeginnerFriendly,
        isVerifiedOnly: form.isVerifiedOnly,
        safety: {
          womenOnly: form.isWomenOnly,
          soloOk: form.isSoloFriendly,
          splitBillRecommended: form.splitBillRecommended,
          identityVerifiedRequired: form.identityVerifiedRequired,
          locationHiddenUntilJoined: form.locationHiddenUntilJoined,
          firstTimerRate: Number(form.firstTimerRate || 0),
          localRate: Number(form.localRate || 0),
          travelerRate: Number(form.travelerRate || 0),
          maleCount: Number(form.maleCount || 0),
          femaleCount: Number(form.femaleCount || 0),
        },
        artist: {
          name: form.artistName,
          slug: form.artistSlug || slugify(form.artistName),
        },
        participantProfiles,
        faqs,
        joinOptions: {
          canLeaveEarly: form.canLeaveEarly,
          canJoinLate: form.canJoinLate,
          nonAlcoholOk: form.nonAlcoholOk,
          firstTimerSupport: form.firstTimerSupport,
        },
        privateLocation: {
          venueName: form.privateVenueName,
          address: form.privateAddress,
          googleMapUrl: form.privateGoogleMapUrl,
          reservationName: form.privateReservationName,
          meetingMemo: form.privateMeetingMemo,
          hostContactMemo: form.privateHostContactMemo,
        },
        cancelPolicy: {
          cancelUntil: form.cancelUntil,
          waitlistEnabled: form.waitlistEnabled,
          autoPromoteWaitlist: form.autoPromoteWaitlist,
        },
        relatedMeetTabs,
        homeCategoryIds: form.homeCategoryIds,
        homePickup: form.homePickup,
        homeCategorySortOrder: Number(form.homeCategorySortOrder || 0),
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
          <AdminFormField label="アーティスト名" value={form.artistName} onChange={(value) => setField("artistName", value)} placeholder="クリープハイプ" />
          <AdminFormField label="アーティストslug" value={form.artistSlug} onChange={(value) => setField("artistSlug", slugify(value))} placeholder="creep-hype" />
          <AdminFormField label="エリア" value={form.area} onChange={(value) => setField("area", value)} placeholder="天神" />
          <AdminFormField label="公開用エリア" value={form.publicAreaLabel ?? ""} onChange={(value) => setField("publicAreaLabel", value)} placeholder="天神エリア / Zepp Fukuoka周辺" />
          <AdminFormField label="公開用集合エリア" value={form.venueName} onChange={(value) => setField("venueName", value)} placeholder="参加者にのみ共有" />
          <AdminFormField label="参加後に表示する店舗名" value={form.participantVenueName ?? ""} onChange={(value) => setField("participantVenueName", value)} placeholder="店舗名（参加確定者のみ）" />
          <AdminFormField label="参加後に表示する住所" value={form.participantAddress ?? ""} onChange={(value) => setField("participantAddress", value)} placeholder="住所（参加確定者のみ）" />
          <AdminFormField label="参加後に表示する集合メモ" value={form.participantMemo ?? ""} onChange={(value) => setField("participantMemo", value)} placeholder="予約名・集合目印など" />
          <AdminFormField label="参加後に表示する注意事項" value={form.participantNotes ?? ""} onChange={(value) => setField("participantNotes", value)} placeholder="遅刻時の連絡、入店方法など" />
          <AdminFormField label="参加後 Google Map URL" value={form.privateGoogleMapUrl} onChange={(value) => setField("privateGoogleMapUrl", value)} placeholder="https://maps.google.com/..." />
          <AdminFormField label="参加後 予約名" value={form.privateReservationName} onChange={(value) => setField("privateReservationName", value)} placeholder="予約名" />
          <AdminFormField label="幹事への連絡方法" value={form.privateHostContactMemo} onChange={(value) => setField("privateHostContactMemo", value)} placeholder="参加後チャットで案内します" />
          <AdminFormField label="旧 詳細場所" value={form.detailVenueName ?? ""} onChange={(value) => setField("detailVenueName", value)} placeholder="互換用" />
          <AdminFormField label="開催日" type="date" value={form.date} onChange={(value) => setField("date", value)} />
          <AdminFormField label="開始時間" value={form.startTime} onChange={(value) => setField("startTime", value)} placeholder="21:30" />
          <AdminFormField label="終了時間" value={form.endTime} onChange={(value) => setField("endTime", value)} placeholder="24:30" />
          <AdminFormField label="参加費" type="number" value={String(form.fee ?? 800)} onChange={(value) => setField("fee", Number(value))} />
          <AdminFormField label="定員" type="number" value={String(form.capacity)} onChange={(value) => setField("capacity", Number(value))} />
          <AdminFormField label="参加予定人数" type="number" value={String(form.participantCount)} onChange={(value) => setField("participantCount", Number(value))} />
          <AdminFormField label="男性比率" type="number" value={String(form.maleRatio)} onChange={(value) => setField("maleRatio", Number(value))} />
          <AdminFormField label="女性比率" type="number" value={String(form.femaleRatio)} onChange={(value) => setField("femaleRatio", Number(value))} />
          <AdminFormField label="男性人数" type="number" value={String(form.maleCount)} onChange={(value) => setField("maleCount", Number(value))} />
          <AdminFormField label="女性人数" type="number" value={String(form.femaleCount)} onChange={(value) => setField("femaleCount", Number(value))} />
          <AdminFormField label="初参加・一人参加率" type="number" value={String(form.firstTimerRate)} onChange={(value) => setField("firstTimerRate", Number(value))} />
          <AdminFormField label="地元民比率" type="number" value={String(form.localRate)} onChange={(value) => setField("localRate", Number(value))} />
          <AdminFormField label="遠征組比率" type="number" value={String(form.travelerRate)} onChange={(value) => setField("travelerRate", Number(value))} />
          <AdminFormField label="幹事名" value={form.hostName} onChange={(value) => setField("hostName", value)} placeholder="ナオト" />
          <AdminFormField label="ステータス" type="select" value={form.status} onChange={(value) => setField("status", value as CommunityMeet["status"])} options={["draft", "published", "closed", "archived"]} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <AdminImagePicker
            label="サムネ画像"
            category="shop"
            value={form.image}
            onChange={(url) => setField("image", url)}
            helpText="HOME / TONIGHT IN FUKUOKA、/meet 一覧カードに表示されます。"
          />
          <AdminImagePicker
            label="詳細ページメイン画像"
            category="shop"
            value={form.heroImage ?? form.image}
            onChange={(url) => setField("heroImage", url)}
            helpText="/meet/[slug] のメインビジュアルに表示されます。"
          />
        </div>

        <AdminFormField label="説明文" type="textarea" value={form.description} onChange={(value) => setField("description", value)} placeholder="このMEETの説明" />
        <AdminFormField label="タグ（/ 区切り）" value={form.tagsText} onChange={(value) => setField("tagsText", value)} placeholder="一人参加OK / 男女ペアOK / 20代中心" />
        <AdminFormField label="注意事項・キャンセル規定（改行区切り）" type="textarea" value={form.noticesText} onChange={(value) => setField("noticesText", value)} />
        <div className="grid gap-3 rounded-[14px] border border-fuku-border bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-black text-fuku-black">HOMEカテゴリ表示</p>
              <p className="mt-1 text-[11px] font-bold text-fuku-gray">HOMEの「カテゴリで探す」と /meet の表示に使います。</p>
            </div>
            <label className="flex items-center gap-2 text-[12px] font-black text-fuku-black">
              <input
                type="checkbox"
                checked={form.homePickup}
                onChange={(event) => setField("homePickup", event.target.checked)}
                className="h-4 w-4 accent-fuku-red"
              />
              ピックアップ優先
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {homeMeetCategories.map((category) => {
              const checked = form.homeCategoryIds.includes(category.id);
              return (
                <label key={category.id} className={`rounded-[12px] border p-3 text-[12px] font-black ${checked ? "border-fuku-red bg-[#fff1f1] text-fuku-red" : "border-fuku-border text-fuku-black"}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...form.homeCategoryIds, category.id]
                        : form.homeCategoryIds.filter((id) => id !== category.id);
                      setField("homeCategoryIds", next);
                    }}
                    className="mr-2 h-4 w-4 accent-fuku-red"
                  />
                  {category.label}
                  <span className="mt-1 block text-[11px] font-bold text-fuku-gray">{category.subtitle}</span>
                </label>
              );
            })}
          </div>
          <AdminFormField
            label="カテゴリ内の表示順"
            type="number"
            value={String(form.homeCategorySortOrder)}
            onChange={(value) => setField("homeCategorySortOrder", Number(value))}
            placeholder="0"
          />
        </div>
        <AdminFormField
          label="参加者プロフィール（1行: 性別 | 年齢層 | 居住地/遠征元 | ファン歴 | 推し曲 | 一言）"
          type="textarea"
          value={form.participantProfilesText}
          onChange={(value) => setField("participantProfilesText", value)}
        />
        <AdminFormField
          label="FAQ（1行: 質問 | 回答）"
          type="textarea"
          value={form.faqsText}
          onChange={(value) => setField("faqsText", value)}
        />
        <AdminFormField
          label="関連MEETタブ（1行: ラベル | type | slug1,slug2）"
          type="textarea"
          value={form.relatedMeetTabsText}
          onChange={(value) => setField("relatedMeetTabsText", value)}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminFormField label="キャンセル期限" value={form.cancelUntil} onChange={(value) => setField("cancelUntil", value)} placeholder="開催当日18:00まで" />
          <AdminFormField label="参加後 店舗名（privateLocation）" value={form.privateVenueName} onChange={(value) => setField("privateVenueName", value)} placeholder="参加確定後に共有" />
          <AdminFormField label="参加後 住所（privateLocation）" value={form.privateAddress} onChange={(value) => setField("privateAddress", value)} placeholder="参加確定後に共有" />
          <AdminFormField label="参加後 集合メモ（privateLocation）" value={form.privateMeetingMemo} onChange={(value) => setField("privateMeetingMemo", value)} placeholder="集合メモ" />
        </div>

        <div className="grid gap-2 rounded-[12px] border border-fuku-border p-4 text-[13px] font-bold sm:grid-cols-2">
          {[
            ["isSoloFriendly", "一人参加OK"],
            ["isWomenFriendly", "女性参加あり"],
            ["isWomenOnly", "女性限定"],
            ["isAge20Only", "20歳以上限定"],
            ["isBeginnerFriendly", "初心者歓迎"],
            ["isVerifiedOnly", "本人確認推奨"],
            ["splitBillRecommended", "個別会計推奨"],
            ["identityVerifiedRequired", "身分証確認必須"],
            ["locationHiddenUntilJoined", "店舗詳細は参加後共有"],
            ["canLeaveEarly", "途中退室OK"],
            ["canJoinLate", "途中参加OK"],
            ["nonAlcoholOk", "お酒飲まなくてもOK"],
            ["firstTimerSupport", "初参加サポート"],
            ["waitlistEnabled", "キャンセル待ちON"],
            ["autoPromoteWaitlist", "キャンセル待ち自動繰り上げ"],
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

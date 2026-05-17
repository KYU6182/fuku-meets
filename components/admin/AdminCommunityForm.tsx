"use client";

import AdminLayout from "./AdminLayout";
import AdminFormField from "./AdminFormField";

export default function AdminCommunityForm({ mode }: { mode: "new" | "edit" }) {
  return (
    <AdminLayout title={`コミュニティ${mode === "new" ? "新規作成" : "編集"}`}>
      <form className="grid gap-4 rounded-[16px] border border-fuku-border bg-white p-5" onSubmit={(event) => event.preventDefault()}>
        {["タイトル", "カテゴリ", "画像URL", "エリア", "日付", "開始時間", "終了時間", "参加上限", "男女比", "幹事名", "ステータス"].map((label) => (
          <AdminFormField key={label} label={label} placeholder={label} />
        ))}
        <AdminFormField label="説明文" type="textarea" placeholder="このMEETの説明" />
        <div className="rounded-[12px] bg-[#fff1f1] p-4 text-[12px] font-bold leading-relaxed text-fuku-black">
          本番では承認制、通報対応、本人確認、参加者レビューを管理します。
        </div>
        <button type="button" className="min-h-[46px] rounded-full bg-fuku-red text-[13px] font-black text-white">保存する</button>
      </form>
    </AdminLayout>
  );
}

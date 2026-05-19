"use client";

import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminStatusBadge from "./AdminStatusBadge";
import AdminTable from "./AdminTable";
import { getAdminCommunitiesAsync, getCommunities, getCommunityParticipants, getCommunityReviews } from "@/lib/communityMeet";
import type { CommunityMeet } from "@/types/communityMeet";

export function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityMeet[]>(() => getCommunities());
  useEffect(() => {
    let mounted = true;
    void getAdminCommunitiesAsync().then((items) => {
      if (mounted) setCommunities(items);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <AdminLayout title="MEET管理">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">MEET</p>
          <h2 className="mt-1 text-[28px] font-black text-fuku-black">MEET一覧</h2>
          <p className="mt-1 text-[13px] font-bold text-fuku-gray">開催予定、参加人数、男女比、幹事、公開状態を管理します。</p>
        </div>
        <a href="/admin/communities/new" className="min-h-[44px] rounded-full bg-fuku-red px-5 py-3 text-[13px] font-black text-white">新規作成</a>
      </div>
      <AdminTable
        rows={communities}
        columns={[
          { header: "タイトル", render: (item) => <span className="font-black">{item.title}</span> },
          { header: "カテゴリ", render: (item) => item.category },
          { header: "日時", render: (item) => `${item.date} ${item.startTime}` },
          { header: "参加", render: (item) => `${item.participantCount}/${item.capacity}` },
          { header: "ステータス", render: (item) => <AdminStatusBadge status={item.status === "published" ? "published" : "draft"} /> },
          { header: "操作", render: (item) => <a href={`/admin/communities/${item.id}/edit`} className="rounded-full border border-fuku-border px-3 py-2 text-[11px] font-black">編集</a> },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminCommunityParticipantsPage() {
  return (
    <AdminLayout title="参加者管理">
      <AdminTable
        rows={getCommunityParticipants()}
        columns={[
          { header: "参加者", render: (item) => item.displayName },
          { header: "MEET ID", render: (item) => item.communityId },
          { header: "ステータス", render: (item) => item.status },
          { header: "登録日", render: (item) => item.createdAt },
        ]}
      />
    </AdminLayout>
  );
}

export function AdminCommunityReviewsPage() {
  return (
    <AdminLayout title="MEETレビュー">
      <AdminTable
        rows={getCommunityReviews()}
        columns={[
          { header: "会ID", render: (item) => item.communityId },
          { header: "満足度", render: (item) => item.rating },
          { header: "安心", render: (item) => item.safetyRating },
          { header: "コメント", render: (item) => item.comment },
        ]}
      />
    </AdminLayout>
  );
}

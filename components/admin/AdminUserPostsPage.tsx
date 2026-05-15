"use client";

import { Eye, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminStatusBadge from "./AdminStatusBadge";
import AdminTable from "./AdminTable";
import { storageKeys } from "@/lib/storageKeys";
import type { AdminStatus } from "@/types/admin";
import type { UserComment, UserPost } from "@/types/community";

type AdminCommunityKind = "posts" | "comments" | "photos";

function read<T>(key: string) {
  if (typeof window === "undefined") return [] as T[];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [] as T[];
  }
}

export default function AdminUserPostsPage({ kind }: { kind: AdminCommunityKind }) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);

  useEffect(() => {
    setPosts(kind === "photos" ? read<UserPost>(storageKeys.userPhotos) : read<UserPost>(storageKeys.userPosts));
    setComments(read<UserComment>(storageKeys.userComments));
  }, [kind]);

  const title = kind === "posts" ? "ユーザー投稿" : kind === "comments" ? "コメント管理" : "投稿画像";

  return (
    <AdminLayout title={title}>
      <div className="mb-5">
        <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">Community</p>
        <h1 className="mt-1 text-[28px] font-black text-fuku-black">{title}</h1>
        <p className="mt-1 text-[13px] font-bold text-fuku-gray">
          将来は承認制、通報対応、画像非公開、操作ログに接続します。
        </p>
      </div>
      {kind === "comments" ? (
        <AdminTable
          rows={comments}
          columns={[
            { header: "投稿者", render: (item) => <span className="font-black">{item.userDisplayName}</span> },
            { header: "対象", render: (item) => `${item.targetType} / ${item.targetTitle}` },
            { header: "本文", render: (item) => <span className="line-clamp-2 max-w-[320px]">{item.body}</span> },
            { header: "GOOD", render: (item) => item.goodCount },
            { header: "ステータス", render: (item) => <AdminStatusBadge status={toAdminStatus(item.status)} /> },
            { header: "操作", render: () => <button type="button" className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-fuku-border px-3 text-[11px] font-black"><Eye size={13} />確認</button> },
          ]}
        />
      ) : (
        <AdminTable
          rows={posts}
          columns={[
            { header: "投稿", render: (item) => <span className="font-black">{item.title}</span> },
            { header: "タイプ", render: (item) => item.type },
            { header: "本文", render: (item) => <span className="line-clamp-2 max-w-[320px]">{item.body}</span> },
            { header: "画像", render: (item) => item.imageUrls[0] ? <img src={item.imageUrls[0]} alt="" className="h-12 w-16 rounded-[6px] object-cover" /> : <ImageIcon size={18} /> },
            { header: "GOOD", render: (item) => item.goodCount },
            { header: "ステータス", render: (item) => <AdminStatusBadge status={toAdminStatus(item.status)} /> },
          ]}
        />
      )}
    </AdminLayout>
  );
}

function toAdminStatus(status: UserComment["status"] | UserPost["status"]): AdminStatus {
  return status === "hidden" ? "private" : status;
}

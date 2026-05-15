"use client";

import { Edit3, ExternalLink, LogOut, MapPin } from "lucide-react";
import type { UserProfile, UserStats } from "@/types/community";
import Button from "./Button";

export default function UserProfileCard({
  profile,
  stats,
  onLogout,
}: {
  profile: UserProfile;
  stats: UserStats;
  onLogout?: () => void;
}) {
  return (
    <section className="rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
      <div className="grid gap-4 min-[390px]:grid-cols-[112px_1fr]">
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-fuku-light">
          {profile.avatar ? <img src={profile.avatar} alt={profile.displayName} className="h-full w-full object-cover" /> : null}
        </div>
        <div className="min-w-0">
          <h2 className="text-[30px] font-black leading-none text-fuku-black">{profile.displayName}</h2>
          <p className="mt-2 text-[13px] font-black text-fuku-black">@{profile.username}</p>
          <p className="mt-2 flex items-center gap-1 text-[12px] font-bold text-fuku-gray">
            <MapPin size={14} />
            {profile.activityArea || "福岡エリア"}
          </p>
          <p className="mt-3 text-[11px] font-black text-fuku-gray">FUKU TYPE</p>
          <p className="text-[14px] font-black text-fuku-black">{profile.fukuType}</p>
          <p className="mt-3 line-clamp-2 text-[12px] font-bold leading-relaxed text-fuku-black">{profile.bio}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 divide-x divide-fuku-border border-t border-fuku-border pt-4">
        <Stat label="保存" value={stats.saves} />
        <Stat label="投票" value={stats.votes} />
        <Stat label="投稿" value={stats.posts} />
        <Stat label="GOOD" value={stats.goods} accent />
      </div>
      <div className="mt-5 grid gap-2 min-[390px]:grid-cols-2">
        <Button href="/mypage/profile" variant="black">
          <Edit3 size={15} />
          プロフィール編集
        </Button>
        <Button href={`/users/${profile.username}`} variant="light">
          <ExternalLink size={15} />
          公開プロフィール
        </Button>
      </div>
      {onLogout ? (
        <button type="button" onClick={onLogout} className="mx-auto mt-4 block text-[12px] font-black text-fuku-gray underline">
          <LogOut className="mr-1 inline" size={14} />
          ログアウト
        </button>
      ) : null}
    </section>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-black text-fuku-gray">{label}</p>
      <p className={`mt-1 text-[25px] font-black ${accent ? "text-fuku-red" : "text-fuku-black"}`}>{value}</p>
    </div>
  );
}

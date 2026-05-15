"use client";

import { Instagram, Lock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import Button from "./Button";
import Header from "./Header";
import PageHero from "./PageHero";
import UserBadgeList from "./UserBadgeList";
import UserPostCard from "./UserPostCard";
import { getPublicProfile, getUserBadges, getUserPosts, getUserStats } from "@/lib/userCommunity";
import type { UserProfile, UserStats, UserPost } from "@/types/community";

export default function PublicUserProfilePage({ username }: { username: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);

  useEffect(() => {
    const found = getPublicProfile(username);
    setProfile(found);
    if (found) {
      setStats(getUserStats(found.userId));
      setPosts(getUserPosts(found.userId));
    }
  }, [username]);

  if (!profile) {
    return (
      <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
        <Header />
        <main className="pb-28">
          <PageHero title="PUBLIC PROFILE" copy="プロフィールが見つかりません。" />
        </main>
        <BottomNav active="mypage" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="PUBLIC PROFILE" copy="福岡の活動プロフィール。" />
        {!profile.isPublic ? (
          <section className="px-4 py-6">
            <div className="rounded-[16px] border border-fuku-border bg-white p-6 text-center">
              <Lock className="mx-auto text-fuku-red" size={34} />
              <p className="mt-4 text-[15px] font-black text-fuku-black">このプロフィールは非公開です</p>
            </div>
          </section>
        ) : (
          <section className="space-y-4 px-4 py-5">
            <div className="rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
              <div className="grid gap-4 min-[390px]:grid-cols-[120px_1fr]">
                <div className="h-28 w-28 overflow-hidden rounded-full bg-fuku-light">
                  {profile.avatar ? <img src={profile.avatar} alt={profile.displayName} className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                  <h1 className="text-[32px] font-black leading-none text-fuku-black">{profile.displayName}</h1>
                  <p className="mt-2 text-[13px] font-black text-fuku-black">@{profile.username}</p>
                  <p className="mt-2 flex items-center gap-1 text-[12px] font-bold text-fuku-gray"><MapPin size={14} />{profile.activityArea}</p>
                  <p className="mt-3 text-[11px] font-black text-fuku-gray">FUKU TYPE</p>
                  <p className="text-[14px] font-black text-fuku-black">{profile.fukuType}</p>
                  {profile.instagram ? <Button href={profile.instagram} variant="black" className="mt-4 w-full"><Instagram size={15} />Instagramを見る</Button> : null}
                </div>
              </div>
              <p className="mt-4 text-[13px] font-bold leading-relaxed text-fuku-black">{profile.bio}</p>
              <TagGroup title="お気に入りエリア" items={profile.favoriteAreas} />
              <TagGroup title="好きなジャンル" items={profile.favoriteGenres} />
              <div className="mt-5 grid grid-cols-4 divide-x divide-fuku-border rounded-[12px] border border-fuku-border py-3">
                <Stat label="投稿" value={stats?.posts ?? 0} />
                <Stat label="GOOD" value={stats?.goods ?? 0} />
                <Stat label="投票" value={stats?.votes ?? 0} />
                <Stat label="保存" value={stats?.saves ?? 0} />
              </div>
            </div>
            <UserBadgeList badges={getUserBadges(profile.userId)} />
            <section className="rounded-[16px] border border-fuku-border bg-white p-5">
              <h2 className="mb-4 text-[18px] font-black text-fuku-black">投稿した推しコメント</h2>
              <div className="grid gap-3">
                {(posts.length ? posts : []).map((post) => <UserPostCard key={post.id} post={post} />)}
                {!posts.length ? <p className="rounded-[12px] bg-fuku-light p-4 text-[12px] font-bold text-fuku-gray">まだ公開投稿はありません。</p> : null}
              </div>
            </section>
          </section>
        )}
      </main>
      <BottomNav active="mypage" />
    </div>
  );
}

function TagGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-black text-fuku-gray">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => <span key={item} className="rounded-full border border-fuku-border px-3 py-1 text-[11px] font-black">{item}</span>)}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-black text-fuku-gray">{label}</p>
      <p className="mt-1 text-[22px] font-black text-fuku-black">{value}</p>
    </div>
  );
}

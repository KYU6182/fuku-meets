"use client";

import { Bookmark, CalendarDays, Crown, Heart, Map, PenLine, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import LinkCard from "@/components/LinkCard";
import MyPageActionMission from "@/components/MyPageActionMission";
import PageHero from "@/components/PageHero";
import UserBadgeList from "@/components/UserBadgeList";
import UserLevelCard from "@/components/UserLevelCard";
import UserPostCard from "@/components/UserPostCard";
import UserProfileCard from "@/components/UserProfileCard";
import { calculateUserLevel, getCurrentUserProfile, getUserBadges, getUserPosts, getUserStats } from "@/lib/userCommunity";
import { getCurrentUser, logoutUser } from "@/lib/userAuth";
import type { UserBadge, UserLevel, UserPost, UserProfile, UserStats } from "@/types/community";

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setChecked(true);
    if (!user) return;
    const nextProfile = getCurrentUserProfile();
    setProfile(nextProfile);
    if (nextProfile) {
      setStats(getUserStats(nextProfile.userId));
      setLevel(calculateUserLevel(nextProfile.userId));
      setBadges(getUserBadges(nextProfile.userId));
      setPosts(getUserPosts(nextProfile.userId));
    }
  }, []);

  function logout() {
    logoutUser();
    router.push("/auth/login");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="MY PAGE" copy="自分の福岡活動がたまる場所。" />
        <section className="space-y-4 px-4 py-5">
          {checked && !profile ? (
            <div className="rounded-[16px] border border-fuku-border bg-white p-6 text-center shadow-soft">
              <UserRound className="mx-auto text-fuku-red" size={36} />
              <h2 className="mt-4 text-[20px] font-black text-fuku-black">ログインすると、福岡の活動が残ります</h2>
              <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">
                FUKU-MEETSにログインすると、保存した店や投票履歴、推しコメントを見返せます。
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button href="/auth/register">会員登録する</Button>
                <Button href="/auth/login" variant="outline">ログインする</Button>
              </div>
            </div>
          ) : null}

          {profile && stats && level ? (
            <>
              <UserProfileCard profile={profile} stats={stats} onLogout={logout} />
              <UserLevelCard level={level} />
              <MyPageActionMission completed={Math.min(5, Math.max(1, stats.votes + stats.posts + stats.saves > 0 ? 3 : 1))} />
              <div className="rounded-[16px] border border-fuku-border bg-white p-5">
                <p className="text-[13px] font-black leading-relaxed text-fuku-black">
                  あなたの推しコメントが、福岡のランキングを動かします。
                  <br />
                  投稿がGOODされると、FUKU LEVELが上がります。
                  <br />
                  編集部に選ばれると、FUKU-MEETS内で紹介されることがあります。
                </p>
              </div>
              <UserBadgeList badges={badges} />
              <section className="rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[18px] font-black text-fuku-black">自分の投稿</h2>
                  <a href="/mypage/posts" className="text-[11px] font-black text-fuku-black">すべて見る →</a>
                </div>
                {posts[0] ? <UserPostCard post={posts[0]} /> : <p className="rounded-[12px] bg-fuku-light p-4 text-[12px] font-bold text-fuku-gray">まだ投稿はありません。店舗やランキングで推しコメントを書いてみよう。</p>}
              </section>
              <div className="grid grid-cols-2 gap-3">
                <LinkCard href="/mypage/saves" title="保存したお店" description={`${stats.saves}件`} icon={<Bookmark size={20} />} />
                <LinkCard href="/mypage/votes" title="投票したランキング" description={`${stats.votes}件`} icon={<Crown size={20} />} />
                <LinkCard href="/mypage/icons" title="応援中ICONS" description={`${stats.supports}件`} icon={<Heart size={20} />} />
                <LinkCard href="/mypage/good" title="もらったGOOD" description={`${stats.goods}件`} icon={<PenLine size={20} />} />
                <LinkCard href="/mypage/meets" title="参加予定MEET" description="興味あり・レビュー待ち" icon={<CalendarDays size={20} />} />
              </div>
              <LinkCard href="/mypage/dashboard" title="MY DASHBOARD" description="今週のアクションをまとめて確認" icon={<UserRound size={20} />} />
              <div className="rounded-[16px] border border-fuku-border bg-white p-5">
                <h2 className="text-[18px] font-black text-fuku-black">MY FUKU MAP</h2>
                <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">保存した店、投稿した店、投票した場所が、あなたの福岡マップになります。</p>
                <div className="mt-4 flex h-28 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#f2eee8,#fff1f1)] text-[12px] font-black text-fuku-gray">
                  <Map size={20} className="mr-2" />
                  準備中
                </div>
              </div>
            </>
          ) : null}
        </section>
      </main>
      <BottomNav active="mypage" />
    </div>
  );
}

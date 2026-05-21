"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/userAuth";
import type { CommunityMeet } from "@/types/communityMeet";
import type { UserSession } from "@/types/userAuth";

type ChatListItem = {
  participant: {
    id: string;
    meet_slug: string;
    joined_at?: string;
  };
  meet: CommunityMeet | null;
};

type ChatListPayload = {
  chats?: ChatListItem[];
  error?: string;
};

export default function MyPageChatsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (!current) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const userId = current.userId;
    async function load() {
      try {
        const response = await fetch(`/api/mypage/chats?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
        const payload = (await response.json()) as ChatListPayload;
        if (!mounted) return;
        if (!response.ok) {
          setError(payload.error ?? "チャット一覧を取得できませんでした");
          setChats([]);
          return;
        }
        setChats(payload.chats ?? []);
      } catch (fetchError) {
        if (mounted) setError(fetchError instanceof Error ? fetchError.message : "チャット一覧を取得できませんでした");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-white pb-28 text-fuku-black">
      <Header />
      <section className="px-5 py-8">
        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-fuku-red">MY PAGE</p>
        <h1 className="mt-2 text-[44px] font-black uppercase leading-none tracking-tight">MEET CHAT</h1>
        <p className="mt-3 text-[14px] font-bold leading-relaxed text-fuku-gray">参加確定したMEETだけ表示されます。</p>

        {!user ? (
          <div className="mt-6 rounded-[22px] border border-fuku-border bg-[#f7f4ef] p-5">
            <MessageCircle className="text-fuku-red" size={30} />
            <h2 className="mt-3 text-[20px] font-black">ログインすると参加中MEETのチャットが見られます</h2>
            <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-gray">参加確定後、集合・遅刻連絡・当日の案内を参加者だけで確認できます。</p>
            <div className="mt-5 grid gap-3">
              <a href="/auth/login" className="grid min-h-[46px] place-items-center rounded-full bg-fuku-red text-[13px] font-black text-white">
                ログイン
              </a>
              <a href="/auth/register" className="grid min-h-[46px] place-items-center rounded-full border border-fuku-black bg-white text-[13px] font-black">
                会員登録
              </a>
            </div>
          </div>
        ) : null}

        {user && loading ? <p className="mt-6 rounded-[16px] bg-fuku-light p-4 text-[13px] font-black">読み込み中...</p> : null}
        {user && error ? <p className="mt-6 rounded-[16px] bg-[#fff1f1] p-4 text-[13px] font-black text-fuku-red">{error}</p> : null}

        {user && !loading && !chats.length ? (
          <div className="mt-6 rounded-[22px] border border-fuku-border bg-white p-5 shadow-sm">
            <Sparkles className="text-fuku-red" size={30} />
            <h2 className="mt-3 text-[20px] font-black">まだ参加中のMEETはありません</h2>
            <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-gray">参加確定したMEETのチャットがここに並びます。</p>
            <a href="/meet" className="mt-5 grid min-h-[46px] place-items-center rounded-full bg-fuku-red text-[13px] font-black text-white">
              今夜のMEETを探す
            </a>
          </div>
        ) : null}

        {user && chats.length ? (
          <div className="mt-6 grid gap-3">
            {chats.map(({ participant, meet }) => {
              const slug = meet?.slug ?? participant.meet_slug;
              return (
                <article key={participant.id} className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-fuku-red">参加者だけのチャット</p>
                  <h2 className="mt-2 text-[20px] font-black">{meet?.title ?? participant.meet_slug}</h2>
                  <p className="mt-1 text-[12px] font-bold text-fuku-gray">
                    {meet?.date ? `${meet.date.replace("2024-", "").replace("-", ".")} ` : ""}
                    {meet?.startTime ? `${meet.startTime}〜` : ""} / {meet?.area ?? "福岡エリア"}
                  </p>
                  <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">合流、遅刻、当日の案内を参加者だけで共有できます。</p>
                  <a href={`/mypage/meets/${slug}/chat`} className="mt-4 grid min-h-[44px] place-items-center rounded-full bg-fuku-red text-[13px] font-black text-white">
                    チャットを見る
                  </a>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
      <BottomNav active="chat" />
    </main>
  );
}

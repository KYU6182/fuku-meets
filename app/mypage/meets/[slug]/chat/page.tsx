"use client";

import { LockKeyhole, Send, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/userAuth";
import type { CommunityMeet } from "@/types/communityMeet";
import type { UserSession } from "@/types/userAuth";

type ChatMessage = {
  id: string;
  meet_slug: string;
  user_id?: string;
  display_name?: string;
  avatar_url?: string;
  body: string;
  created_at?: string;
};

type ConfirmationPayload = {
  confirmed?: boolean;
  meet?: CommunityMeet | null;
  error?: string;
};

type MessagesPayload = {
  messages?: ChatMessage[];
  message?: ChatMessage;
  error?: string;
};

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export default function MeetParticipantChatPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [user, setUser] = useState<UserSession | null>(null);
  const [meet, setMeet] = useState<CommunityMeet | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const meetTitle = useMemo(() => meet?.title ?? slug.replace(/-/g, " "), [meet?.title, slug]);

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
        const confirmationResponse = await fetch(
          `/api/mypage/chats?userId=${encodeURIComponent(userId)}&meetSlug=${encodeURIComponent(slug)}`,
          { cache: "no-store" },
        );
        const confirmation = (await confirmationResponse.json()) as ConfirmationPayload;
        if (!mounted) return;

        setMeet(confirmation.meet ?? null);
        if (!confirmationResponse.ok || !confirmation.confirmed) {
          setConfirmed(false);
          setError(confirmation.error ?? "参加確定後にチャットを利用できます");
          return;
        }

        setConfirmed(true);
        const messagesResponse = await fetch(`/api/meets/${slug}/chat?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
        const messagePayload = (await messagesResponse.json()) as MessagesPayload;
        if (!mounted) return;
        if (!messagesResponse.ok) {
          setError(messagePayload.error ?? "メッセージを取得できませんでした");
          return;
        }
        setMessages(messagePayload.messages ?? []);
      } catch (fetchError) {
        if (mounted) setError(fetchError instanceof Error ? fetchError.message : "チャットを取得できませんでした");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !confirmed || !body.trim()) return;

    setSending(true);
    setError("");
    try {
      const response = await fetch(`/api/meets/${slug}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, body }),
      });
      const payload = (await response.json()) as MessagesPayload;
      if (!response.ok || !payload.message) {
        setError(payload.error ?? "送信できませんでした");
        return;
      }
      setMessages((current) => [...current, payload.message as ChatMessage]);
      setBody("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "送信できませんでした");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-white pb-32 text-fuku-black">
      <Header />
      <section className="px-5 py-7">
        <a href="/mypage/chats" className="text-[12px] font-black text-fuku-gray">
          ← MEETチャット一覧
        </a>
        <p className="mt-6 text-[12px] font-black uppercase tracking-[0.28em] text-fuku-red">PARTICIPANT CHAT</p>
        <h1 className="mt-2 text-[32px] font-black leading-tight">{meetTitle}</h1>
        <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-gray">
          参加者だけが見られるチャットです。合流、遅刻、物販状況などをゆるく共有できます。
        </p>

        <div className="mt-5 rounded-[18px] border border-fuku-border bg-[#f7f4ef] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 text-fuku-red" size={22} />
            <p className="text-[12px] font-bold leading-relaxed text-fuku-gray">
              連絡先交換の強要、勧誘、迷惑行為は禁止です。困った場合は運営に通報できます。
            </p>
          </div>
        </div>

        {!user ? (
          <div className="mt-6 rounded-[22px] border border-fuku-border bg-white p-5 shadow-sm">
            <LockKeyhole className="text-fuku-red" size={28} />
            <h2 className="mt-3 text-[20px] font-black">ログインするとチャットを確認できます</h2>
            <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-gray">参加確定済みアカウントでログインしてください。</p>
            <a href="/auth/login" className="mt-5 grid min-h-[46px] place-items-center rounded-full bg-fuku-red text-[13px] font-black text-white">
              ログイン
            </a>
          </div>
        ) : null}

        {user && loading ? <p className="mt-6 rounded-[16px] bg-fuku-light p-4 text-[13px] font-black">読み込み中...</p> : null}

        {user && !loading && !confirmed ? (
          <div className="mt-6 rounded-[22px] border border-fuku-border bg-white p-5 shadow-sm">
            <LockKeyhole className="text-fuku-red" size={28} />
            <h2 className="mt-3 text-[20px] font-black">参加確定後に表示されます</h2>
            <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-gray">
              {error || "Stripe決済完了後、参加確定するとこのチャットが開きます。"}
            </p>
            <a href={`/meet/${slug}`} className="mt-5 grid min-h-[46px] place-items-center rounded-full bg-fuku-red text-[13px] font-black text-white">
              MEET詳細へ戻る
            </a>
          </div>
        ) : null}

        {user && confirmed ? (
          <>
            {error ? <p className="mt-5 rounded-[14px] bg-[#fff1f1] p-3 text-[12px] font-black text-fuku-red">{error}</p> : null}
            <div className="mt-6 grid gap-3">
              {messages.length ? (
                messages.map((message) => (
                  <article key={message.id} className="rounded-[18px] border border-fuku-border bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-fuku-light text-[12px] font-black">
                        {message.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={message.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          (message.display_name ?? "FM").slice(0, 2)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-black">{message.display_name ?? "FUKU-MEETS USER"}</p>
                          <span className="text-[10px] font-bold text-fuku-gray">{formatTime(message.created_at)}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-[14px] font-bold leading-relaxed">{message.body}</p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-[18px] border border-dashed border-fuku-border bg-white p-5 text-[13px] font-bold leading-relaxed text-fuku-gray">
                  まだメッセージはありません。合流場所の確認や遅刻連絡など、必要なことだけゆるく共有できます。
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="fixed bottom-[92px] left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-fuku-border bg-white px-4 py-3 shadow-[0_-12px_24px_rgba(17,17,17,0.08)]">
              <div className="flex items-end gap-2">
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={1}
                  maxLength={500}
                  placeholder="参加者だけにメッセージを送る"
                  className="min-h-[46px] flex-1 resize-none rounded-[18px] border border-fuku-border bg-fuku-light px-4 py-3 text-[14px] font-bold outline-none focus:border-fuku-red"
                />
                <button
                  type="submit"
                  disabled={sending || !body.trim()}
                  className="grid h-[46px] w-[52px] place-items-center rounded-[16px] bg-fuku-red text-white disabled:opacity-40"
                  aria-label="送信"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : null}
      </section>
      <BottomNav active="chat" />
    </main>
  );
}

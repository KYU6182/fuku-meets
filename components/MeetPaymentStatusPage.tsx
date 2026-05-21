"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

type PaymentMode = "complete" | "pending" | "failed";

type PaymentStatusPayload = {
  status?: string;
  meetSlug?: string;
  participantConfirmed?: boolean;
  error?: string;
};

const modeCopy: Record<PaymentMode, { title: string; description: string }> = {
  complete: {
    title: "参加状況を確認しています",
    description: "決済結果を確認しています。参加確定はStripe webhookの完了後に反映されます。",
  },
  pending: {
    title: "決済確認中です",
    description: "支払い完了後、参加確定まで少し時間がかかる場合があります。",
  },
  failed: {
    title: "決済が完了していません",
    description: "支払いがキャンセルされた、または確認できませんでした。もう一度MEET詳細からお試しください。",
  },
};

export default function MeetPaymentStatusPage({ slug, mode }: { slug: string; mode: PaymentMode }) {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<PaymentStatusPayload | null>(null);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextSessionId = params.get("session_id") ?? "";
    setSessionId(nextSessionId);

    if (!nextSessionId) {
      setLoading(false);
      setPayload(null);
      return;
    }

    let mounted = true;
    async function load() {
      try {
        const response = await fetch(`/api/payments/stripe/status/${nextSessionId}`, { cache: "no-store" });
        const data = (await response.json()) as PaymentStatusPayload;
        if (mounted) setPayload(data);
      } catch (error) {
        if (mounted) setPayload({ error: error instanceof Error ? error.message : "決済状況の確認に失敗しました" });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const isConfirmed = payload?.status === "paid" && payload.participantConfirmed;
  const copy = useMemo(() => {
    if (isConfirmed) {
      return {
        title: "参加が確定しました",
        description: "店舗詳細と参加者チャットはマイページから確認できます。",
      };
    }
    if (payload?.status === "pending") return modeCopy.pending;
    if (payload?.status === "expired" || payload?.status === "failed" || mode === "failed") return modeCopy.failed;
    return modeCopy[mode];
  }, [isConfirmed, mode, payload?.status]);

  return (
    <main className="mx-auto min-h-screen max-w-[430px] bg-white pb-28 text-fuku-black">
      <Header />
      <section className="px-5 py-8">
        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-fuku-red">MEET PAYMENT</p>
        <h1 className="mt-3 text-[40px] font-black uppercase leading-none tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-[14px] font-bold leading-relaxed text-fuku-gray">{copy.description}</p>

        <div className="mt-6 rounded-[22px] border border-fuku-border bg-[#f7f4ef] p-5">
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-fuku-gray">MEET</p>
          <h2 className="mt-2 text-[22px] font-black">{slug.replace(/-/g, " ")}</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] font-black">
            <div className="rounded-[14px] bg-white p-3">
              <span className="block text-fuku-gray">参加費</span>
              <span className="mt-1 block text-[20px] text-fuku-red">800円</span>
            </div>
            <div className="rounded-[14px] bg-white p-3">
              <span className="block text-fuku-gray">店舗詳細</span>
              <span className="mt-1 block text-[14px]">参加後共有</span>
            </div>
          </div>
          {sessionId ? <p className="mt-4 break-all text-[11px] font-bold text-fuku-gray">session: {sessionId}</p> : null}
          {loading ? <p className="mt-4 text-[12px] font-black text-fuku-gray">決済状況を確認中...</p> : null}
          {payload?.error ? <p className="mt-4 rounded-[12px] bg-white p-3 text-[12px] font-black text-fuku-red">{payload.error}</p> : null}
        </div>

        <div className="mt-6 grid gap-3">
          {isConfirmed ? (
            <a href="/mypage/chats" className="grid min-h-[50px] place-items-center rounded-full bg-fuku-red text-[14px] font-black text-white">
              マイページで確認する
            </a>
          ) : (
            <a href={`/meet/${slug}`} className="grid min-h-[50px] place-items-center rounded-full bg-fuku-red text-[14px] font-black text-white">
              MEET詳細へ戻る
            </a>
          )}
          <a href={`/meet/${slug}`} className="grid min-h-[50px] place-items-center rounded-full border border-fuku-black bg-white text-[14px] font-black">
            MEET詳細へ戻る
          </a>
        </div>
      </section>
      <BottomNav active="meet" />
    </main>
  );
}

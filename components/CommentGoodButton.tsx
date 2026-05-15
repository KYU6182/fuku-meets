"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { goodComment, hasGoodComment } from "@/lib/userCommunity";
import { getCurrentUser } from "@/lib/userAuth";
import { useToast } from "./Toast";

export default function CommentGoodButton({ commentId, initialCount }: { commentId: string; initialCount: number }) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [done, setDone] = useState(false);
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setDone(hasGoodComment(commentId, user.userId));
  }, [commentId]);

  function good() {
    const user = getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const result = goodComment(commentId, user.userId);
    showToast(result.message);
    if (result.ok) {
      setCount((value) => value + 1);
      setDone(true);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={good}
        disabled={done}
        className={`inline-flex min-h-[34px] items-center gap-2 rounded-full border px-3 text-[11px] font-black ${
          done ? "border-fuku-red bg-[#fff1f1] text-fuku-red" : "border-fuku-border bg-white text-fuku-black"
        }`}
      >
        <Heart size={14} fill={done ? "#e52421" : "none"} />
        {done ? "GOOD済み" : "GOOD"} {count}
      </button>
      <ToastViewport />
    </>
  );
}

"use client";

import { Bookmark, Heart, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { storageKeys } from "@/lib/storageKeys";
import { addToLocalList, useToast } from "./Toast";

function hasLocalValue(key: string, value: string) {
  if (typeof window === "undefined") return false;
  const current = JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
  return current.includes(value);
}

export default function IconActionButtons({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [followed, setFollowed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    setFollowed(hasLocalValue(storageKeys.followedIcons, slug));
    setSaved(hasLocalValue(storageKeys.savedIcons, slug));
    setSupported(hasLocalValue(storageKeys.supportedIcons, slug));
  }, [slug]);

  function act(type: "follow" | "save" | "support") {
    if (type === "follow") {
      addToLocalList(storageKeys.followedIcons, slug);
      setFollowed(true);
      showToast(followed ? "フォロー中です" : "フォローしました");
    }
    if (type === "save") {
      addToLocalList(storageKeys.savedIcons, slug);
      setSaved(true);
      showToast(saved ? "保存済みです" : "保存しました");
    }
    if (type === "support") {
      addToLocalList(storageKeys.supportedIcons, slug);
      if (!supported) setSupportCount((value) => value + 1);
      setSupported(true);
      showToast(supported ? "応援済みです" : "応援しました");
    }
  }

  return (
    <>
      <div className={compact ? "grid grid-cols-3 gap-2" : "grid grid-cols-3 gap-2"}>
        <button type="button" onClick={() => act("follow")} className="grid min-h-[40px] place-items-center rounded-full border border-fuku-border text-[8px] font-black">
          <UserPlus size={16} />
          {followed ? "フォロー中" : "フォロー"}
        </button>
        <button type="button" onClick={() => act("save")} className="grid min-h-[40px] place-items-center rounded-full border border-fuku-border text-[8px] font-black">
          <Bookmark size={16} />
          {saved ? "保存済み" : "保存"}
        </button>
        <button type="button" onClick={() => act("support")} className="grid min-h-[40px] place-items-center rounded-full border border-fuku-red text-[8px] font-black text-fuku-red">
          <Heart size={16} />
          {supported ? "応援済み" : supportCount > 0 ? `応援+${supportCount}` : "応援"}
        </button>
      </div>
      <ToastViewport />
    </>
  );
}

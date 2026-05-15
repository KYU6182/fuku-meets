"use client";

import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(""), 1800);
  }, []);

  function ToastViewport() {
    if (!message) return null;

    return (
      <div className="fixed bottom-24 left-1/2 z-[80] w-[calc(100%-32px)] max-w-[398px] -translate-x-1/2 rounded-full bg-fuku-black px-5 py-3 text-center text-[13px] font-black text-white shadow-phone">
        {message}
      </div>
    );
  }

  return { showToast, ToastViewport };
}

export function addToLocalList(key: string, value: string) {
  if (typeof window === "undefined") return;
  const current = JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
  if (!current.includes(value)) current.push(value);
  window.localStorage.setItem(key, JSON.stringify(current));
}

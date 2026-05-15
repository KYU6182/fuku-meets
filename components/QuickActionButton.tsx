"use client";

import { addToLocalList, useToast } from "./Toast";

type QuickActionButtonProps = {
  label: string;
  storageKey?: string;
  value?: string;
  message: string;
  className?: string;
};

export default function QuickActionButton({
  label,
  storageKey,
  value,
  message,
  className = "",
}: QuickActionButtonProps) {
  const { showToast, ToastViewport } = useToast();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (storageKey && value) addToLocalList(storageKey, value);
          showToast(message);
        }}
        className={`min-h-[40px] rounded-full px-4 text-[12px] font-black ${className || "bg-fuku-red text-white"}`}
      >
        {label}
      </button>
      <ToastViewport />
    </>
  );
}

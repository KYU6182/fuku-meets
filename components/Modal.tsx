"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 px-4 pb-24">
      <section className="w-full max-w-[398px] rounded-[18px] bg-white p-5 shadow-phone">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[18px] font-black text-fuku-black">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-fuku-border"
            aria-label="閉じる"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}

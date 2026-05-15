"use client";

import { Menu } from "lucide-react";

export default function AdminHeader({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-fuku-border bg-white px-5 lg:px-8">
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-fuku-red">FUKU-MEETS ADMIN</p>
        <h1 className="text-[24px] font-black text-fuku-black">{title}</h1>
      </div>
      <button
        type="button"
        onClick={onMenuClick}
        className="grid h-11 w-11 place-items-center rounded-full border border-fuku-border lg:hidden"
        aria-label="管理メニューを開く"
      >
        <Menu size={21} />
      </button>
    </header>
  );
}

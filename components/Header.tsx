"use client";

import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";

const menuLinks = [
  { label: "HOME", href: "/" },
  { label: "RANKING", href: "/ranking" },
  { label: "FUKU ICONS", href: "/icons" },
  { label: "NEWS", href: "/news" },
  { label: "SEARCH", href: "/search" },
  { label: "MY PAGE", href: "/mypage" },
  { label: "WEEKEND GUIDE", href: "/weekend/izakaya" },
  { label: "NEW IN FUKUOKA", href: "/new-in-fukuoka" },
  { label: "MAGAZINE", href: "/magazine" },
  { label: "掲載について", href: "/listing" },
  { label: "お問い合わせ", href: "/forms/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-fuku-border bg-white/95 px-5 pb-4 pt-5 backdrop-blur">
      <div className="flex min-h-[78px] items-end justify-between gap-4">
        <a href="/" className="block min-w-0">
          <p className="headline-condensed whitespace-nowrap text-[43px] uppercase leading-[0.82] text-fuku-black">
            FUKU-MEETS
          </p>
          <p className="mt-2 text-[13px] font-black tracking-wide text-fuku-black">
            福岡のリアルに、会いにいく。
          </p>
        </a>

        <nav className="mb-1 flex shrink-0 items-end gap-4" aria-label="Header navigation">
          <a href="/notifications" className="flex flex-col items-center gap-1 text-fuku-black">
            <Bell size={22} strokeWidth={1.9} />
            <span className="text-[9px] font-bold tracking-wide">お知らせ</span>
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-fuku-black"
          >
            <Menu size={25} strokeWidth={1.9} />
            <span className="text-[9px] font-bold tracking-wide">メニュー</span>
          </button>
        </nav>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[90] bg-fuku-black/35" onClick={() => setMenuOpen(false)}>
          <aside
            className="ml-auto flex h-full w-[82%] max-w-[340px] flex-col bg-white px-5 py-6 shadow-phone"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="headline-condensed text-[36px] uppercase leading-none text-fuku-black">
                MENU
              </p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-fuku-border"
                aria-label="メニューを閉じる"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="mt-7 grid gap-2" aria-label="Slide menu">
              {menuLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex min-h-[48px] items-center justify-between border-b border-fuku-border text-[14px] font-black text-fuku-black"
                >
                  {link.label}
                  <span className="text-fuku-red">→</span>
                </a>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}

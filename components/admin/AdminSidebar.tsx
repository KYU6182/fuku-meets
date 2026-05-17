"use client";

import {
  BarChart3,
  FileText,
  Home,
  Image,
  LogOut,
  Newspaper,
  Settings,
  Shield,
  Sparkles,
  Store,
  UserRound,
  Users,
  WandSparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession } from "@/lib/adminAuth";

const nav = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Studio", href: "/admin/studio", icon: WandSparkles },
  { label: "AI Tools", href: "/admin/ai", icon: Sparkles },
  { label: "HOME管理", href: "/admin/home", icon: Home },
  { label: "画像管理", href: "/admin/media", icon: Image },
  { label: "NEWS", href: "/admin/news", icon: Newspaper },
  { label: "ランキング", href: "/admin/rankings", icon: BarChart3 },
  { label: "店舗", href: "/admin/shops", icon: Store },
  { label: "FUKU ICONS", href: "/admin/icons", icon: UserRound },
  { label: "イベント", href: "/admin/events", icon: FileText },
  { label: "COMMUNITY", href: "/admin/communities", icon: Users },
  { label: "参加者", href: "/admin/community-participants", icon: Users },
  { label: "MEETレビュー", href: "/admin/community-reviews", icon: FileText },
  { label: "MAGAZINE", href: "/admin/magazine", icon: FileText },
  { label: "フォーム投稿", href: "/admin/forms", icon: FileText },
  { label: "ユーザー投稿", href: "/admin/user-posts", icon: FileText },
  { label: "コメント", href: "/admin/comments", icon: FileText },
  { label: "投稿画像", href: "/admin/photos", icon: Image },
  { label: "ユーザー", href: "/admin/users", icon: Users },
  { label: "設定", href: "/admin/settings", icon: Settings },
  { label: "操作ログ", href: "/admin/logs", icon: Shield },
];

export default function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  return (
    <>
      {open ? <button type="button" className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} aria-label="管理メニューを閉じる" /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-fuku-border bg-fuku-black px-4 py-5 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <a href="/admin" className="px-2">
          <p className="headline-condensed text-[34px] leading-none">FUKU ADMIN</p>
          <p className="mt-1 text-[11px] font-bold text-white/60">公開サイトとは分離された管理画面</p>
        </a>
        <nav className="mt-7 flex-1 space-y-1">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <a
                key={href}
                href={href}
                className={`flex min-h-[42px] items-center gap-3 rounded-[10px] px-3 text-[13px] font-black ${
                  active ? "bg-fuku-red text-white" : "text-white/76 hover:bg-white/10"
                }`}
              >
                <Icon size={17} />
                {label}
              </a>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/15 pt-4">
          <a href="/" className="flex min-h-[42px] items-center rounded-[10px] px-3 text-[13px] font-black text-white/76 hover:bg-white/10">
            公開サイトを見る
          </a>
          <button type="button" onClick={logout} className="flex min-h-[42px] w-full items-center gap-3 rounded-[10px] px-3 text-left text-[13px] font-black text-white/76 hover:bg-white/10">
            <LogOut size={17} />
            ログアウト
          </button>
        </div>
      </aside>
    </>
  );
}

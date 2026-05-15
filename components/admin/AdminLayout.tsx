"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { requireAdmin } from "@/lib/adminAuth";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const session = requireAdmin();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-fuku-bg text-[14px] font-black text-fuku-black">
        管理者権限を確認しています
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fuku-bg">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-[280px]">
        <AdminHeader title={title} onMenuClick={() => setMenuOpen(true)} />
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

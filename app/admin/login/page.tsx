"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { setAdminSession } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email === "admin@fuku-meets.local" && password === "admin1234") {
      setAdminSession({ isLoggedIn: true, role: "super_admin", email });
      router.replace("/admin");
      return;
    }
    setError("メールアドレスまたはパスワードが違います");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-fuku-bg px-4">
      <main className="w-full max-w-[440px] rounded-[20px] border border-fuku-border bg-white p-7 shadow-phone">
        <div className="mb-7 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-fuku-black text-white">
            <Lock size={24} />
          </div>
          <h1 className="headline-condensed mt-4 text-[46px] uppercase leading-none text-fuku-black">
            FUKU-MEETS ADMIN
          </h1>
          <p className="mt-2 text-[12px] font-bold text-fuku-gray">管理者専用ログイン</p>
        </div>
        <form className="space-y-4" onSubmit={login}>
          <label className="block">
            <span className="text-[12px] font-black">メールアドレス</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-fuku-border px-3 outline-none focus:border-fuku-red" />
          </label>
          <label className="block">
            <span className="text-[12px] font-black">パスワード</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-fuku-border px-3 outline-none focus:border-fuku-red" />
          </label>
          {error ? <p className="rounded-[10px] bg-[#fff1f1] px-4 py-3 text-[12px] font-black text-fuku-red">{error}</p> : null}
          <button type="submit" className="min-h-[48px] w-full rounded-full bg-fuku-red text-[14px] font-black text-white">
            ログイン
          </button>
        </form>
        <a href="/" className="mt-5 block text-center text-[12px] font-black text-fuku-gray">
          公開サイトへ戻る
        </a>
      </main>
    </div>
  );
}

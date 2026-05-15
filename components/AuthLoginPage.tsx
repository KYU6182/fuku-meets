"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomNav from "./BottomNav";
import Button from "./Button";
import Header from "./Header";
import { loginUser } from "@/lib/userAuth";

export default function AuthLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    const result = loginUser(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    void keep;
    router.push("/mypage");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="px-4 pb-28 pt-8">
        <h1 className="headline-condensed text-[68px] uppercase leading-none text-fuku-black">LOGIN</h1>
        <p className="mt-4 text-[17px] font-black text-fuku-black">ログインして、あなたの福岡活動を見返そう。</p>
        <section className="mt-8 rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
          <label className="block">
            <span className="text-[15px] font-black text-fuku-black">メールアドレス</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="example@fuku-meets.jp" className="mt-3 h-[52px] w-full rounded-[14px] border border-fuku-border px-4 text-[14px] font-bold outline-none focus:border-fuku-red" />
          </label>
          <label className="mt-6 block">
            <span className="text-[15px] font-black text-fuku-black">パスワード</span>
            <span className="mt-3 flex h-[52px] items-center rounded-[14px] border border-fuku-border px-4">
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" className="w-full bg-transparent text-[14px] font-bold outline-none" />
              <Eye size={20} className="text-fuku-gray" />
            </span>
          </label>
          {error ? <p className="mt-4 text-[13px] font-black text-fuku-red">{error}</p> : null}
          <div className="mt-6 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-[12px] font-bold text-fuku-black">
              <input type="checkbox" checked={keep} onChange={(event) => setKeep(event.target.checked)} className="h-5 w-5 rounded border-fuku-border" />
              ログイン状態を保持
            </label>
            <a href="/forms/contact" className="text-[12px] font-black underline">パスワードを忘れた方</a>
          </div>
          <Button onClick={submit} className="mt-6 w-full text-[17px]">ログインする</Button>
        </section>
        <section className="mt-6 rounded-[16px] border border-fuku-border bg-white p-5 text-center">
          <p className="text-[16px] font-black text-fuku-black">まだ会員登録していませんか？</p>
          <Button href="/auth/register" variant="light" className="mt-4 w-full">会員登録する</Button>
        </section>
      </main>
      <BottomNav active="mypage" />
    </div>
  );
}

"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import BottomNav from "./BottomNav";
import Button from "./Button";
import Header from "./Header";
import { registerUser } from "@/lib/userAuth";

export default function AuthRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
    displayName: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit() {
    if (!agreed) {
      setError("利用規約・プライバシーポリシーへの同意が必要です");
      return;
    }
    const result = registerUser(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/mypage/profile");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="px-4 pb-28 pt-6">
        <h1 className="headline-condensed text-[58px] uppercase leading-none text-fuku-black">REGISTER</h1>
        <p className="mt-3 text-[17px] font-black text-fuku-black">会員登録して、福岡の推しを記録しよう。</p>
        <section className="mt-7 rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
          <Field label="メールアドレス" value={form.email} placeholder="例）you@example.com" onChange={(value) => update("email", value)} />
          <Field label="パスワード" type="password" value={form.password} placeholder="6文字以上の英数字を入力" onChange={(value) => update("password", value)} helper="パスワードは6文字以上" icon={<Eye size={20} />} />
          <Field label="パスワード確認" type="password" value={form.passwordConfirm} placeholder="パスワードを再入力してください" onChange={(value) => update("passwordConfirm", value)} helper="パスワードが一致していることを確認してください" icon={<Eye size={20} />} />
          <Field label="ユーザーID" value={form.username} placeholder="例）yui_fuku" onChange={(value) => update("username", value)} helper="ユーザーIDは重複できません" />
          <Field label="表示名" value={form.displayName} placeholder="例）YUI" onChange={(value) => update("displayName", value)} helper="プロフィールや投稿で表示される名前です" />
          <label className="mt-5 flex items-center gap-3 text-[12px] font-black text-fuku-black">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="h-6 w-6 rounded border-fuku-border" />
            <span>
              <a href="/terms" className="text-fuku-red underline">利用規約</a>・<a href="/privacy" className="text-fuku-red underline">プライバシーポリシー</a>に同意する
            </span>
          </label>
          {error ? <p className="mt-4 text-[12px] font-black text-fuku-red">{error}</p> : null}
          <Button onClick={submit} className="mt-6 w-full text-[17px]">会員登録する</Button>
        </section>
        <section className="mt-5 rounded-[16px] border border-fuku-border bg-white p-5 text-center">
          <p className="text-[14px] font-black text-fuku-black">すでにアカウントをお持ちですか？</p>
          <Button href="/auth/login" variant="light" className="mt-4 w-full">ログインへ</Button>
        </section>
      </main>
      <BottomNav active="mypage" />
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  helper,
  icon,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  helper?: string;
  icon?: ReactNode;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-5 block first:mt-0">
      <span className="text-[15px] font-black text-fuku-black">{label}</span>
      <span className="mt-2 flex min-h-[52px] items-center rounded-full border border-fuku-border px-4">
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent text-[14px] font-bold outline-none placeholder:text-fuku-gray/60" />
        {icon ? <span className="text-fuku-black/70">{icon}</span> : null}
      </span>
      {helper ? <span className="mt-2 block text-[11px] font-bold text-fuku-black">{helper}</span> : null}
    </label>
  );
}

"use client";

import { useState } from "react";
import BottomNav from "./BottomNav";
import Button from "./Button";
import Header from "./Header";
import PageHero from "./PageHero";
import type { FormConfig } from "@/lib/data/forms";

export default function FormPage({ form }: { form: FormConfig }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title={form.title} copy={form.description} />
        <section className="px-4 py-6">
          <div className="rounded-[16px] border border-fuku-border bg-white p-5">
            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-[20px] font-black text-fuku-black">送信ありがとうございました。</p>
                <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">
                  内容を確認のうえ、編集部より必要に応じてご連絡します。
                </p>
                <Button href="/" className="mt-6 w-full">HOMEへ戻る</Button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
              >
                {form.fields.map((field) => (
                  <label key={field} className="block">
                    <span className="text-[12px] font-black text-fuku-black">{field}</span>
                    {field.includes("プロフィール") || field.includes("理由") || field.includes("内容") || field.includes("説明文") ? (
                      <textarea className="mt-2 min-h-[96px] w-full rounded-[10px] border border-fuku-border bg-white px-3 py-3 text-[14px] outline-none focus:border-fuku-red" />
                    ) : field.includes("画像") || field.includes("写真") ? (
                      <div className="mt-2 rounded-[10px] border border-dashed border-fuku-border bg-fuku-light px-3 py-5 text-center text-[12px] font-bold text-fuku-gray">
                        画像アップロード欄
                      </div>
                    ) : (
                      <input className="mt-2 min-h-[44px] w-full rounded-[10px] border border-fuku-border bg-white px-3 text-[14px] outline-none focus:border-fuku-red" />
                    )}
                  </label>
                ))}
                <Button type="submit" className="w-full">{form.buttonLabel}</Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

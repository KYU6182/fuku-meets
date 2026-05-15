"use client";

import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUploadField from "@/components/ImageUploadField";
import PageHero from "@/components/PageHero";
import { getCurrentUserProfile, saveUserProfile } from "@/lib/userCommunity";
import { requireUser } from "@/lib/userAuth";
import type { UserProfile } from "@/types/community";

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const user = requireUser();
    if (!user) return;
    setProfile(getCurrentUserProfile());
  }, []);

  if (!profile) {
    return (
      <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
        <Header />
        <main className="pb-28"><PageHero title="PROFILE EDIT" copy="ログインが必要です。" /></main>
        <BottomNav active="mypage" />
      </div>
    );
  }

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => (current ? { ...current, [key]: value } : current));
  }

  function save() {
    if (!profile) return;
    saveUserProfile(profile);
    router.push("/mypage");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-32">
        <PageHero title="PROFILE EDIT" copy="あなたのプロフィールを編集できます。" />
        <section className="space-y-5 px-4 py-5">
          <div className="rounded-[16px] border border-fuku-border bg-white p-5">
            <div className="grid gap-4 min-[390px]:grid-cols-[112px_1fr]">
              <div className="h-28 w-28 overflow-hidden rounded-full bg-fuku-light">
                {profile.avatar ? <img src={profile.avatar} alt="" className="h-full w-full object-cover" /> : <Camera className="mx-auto mt-10 text-fuku-gray" />}
              </div>
              <div>
                <h2 className="text-[18px] font-black text-fuku-black">プロフィール画像</h2>
                <p className="mt-2 text-[12px] font-bold text-fuku-gray">jpg / png / webp / 5MBまで</p>
                <div className="mt-3">
                  <ImageUploadField value={profile.avatar ? [profile.avatar] : []} maxImages={1} label="画像を変更" onChange={(images) => update("avatar", images[0] ?? "")} />
                </div>
              </div>
            </div>
          </div>
          <FormCard>
            <Input label="表示名" value={profile.displayName} onChange={(value) => update("displayName", value)} />
            <Input label="ユーザーID" value={profile.username} onChange={(value) => update("username", value.replace(/^@/, ""))} helper="公開プロフィールURLに使われます" />
            <TextArea label="自己紹介" value={profile.bio} onChange={(value) => update("bio", value)} />
            <Input label="活動エリア" value={profile.activityArea} onChange={(value) => update("activityArea", value)} />
            <Input label="よく行くエリア" value={profile.favoriteAreas.join("・")} onChange={(value) => update("favoriteAreas", value.split(/[、・,\s]+/).filter(Boolean))} />
            <Input label="性別（任意）" value={profile.gender} onChange={(value) => update("gender", value)} />
            <Input label="年代（任意）" value={profile.ageRange} onChange={(value) => update("ageRange", value)} />
            <Input label="好きなジャンル" value={profile.favoriteGenres.join("・")} onChange={(value) => update("favoriteGenres", value.split(/[、・,\s]+/).filter(Boolean))} />
            <Input label="Instagram" value={profile.instagram} onChange={(value) => update("instagram", value)} />
            <Input label="FUKU TYPE" value={profile.fukuType} onChange={(value) => update("fukuType", value)} />
            <label className="flex items-center justify-between rounded-[12px] bg-fuku-light px-4 py-3 text-[13px] font-black">
              プロフィール公開
              <input type="checkbox" checked={profile.isPublic} onChange={(event) => update("isPublic", event.target.checked)} className="h-6 w-6 accent-fuku-red" />
            </label>
          </FormCard>
        </section>
      </main>
      <div className="fixed inset-x-0 bottom-[82px] z-40 mx-auto grid max-w-[430px] grid-cols-2 gap-3 border-t border-fuku-border bg-white p-4">
        <Button href="/mypage" variant="light">下書き保存</Button>
        <Button onClick={save}>保存する</Button>
      </div>
      <BottomNav active="mypage" />
    </div>
  );
}

function FormCard({ children }: { children: ReactNode }) {
  return <div className="space-y-4 rounded-[16px] border border-fuku-border bg-white p-5">{children}</div>;
}

function Input({ label, value, helper, onChange }: { label: string; value: string; helper?: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[13px] font-black text-fuku-black">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-[10px] border border-fuku-border px-3 text-[13px] font-bold outline-none focus:border-fuku-red" />
      {helper ? <span className="mt-2 block text-[10px] font-bold text-fuku-gray">{helper}</span> : null}
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[13px] font-black text-fuku-black">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full rounded-[10px] border border-fuku-border px-3 py-3 text-[13px] font-bold leading-relaxed outline-none focus:border-fuku-red" maxLength={150} />
      <span className="mt-1 block text-right text-[10px] font-bold text-fuku-gray">{value.length} / 150</span>
    </label>
  );
}

import type { Metadata } from "next";
import { Building2, HelpCircle, MapPin, Utensils } from "lucide-react";
import GuideLayout from "@/components/GuideLayout";
import LinkCard from "@/components/LinkCard";

export const metadata: Metadata = {
  title: "はじめての福岡ガイド | FUKU-MEETS",
  description: "福岡に初めて住む人・遊びに来る人向けに、エリア、グルメ、住みたい街、最初に行きたい店を紹介。",
};

export default function NewInFukuokaPage() {
  return (
    <GuideLayout title="はじめての福岡ガイド" copy="福岡生活の最初の7日を、楽しく迷えるガイド。">
      <LinkCard href="/new-in-fukuoka/standard-spots" title="まず行きたい定番スポット" description="観光名所から日常の寄り道まで。" icon={<MapPin size={20} />} />
      <LinkCard href="/new-in-fukuoka/best-areas-to-live" title="最初に住みたい街" description="家賃、スーパー、駅アクセスで選ぶ。" icon={<Building2 size={20} />} />
      <LinkCard href="/new-in-fukuoka/first-regular-shops" title="はじめての行きつけ特集" description="カフェ、ランチ、美容室まで紹介。" icon={<Utensils size={20} />} />
      <section className="rounded-[16px] border border-fuku-border bg-white p-5">
        <h2 className="flex items-center gap-2 text-[18px] font-black"><HelpCircle size={18} className="text-fuku-red" />よくある質問</h2>
        <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">天神と博多、どちらに住む？車は必要？初めてでも入りやすいお店は？編集部が順次更新します。</p>
      </section>
    </GuideLayout>
  );
}

import { BookOpen, MapPin, Send } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import LinkCard from "@/components/LinkCard";
import PageHero from "@/components/PageHero";
import { magazineIssues, magazineLocations } from "@/lib/data/magazine";

export default function MagazinePage() {
  const latest = magazineIssues[0];

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="FUKU-MEETS MAGAZINE" copy="福岡の空気を、Webと紙で残すローカルマガジン。" />
        <section className="space-y-4 px-4 py-5">
          <a href="/magazine/latest" className="block overflow-hidden rounded-[16px] border border-fuku-border bg-white">
            <div className="h-44 bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${latest.image}')` }} />
            <div className="p-4">
              <p className="text-[10px] font-black text-fuku-red">最新号</p>
              <h2 className="mt-1 text-[18px] font-black">{latest.title}</h2>
              <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{latest.feature}</p>
            </div>
          </a>
          <LinkCard href="/magazine/latest" title="バックナンバー / 特集記事" description="最新号と過去の特集を読む。" icon={<BookOpen size={20} />} />
          <LinkCard href="/magazine/locations" title="設置場所" description={`${magazineLocations.length}店舗から順次拡大中。`} icon={<MapPin size={20} />} />
          <LinkCard href="/forms/paper-placement" title="設置申請CTA" description="FUKU-MEETS MAGAZINEを置いてくれる店舗を募集。" icon={<Send size={20} />} />
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

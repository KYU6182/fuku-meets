import { ArrowRight, Compass, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { getShopGuides } from "@/lib/shopGuides";

const categoryLabels = ["すべて", "ライブ後", "一人参加", "女子会", "観光・遠征"];

export default function ShopGuidesPage() {
  const guides = getShopGuides();

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main className="px-5 pb-28 pt-7">
        <p className="text-[13px] font-black text-fuku-black">← VISITOR GUIDE</p>
        <h1 className="headline-condensed mt-4 text-[44px] uppercase leading-none text-fuku-black">SHOP GUIDES</h1>
        <p className="mt-3 text-[14px] font-black leading-relaxed text-fuku-black">
          ライブ後、一人旅、女子会、観光の夜に使いやすい福岡ガイド。
        </p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categoryLabels.map((label, index) => (
            <span
              key={label}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-black ${
                index === 0 ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white text-fuku-black"
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-4">
          {guides.map((guide) => (
            <a key={guide.slug} href={`/shop-guides/${guide.slug}`} className="overflow-hidden rounded-[16px] border border-fuku-border bg-white shadow-soft">
              <div
                className="h-[156px] bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.38)),url('${guide.image}')` }}
              >
                <div className="flex h-full items-start justify-between p-4">
                  <span className="rounded-full bg-white px-3 py-2 text-[11px] font-black text-fuku-red">{guide.category}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-fuku-black">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-[18px] font-black leading-tight text-fuku-black">{guide.title}</h2>
                <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{guide.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fbfaf7] px-3 py-1.5 text-[10px] font-black text-fuku-black">
                    <MapPin size={12} /> {guide.area}
                  </span>
                  {guide.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[10px] font-black text-fuku-red">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        <a href="/meet/today" className="mt-6 flex min-h-[74px] items-center gap-4 rounded-[16px] border border-fuku-border bg-[#fbfaf7] p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fff1f1] text-fuku-red">
            <Compass size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-black text-fuku-black">今日参加できるMEETを見る</span>
            <span className="mt-1 block text-[11px] font-bold text-fuku-gray">ガイドを読んだら、そのままリアルな福岡へ。</span>
          </span>
          <ArrowRight size={17} />
        </a>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

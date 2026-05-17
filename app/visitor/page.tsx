import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

export default function VisitorPage() {
  const cards = ["ライブ後に行ける店", "博多駅近くで夜ごはん", "一人旅でも入りやすい店", "今日参加できるMEET"];
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main className="px-5 pb-28 pt-7">
        <h1 className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">VISITOR GUIDE</h1>
        <p className="mt-3 text-[14px] font-black leading-relaxed text-fuku-black">遠征・観光・ひとり旅でも、地元のリアルにつながれる。</p>
        <div className="mt-6 grid gap-3">
          {cards.map((card) => (
            <a key={card} href={card.includes("MEET") ? "/meet" : "/news"} className="rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-5 text-[16px] font-black text-fuku-black">
              {card} →
            </a>
          ))}
        </div>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

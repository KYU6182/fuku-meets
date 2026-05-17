import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

export default function StartGuidePage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main className="px-5 pb-28 pt-7">
        <h1 className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">START GUIDE</h1>
        <p className="mt-3 text-[14px] font-black leading-relaxed text-fuku-black">FUKU-MEETSの楽しみ方。ランキングで好きな店を見つけて、MEETで同じ趣味の人と会いにいく。</p>
        <div className="mt-6 grid gap-3">
          {["プロフィールを作る", "今夜のMEETを見る", "ランキングに投票する", "初参加の安心ガイド"].map((item, index) => (
            <a key={item} href={index === 1 ? "/meet" : index === 2 ? "/ranking" : index === 3 ? "/guide/first-meet" : "/auth/register"} className="rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-5 text-[16px] font-black text-fuku-black">
              {index + 1}. {item} →
            </a>
          ))}
        </div>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

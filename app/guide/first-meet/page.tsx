import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

export default function FirstMeetGuidePage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main className="px-5 pb-28 pt-7">
        <h1 className="headline-condensed text-[42px] uppercase leading-none text-fuku-black">FIRST MEET GUIDE</h1>
        <p className="mt-3 text-[14px] font-black leading-relaxed text-fuku-black">初めてでも安心して参加するためのルール。</p>
        <div className="mt-6 space-y-3">
          {["本人確認とレビューで安心", "20歳未満の飲酒は禁止", "連絡先交換の強要は禁止", "通報・ブロック機能があります", "店舗詳細は参加者にのみ共有される場合があります"].map((item) => (
            <div key={item} className="rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-4 text-[13px] font-black text-fuku-black">{item}</div>
          ))}
        </div>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

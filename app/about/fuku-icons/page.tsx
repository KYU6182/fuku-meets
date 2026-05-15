import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";

const sections = [
  {
    title: "FUKU ICONSとは",
    body: "FUKU ICONSは、福岡で活動するモデル、美容師、DJ、アーティスト、インフルエンサー、クリエイターなどを見つけて応援できるFUKU-MEETSの人物企画です。",
  },
  {
    title: "掲載対象",
    body: "モデル、美容師、DJ、アーティスト、カフェ店員、アパレル店員、学生クリエイターなど、福岡のカルチャーをつくる人を紹介します。",
  },
  {
    title: "応援・フォロー・保存について",
    body: "気になるICONSは応援・フォロー・保存できます。応援数や推しコメントは、今後の特集やランキングの参考になります。",
  },
  {
    title: "表紙投票について",
    body: "次のFUKU-MEETS MAGAZINE表紙に出てほしい人へ投票できます。MVPでは1日1票の想定で管理しています。",
  },
  {
    title: "一般エントリーについて",
    body: "福岡で活動している方は、一般エントリーから掲載候補として応募できます。編集部確認後、掲載可否をご連絡します。",
  },
  {
    title: "推し推薦について",
    body: "身近にいる“気になる人”を推薦できます。福岡らしい魅力を持つ人を一緒に見つけていきます。",
  },
];

export default function AboutFukuIconsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero
          title="FUKU ICONSについて"
          copy="福岡で活動する人を見つけて、応援する。"
        />
        <section className="space-y-3 px-4 py-5">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[16px] border border-fuku-border bg-white p-5">
              <h2 className="text-[17px] font-black text-fuku-black">{section.title}</h2>
              <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">{section.body}</p>
            </article>
          ))}
          <div className="grid gap-3 rounded-[16px] border border-[#f5caca] bg-white p-5">
            <Button href="/forms/icon-entry">一般エントリーする</Button>
            <Button href="/forms/icon-recommend" variant="outline">推しを推薦する</Button>
            <Button href="/icons" variant="black">FUKU ICONSを見る</Button>
          </div>
        </section>
      </main>
      <BottomNav active="home" />
    </div>
  );
}

import { ArrowRight, BadgeCheck, Heart, MapPin, Music, Plane, ShieldCheck, UserRound } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

const categoryCards = [
  { title: "ライブ後", description: "終演後に語れる店とMEET", icon: Music },
  { title: "一人参加", description: "ひとり旅の夜も安心", icon: UserRound },
  { title: "女子会", description: "女性参加あり・女性限定", icon: Heart },
  { title: "観光・遠征", description: "福岡に来た夜の入口", icon: Plane },
];

const sections = [
  {
    title: "ライブ後",
    description: "余韻をそのまま話せる場所へ。",
    items: [
      { title: "ライブ後に行ける天神の店", href: "/shop-guides/tenjin-after-live", tag: "店ガイド" },
      { title: "Zepp Fukuoka帰りに参加できるMEET", href: "/shop-guides/zepp-fukuoka-after-live-meet", tag: "MEET" },
      { title: "マリンメッセ帰りに行けるMEET", href: "/shop-guides/marine-messe-after-live-meet", tag: "MEET" },
      { title: "遠征民向け：終演後90分の過ごし方", href: "/shop-guides/after-live-90min-guide", tag: "遠征" },
    ],
  },
  {
    title: "一人参加",
    description: "一人旅でも、地元のリアルにつながれる。",
    items: [
      { title: "博多駅近くで一人でも入れる夜ごはん", href: "/shop-guides/hakata-solo-dinner", tag: "夜ごはん" },
      { title: "福岡ひとり旅の夜に参加できるMEET", href: "/shop-guides/fukuoka-solo-trip-night-meet", tag: "MEET" },
      { title: "一人参加OKって実際どうなの？", href: "/shop-guides/solo-join-guide", tag: "安心" },
      { title: "一人旅でも入りやすい店とMEET", href: "/shop-guides/solo-friendly-night", tag: "ガイド" },
    ],
  },
  {
    title: "女子会",
    description: "女性参加者が選びやすい夜の過ごし方。",
    items: [
      { title: "女性参加ありMEETの安心ポイント", href: "/shop-guides/women-safe-meet-guide", tag: "安心" },
      { title: "女子だけで安心して楽しめる夜", href: "/shop-guides/girls-night-safe-guide", tag: "女子会" },
      { title: "女性限定MEETを見る", href: "/meet?category=女子会", tag: "MEET一覧" },
    ],
  },
  {
    title: "観光・遠征",
    description: "福岡に来た夜、最初に見る入口。",
    items: [
      { title: "福岡に来た夜、まず見るガイド", href: "/shop-guides/visitor-night-guide", tag: "観光" },
      { title: "天神・博多・大名、どこに行けばいい？", href: "/shop-guides/tenjin-hakata-daimyo-guide", tag: "エリア" },
      { title: "今日参加できるMEET", href: "/meet/today", tag: "今日" },
    ],
  },
];

export default function VisitorPage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main className="pb-28">
        <section className="px-5 pt-7">
          <h1 className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">VISITOR GUIDE</h1>
          <h2 className="mt-5 text-[26px] font-black leading-tight text-fuku-black">福岡に来た夜、どこ行く？</h2>
          <p className="mt-3 text-[14px] font-bold leading-relaxed text-fuku-gray">
            ライブ後、一人旅、女子会、観光の夜。地元のリアルにつながる店とMEETを見つけよう。
          </p>
          <div className="mt-5 grid gap-3">
            <a href="/meet/today" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white">
              今日参加できるMEETを見る
              <ArrowRight size={16} />
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href="/meet?category=音楽・ライブ" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-fuku-border text-[12px] font-black text-fuku-black">ライブ後MEET</a>
              <a href="/meet?tag=一人参加OK" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-fuku-border text-[12px] font-black text-fuku-black">一人参加OK</a>
            </div>
          </div>
        </section>

        <section className="mt-7 px-5">
          <div className="grid grid-cols-2 gap-3">
            {categoryCards.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-[16px] border border-fuku-border bg-[#fbfaf7] p-4">
                <Icon className="text-fuku-red" size={24} />
                <p className="mt-3 text-[15px] font-black text-fuku-black">{title}</p>
                <p className="mt-1 text-[10px] font-bold leading-relaxed text-fuku-gray">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-7 px-5">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="headline-condensed text-[30px] uppercase leading-none text-fuku-black">{section.title}</p>
                  <p className="mt-2 text-[12px] font-bold text-fuku-gray">{section.description}</p>
                </div>
              </div>
              <div className="grid gap-3">
                {section.items.map((item) => (
                  <a key={item.title} href={item.href} className="flex min-h-[76px] items-center gap-3 rounded-[14px] border border-fuku-border bg-white p-3 shadow-soft">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff1f1] text-fuku-red">
                      <MapPin size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-black leading-tight text-fuku-black">{item.title}</span>
                      <span className="mt-1 inline-block rounded-full bg-[#fbfaf7] px-2 py-1 text-[10px] font-black text-fuku-gray">{item.tag}</span>
                    </span>
                    <ArrowRight size={17} />
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mx-5 mt-8 rounded-[18px] border border-fuku-border bg-[#fff1f1] p-5">
          <h2 className="inline-flex items-center gap-2 text-[20px] font-black text-fuku-black">
            <ShieldCheck className="text-fuku-red" />
            安心して参加するために
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {["店舗詳細は参加後共有", "一人参加OK", "女性参加あり", "20歳以上確認", "通報・ブロック", "幹事レビュー"].map((item) => (
              <span key={item} className="rounded-[10px] bg-white px-3 py-2 text-[10px] font-black text-fuku-black">
                <BadgeCheck size={13} className="mr-1 inline text-fuku-red" />
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

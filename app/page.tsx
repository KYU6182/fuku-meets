import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import FollowUsSection from "@/components/FollowUsSection";
import FukuIconsSection from "@/components/FukuIconsSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NewInFukuokaSection from "@/components/NewInFukuokaSection";
import PaperSection from "@/components/PaperSection";
import PickUpContentsSection from "@/components/PickUpContentsSection";
import RankingSection from "@/components/RankingSection";
import WeekendGuideSection from "@/components/WeekendGuideSection";

const iconsData = [
  {
    rank: 1,
    image: "/images/yui.jpg",
    name: "YUI",
    genre: "model・creator",
    votes: "1.2k",
  },
  {
    rank: 2,
    image: "/images/rena.jpg",
    name: "RENA",
    genre: "model",
    votes: "987",
  },
  {
    rank: 3,
    image: "/images/keita.jpg",
    name: "KEITA",
    genre: "artist",
    votes: "873",
  },
];

const rankingCategories = [
  { label: "カフェ", active: true },
  { label: "モデル" },
  { label: "好きなスーパー" },
  { label: "居酒屋" },
  { label: "パン" },
  { label: "住みたい街" },
];

const cafeRanking = [
  {
    rank: 1,
    image: "/images/cafe-1.jpg",
    title: "manu coffee",
    area: "大名・赤坂",
    description: "朝から夜までふらっと寄れる、福岡らしい距離感の定番カフェ。",
    votes: "1,245票",
  },
  {
    rank: 2,
    image: "/images/cafe-2.jpg",
    title: "café mitu",
    area: "薬院",
    description: "落ち着いた空気と丁寧な一杯で、週末の予定に入れたい場所。",
    votes: "987票",
  },
  {
    rank: 3,
    image: "/images/cafe-3.jpg",
    title: "Sabrina Coffee",
    area: "薬院",
    description: "友だちにも一人時間にも使いやすい、街に馴染むコーヒースタンド。",
    votes: "742票",
  },
];

const dailyRanking = [
  {
    title: "好きなスーパー TOP3",
    items: [
      { rank: 1, name: "ボンラパス", votes: "1,156票" },
      { rank: 2, name: "サニー", votes: "978票" },
      { rank: 3, name: "にしてつストア", votes: "845票" },
    ],
  },
  {
    title: "モデル TOP3",
    items: [
      { rank: 1, name: "YUI", votes: "1,024票" },
      { rank: 2, name: "RENA", votes: "892票" },
      { rank: 3, name: "KEITA", votes: "732票" },
    ],
  },
];

const weekendCategories = [
  { label: "居酒屋", icon: "Beer" },
  { label: "ラーメン", icon: "Soup" },
  { label: "美容室", icon: "Scissors" },
  { label: "カフェ", icon: "Coffee" },
  { label: "パン", icon: "Croissant" },
  { label: "シーシャ", icon: "Utensils" },
  { label: "クラブ", icon: "Music2" },
  { label: "人気ランキング", icon: "Crown", active: true },
];

const weekendSelects = [
  {
    image: "/images/cafe-2.jpg",
    label: "CAFE",
    title: "薬院の隠れ家カフェ3選",
    description: "ゆったり過ごせる、隠れ家カフェまとめ。",
  },
  {
    image: "/images/ramen.jpg",
    label: "RAMEN",
    title: "大名の深夜ラーメン",
    description: "夜中に食べたくなる、あの一杯。",
  },
  {
    image: "/images/club.jpg",
    label: "CLUB",
    title: "週末クラブアドレス",
    description: "音楽と人に出会う、週末のおすすめ。",
  },
];

const newInFukuokaItems = [
  {
    icon: "MapPin",
    title: "まず行きたい定番スポット",
    description: "福岡の人気エリアや観光名所を紹介",
  },
  {
    icon: "Building2",
    title: "最初に住みたい街",
    description: "住環境や家賃の目安、エリアを厳選",
  },
  {
    icon: "Utensils",
    title: "はじめての行きつけ特集",
    description: "カフェ、ランチ、美容室まで紹介",
  },
];

const pickupContents = [
  {
    image: "/images/news-1.jpg",
    label: "LOCAL NEWS",
    title: "いま、福岡で注目したい人と店、まちの話題。",
    date: "2026.05.14",
  },
  {
    image: "/images/news-2.jpg",
    label: "FEATURE",
    title: "いま行きたい福岡の注目グルメ特集。",
    date: "2026.05.12",
  },
  {
    image: "/images/news-3.jpg",
    label: "CITY GUIDE",
    title: "知らないと損する、エリア別・福岡ガイド。",
    date: "2026.05.10",
  },
];

const footerLinks = [
  {
    title: "ABOUT",
    links: ["FUKU-MEETSについて", "ランキングについて", "FUKU ICONS"],
  },
  {
    title: "CONTACT",
    links: ["お問い合わせ", "掲載について", "イベント投稿"],
  },
  {
    title: "参加する",
    links: ["店舗推薦", "ランキングテーマ提案", "フリーペーパー設置申請"],
  },
  {
    title: "FUKU ICONS",
    links: ["一般エントリー", "推しを推薦", "表紙投票"],
  },
];

function HomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main>
        <HeroSection />
        <FukuIconsSection iconsData={iconsData} />
        <RankingSection
          rankingCategories={rankingCategories}
          cafeRanking={cafeRanking}
          dailyRanking={dailyRanking}
        />
        <WeekendGuideSection
          weekendCategories={weekendCategories}
          weekendSelects={weekendSelects}
        />
        <NewInFukuokaSection newInFukuokaItems={newInFukuokaItems} />
        <PaperSection />
        <PickUpContentsSection pickupContents={pickupContents} />
        <FollowUsSection />
      </main>
      <Footer footerLinks={footerLinks} />
      <BottomNav />
    </div>
  );
}

export default function Page() {
  return <HomePage />;
}

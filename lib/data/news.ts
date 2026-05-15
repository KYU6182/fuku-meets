export type NewsArticle = {
  id: string;
  slug: string;
  category: string;
  title: string;
  date: string;
  image: string;
  summary: string;
  body: string[];
};

export const newsArticles = [
  {
    id: "local-news-fukuoka-now",
    slug: "local-news-fukuoka-now",
    category: "ローカルニュース",
    title: "福岡の夜を彩る新しいバーがオープン",
    date: "2026.05.13",
    image: "/images/news-1.jpg",
    summary: "大名エリアに、こだわりのカクテルと音楽を楽しめる新しいバーがオープンしました。",
    body: [
      "大名エリアに、夜の散歩途中にも立ち寄りやすい新スポットが登場しました。",
      "FUKU-MEETS編集部では、店内の雰囲気、使いやすい時間帯、近くのおすすめスポットをまとめて紹介します。",
    ],
  },
  {
    id: "fukuoka-food-feature",
    slug: "fukuoka-food-feature",
    category: "グルメ",
    title: "いま行きたい福岡の注目グルメ特集",
    date: "2026.05.12",
    image: "/images/news-2.jpg",
    summary: "カフェ、ラーメン、居酒屋まで、週末に行きたい注目店をピックアップ。",
    body: [
      "今週は、保存数と投票が伸びている店を中心に編集部がセレクトしました。",
      "友達との夜ごはんにも、ひとり時間にも使いやすいお店を紹介しています。",
    ],
  },
  {
    id: "area-guide-fukuoka",
    slug: "area-guide-fukuoka",
    category: "CITY GUIDE",
    title: "知らないと損する、エリア別・福岡ガイド",
    date: "2026.05.10",
    image: "/images/news-3.jpg",
    summary: "天神、大名、薬院、博多。福岡の主要エリアを使い分けるためのガイド。",
    body: [
      "福岡に来たばかりの人にも、もう少し深く街を知りたい人にも向けたエリアガイドです。",
      "買い物、ごはん、夜遊び、暮らしやすさの視点で、それぞれの街を見ていきます。",
    ],
  },
] satisfies NewsArticle[];

export function getNewsBySlug(slug: string) {
  return newsArticles.find((article) => article.slug === slug) ?? newsArticles[0];
}

export type FormConfig = {
  slug: string;
  title: string;
  description: string;
  fields: string[];
  buttonLabel: string;
};

export const forms = [
  {
    slug: "icon-entry",
    title: "FUKU ICONS 一般エントリー",
    description: "モデル・美容師・アーティストなど、あなたの魅力をFUKU ICONSで発信しよう。",
    fields: ["名前", "Instagram", "ジャンル", "活動エリア", "プロフィール", "写真アップロード", "応募理由"],
    buttonLabel: "一般エントリーを送信",
  },
  {
    slug: "icon-recommend",
    title: "推しを推薦する",
    description: "身近にいる“気になる人”を推薦して、一緒に福岡を盛り上げよう。",
    fields: ["推薦したい人の名前", "Instagram", "ジャンル", "推薦理由", "推薦者の連絡先"],
    buttonLabel: "推薦を送信",
  },
  {
    slug: "cover-vote",
    title: "表紙投票フォーム",
    description: "次号の表紙で見たいFUKU ICONを教えてください。",
    fields: ["投票したい人", "応援コメント", "ニックネーム"],
    buttonLabel: "表紙に投票する",
  },
  {
    slug: "shop-recommend",
    title: "店舗推薦",
    description: "FUKU-MEETSで紹介したい福岡のお店を教えてください。",
    fields: ["店舗名", "エリア", "ジャンル", "Instagram", "推薦理由", "連絡先"],
    buttonLabel: "店舗を推薦する",
  },
  {
    slug: "ranking-theme",
    title: "ランキングテーマ提案",
    description: "次に見たいランキングテーマを募集しています。",
    fields: ["テーマ名", "理由", "おすすめ候補", "連絡先"],
    buttonLabel: "テーマを提案する",
  },
  {
    slug: "event-submit",
    title: "イベント投稿",
    description: "福岡のイベント情報を編集部に送れます。",
    fields: ["イベント名", "開催日", "開催時間", "場所", "エリア", "ジャンル", "主催者名", "Instagram", "画像", "説明文", "掲載希望日", "連絡先"],
    buttonLabel: "イベントを投稿する",
  },
  {
    slug: "contact",
    title: "お問い合わせ",
    description: "ご質問・ご相談はこちらからお送りください。",
    fields: ["お名前", "メールアドレス", "お問い合わせ種別", "内容"],
    buttonLabel: "送信する",
  },
  {
    slug: "listing",
    title: "掲載について",
    description: "FUKU-MEETSへの掲載相談はこちらから。",
    fields: ["店舗名 / 団体名", "担当者名", "メールアドレス", "掲載希望内容"],
    buttonLabel: "掲載相談を送る",
  },
  {
    slug: "paper-placement",
    title: "フリーペーパー設置申請",
    description: "FUKU-MEETS MAGAZINEを設置いただける店舗を募集しています。",
    fields: ["店舗名", "エリア", "住所", "担当者名", "メールアドレス", "設置可能部数"],
    buttonLabel: "設置申請を送る",
  },
  {
    slug: "newsletter",
    title: "最新情報を受け取る",
    description: "福岡の“いま”をメールでお届けします。",
    fields: ["メールアドレス", "興味のあるジャンル"],
    buttonLabel: "登録する",
  },
] satisfies FormConfig[];

export function getFormBySlug(slug: string) {
  return forms.find((form) => form.slug === slug) ?? forms[0];
}

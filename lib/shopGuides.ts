import { defaultCommunities } from "@/lib/communityMeet";

export type ShopGuide = {
  id: string;
  slug: string;
  type: "shop_guide" | "live_guide" | "visitor_guide";
  category: "ライブ後" | "一人参加" | "女子会" | "観光・遠征";
  title: string;
  excerpt: string;
  image: string;
  area: string;
  tags: string[];
  items: {
    name: string;
    description: string;
    area: string;
    note: string;
  }[];
  body: string[];
  relatedMeetIds: string[];
  relatedLinks?: { label: string; href: string }[];
  placeholderNote?: string;
};

const placeholderNote = "店舗名や営業時間は公開前に公式サイト・Google Maps・店舗公式SNSで確認してください。";

export const shopGuides: ShopGuide[] = [
  {
    id: "tenjin-after-live",
    slug: "tenjin-after-live",
    type: "shop_guide",
    category: "ライブ後",
    title: "ライブ後に行ける天神の店",
    excerpt: "終演後の余韻をそのまま話せる、天神エリアの夜ごはん・カフェ候補。",
    image: "/images/meet/creep-live.jpg",
    area: "天神",
    tags: ["ライブ後", "天神", "徒歩圏", "一人参加OK"],
    relatedMeetIds: ["creep-hype-live-drink", "drink-now-tenjin"],
    body: [
      "ライブ後は移動時間が短く、会話しやすい場所を選ぶのが安心です。FUKU-MEETSでは、具体的な店舗名を断定せず、開催MEETごとに参加確定者へ詳細店舗を共有します。",
      "天神エリアは終演後の合流に使いやすく、少人数で感想を話すMEETとも相性がよいエリアです。",
    ],
    items: [
      { name: "天神駅近くの夜カフェ候補", description: "ライブ後でも落ち着いて話せる、駅近のカフェ・喫茶系候補。", area: "天神", note: placeholderNote },
      { name: "少人数で入りやすい居酒屋候補", description: "余韻を話しながら軽く食べたい時の候補。", area: "天神", note: placeholderNote },
      { name: "終電前に寄れる軽食候補", description: "短時間でも使いやすい、駅導線の夜ごはん候補。", area: "天神", note: placeholderNote },
    ],
  },
  {
    id: "zepp-fukuoka-after-live-meet",
    slug: "zepp-fukuoka-after-live-meet",
    type: "live_guide",
    category: "ライブ後",
    title: "Zepp Fukuoka帰りに参加できるMEET",
    excerpt: "Zepp Fukuoka周辺から天神・博多へ移動して、同じライブ好きと合流する流れ。",
    image: "/images/fukuoka-city.jpg",
    area: "地行浜 / 天神",
    tags: ["Zepp Fukuoka", "ライブ後MEET", "遠征歓迎"],
    relatedMeetIds: ["creep-hype-live-drink"],
    body: [
      "Zepp Fukuoka帰りは、終演後すぐに大人数で移動しすぎないことがポイント。FUKU-MEETSでは参加確定後に集合場所を共有し、初参加でも迷いにくい導線にします。",
      "遠征の夜をひとりで終わらせたくない人は、ライブ後MEETから同じ熱量の人を探せます。",
    ],
    items: [
      { name: "Zepp帰りの合流しやすいエリア", description: "天神・博多方面へ移動してから少人数で集まりやすい候補。", area: "天神 / 博多", note: placeholderNote },
      { name: "ライブ後MEET候補", description: "同じアーティストや近いジャンルで語れるMEET。", area: "天神", note: "関連MEETから最新開催を確認してください。" },
    ],
  },
  {
    id: "marine-messe-after-live-meet",
    slug: "marine-messe-after-live-meet",
    type: "live_guide",
    category: "ライブ後",
    title: "マリンメッセ帰りに行けるMEET",
    excerpt: "マリンメッセ福岡の終演後に、博多・天神方面で合流しやすいMEET導線。",
    image: "/images/weekend-night.jpg",
    area: "築港 / 博多 / 天神",
    tags: ["マリンメッセ", "ライブ後", "遠征"],
    relatedMeetIds: ["visitor-fukuoka-first-night", "drink-now-tenjin"],
    body: [
      "大きな会場の終演後は混雑しやすいため、店舗詳細は参加確定後に共有し、集合目印を明確にする運用にしています。",
      "博多・天神どちらにも動けるため、宿泊場所や終電に合わせてMEETを選びやすい導線です。",
    ],
    items: [
      { name: "博多方面の夜ごはん候補", description: "宿泊が博多の人に向けた夜ごはん候補。", area: "博多", note: placeholderNote },
      { name: "天神方面の感想会候補", description: "ライブ後に少し飲みながら話したい人向け。", area: "天神", note: placeholderNote },
    ],
  },
  {
    id: "after-live-90min-guide",
    slug: "after-live-90min-guide",
    type: "visitor_guide",
    category: "観光・遠征",
    title: "遠征民向け：終演後90分の過ごし方",
    excerpt: "終演後に迷わないための、移動・合流・夜ごはんの考え方。",
    image: "/images/fukuoka-city.jpg",
    area: "福岡市内",
    tags: ["遠征", "ライブ後", "90分"],
    relatedMeetIds: ["creep-hype-live-drink", "visitor-fukuoka-first-night"],
    body: [
      "終演後90分は、移動・荷物・終電・空腹が重なりやすい時間です。まずは宿泊地と帰りの交通を確認し、無理なく参加できるMEETを選びましょう。",
      "FUKU-MEETSのMEETは店舗詳細を参加後に共有するため、公開ページでは大まかなエリアだけを確認できます。",
    ],
    items: [
      { name: "0〜30分：会場周辺で身支度", description: "混雑を避けながら、合流連絡と移動先を確認。", area: "会場周辺", note: "連絡先交換の強要は禁止です。" },
      { name: "30〜60分：天神・博多へ移動", description: "宿泊地やMEET集合エリアに合わせて移動。", area: "天神 / 博多", note: "終電時間を必ず確認してください。" },
      { name: "60〜90分：MEETに参加", description: "同じライブ好きと感想を話せる時間。", area: "参加MEET", note: "店舗詳細は参加確定後に共有されます。" },
    ],
  },
  {
    id: "hakata-solo-dinner",
    slug: "hakata-solo-dinner",
    type: "shop_guide",
    category: "一人参加",
    title: "博多駅近くで一人でも入れる夜ごはん",
    excerpt: "出張・遠征・ひとり旅の夜に使いやすい、博多駅近くの夜ごはん候補。",
    image: "/images/news-3.jpg",
    area: "博多",
    tags: ["博多駅", "一人旅", "夜ごはん"],
    relatedMeetIds: ["visitor-fukuoka-first-night"],
    body: [
      "博多駅周辺は宿泊や移動の拠点になりやすく、ひとりでも夜ごはんを済ませやすいエリアです。",
      "具体的な店舗情報は公開前に公式情報で確認し、MEETでは参加確定者へ詳細を共有します。",
    ],
    items: [
      { name: "駅近の定食・軽食候補", description: "移動前後でも入りやすい、短時間利用向け。", area: "博多駅周辺", note: placeholderNote },
      { name: "カウンター中心の夜ごはん候補", description: "ひとりでも席を取りやすい店を探す時の観点。", area: "博多", note: placeholderNote },
    ],
  },
  {
    id: "solo-friendly-night",
    slug: "solo-friendly-night",
    type: "visitor_guide",
    category: "一人参加",
    title: "一人旅でも入りやすい店とMEET",
    excerpt: "初めての福岡の夜を、一人で終わらせないための入口。",
    image: "/images/news-2.jpg",
    area: "天神 / 博多 / 薬院",
    tags: ["一人参加OK", "ひとり旅", "初参加"],
    relatedMeetIds: ["yuru-cafe-yakuin", "visitor-fukuoka-first-night"],
    body: [
      "一人旅の夜は、入りやすさと安心感が大事です。FUKU-MEETSでは、一人参加OKや女性参加ありなどの表示で選びやすくしています。",
      "MEETに参加する場合、店舗詳細は参加確定後に共有されるため、公開ページではエリアと雰囲気を確認しましょう。",
    ],
    items: [
      { name: "一人参加OK MEET", description: "初参加でも会話に入りやすい少人数MEET。", area: "福岡市内", note: "プロフィール設定後に参加できます。" },
      { name: "ひとり夜ごはん候補", description: "カウンター・駅近・短時間利用を軸に探す。", area: "天神 / 博多", note: placeholderNote },
    ],
  },
  {
    id: "fukuoka-solo-trip-night-meet",
    slug: "fukuoka-solo-trip-night-meet",
    type: "visitor_guide",
    category: "一人参加",
    title: "福岡ひとり旅の夜に参加できるMEET",
    excerpt: "地元民や同じ遠征勢と、ゆるく福岡の夜を楽しむMEETまとめ。",
    image: "/images/fukuoka-city.jpg",
    area: "福岡市内",
    tags: ["ひとり旅", "遠征歓迎", "MEET"],
    relatedMeetIds: ["visitor-fukuoka-first-night", "yuru-cafe-yakuin"],
    body: [
      "福岡に来た夜、予定が空いたら一人参加OKのMEETを見てみましょう。地元民のおすすめを聞ける会もあります。",
      "安全のため、連絡先交換の強要や迷惑行為は禁止です。",
    ],
    items: [
      { name: "遠征歓迎MEET", description: "福岡に来たばかりの人も話しやすい会。", area: "博多 / 天神", note: "関連MEETを確認してください。" },
      { name: "カフェ・作業MEET", description: "飲みではない夜や昼の交流にも使いやすい。", area: "薬院", note: "開催時間を確認してください。" },
    ],
  },
  {
    id: "solo-join-guide",
    slug: "solo-join-guide",
    type: "visitor_guide",
    category: "一人参加",
    title: "一人参加OKって実際どうなの？",
    excerpt: "初参加の不安を減らすための、参加前チェックガイド。",
    image: "/images/news-1.jpg",
    area: "福岡市内",
    tags: ["初参加", "安心", "一人参加OK"],
    relatedMeetIds: ["yuru-cafe-yakuin"],
    body: [
      "一人参加OKのMEETは、初参加の人が入りやすいように人数・男女比・タグを見える化しています。",
      "プロフィール設定、参加ルール確認、参加後レビューで安心して楽しめる場づくりを目指しています。",
    ],
    items: [
      { name: "参加前に見るポイント", description: "人数、男女比、年齢層、幹事レビューを確認。", area: "全エリア", note: "不安がある場合は女性参加あり・本人確認推奨を選びましょう。" },
    ],
  },
  {
    id: "women-safe-meet-guide",
    slug: "women-safe-meet-guide",
    type: "visitor_guide",
    category: "女子会",
    title: "女性参加ありMEETの安心ポイント",
    excerpt: "女性参加者が安心して選びやすいMEETの見方。",
    image: "/images/meet/girls-daimyo.jpg",
    area: "大名 / 天神 / 薬院",
    tags: ["女性参加あり", "女性限定", "レビュー"],
    relatedMeetIds: ["girls-daimyo"],
    body: [
      "FUKU-MEETSでは、女性参加あり・女性限定・男女比表示・幹事レビューなどを見ながらMEETを選べます。",
      "迷惑行為や勧誘は禁止。通報・ブロック機能を前提に、安心してつながれる場を目指します。",
    ],
    items: [
      { name: "女性限定MEET", description: "女子会や夜カフェなど、女性だけで楽しめる会。", area: "大名 / 薬院", note: "参加条件を確認してください。" },
      { name: "女性参加ありMEET", description: "男女比を見ながら選べる通常MEET。", area: "天神 / 博多", note: "最新の参加状況を確認してください。" },
    ],
  },
  {
    id: "girls-night-safe-guide",
    slug: "girls-night-safe-guide",
    type: "shop_guide",
    category: "女子会",
    title: "女子だけで安心して楽しめる夜",
    excerpt: "大名・薬院の夜カフェやごはん会を中心に、女性限定MEETへつなげるガイド。",
    image: "/images/meet/girls-daimyo.jpg",
    area: "大名 / 薬院",
    tags: ["女子会", "夜カフェ", "女性限定"],
    relatedMeetIds: ["girls-daimyo"],
    body: [
      "女子会は、移動しやすさ・会話しやすさ・帰りやすさを重視するのがおすすめです。",
      "具体的な店舗詳細は参加確定後に共有されます。",
    ],
    items: [
      { name: "大名のごはん会候補", description: "友達同士でも初参加でも使いやすい雰囲気を重視。", area: "大名", note: placeholderNote },
      { name: "薬院の夜カフェ候補", description: "落ち着いて話せる夜カフェ系の候補。", area: "薬院", note: placeholderNote },
    ],
  },
  {
    id: "visitor-night-guide",
    slug: "visitor-night-guide",
    type: "visitor_guide",
    category: "観光・遠征",
    title: "福岡に来た夜、まず見るガイド",
    excerpt: "福岡の夜を安心して楽しむための、MEET・店・エリアの入口。",
    image: "/images/fukuoka-city.jpg",
    area: "福岡市内",
    tags: ["観光", "遠征", "初めての福岡"],
    relatedMeetIds: ["visitor-fukuoka-first-night"],
    body: [
      "福岡に来た夜は、宿泊地・帰りの交通・行きたいエリアを先に決めておくと動きやすくなります。",
      "FUKU-MEETSでは、観光や遠征で来た人も参加しやすいMEETを用意しています。",
    ],
    items: [
      { name: "博多", description: "駅近で宿泊や移動に便利。夜ごはん候補も探しやすいエリア。", area: "博多", note: "店舗情報は公式確認を推奨。" },
      { name: "天神", description: "ライブ後や買い物後の合流にも使いやすい中心エリア。", area: "天神", note: "終電・宿泊地を確認してください。" },
      { name: "大名・薬院", description: "カフェ、居酒屋、カルチャー感のある夜に向いたエリア。", area: "大名 / 薬院", note: "移動時間を確認してください。" },
    ],
  },
  {
    id: "tenjin-hakata-daimyo-guide",
    slug: "tenjin-hakata-daimyo-guide",
    type: "visitor_guide",
    category: "観光・遠征",
    title: "天神・博多・大名、どこに行けばいい？",
    excerpt: "遠征・観光の夜に迷いやすい主要エリアの使い分け。",
    image: "/images/fukuoka-city.jpg",
    area: "天神 / 博多 / 大名",
    tags: ["エリアガイド", "観光", "夜ごはん"],
    relatedMeetIds: ["drink-now-tenjin", "visitor-fukuoka-first-night"],
    body: [
      "天神は合流、博多は移動、大名はカルチャー感のある夜に使いやすいエリアです。",
      "MEETを選ぶときは、開催エリア・開始時間・参加者層を見て、自分の宿泊地や予定に合うものを選びましょう。",
    ],
    items: [
      { name: "天神", description: "買い物、ライブ後、夜ごはんの合流に便利。", area: "天神", note: "混雑時間に注意。" },
      { name: "博多", description: "駅近で一人旅・出張・遠征の拠点にしやすい。", area: "博多", note: "宿泊地との距離を確認。" },
      { name: "大名", description: "カフェ、バー、カルチャー寄りの夜を楽しみやすい。", area: "大名", note: "終電・帰路を確認。" },
    ],
  },
];

export function getShopGuides() {
  return shopGuides;
}

export function getShopGuideBySlug(slug: string) {
  return shopGuides.find((guide) => guide.slug === slug) ?? shopGuides[0];
}

export function getRelatedMeets(ids: string[]) {
  const picked = ids.map((id) => defaultCommunities.find((meet) => meet.id === id || meet.slug === id)).filter(Boolean);
  return (picked.length ? picked : defaultCommunities.slice(0, 2)) as typeof defaultCommunities;
}

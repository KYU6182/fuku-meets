export type FukuIcon = {
  id: string;
  slug: string;
  rank: number;
  name: string;
  category: string;
  tab: string;
  area: string;
  votes: number;
  supportCount?: number;
  attention: string;
  image: string;
  heroImage?: string;
  galleryImages?: string[];
  instagram: string;
  copy: string;
  profileText?: string;
  interviewText?: string;
  tags: string[];
  favoriteSpots: string[];
  comments: { user: string; text: string; avatarUrl?: string }[];
};

export const icons = [
  {
    id: "yui",
    slug: "yui",
    rank: 1,
    name: "YUI",
    category: "model / creator",
    tab: "モデル",
    area: "天神エリア",
    votes: 2430,
    attention: "98.7%",
    image: "/images/icons/yui.jpg",
    instagram: "@yui_fukuoka",
    copy: "福岡から全国へ。いま注目したい次世代アイコン。",
    tags: ["model", "creator", "天神", "表紙候補"],
    favoriteSpots: ["薬院の静かなカフェ", "大名の美容室", "天神の夜カフェ"],
    comments: [
      { user: "@fuku_love", text: "自然体なのに芯があって、見ているだけで元気をもらえます。" },
      { user: "@tenjin_girl", text: "福岡っぽい感性があるところが好き。" },
    ],
  },
  {
    id: "rena",
    slug: "rena",
    rank: 2,
    name: "RENA",
    category: "model",
    tab: "モデル",
    area: "大名エリア",
    votes: 1982,
    attention: "94.1%",
    image: "/images/icons/rena.jpg",
    instagram: "@rena_daimyo",
    copy: "大名のストリート感をまとった注目モデル。",
    tags: ["model", "大名", "fashion"],
    favoriteSpots: ["大名の美容室", "今泉のカフェ", "赤坂の古着店"],
    comments: [{ user: "@daimyo_walk", text: "世界観がある。投稿を見ていると福岡を歩きたくなる。" }],
  },
  {
    id: "anna",
    slug: "anna",
    rank: 3,
    name: "ANNA",
    category: "model",
    tab: "モデル",
    area: "天神エリア",
    votes: 1540,
    attention: "91.4%",
    image: "/images/icons/anna.jpg",
    instagram: "@anna_fuku",
    copy: "透明感のあるビジュアルで支持される福岡モデル。",
    tags: ["model", "天神", "beauty"],
    favoriteSpots: ["天神の夜カフェ", "薬院の花屋", "大名のフォトスタジオ"],
    comments: [{ user: "@camera_lover", text: "撮影の世界観がかっこいい。いつもチェックしています。" }],
  },
  {
    id: "mio",
    slug: "mio",
    rank: 4,
    name: "MIO",
    category: "model",
    tab: "モデル",
    area: "薬院エリア",
    votes: 1322,
    attention: "88.6%",
    image: "/images/icons/mio.jpg",
    instagram: "@mio_yakuin",
    copy: "柔らかいカラーと日常感が魅力のモデル。",
    tags: ["model", "薬院"],
    favoriteSpots: ["薬院カフェ", "平尾のパン屋", "大濠の公園"],
    comments: [{ user: "@coffee_trip", text: "雰囲気がやさしくて好き。" }],
  },
  {
    id: "sora",
    slug: "sora",
    rank: 5,
    name: "SORA",
    category: "美容師 / creator",
    tab: "美容師",
    area: "大名エリア",
    votes: 1108,
    attention: "86.3%",
    image: "/images/icons/sora.jpg",
    instagram: "@sora_hair",
    copy: "大名で支持されるヘアクリエイター。",
    tags: ["美容師", "creator", "大名"],
    favoriteSpots: ["大名のサロン", "今泉の喫茶", "天神のセレクトショップ"],
    comments: [{ user: "@hair_fuku", text: "カットのラインがきれい。" }],
  },
  {
    id: "keita",
    slug: "keita",
    rank: 6,
    name: "KEITA",
    category: "DJ / producer",
    tab: "DJ",
    area: "中洲エリア",
    votes: 987,
    attention: "83.9%",
    image: "/images/icons/keita.jpg",
    instagram: "@keita_night",
    copy: "福岡の夜を熱くするDJ / producer。",
    tags: ["DJ", "producer", "中洲"],
    favoriteSpots: ["中洲のクラブ", "大名のバー", "天神の深夜ラーメン"],
    comments: [{ user: "@night_fuku", text: "イベントの空気感が最高。" }],
  },
  {
    id: "haru",
    slug: "haru",
    rank: 7,
    name: "HARU",
    category: "モデル",
    tab: "モデル",
    area: "薬院エリア",
    votes: 742,
    attention: "80.2%",
    image: "/images/icons/haru.jpg",
    instagram: "@haru_fuku",
    copy: "新しく参加した注目モデル。",
    tags: ["モデル", "NEW"],
    favoriteSpots: ["薬院カフェ", "六本松の本屋"],
    comments: [{ user: "@newface", text: "これからが楽しみ。" }],
  },
  {
    id: "kento",
    slug: "kento",
    rank: 8,
    name: "KENTO",
    category: "クリエイター",
    tab: "クリエイター",
    area: "大名エリア",
    votes: 734,
    attention: "79.4%",
    image: "/images/icons/kento.jpg",
    instagram: "@kento_create",
    copy: "ローカルカルチャーを発信するクリエイター。",
    tags: ["クリエイター", "大名"],
    favoriteSpots: ["大名のギャラリー", "今泉のバー"],
    comments: [{ user: "@local_editor", text: "切り取り方が上手い。" }],
  },
  {
    id: "rina",
    slug: "rina",
    rank: 9,
    name: "RINA",
    category: "インフルエンサー",
    tab: "インフルエンサー",
    area: "天神エリア",
    votes: 690,
    attention: "77.9%",
    image: "/images/icons/rina.jpg",
    instagram: "@rina_tenjin",
    copy: "福岡の日常を軽やかに届けるインフルエンサー。",
    tags: ["インフルエンサー", "天神"],
    favoriteSpots: ["天神カフェ", "大名の美容室"],
    comments: [{ user: "@tenjin_news", text: "紹介するお店がいつも良い。" }],
  },
] satisfies FukuIcon[];

export const iconComments = icons.flatMap((icon) =>
  icon.comments.map((comment) => ({ ...comment, iconName: icon.name, iconSlug: icon.slug })),
);

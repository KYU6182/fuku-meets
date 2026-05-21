import type { CommunityHost, CommunityMeet, CommunityParticipant, CommunityReview } from "@/types/communityMeet";

const keys = {
  communities: "fuku_communities",
  participants: "fuku_community_participants",
  interests: "fuku_community_interests",
  reviews: "fuku_community_reviews",
  hosts: "fuku_community_hosts",
};

const now = "2024-05-16T09:00:00.000Z";

export const meetCategories = [
  { id: "music", label: "音楽・ライブ", caption: "音楽好きが集まる" },
  { id: "drink-now", label: "今から飲み", caption: "今すぐ飲める人集合" },
  { id: "midnight", label: "深夜・朝まで", caption: "夜更かし大歓迎" },
  { id: "girls", label: "女子会", caption: "女子だけで楽しもう" },
  { id: "solo", label: "一人参加OK", caption: "初めてでも安心" },
  { id: "visitor", label: "遠征・観光", caption: "福岡に来た人へ" },
  { id: "cafe-work", label: "カフェ・作業", caption: "ゆるく作業と交流" },
  { id: "sauna", label: "サウナ", caption: "ととのい仲間" },
];

export const defaultHosts: CommunityHost[] = [
  {
    id: "host-naoto",
    userId: "host-naoto",
    displayName: "ナオト",
    avatar: "/images/icons/keita.jpg",
    rank: "GOLD",
    reviewScore: 4.8,
    eventCount: 18,
    cancelRate: 1,
    isVerified: true,
    bio: "音楽と福岡の夜が好きなローカル幹事。",
  },
];

export const defaultCommunities: CommunityMeet[] = [
  {
    id: "creep-hype-live-drink",
    slug: "creep-hype-live-drink",
    title: "クリープハイプ飲み会",
    category: "音楽・ライブ",
    image: "/images/meet/creep-live.jpg",
    area: "天神",
    venueName: "天神エリア",
    publicAreaLabel: "福岡サンパレスライブ後 / 天神エリア",
    participantVenueName: "参加確定後に店舗名を共有",
    participantAddress: "参加確定後に住所を共有",
    participantMemo: "終演後に迷わないよう、集合目印と予約名を参加者だけに案内します。",
    participantNotes: "安全のため、店舗詳細・予約名・幹事連絡方法は参加確定後にだけ共有します。",
    venueVisibility: "participants_only",
    date: "2024-05-25",
    startTime: "21:30",
    endTime: "24:30",
    description: "クリープハイプのライブ後、余韻をそのまま話せる少人数MEET。一人参加・遠征参加も歓迎。ライブTシャツやタオルのまま来ても大丈夫です。",
    tags: ["女の子同士で安心", "福岡遠征", "個別会計推奨", "ライブ後", "一人参加OK", "20代中心"],
    fee: 800,
    notices: ["連絡先交換の強要、勧誘、迷惑行為は禁止です。", "20歳未満の飲酒は禁止です。"],
    capacity: 18,
    participantCount: 14,
    maleRatio: 0,
    femaleRatio: 100,
    ageRange: "20代中心",
    isSoloFriendly: true,
    isWomenOnly: true,
    isWomenFriendly: true,
    isAge20Only: true,
    isBeginnerFriendly: true,
    isVerifiedOnly: true,
    safety: {
      womenOnly: true,
      soloOk: true,
      splitBillRecommended: true,
      identityVerifiedRequired: true,
      locationHiddenUntilJoined: true,
      firstTimerRate: 85,
      localRate: 60,
      travelerRate: 40,
      maleCount: 0,
      femaleCount: 14,
    },
    artist: {
      name: "クリープハイプ",
      slug: "creep-hype",
    },
    participantProfiles: [
      {
        id: "creep-p1",
        genderLabel: "女性",
        ageLabel: "23歳",
        areaLabel: "長崎から遠征",
        fanHistory: "4年",
        favoriteSong: "栞",
        comment: "初めて福岡遠征です",
      },
      {
        id: "creep-p2",
        genderLabel: "女性",
        ageLabel: "25歳",
        areaLabel: "福岡市",
        fanHistory: "高校生から",
        favoriteSong: "社会の窓",
        comment: "ライブ後に語れる人ほしい",
      },
      {
        id: "creep-p3",
        genderLabel: "女性",
        ageLabel: "22歳",
        areaLabel: "鹿児島から遠征",
        fanHistory: "2年",
        favoriteSong: "二十九、三十",
        comment: "一人参戦なので安心できる会探してました",
      },
    ],
    faqs: [
      {
        id: "faq-shirt",
        question: "ライブTシャツ、タオルのまま参加しても大丈夫？",
        answer: "大歓迎です！ライブ帰りの方が多いので、そのままで大丈夫です。",
        order: 1,
      },
      {
        id: "faq-leave",
        question: "途中参加・途中退室はできる？",
        answer: "いつでもOKです。申請時に退出希望を選べるので、当日も気まずくなりません。",
        order: 2,
      },
      {
        id: "faq-softdrink",
        question: "お酒が飲めなくても平気？",
        answer: "ソフトドリンクがあるお店を選んでいます。飲めない方も安心して参加できます。",
        order: 3,
      },
      {
        id: "faq-solo",
        question: "一人参加でも浮かない？",
        answer: "このMEETは一人参加率が高めです。初参加の方も参加しやすいようにしています。",
        order: 4,
      },
      {
        id: "faq-location",
        question: "店舗はいつわかる？",
        answer: "参加確定後に、店舗名・住所・集合メモをお送りします。",
        order: 5,
      },
    ],
    joinOptions: {
      canLeaveEarly: true,
      canJoinLate: true,
      nonAlcoholOk: true,
      firstTimerSupport: true,
    },
    privateLocation: {
      venueName: "参加確定後に共有",
      address: "参加確定後に共有",
      googleMapUrl: "",
      reservationName: "参加確定後に共有",
      meetingMemo: "終演後、天神方面へ移動しやすい集合目印を案内します。",
      hostContactMemo: "当日の遅刻・合流連絡は参加後チャットで案内します。",
    },
    cancelPolicy: {
      cancelUntil: "開催当日18:00まで",
      waitlistEnabled: true,
      autoPromoteWaitlist: false,
    },
    relatedMeetTabs: [
      { label: "女性限定", type: "women", meetSlugs: ["girls-daimyo"] },
      { label: "お昼のカフェ会", type: "cafe", meetSlugs: ["yuru-cafe-yakuin"] },
      { label: "ライブ前", type: "before-live", meetSlugs: ["visitor-fukuoka-first-night"] },
      { label: "ライブ後飲み", type: "after-live", meetSlugs: ["creep-hype-live-drink", "drink-now-tenjin"] },
      { label: "物販待ち合わせ", type: "goods", meetSlugs: ["visitor-fukuoka-first-night"] },
    ],
    hostId: "host-naoto",
    hostName: "ナオト",
    hostAvatar: "/images/icons/keita.jpg",
    hostRank: "GOLD",
    hostReviewScore: 4.8,
    hostEventCount: 18,
    status: "published",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "drink-now-tenjin",
    slug: "drink-now-tenjin",
    title: "今から飲める人集合！",
    category: "今から飲み",
    image: "/images/meet/drink-now.jpg",
    area: "天神",
    venueName: "天神エリア",
    publicAreaLabel: "天神エリア",
    participantVenueName: "参加確定後に店舗名を共有",
    participantAddress: "参加確定後に住所を共有",
    participantMemo: "開始前に集合場所と予約名を参加者だけに案内します。",
    venueVisibility: "participants_only",
    date: "2024-05-24",
    startTime: "19:00",
    endTime: "22:00",
    description: "予定が空いた夜に、気軽に乾杯できる少人数MEET。初参加も歓迎です。",
    tags: ["一人参加OK", "20代中心", "気軽に飲み"],
    capacity: 12,
    participantCount: 9,
    maleRatio: 46,
    femaleRatio: 54,
    ageRange: "20代中心",
    isSoloFriendly: true,
    isWomenOnly: false,
    isBeginnerFriendly: true,
    isVerifiedOnly: false,
    hostId: "host-naoto",
    hostName: "ナオト",
    hostAvatar: "/images/icons/keita.jpg",
    hostRank: "GOLD",
    hostReviewScore: 4.8,
    hostEventCount: 18,
    status: "published",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "yuru-cafe-yakuin",
    slug: "yuru-cafe-yakuin",
    title: "ゆるカフェ会",
    category: "カフェ・作業",
    image: "/images/meet/cafe-work.jpg",
    area: "薬院",
    venueName: "薬院エリアのおしゃれカフェ",
    publicAreaLabel: "薬院エリア",
    participantVenueName: "参加確定後に店舗名を共有",
    participantAddress: "参加確定後に住所を共有",
    participantMemo: "席数調整のため、詳細店舗は参加確定後に共有します。",
    venueVisibility: "participants_only",
    date: "2024-05-25",
    startTime: "14:00",
    endTime: "16:30",
    description: "作業しながら、ゆるく話せるカフェ会。福岡に来たばかりの人にもおすすめです。",
    tags: ["一人参加OK", "作業OK", "ゆるくしゃべる"],
    capacity: 10,
    participantCount: 7,
    maleRatio: 43,
    femaleRatio: 57,
    ageRange: "20代〜30代",
    isSoloFriendly: true,
    isWomenOnly: false,
    isBeginnerFriendly: true,
    isVerifiedOnly: false,
    hostId: "host-naoto",
    hostName: "ナオト",
    hostAvatar: "/images/icons/keita.jpg",
    hostRank: "GOLD",
    hostReviewScore: 4.8,
    hostEventCount: 18,
    status: "published",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "midnight-nakasu-talk",
    slug: "midnight-nakasu-talk",
    title: "深夜まで語れる人たち",
    category: "深夜・朝まで",
    image: "/images/meet/midnight-nakasu.jpg",
    area: "中洲",
    venueName: "中洲エリア",
    publicAreaLabel: "中洲エリア",
    participantVenueName: "参加確定後に店舗名を共有",
    participantAddress: "参加確定後に住所を共有",
    participantMemo: "深夜帯のため、集合動線と注意事項を参加者にのみ案内します。",
    venueVisibility: "participants_only",
    date: "2024-05-24",
    startTime: "23:00",
    endTime: "26:00",
    description: "朝まで飲める人歓迎。音楽、仕事、福岡の夜をゆるく語るMEET。",
    tags: ["深夜OK", "20代〜30代", "飲み好き"],
    capacity: 14,
    participantCount: 11,
    maleRatio: 70,
    femaleRatio: 30,
    ageRange: "20代〜30代",
    isSoloFriendly: true,
    isWomenOnly: false,
    isBeginnerFriendly: false,
    isVerifiedOnly: false,
    hostId: "host-naoto",
    hostName: "ナオト",
    hostAvatar: "/images/icons/keita.jpg",
    hostRank: "GOLD",
    hostReviewScore: 4.8,
    hostEventCount: 18,
    status: "published",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "girls-daimyo",
    slug: "girls-daimyo",
    title: "女子だけでワイワイ会",
    category: "女子会",
    image: "/images/meet/girls-daimyo.jpg",
    area: "大名",
    venueName: "大名エリア",
    publicAreaLabel: "大名エリア",
    participantVenueName: "参加確定後に店舗名を共有",
    participantAddress: "参加確定後に住所を共有",
    participantMemo: "女性限定MEETのため、店舗詳細は参加確定者だけに共有します。",
    venueVisibility: "participants_only",
    date: "2024-05-26",
    startTime: "18:00",
    endTime: "21:00",
    description: "女子だけで安心して楽しむごはん会。カフェもごはんも好きな人へ。",
    tags: ["女性限定", "20代中心", "ごはん・カフェ"],
    capacity: 8,
    participantCount: 6,
    maleRatio: 0,
    femaleRatio: 100,
    ageRange: "20代中心",
    isSoloFriendly: true,
    isWomenOnly: true,
    isBeginnerFriendly: true,
    isVerifiedOnly: false,
    hostId: "host-naoto",
    hostName: "ナオト",
    hostAvatar: "/images/icons/keita.jpg",
    hostRank: "GOLD",
    hostReviewScore: 4.8,
    hostEventCount: 18,
    status: "published",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "visitor-fukuoka-first-night",
    slug: "visitor-fukuoka-first-night",
    title: "福岡来たばかり会",
    category: "遠征・観光",
    image: "/images/fukuoka-city.jpg",
    area: "博多",
    venueName: "博多駅周辺",
    publicAreaLabel: "博多駅周辺",
    participantVenueName: "参加確定後に店舗名を共有",
    participantAddress: "参加確定後に住所を共有",
    participantMemo: "遠征・観光の方が迷わないよう、駅からの向かい方も案内します。",
    venueVisibility: "participants_only",
    date: "2024-05-26",
    startTime: "20:00",
    endTime: "22:30",
    description: "転勤、遠征、観光で来た人歓迎。地元民のおすすめも聞けるMEETです。",
    tags: ["遠征歓迎", "ひとり旅OK", "地元民も参加"],
    capacity: 10,
    participantCount: 5,
    maleRatio: 40,
    femaleRatio: 60,
    ageRange: "20代〜30代",
    isSoloFriendly: true,
    isWomenOnly: false,
    isBeginnerFriendly: true,
    isVerifiedOnly: false,
    hostId: "host-naoto",
    hostName: "ナオト",
    hostAvatar: "/images/icons/keita.jpg",
    hostRank: "GOLD",
    hostReviewScore: 4.8,
    hostEventCount: 18,
    status: "published",
    createdAt: now,
    updatedAt: now,
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCommunities() {
  return readJson<CommunityMeet[]>(keys.communities) ?? defaultCommunities;
}

export function saveCommunities(communities: CommunityMeet[]) {
  writeJson(keys.communities, communities);
  return communities;
}

export function getCommunityBySlug(slug: string) {
  return getCommunities().find((community) => community.slug === slug || community.id === slug);
}

export function getCommunityParticipants() {
  return readJson<CommunityParticipant[]>(keys.participants) ?? [];
}

export function getCommunityInterests() {
  return readJson<CommunityParticipant[]>(keys.interests) ?? [];
}

export function joinCommunity(community: CommunityMeet, userId: string, displayName: string, avatar = "") {
  const participants = getCommunityParticipants();
  if (!participants.some((item) => item.communityId === community.id && item.userId === userId && item.status === "joined")) {
    participants.push({
      id: `join-${community.id}-${userId}`,
      communityId: community.id,
      userId,
      displayName,
      avatar,
      ageRange: "20代",
      area: "福岡市",
      status: "joined",
      createdAt: new Date().toISOString(),
    });
    writeJson(keys.participants, participants);
  }
  const communities = getCommunities().map((item) =>
    item.id === community.id ? { ...item, participantCount: Math.max(item.participantCount, participants.filter((p) => p.communityId === community.id && p.status === "joined").length) } : item,
  );
  saveCommunities(communities);
}

export function addCommunityInterest(community: CommunityMeet, userId: string, displayName: string, avatar = "") {
  const interests = getCommunityInterests();
  if (!interests.some((item) => item.communityId === community.id && item.userId === userId)) {
    interests.push({
      id: `interest-${community.id}-${userId}`,
      communityId: community.id,
      userId,
      displayName,
      avatar,
      ageRange: "20代",
      area: "福岡市",
      status: "interested",
      createdAt: new Date().toISOString(),
    });
    writeJson(keys.interests, interests);
  }
}

export function getCommunityReviews() {
  return readJson<CommunityReview[]>(keys.reviews) ?? [];
}

export function saveCommunityReview(review: CommunityReview) {
  const reviews = [review, ...getCommunityReviews()];
  writeJson(keys.reviews, reviews);
  return reviews;
}

export function getCommunityHosts() {
  return readJson<CommunityHost[]>(keys.hosts) ?? defaultHosts;
}

type MeetApiList = {
  communities?: CommunityMeet[];
};

type MeetApiDetail = {
  community?: CommunityMeet;
};

function getAdminHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const session = window.localStorage.getItem("fuku_admin_session");
  return session ? { "x-fuku-admin-session": session } : {};
}

export async function getPublishedCommunitiesAsync() {
  if (typeof window === "undefined") return defaultCommunities.filter((item) => item.status === "published");
  try {
    const response = await fetch("/api/meets", { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load communities");
    const data = (await response.json()) as MeetApiList;
    return data.communities?.length ? data.communities : defaultCommunities.filter((item) => item.status === "published");
  } catch {
    return defaultCommunities.filter((item) => item.status === "published");
  }
}

export async function getCommunityBySlugAsync(slug: string) {
  if (typeof window === "undefined") return defaultCommunities.find((item) => item.slug === slug || item.id === slug);
  try {
    const response = await fetch(`/api/meets/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load community");
    const data = (await response.json()) as MeetApiDetail;
    return data.community ?? defaultCommunities.find((item) => item.slug === slug || item.id === slug);
  } catch {
    return defaultCommunities.find((item) => item.slug === slug || item.id === slug);
  }
}

export async function getAdminCommunitiesAsync() {
  if (typeof window === "undefined") return defaultCommunities;
  try {
    const response = await fetch("/api/admin/meets", { cache: "no-store", headers: getAdminHeaders() });
    if (!response.ok) throw new Error("Failed to load admin communities");
    const data = (await response.json()) as MeetApiList;
    return data.communities?.length ? data.communities : getCommunities();
  } catch {
    return getCommunities();
  }
}

export async function saveAdminCommunityAsync(community: Partial<CommunityMeet>) {
  const response = await fetch("/api/admin/meets", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...getAdminHeaders(),
    },
    body: JSON.stringify(community),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? "MEETの保存に失敗しました");
  const data = (await response.json()) as MeetApiDetail;
  return data.community;
}

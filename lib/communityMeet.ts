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
    venueVisibility: "participants_only",
    date: "2024-05-25",
    startTime: "21:30",
    endTime: "24:30",
    description: "クリープハイプのライブ後、余韻をそのまま語れる飲み会。一人参加も歓迎。好きな曲、今日のセトリ、ライブの感想をゆるく話しましょう。",
    tags: ["一人参加OK", "男女ペアOK", "20代中心", "ライブ後"],
    capacity: 18,
    participantCount: 12,
    maleRatio: 58,
    femaleRatio: 42,
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
    id: "drink-now-tenjin",
    slug: "drink-now-tenjin",
    title: "今から飲める人集合！",
    category: "今から飲み",
    image: "/images/meet/drink-now.jpg",
    area: "天神",
    venueName: "天神エリア",
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
    venueVisibility: "public",
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

export type AdminRole = "super_admin" | "admin" | "editor" | "staff" | "viewer" | "user";
export type AdminStatus = "draft" | "published" | "private" | "archived" | "pending" | "approved" | "rejected" | "done" | "reviewing" | "new";

export type AdminSession = {
  isLoggedIn: boolean;
  role: AdminRole;
  email: string;
};

export type Shop = {
  id: string;
  slug: string;
  name: string;
  category: string;
  area: string;
  station: string;
  address: string;
  openingHours: string;
  isOpenNow: boolean;
  tags: string[];
  images: string[];
  description: string;
  aiSummary: string;
  rankings: { title: string; rank: number }[];
  votes: number;
  saves: number;
  comments: { user: string; text: string }[];
  instagramUrl: string;
  mapUrl: string;
  status: AdminStatus;
  isSponsored: boolean;
  isVerified: boolean;
};

export type News = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  image: string;
  tags: string[];
  relatedSpotIds: string[];
  relatedIconIds: string[];
  seoTitle: string;
  seoDescription: string;
  status: AdminStatus;
  publishedAt: string;
};

export type RankingEntry = {
  id: string;
  rankingId: string;
  targetType: "shop" | "icon" | "area" | "custom";
  targetId: string;
  name: string;
  image: string;
  votes: number;
  status: AdminStatus;
};

export type Ranking = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  entries: RankingEntry[];
  status: AdminStatus;
  isSponsored: boolean;
};

export type Icon = {
  id: string;
  slug: string;
  name: string;
  category: string;
  area: string;
  profile: string;
  image: string;
  instagram: string;
  votes: number;
  supportCount: number;
  status: AdminStatus;
  isCoverCandidate: boolean;
};

export type FormSubmission = {
  id: string;
  type: string;
  name: string;
  email: string;
  instagram: string;
  message: string;
  status: AdminStatus;
  createdAt: string;
};

export type AdminLog = {
  id: string;
  adminUserId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  fukuType: string;
  savedSpotIds: string[];
  votedRankingIds: string[];
  followedIconIds: string[];
  supportedIconIds: string[];
  createdAt: string;
};

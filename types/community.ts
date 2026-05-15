export type UserProfile = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  activityArea: string;
  favoriteAreas: string[];
  gender: string;
  ageRange: string;
  favoriteGenres: string[];
  instagram: string;
  fukuType: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserComment = {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatar: string;
  targetType: "spot" | "ranking" | "icon" | "news";
  targetId: string;
  targetTitle: string;
  body: string;
  tags: string[];
  imageUrls: string[];
  goodCount: number;
  status: "published" | "pending" | "hidden";
  createdAt: string;
};

export type UserBadge = {
  id: string;
  label: string;
  description: string;
  icon: string;
  earnedAt: string;
};

export type UserLevel = {
  level: number;
  point: number;
  nextLevelPoint: number;
  title: string;
};

export type UserPost = {
  id: string;
  userId: string;
  type: "comment" | "photo" | "ranking-theme" | "shop-recommend";
  title: string;
  body: string;
  imageUrls: string[];
  targetType: string;
  targetId: string;
  status: "published" | "pending" | "hidden";
  goodCount: number;
  createdAt: string;
};

export type UserStats = {
  saves: number;
  votes: number;
  supports: number;
  posts: number;
  goods: number;
  photos: number;
};

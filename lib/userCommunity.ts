import { storageKeys } from "@/lib/storageKeys";
import { getCurrentUser } from "@/lib/userAuth";
import type { UserBadge, UserComment, UserLevel, UserPost, UserProfile, UserStats } from "@/types/community";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readList<T>(key: string, fallback: T[] = []): T[] {
  if (!canUseStorage()) return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return fallback;
  }
}

function writeList<T>(key: string, value: T[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function now() {
  return new Date().toISOString();
}

export function getProfiles() {
  return readList<UserProfile>(storageKeys.userProfile);
}

export function getCurrentUserProfile(): UserProfile | null {
  const user = getCurrentUser();
  if (!user) return null;
  const existing = getProfiles().find((profile) => profile.userId === user.userId);
  if (existing) return existing;
  const createdAt = now();
  return {
    id: makeId("profile"),
    userId: user.userId,
    username: user.username,
    displayName: user.displayName,
    avatar: "",
    bio: "福岡の好きな場所を少しずつ集めています。",
    activityArea: "福岡市内",
    favoriteAreas: ["薬院", "天神"],
    gender: "",
    ageRange: "",
    favoriteGenres: ["カフェ", "ローカル"],
    instagram: "",
    fukuType: "ローカル探索中",
    isPublic: true,
    createdAt,
    updatedAt: createdAt,
  };
}

export function saveUserProfile(profile: UserProfile) {
  const profiles = getProfiles();
  const nextProfile = { ...profile, updatedAt: now() };
  const next = profiles.some((item) => item.userId === nextProfile.userId)
    ? profiles.map((item) => (item.userId === nextProfile.userId ? nextProfile : item))
    : [...profiles, nextProfile];
  writeList(storageKeys.userProfile, next);
}

export function getPublicProfile(username: string) {
  return getProfiles().find((profile) => profile.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export function getUserComments() {
  return readList<UserComment>(storageKeys.userComments);
}

export function addUserComment(comment: Omit<UserComment, "id" | "goodCount" | "status" | "createdAt">) {
  const createdAt = now();
  const nextComment: UserComment = {
    ...comment,
    id: makeId("comment"),
    goodCount: 0,
    status: "published",
    createdAt,
  };
  const comments = [nextComment, ...getUserComments()];
  writeList(storageKeys.userComments, comments);

  const posts = readList<UserPost>(storageKeys.userPosts);
  const post: UserPost = {
    id: makeId("post"),
    userId: nextComment.userId,
    type: nextComment.imageUrls.length ? "photo" : "comment",
    title: nextComment.targetTitle,
    body: nextComment.body,
    imageUrls: nextComment.imageUrls,
    targetType: nextComment.targetType,
    targetId: nextComment.targetId,
    status: "published",
    goodCount: 0,
    createdAt,
  };
  writeList(storageKeys.userPosts, [post, ...posts]);

  if (nextComment.imageUrls.length) {
    const photos = readList<UserPost>(storageKeys.userPhotos);
    writeList(storageKeys.userPhotos, [post, ...photos]);
  }

  return nextComment;
}

export function getCommentsByTarget(targetType: UserComment["targetType"], targetId: string) {
  return getUserComments().filter((comment) => comment.targetType === targetType && comment.targetId === targetId && comment.status !== "hidden");
}

export function hasGoodComment(commentId: string, userId: string) {
  const goods = readList<string>(storageKeys.userGoodComments);
  return goods.includes(`${userId}:${commentId}`);
}

export function goodComment(commentId: string, userId: string) {
  if (hasGoodComment(commentId, userId)) return { ok: false, message: "GOOD済みです" };
  const goods = readList<string>(storageKeys.userGoodComments);
  writeList(storageKeys.userGoodComments, [...goods, `${userId}:${commentId}`]);
  const comments = getUserComments();
  writeList(
    storageKeys.userComments,
    comments.map((comment) => (comment.id === commentId ? { ...comment, goodCount: comment.goodCount + 1 } : comment)),
  );
  const posts = readList<UserPost>(storageKeys.userPosts);
  writeList(
    storageKeys.userPosts,
    posts.map((post) => (post.id === commentId ? { ...post, goodCount: post.goodCount + 1 } : post)),
  );
  return { ok: true, message: "GOODしました" };
}

export function getUserPosts(userId: string) {
  return readList<UserPost>(storageKeys.userPosts).filter((post) => post.userId === userId);
}

export function getUserPhotos(userId: string) {
  return readList<UserPost>(storageKeys.userPhotos).filter((post) => post.userId === userId);
}

export function getUserStats(userId: string): UserStats {
  const saves =
    readList<string>(storageKeys.savedSpots).length +
    readList<string>(storageKeys.savedNews).length +
    readList<string>(storageKeys.savedIcons).length;
  const votes = readList<unknown>(storageKeys.rankingVotes).filter((vote) => (vote as { userId?: string }).userId === userId).length +
    readList<string>(storageKeys.votedItems).length;
  const supports = readList<string>(storageKeys.supportedIcons).length;
  const posts = getUserPosts(userId).length;
  const comments = getUserComments().filter((comment) => comment.userId === userId);
  const goods = comments.reduce((sum, comment) => sum + comment.goodCount, 0);
  const photos = comments.reduce((sum, comment) => sum + comment.imageUrls.length, 0);
  return { saves, votes, supports, posts, goods, photos };
}

export function calculateUserLevel(userId: string): UserLevel {
  const stats = getUserStats(userId);
  const point = stats.votes * 5 + stats.saves * 3 + stats.posts * 10 + stats.photos * 15 + stats.goods * 2 + stats.supports * 5;
  const level = Math.max(1, Math.min(30, Math.floor(point / 35) + 1));
  const title = level >= 30 ? "FUKU-MEETS公認ローカルアンバサダー" : level >= 20 ? "天神ナイト案内人" : level >= 10 ? "薬院カフェ通" : level >= 5 ? "ローカル探索中" : "福岡ビギナー";
  const nextLevelPoint = level * 35;
  return { level, point, nextLevelPoint, title };
}

export function getUserBadges(userId: string): UserBadge[] {
  const stats = getUserStats(userId);
  const earnedAt = now();
  const badges: UserBadge[] = [
    { id: "first-post", label: "初投稿", description: "はじめて推しコメントを投稿", icon: "camera", earnedAt },
    { id: "cafe", label: "カフェ投稿", description: "カフェの推しコメントを投稿", icon: "coffee", earnedAt },
    { id: "craft", label: "推しコメント職人", description: "GOODをもらったコメントを投稿", icon: "heart", earnedAt },
  ];
  if (stats.votes >= 3) badges.push({ id: "ranking", label: "ランキング提案者", description: "ランキング参加が活発", icon: "crown", earnedAt });
  if (stats.supports >= 1) badges.push({ id: "icons", label: "FUKU ICONS応援隊", description: "FUKU ICONSを応援", icon: "spark", earnedAt });
  if (stats.posts >= 5) badges.push({ id: "pickup", label: "編集部ピックアップ", description: "投稿が編集部注目候補", icon: "star", earnedAt });
  return badges;
}

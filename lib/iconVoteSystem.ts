import { storageKeys } from "@/lib/storageKeys";
import { getCurrentUser } from "@/lib/userAuth";

type IconVoteRecord = {
  userId: string;
  iconSlug: string;
  type: "support" | "cover";
  createdAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readList(key: string) {
  if (!canUseStorage()) return [] as IconVoteRecord[];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as IconVoteRecord[];
  } catch {
    return [];
  }
}

function writeList(key: string, value: IconVoteRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function hasSupportedIcon(iconSlug: string) {
  const user = getCurrentUser();
  const key = user ? storageKeys.iconVotes : storageKeys.guestIconVotes;
  const userKey = user?.userId ?? "guest";
  return readList(key).some((vote) => vote.userId === userKey && vote.iconSlug === iconSlug && vote.type === "support");
}

export function supportIcon(iconSlug: string) {
  const user = getCurrentUser();
  const key = user ? storageKeys.iconVotes : storageKeys.guestIconVotes;
  const userKey = user?.userId ?? "guest";
  const votes = readList(key);
  if (votes.some((vote) => vote.userId === userKey && vote.iconSlug === iconSlug && vote.type === "support")) {
    return { ok: false, reason: "voted" as const, message: "応援済みです" };
  }
  if (!user && votes.filter((vote) => vote.userId === userKey && vote.type === "support").length >= 5) {
    return { ok: false, reason: "limit" as const, message: "もっと応援するにはログインしてください" };
  }
  writeList(key, [{ userId: userKey, iconSlug, type: "support", createdAt: new Date().toISOString() }, ...votes]);
  return { ok: true, reason: "ok" as const, message: "応援しました" };
}

export function hasCoverVotedToday() {
  const user = getCurrentUser();
  const key = user ? storageKeys.iconVotes : storageKeys.guestIconVotes;
  const userKey = user?.userId ?? "guest";
  return readList(key).some((vote) => vote.userId === userKey && vote.type === "cover" && vote.createdAt.startsWith(today()));
}

export function coverVoteIcon(iconSlug: string) {
  if (hasCoverVotedToday()) return { ok: false, reason: "voted" as const, message: "本日はすでに投票済みです" };
  const user = getCurrentUser();
  const key = user ? storageKeys.iconVotes : storageKeys.guestIconVotes;
  const userKey = user?.userId ?? "guest";
  const votes = readList(key);
  writeList(key, [{ userId: userKey, iconSlug, type: "cover", createdAt: new Date().toISOString() }, ...votes]);
  return { ok: true, reason: "ok" as const, message: "表紙投票しました" };
}

export function getIconSupportDelta(iconSlug: string) {
  return [...readList(storageKeys.iconVotes), ...readList(storageKeys.guestIconVotes)].filter(
    (vote) => vote.iconSlug === iconSlug && vote.type === "support",
  ).length;
}

export function getIconCoverDelta(iconSlug: string) {
  return [...readList(storageKeys.iconVotes), ...readList(storageKeys.guestIconVotes)].filter(
    (vote) => vote.iconSlug === iconSlug && vote.type === "cover",
  ).length;
}

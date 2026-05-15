import { storageKeys } from "@/lib/storageKeys";
import type { AuthResult, RegisterInput, UserAccount, UserSession } from "@/types/userAuth";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeUsername(username: string) {
  return username.trim().replace(/^@/, "").toLowerCase();
}

export function getUsers(): UserAccount[] {
  if (!canUseStorage()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(storageKeys.users) ?? "[]") as UserAccount[];
  } catch {
    return [];
  }
}

export function saveUsers(users: UserAccount[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(storageKeys.users, JSON.stringify(users));
}

function createSession(user: UserAccount): UserSession {
  return {
    userId: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    createdAt: now(),
  };
}

function saveSession(session: UserSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(storageKeys.userSession, JSON.stringify(session));
}

export function registerUser(input: RegisterInput): AuthResult {
  const email = normalizeEmail(input.email);
  const username = normalizeUsername(input.username);
  const displayName = input.displayName.trim();
  const password = input.password;

  if (!email) return { ok: false, error: "メールアドレスを入力してください" };
  if (password.length < 6) return { ok: false, error: "パスワードは6文字以上で入力してください" };
  if (password !== input.passwordConfirm) return { ok: false, error: "パスワード確認が一致していません" };
  if (!username) return { ok: false, error: "ユーザーIDを入力してください" };
  if (!displayName) return { ok: false, error: "表示名を入力してください" };

  const users = getUsers();
  if (users.some((user) => normalizeEmail(user.email) === email)) {
    return { ok: false, error: "このメールアドレスはすでに登録されています" };
  }
  if (users.some((user) => normalizeUsername(user.username) === username)) {
    return { ok: false, error: "このユーザーIDはすでに使われています" };
  }

  const createdAt = now();
  const user: UserAccount = {
    id: makeId("user"),
    email,
    // MVP only: production must use Supabase Auth and must never store passwords in localStorage.
    password,
    username,
    displayName,
    createdAt,
    updatedAt: createdAt,
  };
  const nextUsers = [...users, user];
  saveUsers(nextUsers);
  const session = createSession(user);
  saveSession(session);
  return { ok: true, user, session };
}

export function loginUser(emailInput: string, password: string): AuthResult {
  const email = normalizeEmail(emailInput);
  const user = getUsers().find((item) => normalizeEmail(item.email) === email);
  if (!user || user.password !== password) {
    return { ok: false, error: "メールアドレスまたはパスワードが違います" };
  }
  const session = createSession(user);
  saveSession(session);
  return { ok: true, user, session };
}

export function logoutUser() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(storageKeys.userSession);
}

export function getCurrentUser(): UserSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(storageKeys.userSession);
    if (!raw) return null;
    const session = JSON.parse(raw) as UserSession;
    const exists = getUsers().some((user) => user.id === session.userId);
    return exists ? session : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getCurrentUser());
}

export function requireUser() {
  const user = getCurrentUser();
  if (!user && canUseStorage()) window.location.href = "/auth/login";
  return user;
}

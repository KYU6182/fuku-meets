import { storageKeys } from "./storageKeys";
import type { AdminRole, AdminSession } from "@/types/admin";

export const allowedAdminRoles: AdminRole[] = ["super_admin", "admin", "editor", "staff"];

export function isAdminRole(role?: string | null): role is AdminRole {
  return Boolean(role && allowedAdminRoles.includes(role as AdminRole));
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKeys.adminSession);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    return session.isLoggedIn && isAdminRole(session.role) ? session : null;
  } catch {
    return null;
  }
}

export function requireAdmin() {
  return getAdminSession();
}

export function setAdminSession(session: AdminSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeys.adminSession, JSON.stringify(session));
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKeys.adminSession);
}

// Future Supabase migration notes:
// - Replace localStorage with Supabase Auth session checks.
// - Read profiles.role server-side and enforce Row Level Security.
// - Move requireAdmin into middleware.ts / server components for server-side role checks.
// - Store all admin actions in admin_logs and validate uploads before Supabase Storage writes.

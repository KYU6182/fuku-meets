import { isAdminRole } from "@/lib/adminAuth";

type HeaderAdminSession = {
  isLoggedIn?: boolean;
  role?: string;
  email?: string;
};

export function getAdminSessionFromRequest(request: Request): HeaderAdminSession | null {
  const raw = request.headers.get("x-fuku-admin-session");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HeaderAdminSession;
  } catch {
    return null;
  }
}

export function isAdminRequest(request: Request) {
  const session = getAdminSessionFromRequest(request);
  return Boolean(session?.isLoggedIn && isAdminRole(session.role));
}

export function adminUnauthorizedResponse() {
  return Response.json({ error: "Admin role required" }, { status: 401 });
}


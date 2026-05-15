import { storageKeys } from "./storageKeys";
import type { CmsImage, CmsImageCategory } from "@/types/visualEditor";

export const imageCategories: CmsImageCategory[] = ["fv", "banner", "shop", "icons", "news", "magazine", "ranking", "other"];

export function loadMediaLibrary(): CmsImage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(storageKeys.cmsMediaLibrary) ?? "[]") as CmsImage[];
  } catch {
    return [];
  }
}

export function saveMediaLibrary(images: CmsImage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeys.cmsMediaLibrary, JSON.stringify(images));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) return "jpg / jpeg / png / webp のみアップロードできます。SVGは禁止です。";
  if (file.size > 5 * 1024 * 1024) return "画像は5MB以下にしてください。";
  return null;
}

export function createCmsImage({ url, name, alt, category }: { url: string; name: string; alt: string; category: CmsImageCategory }): CmsImage {
  return {
    id: `cms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url,
    name: name || "アップロード画像",
    alt,
    category,
    createdAt: new Date().toISOString(),
  };
}

// Production migration note:
// This MVP stores base64 Data URLs in localStorage so admins can test direct upload immediately.
// In production, replace this file with Supabase Storage uploads and store only public URLs plus metadata in Supabase DB.

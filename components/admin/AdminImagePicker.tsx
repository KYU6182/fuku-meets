"use client";

import { ImagePlus, Library, Trash2, Upload } from "lucide-react";
import type { DragEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { getMediaLibraryAsync } from "@/lib/cms";
import { fileToDataUrl, imageCategories, validateImageFile } from "@/lib/visualEditor";
import type { CmsImage } from "@/types/cms";

type AdminImageCategory = CmsImage["category"];

const bucketLabels: Record<AdminImageCategory, string> = {
  icons: "icons-images",
  shop: "meet-images",
  fv: "cms-images",
  banner: "cms-images",
  news: "cms-images",
  magazine: "cms-images",
  ranking: "cms-images",
  other: "cms-images",
};

function getAdminHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const session = window.localStorage.getItem("fuku_admin_session");
  return session ? { "x-fuku-admin-session": session } : {};
}

export default function AdminImagePicker({
  value,
  onChange,
  category = "other",
  label = "画像",
  helpText,
}: {
  value?: string;
  onChange: (url: string) => void;
  category?: AdminImageCategory;
  label?: string;
  helpText?: string;
}) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [library, setLibrary] = useState<CmsImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(value ?? "");
  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [filter, setFilter] = useState<AdminImageCategory | "all">(category);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    void getMediaLibraryAsync().then((images) => {
      if (mounted) setLibrary(images);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPreview(value ?? "");
  }, [value]);

  const bucket = bucketLabels[category];
  const filteredLibrary = useMemo(
    () => library.filter((image) => filter === "all" || image.category === filter),
    [filter, library],
  );

  async function handleFile(file?: File) {
    if (!file) return;
    const validation = validateImageFile(file);
    if (validation) {
      setError(validation);
      setStatusText("");
      return;
    }
    setError("");
    setStatusText("");
    setSelectedFile(file);
    setPreview(await fileToDataUrl(file));
    setName(file.name.replace(/\.[^.]+$/, ""));
  }

  async function uploadImage() {
    if (!selectedFile) {
      setError("アップロードする画像を選択してください。");
      setStatusText("");
      return;
    }
    setUploading(true);
    setError("");
    setStatusText("");
    try {
      const form = new FormData();
      form.set("file", selectedFile);
      form.set("name", name || selectedFile.name.replace(/\.[^.]+$/, ""));
      form.set("alt", alt);
      form.set("category", category);
      const response = await fetch("/api/admin/cms/assets", {
        method: "POST",
        headers: getAdminHeaders(),
        body: form,
      });
      const payload = (await response.json().catch(() => null)) as { image?: CmsImage; bucket?: string; error?: string } | null;
      if (!response.ok || !payload?.image) {
        throw new Error(payload?.error ?? "画像アップロードに失敗しました。");
      }
      const image = payload.image;
      setLibrary((current) => [image, ...current.filter((item) => item.id !== image.id)]);
      setSelectedFile(null);
      setPreview(image.url);
      onChange(image.url);
      setStatusText(`画像を保存しました（bucket: ${payload.bucket ?? image.bucket ?? bucket}）`);
      setTab("library");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "画像アップロードに失敗しました。");
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(id: string) {
    setError("");
    setStatusText("");
    try {
      const response = await fetch(`/api/admin/cms/assets?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "画像削除に失敗しました。");
      }
      setLibrary((current) => current.filter((image) => image.id !== id));
      setStatusText("画像を削除しました。");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "画像削除に失敗しました。");
    }
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void handleFile(event.dataTransfer.files[0]);
  }

  return (
    <section className="rounded-[16px] border border-fuku-border bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-black text-fuku-black">{label}</p>
          <p className="mt-1 text-[11px] font-bold text-fuku-gray">
            {helpText ?? "jpg / png / webp、5MB以下。SVGは禁止。"}
          </p>
        </div>
        <span className="rounded-full bg-fuku-light px-3 py-1 text-[10px] font-black text-fuku-gray">bucket: {bucket}</span>
      </div>

      <div className="mt-3 overflow-hidden rounded-[12px] border border-fuku-border bg-fuku-light">
        {preview ? (
          <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url('${preview}')` }} />
        ) : (
          <div className="grid h-40 place-items-center text-fuku-gray">
            <ImagePlus size={30} />
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full text-[12px] font-black ${tab === "upload" ? "bg-fuku-red text-white" : "bg-fuku-light text-fuku-black"}`}
        >
          <Upload size={14} />
          画像をアップロード
        </button>
        <button
          type="button"
          onClick={() => setTab("library")}
          className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full text-[12px] font-black ${tab === "library" ? "bg-fuku-red text-white" : "bg-fuku-light text-fuku-black"}`}
        >
          <Library size={14} />
          ライブラリから選択
        </button>
      </div>

      {tab === "upload" ? (
        <div className="mt-3 space-y-3">
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
            className="grid min-h-[132px] cursor-pointer place-items-center rounded-[12px] border border-dashed border-fuku-border bg-fuku-light p-5 text-center"
          >
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
            <span>
              <Upload className="mx-auto text-fuku-red" size={24} />
              <span className="mt-2 block text-[12px] font-black text-fuku-black">画像を選択 / ドロップ</span>
              <span className="mt-1 block text-[10px] font-bold text-fuku-gray">スマホの写真選択にも対応</span>
            </span>
          </label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="画像名" className="h-10 w-full rounded-[10px] border border-fuku-border px-3 text-[13px] font-bold" />
          <input value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="altテキスト" className="h-10 w-full rounded-[10px] border border-fuku-border px-3 text-[13px] font-bold" />
          <button type="button" onClick={() => void uploadImage()} disabled={uploading} className="min-h-[44px] w-full rounded-full bg-fuku-black text-[13px] font-black text-white disabled:opacity-50">
            {uploading ? "アップロード中..." : "保存してこの画像を使う"}
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <select value={filter} onChange={(event) => setFilter(event.target.value as AdminImageCategory | "all")} className="mb-3 h-10 w-full rounded-[10px] border border-fuku-border bg-white px-3 text-[13px] font-bold">
            <option value="all">すべて</option>
            {imageCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="grid max-h-[320px] grid-cols-2 gap-2 overflow-y-auto">
            {filteredLibrary.length ? filteredLibrary.map((image) => (
              <article key={image.id} className="rounded-[10px] border border-fuku-border bg-white p-2">
                <div className="h-20 rounded-[8px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${image.url}')` }} />
                <p className="mt-2 truncate text-[11px] font-black">{image.name}</p>
                <p className="text-[9px] font-bold text-fuku-gray">{image.bucket ?? bucketLabels[image.category]}</p>
                <div className="mt-2 grid grid-cols-[1fr_auto] gap-1">
                  <button type="button" onClick={() => { onChange(image.url); setPreview(image.url); setStatusText("ライブラリ画像を選択しました。"); }} className="min-h-[32px] rounded-full bg-fuku-red text-[11px] font-black text-white">選択</button>
                  <button type="button" onClick={() => void deleteImage(image.id)} className="grid h-8 w-8 place-items-center rounded-full border border-fuku-border" aria-label="画像を削除">
                    <Trash2 size={13} />
                  </button>
                </div>
              </article>
            )) : (
              <p className="col-span-2 rounded-[10px] bg-fuku-light p-4 text-center text-[12px] font-bold text-fuku-gray">まだ画像がありません。</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => { onChange(""); setPreview(""); setSelectedFile(null); setStatusText("画像を削除しました。保存するとレコードに反映されます。"); }} className="min-h-[38px] rounded-full border border-fuku-border text-[12px] font-black text-fuku-black">
          画像を削除
        </button>
      </div>
      {statusText ? <p className="mt-3 rounded-[10px] bg-fuku-light px-3 py-2 text-[12px] font-black text-fuku-black">{statusText}</p> : null}
      {error ? <p className="mt-3 rounded-[10px] bg-[#fff1f1] px-3 py-2 text-[12px] font-black text-fuku-red">{error}</p> : null}
    </section>
  );
}

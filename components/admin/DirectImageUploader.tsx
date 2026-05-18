"use client";

import { ImagePlus, Trash2, Upload } from "lucide-react";
import type { DragEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { getMediaLibraryAsync } from "@/lib/cms";
import { createCmsImage, fileToDataUrl, imageCategories, loadMediaLibrary, saveMediaLibrary, validateImageFile } from "@/lib/visualEditor";
import type { CmsImage } from "@/types/cms";
import type { CmsImageCategory } from "@/types/visualEditor";

export default function DirectImageUploader({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (url: string) => void;
}) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [library, setLibrary] = useState<CmsImage[]>([]);
  const [preview, setPreview] = useState(value);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("FV画像");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<CmsImageCategory>("fv");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<CmsImageCategory | "all">("all");
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
    setPreview(value);
  }, [value]);

  const filteredLibrary = useMemo(
    () => library.filter((image) => filter === "all" || image.category === filter),
    [filter, library],
  );

  async function handleFile(file?: File) {
    if (!file) return;
    const validation = validateImageFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    const url = await fileToDataUrl(file);
    setSelectedFile(file);
    setPreview(url);
    setName(file.name.replace(/\.[^.]+$/, ""));
  }

  async function saveImage() {
    if (!preview) {
      setError("先に画像を選択してください。");
      return;
    }
    setUploading(true);
    setError("");

    if (selectedFile) {
      try {
        const form = new FormData();
        form.set("file", selectedFile);
        form.set("name", name);
        form.set("alt", alt);
        form.set("category", category);
        const response = await fetch("/api/admin/cms/assets", {
          method: "POST",
          headers: getAdminHeaders(),
          body: form,
        });
        if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? "アップロードに失敗しました");
        const result = (await response.json()) as { image?: CmsImage };
        if (!result.image) throw new Error("画像URLを取得できませんでした");
        const next = [result.image, ...library.filter((image) => image.id !== result.image?.id)];
        setLibrary(next);
        saveMediaLibrary(next);
        onSelect(result.image.url);
        setSelectedFile(null);
        setTab("library");
        return;
      } catch (uploadError) {
        setUploading(false);
        setError(uploadError instanceof Error ? uploadError.message : "Supabase Storageへのアップロードに失敗しました。");
        return;
      } finally {
        setUploading(false);
      }
    }

    const image = createCmsImage({ url: preview, name, alt, category });
    const next = [image, ...library];
    setLibrary(next);
    saveMediaLibrary(next);
    onSelect(image.url);
    setTab("library");
    setUploading(false);
  }

  async function deleteImage(id: string) {
    const next = library.filter((image) => image.id !== id);
    setLibrary(next);
    saveMediaLibrary(next);
    await fetch(`/api/admin/cms/assets?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: getAdminHeaders(),
    }).catch(() => undefined);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void handleFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="rounded-[14px] border border-fuku-border bg-fuku-light p-3">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setTab("upload")} className={`min-h-[38px] rounded-full text-[12px] font-black ${tab === "upload" ? "bg-fuku-red text-white" : "bg-white text-fuku-black"}`}>アップロード</button>
        <button type="button" onClick={() => setTab("library")} className={`min-h-[38px] rounded-full text-[12px] font-black ${tab === "library" ? "bg-fuku-red text-white" : "bg-white text-fuku-black"}`}>ライブラリ</button>
      </div>

      <div className="mb-3 overflow-hidden rounded-[12px] border border-fuku-border bg-white">
        {value ? (
          <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url('${value}')` }} />
        ) : (
          <div className="grid h-36 place-items-center text-fuku-gray">
            <ImagePlus size={28} />
          </div>
        )}
      </div>

      {tab === "upload" ? (
        <div className="space-y-3">
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
            className="grid min-h-[140px] cursor-pointer place-items-center rounded-[12px] border border-dashed border-fuku-border bg-white p-5 text-center"
          >
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
            <span>
              <Upload className="mx-auto text-fuku-red" size={26} />
              <span className="mt-3 block text-[13px] font-black">画像を選択 / ドロップ</span>
              <span className="mt-1 block text-[11px] font-bold text-fuku-gray">jpg / png / webp、5MB以下。SVGは禁止。</span>
            </span>
          </label>
          {error ? <p className="rounded-[10px] bg-[#fff1f1] px-3 py-2 text-[12px] font-black text-fuku-red">{error}</p> : null}
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="画像名" className="h-10 w-full rounded-[10px] border border-fuku-border px-3 text-[13px] font-bold" />
          <input value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="altテキスト" className="h-10 w-full rounded-[10px] border border-fuku-border px-3 text-[13px] font-bold" />
          <select value={category} onChange={(event) => setCategory(event.target.value as CmsImageCategory)} className="h-10 w-full rounded-[10px] border border-fuku-border px-3 text-[13px] font-bold">
            {imageCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="button" onClick={() => void saveImage()} disabled={uploading} className="min-h-[44px] w-full rounded-full bg-fuku-black text-[13px] font-black text-white disabled:opacity-50">
            {uploading ? "アップロード中..." : "保存してこの画像を使う"}
          </button>
        </div>
      ) : (
        <div>
          <select value={filter} onChange={(event) => setFilter(event.target.value as CmsImageCategory | "all")} className="mb-3 h-10 w-full rounded-[10px] border border-fuku-border bg-white px-3 text-[13px] font-bold">
            <option value="all">すべて</option>
            {imageCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="grid max-h-[300px] grid-cols-2 gap-2 overflow-y-auto">
            {filteredLibrary.length ? filteredLibrary.map((image) => (
              <div key={image.id} className="rounded-[10px] border border-fuku-border bg-white p-2">
                <div className="h-20 rounded-[8px] bg-cover bg-center" style={{ backgroundImage: `url('${image.url}')` }} />
                <p className="mt-2 truncate text-[11px] font-black">{image.name}</p>
                <div className="mt-2 grid grid-cols-[1fr_auto] gap-1">
                  <button type="button" onClick={() => onSelect(image.url)} className="min-h-[32px] rounded-full bg-fuku-red text-[11px] font-black text-white">選択</button>
                  <button type="button" onClick={() => void deleteImage(image.id)} className="grid h-8 w-8 place-items-center rounded-full border border-fuku-border" aria-label="画像を削除">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )) : (
              <p className="col-span-2 rounded-[10px] bg-white p-4 text-center text-[12px] font-bold text-fuku-gray">まだ画像がありません。</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getAdminHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const session = window.localStorage.getItem("fuku_admin_session");
  return session ? { "x-fuku-admin-session": session } : {};
}

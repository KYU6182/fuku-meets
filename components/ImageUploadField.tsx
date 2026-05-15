"use client";

import { Camera, X } from "lucide-react";
import { useRef, useState } from "react";

type ImageUploadFieldProps = {
  label?: string;
  value?: string[];
  maxImages?: number;
  onChange: (images: string[]) => void;
};

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ImageUploadField({ label = "写真を追加", value = [], maxImages = 3, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setError("");
    const available = maxImages - value.length;
    Array.from(files)
      .slice(0, available)
      .forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
          setError("jpg / png / webp のみアップロードできます");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("画像は5MB以下にしてください");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          // MVP: base64 Data URL in localStorage. Production should move uploads to Supabase Storage.
          onChange([...value, String(reader.result)]);
        };
        reader.readAsDataURL(file);
      });
  }

  function removeImage(image: string) {
    onChange(value.filter((item) => item !== image));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {value.map((image) => (
          <div key={image} className="relative aspect-square overflow-hidden rounded-[12px] border border-fuku-border bg-fuku-light">
            <img src={image} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(image)}
              className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white text-fuku-black"
              aria-label="画像を削除"
            >
              <X size={15} />
            </button>
          </div>
        ))}
        {value.length < maxImages ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="grid aspect-square place-items-center rounded-[12px] border border-dashed border-fuku-border bg-white text-center text-[11px] font-black text-fuku-gray"
          >
            <span>
              <Camera className="mx-auto mb-2 text-fuku-black" size={22} />
              {label}
              <br />
              {value.length}/{maxImages}枚
            </span>
          </button>
        ) : null}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => handleFiles(event.target.files)} />
      <p className="mt-2 text-[10px] font-bold text-fuku-gray">jpg / png / webp / 5MBまで。SVGはアップロードできません。</p>
      {error ? <p className="mt-2 text-[11px] font-black text-fuku-red">{error}</p> : null}
    </div>
  );
}

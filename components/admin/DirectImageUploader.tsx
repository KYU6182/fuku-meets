"use client";

import AdminImagePicker from "./AdminImagePicker";

export default function DirectImageUploader({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (url: string) => void;
}) {
  return <AdminImagePicker value={value} onChange={onSelect} category="fv" label="画像" />;
}

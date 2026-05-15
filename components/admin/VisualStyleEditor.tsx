"use client";

import ColorPickerField from "./ColorPickerField";
import FontSizeControl from "./FontSizeControl";
import SpacingControl from "./SpacingControl";
import type { HeroSlide } from "@/types/cms";

export default function VisualStyleEditor({
  slide,
  onChange,
}: {
  slide: HeroSlide;
  onChange: (patch: Partial<HeroSlide>) => void;
}) {
  return (
    <div className="space-y-4 rounded-[14px] border border-fuku-border bg-white p-4">
      <div>
        <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">Visual Style</p>
        <p className="mt-1 text-[12px] font-bold text-fuku-gray">FVの見た目をリアルタイムで調整します。</p>
      </div>
      <ColorPickerField label="文字色" value={slide.textColor} onChange={(value) => onChange({ textColor: value })} />
      <ColorPickerField label="背景色（画像なし時）" value={slide.backgroundColor ?? "#111111"} onChange={(value) => onChange({ backgroundColor: value })} />
      <ColorPickerField label="ボタン色" value={slide.buttonColor} onChange={(value) => onChange({ buttonColor: value })} />
      <ColorPickerField label="ボタン文字色" value={slide.buttonTextColor} onChange={(value) => onChange({ buttonTextColor: value })} />
      <ColorPickerField label="オーバーレイ色" value={slide.overlayColor.startsWith("#") ? slide.overlayColor : "#111111"} onChange={(value) => onChange({ overlayColor: value })} />
      <FontSizeControl label="タイトル文字サイズ" value={slide.titleFontSize} options={["sm", "md", "lg", "xl"]} onChange={(value) => onChange({ titleFontSize: value })} />
      <FontSizeControl label="サブコピー文字サイズ" value={slide.subtitleFontSize} options={["sm", "md", "lg"]} onChange={(value) => onChange({ subtitleFontSize: value })} />
      <SpacingControl label="角丸" value={slide.cornerRadius ?? "medium"} options={["small", "medium", "large"]} onChange={(value) => onChange({ cornerRadius: value })} />
      <SpacingControl label="余白" value={slide.spacing ?? "standard"} options={["compact", "standard", "spacious"]} onChange={(value) => onChange({ spacing: value })} />
      <div>
        <p className="text-[12px] font-black text-fuku-black">配置</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["left", "center"] as const).map((align) => (
            <button key={align} type="button" onClick={() => onChange({ align })} className={`min-h-[38px] rounded-full border text-[12px] font-black ${slide.align === align ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white"}`}>
              {align}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

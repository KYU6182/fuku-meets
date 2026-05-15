"use client";

import { EyeOff, RotateCcw } from "lucide-react";
import AdminFormField from "./AdminFormField";
import DirectImageUploader from "./DirectImageUploader";
import VisualStyleEditor from "./VisualStyleEditor";
import type { HomeCmsData, HeroSlide } from "@/types/cms";

export default function FvSlideEditor({
  hero,
  activeIndex,
  onActiveIndexChange,
  onHeroChange,
  onSlideChange,
}: {
  hero: HomeCmsData["hero"];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onHeroChange: (patch: Partial<HomeCmsData["hero"]>) => void;
  onSlideChange: (index: number, patch: Partial<HeroSlide>) => void;
}) {
  const slide = hero.slides[activeIndex] ?? hero.slides[0];

  if (!slide) return null;

  return (
    <div className="space-y-5">
      <div className="rounded-[14px] border border-fuku-border bg-fuku-light p-3">
        <p className="text-[12px] font-black text-fuku-black">FV全体設定</p>
        <div className="mt-3 grid gap-3">
          <label className="flex min-h-[42px] items-center justify-between rounded-[10px] bg-white px-3 text-[12px] font-black">
            FVを表示
            <input type="checkbox" checked={hero.isVisible} onChange={(event) => onHeroChange({ isVisible: event.target.checked })} />
          </label>
          <label className="flex min-h-[42px] items-center justify-between rounded-[10px] bg-white px-3 text-[12px] font-black">
            自動スライド
            <input type="checkbox" checked={hero.autoplay} onChange={(event) => onHeroChange({ autoplay: event.target.checked })} />
          </label>
          <AdminFormField label="切り替え間隔(ms)" type="number" value={String(hero.intervalMs)} onChange={(value) => onHeroChange({ intervalMs: Number(value) || 4500 })} />
          <AdminFormField label="高さ" type="select" value={hero.height} options={["compact", "standard", "large"]} onChange={(value) => onHeroChange({ height: value as HomeCmsData["hero"]["height"] })} />
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {hero.slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onActiveIndexChange(index)}
              className={`min-h-[40px] rounded-full border px-4 text-[12px] font-black ${activeIndex === index ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white text-fuku-black"}`}
            >
              Slide {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[14px] border border-fuku-border bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">Slide {activeIndex + 1}</p>
            <h3 className="text-[20px] font-black text-fuku-black">{slide.label || "FVスライド"}</h3>
          </div>
          <button type="button" onClick={() => onSlideChange(activeIndex, { isVisible: !slide.isVisible })} className={`inline-flex min-h-[38px] items-center gap-2 rounded-full px-3 text-[12px] font-black ${slide.isVisible ? "bg-fuku-black text-white" : "bg-fuku-light text-fuku-gray"}`}>
            <EyeOff size={15} />
            {slide.isVisible ? "表示中" : "非表示"}
          </button>
        </div>
        <div className="space-y-4">
          <AdminFormField label="ラベル" value={slide.label} onChange={(value) => onSlideChange(activeIndex, { label: value })} />
          <AdminFormField label="タイトル" type="textarea" value={slide.title} onChange={(value) => onSlideChange(activeIndex, { title: value })} />
          <AdminFormField label="サブコピー" type="textarea" value={slide.subtitle} onChange={(value) => onSlideChange(activeIndex, { subtitle: value })} />
          <AdminFormField label="CTAテキスト" value={slide.ctaText} onChange={(value) => onSlideChange(activeIndex, { ctaText: value })} />
          <AdminFormField label="CTAリンク" value={slide.ctaHref} onChange={(value) => onSlideChange(activeIndex, { ctaHref: value })} />
          <DirectImageUploader value={slide.image} onSelect={(url) => onSlideChange(activeIndex, { image: url })} />
        </div>
      </div>

      <VisualStyleEditor slide={slide} onChange={(patch) => onSlideChange(activeIndex, patch)} />
      <button type="button" onClick={() => onSlideChange(activeIndex, { image: "" })} className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-fuku-border text-[12px] font-black">
        <RotateCcw size={15} />
        画像を外してグラデーションにする
      </button>
    </div>
  );
}

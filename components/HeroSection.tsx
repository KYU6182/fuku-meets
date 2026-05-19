"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDefaultHomeCmsData } from "@/lib/cms";
import type { HomeCmsData, HeroSlide } from "@/types/cms";

const titleSizeClass: Record<HeroSlide["titleFontSize"], string> = {
  sm: "text-[30px]",
  md: "text-[34px]",
  lg: "text-[37px]",
  xl: "text-[42px]",
};

const subtitleSizeClass: Record<HeroSlide["subtitleFontSize"], string> = {
  sm: "text-[12px]",
  md: "text-[14px]",
  lg: "text-[16px]",
};

const heightClass: Record<HomeCmsData["hero"]["height"], string> = {
  compact: "min-h-[390px]",
  standard: "min-h-[450px]",
  large: "min-h-[520px]",
};

const radiusClass: Record<NonNullable<HeroSlide["cornerRadius"]>, string> = {
  small: "rounded-[8px]",
  medium: "rounded-[10px]",
  large: "rounded-[18px]",
};

const spacingClass: Record<NonNullable<HeroSlide["spacing"]>, string> = {
  compact: "px-5 pb-5",
  standard: "px-5 pb-6",
  spacious: "px-6 pb-9",
};

export default function HeroSection({ cms, hero }: { cms?: HomeCmsData["hero"]; hero?: HomeCmsData["hero"] }) {
  const resolvedHero = cms ?? hero ?? getDefaultHomeCmsData().hero;
  const slides = useMemo(() => resolvedHero.slides.filter((slide) => slide.isVisible), [resolvedHero.slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!resolvedHero.autoplay || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, Math.max(resolvedHero.intervalMs, 1200));
    return () => window.clearInterval(timer);
  }, [resolvedHero.autoplay, resolvedHero.intervalMs, slides.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  if (!resolvedHero.isVisible || slides.length === 0) return null;

  const slide = slides[activeIndex] ?? slides[0];
  const minHeight = heightClass[resolvedHero.height];
  const alignment = slide.align === "center" ? "items-center text-center" : "items-start text-left";
  const justify = slide.align === "center" ? "justify-center" : "justify-end";
  const backgroundImage = slide.image
    ? `linear-gradient(180deg, rgba(17,17,17,0.08) 0%, rgba(17,17,17,0.24) 42%, ${slide.overlayColor} 100%), url('${slide.image}')`
    : `linear-gradient(135deg, ${slide.backgroundColor ?? "#111111"}, #3b0f0f)`;

  function move(direction: "prev" | "next") {
    setActiveIndex((current) => {
      if (direction === "prev") return current === 0 ? slides.length - 1 : current - 1;
      return (current + 1) % slides.length;
    });
  }

  return (
    <section className="px-4 pt-4">
      <div
        className={`relative overflow-hidden bg-cover bg-center shadow-soft ${minHeight} ${radiusClass[slide.cornerRadius ?? "medium"]}`}
        style={{ backgroundImage, backgroundColor: slide.backgroundColor ?? "#111111" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.16),transparent_16rem)]" />
        <div className={`relative z-10 flex ${minHeight} flex-col ${justify} ${alignment} ${spacingClass[slide.spacing ?? "standard"]}`}>
          <span className="mb-4 w-fit rounded-[4px] bg-fuku-red px-3 py-1 text-[11px] font-black tracking-widest text-white">
            {slide.label}
          </span>
          <h1 className={`${titleSizeClass[slide.titleFontSize]} whitespace-pre-line font-black leading-[1.22] tracking-wide`} style={{ color: slide.textColor }}>
            {slide.title}
          </h1>
          <p className={`${subtitleSizeClass[slide.subtitleFontSize]} mt-3 max-w-[310px] whitespace-pre-line font-bold leading-relaxed`} style={{ color: slide.textColor }}>
            {slide.subtitle}
          </p>
          <div className={`mt-5 flex w-full flex-wrap items-center gap-3 ${slide.align === "center" ? "justify-center" : "justify-between"}`}>
            <div className="flex flex-wrap gap-2">
              <a
                href={slide.ctaHref}
                className="inline-flex min-h-[46px] items-center gap-3 rounded-full px-5 text-[13px] font-black tracking-wide"
                style={{ backgroundColor: slide.buttonColor, color: slide.buttonTextColor }}
              >
                {slide.ctaText}
                <ArrowRight size={17} />
              </a>
              {slide.id === "hero-1" ? (
                <a
                  href="/start-guide"
                  className="inline-flex min-h-[46px] items-center gap-3 rounded-full border border-fuku-black bg-white px-5 text-[13px] font-black tracking-wide text-fuku-black"
                >
                  初めての方へ
                  <ArrowRight size={17} />
                </a>
              ) : null}
            </div>
            <p className="text-[13px] font-black tracking-widest" style={{ color: slide.textColor }}>
              {activeIndex + 1} / {slides.length}
            </p>
          </div>
          <div className={`mt-6 flex gap-2 ${slide.align === "center" ? "justify-center" : ""}`}>
            {slides.map((dot, index) => (
              <button
                key={dot.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}枚目のFVを見る`}
                className={`h-2 rounded-full ${index === activeIndex ? "w-7 bg-white" : "w-2 bg-white/[0.55]"}`}
              />
            ))}
          </div>
        </div>
        {slides.length > 1 ? (
          <div className="absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 justify-between">
            <button type="button" onClick={() => move("prev")} className="grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur" aria-label="前のスライド">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => move("next")} className="grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur" aria-label="次のスライド">
              <ChevronRight size={18} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

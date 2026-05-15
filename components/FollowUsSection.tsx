import { ArrowRight, Instagram, Music2 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function FollowUsSection() {
  return (
    <section className="bg-white px-5 py-9">
      <SectionHeader title="FOLLOW US" subtitle="福岡の“今”をSNSでも。" />
      <div className="flex items-center justify-between gap-4">
        <a href="https://instagram.com/fuku_meets.jp" className="flex min-w-0 flex-1 items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#feda75,#d62976,#4f5bd5)] text-white">
            <Instagram size={37} strokeWidth={2.1} />
          </span>
          <span className="min-w-0">
            <span className="block text-[24px] font-black leading-none text-fuku-black">
              Instagram
            </span>
            <span className="mt-2 flex items-center gap-2 text-[15px] font-black text-fuku-gray">
              @fuku_meets.jp
              <ArrowRight size={17} />
            </span>
          </span>
        </a>
        <div className="flex shrink-0 gap-3">
          <a
            href="https://www.tiktok.com/@fuku_meets.jp"
            className="grid h-11 w-11 place-items-center rounded-full bg-fuku-black text-white"
            aria-label="TikTok"
          >
            <Music2 size={21} />
          </a>
          <a
            href="https://x.com/fuku_meets"
            className="grid h-11 w-11 place-items-center rounded-full bg-fuku-black text-[18px] font-black text-white"
            aria-label="X"
          >
            X
          </a>
        </div>
      </div>
    </section>
  );
}

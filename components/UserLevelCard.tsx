import { ChevronRight } from "lucide-react";
import type { UserLevel } from "@/types/community";

export default function UserLevelCard({ level }: { level: UserLevel }) {
  const percent = Math.min(100, Math.round((level.point / Math.max(level.nextLevelPoint, 1)) * 100));
  return (
    <section className="rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="headline-condensed text-[29px] uppercase leading-none text-fuku-black">FUKU LEVEL</h2>
        <ChevronRight size={18} />
      </div>
      <div className="mt-4 flex items-end gap-4">
        <div>
          <p className="text-[12px] font-black text-fuku-black">LEVEL</p>
          <p className="headline-condensed text-[72px] leading-none text-fuku-black">{level.level}</p>
        </div>
        <p className="pb-3 text-[19px] font-black text-fuku-black">{level.title}</p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-fuku-light">
        <div className="h-full rounded-full bg-fuku-red" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-3 text-[12px] font-bold text-fuku-black">次のレベルまであと {Math.max(level.nextLevelPoint - level.point, 0)}pt</p>
    </section>
  );
}

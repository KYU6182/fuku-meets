import { Camera, Coffee, Crown, Heart, Sparkles, Star } from "lucide-react";
import type { UserBadge } from "@/types/community";

const iconMap = { camera: Camera, coffee: Coffee, heart: Heart, crown: Crown, spark: Sparkles, star: Star };

export default function UserBadgeList({ badges, compact = false }: { badges: UserBadge[]; compact?: boolean }) {
  return (
    <section className="rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-black text-fuku-black">獲得バッジ</h2>
        {!compact ? <a href="/mypage/badges" className="text-[11px] font-black text-fuku-black">すべて見る →</a> : null}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {badges.slice(0, compact ? 9 : 3).map((badge) => {
          const Icon = iconMap[badge.icon as keyof typeof iconMap] ?? Star;
          return (
            <article key={badge.id} className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-[#fff1f1] text-fuku-red">
                <Icon size={25} />
              </span>
              <p className="mt-2 text-[10px] font-black text-fuku-black">{badge.label}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

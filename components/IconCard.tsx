import { Heart } from "lucide-react";
import type { FukuIcon } from "@/lib/data/icons";

export default function IconCard({ icon }: { icon: FukuIcon }) {
  return (
    <a href={`/icons/${icon.slug}`} className="flex items-center gap-3 rounded-[14px] border border-fuku-border bg-white p-3">
      <div
        className="h-16 w-16 shrink-0 rounded-full bg-fuku-light bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.12), rgba(17,17,17,.12)), url('${icon.image}')`,
        }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-black text-fuku-black">{icon.name}</span>
        <span className="mt-1 block text-[11px] font-bold text-fuku-gray">{icon.category}</span>
        <span className="mt-1 block text-[11px] font-black text-fuku-black">{icon.votes.toLocaleString()}票</span>
      </span>
      <Heart size={18} className="text-fuku-red" />
    </a>
  );
}

import { MapPin } from "lucide-react";
import type { Spot } from "@/lib/data/spots";

export default function SpotCard({ spot }: { spot: Spot }) {
  return (
    <a href={`/spots/${spot.slug}`} className="block overflow-hidden rounded-[14px] border border-fuku-border bg-white">
      <div
        className="h-[118px] bg-fuku-light bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.12), rgba(17,17,17,.16)), url('${spot.images[0]}')`,
        }}
      />
      <div className="p-4">
        <p className="flex items-center gap-1 text-[10px] font-black text-fuku-red">
          <MapPin size={13} />
          {spot.area}エリア
        </p>
        <h3 className="mt-2 text-[15px] font-black text-fuku-black">{spot.name}</h3>
        <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-relaxed text-fuku-gray">
          {spot.description}
        </p>
      </div>
    </a>
  );
}

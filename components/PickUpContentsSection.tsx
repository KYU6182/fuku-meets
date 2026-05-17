import { CalendarPlus } from "lucide-react";
import SectionHeader from "./SectionHeader";
type LegacyPickupCms = {
  title?: string;
  subtitle?: string;
  featuredNewsIds?: string[];
  ctaText?: string;
  ctaHref?: string;
  isVisible?: boolean;
};

type PickupContent = {
  image: string;
  label: string;
  title: string;
  date: string;
};

type PickUpContentsSectionProps = {
  pickupContents: PickupContent[];
  cms?: LegacyPickupCms;
};

export default function PickUpContentsSection({ pickupContents, cms }: PickUpContentsSectionProps) {
  if (cms?.isVisible === false) return null;
  const hrefs = [
    "/news/local-news-fukuoka-now",
    "/news/fukuoka-food-feature",
    "/news/area-guide-fukuoka",
  ];

  return (
    <section className="bg-white px-5 py-8">
      <SectionHeader title={cms?.title ?? "PICK UP CONTENTS"} subtitle={cms?.subtitle} actionLabel={`${cms?.ctaText ?? "すべて見る"} →`} href={cms?.ctaHref ?? "/news"} />
      <div className="grid grid-cols-3 gap-3">
        {pickupContents.map((item, index) => (
          <a key={item.title} href={hrefs[index] ?? "/news"} className="min-w-0">
            <div
              className="relative h-[78px] rounded-[7px] bg-fuku-light bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(17,17,17,0.02), rgba(17,17,17,0.22)), url('${item.image}')`,
              }}
            >
              <span className="absolute left-2 top-2 rounded-[3px] bg-white px-2 py-1 text-[8px] font-black uppercase tracking-wide text-fuku-red">
                {item.label}
              </span>
            </div>
            <h3 className="mt-2 text-[12px] font-black leading-snug text-fuku-black">{item.title}</h3>
            <p className="mt-1 text-[9px] font-bold text-fuku-gray">{item.date}</p>
          </a>
        ))}
      </div>

      <a
        href="/forms/event-submit"
        className="mt-7 flex min-h-[82px] items-center gap-4 rounded-[10px] bg-fuku-light px-4"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-fuku-red">
          <CalendarPlus size={23} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-black text-fuku-black">イベント投稿</span>
          <span className="mt-1 block text-[11px] font-bold leading-relaxed text-fuku-gray">
            福岡のイベントや街のニュースを編集部へ送る。
          </span>
        </span>
        <span className="text-[22px] font-black">→</span>
      </a>
    </section>
  );
}

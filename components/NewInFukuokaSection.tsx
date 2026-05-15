import { ArrowRight, BookOpen, Building2, MapPin, Utensils } from "lucide-react";
import SectionHeader from "./SectionHeader";

type NewInFukuokaItem = {
  icon: string;
  title: string;
  description: string;
};

type NewInFukuokaSectionProps = {
  newInFukuokaItems: NewInFukuokaItem[];
};

const iconMap = {
  MapPin,
  Building2,
  Utensils,
  BookOpen,
};

export default function NewInFukuokaSection({
  newInFukuokaItems,
}: NewInFukuokaSectionProps) {
  return (
    <section className="bg-fuku-bg px-4 py-10">
      <SectionHeader title="NEW IN FUKUOKA" subtitle="はじめての福岡ガイド" />

      <article className="overflow-hidden rounded-[14px] border border-fuku-border bg-[#f4eadb] p-5">
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-black uppercase tracking-widest text-fuku-red">
              Welcome to Fukuoka!
            </p>
            <h3 className="mt-3 text-[24px] font-black leading-snug text-fuku-black">
              はじめての福岡ガイド
            </h3>
            <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-black">
              エリア・グルメ・遊び方までこれひとつ。
              <br />
              新しい福岡生活をもっと楽しく。
            </p>
            <a
              href="/new-in-fukuoka"
              className="mt-5 inline-flex min-h-[46px] items-center gap-3 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white"
            >
              まずはこちら
              <ArrowRight size={16} />
            </a>
          </div>
          <div
            className="min-h-[150px] rounded-[10px] bg-fuku-light bg-cover bg-center"
            style={{ backgroundImage: "url('/images/fukuoka-city.jpg')" }}
          />
        </div>
      </article>

      <div className="mt-4 space-y-3">
        {newInFukuokaItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? MapPin;
          const hrefMap: Record<string, string> = {
            "まず行きたい定番スポット": "/new-in-fukuoka/standard-spots",
            "最初に住みたい街": "/new-in-fukuoka/best-areas-to-live",
            "はじめての行きつけ特集": "/new-in-fukuoka/first-regular-shops",
          };
          return (
            <a
              key={item.title}
              href={hrefMap[item.title] ?? "/new-in-fukuoka"}
              className="flex min-h-[92px] items-center gap-4 rounded-[12px] border border-fuku-border bg-white px-4"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-fuku-light text-fuku-red">
                <Icon size={27} strokeWidth={2.1} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-black text-fuku-black">{item.title}</span>
                <span className="mt-1 block text-[12px] font-bold leading-relaxed text-fuku-gray">
                  {item.description}
                </span>
              </span>
              <ArrowRight size={19} className="shrink-0 text-fuku-black" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

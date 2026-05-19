import { ArrowRight, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { getRelatedMeets, getShopGuideBySlug } from "@/lib/shopGuides";

export default async function ShopGuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getShopGuideBySlug(slug);
  const relatedMeets = getRelatedMeets(guide.relatedMeetIds);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-[#fbfaf7] shadow-phone">
      <Header />
      <main className="pb-28">
        <div className="px-4 pt-5">
          <a href="/visitor" className="text-[13px] font-black text-fuku-black">← VISITOR GUIDEに戻る</a>
          <div
            className="mt-4 h-[218px] rounded-[18px] bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.45)),url('${guide.image}')` }}
          />
          <section className="-mt-6 rounded-[18px] border border-fuku-border bg-white p-5 shadow-soft">
            <span className="rounded-full bg-[#fff1f1] px-3 py-2 text-[11px] font-black text-fuku-red">{guide.category}</span>
            <h1 className="mt-4 text-[30px] font-black leading-tight text-fuku-black">{guide.title}</h1>
            <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">{guide.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fbfaf7] px-3 py-2 text-[11px] font-black text-fuku-black">
                <MapPin size={13} /> {guide.area}
              </span>
              {guide.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#fff1f1] px-3 py-2 text-[11px] font-black text-fuku-red">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[20px] font-black text-fuku-black">ガイド本文</h2>
          <div className="mt-3 space-y-3 text-[13px] font-bold leading-relaxed text-fuku-black">
            {guide.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {guide.placeholderNote ? (
            <p className="mt-4 rounded-[12px] bg-[#fbfaf7] p-3 text-[11px] font-bold leading-relaxed text-fuku-gray">
              {guide.placeholderNote}
            </p>
          ) : null}
        </section>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[20px] font-black text-fuku-black">目的別の見方</h2>
          <div className="mt-4 grid gap-3">
            {guide.items.map((item) => (
              <div key={item.name} className="rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-4">
                <p className="text-[15px] font-black text-fuku-black">{item.name}</p>
                <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-fuku-black">
                    <MapPin size={12} /> {item.area}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-fuku-red">{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="text-[20px] font-black text-fuku-black">関連MEET</h2>
          <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">
            記事を読んだあと、そのまま参加できるMEETをチェック。
          </p>
          <div className="mt-4 grid gap-3">
            {relatedMeets.map((meet) => (
              <a key={meet.id} href={`/meet/${meet.slug}`} className="flex gap-3 rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-3">
                <div
                  className="h-20 w-24 shrink-0 rounded-[10px] bg-fuku-light bg-cover bg-center"
                  style={{ backgroundImage: `url('${meet.image || "/images/meet/creep-live.jpg"}')` }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-black leading-tight text-fuku-black">{meet.title}</span>
                  <span className="mt-1 block text-[10px] font-bold text-fuku-gray">
                    <CalendarDays size={11} className="mr-1 inline" />
                    {meet.date} {meet.startTime}〜 / {meet.publicAreaLabel ?? meet.area}
                  </span>
                  <span className="mt-2 inline-flex rounded-full bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-fuku-red">
                    参加予定 {meet.participantCount}人
                  </span>
                </span>
                <ArrowRight size={16} className="mt-1 shrink-0" />
              </a>
            ))}
          </div>
          <a href="/meet/today" className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white">
            今日参加できるMEETを見る
            <ArrowRight size={16} />
          </a>
        </section>

        <section className="mx-4 mt-4 rounded-[16px] border border-fuku-border bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-[18px] font-black text-fuku-black"><ShieldCheck className="text-fuku-red" /> 安心して参加するために</h2>
          <p className="mt-3 text-[12px] font-bold leading-relaxed text-fuku-gray">
            店舗詳細は参加確定者にのみ共有される場合があります。20歳未満の飲酒、連絡先交換の強要、迷惑行為は禁止です。
          </p>
        </section>
      </main>
      <BottomNav active="meet" />
    </div>
  );
}

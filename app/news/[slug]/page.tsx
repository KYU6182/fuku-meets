import { ArrowRight, Bookmark, CalendarDays, Share2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import QuickActionButton from "@/components/QuickActionButton";
import { getNewsBySlug } from "@/lib/data/news";
import { storageKeys } from "@/lib/storageKeys";
import { defaultCommunities } from "@/lib/communityMeet";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  const relatedMeets = defaultCommunities.filter((community) => article.relatedMeetIds?.includes(community.id));

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <article className="bg-white">
          <div className="h-[230px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${article.image}')` }} />
          <div className="px-4 py-5">
            <p className="text-[11px] font-black text-fuku-red">{article.category}</p>
            <h1 className="mt-2 text-[26px] font-black leading-tight">{article.title}</h1>
            <p className="mt-2 text-[11px] font-bold text-fuku-gray">{article.date}</p>
            <div className="mt-4 rounded-[14px] bg-fuku-light p-4">
              <p className="text-[13px] font-black leading-relaxed">{article.summary}</p>
            </div>
            <div className="mt-5 space-y-4 text-[14px] font-bold leading-relaxed text-fuku-black">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <QuickActionButton label="保存" storageKey={storageKeys.savedNews} value={article.slug} message="記事を保存しました" className="border border-fuku-border bg-white text-fuku-black" />
              <Button href={`https://x.com/intent/tweet?text=${encodeURIComponent(article.title)}`} variant="light">
                <Share2 size={15} />
                シェア
              </Button>
            </div>
          </div>
        </article>
        <section className="border-t border-fuku-border bg-white px-4 py-5">
          <h2 className="mb-3 flex items-center gap-2 text-[17px] font-black">
            <Bookmark size={17} className="text-fuku-red" />
            関連MEET
          </h2>
          {relatedMeets.length ? (
            <div className="grid gap-3">
              {relatedMeets.map((meet) => (
                <a key={meet.id} href={`/meet/${meet.slug}`} className="flex gap-3 rounded-[14px] border border-fuku-border bg-[#fbfaf7] p-3">
                  <div className="h-20 w-24 shrink-0 rounded-[10px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${meet.image || "/images/meet/creep-live.jpg"}')` }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-black leading-tight text-fuku-black">{meet.title}</span>
                    <span className="mt-1 block text-[10px] font-bold text-fuku-gray">
                      <CalendarDays size={11} className="mr-1 inline" />
                      {meet.date} {meet.startTime}〜 / {meet.publicAreaLabel ?? meet.area}
                    </span>
                    <span className="mt-2 inline-block rounded-full bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-fuku-red">このMEETを見る</span>
                  </span>
                  <ArrowRight size={16} className="mt-1 shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <Button href="/meet/today" variant="red">今日参加できるMEETを見る</Button>
          )}
        </section>
      </main>
      <BottomNav active="news" />
    </div>
  );
}

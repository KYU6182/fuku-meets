import { Bookmark, Share2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import QuickActionButton from "@/components/QuickActionButton";
import { getNewsBySlug } from "@/lib/data/news";
import { storageKeys } from "@/lib/storageKeys";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

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
            関連リンク
          </h2>
          <div className="grid gap-2">
            <Button href="/ranking" variant="light">関連ランキング</Button>
            <Button href="/search" variant="light">関連スポットを探す</Button>
          </div>
        </section>
      </main>
      <BottomNav active="news" />
    </div>
  );
}

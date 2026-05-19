import { Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import QuickActionButton from "@/components/QuickActionButton";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import { storageKeys } from "@/lib/storageKeys";

type NewsRow = {
  slug: string;
  title: string;
  category: string | null;
  cover_image_url?: string | null;
  excerpt?: string | null;
  body_markdown?: string | null;
  published_at?: string | null;
};

async function getPublishedArticle(slug: string): Promise<NewsRow | null> {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as NewsRow;
}

function paragraphs(markdown: string | null | undefined) {
  return String(markdown || "").split(/\n\n+/).map((text) => text.trim()).filter(Boolean);
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <article className="bg-white">
          <div
            className="h-[230px] bg-fuku-light bg-cover bg-center"
            style={article.cover_image_url ? { backgroundImage: `url('${article.cover_image_url}')` } : undefined}
          />
          <div className="px-4 py-5">
            <p className="text-[11px] font-black text-fuku-red">{article.category || "LOCAL MEDIA"}</p>
            <h1 className="mt-2 text-[26px] font-black leading-tight">{article.title}</h1>
            <p className="mt-2 text-[11px] font-bold text-fuku-gray">
              {article.published_at ? new Date(article.published_at).toLocaleDateString("ja-JP") : "近日公開"}
            </p>
            {article.excerpt ? (
              <div className="mt-4 rounded-[14px] bg-fuku-light p-4">
                <p className="text-[13px] font-black leading-relaxed">{article.excerpt}</p>
              </div>
            ) : null}
            <div className="mt-5 space-y-4 text-[14px] font-bold leading-relaxed text-fuku-black">
              {paragraphs(article.body_markdown).map((paragraph) => (
                paragraph.startsWith("![") ? (
                  <img key={paragraph} src={paragraph.match(/\((.*?)\)/)?.[1] || ""} alt="" className="w-full rounded-[14px]" />
                ) : (
                  <p key={paragraph}>{paragraph}</p>
                )
              ))}
              {!paragraphs(article.body_markdown).length ? <p>本文は準備中です。</p> : null}
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
      </main>
      <BottomNav active="news" />
    </div>
  );
}

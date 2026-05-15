"use client";

import { Bookmark, Instagram, MapPin, Share2, Star, ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import QuickActionButton from "@/components/QuickActionButton";
import SpotCommentForm from "@/components/SpotCommentForm";
import { getSpotBySlug, spots } from "@/lib/data/spots";
import { storageKeys } from "@/lib/storageKeys";

export default function SpotDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const spot = getSpotBySlug(slug);
  const recommended = spots.filter((item) => item.slug !== spot.slug && item.category === spot.category).slice(0, 2);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <section className="bg-white">
          <div
            className="h-[250px] bg-fuku-light bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(17,17,17,.08), rgba(17,17,17,.5)), url('${spot.images[0]}')` }}
          />
          <div className="px-4 py-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-fuku-light px-3 py-1 text-[10px] font-black">{spot.area}</span>
              <span className="rounded-full bg-fuku-light px-3 py-1 text-[10px] font-black">{spot.isOpenNow ? "営業中" : "営業時間外"}</span>
            </div>
            <h1 className="mt-3 text-[28px] font-black leading-tight text-fuku-black">{spot.name}</h1>
            <p className="mt-2 flex items-center gap-1 text-[12px] font-bold text-fuku-gray">
              <MapPin size={14} />
              {spot.category} / {spot.station}
            </p>
            <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-black">{spot.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <QuickActionButton label="保存" storageKey={storageKeys.savedSpots} value={spot.slug} message="保存しました" className="border border-fuku-border bg-white text-fuku-black" />
              <QuickActionButton label="投票" storageKey={storageKeys.votedItems} value={`spot:${spot.slug}`} message="投票しました" />
              <Button href={`https://x.com/intent/tweet?text=${encodeURIComponent(spot.name)}`} variant="light">
                <Share2 size={14} />
                シェア
              </Button>
            </div>
          </div>
        </section>

        <DetailSection title="AIまとめ">
          <p className="text-[13px] font-bold leading-relaxed text-fuku-gray">{spot.aiSummary}</p>
        </DetailSection>

        <DetailSection title="みんなの推しポイント">
          <div className="flex flex-wrap gap-2">
            {spot.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#fff1f1] px-3 py-2 text-[11px] font-black text-fuku-red">
                {tag}
              </span>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="基本情報">
          <dl className="space-y-3 text-[13px] font-bold">
            <InfoRow label="住所" value={spot.address} />
            <InfoRow label="営業時間" value={spot.openingHours} />
            <InfoRow label="保存数" value={`${spot.saves.toLocaleString()}件`} />
            <InfoRow label="投票数" value={`${spot.votes.toLocaleString()}票`} />
          </dl>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button href={spot.instagramUrl} variant="light">
              <Instagram size={15} />
              Instagram
            </Button>
            <Button href={spot.mapUrl} variant="light">
              地図を見る
            </Button>
          </div>
        </DetailSection>

        <DetailSection title="ランキング掲載状況">
          {spot.rankings.map((ranking) => (
            <div key={ranking.title} className="flex items-center justify-between rounded-[12px] bg-fuku-light px-4 py-3">
              <span className="text-[12px] font-black">{ranking.title}</span>
              <span className="text-[14px] font-black text-fuku-red">{ranking.rank}位</span>
            </div>
          ))}
        </DetailSection>

        <DetailSection title="この店が好きな人におすすめ">
          <div className="grid grid-cols-2 gap-3">
            {recommended.map((item) => (
              <a key={item.slug} href={`/spots/${item.slug}`} className="rounded-[12px] border border-fuku-border bg-white p-3">
                <div className="h-20 rounded-[8px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${item.images[0]}')` }} />
                <p className="mt-2 text-[12px] font-black">{item.name}</p>
              </a>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="みんなの推しコメント">
          <SpotCommentForm targetId={spot.slug} targetTitle={spot.name} />
        </DetailSection>

        <DetailSection title="編集部ピックアップコメント">
          <div className="space-y-3">
            {spot.comments.map((comment) => (
              <article key={comment.user} className="rounded-[12px] border border-fuku-border bg-white p-4">
                <p className="text-[13px] font-bold leading-relaxed">{comment.text}</p>
                <p className="mt-2 text-[11px] font-black text-fuku-gray">{comment.user}</p>
              </article>
            ))}
          </div>
          <Button href="/forms/listing" variant="outline" className="mt-4 w-full">
            店舗情報修正 / 掲載申請
          </Button>
        </DetailSection>
      </main>
      <BottomNav active="home" />
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-fuku-border bg-white px-4 py-5">
      <h2 className="mb-4 flex items-center gap-2 text-[18px] font-black">
        <Star size={16} className="text-fuku-red" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-fuku-border pb-2">
      <dt className="text-fuku-gray">{label}</dt>
      <dd className="text-right text-fuku-black">{value}</dd>
    </div>
  );
}

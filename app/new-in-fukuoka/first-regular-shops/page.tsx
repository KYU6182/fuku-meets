import type { Metadata } from "next";
import GuideLayout from "@/components/GuideLayout";
import SpotCard from "@/components/SpotCard";
import { spots } from "@/lib/data/spots";

export const metadata: Metadata = {
  title: "はじめての行きつけ特集 | FUKU-MEETS",
  description: "福岡ではじめての行きつけにしたいカフェ、ランチ、美容室、夜スポットを紹介。",
};

export default function FirstRegularShopsPage() {
  return (
    <GuideLayout title="はじめての行きつけ特集" copy="この街で、自分の定番を見つける。">
      {spots.slice(0, 5).map((spot) => <SpotCard key={spot.slug} spot={spot} />)}
    </GuideLayout>
  );
}

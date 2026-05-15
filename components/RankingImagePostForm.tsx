"use client";

import SpotCommentForm from "./SpotCommentForm";

export default function RankingImagePostForm({ rankingSlug, entrySlug, title }: { rankingSlug: string; entrySlug: string; title: string }) {
  return <SpotCommentForm targetType="ranking" targetId={`${rankingSlug}:${entrySlug}`} targetTitle={title} />;
}

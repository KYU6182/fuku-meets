"use client";

import SpotCommentForm from "./SpotCommentForm";

export default function RankingCommentForm({ rankingSlug, title }: { rankingSlug: string; title: string }) {
  return <SpotCommentForm targetType="ranking" targetId={rankingSlug} targetTitle={title} />;
}

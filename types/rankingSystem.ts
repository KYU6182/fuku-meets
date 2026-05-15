export type RankingCategoryId = "food" | "people" | "daily" | "night" | "area";

export type RankingEntry = {
  rank: number;
  slug: string;
  name: string;
  votes: number;
  image: string;
  area?: string;
  description: string;
  tags: string[];
  note?: string;
  address?: string;
  mapUrl?: string;
  instagramUrl?: string;
  pickedComments?: string[];
};

export type RankingTheme = {
  id: string;
  slug: string;
  category: RankingCategoryId;
  title: string;
  description: string;
  period: string;
  image: string;
  top3: string[];
  entries: RankingEntry[];
};

export type RankingVoteRecord = {
  userId: string;
  rankingSlug: string;
  entrySlug: string;
  createdAt: string;
};

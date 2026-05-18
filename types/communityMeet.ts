export type CommunityMeet = {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  area: string;
  venueName: string;
  venueVisibility: "public" | "participants_only";
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  tags: string[];
  fee?: number;
  galleryImages?: string[];
  notices?: string[];
  capacity: number;
  participantCount: number;
  maleRatio: number;
  femaleRatio: number;
  ageRange: string;
  isSoloFriendly: boolean;
  isWomenOnly: boolean;
  isBeginnerFriendly: boolean;
  isVerifiedOnly: boolean;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostRank: string;
  hostReviewScore: number;
  hostEventCount: number;
  status: "draft" | "published" | "closed" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type CommunityParticipant = {
  id: string;
  communityId: string;
  userId: string;
  displayName: string;
  avatar: string;
  ageRange: string;
  area: string;
  status: "interested" | "joined" | "checked_in" | "cancelled";
  createdAt: string;
};

export type CommunityReview = {
  id: string;
  communityId: string;
  reviewerId: string;
  hostId: string;
  rating: number;
  safetyRating: number;
  hostRating: number;
  venueRating: number;
  comment: string;
  wouldJoinAgain: boolean;
  createdAt: string;
};

export type CommunityHost = {
  id: string;
  userId: string;
  displayName: string;
  avatar: string;
  rank: string;
  reviewScore: number;
  eventCount: number;
  cancelRate: number;
  isVerified: boolean;
  bio: string;
};

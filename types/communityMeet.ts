export type CommunityMeet = {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  heroImage?: string;
  galleryImages?: string[];
  area: string;
  venueName: string;
  detailVenueName?: string;
  publicAreaLabel?: string;
  participantVenueName?: string;
  participantAddress?: string;
  participantMemo?: string;
  participantNotes?: string;
  venueVisibility: "public" | "participants_only";
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  tags: string[];
  fee?: number;
  notices?: string[];
  capacity: number;
  participantCount: number;
  maleRatio: number;
  femaleRatio: number;
  ageRange: string;
  isSoloFriendly: boolean;
  isWomenOnly: boolean;
  isWomenFriendly?: boolean;
  isAge20Only?: boolean;
  isBeginnerFriendly: boolean;
  isVerifiedOnly: boolean;
  relatedNewsIds?: string[];
  relatedLiveIds?: string[];
  safety?: {
    womenOnly?: boolean;
    soloOk?: boolean;
    splitBillRecommended?: boolean;
    identityVerifiedRequired?: boolean;
    locationHiddenUntilJoined?: boolean;
    firstTimerRate?: number;
    localRate?: number;
    travelerRate?: number;
    maleCount?: number;
    femaleCount?: number;
  };
  artist?: {
    name?: string;
    slug?: string;
  };
  participantProfiles?: Array<{
    id: string;
    iconUrl?: string;
    genderLabel: string;
    ageLabel: string;
    areaLabel: string;
    fanHistory?: string;
    favoriteSong?: string;
    comment?: string;
  }>;
  faqs?: Array<{
    id: string;
    question: string;
    answer: string;
    order?: number;
  }>;
  joinOptions?: {
    canLeaveEarly?: boolean;
    canJoinLate?: boolean;
    nonAlcoholOk?: boolean;
    firstTimerSupport?: boolean;
  };
  privateLocation?: {
    venueName?: string;
    address?: string;
    googleMapUrl?: string;
    reservationName?: string;
    meetingMemo?: string;
    hostContactMemo?: string;
  };
  cancelPolicy?: {
    cancelUntil?: string;
    waitlistEnabled?: boolean;
    autoPromoteWaitlist?: boolean;
  };
  relatedMeetTabs?: Array<{
    label: string;
    type: string;
    meetSlugs: string[];
  }>;
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

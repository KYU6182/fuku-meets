export type AiContentType = "NEWS記事" | "店舗紹介文" | "FUKU ICONSプロフィール" | "SEO description" | "Instagram投稿文";

export type AiGeneratedText = {
  title: string;
  body: string;
  tone: string;
  contentType: AiContentType;
};

export type AiTagResult = {
  areaTags: string[];
  genreTags: string[];
  moodTags: string[];
  weekendGuideTags: string[];
  seoTags: string[];
};

export type AiRankingIdea = {
  title: string;
  description: string;
  category: string;
  candidates: string[];
  socialPost: string;
};

export type AiQualityCheckStatus = "OK" | "注意" | "修正推奨";

export type AiQualityCheckResult = {
  item: string;
  status: AiQualityCheckStatus;
  message: string;
};

export type AiBannerDraft = {
  title: string;
  subtitle: string;
  palette: string;
  layout: string;
};

export type AiShopImportCandidate = {
  id: string;
  name: string;
  area: string;
  genre: string;
  source: string;
  generatedDescription: string;
  tags: string[];
  duplicateStatus: "重複なし" | "要確認";
};

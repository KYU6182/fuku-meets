export type CmsImageCategory = "fv" | "banner" | "shop" | "icons" | "news" | "magazine" | "ranking" | "other";

export type CmsImage = {
  id: string;
  url: string;
  name: string;
  alt: string;
  category: CmsImageCategory;
  createdAt: string;
};

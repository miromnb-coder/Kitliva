export type ListingCategory =
  | "cycling"
  | "winter"
  | "outdoor"
  | "music"
  | "cameras"
  | "fitness"
  | "gaming"
  | "kids";

export type ListingCondition = "new" | "like_new" | "good" | "fair" | "poor";

export type Listing = {
  id: string;
  title: string;
  subtitle: string;
  category: ListingCategory;
  price: number;
  originalPrice?: number;
  currency: "EUR" | "USD";
  imageUrl: string;
  condition: ListingCondition;
  isGreatDeal?: boolean;
};

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

export type ListingDetailRow = {
  label: string;
  value: string;
};

export type ListingDeliveryOption = {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  icon: string;
};

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
  conditionLabel: string;
  isGreatDeal?: boolean;
  sellerName: string;
  sellerInitial: string;
  sellerLocation: string;
  sellerDistanceKm: number;
  sellerRating: number;
  sellerReviewCount: number;
  aiPriceMin: number;
  aiPriceMax: number;
  aiSimilarListings: number;
  details: ListingDetailRow[];
  deliveryOptions: ListingDeliveryOption[];
};

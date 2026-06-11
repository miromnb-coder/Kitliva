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

export type ListingStatus = "draft" | "active" | "reserved" | "sold" | "archived" | "removed";

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
  sellerId?: string;
  status?: ListingStatus;
  title: string;
  subtitle: string;
  description?: string | null;
  category: ListingCategory;
  categoryName?: string;
  price: number;
  originalPrice?: number;
  currency: "EUR" | "USD";
  imageUrl: string | null;
  imageUrls?: string[];
  imageCount?: number;
  condition: ListingCondition;
  conditionLabel: string;
  isGreatDeal?: boolean;
  isFavorite?: boolean;
  sellerName: string;
  sellerInitial: string;
  sellerLocation: string;
  sellerBio?: string | null;
  sellerAvatarUrl?: string | null;
  sellerIsVerified?: boolean;
  sellerIsTrusted?: boolean;
  sellerTrustLabel?: string;
  sellerDistanceKm: number;
  sellerRating: number;
  sellerReviewCount: number;
  aiPriceMin: number;
  aiPriceMax: number;
  aiSimilarListings: number;
  details: ListingDetailRow[];
  deliveryOptions: ListingDeliveryOption[];
  viewCount?: number;
  favoriteCount?: number;
  createdAt?: string | null;
  publishedAt?: string | null;
};

export type CreateListingInput = {
  sellerId: string;
  title: string;
  description: string;
  categoryName: string;
  conditionLabel: string;
  priceLabel: string;
  locationCity?: string | null;
  locationCountry?: string | null;
  brand?: string | null;
  model?: string | null;
};

export type PublishedListing = {
  id: string;
  title: string;
  description: string | null;
  categoryName: string;
  condition: ListingCondition;
  conditionLabel: string;
  priceAmount: number;
  priceCurrency: string;
  locationCity: string | null;
  locationCountry: string | null;
  status: ListingStatus;
  publishedAt: string | null;
  coverImageUrl?: string | null;
};

export type CreateListingResult =
  | {
      success: true;
      listing: PublishedListing;
    }
  | {
      success: false;
      message: string;
    };

import { ListingCondition } from "@/types/listing";

export type SearchSortOption = "recommended" | "newest" | "price_low" | "price_high";
export type SearchDeliveryOption = "any" | "pickup" | "shipping";

export type SearchFilters = {
  categoryName: string;
  condition: ListingCondition | "any";
  minPrice: string;
  maxPrice: string;
  city: string;
  deliveryOption: SearchDeliveryOption;
  sort: SearchSortOption;
};

export const defaultSearchFilters: SearchFilters = {
  categoryName: "All",
  condition: "any",
  minPrice: "",
  maxPrice: "",
  city: "",
  deliveryOption: "any",
  sort: "recommended"
};

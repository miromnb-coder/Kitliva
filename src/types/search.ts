import { ListingCondition } from "@/types/listing";

export type SearchSortOption = "newest" | "price_low" | "price_high";

export type SearchFilters = {
  categoryName: string;
  condition: ListingCondition | "any";
  minPrice: string;
  maxPrice: string;
  city: string;
  sort: SearchSortOption;
};

export const defaultSearchFilters: SearchFilters = {
  categoryName: "All",
  condition: "any",
  minPrice: "",
  maxPrice: "",
  city: "",
  sort: "newest"
};

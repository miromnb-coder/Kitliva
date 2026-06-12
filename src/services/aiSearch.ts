import { supabase } from "@/lib/supabase";
import { ListingCondition } from "@/types/listing";
import { SearchFilters, SearchSortOption } from "@/types/search";

export type AISearchResult = {
  query: string;
  categoryName: string | null;
  condition: ListingCondition | "any";
  minPrice: number | null;
  maxPrice: number | null;
  sort: SearchSortOption;
  explanation: string;
  chips: string[];
  mock?: boolean;
};

export type AISearchRequest = {
  query: string;
  currentFilters: SearchFilters;
};

const categories = ["Cycling", "Winter", "Outdoor", "Music", "Cameras", "Fitness", "Gaming", "Kids’ Gear"];
const conditions: Array<ListingCondition | "any"> = ["any", "new", "like_new", "good", "fair", "poor"];

function findMaxPrice(query: string) {
  const underMatch = query.match(/(?:under|alle|max|below|less than)\s*€?\s*(\d+)/i);
  if (underMatch?.[1]) return Number.parseInt(underMatch[1], 10);
  const euroMatch = query.match(/€\s*(\d+)/i);
  if (euroMatch?.[1]) return Number.parseInt(euroMatch[1], 10);
  return null;
}

function inferCategory(query: string) {
  const normalized = query.toLowerCase();
  if (/bike|cycling|bicycle|pyör|cycle/.test(normalized)) return "Cycling";
  if (/ski|snow|winter|talvi|laskettel/.test(normalized)) return "Winter";
  if (/hiking|camp|tent|outdoor|retki|vaellus|backpack|tuoli/.test(normalized)) return "Outdoor";
  if (/camera|photo|kamera|lens/.test(normalized)) return "Cameras";
  if (/guitar|music|piano|musiikki/.test(normalized)) return "Music";
  if (/fitness|gym|training|treeni/.test(normalized)) return "Fitness";
  if (/gaming|game|console|peli/.test(normalized)) return "Gaming";
  if (/kids|child|children|baby|laps/.test(normalized)) return "Kids’ Gear";
  return null;
}

function buildFallbackResult(request: AISearchRequest): AISearchResult {
  const trimmedQuery = request.query.trim();
  const categoryName = inferCategory(trimmedQuery) ?? (request.currentFilters.categoryName !== "All" ? request.currentFilters.categoryName : null);
  const maxPrice = findMaxPrice(trimmedQuery) ?? (request.currentFilters.maxPrice ? Number.parseInt(request.currentFilters.maxPrice, 10) : null);
  const condition = conditions.includes(request.currentFilters.condition) ? request.currentFilters.condition : "any";
  const chips = [categoryName, maxPrice ? `Under €${maxPrice}` : null, trimmedQuery ? "AI interpreted" : null].filter(Boolean) as string[];

  return {
    query: trimmedQuery,
    categoryName,
    condition,
    minPrice: request.currentFilters.minPrice ? Number.parseInt(request.currentFilters.minPrice, 10) : null,
    maxPrice,
    sort: request.currentFilters.sort || "recommended",
    explanation: categoryName || maxPrice ? "AI search applied lightweight filters." : "AI search used your text as a smarter search query.",
    chips,
    mock: true
  };
}

function normalizeResult(value: Partial<AISearchResult> | null | undefined, fallback: AISearchResult): AISearchResult {
  const categoryName = value?.categoryName && categories.includes(value.categoryName) ? value.categoryName : fallback.categoryName;
  const condition = value?.condition && conditions.includes(value.condition) ? value.condition : fallback.condition;
  const sortOptions: SearchSortOption[] = ["recommended", "newest", "price_low", "price_high"];

  return {
    query: typeof value?.query === "string" && value.query.trim() ? value.query.trim() : fallback.query,
    categoryName,
    condition,
    minPrice: typeof value?.minPrice === "number" ? value.minPrice : fallback.minPrice,
    maxPrice: typeof value?.maxPrice === "number" ? value.maxPrice : fallback.maxPrice,
    sort: value?.sort && sortOptions.includes(value.sort) ? value.sort : fallback.sort,
    explanation: typeof value?.explanation === "string" ? value.explanation : fallback.explanation,
    chips: Array.isArray(value?.chips) ? value.chips.filter((item) => typeof item === "string").slice(0, 4) : fallback.chips,
    mock: value?.mock ?? fallback.mock
  };
}

export async function getAISearchResult(request: AISearchRequest): Promise<AISearchResult> {
  const fallback = buildFallbackResult(request);

  try {
    const { data, error } = await supabase.functions.invoke("ai-search", { body: request });
    if (error || !data) return fallback;
    return normalizeResult(data as Partial<AISearchResult>, fallback);
  } catch {
    return fallback;
  }
}

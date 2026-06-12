import { getCategoryByName } from "@/services/categories";
import { createNotification } from "@/services/notifications";
import { uploadListingImage } from "@/services/storage";
import { supabase } from "@/lib/supabase";
import { CreateListingInput, CreateListingResult, Listing, ListingCategory, ListingCondition, ListingStatus } from "@/types/listing";
import { SellPhoto } from "@/types/sell";

const listingSelect = "id, seller_id, title, description, price_amount, price_currency, condition, brand, model, location_city, location_country, status, view_count, favorite_count, created_at, published_at, categories(name), listing_images(public_url, sort_order, is_cover), profiles(display_name, avatar_url, location_city, location_country, bio, rating_average, rating_count, is_verified, is_trusted_seller)";

const conditionByLabel: Record<string, ListingCondition> = {
  new: "new",
  "like new": "like_new",
  good: "good",
  fair: "fair",
  poor: "poor"
};

const deliveryOptions = [
  { id: "pickup", title: "Local pickup", subtitle: "Ask seller for pickup details", priceLabel: "Free", icon: "location-outline" },
  { id: "shipping", title: "Shipping", subtitle: "Arrange with seller", priceLabel: "TBD", icon: "cube-outline" }
];

type ListingImageRow = { public_url: string | null; sort_order: number | null; is_cover: boolean | null };
type ProfileRow = { display_name: string | null; avatar_url: string | null; location_city: string | null; location_country: string | null; bio: string | null; rating_average: number | null; rating_count: number | null; is_verified: boolean | null; is_trusted_seller: boolean | null };

type ListingRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price_amount: number;
  price_currency: "EUR" | "USD";
  condition: ListingCondition;
  brand: string | null;
  model: string | null;
  location_city: string | null;
  location_country: string | null;
  status: ListingStatus;
  view_count: number | null;
  favorite_count: number | null;
  created_at: string | null;
  published_at: string | null;
  categories: { name: string } | null;
  listing_images: ListingImageRow[] | null;
  profiles: ProfileRow | null;
};

export type ListingSearchFilters = {
  query?: string;
  categoryName?: string;
  condition?: ListingCondition | "any";
  minPrice?: number | null;
  maxPrice?: number | null;
  city?: string;
  sort?: "recommended" | "newest" | "price_low" | "price_high";
};

function getFriendlyListingError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";
  if (normalized.includes("row-level security") || normalized.includes("permission")) return "We couldn’t publish your listing. Please sign in again and try once more.";
  if (normalized.includes("bucket") || normalized.includes("storage")) return "We couldn’t upload your photos. Please try again.";
  if (normalized.includes("category")) return "Please choose a valid category before publishing.";
  return "We couldn’t publish your listing. Please check your details and try again.";
}

function normalizeCondition(label: string): ListingCondition | null {
  return conditionByLabel[label.trim().toLowerCase()] ?? null;
}

function parsePriceAmount(priceLabel: string): number | null {
  const normalized = priceLabel.replace(/[^0-9.,]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function formatConditionLabel(condition: ListingCondition) {
  if (condition === "like_new") return "Like new";
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}

function mapCategoryNameToSlug(name?: string | null): ListingCategory {
  const normalized = name?.toLowerCase().replace(/[’\']/g, "").replace(/\s+/g, "_");
  if (normalized === "kids_gear") return "kids";
  if (normalized === "cameras") return "cameras";
  if (normalized === "cycling") return "cycling";
  if (normalized === "winter") return "winter";
  if (normalized === "outdoor") return "outdoor";
  if (normalized === "music") return "music";
  if (normalized === "fitness") return "fitness";
  if (normalized === "gaming") return "gaming";
  return "outdoor";
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "K";
}

function getTrustLabel(profile: ProfileRow | null) {
  if (profile?.is_trusted_seller) return "Trusted seller";
  if (profile?.is_verified) return "Verified profile";
  return "New member";
}

export function mapListingRowToListing(row: ListingRow, favoriteIds: string[] = []): Listing {
  const categoryName = row.categories?.name ?? "Outdoor";
  const price = row.price_amount ?? 0;
  const subtitle = [row.brand, row.model].filter(Boolean).join(" · ") || categoryName;
  const imageUrls = (row.listing_images ?? [])
    .slice()
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((image) => image.public_url)
    .filter(Boolean) as string[];
  const profile = row.profiles;
  const sellerName = profile?.display_name?.trim() || "Kitliva seller";
  const listingLocation = [row.location_city, row.location_country].filter(Boolean).join(", ");
  const profileLocation = [profile?.location_city, profile?.location_country].filter(Boolean).join(", ");
  const sellerLocation = profileLocation || listingLocation || "Location not set";

  return {
    id: row.id,
    sellerId: row.seller_id,
    status: row.status,
    title: row.title,
    subtitle,
    description: row.description,
    category: mapCategoryNameToSlug(categoryName),
    categoryName,
    price,
    currency: row.price_currency ?? "EUR",
    imageUrl: imageUrls[0] ?? null,
    imageUrls,
    imageCount: imageUrls.length,
    condition: row.condition,
    conditionLabel: formatConditionLabel(row.condition),
    isGreatDeal: Boolean(row.favorite_count && row.favorite_count > 5),
    isFavorite: favoriteIds.includes(row.id),
    sellerName,
    sellerInitial: getInitial(sellerName),
    sellerLocation,
    sellerBio: profile?.bio ?? null,
    sellerAvatarUrl: profile?.avatar_url ?? null,
    sellerIsVerified: Boolean(profile?.is_verified),
    sellerIsTrusted: Boolean(profile?.is_trusted_seller),
    sellerTrustLabel: getTrustLabel(profile),
    sellerDistanceKm: 0,
    sellerRating: Number(profile?.rating_average ?? 0),
    sellerReviewCount: Number(profile?.rating_count ?? 0),
    aiPriceMin: Math.max(price - 30, 1),
    aiPriceMax: price + 70,
    aiSimilarListings: 0,
    details: [
      { label: "Condition", value: formatConditionLabel(row.condition) },
      { label: "Category", value: categoryName },
      { label: "Location", value: listingLocation || sellerLocation },
      { label: "Posted", value: row.published_at ? "Recently" : "Draft" },
      { label: "Views", value: String(row.view_count ?? 0) }
    ],
    deliveryOptions,
    viewCount: row.view_count ?? 0,
    favoriteCount: row.favorite_count ?? 0,
    createdAt: row.created_at,
    publishedAt: row.published_at
  };
}

export async function getActiveListings(favoriteIds: string[] = []): Promise<Listing[]> {
  return searchListings({}, favoriteIds);
}

export async function searchListings(filters: ListingSearchFilters, favoriteIds: string[] = []): Promise<Listing[]> {
  let query = supabase.from("listings").select(listingSelect).eq("status", "active");
  const searchQuery = filters.query?.trim();

  if (searchQuery) query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`);

  if (filters.categoryName && filters.categoryName !== "All") {
    const category = await getCategoryByName(filters.categoryName);
    if (category) query = query.eq("category_id", category.id);
  }

  if (filters.condition && filters.condition !== "any") query = query.eq("condition", filters.condition);
  if (filters.minPrice) query = query.gte("price_amount", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price_amount", filters.maxPrice);
  if (filters.city?.trim()) query = query.ilike("location_city", `%${filters.city.trim()}%`);

  if (filters.sort === "price_low") query = query.order("price_amount", { ascending: true });
  else if (filters.sort === "price_high") query = query.order("price_amount", { ascending: false });
  else query = query.order("published_at", { ascending: false });

  const { data, error } = await query;
  if (error || !data) throw error ?? new Error("Could not load listings.");
  return (data as ListingRow[]).map((row) => mapListingRowToListing(row, favoriteIds));
}

export async function searchActiveListings(query: string, favoriteIds: string[] = []): Promise<Listing[]> {
  return searchListings({ query }, favoriteIds);
}

export async function getListingById(id: string, favoriteIds: string[] = []): Promise<Listing | null> {
  const { data, error } = await supabase.from("listings").select(listingSelect).eq("id", id).eq("status", "active").maybeSingle();
  if (error) throw error;
  return data ? mapListingRowToListing(data as ListingRow, favoriteIds) : null;
}

export async function createListingWithoutImages(input: CreateListingInput): Promise<CreateListingResult> {
  return createListing(input, []);
}

export async function createListingWithImages(input: CreateListingInput, photos: SellPhoto[]): Promise<CreateListingResult> {
  return createListing(input, photos.filter((photo) => Boolean(photo?.uri || photo?.base64)));
}

async function createListing(input: CreateListingInput, photos: SellPhoto[]): Promise<CreateListingResult> {
  const category = await getCategoryByName(input.categoryName);

  if (!category) return { success: false, message: "Please choose a valid category before publishing." };

  const condition = normalizeCondition(input.conditionLabel);
  if (!condition) return { success: false, message: "Please choose a valid condition before publishing." };

  const priceAmount = parsePriceAmount(input.priceLabel);
  if (!priceAmount) return { success: false, message: "Please enter a valid price before publishing." };

  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: input.sellerId,
      category_id: category.id,
      title: input.title.trim(),
      description: input.description.trim(),
      price_amount: priceAmount,
      price_currency: "EUR",
      condition,
      brand: input.brand?.trim() || null,
      model: input.model?.trim() || null,
      location_city: input.locationCity?.trim() || null,
      location_country: input.locationCountry?.trim() || "Finland",
      status: "active",
      published_at: new Date().toISOString()
    })
    .select("id, title, description, price_amount, price_currency, condition, location_city, location_country, status, published_at, categories(name)")
    .single();

  if (error || !data) {
    return { success: false, message: getFriendlyListingError(error?.message) };
  }

  let coverImageUrl: string | null = null;

  if (photos.length > 0) {
    const uploadResults = await Promise.all(photos.map((photo, index) => uploadListingImage({ listingId: data.id, uri: photo.uri, fileName: photo.fileName, mimeType: photo.mimeType, base64: photo.base64, sortOrder: index, isCover: index === 0 })));
    coverImageUrl = uploadResults[0]?.success ? uploadResults[0].publicUrl : null;
  }

  await createNotification({
    userId: input.sellerId,
    type: "listing_published",
    title: "Listing published",
    body: `${data.title} is now live on Kitliva.`,
    relatedListingId: data.id
  });

  return {
    success: true,
    listing: {
      id: data.id,
      title: data.title,
      description: data.description,
      categoryName: data.categories?.name ?? input.categoryName,
      condition,
      conditionLabel: formatConditionLabel(condition),
      priceAmount: data.price_amount,
      priceCurrency: data.price_currency,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      status: data.status,
      publishedAt: data.published_at,
      coverImageUrl
    }
  };
}

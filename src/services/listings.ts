import { getCategoryByName } from "@/services/categories";
import { uploadListingImage } from "@/services/storage";
import { supabase } from "@/lib/supabase";
import { CreateListingInput, CreateListingResult, Listing, ListingCategory, ListingCondition, ListingStatus } from "@/types/listing";
import { SellPhoto } from "@/types/sell";

const conditionByLabel: Record<string, ListingCondition> = {
  new: "new",
  "like new": "like_new",
  good: "good",
  fair: "fair",
  poor: "poor"
};

const deliveryOptions = [
  {
    id: "pickup",
    title: "Local pickup",
    subtitle: "Ask seller for pickup details",
    priceLabel: "Free",
    icon: "location-outline"
  },
  {
    id: "shipping",
    title: "Shipping",
    subtitle: "Arrange with seller",
    priceLabel: "TBD",
    icon: "cube-outline"
  }
];

type ListingImageRow = {
  public_url: string | null;
  sort_order: number | null;
  is_cover: boolean | null;
};

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
};

function getFriendlyListingError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("row-level security") || normalized.includes("permission")) {
    return "We couldn’t publish your listing. Please sign in again and try once more.";
  }

  if (normalized.includes("bucket") || normalized.includes("storage")) {
    return "We couldn’t upload your photos. Please try again.";
  }

  if (normalized.includes("category")) {
    return "Please choose a valid category before publishing.";
  }

  return "We couldn’t publish your listing. Please check your details and try again.";
}

function normalizeCondition(label: string): ListingCondition | null {
  return conditionByLabel[label.trim().toLowerCase()] ?? null;
}

function parsePriceAmount(priceLabel: string): number | null {
  const normalized = priceLabel.replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed);
}

function formatConditionLabel(condition: ListingCondition) {
  const labels: Record<ListingCondition, string> = {
    new: "New",
    like_new: "Like new",
    good: "Good condition",
    fair: "Fair condition",
    poor: "Poor condition"
  };

  return labels[condition];
}

function mapCategoryNameToSlug(name?: string | null): ListingCategory {
  const normalized = name?.toLowerCase() ?? "";

  if (normalized.includes("cycl")) return "cycling";
  if (normalized.includes("winter")) return "winter";
  if (normalized.includes("music")) return "music";
  if (normalized.includes("camera")) return "cameras";
  if (normalized.includes("fitness")) return "fitness";
  if (normalized.includes("gaming")) return "gaming";
  if (normalized.includes("kid")) return "kids";

  return "outdoor";
}

function getSellerInitial(title: string) {
  return title.trim().charAt(0).toUpperCase() || "K";
}

function getImageUrls(images: ListingImageRow[] | null) {
  return (images ?? [])
    .filter((image) => Boolean(image.public_url))
    .sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .map((image) => image.public_url as string);
}

export function mapListingRowToListing(row: ListingRow, favoriteIds: string[] = []): Listing {
  const categoryName = row.categories?.name ?? "Outdoor";
  const imageUrls = getImageUrls(row.listing_images);
  const subtitleParts = [row.brand, row.model].filter(Boolean);
  const subtitle = subtitleParts.length > 0 ? subtitleParts.join(" ") : categoryName;
  const sellerLocation = [row.location_city, row.location_country].filter(Boolean).join(", ") || "Location not set";
  const price = Number(row.price_amount ?? 0);

  return {
    id: row.id,
    sellerId: row.seller_id,
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
    sellerName: "Kitliva seller",
    sellerInitial: getSellerInitial(row.title),
    sellerLocation,
    sellerDistanceKm: 0,
    sellerRating: 0,
    sellerReviewCount: 0,
    aiPriceMin: Math.max(price - 30, 1),
    aiPriceMax: price + 70,
    aiSimilarListings: 0,
    details: [
      { label: "Condition", value: formatConditionLabel(row.condition) },
      { label: "Category", value: categoryName },
      { label: "Location", value: sellerLocation },
      { label: "Posted", value: row.published_at ? "Recently" : "Draft" },
      { label: "Views", value: String(row.view_count ?? 0) }
    ],
    deliveryOptions,
    createdAt: row.created_at,
    publishedAt: row.published_at
  };
}

export async function getActiveListings(favoriteIds: string[] = []): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, seller_id, title, description, price_amount, price_currency, condition, brand, model, location_city, location_country, status, view_count, favorite_count, created_at, published_at, categories(name), listing_images(public_url, sort_order, is_cover)"
    )
    .eq("status", "active")
    .order("published_at", { ascending: false });

  if (error || !data) {
    throw error ?? new Error("Could not load listings.");
  }

  return (data as ListingRow[]).map((row) => mapListingRowToListing(row, favoriteIds));
}

export async function searchActiveListings(query: string, favoriteIds: string[] = []): Promise<Listing[]> {
  const listings = await getActiveListings(favoriteIds);
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return listings;
  }

  return listings.filter((listing) => {
    const searchable = [listing.title, listing.subtitle, listing.description, listing.categoryName, listing.conditionLabel]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export async function getListingById(id: string, favoriteIds: string[] = []): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, seller_id, title, description, price_amount, price_currency, condition, brand, model, location_city, location_country, status, view_count, favorite_count, created_at, published_at, categories(name), listing_images(public_url, sort_order, is_cover)"
    )
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapListingRowToListing(data as ListingRow, favoriteIds);
}

export async function createListingWithoutImages(input: CreateListingInput): Promise<CreateListingResult> {
  return createListing(input, []);
}

export async function createListingWithImages(input: CreateListingInput, photos: SellPhoto[]): Promise<CreateListingResult> {
  return createListing(input, photos);
}

async function createListing(input: CreateListingInput, photos: SellPhoto[]): Promise<CreateListingResult> {
  const title = input.title.trim();
  const description = input.description.trim();
  const categoryName = input.categoryName.trim();
  const condition = normalizeCondition(input.conditionLabel);
  const priceAmount = parsePriceAmount(input.priceLabel);

  if (!input.sellerId) {
    return { success: false, message: "Please sign in before publishing your listing." };
  }

  if (!title) {
    return { success: false, message: "Please add a title before publishing." };
  }

  if (!categoryName) {
    return { success: false, message: "Please choose a category before publishing." };
  }

  if (!condition) {
    return { success: false, message: "Please choose a valid condition before publishing." };
  }

  if (!priceAmount) {
    return { success: false, message: "Please add a valid price before publishing." };
  }

  if (photos.length === 0) {
    return { success: false, message: "Please add at least one photo before publishing." };
  }

  const category = await getCategoryByName(categoryName);

  if (!category) {
    return { success: false, message: "Please choose a valid category before publishing." };
  }

  const priceCurrency = "EUR";
  const locationCity = input.locationCity?.trim() || null;
  const locationCountry = input.locationCountry?.trim() || null;

  const { data: draft, error: draftError } = await supabase
    .from("listings")
    .insert({
      seller_id: input.sellerId,
      category_id: category.id,
      title,
      description: description || null,
      price_amount: priceAmount,
      price_currency: priceCurrency,
      condition,
      brand: input.brand?.trim() || null,
      model: input.model?.trim() || null,
      location_city: locationCity,
      location_country: locationCountry,
      status: "draft"
    })
    .select("id, title, description, price_amount, price_currency, condition, location_city, location_country, status, published_at")
    .single();

  if (draftError || !draft) {
    return { success: false, message: getFriendlyListingError(draftError?.message) };
  }

  try {
    const uploadedImages = await Promise.all(
      photos.map((photo, index) => uploadListingImage({ listingId: draft.id, sellerId: input.sellerId, photo, index }))
    );

    const { error: imagesError } = await supabase.from("listing_images").insert(
      uploadedImages.map((image, index) => ({
        listing_id: draft.id,
        storage_path: image.storagePath,
        public_url: image.publicUrl,
        sort_order: index,
        is_cover: index === 0
      }))
    );

    if (imagesError) {
      throw imagesError;
    }

    const publishedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("listings")
      .update({ status: "active", published_at: publishedAt })
      .eq("id", draft.id)
      .eq("seller_id", input.sellerId)
      .select("id, title, description, price_amount, price_currency, condition, location_city, location_country, status, published_at")
      .single();

    if (error || !data) {
      return { success: false, message: getFriendlyListingError(error?.message) };
    }

    return {
      success: true,
      listing: {
        id: data.id,
        title: data.title,
        description: data.description,
        categoryName: category.name,
        condition: data.condition,
        conditionLabel: input.conditionLabel,
        priceAmount: data.price_amount,
        priceCurrency: data.price_currency,
        locationCity: data.location_city,
        locationCountry: data.location_country,
        status: data.status,
        publishedAt: data.published_at,
        coverImageUrl: uploadedImages[0]?.publicUrl ?? null
      }
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    await supabase.from("listings").update({ status: "archived" }).eq("id", draft.id).eq("seller_id", input.sellerId);
    return { success: false, message: getFriendlyListingError(message) };
  }
}

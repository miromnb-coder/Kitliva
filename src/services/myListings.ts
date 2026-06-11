import { getCategoryByName } from "@/services/categories";
import { mapListingRowToListing } from "@/services/listings";
import { supabase } from "@/lib/supabase";
import { Listing, ListingCondition, ListingStatus } from "@/types/listing";
import { SellFormDraft } from "@/types/sell";

const listingSelect = "id, seller_id, title, description, price_amount, price_currency, condition, brand, model, location_city, location_country, status, view_count, favorite_count, created_at, published_at, categories(name), listing_images(public_url, sort_order, is_cover)";

const conditionByLabel: Record<string, ListingCondition> = {
  new: "new",
  "like new": "like_new",
  good: "good",
  "good condition": "good",
  fair: "fair",
  "fair condition": "fair",
  poor: "poor",
  "poor condition": "poor"
};

function mapOwnerListing(row: any): Listing {
  const listing = mapListingRowToListing(row);

  return {
    ...listing,
    status: row.status,
    viewCount: row.view_count ?? 0,
    favoriteCount: row.favorite_count ?? 0
  };
}

function parsePriceAmount(value: string) {
  const parsed = Number.parseFloat(value.replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

function normalizeCondition(label: string) {
  return conditionByLabel[label.trim().toLowerCase()] ?? null;
}

export async function getMyListings(userId: string, status: ListingStatus): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("seller_id", userId)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw error ?? new Error("Could not load your listings.");
  }

  return (data as any[]).map(mapOwnerListing);
}

export async function getOwnListingById(userId: string, listingId: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("id", listingId)
    .eq("seller_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapOwnerListing(data as any) : null;
}

export function listingToSellForm(listing: Listing): SellFormDraft {
  return {
    title: listing.title,
    categoryName: listing.categoryName ?? "",
    conditionLabel: listing.conditionLabel.replace(" condition", ""),
    priceLabel: String(listing.price),
    description: listing.description ?? "",
    locationCity: listing.sellerLocation.split(",")[0]?.trim() ?? "",
    locationCountry: listing.sellerLocation.split(",")[1]?.trim() ?? "",
    allowPickup: true,
    allowShipping: false
  };
}

export async function updateOwnListing(userId: string, listingId: string, form: SellFormDraft) {
  const category = await getCategoryByName(form.categoryName);
  const condition = normalizeCondition(form.conditionLabel);
  const priceAmount = parsePriceAmount(form.priceLabel);

  if (!category || !condition || !priceAmount) {
    return { success: false, message: "Please check the listing details and try again." };
  }

  const { error } = await supabase
    .from("listings")
    .update({
      title: form.title.trim(),
      description: form.description.trim() || null,
      category_id: category.id,
      condition,
      price_amount: priceAmount,
      location_city: form.locationCity.trim() || null,
      location_country: form.locationCountry.trim() || null
    })
    .eq("id", listingId)
    .eq("seller_id", userId);

  if (error) {
    return { success: false, message: "Could not save changes. Try again." };
  }

  return { success: true };
}

export async function updateOwnListingStatus(userId: string, listingId: string, status: ListingStatus) {
  const payload = status === "sold" ? { status, sold_at: new Date().toISOString() } : { status };
  const { error } = await supabase.from("listings").update(payload).eq("id", listingId).eq("seller_id", userId);

  if (error) {
    return { success: false, message: "Could not update listing status." };
  }

  return { success: true };
}

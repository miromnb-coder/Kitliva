import { getFavoriteListingIds } from "@/services/favorites";
import { mapListingRowToListing } from "@/services/listings";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/listing";

const listingSelect = "id, seller_id, title, description, price_amount, price_currency, condition, brand, model, location_city, location_country, status, view_count, favorite_count, created_at, published_at, categories(name), listing_images(public_url, sort_order, is_cover), profiles(display_name, avatar_url, location_city, location_country, bio, rating_average, rating_count, is_verified, is_trusted_seller)";

export async function getListingsByIds(listingIds: string[], favoriteIds: string[] = []): Promise<Listing[]> {
  if (listingIds.length === 0) return [];

  const uniqueIds = Array.from(new Set(listingIds));
  const { data, error } = await supabase.from("listings").select(listingSelect).in("id", uniqueIds).eq("status", "active");
  if (error || !data) return [];

  const mapped = data.map((row) => mapListingRowToListing(row as never, favoriteIds));
  return uniqueIds.map((id) => mapped.find((listing) => listing.id === id)).filter(Boolean) as Listing[];
}

export async function getSavedListings(userId: string): Promise<Listing[]> {
  const favoriteIds = await getFavoriteListingIds(userId);
  return getListingsByIds(favoriteIds, favoriteIds);
}

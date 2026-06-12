import AsyncStorage from "@react-native-async-storage/async-storage";

import { getListingsByIds } from "@/services/listingCollections";
import { Listing } from "@/types/listing";

const RECENTLY_VIEWED_KEY = "kitliva_recently_viewed_listings";
const MAX_RECENT_ITEMS = 20;

type RecentlyViewedItem = {
  listingId: string;
  viewedAt: string;
};

async function readHistory(): Promise<RecentlyViewedItem[]> {
  const raw = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as RecentlyViewedItem[];
    return Array.isArray(parsed) ? parsed.filter((item) => item.listingId) : [];
  } catch {
    return [];
  }
}

export async function addRecentlyViewedListing(listingId: string) {
  const current = await readHistory();
  const next = [{ listingId, viewedAt: new Date().toISOString() }, ...current.filter((item) => item.listingId !== listingId)].slice(0, MAX_RECENT_ITEMS);
  await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
}

export async function getRecentlyViewedListings(favoriteIds: string[] = []): Promise<Listing[]> {
  const history = await readHistory();
  return getListingsByIds(history.map((item) => item.listingId), favoriteIds);
}

export async function clearRecentlyViewedListings() {
  await AsyncStorage.removeItem(RECENTLY_VIEWED_KEY);
}

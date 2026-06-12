import { supabase } from "@/lib/supabase";

export type ProfileStats = {
  activeListings: number;
  savedItems: number;
  soldListings: number;
  offers: number;
};

async function getCount(query: PromiseLike<{ count: number | null; error: unknown }>) {
  const { count, error } = await query;

  if (error) {
    return 0;
  }

  return count ?? 0;
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [activeListings, savedItems, soldListings, offers] = await Promise.all([
    getCount(supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", userId).eq("status", "active")),
    getCount(supabase.from("favorites").select("listing_id", { count: "exact", head: true }).eq("user_id", userId)),
    getCount(supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", userId).eq("status", "sold")),
    getCount(supabase.from("offers").select("id", { count: "exact", head: true }).or(`buyer_id.eq.${userId},seller_id.eq.${userId}`))
  ]);

  return {
    activeListings,
    savedItems,
    soldListings,
    offers
  };
}

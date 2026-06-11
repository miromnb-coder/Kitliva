import { supabase } from "@/lib/supabase";

export async function getFavoriteListingIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from("favorites").select("listing_id").eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  return data.map((item) => item.listing_id as string);
}

export async function isListingFavorite(userId: string, listingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function setListingFavorite(params: {
  userId: string;
  listingId: string;
  shouldFavorite: boolean;
}): Promise<{ success: boolean; message?: string }> {
  if (params.shouldFavorite) {
    const { error } = await supabase.from("favorites").insert({
      user_id: params.userId,
      listing_id: params.listingId
    });

    if (error && !error.message.toLowerCase().includes("duplicate")) {
      return { success: false, message: "Couldn’t update saved item. Try again." };
    }

    return { success: true };
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", params.userId)
    .eq("listing_id", params.listingId);

  if (error) {
    return { success: false, message: "Couldn’t update saved item. Try again." };
  }

  return { success: true };
}

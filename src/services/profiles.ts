import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { getActiveListings } from "@/services/listings";

export type SellerProfileData = {
  profile: Profile;
  activeListingsCount: number;
  soldListingsCount: number;
};

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export async function updateProfile(params: {
  userId: string;
  displayName: string;
  locationCity: string;
  locationCountry: string;
  bio: string;
}) {
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: params.displayName.trim(),
      location_city: params.locationCity.trim() || null,
      location_country: params.locationCountry.trim() || null,
      bio: params.bio.trim() || null
    })
    .eq("id", params.userId);

  if (error) return { success: false, message: "Could not update profile. Try again." };
  return { success: true };
}

export async function getSellerProfileData(sellerId: string): Promise<SellerProfileData | null> {
  const profile = await getProfileById(sellerId);
  if (!profile) return null;

  const [activeCountResult, soldCountResult] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", sellerId).eq("status", "active"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("seller_id", sellerId).eq("status", "sold")
  ]);

  return {
    profile,
    activeListingsCount: activeCountResult.count ?? 0,
    soldListingsCount: soldCountResult.count ?? 0
  };
}

export async function getSellerActiveListings(sellerId: string) {
  const listings = await getActiveListings();
  return listings.filter((listing) => listing.sellerId === sellerId);
}

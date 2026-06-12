import { getActiveDealsForUser, Deal } from "@/services/deals";
import { getMyListings } from "@/services/myListings";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/listing";

export type SellerDashboardOffer = {
  id: string;
  listingId: string;
  conversationId: string;
  buyerId: string;
  amount: number;
  currency: "EUR" | "USD";
  message: string | null;
  createdAt: string;
  listingTitle: string;
};

export type SellerDashboardData = {
  activeListingsCount: number;
  pendingOffersCount: number;
  activeDealsCount: number;
  totalSaves: number;
  activeListingsPreview: Listing[];
  pendingOffersPreview: SellerDashboardOffer[];
  activeDealsPreview: Deal[];
};

type OfferRow = {
  id: string;
  listing_id: string;
  conversation_id: string;
  buyer_id: string;
  amount: number;
  currency: "EUR" | "USD";
  message: string | null;
  created_at: string;
  listings: { title: string } | null;
};

export async function getSellerDashboard(userId: string): Promise<SellerDashboardData> {
  const [activeListings, activeDeals, offersResult] = await Promise.all([
    getMyListings(userId, "active"),
    getActiveDealsForUser(userId),
    supabase
      .from("offers")
      .select("id, listing_id, conversation_id, buyer_id, amount, currency, message, created_at, listings(title)")
      .eq("seller_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10)
  ]);

  const pendingOffers = ((offersResult.data ?? []) as OfferRow[]).map((offer) => ({
    id: offer.id,
    listingId: offer.listing_id,
    conversationId: offer.conversation_id,
    buyerId: offer.buyer_id,
    amount: offer.amount,
    currency: offer.currency,
    message: offer.message,
    createdAt: offer.created_at,
    listingTitle: offer.listings?.title ?? "Listing"
  }));

  return {
    activeListingsCount: activeListings.length,
    pendingOffersCount: pendingOffers.length,
    activeDealsCount: activeDeals.length,
    totalSaves: activeListings.reduce((sum, listing) => sum + (listing.favoriteCount ?? 0), 0),
    activeListingsPreview: activeListings.slice(0, 3),
    pendingOffersPreview: pendingOffers.slice(0, 3),
    activeDealsPreview: activeDeals.slice(0, 2)
  };
}

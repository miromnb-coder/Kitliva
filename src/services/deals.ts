import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/utils/formatPrice";
import { createNotification } from "@/services/notifications";

export type DealStatus = "agreed" | "completed" | "cancelled";

export type Deal = {
  id: string;
  listingId: string;
  offerId: string;
  conversationId: string;
  buyerId: string;
  sellerId: string;
  agreedPriceAmount: number;
  currency: "EUR" | "USD";
  status: DealStatus;
  handoffMethod: string | null;
  handoffNote: string | null;
  completedByBuyerAt: string | null;
  completedBySellerAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  listingTitle: string;
  listingImageUrl: string | null;
};

type DealRow = {
  id: string;
  listing_id: string;
  offer_id: string;
  conversation_id: string;
  buyer_id: string;
  seller_id: string;
  agreed_price_amount: number;
  currency: "EUR" | "USD";
  status: DealStatus;
  handoff_method: string | null;
  handoff_note: string | null;
  completed_by_buyer_at: string | null;
  completed_by_seller_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  listings: {
    title: string;
    listing_images?: { public_url: string | null; is_cover: boolean | null; sort_order: number | null }[] | null;
  } | null;
};

function getCoverImage(images?: { public_url: string | null; is_cover: boolean | null; sort_order: number | null }[] | null) {
  return (images ?? [])
    .filter((image) => Boolean(image.public_url))
    .sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })[0]?.public_url ?? null;
}

function mapDeal(row: DealRow): Deal {
  return {
    id: row.id,
    listingId: row.listing_id,
    offerId: row.offer_id,
    conversationId: row.conversation_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    agreedPriceAmount: row.agreed_price_amount,
    currency: row.currency,
    status: row.status,
    handoffMethod: row.handoff_method,
    handoffNote: row.handoff_note,
    completedByBuyerAt: row.completed_by_buyer_at,
    completedBySellerAt: row.completed_by_seller_at,
    cancelledAt: row.cancelled_at,
    createdAt: row.created_at,
    listingTitle: row.listings?.title ?? "Listing",
    listingImageUrl: getCoverImage(row.listings?.listing_images)
  };
}

const dealSelect = "id, listing_id, offer_id, conversation_id, buyer_id, seller_id, agreed_price_amount, currency, status, handoff_method, handoff_note, completed_by_buyer_at, completed_by_seller_at, cancelled_at, created_at, listings(title, listing_images(public_url, is_cover, sort_order))";

export async function getOrCreateDealFromOffer(input: {
  offerId: string;
  listingId: string;
  conversationId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
}) {
  const { data: existing } = await supabase.from("deals").select(dealSelect).eq("offer_id", input.offerId).maybeSingle();
  if (existing) return { success: true, deal: mapDeal(existing as DealRow) };

  const { data, error } = await supabase
    .from("deals")
    .insert({
      offer_id: input.offerId,
      listing_id: input.listingId,
      conversation_id: input.conversationId,
      buyer_id: input.buyerId,
      seller_id: input.sellerId,
      agreed_price_amount: input.amount,
      currency: input.currency,
      status: "agreed"
    })
    .select(dealSelect)
    .single();

  if (error || !data) return { success: false, message: "Could not create deal." };

  const deal = mapDeal(data as DealRow);
  const priceLabel = formatPrice(deal.agreedPriceAmount, deal.currency);
  await Promise.all([
    createNotification({ userId: deal.buyerId, type: "deal_created", title: "Deal agreed", body: `${deal.listingTitle} agreed at ${priceLabel}.`, relatedListingId: deal.listingId, relatedConversationId: deal.conversationId, relatedOfferId: deal.offerId, relatedDealId: deal.id }),
    createNotification({ userId: deal.sellerId, type: "deal_created", title: "Deal agreed", body: `${deal.listingTitle} agreed at ${priceLabel}.`, relatedListingId: deal.listingId, relatedConversationId: deal.conversationId, relatedOfferId: deal.offerId, relatedDealId: deal.id })
  ]);

  return { success: true, deal };
}

export async function getDealById(dealId: string): Promise<Deal | null> {
  const { data, error } = await supabase.from("deals").select(dealSelect).eq("id", dealId).maybeSingle();
  if (error) throw error;
  return data ? mapDeal(data as DealRow) : null;
}

export async function getDealForConversation(conversationId: string): Promise<Deal | null> {
  const { data, error } = await supabase.from("deals").select(dealSelect).eq("conversation_id", conversationId).neq("status", "cancelled").order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return null;
  return data ? mapDeal(data as DealRow) : null;
}

export async function getActiveDealsForUser(userId: string): Promise<Deal[]> {
  const { data, error } = await supabase.from("deals").select(dealSelect).or(`buyer_id.eq.${userId},seller_id.eq.${userId}`).in("status", ["agreed"]).order("created_at", { ascending: false }).limit(10);
  if (error || !data) return [];
  return (data as DealRow[]).map(mapDeal);
}

export async function updateDealStatus(input: { dealId: string; userId: string; status: "completed" | "cancelled" }) {
  const updates = input.status === "cancelled" ? { status: input.status, cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() } : { status: input.status, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from("deals").update(updates).eq("id", input.dealId).or(`buyer_id.eq.${input.userId},seller_id.eq.${input.userId}`).select(dealSelect).single();
  if (error || !data) return { success: false, message: "Could not update deal." };
  const deal = mapDeal(data as DealRow);
  await createNotification({ userId: deal.buyerId === input.userId ? deal.sellerId : deal.buyerId, type: "deal_updated", title: input.status === "completed" ? "Deal completed" : "Deal cancelled", body: `${deal.listingTitle} was marked ${input.status}.`, relatedListingId: deal.listingId, relatedConversationId: deal.conversationId, relatedDealId: deal.id });
  return { success: true, deal };
}

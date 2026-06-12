import { getOrCreateConversation } from "@/services/conversations";
import { getOrCreateDealFromOffer } from "@/services/deals";
import { createNotification } from "@/services/notifications";
import { supabase } from "@/lib/supabase";

export type OfferStatus = "pending" | "accepted" | "declined";

export type Offer = {
  id: string;
  listingId: string;
  conversationId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  message: string | null;
  status: OfferStatus;
  createdAt: string;
};

function parseAmount(value: string) {
  const parsed = Number.parseFloat(value.replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

export async function createOffer(params: {
  listingId: string;
  buyerId: string;
  sellerId: string;
  amountLabel: string;
  message: string;
}) {
  const amount = parseAmount(params.amountLabel);

  if (params.buyerId === params.sellerId) {
    return { success: false, ownListing: true, message: "This is your listing." };
  }

  if (!amount) {
    return { success: false, ownListing: false, message: "Please enter a valid offer." };
  }

  const conversation = await getOrCreateConversation({ listingId: params.listingId, buyerId: params.buyerId, sellerId: params.sellerId });

  if (!conversation.success || !conversation.conversationId) {
    return { success: false, ownListing: conversation.ownListing, message: "Could not send offer. Try again." };
  }

  const { data, error } = await supabase
    .from("offers")
    .insert({
      listing_id: params.listingId,
      conversation_id: conversation.conversationId,
      buyer_id: params.buyerId,
      seller_id: params.sellerId,
      amount,
      currency: "EUR",
      message: params.message.trim() || null,
      status: "pending"
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, ownListing: false, message: "Could not send offer. Try again." };
  }

  const lastMessageText = `Offer €${amount} pending`;
  await supabase
    .from("conversations")
    .update({ last_message_text: lastMessageText, last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", conversation.conversationId);

  await createNotification({
    userId: params.sellerId,
    type: "offer_created",
    title: "New offer",
    body: `You received an offer of €${amount}.`,
    relatedListingId: params.listingId,
    relatedConversationId: conversation.conversationId,
    relatedOfferId: data.id as string
  });

  return { success: true, ownListing: false, conversationId: conversation.conversationId, offerId: data.id as string };
}

export async function getConversationOffers(conversationId: string): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("id, listing_id, conversation_id, buyer_id, seller_id, amount, currency, message, status, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((offer) => ({
    id: offer.id as string,
    listingId: offer.listing_id as string,
    conversationId: offer.conversation_id as string,
    buyerId: offer.buyer_id as string,
    sellerId: offer.seller_id as string,
    amount: offer.amount as number,
    currency: offer.currency as string,
    message: offer.message as string | null,
    status: offer.status as OfferStatus,
    createdAt: offer.created_at as string
  }));
}

export async function updateOfferStatus(params: { offerId: string; sellerId: string; status: "accepted" | "declined" }) {
  const { data, error } = await supabase
    .from("offers")
    .update({ status: params.status, updated_at: new Date().toISOString() })
    .eq("id", params.offerId)
    .eq("seller_id", params.sellerId)
    .select("id, listing_id, conversation_id, buyer_id, seller_id, amount, currency")
    .single();

  if (error || !data) {
    return { success: false, message: "Could not update offer." };
  }

  const statusText = params.status === "accepted" ? "Offer accepted" : "Offer declined";
  await supabase
    .from("conversations")
    .update({ last_message_text: `${statusText} €${data.amount}`, last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", data.conversation_id);

  let dealId: string | null = null;
  if (params.status === "accepted") {
    const dealResult = await getOrCreateDealFromOffer({
      offerId: data.id as string,
      listingId: data.listing_id as string,
      conversationId: data.conversation_id as string,
      buyerId: data.buyer_id as string,
      sellerId: data.seller_id as string,
      amount: data.amount as number,
      currency: data.currency as string
    });
    if (dealResult.success && "deal" in dealResult) dealId = dealResult.deal.id;
  }

  await createNotification({
    userId: data.buyer_id as string,
    type: params.status === "accepted" ? "offer_accepted" : "offer_declined",
    title: params.status === "accepted" ? "Offer accepted" : "Offer declined",
    body: params.status === "accepted" ? `Your €${data.amount} offer was accepted.` : `Your €${data.amount} offer was declined.`,
    relatedListingId: data.listing_id as string,
    relatedConversationId: data.conversation_id as string,
    relatedOfferId: data.id as string,
    relatedDealId: dealId
  });

  return { success: true, dealId };
}

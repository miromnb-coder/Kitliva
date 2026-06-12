import { supabase } from "@/lib/supabase";
import { createNotification } from "@/services/notifications";

export type ConversationSummary = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImageUrl: string | null;
  buyerId: string;
  sellerId: string;
  otherName: string;
  otherInitial: string;
  lastMessageText: string;
  lastMessageAt: string | null;
};

export type ConversationMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

type ConversationRow = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_text: string | null;
  last_message_at: string | null;
  listings: {
    title: string;
    price_amount: number;
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

export async function getOrCreateConversation(params: { listingId: string; buyerId: string; sellerId: string }) {
  if (params.buyerId === params.sellerId) {
    return { success: false, ownListing: true, conversationId: null as string | null };
  }

  const { data: blocked } = await supabase
    .from("blocked_users")
    .select("id")
    .or(`and(blocker_id.eq.${params.buyerId},blocked_user_id.eq.${params.sellerId}),and(blocker_id.eq.${params.sellerId},blocked_user_id.eq.${params.buyerId})`)
    .limit(1)
    .maybeSingle();

  if (blocked?.id) {
    return { success: false, ownListing: false, conversationId: null as string | null, blocked: true };
  }

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", params.listingId)
    .eq("buyer_id", params.buyerId)
    .eq("seller_id", params.sellerId)
    .maybeSingle();

  if (existing?.id) {
    return { success: true, ownListing: false, conversationId: existing.id as string };
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({ listing_id: params.listingId, buyer_id: params.buyerId, seller_id: params.sellerId })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, ownListing: false, conversationId: null as string | null };
  }

  return { success: true, ownListing: false, conversationId: data.id as string };
}

export async function getConversations(userId: string): Promise<ConversationSummary[]> {
  const { data: blockedRows } = await supabase.from("blocked_users").select("blocked_user_id").eq("blocker_id", userId);
  const blockedIds = (blockedRows ?? []).map((row) => row.blocked_user_id as string);

  const { data, error } = await supabase
    .from("conversations")
    .select("id, listing_id, buyer_id, seller_id, last_message_text, last_message_at, listings(title, price_amount, listing_images(public_url, is_cover, sort_order))")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error || !data) {
    throw error ?? new Error("Could not load conversations.");
  }

  return (data as ConversationRow[])
    .filter((row) => {
      const otherUserId = row.buyer_id === userId ? row.seller_id : row.buyer_id;
      return !blockedIds.includes(otherUserId);
    })
    .map((row) => {
      const otherRole = row.buyer_id === userId ? "Seller" : "Buyer";
      return {
        id: row.id,
        listingId: row.listing_id,
        listingTitle: row.listings?.title ?? "Listing",
        listingPrice: row.listings?.price_amount ?? 0,
        listingImageUrl: getCoverImage(row.listings?.listing_images),
        buyerId: row.buyer_id,
        sellerId: row.seller_id,
        otherName: otherRole,
        otherInitial: otherRole.charAt(0),
        lastMessageText: row.last_message_text ?? "Start the conversation",
        lastMessageAt: row.last_message_at
      };
    });
}

export async function getConversation(conversationId: string, userId: string): Promise<ConversationSummary | null> {
  const conversations = await getConversations(userId);
  return conversations.find((item) => item.id === conversationId) ?? null;
}

export async function getMessages(conversationId: string): Promise<ConversationMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw error ?? new Error("Could not load messages.");
  }

  return data.map((message) => ({
    id: message.id as string,
    senderId: message.sender_id as string,
    body: message.body as string,
    createdAt: message.created_at as string
  }));
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    return { success: false, message: "Write a message before sending." };
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    body: trimmedBody
  });

  if (error) {
    return { success: false, message: "Could not send message. Try again." };
  }

  await supabase
    .from("conversations")
    .update({ last_message_text: trimmedBody, last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  const { data: conversation } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id, listing_id, listings(title)")
    .eq("id", conversationId)
    .single();

  if (conversation) {
    const recipientId = conversation.buyer_id === senderId ? conversation.seller_id : conversation.buyer_id;
    await createNotification({
      userId: recipientId,
      type: "message",
      title: "New message",
      body: trimmedBody.length > 80 ? `${trimmedBody.slice(0, 77)}...` : trimmedBody,
      relatedListingId: conversation.listing_id as string,
      relatedConversationId: conversationId
    });
  }

  return { success: true };
}

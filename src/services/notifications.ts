import { supabase } from "@/lib/supabase";

export type NotificationType = "message" | "offer_created" | "offer_accepted" | "offer_declined" | "listing_published" | "deal_created" | "deal_updated" | "safety";

export type AppNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedListingId: string | null;
  relatedConversationId: string | null;
  relatedOfferId: string | null;
  relatedDealId: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationFilter = "all" | "messages" | "offers" | "listings" | "safety";

type NotificationRow = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  related_listing_id: string | null;
  related_conversation_id: string | null;
  related_offer_id: string | null;
  related_deal_id: string | null;
  is_read: boolean;
  created_at: string;
};

function mapNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    body: row.body,
    relatedListingId: row.related_listing_id,
    relatedConversationId: row.related_conversation_id,
    relatedOfferId: row.related_offer_id,
    relatedDealId: row.related_deal_id,
    isRead: row.is_read,
    createdAt: row.created_at
  };
}

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedListingId?: string | null;
  relatedConversationId?: string | null;
  relatedOfferId?: string | null;
  relatedDealId?: string | null;
}) {
  if (!input.userId) return { success: false };

  const { error } = await supabase.from("notifications").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    related_listing_id: input.relatedListingId ?? null,
    related_conversation_id: input.relatedConversationId ?? null,
    related_offer_id: input.relatedOfferId ?? null,
    related_deal_id: input.relatedDealId ?? null
  });

  return { success: !error };
}

export async function getNotifications(userId: string, filter: NotificationFilter = "all"): Promise<AppNotification[]> {
  let query = supabase.from("notifications").select("id, user_id, type, title, body, related_listing_id, related_conversation_id, related_offer_id, related_deal_id, is_read, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(80);

  if (filter === "messages") query = query.eq("type", "message");
  if (filter === "offers") query = query.in("type", ["offer_created", "offer_accepted", "offer_declined"]);
  if (filter === "listings") query = query.eq("type", "listing_published");
  if (filter === "safety") query = query.eq("type", "safety");

  const { data, error } = await query;
  if (error || !data) throw error ?? new Error("Could not load notifications.");
  return (data as NotificationRow[]).map(mapNotification);
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId).eq("user_id", userId);
  return { success: !error };
}

export async function getUnreadNotificationCount(userId: string) {
  const { count, error } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("is_read", false);
  if (error) return 0;
  return count ?? 0;
}

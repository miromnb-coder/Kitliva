import { supabase } from "@/lib/supabase";

export type ReportType = "listing" | "user" | "conversation";

export async function createReport(input: {
  reporterId: string;
  type: ReportType;
  reason: string;
  details?: string;
  reportedUserId?: string | null;
  listingId?: string | null;
  conversationId?: string | null;
}) {
  if (!input.reporterId) return { success: false, message: "Please sign in to send a report." };
  if (!input.reason.trim()) return { success: false, message: "Please choose a reason." };

  const { error } = await supabase.from("reports").insert({
    reporter_id: input.reporterId,
    type: input.type,
    reason: input.reason.trim(),
    details: input.details?.trim() || null,
    reported_user_id: input.reportedUserId ?? null,
    listing_id: input.listingId ?? null,
    conversation_id: input.conversationId ?? null
  });

  if (error) return { success: false, message: "Could not send report. Try again." };
  return { success: true };
}

export async function blockUser(input: { blockerId: string; blockedUserId: string }) {
  if (!input.blockerId || !input.blockedUserId) return { success: false, message: "Could not block user." };
  if (input.blockerId === input.blockedUserId) return { success: false, message: "You cannot block yourself." };

  const { error } = await supabase.from("blocked_users").upsert({ blocker_id: input.blockerId, blocked_user_id: input.blockedUserId }, { onConflict: "blocker_id,blocked_user_id" });
  if (error) return { success: false, message: "Could not block user. Try again." };
  return { success: true };
}

export async function isUserBlocked(blockerId: string, blockedUserId: string) {
  const { data } = await supabase.from("blocked_users").select("id").eq("blocker_id", blockerId).eq("blocked_user_id", blockedUserId).maybeSingle();
  return Boolean(data?.id);
}

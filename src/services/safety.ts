import { supabase } from "@/lib/supabase";

export type ReportType = "listing" | "user" | "conversation";

export async function createReport(input: {
  reporterId: string;
  type: ReportType;
  reason: string;
  details?: string | null;
  reportedUserId?: string | null;
  listingId?: string | null;
  conversationId?: string | null;
}) {
  if (!input.reporterId) return { success: false, message: "Please sign in before sending a report." };
  if (!input.reason.trim()) return { success: false, message: "Choose a reason before sending." };

  const { error } = await supabase.from("reports").insert({
    reporter_id: input.reporterId,
    type: input.type,
    reason: input.reason,
    details: input.details?.trim() || null,
    reported_user_id: input.reportedUserId ?? null,
    listing_id: input.listingId ?? null,
    conversation_id: input.conversationId ?? null,
    status: "open"
  });

  if (error) return { success: false, message: "Could not send report. Try again." };
  return { success: true };
}

export async function blockUser(input: { blockerId: string; blockedUserId: string }) {
  if (!input.blockerId || !input.blockedUserId) return { success: false, message: "Could not block this user." };
  if (input.blockerId === input.blockedUserId) return { success: false, message: "You cannot block yourself." };

  const { error } = await supabase.from("blocked_users").upsert({ blocker_id: input.blockerId, blocked_user_id: input.blockedUserId }, { onConflict: "blocker_id,blocked_user_id" });
  if (error) return { success: false, message: "Could not block this user. Try again." };
  return { success: true };
}

export async function unblockUser(input: { blockerId: string; blockedUserId: string }) {
  const { error } = await supabase.from("blocked_users").delete().eq("blocker_id", input.blockerId).eq("blocked_user_id", input.blockedUserId);
  return { success: !error };
}

export async function getBlockedUsers(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from("blocked_users").select("blocked_user_id").eq("blocker_id", userId);
  if (error || !data) return [];
  return data.map((row) => row.blocked_user_id as string);
}

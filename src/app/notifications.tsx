import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { AppNotification, getNotifications, markNotificationRead, NotificationFilter } from "@/services/notifications";

const filters: { label: string; value: NotificationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Messages", value: "messages" },
  { label: "Offers", value: "offers" },
  { label: "Listings", value: "listings" },
  { label: "Safety", value: "safety" }
];

function getIcon(type: AppNotification["type"]): keyof typeof Ionicons.glyphMap {
  if (type === "message") return "chatbubble-outline";
  if (type === "offer_created") return "pricetag-outline";
  if (type === "offer_accepted") return "checkmark-circle-outline";
  if (type === "offer_declined") return "close-circle-outline";
  if (type === "listing_published") return "bag-handle-outline";
  if (type === "deal_created" || type === "deal_updated") return "briefcase-outline";
  return "shield-checkmark-outline";
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [items, setItems] = useState<AppNotification[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadItems = useCallback(async () => {
    if (!user) return;
    setPageLoading(true);
    setHasError(false);
    const nextItems = await getNotifications(user.id, activeFilter);
    setItems(nextItems);
    setPageLoading(false);
  }, [activeFilter, user]);

  useFocusEffect(useCallback(() => {
    if (!isLoading && !user) {
      router.push("/auth/welcome");
      return;
    }
    loadItems().catch(() => {
      setItems([]);
      setHasError(true);
      setPageLoading(false);
    });
  }, [isLoading, loadItems, router, user]));

  async function openItem(item: AppNotification) {
    if (!user) return;
    if (!item.isRead) await markNotificationRead(item.id, user.id);
    if (item.relatedDealId) router.push(`/deal/${item.relatedDealId}`);
    else if (item.relatedConversationId) router.push(`/conversation/${item.relatedConversationId}`);
    else if (item.relatedListingId) router.push(`/listing/${item.relatedListingId}`);
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Updates about your listings, offers and messages.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const selected = activeFilter === filter.value;
            return <Pressable key={filter.value} style={[styles.filterChip, selected && styles.selectedChip]} onPress={() => setActiveFilter(filter.value)}><Text style={[styles.filterText, selected && styles.selectedText]}>{filter.label}</Text></Pressable>;
          })}
        </ScrollView>
        {pageLoading ? (
          <EmptyStateCard icon="notifications-outline" title="Loading notifications..." body="Important updates will appear here in a moment." />
        ) : hasError ? (
          <EmptyStateCard icon="refresh-outline" title="Could not load notifications" body="Please try again in a moment." primaryLabel="Retry" onPrimaryPress={loadItems} />
        ) : items.length === 0 ? (
          <EmptyStateCard icon="notifications-outline" title="No notifications yet" body="Important updates about listings, offers and messages will appear here." primaryLabel="Go to messages" onPrimaryPress={() => router.push("/inbox")} />
        ) : (
          <View style={styles.list}>{items.map((item) => <NotificationRow key={item.id} item={item} onPress={() => openItem(item)} />)}</View>
        )}
      </ScrollView>
    </Screen>
  );
}

function NotificationRow({ item, onPress }: { item: AppNotification; onPress: () => void }) {
  return <Pressable style={styles.notificationCard} onPress={onPress}><View style={styles.iconCircle}><Ionicons name={getIcon(item.type)} size={20} color={colors.primary} /></View><View style={styles.notificationTextWrap}><View style={styles.notificationTopRow}><Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text><Text style={styles.timeText}>{formatTime(item.createdAt)}</Text></View><Text style={styles.notificationBody} numberOfLines={2}>{item.body}</Text></View>{!item.isRead ? <View style={styles.unreadDot} /> : null}</Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  roundButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  filterRow: { flexDirection: "row", gap: 8, marginTop: 20, marginBottom: 16, paddingRight: 2 },
  filterChip: { height: 36, justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  selectedChip: { backgroundColor: "#171717", borderColor: "#171717" },
  filterText: { color: colors.muted, fontSize: 12.5, fontWeight: "600" },
  selectedText: { color: colors.surface },
  list: { gap: 10 },
  notificationCard: { minHeight: 78, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  iconCircle: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: "#F7F2EB", marginRight: 12 },
  notificationTextWrap: { flex: 1 },
  notificationTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  notificationTitle: { flex: 1, color: colors.text, fontSize: 14.5, fontWeight: "700" },
  notificationBody: { marginTop: 4, color: colors.muted, fontSize: 12.5, lineHeight: 17 },
  timeText: { color: colors.muted, fontSize: 11.5, fontWeight: "500" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#A77C3A", marginLeft: 10 }
});

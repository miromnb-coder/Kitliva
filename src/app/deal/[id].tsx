import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { Deal, getDealById, updateDealStatus } from "@/services/deals";
import { formatPrice } from "@/utils/formatPrice";

function getStatusLabel(status: Deal["status"]) {
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Agreed";
}

export default function DealDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadDeal = useCallback(async () => {
    if (!id) return;
    setPageLoading(true);
    const nextDeal = await getDealById(id);
    setDeal(nextDeal);
    setPageLoading(false);
  }, [id]);

  useFocusEffect(useCallback(() => {
    if (!isLoading && !user) {
      router.push("/auth/welcome");
      return;
    }
    loadDeal().catch(() => {
      setDeal(null);
      setPageLoading(false);
    });
  }, [isLoading, loadDeal, router, user]));

  async function changeStatus(status: "completed" | "cancelled") {
    if (!user || !deal) return;
    const result = await updateDealStatus({ dealId: deal.id, userId: user.id, status });
    if (!result.success) setMessage(result.message ?? "Could not update deal.");
    else {
      setDeal(result.deal);
      setMessage(status === "completed" ? "Deal marked as completed." : "Deal cancelled.");
    }
  }

  if (isLoading || pageLoading) return <Screen noPadding><View style={styles.screen} /></Screen>;

  if (!deal) {
    return <Screen noPadding><View style={styles.centerScreen}><Text style={styles.notFoundTitle}>Deal unavailable</Text><Text style={styles.notFoundText}>This deal may have been removed or you may not have access.</Text><Pressable style={styles.primaryButton} onPress={() => router.back()}><Text style={styles.primaryButtonText}>Go back</Text></Pressable></View></Screen>;
  }

  const isBuyer = user?.id === deal.buyerId;

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={styles.title}>Deal details</Text>
        <Text style={styles.subtitle}>Coordinate pickup or delivery safely.</Text>

        <View style={styles.statusCard}>
          <View style={styles.badge}><Text style={styles.badgeText}>{getStatusLabel(deal.status)}</Text></View>
          <Text style={styles.statusTitle}>{deal.status === "agreed" ? "Deal agreed" : getStatusLabel(deal.status)}</Text>
          <Text style={styles.statusBody}>You and the {isBuyer ? "seller" : "buyer"} agreed on the price. Keep details and handoff plans in Kitliva chat.</Text>
        </View>

        <Pressable style={styles.listingCard} onPress={() => router.push(`/listing/${deal.listingId}`)}>
          {deal.listingImageUrl ? <Image source={{ uri: deal.listingImageUrl }} style={styles.listingImage} contentFit="cover" /> : <View style={styles.listingPlaceholder}><Ionicons name="image-outline" size={22} color={colors.primary} /></View>}
          <View style={styles.listingText}><Text style={styles.listingTitle} numberOfLines={2}>{deal.listingTitle}</Text><Text style={styles.listingMeta}>Agreed price</Text><Text style={styles.listingPrice}>{formatPrice(deal.agreedPriceAmount, deal.currency)}</Text></View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>

        <View style={styles.detailsCard}>
          <DetailRow label="Agreed price" value={formatPrice(deal.agreedPriceAmount, deal.currency)} />
          <DetailRow label="Status" value={getStatusLabel(deal.status)} />
          <DetailRow label="Role" value={isBuyer ? "Buyer" : "Seller"} />
          <DetailRow label="Created" value={new Date(deal.createdAt).toLocaleDateString()} />
        </View>

        <View style={styles.nextCard}>
          <Text style={styles.cardTitle}>Next steps</Text>
          <Step text="Agree on pickup or delivery in chat." />
          <Step text="Check the item before completing the deal." />
          <Step text="Keep the conversation on Kitliva." />
        </View>

        <View style={styles.safetyCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={styles.safetyText}>Meet in a safe public place when possible. No payment is handled by Kitliva yet.</Text>
        </View>

        {message ? <View style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></View> : null}

        <Pressable style={styles.primaryAction} onPress={() => router.push(`/conversation/${deal.conversationId}`)}><Text style={styles.primaryActionText}>{isBuyer ? "Message seller" : "Message buyer"}</Text></Pressable>
        {deal.status === "agreed" ? <Pressable style={styles.secondaryAction} onPress={() => changeStatus("completed")}><Text style={styles.secondaryActionText}>Mark as completed</Text></Pressable> : null}
        {deal.status === "agreed" ? <Pressable style={styles.dangerAction} onPress={() => Alert.alert("Cancel deal", "Are you sure you want to cancel this deal?", [{ text: "Keep deal", style: "cancel" }, { text: "Cancel deal", style: "destructive", onPress: () => changeStatus("cancelled") }])}><Text style={styles.dangerActionText}>Cancel deal</Text></Pressable> : null}
      </ScrollView>
    </Screen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

function Step({ text }: { text: string }) {
  return <View style={styles.stepRow}><View style={styles.stepDot} /><Text style={styles.stepText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  roundButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  statusCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginTop: 20 },
  badge: { height: 28, alignSelf: "flex-start", justifyContent: "center", borderRadius: 14, backgroundColor: "#F7F2EB", paddingHorizontal: 11 },
  badgeText: { color: "#7B623C", fontSize: 12, fontWeight: "700" },
  statusTitle: { marginTop: 12, color: colors.text, fontSize: 20, fontWeight: "700" },
  statusBody: { marginTop: 6, color: colors.muted, fontSize: 13, lineHeight: 18 },
  listingCard: { flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginTop: 14 },
  listingImage: { width: 76, height: 76, borderRadius: 14, marginRight: 13 },
  listingPlaceholder: { width: 76, height: 76, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#F7F2EB", marginRight: 13 },
  listingText: { flex: 1 },
  listingTitle: { color: colors.text, fontSize: 15, fontWeight: "700", lineHeight: 19 },
  listingMeta: { marginTop: 6, color: colors.muted, fontSize: 12 },
  listingPrice: { marginTop: 2, color: colors.text, fontSize: 18, fontWeight: "700" },
  detailsCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14, marginTop: 14 },
  detailRow: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { color: colors.muted, fontSize: 13, fontWeight: "500" },
  detailValue: { color: colors.text, fontSize: 13.5, fontWeight: "700" },
  nextCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginTop: 14 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  stepRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  stepDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#A77C3A", marginRight: 10 },
  stepText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 18 },
  safetyCard: { minHeight: 54, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", padding: 13, marginTop: 14 },
  safetyText: { flex: 1, marginLeft: 10, color: "#5F655F", fontSize: 12.5, lineHeight: 17, fontWeight: "500" },
  messageCard: { minHeight: 40, justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", paddingHorizontal: 12, marginTop: 14 },
  messageText: { color: "#7B623C", fontSize: 12.5, fontWeight: "700" },
  primaryAction: { height: 52, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: "#171717", marginTop: 16 },
  primaryActionText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
  secondaryAction: { height: 50, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 1, borderColor: colors.text, backgroundColor: colors.surface, marginTop: 10 },
  secondaryActionText: { color: colors.text, fontSize: 14, fontWeight: "700" },
  dangerAction: { height: 46, alignItems: "center", justifyContent: "center", borderRadius: 13, marginTop: 8 },
  dangerActionText: { color: "#8A4B2A", fontSize: 14, fontWeight: "700" },
  centerScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  notFoundTitle: { color: colors.text, fontSize: 21, fontWeight: "700" },
  notFoundText: { marginTop: 8, color: colors.muted, fontSize: 13, textAlign: "center", lineHeight: 18 },
  primaryButton: { height: 44, justifyContent: "center", borderRadius: 22, backgroundColor: "#171717", paddingHorizontal: 18, marginTop: 14 },
  primaryButtonText: { color: colors.surface, fontSize: 13, fontWeight: "700" }
});

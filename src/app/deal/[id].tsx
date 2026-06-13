import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { Deal, getDealById, updateDealStatus } from "@/services/deals";
import { formatPrice } from "@/utils/formatPrice";

function getStatusLabel(status: Deal["status"], t: (key: string) => string) {
  if (status === "completed") return t("deal.completed");
  if (status === "cancelled") return t("deal.cancelled");
  return t("deal.agreed");
}

export default function DealDetailScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadDeal = useCallback(async () => {
    if (!id) {
      setDeal(null);
      setPageLoading(false);
      return;
    }

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
    if (!result.success) setMessage(result.message ?? t("deal.updateError"));
    else {
      setDeal(result.deal);
      setMessage(status === "completed" ? t("deal.completedMessage") : t("deal.cancelledMessage"));
    }
  }

  if (isLoading || pageLoading) {
    return <Screen noPadding><View style={styles.centerScreen}><ActivityIndicator color={colors.accent} /><Text style={styles.loadingText}>{t("deal.loading")}</Text></View></Screen>;
  }

  if (!deal) {
    return <Screen noPadding><View style={styles.centerScreen}><Text style={styles.notFoundTitle}>{t("deal.unavailableTitle")}</Text><Text style={styles.notFoundText}>{t("deal.unavailableBody")}</Text><Pressable style={styles.primaryButton} onPress={() => router.back()}><Text style={styles.primaryButtonText}>{t("common.goBack")}</Text></Pressable></View></Screen>;
  }

  const isBuyer = user?.id === deal.buyerId;
  const statusLabel = getStatusLabel(deal.status, t);

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={styles.title}>{t("deal.title")}</Text>
        <Text style={styles.subtitle}>{t("deal.subtitle")}</Text>

        <View style={styles.statusCard}>
          <View style={styles.badge}><Text style={styles.badgeText}>{statusLabel}</Text></View>
          <Text style={styles.statusTitle}>{deal.status === "agreed" ? t("deal.dealAgreed") : statusLabel}</Text>
          <Text style={styles.statusBody}>{isBuyer ? t("deal.statusBodyBuyer") : t("deal.statusBodySeller")}</Text>
        </View>

        <Pressable style={styles.listingCard} onPress={() => router.push(`/listing/${deal.listingId}`)}>
          <DealListingImage imageUrl={deal.listingImageUrl} />
          <View style={styles.listingText}><Text style={styles.listingTitle} numberOfLines={2}>{deal.listingTitle}</Text><Text style={styles.listingMeta}>{t("deal.agreedPrice")}</Text><Text style={styles.listingPrice}>{formatPrice(deal.agreedPriceAmount, deal.currency)}</Text></View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>

        <View style={styles.detailsCard}>
          <DetailRow label={t("deal.agreedPrice")} value={formatPrice(deal.agreedPriceAmount, deal.currency)} />
          <DetailRow label={t("deal.status")} value={statusLabel} />
          <DetailRow label={t("deal.role")} value={isBuyer ? t("deal.buyer") : t("deal.seller")} />
          <DetailRow label={t("deal.created")} value={new Date(deal.createdAt).toLocaleDateString()} />
        </View>

        <View style={styles.nextCard}>
          <Text style={styles.cardTitle}>{t("deal.nextSteps")}</Text>
          <Step text={t("deal.stepPickup")} />
          <Step text={t("deal.stepCheck")} />
          <Step text={t("deal.stepKeepChat")} />
        </View>

        <View style={styles.safetyCard}><Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} /><Text style={styles.safetyText}>{t("deal.safety")}</Text></View>
        {message ? <View style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></View> : null}
        <Pressable style={styles.primaryAction} onPress={() => router.push(`/conversation/${deal.conversationId}`)}><Text style={styles.primaryActionText}>{isBuyer ? t("deal.messageSeller") : t("deal.messageBuyer")}</Text></Pressable>
        {deal.status === "agreed" ? <Pressable style={styles.secondaryAction} onPress={() => changeStatus("completed")}><Text style={styles.secondaryActionText}>{t("deal.markCompleted")}</Text></Pressable> : null}
        {deal.status === "agreed" ? <Pressable style={styles.dangerAction} onPress={() => Alert.alert(t("deal.cancelTitle"), t("deal.cancelBody"), [{ text: t("deal.keepDeal"), style: "cancel" }, { text: t("deal.cancelDeal"), style: "destructive", onPress: () => changeStatus("cancelled") }])}><Text style={styles.dangerActionText}>{t("deal.cancelDeal")}</Text></Pressable> : null}
      </ScrollView>
    </Screen>
  );
}

function DealListingImage({ imageUrl }: { imageUrl: string | null }) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(imageUrl && !imageFailed);
  useEffect(() => { setImageFailed(false); }, [imageUrl]);
  if (shouldShowImage) return <Image source={{ uri: imageUrl ?? undefined }} style={styles.listingImage} contentFit="cover" onError={() => setImageFailed(true)} />;
  return <View style={styles.listingPlaceholder}><Ionicons name="image-outline" size={22} color={colors.primary} /></View>;
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
  subtitle: { marginTop: 6, color: colors.mutedStrong, fontSize: 14.5, lineHeight: 21 },
  statusCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginTop: 20 },
  badge: { height: 28, alignSelf: "flex-start", justifyContent: "center", borderRadius: 14, backgroundColor: colors.softGold, paddingHorizontal: 11 },
  badgeText: { color: colors.link, fontSize: 12, fontWeight: "700" },
  statusTitle: { marginTop: 12, color: colors.text, fontSize: 20, fontWeight: "700" },
  statusBody: { marginTop: 6, color: colors.muted, fontSize: 13, lineHeight: 18 },
  listingCard: { flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginTop: 14 },
  listingImage: { width: 76, height: 76, borderRadius: 14, marginRight: 13 },
  listingPlaceholder: { width: 76, height: 76, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: colors.softGold, marginRight: 13 },
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
  stepDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.accent, marginRight: 10 },
  stepText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 18 },
  safetyCard: { minHeight: 54, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.softGold, padding: 13, marginTop: 14 },
  safetyText: { flex: 1, marginLeft: 10, color: colors.mutedStrong, fontSize: 12.5, lineHeight: 17, fontWeight: "500" },
  messageCard: { minHeight: 40, justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.softGold, paddingHorizontal: 12, marginTop: 14 },
  messageText: { color: colors.link, fontSize: 12.5, fontWeight: "700" },
  primaryAction: { height: 52, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.buttonPrimary, marginTop: 16 },
  primaryActionText: { color: colors.buttonPrimaryText, fontSize: 15, fontWeight: "700" },
  secondaryAction: { height: 50, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 1, borderColor: colors.text, backgroundColor: colors.surface, marginTop: 10 },
  secondaryActionText: { color: colors.text, fontSize: 14, fontWeight: "700" },
  dangerAction: { height: 46, alignItems: "center", justifyContent: "center", borderRadius: 13, marginTop: 8 },
  dangerActionText: { color: colors.dangerText, fontSize: 14, fontWeight: "700" },
  centerScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  loadingText: { marginTop: 10, color: colors.mutedStrong, fontSize: 13, fontWeight: "600" },
  notFoundTitle: { color: colors.text, fontSize: 21, fontWeight: "700" },
  notFoundText: { marginTop: 8, color: colors.muted, fontSize: 13, textAlign: "center", lineHeight: 18 },
  primaryButton: { height: 44, justifyContent: "center", borderRadius: 22, backgroundColor: colors.buttonPrimary, paddingHorizontal: 18, marginTop: 14 },
  primaryButtonText: { color: colors.buttonPrimaryText, fontSize: 13, fontWeight: "700" }
});

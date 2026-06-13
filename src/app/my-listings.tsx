import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { getMyListings, updateOwnListingStatus } from "@/services/myListings";
import { Listing, ListingStatus } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

const statuses: { labelKey: string; value: ListingStatus }[] = [
  { labelKey: "myListings.active", value: "active" },
  { labelKey: "myListings.drafts", value: "draft" },
  { labelKey: "myListings.sold", value: "sold" },
  { labelKey: "myListings.archived", value: "archived" }
];

export default function MyListingsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { isLoading, user } = useAuth();
  const [status, setStatus] = useState<ListingStatus>("active");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const loadListings = useCallback(async () => {
    if (!user) return;
    setLoadingListings(true);
    const nextListings = await getMyListings(user.id, status);
    setListings(nextListings);
    setLoadingListings(false);
  }, [status, user]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
        return;
      }

      loadListings().catch(() => {
        setListings([]);
        setLoadingListings(false);
      });
    }, [isLoading, loadListings, router, user])
  );

  async function markSold(listingId: string) {
    if (!user) return;
    await updateOwnListingStatus(user.id, listingId, "sold");
    loadListings();
  }

  async function archiveListing(listingId: string) {
    if (!user) return;
    await updateOwnListingStatus(user.id, listingId, "archived");
    loadListings();
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  const statusLabel = t(statuses.find((item) => item.value === status)?.labelKey ?? "myListings.active");

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
          <Pressable style={styles.createButton} onPress={() => router.push("/sell")}><Ionicons name="add" size={18} color={colors.buttonPrimaryText} /><Text style={styles.createButtonText}>{t("myListings.sell")}</Text></Pressable>
        </View>

        <Text style={styles.title}>{t("myListings.title")}</Text>
        <Text style={styles.subtitle}>{t("myListings.subtitle")}</Text>

        <View style={styles.chipRow}>
          {statuses.map((item) => {
            const selected = status === item.value;
            return <Pressable key={item.value} style={[styles.statusChip, selected && styles.selectedStatusChip]} onPress={() => setStatus(item.value)}><Text style={[styles.statusText, selected && styles.selectedStatusText]}>{t(item.labelKey)}</Text></Pressable>;
          })}
        </View>

        {loadingListings ? (
          <EmptyStateCard icon="pricetag-outline" title={t("myListings.loadingTitle")} body={t("myListings.loadingBody")} />
        ) : listings.length === 0 ? (
          <EmptyStateCard icon="pricetag-outline" title={status === "active" ? t("myListings.noActiveTitle") : t("myListings.noStatusTitle", { status: statusLabel })} body={status === "active" ? t("myListings.noActiveBody") : t("myListings.noStatusBody")} primaryLabel={status === "active" ? t("myListings.createListing") : undefined} onPrimaryPress={status === "active" ? () => router.push("/sell") : undefined} secondaryLabel={status === "active" ? t("myListings.sellerTips") : undefined} onSecondaryPress={status === "active" ? () => router.push("/seller-dashboard") : undefined} />
        ) : (
          <View style={styles.list}>{listings.map((listing) => <View key={listing.id} style={styles.card}><MyListingImage imageUrl={listing.imageUrl} /><View style={styles.cardContent}><View style={styles.cardTopRow}><Text style={styles.cardTitle} numberOfLines={1}>{listing.title || t("myListings.untitled")}</Text><View style={styles.badge}><Text style={styles.badgeText}>{statusLabel}</Text></View></View><Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text><Text style={styles.meta} numberOfLines={1}>{listing.sellerLocation}</Text><Text style={styles.meta}>{t("myListings.viewsSaves", { views: listing.viewCount ?? 0, saves: listing.favoriteCount ?? 0 })}</Text><View style={styles.actions}><Pressable style={styles.smallButton} onPress={() => router.push(`/listing/${listing.id}`)}><Text style={styles.smallButtonText}>{t("myListings.view")}</Text></Pressable><Pressable style={styles.smallButton} onPress={() => router.push(`/listing/edit/${listing.id}`)}><Text style={styles.smallButtonText}>{t("myListings.edit")}</Text></Pressable>{status === "active" ? <Pressable style={styles.smallButton} onPress={() => markSold(listing.id)}><Text style={styles.smallButtonText}>{t("myListings.markSold")}</Text></Pressable> : null}{status !== "archived" ? <Pressable style={styles.smallButton} onPress={() => archiveListing(listing.id)}><Text style={styles.smallButtonText}>{t("myListings.archive")}</Text></Pressable> : null}</View></View></View>)}</View>
        )}
      </ScrollView>
    </Screen>
  );
}

function MyListingImage({ imageUrl }: { imageUrl: string | null }) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(imageUrl && !imageFailed);
  useEffect(() => { setImageFailed(false); }, [imageUrl]);
  if (shouldShowImage) return <Image source={{ uri: imageUrl as string }} style={styles.image} contentFit="cover" onError={() => setImageFailed(true)} />;
  return <View style={styles.imagePlaceholder}><Ionicons name="image-outline" size={22} color={colors.primary} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roundButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  createButton: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 21, backgroundColor: colors.buttonPrimary, paddingHorizontal: 16 },
  createButtonText: { color: colors.buttonPrimaryText, fontSize: 13.5, fontWeight: "700" },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: colors.mutedStrong, fontSize: 14.5, lineHeight: 21 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20, marginBottom: 16 },
  statusChip: { height: 36, justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 13 },
  selectedStatusChip: { borderColor: colors.buttonPrimary, backgroundColor: colors.buttonPrimary },
  statusText: { color: colors.muted, fontSize: 12.5, fontWeight: "600" },
  selectedStatusText: { color: colors.buttonPrimaryText },
  list: { gap: 12 },
  card: { flexDirection: "row", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12 },
  image: { width: 92, height: 92, borderRadius: 14, marginRight: 13, backgroundColor: colors.softGold },
  imagePlaceholder: { width: 92, height: 92, alignItems: "center", justifyContent: "center", borderRadius: 14, marginRight: 13, backgroundColor: colors.softGold },
  cardContent: { flex: 1 },
  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { flex: 1, color: colors.text, fontSize: 14.5, fontWeight: "700" },
  badge: { height: 24, justifyContent: "center", borderRadius: 12, backgroundColor: colors.softGold, paddingHorizontal: 9 },
  badgeText: { color: colors.link, fontSize: 10.5, fontWeight: "700" },
  price: { marginTop: 6, color: colors.text, fontSize: 17, fontWeight: "700" },
  meta: { marginTop: 2, color: colors.muted, fontSize: 12, fontWeight: "400" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 10 },
  smallButton: { height: 30, justifyContent: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 10 },
  smallButtonText: { color: colors.text, fontSize: 11.5, fontWeight: "700" }
});

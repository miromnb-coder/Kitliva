import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { getMyListings, updateOwnListingStatus } from "@/services/myListings";
import { Listing, ListingStatus } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

const statuses: { label: string; value: ListingStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Drafts", value: "draft" },
  { label: "Sold", value: "sold" },
  { label: "Archived", value: "archived" }
];

export default function MyListingsScreen() {
  const router = useRouter();
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

  if (isLoading || !user) {
    return <Screen noPadding><View style={styles.screen} /></Screen>;
  }

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>My listings</Text>
          <Pressable style={styles.sellButton} onPress={() => router.push("/sell")}> 
            <Text style={styles.sellButtonText}>Sell</Text>
          </Pressable>
        </View>

        <View style={styles.chipRow}>
          {statuses.map((item) => {
            const selected = status === item.value;
            return (
              <Pressable key={item.value} style={[styles.statusChip, selected && styles.selectedStatusChip]} onPress={() => setStatus(item.value)}>
                <Text style={[styles.statusText, selected && styles.selectedStatusText]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {loadingListings ? (
          <View style={styles.stateCard}><Text style={styles.stateTitle}>Loading listings...</Text></View>
        ) : listings.length === 0 ? (
          <View style={styles.stateCard}>
            <View style={styles.stateIcon}><Ionicons name="pricetag-outline" size={22} color={colors.primary} /></View>
            <Text style={styles.stateTitle}>No {status} listings</Text>
            <Text style={styles.stateBody}>Your items will appear here when they match this status.</Text>
            {status === "active" ? (
              <Pressable style={styles.primaryAction} onPress={() => router.push("/sell")}><Text style={styles.primaryActionText}>Create listing</Text></Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.list}>
            {listings.map((listing) => (
              <View key={listing.id} style={styles.card}>
                {listing.imageUrl ? <Image source={{ uri: listing.imageUrl }} style={styles.image} contentFit="cover" /> : <View style={styles.imagePlaceholder}><Ionicons name="image-outline" size={22} color={colors.primary} /></View>}
                <View style={styles.cardContent}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{listing.title}</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>{status}</Text></View>
                  </View>
                  <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
                  <Text style={styles.meta} numberOfLines={1}>{listing.sellerLocation}</Text>
                  <Text style={styles.meta}>{listing.viewCount ?? 0} views • {listing.favoriteCount ?? 0} saves</Text>
                  <View style={styles.actions}>
                    <Pressable style={styles.smallButton} onPress={() => router.push(`/listing/${listing.id}`)}><Text style={styles.smallButtonText}>View</Text></Pressable>
                    <Pressable style={styles.smallButton} onPress={() => router.push(`/listing/edit/${listing.id}`)}><Text style={styles.smallButtonText}>Edit</Text></Pressable>
                    {status === "active" ? <Pressable style={styles.smallButton} onPress={() => markSold(listing.id)}><Text style={styles.smallButtonText}>Mark sold</Text></Pressable> : null}
                    {status !== "archived" ? <Pressable style={styles.smallButton} onPress={() => archiveListing(listing.id)}><Text style={styles.smallButtonText}>Archive</Text></Pressable> : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 118 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  roundButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  sellButton: { height: 36, justifyContent: "center", borderRadius: 18, backgroundColor: colors.primary, paddingHorizontal: 15 },
  sellButtonText: { color: colors.surface, fontSize: 13, fontWeight: "800" },
  chipRow: { flexDirection: "row", gap: 8, marginBottom: 15 },
  statusChip: { height: 34, justifyContent: "center", borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  selectedStatusChip: { borderColor: colors.primary, backgroundColor: colors.primary },
  statusText: { color: colors.muted, fontSize: 12, fontWeight: "800" },
  selectedStatusText: { color: colors.surface },
  stateCard: { minHeight: 170, alignItems: "center", justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 18 },
  stateIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: colors.mint, marginBottom: 10 },
  stateTitle: { color: colors.text, fontSize: 16, fontWeight: "800", textTransform: "capitalize" },
  stateBody: { marginTop: 5, color: colors.muted, fontSize: 12.5, fontWeight: "500", textAlign: "center" },
  primaryAction: { height: 36, justifyContent: "center", borderRadius: 18, backgroundColor: colors.primary, paddingHorizontal: 16, marginTop: 12 },
  primaryActionText: { color: colors.surface, fontSize: 12.5, fontWeight: "800" },
  list: { gap: 12 },
  card: { flexDirection: "row", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12 },
  image: { width: 86, height: 86, borderRadius: 12, marginRight: 12, backgroundColor: "#EDF2F0" },
  imagePlaceholder: { width: 86, height: 86, alignItems: "center", justifyContent: "center", borderRadius: 12, marginRight: 12, backgroundColor: colors.mint },
  cardContent: { flex: 1 },
  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { flex: 1, color: colors.text, fontSize: 14, fontWeight: "800" },
  badge: { height: 22, justifyContent: "center", borderRadius: 11, backgroundColor: colors.mint, paddingHorizontal: 8 },
  badgeText: { color: colors.primary, fontSize: 10.5, fontWeight: "800", textTransform: "capitalize" },
  price: { marginTop: 5, color: colors.text, fontSize: 16, fontWeight: "800" },
  meta: { marginTop: 2, color: colors.muted, fontSize: 11.5, fontWeight: "500" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 9 },
  smallButton: { height: 30, justifyContent: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 10 },
  smallButtonText: { color: colors.primary, fontSize: 11.5, fontWeight: "800" }
});

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
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.createButton} onPress={() => router.push("/sell")}> 
            <Ionicons name="add" size={18} color={colors.surface} />
            <Text style={styles.createButtonText}>Sell</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>My listings</Text>
        <Text style={styles.subtitle}>Manage the gear you are selling on Kitliva.</Text>

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
            <View style={styles.stateIcon}><Ionicons name="pricetag-outline" size={22} color="#A77C3A" /></View>
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
                  <Text style={styles.meta}>{listing.viewCount ?? 0} views · {listing.favoriteCount ?? 0} saves</Text>
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
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roundButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  createButton: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, borderRadius: 21, backgroundColor: "#171717", paddingHorizontal: 16 },
  createButtonText: { color: colors.surface, fontSize: 13.5, fontWeight: "700" },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20, marginBottom: 16 },
  statusChip: { height: 36, justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 13 },
  selectedStatusChip: { borderColor: "#171717", backgroundColor: "#171717" },
  statusText: { color: colors.muted, fontSize: 12.5, fontWeight: "600" },
  selectedStatusText: { color: colors.surface },
  stateCard: { minHeight: 190, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 20 },
  stateIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: "#F7F2EB", marginBottom: 12 },
  stateTitle: { color: colors.text, fontSize: 17, fontWeight: "700", textTransform: "capitalize" },
  stateBody: { marginTop: 6, color: colors.muted, fontSize: 13, fontWeight: "400", textAlign: "center", lineHeight: 18 },
  primaryAction: { height: 42, justifyContent: "center", borderRadius: 21, backgroundColor: "#171717", paddingHorizontal: 18, marginTop: 14 },
  primaryActionText: { color: colors.surface, fontSize: 13, fontWeight: "700" },
  list: { gap: 12 },
  card: { flexDirection: "row", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12 },
  image: { width: 92, height: 92, borderRadius: 14, marginRight: 13, backgroundColor: "#F7F2EB" },
  imagePlaceholder: { width: 92, height: 92, alignItems: "center", justifyContent: "center", borderRadius: 14, marginRight: 13, backgroundColor: "#F7F2EB" },
  cardContent: { flex: 1 },
  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { flex: 1, color: colors.text, fontSize: 14.5, fontWeight: "700" },
  badge: { height: 24, justifyContent: "center", borderRadius: 12, backgroundColor: "#F7F2EB", paddingHorizontal: 9 },
  badgeText: { color: "#7B623C", fontSize: 10.5, fontWeight: "700", textTransform: "capitalize" },
  price: { marginTop: 6, color: colors.text, fontSize: 17, fontWeight: "700" },
  meta: { marginTop: 2, color: colors.muted, fontSize: 12, fontWeight: "400" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 10 },
  smallButton: { height: 30, justifyContent: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 10 },
  smallButtonText: { color: colors.text, fontSize: 11.5, fontWeight: "700" }
});

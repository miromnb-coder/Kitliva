import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { ProductGrid } from "@/components/home/ProductGrid";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { clearRecentlyViewedListings, getRecentlyViewedListings } from "@/services/recentlyViewed";
import { Listing } from "@/types/listing";

export default function RecentlyViewedScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecentlyViewed = useCallback(async () => {
    setLoading(true);
    const favoriteIds = user ? await getFavoriteListingIds(user.id) : [];
    const nextListings = await getRecentlyViewedListings(favoriteIds);
    setListings(nextListings);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadRecentlyViewed().catch(() => {
        setListings([]);
        setLoading(false);
      });
    }, [loadRecentlyViewed])
  );

  async function clearHistory() {
    await clearRecentlyViewedListings();
    setListings([]);
  }

  async function toggleFavorite(listing: Listing) {
    if (!user) {
      router.push("/auth/welcome");
      return;
    }
    const nextFavoriteState = !listing.isFavorite;
    setListings((current) => current.map((item) => item.id === listing.id ? { ...item, isFavorite: nextFavoriteState } : item));
    const result = await setListingFavorite({ userId: user.id, listingId: listing.id, shouldFavorite: nextFavoriteState });
    if (!result.success) loadRecentlyViewed();
  }

  if (isLoading) return <Screen noPadding><View style={styles.screen} /></Screen>;

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          {listings.length > 0 ? <Pressable style={styles.clearButton} onPress={clearHistory}><Text style={styles.clearText}>Clear</Text></Pressable> : null}
        </View>

        <Text style={styles.title}>Recently viewed</Text>
        <Text style={styles.subtitle}>Gear you opened recently.</Text>

        <View style={styles.countRow}>
          <Text style={styles.countText}>{listings.length} items</Text>
          <View style={styles.sortPill}><Ionicons name="time-outline" size={14} color="#7B623C" /><Text style={styles.sortText}>Latest first</Text></View>
        </View>

        {loading ? (
          <EmptyStateCard icon="time-outline" title="Loading recently viewed..." body="Your recent gear will appear here in a moment." />
        ) : listings.length === 0 ? (
          <EmptyStateCard icon="time-outline" title="No recently viewed gear" body="Items you open will appear here for quick access." primaryLabel="Explore gear" onPrimaryPress={() => router.push("/(tabs)/search")} />
        ) : (
          <ProductGrid listings={listings} onFavoritePress={toggleFavorite} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  clearButton: { height: 38, justifyContent: "center", borderRadius: 19, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  clearText: { color: "#7B623C", fontSize: 12.5, fontWeight: "700" },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  countRow: { height: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 16 },
  countText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  sortPill: { height: 32, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 11, gap: 5 },
  sortText: { color: "#7B623C", fontSize: 12, fontWeight: "700" }
});

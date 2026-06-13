import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ProductGrid } from "@/components/home/ProductGrid";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { clearRecentlyViewedListings as resetRecentlyViewedListings, getRecentlyViewedListings } from "@/services/recentlyViewed";
import { Listing } from "@/types/listing";

export default function RecentlyViewedScreen() {
  const router = useRouter();
  const { t } = useI18n();
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

  async function resetList() {
    await resetRecentlyViewedListings();
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
          <Pressable style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
          {listings.length > 0 ? <Pressable style={styles.clearButton} onPress={resetList}><Text style={styles.clearText}>{t("common.clear")}</Text></Pressable> : null}
        </View>

        <Text style={styles.title}>{t("collection.recentTitle")}</Text>
        <Text style={styles.subtitle}>{t("collection.recentSubtitle")}</Text>

        <View style={styles.countRow}>
          <Text style={styles.countText}>{t("collection.itemCount", { count: listings.length })}</Text>
          <View style={styles.sortPill}><Ionicons name="time-outline" size={14} color={colors.link} /><Text style={styles.sortText}>{t("collection.latestFirst")}</Text></View>
        </View>

        {loading ? (
          <EmptyStateCard icon="time-outline" title={t("collection.loadingRecentTitle")} body={t("collection.loadingRecentBody")} />
        ) : listings.length === 0 ? (
          <EmptyStateCard icon="time-outline" title={t("collection.emptyRecentTitle")} body={t("collection.emptyRecentBody")} primaryLabel={t("messages.exploreGear")} onPrimaryPress={() => router.push("/(tabs)/search")} />
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
  clearText: { color: colors.link, fontSize: 12.5, fontWeight: "700" },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: colors.mutedStrong, fontSize: 14.5, lineHeight: 21 },
  countRow: { height: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 16 },
  countText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  sortPill: { height: 32, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 11, gap: 5 },
  sortText: { color: colors.link, fontSize: 12, fontWeight: "700" }
});

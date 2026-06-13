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
import { setListingFavorite } from "@/services/favorites";
import { getSavedListings } from "@/services/listingCollections";
import { Listing } from "@/types/listing";

export default function SavedItemsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { isLoading, user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadSaved = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setHasError(false);
    const nextListings = await getSavedListings(user.id);
    setListings(nextListings.map((listing) => ({ ...listing, isFavorite: true })));
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
        return;
      }

      loadSaved().catch(() => {
        setListings([]);
        setHasError(true);
        setLoading(false);
      });
    }, [isLoading, loadSaved, router, user])
  );

  async function toggleFavorite(listing: Listing) {
    if (!user) return;
    setListings((current) => current.filter((item) => item.id !== listing.id));
    const result = await setListingFavorite({ userId: user.id, listingId: listing.id, shouldFavorite: false });
    if (!result.success) loadSaved();
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>{t("collection.savedTitle")}</Text>
        <Text style={styles.subtitle}>{t("collection.savedSubtitle")}</Text>

        <View style={styles.countRow}>
          <Text style={styles.countText}>{t("collection.savedCount", { count: listings.length })}</Text>
          <View style={styles.sortPill}><Ionicons name="time-outline" size={14} color={colors.link} /><Text style={styles.sortText}>{t("collection.recent")}</Text></View>
        </View>

        {loading ? (
          <EmptyStateCard icon="heart-outline" title={t("collection.loadingSavedTitle")} body={t("collection.loadingSavedBody")} />
        ) : hasError ? (
          <EmptyStateCard icon="refresh-outline" title={t("collection.savedErrorTitle")} body={t("common.momentError")} primaryLabel={t("common.retry")} onPrimaryPress={loadSaved} />
        ) : listings.length === 0 ? (
          <EmptyStateCard icon="heart-outline" title={t("collection.emptySavedTitle")} body={t("collection.emptySavedBody")} primaryLabel={t("messages.exploreGear")} onPrimaryPress={() => router.push("/(tabs)/search")} />
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
  backButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: colors.mutedStrong, fontSize: 14.5, lineHeight: 21 },
  countRow: { height: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 16 },
  countText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  sortPill: { height: 32, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 11, gap: 5 },
  sortText: { color: colors.link, fontSize: 12, fontWeight: "700" }
});

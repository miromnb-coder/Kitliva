import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductGridSkeleton } from "@/components/marketplace/ProductGridSkeleton";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { getSellerActiveListings, getSellerProfileData, SellerProfileData } from "@/services/profiles";
import { Listing } from "@/types/listing";

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "K";
}

function getTrustLabel(data: SellerProfileData | null) {
  if (data?.profile.is_trusted_seller) return "Trusted seller";
  if (data?.profile.is_verified) return "Verified profile";
  return "New member";
}

export default function SellerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sellerData, setSellerData] = useState<SellerProfileData | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSeller() {
      if (!id) return;
      setIsLoading(true);
      const [nextSellerData, nextListings] = await Promise.all([getSellerProfileData(id), getSellerActiveListings(id)]);

      if (isMounted) {
        setSellerData(nextSellerData);
        setListings(nextListings);
        setIsLoading(false);
      }
    }

    loadSeller().catch(() => {
      if (isMounted) {
        setSellerData(null);
        setListings([]);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <Screen noPadding>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
          </View>
          <Text style={styles.headerTitle}>Seller profile</Text>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonStats} />
          <ProductGridSkeleton />
        </ScrollView>
      </Screen>
    );
  }

  if (!sellerData) {
    return (
      <Screen noPadding>
        <View style={styles.centerScreen}>
          <Text style={styles.notFoundTitle}>Could not load seller</Text>
          <Text style={styles.notFoundText}>Please try again in a moment.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}><Text style={styles.primaryButtonText}>Go back</Text></Pressable>
        </View>
      </Screen>
    );
  }

  const profile = sellerData.profile;
  const sellerName = profile.display_name || "Kitliva seller";
  const location = [profile.location_city, profile.location_country].filter(Boolean).join(", ") || "Location not set";
  const ratingLabel = profile.rating_count > 0 ? profile.rating_average.toFixed(1) : "New";

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        </View>

        <Text style={styles.headerTitle}>Seller profile</Text>
        <Text style={styles.headerSub}>View this seller’s active gear and trust details.</Text>

        <View style={styles.identityCard}>
          {profile.avatar_url ? <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} contentFit="cover" /> : <View style={styles.avatar}><Text style={styles.avatarText}>{getInitial(sellerName)}</Text></View>}
          <View style={styles.identityTextWrap}>
            <Text style={styles.name} numberOfLines={1}>{sellerName}</Text>
            <View style={styles.locationRow}><Ionicons name="location-outline" size={15} color={colors.muted} /><Text style={styles.location} numberOfLines={1}>{location}</Text></View>
            <View style={styles.trustBadge}><Ionicons name="shield-checkmark" size={14} color={colors.primary} /><Text style={styles.trustText}>{getTrustLabel(sellerData)}</Text></View>
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}><Ionicons name="pricetag-outline" size={21} color={colors.text} /><Text style={styles.statValue}>{sellerData.activeListingsCount}</Text><Text style={styles.statLabel}>Active</Text></View>
          <View style={styles.separator} />
          <View style={styles.stat}><Ionicons name="bag-handle-outline" size={21} color={colors.text} /><Text style={styles.statValue}>{sellerData.soldListingsCount}</Text><Text style={styles.statLabel}>Sold</Text></View>
          <View style={styles.separator} />
          <View style={styles.stat}><Ionicons name="star-outline" size={21} color="#A77C3A" /><Text style={styles.statValue}>{ratingLabel}</Text><Text style={styles.statLabel}>Rating</Text></View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active listings</Text>
          <Text style={styles.sectionCount}>{listings.length} items</Text>
        </View>
        {listings.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Ionicons name="pricetag-outline" size={22} color="#A77C3A" /></View>
            <Text style={styles.emptyTitle}>No active listings</Text>
            <Text style={styles.emptyText}>This seller does not have active gear listed right now.</Text>
          </View>
        ) : (
          <ProductGrid listings={listings} />
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
  headerTitle: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  headerSub: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  identityCard: { flexDirection: "row", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginTop: 20, marginBottom: 14 },
  avatar: { width: 76, height: 76, alignItems: "center", justifyContent: "center", borderRadius: 38, backgroundColor: colors.mint, marginRight: 16 },
  avatarImage: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.mint, marginRight: 16 },
  avatarText: { color: colors.primary, fontSize: 27, fontWeight: "700" },
  identityTextWrap: { flex: 1 },
  name: { color: colors.text, fontSize: 20, fontWeight: "700", lineHeight: 24 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 7 },
  location: { flex: 1, marginLeft: 5, color: colors.muted, fontSize: 13, fontWeight: "400" },
  bio: { marginTop: 10, color: colors.text, fontSize: 12.5, fontWeight: "400", lineHeight: 18 },
  trustBadge: { alignSelf: "flex-start", height: 28, flexDirection: "row", alignItems: "center", borderRadius: 14, backgroundColor: "#F7F2EB", paddingHorizontal: 10, gap: 5, marginTop: 9 },
  trustText: { color: colors.primary, fontSize: 12, fontWeight: "700" },
  statsCard: { height: 92, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 20 },
  stat: { flex: 1, alignItems: "center", justifyContent: "center" },
  statValue: { marginTop: 6, color: colors.text, fontSize: 19, fontWeight: "700" },
  statLabel: { marginTop: 2, color: colors.muted, fontSize: 11.5, fontWeight: "400" },
  separator: { width: 1, height: 48, backgroundColor: colors.border },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: "600", letterSpacing: -0.3 },
  sectionCount: { color: colors.muted, fontSize: 12.5, fontWeight: "500", marginBottom: 2 },
  emptyCard: { minHeight: 170, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 20 },
  emptyIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: "#F7F2EB", marginBottom: 12 },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: "700" },
  emptyText: { marginTop: 6, color: colors.muted, fontSize: 13, fontWeight: "400", textAlign: "center", lineHeight: 18 },
  skeletonCard: { height: 150, borderRadius: 18, backgroundColor: colors.surface, marginTop: 20, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  skeletonStats: { height: 92, borderRadius: 16, backgroundColor: colors.surface, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  centerScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  notFoundTitle: { color: colors.text, fontSize: 21, fontWeight: "700" },
  notFoundText: { marginTop: 8, color: colors.muted, fontSize: 13, fontWeight: "400", textAlign: "center" },
  primaryButton: { height: 44, justifyContent: "center", borderRadius: 22, backgroundColor: "#171717", paddingHorizontal: 18, marginTop: 14 },
  primaryButtonText: { color: colors.surface, fontSize: 13, fontWeight: "700" }
});

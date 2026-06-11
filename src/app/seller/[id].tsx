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
            <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="chevron-back" size={22} color={colors.text} /></Pressable>
            <Text style={styles.headerTitle}>Seller profile</Text>
            <View style={styles.headerSpacer} />
          </View>
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
          <Pressable style={styles.roundButton} onPress={() => router.back()}><Ionicons name="chevron-back" size={22} color={colors.text} /></Pressable>
          <Text style={styles.headerTitle}>Seller profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.identityCard}>
          {profile.avatar_url ? <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} contentFit="cover" /> : <View style={styles.avatar}><Text style={styles.avatarText}>{getInitial(sellerName)}</Text></View>}
          <View style={styles.identityTextWrap}>
            <Text style={styles.name}>{sellerName}</Text>
            <Text style={styles.location}>{location}</Text>
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            <View style={styles.trustBadge}><Ionicons name="shield-checkmark-outline" size={13} color={colors.primary} /><Text style={styles.trustText}>{getTrustLabel(sellerData)}</Text></View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}><Text style={styles.statValue}>{sellerData.activeListingsCount}</Text><Text style={styles.statLabel}>Active</Text></View>
          <View style={styles.stat}><Text style={styles.statValue}>{sellerData.soldListingsCount}</Text><Text style={styles.statLabel}>Sold</Text></View>
          <View style={styles.stat}><Text style={styles.statValue}>{ratingLabel}</Text><Text style={styles.statLabel}>Rating</Text></View>
          <View style={styles.stat}><Text style={styles.statValue}>New</Text><Text style={styles.statLabel}>Member</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Active listings</Text>
        {listings.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Ionicons name="leaf-outline" size={22} color={colors.primary} /></View>
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
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 118 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  roundButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: "800" },
  headerSpacer: { width: 36 },
  identityCard: { flexDirection: "row", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginBottom: 12 },
  avatar: { width: 58, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 29, backgroundColor: colors.mint, marginRight: 13 },
  avatarImage: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.mint, marginRight: 13 },
  avatarText: { color: colors.primary, fontSize: 22, fontWeight: "800" },
  identityTextWrap: { flex: 1 },
  name: { color: colors.text, fontSize: 19, fontWeight: "800" },
  location: { marginTop: 3, color: colors.muted, fontSize: 13, fontWeight: "600" },
  bio: { marginTop: 8, color: colors.text, fontSize: 12.5, fontWeight: "500", lineHeight: 18 },
  trustBadge: { alignSelf: "flex-start", height: 26, flexDirection: "row", alignItems: "center", borderRadius: 13, backgroundColor: colors.mint, paddingHorizontal: 9, gap: 5, marginTop: 9 },
  trustText: { color: colors.primary, fontSize: 11.5, fontWeight: "800" },
  statsCard: { height: 78, flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 16 },
  stat: { flex: 1, alignItems: "center" },
  statValue: { color: colors.text, fontSize: 17, fontWeight: "800" },
  statLabel: { marginTop: 3, color: colors.muted, fontSize: 11.5, fontWeight: "600" },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 10 },
  emptyCard: { minHeight: 160, alignItems: "center", justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 18 },
  emptyIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: colors.mint, marginBottom: 10 },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  emptyText: { marginTop: 5, color: colors.muted, fontSize: 12.5, fontWeight: "500", textAlign: "center" },
  skeletonCard: { height: 140, borderRadius: 18, backgroundColor: colors.surface, marginBottom: 12 },
  skeletonStats: { height: 78, borderRadius: 15, backgroundColor: colors.surface, marginBottom: 16 },
  centerScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  notFoundTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  notFoundText: { marginTop: 8, color: colors.muted, fontSize: 13, fontWeight: "500", textAlign: "center" },
  primaryButton: { height: 42, justifyContent: "center", borderRadius: 21, backgroundColor: colors.primary, paddingHorizontal: 16, marginTop: 14 },
  primaryButtonText: { color: colors.surface, fontSize: 13, fontWeight: "800" }
});

import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AiPriceEstimateCard } from "@/components/listing/AiPriceEstimateCard";
import { DeliveryPickupCard } from "@/components/listing/DeliveryPickupCard";
import { ListingActionButtons } from "@/components/listing/ListingActionButtons";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingInfo } from "@/components/listing/ListingInfo";
import { SellerRow } from "@/components/listing/SellerRow";
import { colors } from "@/constants/colors";
import { mockListings } from "@/data/mockListings";
import { useAuth } from "@/hooks/useAuth";

export default function ListingDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = mockListings.find((item) => item.id === id);

  function requireAuth() {
    if (!user) {
      router.push("/auth/welcome");
    }
  }

  if (!listing) {
    return (
      <View style={styles.notFoundScreen}>
        <Text style={styles.notFoundTitle}>Product not found</Text>
        <Text style={styles.notFoundSubtitle}>This listing may have been removed.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ListingHero listing={listing} onFavoritePress={requireAuth} />

        <View style={styles.contentCard}>
          <ListingInfo listing={listing} />
          <SellerRow listing={listing} />
          <AiPriceEstimateCard listing={listing} />
          <ListingDetails listing={listing} />
          <ListingActionButtons onMessage={requireAuth} onOffer={requireAuth} />
          <DeliveryPickupCard listing={listing} />
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  contentCard: {
    marginTop: -18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24
  },
  bottomSpacer: {
    height: 24
  },
  notFoundScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 24
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  notFoundSubtitle: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center"
  }
});

import { useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { getListingById } from "@/services/listings";
import { Listing } from "@/types/listing";

export default function ListingDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadListing() {
      setIsLoading(true);
      const favoriteIds = user ? await getFavoriteListingIds(user.id) : [];
      const nextListing = await getListingById(id, favoriteIds);

      if (isMounted) {
        setListing(nextListing);
        setIsLoading(false);
      }
    }

    if (id) {
      loadListing().catch(() => {
        if (isMounted) {
          setListing(null);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  function requireAuth() {
    if (!user) {
      router.push("/auth/welcome");
      return false;
    }

    return true;
  }

  async function toggleFavorite() {
    if (!listing || !requireAuth() || !user || isFavoriteLoading) {
      return;
    }

    const nextFavoriteState = !listing.isFavorite;
    setListing({ ...listing, isFavorite: nextFavoriteState });
    setIsFavoriteLoading(true);

    const result = await setListingFavorite({ userId: user.id, listingId: listing.id, shouldFavorite: nextFavoriteState });

    setIsFavoriteLoading(false);

    if (!result.success) {
      setListing({ ...listing, isFavorite: listing.isFavorite });
    }
  }

  if (isLoading) {
    return <View style={styles.loadingScreen} />;
  }

  if (!listing) {
    return (
      <View style={styles.notFoundScreen}>
        <Text style={styles.notFoundTitle}>Listing not found</Text>
        <Text style={styles.notFoundSubtitle}>This item may have been sold, removed or archived.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ListingHero listing={listing} onFavoritePress={toggleFavorite} isFavoriteLoading={isFavoriteLoading} />

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
  loadingScreen: {
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
